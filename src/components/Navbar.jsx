import React from "react";
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const Navbar = ({ user }) => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav
      style={{
        backgroundColor: "white",
        padding: "1rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 10px rgba(92, 2, 191, 0.1)",
        borderBottom: "1px solid rgba(156, 77, 221, 0.1)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <h1 style={{ fontSize: "1.5rem", margin: 0 }}>
        <Link
          to="/"
          style={{
            textDecoration: "none",
            color: "#3c096c",
            fontWeight: "700",
            letterSpacing: "-0.5px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span>PhotoVerse</span>
          <span style={{ fontSize: "1.2rem" }}>📸</span>
        </Link>
      </h1>

      <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
        <Link to="/" style={linkStyle}>
          Home
        </Link>
        <Link to="/explore" style={linkStyle}>
          Explore
        </Link>

        {user && (
          <>
            <Link to="/upload" style={linkStyle}>
              Upload
            </Link>
            <Link to="/dashboard" style={linkStyle}>
              My Gallery
            </Link>
          </>
        )}

        {!user ? (
          <>
            <Link to="/login" style={linkStyle}>
              Login
            </Link>
            <Link to="/signup" style={signupLinkStyle}>
              Signup
            </Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "#5a189a",
              color: "white",
              padding: "0.5rem 1.25rem",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              transition: "all 0.2s",
              ":hover": {
                backgroundColor: "#7b2cbf",
              },
            }}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

// Link styles
const linkStyle = {
  color: "#3c096c",
  textDecoration: "none",
  fontWeight: "500",
  transition: "all 0.2s",
  ":hover": {
    color: "#9d4edd",
    transform: "translateY(-2px)",
  },
};

// Special style for signup button
const signupLinkStyle = {
  ...linkStyle,
  backgroundColor: "#5a189a",
  color: "white",
  padding: "0.5rem 1rem",
  borderRadius: "8px",
  ":hover": {
    backgroundColor: "#7b2cbf",
    color: "white",
    transform: "translateY(-2px)",
  },
};

export default Navbar;
