import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>🛡️ SafeWatch</Link>
      <div style={styles.links}>
        {user ? (
          <>
            <Link to="/dashboard" style={styles.link}>Dashboard</Link>
            <Link to="/report" style={styles.link}>Report Incident</Link>
            {(user.role === "safety_officer" || user.role === "admin") && (
              <Link to="/bulletin" style={styles.link}>Issue Bulletin</Link>
            )}
            <span style={styles.user}>👤 {user.name}</span>
            <button onClick={handleLogout} style={styles.button}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "14px 32px", backgroundColor: "#1A5276", color: "white"
  },
  brand: {
    color: "white", textDecoration: "none", fontSize: "22px", fontWeight: "bold"
  },
  links: { display: "flex", alignItems: "center", gap: "20px" },
  link: { color: "white", textDecoration: "none", fontSize: "15px" },
  user: { color: "#AED6F1", fontSize: "15px" },
  button: {
    backgroundColor: "#E74C3C", color: "white", border: "none",
    padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontSize: "14px"
  }
};

export default Navbar;