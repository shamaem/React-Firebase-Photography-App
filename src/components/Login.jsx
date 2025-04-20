import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      alert("Login failed. Please check your credentials.");
      console.error(err);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "2.5rem",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "400px",
          boxShadow: "0 4px 20px rgba(92, 2, 191, 0.1)",
          border: "1px solid rgba(156, 77, 221, 0.2)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h2
            style={{
              color: "#3c096c",
              fontWeight: "600",
              fontSize: "1.5rem",
              marginBottom: "0.5rem",
            }}
          >
            Welcome Back
          </h2>
          <p style={{ color: "#6c757d", fontSize: "0.9rem" }}>
            Sign in to continue to PhotoVerse
          </p>
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label
            style={{
              display: "block",
              color: "#3c096c",
              marginBottom: "0.5rem",
              fontWeight: "500",
            }}
          >
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: "8px",
              border: "1px solid #dee2e6",
              backgroundColor: "white",
              color: "#495057",
              transition: "border-color 0.2s",
              ":focus": {
                outline: "none",
                borderColor: "#9d4edd",
                boxShadow: "0 0 0 3px rgba(156, 77, 221, 0.1)",
              },
            }}
            placeholder="you@example.com"
          />
        </div>

        <div style={{ marginBottom: "2rem" }}>
          <label
            style={{
              display: "block",
              color: "#3c096c",
              marginBottom: "0.5rem",
              fontWeight: "500",
            }}
          >
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: "8px",
              border: "1px solid #dee2e6",
              backgroundColor: "white",
              color: "#495057",
              transition: "border-color 0.2s",
              ":focus": {
                outline: "none",
                borderColor: "#9d4edd",
                boxShadow: "0 0 0 3px rgba(156, 77, 221, 0.1)",
              },
            }}
            placeholder="••••••••"
          />
        </div>

        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: "0.75rem",
            backgroundColor: "#5a189a",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.2s",
            marginBottom: "1.5rem",
            ":hover": {
              backgroundColor: "#7b2cbf",
            },
          }}
        >
          Log In
        </button>

        <p
          style={{
            textAlign: "center",
            color: "#6c757d",
            fontSize: "0.9rem",
          }}
        >
          Don't have an account?{" "}
          <Link
            to="/signup"
            style={{
              color: "#5a189a",
              fontWeight: "600",
              textDecoration: "none",
              ":hover": {
                textDecoration: "underline",
              },
            }}
          >
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
