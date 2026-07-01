import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function ReportIncident() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "", description: "", category: "theft",
    severity: "medium", latitude: "", longitude: "",
    location_name: "", is_anonymous: false
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post("https://safewatch-production-9ec1.up.railway.app/api/incidents", form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Could not submit report.");
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>📢 Report an Incident</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input style={styles.input} type="text" name="title"
            placeholder="Incident Title" value={form.title} onChange={handleChange} required />
          <textarea style={styles.textarea} name="description"
            placeholder="Describe what happened..." value={form.description} onChange={handleChange} required />
          <select style={styles.input} name="category" value={form.category} onChange={handleChange}>
            <option value="theft">Theft</option>
            <option value="harassment">Harassment</option>
            <option value="vandalism">Vandalism</option>
            <option value="suspicious_activity">Suspicious Activity</option>
            <option value="poor_lighting">Poor Lighting</option>
            <option value="other">Other</option>
          </select>
          <select style={styles.input} name="severity" value={form.severity} onChange={handleChange}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <input style={styles.input} type="text" name="location_name"
            placeholder="Location Name e.g. City Centre, Blantyre" value={form.location_name} onChange={handleChange} />
          <div style={styles.row}>
            <input style={styles.halfInput} type="number" name="latitude" step="any"
  placeholder="Latitude e.g. -13.9626" value={form.latitude} onChange={handleChange} required />
<input style={styles.halfInput} type="number" name="longitude" step="any"
  placeholder="Longitude e.g. 33.7741" value={form.longitude} onChange={handleChange} required />
          </div>
          <label style={styles.checkbox}>
            <input type="checkbox" name="is_anonymous" checked={form.is_anonymous} onChange={handleChange} />
            &nbsp; Report anonymously
          </label>
          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Report"}
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
  textarea: { width: "100%", padding: "12px", marginBottom: "16px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "15px", boxSizing: "border-box", height: "100px" },
  row: { display: "flex", gap: "12px" },
  halfInput: { flex: 1, padding: "12px", marginBottom: "16px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "15px", boxSizing: "border-box" },
  checkbox: { display: "block", marginBottom: "16px", fontSize: "15px", color: "#444" },
  button: { width: "100%", padding: "12px", backgroundColor: "#1A5276", color: "white", border: "none", borderRadius: "8px", fontSize: "16px", cursor: "pointer" },
  error: { color: "#E74C3C", textAlign: "center", marginBottom: "16px" }
};

export default ReportIncident;