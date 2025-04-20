import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthProvider from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Upload from "./components/Upload";
import Explore from "./components/Explore";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div
          style={{
            minHeight: "100vh",
            backgroundColor: "#f5f3ff",
            fontFamily: "'Segoe UI', 'Roboto', 'Oxygen', sans-serif",
          }}
        >
          <Navbar />
          <div style={{ padding: "2rem" }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />{" "}
              {/* Add this */}
              <Route path="/upload" element={<Upload />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/explore" element={<Explore />} />
            </Routes>
          </div>
          <footer
            style={{
              backgroundColor: "#3c096c",
              color: "white",
              padding: "1.5rem",
              textAlign: "center",
              marginTop: "2rem",
            }}
          >
            <p style={{ margin: 0 }}>
              © {new Date().getFullYear()} PhotoVerse. All rights reserved.
            </p>
          </footer>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
