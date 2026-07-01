import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("/api/auth/login", form);
      login(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🛡️ Login to SafeWatch</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input style={styles.input} type="email" name="email"
            placeholder="Email" value={form.email} onChange={handleChange} required />
          <input style={styles.input} type="password" name="password"
            placeholder="Password" value={form.password} onChange={handleChange} required />
          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p style={styles.footer}>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh", backgroundColor: "#f0f4f8" },
  card: { backgroundColor: "white", padding: "40px", borderRadius: "12px", width: "100%", maxWidth: "400px", boxShadow: "0 4px 16px rgba(0,0,0,0.1)" },
  title: { textAlign: "center", color: "#1A5276", marginBottom: "24px" },
  input: { width: "100%", padding: "12px", marginBottom: "16px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "15px", boxSizing: "border-box" },
  button: { width: "100%", padding: "12px", backgroundColor: "#1A5276", color: "white", border: "none", borderRadius: "8px", fontSize: "16px", cursor: "pointer" },
  error: { color: "#E74C3C", textAlign: "center", marginBottom: "16px" },
  footer: { textAlign: "center", marginTop: "16px", color: "#666" }
};

export default Login;