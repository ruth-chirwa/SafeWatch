import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function CreateBulletin() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", message: "", area: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if not a safety officer or admin
  if (!user || (user.role !== "safety_officer" && user.role !== "admin")) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.title}>⛔ Access Denied</h2>
          <p style={{ textAlign: "center", color: "#666" }}>
            Only safety officers and admins can issue bulletins.
          </p>
        </div>
      </div>
    );
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post("/api/bulletins", form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Could not publish bulletin.");
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>📢 Issue a Safety Bulletin</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            type="text"
            name="title"
            placeholder="Bulletin Title e.g. High Alert - City Centre"
            value={form.title}
            onChange={handleChange}
            required
          />
          <input
            style={styles.input}
            type="text"
            name="area"
            placeholder="Area e.g. City Centre, Blantyre"
            value={form.area}
            onChange={handleChange}
            required
          />
          <textarea
            style={styles.textarea}
            name="message"
            placeholder="Write your safety bulletin message here..."
            value={form.message}
            onChange={handleChange}
            required
          />
          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? "Publishing..." : "Publish Bulletin"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: { display: "flex", justifyContent: "center", padding: "40px 20px", backgroundColor: "#f0f4f8", minHeight: "80vh" },
  card: { backgroundColor: "white", padding: "40px", borderRadius: "12px", width: "100%", maxWidth: "560px", boxShadow: "0 4px 16px rgba(0,0,0,0.1)" },
  title: { textAlign: "center", color: "#1A5276", marginBottom: "24px" },
  input: { width: "100%", padding: "12px", marginBottom: "16px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "15px", boxSizing: "border-box" },
  textarea: { width: "100%", padding: "12px", marginBottom: "16px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "15px", boxSizing: "border-box", height: "140px" },
  button: { width: "100%", padding: "12px", backgroundColor: "#1A5276", color: "white", border: "none", borderRadius: "8px", fontSize: "16px", cursor: "pointer" },
  error: { color: "#E74C3C", textAlign: "center", marginBottom: "16px" }
};

export default CreateBulletin;