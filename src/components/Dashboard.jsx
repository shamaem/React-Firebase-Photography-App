import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMedia = async () => {
      if (!auth.currentUser) {
        setError("Please login to view your media");
        setLoading(false);
        return;
      }

      try {
        // Query only the current user's media
        const q = query(
          collection(db, "media"),
          where("uid", "==", auth.currentUser.uid)
        );

        const snapshot = await getDocs(q);
        const mediaList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Sort by upload date (newest first)
        mediaList.sort((a, b) => b.createdAt?.toDate() - a.createdAt?.toDate());

        setMedia(mediaList);
      } catch (err) {
        console.error("Error fetching media:", err);
        setError("Failed to load your media");
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, []);

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "1200px",
        margin: "0 auto",
        minHeight: "70vh",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <h2 style={{ color: "#3c096c", margin: 0 }}>Your Gallery</h2>
        <Link
          to="/upload"
          style={{
            backgroundColor: "#5a189a",
            color: "white",
            padding: "10px 20px",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "500",
            transition: "background-color 0.3s",
            ":hover": {
              backgroundColor: "#7b2cbf",
            },
          }}
        >
          Upload New
        </Link>
      </div>

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
          <p style={{ color: "#5a189a" }}>Loading your media...</p>
        </div>
      ) : media.length === 0 ? (
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
            style={{ color: "#5a189a", fontSize: "18px", marginBottom: "20px" }}
          >
            Your gallery is empty
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
            }}
          >
            Upload Your First Photo
          </Link>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "25px",
          }}
        >
          {media.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 3px 12px rgba(92, 2, 191, 0.1)",
                transition: "transform 0.3s",
                ":hover": {
                  transform: "translateY(-5px)",
                },
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "250px",
                  overflow: "hidden",
                }}
              >
                <img
                  src={`data:image/jpeg;base64,${item.data}`}
                  alt={item.filename}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
              <div style={{ padding: "15px" }}>
                <h4
                  style={{
                    color: "#3c096c",
                    margin: "0 0 8px 0",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {item.filename}
                </h4>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      color: "#6c757d",
                      fontSize: "13px",
                    }}
                  >
                    {new Date(item.createdAt?.toDate()).toLocaleDateString()}
                  </span>
                  <span
                    style={{
                      backgroundColor: item.public ? "#e0f2fe" : "#f3e8ff",
                      color: item.public ? "#0369a1" : "#7e22ce",
                      padding: "4px 10px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "500",
                    }}
                  >
                    {item.public ? "Public" : "Private"}
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

export default Dashboard;
