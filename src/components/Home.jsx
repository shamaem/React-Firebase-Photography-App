import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div
      style={{
        backgroundColor: "#3c096c",
        minHeight: "calc(100vh - 80px)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>
        Welcome to PhotoVerse 📸
      </h1>
      <p
        style={{ fontSize: "1.2rem", maxWidth: "600px", marginBottom: "2rem" }}
      >
        A vibrant community for photographers to share and explore creative
        visuals.
      </p>
      <div style={{ display: "flex", gap: "1rem" }}>
        <Link
          to="/explore"
          style={{
            backgroundColor: "#9d4edd",
            color: "white",
            padding: "0.8rem 1.5rem",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "bold",
            transition: "background-color 0.3s",
            ":hover": {
              backgroundColor: "#c77dff",
            },
          }}
        >
          Explore
        </Link>
        <Link
          to="/signup"
          style={{
            backgroundColor: "white",
            color: "#3c096c",
            padding: "0.8rem 1.5rem",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "bold",
            transition: "background-color 0.3s",
            ":hover": {
              backgroundColor: "#e0aaff",
            },
          }}
        >
          Join Now
        </Link>
      </div>
    </div>
  );
};

export default Home;
