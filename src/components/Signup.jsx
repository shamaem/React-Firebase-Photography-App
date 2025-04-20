import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!username || !email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      let photoURL = "";
      if (profilePhoto) {
        const storageRef = ref(storage, `profile_photos/${user.uid}`);
        await uploadBytes(storageRef, profilePhoto);
        photoURL = await getDownloadURL(storageRef);
      }

      await setDoc(doc(db, "users", user.uid), {
        username,
        email,
        ...(photoURL && { photoURL }),
        createdAt: new Date(),
      });

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f3ff",
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(92, 2, 191, 0.1)",
          padding: "40px",
          width: "100%",
          maxWidth: "450px",
        }}
      >
        <h2
          style={{
            color: "#3c096c",
            textAlign: "center",
            marginBottom: "30px",
            fontSize: "28px",
            fontWeight: "600",
          }}
        >
          Create Account
        </h2>

        {error && (
          <div
            style={{
              backgroundColor: "#ffe6e6",
              color: "#e63946",
              padding: "10px",
              borderRadius: "6px",
              marginBottom: "20px",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              color: "#3c096c",
              marginBottom: "8px",
              fontWeight: "500",
            }}
          >
            Username
          </label>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 15px",
              borderRadius: "8px",
              border: "1px solid #e0aaff",
              fontSize: "16px",
              transition: "all 0.3s",
              ":focus": {
                outline: "none",
                borderColor: "#9d4edd",
                boxShadow: "0 0 0 3px rgba(156, 77, 221, 0.2)",
              },
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              color: "#3c096c",
              marginBottom: "8px",
              fontWeight: "500",
            }}
          >
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 15px",
              borderRadius: "8px",
              border: "1px solid #e0aaff",
              fontSize: "16px",
              transition: "all 0.3s",
              ":focus": {
                outline: "none",
                borderColor: "#9d4edd",
                boxShadow: "0 0 0 3px rgba(156, 77, 221, 0.2)",
              },
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              color: "#3c096c",
              marginBottom: "8px",
              fontWeight: "500",
            }}
          >
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 15px",
              borderRadius: "8px",
              border: "1px solid #e0aaff",
              fontSize: "16px",
              transition: "all 0.3s",
              ":focus": {
                outline: "none",
                borderColor: "#9d4edd",
                boxShadow: "0 0 0 3px rgba(156, 77, 221, 0.2)",
              },
            }}
          />
        </div>

        <div style={{ marginBottom: "25px" }}>
          <label
            style={{
              display: "block",
              color: "#3c096c",
              marginBottom: "8px",
              fontWeight: "500",
            }}
          >
            Profile Photo (Optional)
          </label>
          <div
            style={{
              border: "1px dashed #e0aaff",
              borderRadius: "8px",
              padding: "15px",
              textAlign: "center",
              backgroundColor: "#faf5ff",
            }}
          >
            <input
              type="file"
              id="profile-photo"
              onChange={(e) => setProfilePhoto(e.target.files[0])}
              style={{ display: "none" }}
            />
            <label
              htmlFor="profile-photo"
              style={{
                display: "inline-block",
                padding: "8px 16px",
                backgroundColor: "#5a189a",
                color: "white",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "500",
                transition: "background-color 0.3s",
                ":hover": {
                  backgroundColor: "#7b2cbf",
                },
              }}
            >
              Choose File
            </label>
            <p
              style={{
                marginTop: "10px",
                color: "#6c757d",
                fontSize: "14px",
              }}
            >
              {profilePhoto ? profilePhoto.name : "No file chosen"}
            </p>
          </div>
        </div>

        <button
          onClick={handleSignup}
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            backgroundColor: "#5a189a",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.3s",
            marginBottom: "20px",
            ":hover": {
              backgroundColor: "#7b2cbf",
            },
            ":disabled": {
              backgroundColor: "#c77dff",
              cursor: "not-allowed",
            },
          }}
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        <p
          style={{
            textAlign: "center",
            color: "#6c757d",
          }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            style={{
              color: "#5a189a",
              fontWeight: "600",
              textDecoration: "none",
              ":hover": {
                textDecoration: "underline",
              },
            }}
          >
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
