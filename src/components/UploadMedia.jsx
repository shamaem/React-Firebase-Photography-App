import React, { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, storage, db } from "../firebase";
import { compressImage } from "../utils/imageCompressor"; // You'll need to implement this

const UploadMedia = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [fileType, setFileType] = useState("");

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Validate file type
    if (!selectedFile.type.match(/image\/.*|video\/.*/)) {
      setError("Please upload only images or videos");
      return;
    }

    // Validate file size (e.g., 10MB max for images, 100MB for videos)
    const maxSize = selectedFile.type.startsWith("image")
      ? 10 * 1024 * 1024
      : 100 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      setError(
        `File too large. Max ${
          selectedFile.type.startsWith("image") ? "10MB" : "100MB"
        }`
      );
      return;
    }

    setError("");
    setFileType(selectedFile.type.split("/")[0]);

    try {
      // Compress images before upload (skip for videos)
      const processedFile = selectedFile.type.startsWith("image")
        ? await compressImage(selectedFile, {
            quality: 0.8,
            maxWidth: 1920,
            maxHeight: 1080,
          })
        : selectedFile;

      setFile(processedFile);
    } catch (err) {
      console.error("Error processing file:", err);
      setError("Error processing file");
    }
  };

  const handleUpload = async () => {
    if (!auth.currentUser) {
      setError("Please login to upload media");
      return;
    }
    if (!file) {
      setError("Please select a file first");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const storagePath = `media/${auth.currentUser.uid}/${Date.now()}_${
        file.name
      }`;
      const storageRef = ref(storage, storagePath);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(Math.round(progress));
        },
        (error) => {
          console.error("Upload error:", error);
          setError("Upload failed. Please try again.");
          setUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          await addDoc(collection(db, "media"), {
            uid: auth.currentUser.uid,
            url: downloadURL,
            type: fileType,
            fileName: file.name,
            size: file.size,
            createdAt: serverTimestamp(),
          });

          setUploading(false);
          setProgress(0);
          setFile(null);
          // Reset file input
          document.getElementById("file-input").value = "";
        }
      );
    } catch (err) {
      console.error("Error:", err);
      setError(err.message || "Upload failed");
      setUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h2 style={{ color: "#3c096c", marginBottom: "20px" }}>Upload Media</h2>

      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(92, 2, 191, 0.1)",
        }}
      >
        <div style={{ marginBottom: "20px" }}>
          <input
            id="file-input"
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            disabled={uploading}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #e0aaff",
              borderRadius: "5px",
            }}
          />
        </div>

        {file && (
          <div style={{ marginBottom: "20px" }}>
            <p>
              <strong>Selected file:</strong> {file.name}
            </p>
            <p>
              <strong>Type:</strong> {fileType === "image" ? "Image" : "Video"}
            </p>
            <p>
              <strong>Size:</strong> {(file.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          </div>
        )}

        {uploading && (
          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                width: "100%",
                backgroundColor: "#f3e9ff",
                borderRadius: "5px",
                height: "10px",
                marginBottom: "5px",
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  backgroundColor: "#5a189a",
                  height: "100%",
                  borderRadius: "5px",
                  transition: "width 0.3s",
                }}
              ></div>
            </div>
            <p style={{ textAlign: "center", color: "#5a189a" }}>
              Uploading: {progress}%
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
            borderRadius: "5px",
            cursor: uploading ? "wait" : "pointer",
            fontWeight: "600",
            transition: "background-color 0.3s",
            ":hover": {
              backgroundColor: uploading ? "#c77dff" : "#7b2cbf",
            },
          }}
        >
          {uploading ? "Uploading..." : "Upload Media"}
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
      </div>
    </div>
  );
};

export default UploadMedia;
