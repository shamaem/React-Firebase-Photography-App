import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";

const Explore = () => {
  const [publicMedia, setPublicMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPublicMedia = async () => {
      try {
        // Query only public media
        const q = query(collection(db, "media"), where("public", "==", true));

        const snapshot = await getDocs(q);
        const mediaList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Sort by newest first
        mediaList.sort((a, b) => b.createdAt?.toDate() - a.createdAt?.toDate());

        setPublicMedia(mediaList);
      } catch (err) {
        console.error("Error fetching public media:", err);
        setError("Failed to load community gallery");
      } finally {
        setLoading(false);
      }
    };

    fetchPublicMedia();
  }, []);

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "1400px",
        margin: "0 auto",
        minHeight: "80vh",
      }}
    >
      <h2
        style={{
          color: "#3c096c",
          marginBottom: "30px",
          textAlign: "center",
          fontSize: "2rem",
        }}
      >
        Community Gallery
      </h2>

      {error ? (
        <div
          style={{
            backgroundColor: "#ffe6e6",
            color: "#e63946",
            padding: "20px",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          {error}
        </div>
      ) : loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p style={{ color: "#5a189a" }}>Loading community photos...</p>
        </div>
      ) : publicMedia.length === 0 ? (
        <div
          style={{
            backgroundColor: "white",
            padding: "40px",
            borderRadius: "10px",
            textAlign: "center",
            boxShadow: "0 2px 10px rgba(92, 2, 191, 0.1)",
          }}
        >
          <p
            style={{
              color: "#5a189a",
              fontSize: "18px",
              marginBottom: "20px",
            }}
          >
            No public photos yet. Be the first to share!
          </p>
          <Link
            to="/upload"
            style={{
              display: "inline-block",
              padding: "12px 24px",
              backgroundColor: "#5a189a",
              color: "white",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "500",
              transition: "background-color 0.3s",
              ":hover": {
                backgroundColor: "#7b2cbf",
              },
            }}
          >
            Upload Your Photo
          </Link>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "30px",
            padding: "10px",
          }}
        >
          {publicMedia.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 4px 15px rgba(92, 2, 191, 0.1)",
                transition: "all 0.3s ease",
                ":hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 6px 20px rgba(92, 2, 191, 0.15)",
                },
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "300px",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <img
                  src={`data:image/jpeg;base64,${item.data}`}
                  alt={item.filename}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                  }}
                />
              </div>
              <div style={{ padding: "15px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <h4
                    style={{
                      color: "#3c096c",
                      margin: 0,
                      fontSize: "1.1rem",
                      fontWeight: "600",
                    }}
                  >
                    {item.filename.split(".")[0]} {/* Remove file extension */}
                  </h4>
                  <span
                    style={{
                      color: "#6c757d",
                      fontSize: "0.85rem",
                    }}
                  >
                    {new Date(item.createdAt?.toDate()).toLocaleDateString()}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <div
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      backgroundColor: "#e0aaff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#3c096c",
                      fontWeight: "bold",
                      fontSize: "0.9rem",
                    }}
                  >
                    {item.username?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span style={{ color: "#5a189a", fontSize: "0.9rem" }}>
                    {item.username || "Anonymous"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Explore;
