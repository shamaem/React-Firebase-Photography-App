import React, { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";
import { compressImage } from "../utils/imageCompressor";

const Upload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState("");

  // 1MB limit for Firestore documents (free tier friendly)
  const MAX_FILE_SIZE = 1 * 1024 * 1024;

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Validate file type
    if (!selectedFile.type.match(/image\/(jpeg|png|jpg)/)) {
      setError("Only JPG/PNG images are supported");
      return;
    }

    // Validate file size
    if (selectedFile.size > MAX_FILE_SIZE) {
      setError(`File too large. Max ${MAX_FILE_SIZE / 1024 / 1024}MB`);
      return;
    }

    setError("");
    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(selectedFile);

      // Compress image (maintains quality while reducing size)
      const compressedFile = await compressImage(selectedFile, {
        quality: 0.8,
        maxWidth: 1200,
        maxHeight: 1200,
      });
      setFile(compressedFile);
    } catch (err) {
      console.error("Compression error:", err);
      setError("Failed to process image");
    }
  };

  const handleUpload = async () => {
    if (!auth.currentUser) {
      setError("Please login to upload");
      return;
    }
    if (!file) {
      setError("Please select a file first");
      return;
    }

    setUploading(true);
    setError("");

    try {
      // Convert to Base64 (Firestore compatible)
      const base64Data = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
      });

      // Store in Firestore
      await addDoc(collection(db, "media"), {
        uid: auth.currentUser.uid, // Critical for security rules
        type: "image",
        data: base64Data.split(",")[1], // Remove metadata prefix
        filename: file.name,
        size: file.size,
        createdAt: serverTimestamp(), // Important for sorting
        public: false, // Change to true if you want public visibility
      });

      // Reset after successful upload
      setFile(null);
      setPreview("");
      document.getElementById("file-input").value = "";
      alert("Image uploaded successfully!");
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
        backgroundColor: "#f5f3ff",
        borderRadius: "12px",
      }}
    >
      <h2 style={{ color: "#3c096c", marginBottom: "20px" }}>Upload Image</h2>

      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(92, 2, 191, 0.1)",
        }}
      >
        <div style={{ marginBottom: "20px" }}>
          <input
            id="file-input"
            type="file"
            accept="image/jpeg, image/png"
            onChange={handleFileChange}
            disabled={uploading}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #e0aaff",
              borderRadius: "8px",
            }}
          />
        </div>

        {preview && (
          <div style={{ marginBottom: "20px", textAlign: "center" }}>
            <img
              src={preview}
              alt="Preview"
              style={{
                maxWidth: "100%",
                maxHeight: "300px",
                borderRadius: "8px",
                border: "1px solid #e0aaff",
              }}
            />
            <p style={{ marginTop: "10px", color: "#3c096c" }}>
              {file?.name} ({(file?.size / 1024).toFixed(2)} KB)
            </p>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={uploading || !file}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: uploading ? "#c77dff" : "#5a189a",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: uploading ? "wait" : "pointer",
            fontWeight: "600",
            transition: "background-color 0.3s",
            ":hover": {
              backgroundColor: uploading ? "#c77dff" : "#7b2cbf",
            },
          }}
        >
          {uploading ? "Uploading..." : "Upload Image"}
        </button>

        {error && (
          <p
            style={{
              color: "#e63946",
              marginTop: "10px",
              textAlign: "center",
            }}
          >
            {error}
          </p>
        )}

        <p
          style={{
            marginTop: "15px",
            fontSize: "12px",
            color: "#6c757d",
            textAlign: "center",
          }}
        >
          Max file size: 1MB (Firestore free tier limit)
        </p>
      </div>
    </div>
  );
};

export default Upload;
