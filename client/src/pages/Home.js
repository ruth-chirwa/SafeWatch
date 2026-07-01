import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.title}>🛡️ SafeWatch</h1>
        <p style={styles.subtitle}>
          A community-driven safety platform. Report incidents, stay informed,
          and keep your neighbourhood safe.
        </p>
        <div style={styles.buttons}>
          <Link to="/register" style={styles.primaryBtn}>Get Started</Link>
          <Link to="/dashboard" style={styles.secondaryBtn}>View Map</Link>
        </div>
      </div>
      <div style={styles.features}>
        <div style={styles.card}>🗺️<h3>Live Safety Map</h3><p>See incidents reported in your area in real time.</p></div>
        <div style={styles.card}>📢<h3>Report Incidents</h3><p>Quickly report theft, harassment, or suspicious activity.</p></div>
        <div style={styles.card}>🔔<h3>Safety Bulletins</h3><p>Receive alerts from verified safety officers in your district.</p></div>
      </div>
    </div>
  );
}

const styles = {
  container: { fontFamily: "Arial, sans-serif" },
  hero: {
    backgroundColor: "#1A5276", color: "white", textAlign: "center",
    padding: "80px 20px"
  },
  title: { fontSize: "48px", marginBottom: "16px" },
  subtitle: { fontSize: "18px", maxWidth: "600px", margin: "0 auto 32px" },
  buttons: { display: "flex", justifyContent: "center", gap: "16px" },
  primaryBtn: {
    backgroundColor: "#E74C3C", color: "white", padding: "14px 28px",
    borderRadius: "8px", textDecoration: "none", fontSize: "16px", fontWeight: "bold"
  },
  secondaryBtn: {
    backgroundColor: "transparent", color: "white", padding: "14px 28px",
    borderRadius: "8px", textDecoration: "none", fontSize: "16px",
    border: "2px solid white"
  },
  features: {
    display: "flex", justifyContent: "center", gap: "24px",
    padding: "60px 20px", flexWrap: "wrap"
  },
  card: {
    backgroundColor: "#f8f9fa", borderRadius: "12px", padding: "32px",
    textAlign: "center", width: "260px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
  }
};

export default Home;