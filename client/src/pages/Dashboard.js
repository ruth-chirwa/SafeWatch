import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useAuth } from "../context/AuthContext";

const severityColor = { low: "#27AE60", medium: "#F39C12", high: "#E74C3C" };
const categoryEmoji = {
  theft: "🔓", harassment: "⚠️", vandalism: "🪨",
  suspicious_activity: "👀", poor_lighting: "💡", other: "📌"
};

function Dashboard() {
  const { user, token } = useAuth();
  const [incidents, setIncidents] = useState([]);
  const [bulletins, setBulletins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [updating, setUpdating] = useState(null);

  const isOfficer = user && (user.role === "safety_officer" || user.role === "admin");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [incRes, bulRes] = await Promise.all([
        axios.get("/api/incidents"),
        axios.get("/api/bulletins")
      ]);
      setIncidents(incRes.data);
      setBulletins(bulRes.data);
    } catch (err) {
      console.error("Failed to fetch data", err);
    }
    setLoading(false);
  };

  const handleStatusUpdate = async (id, status) => {
    setUpdating(id);
    try {
      await axios.patch(`/api/incidents/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Update locally without refetching
      setIncidents(prev =>
        prev.map(inc => inc.id === id ? { ...inc, status } : inc)
      );
    } catch (err) {
      alert(err.response?.data?.message || "Could not update status.");
    }
    setUpdating(null);
  };

  const filtered = filter === "all" ? incidents : incidents.filter(i => i.severity === filter);

  if (loading) return <p style={{ textAlign: "center", padding: "60px", fontSize: "18px" }}>Loading dashboard...</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🗺️ Community Safety Dashboard</h2>

      {/* STATS BAR */}
      <div style={styles.statsBar}>
        <div style={styles.stat}>
          <span style={styles.statNum}>{incidents.length}</span>
          <span style={styles.statLabel}>Total Incidents</span>
        </div>
        <div style={styles.stat}>
          <span style={{ ...styles.statNum, color: "#E74C3C" }}>
            {incidents.filter(i => i.severity === "high").length}
          </span>
          <span style={styles.statLabel}>High Severity</span>
        </div>
        <div style={styles.stat}>
          <span style={{ ...styles.statNum, color: "#F39C12" }}>
            {incidents.filter(i => i.status === "pending").length}
          </span>
          <span style={styles.statLabel}>Pending Review</span>
        </div>
        <div style={styles.stat}>
          <span style={{ ...styles.statNum, color: "#27AE60" }}>
            {incidents.filter(i => i.status === "verified").length}
          </span>
          <span style={styles.statLabel}>Verified</span>
        </div>
        <div style={styles.stat}>
          <span style={{ ...styles.statNum, color: "#1A5276" }}>
            {bulletins.length}
          </span>
          <span style={styles.statLabel}>Active Bulletins</span>
        </div>
      </div>

      {/* MAP */}
      <div style={styles.mapWrapper}>
        <MapContainer center={[-13.9626, 33.7741]} zoom={13} style={{ height: "420px", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          {incidents.map((inc) => (
            <CircleMarker
              key={inc.id}
              center={[inc.latitude, inc.longitude]}
              radius={inc.severity === "high" ? 14 : inc.severity === "medium" ? 10 : 7}
              fillColor={severityColor[inc.severity]}
              color={severityColor[inc.severity]}
              fillOpacity={0.7}
            >
              <Popup>
                <strong>{categoryEmoji[inc.category]} {inc.title}</strong><br />
                <span style={{ color: severityColor[inc.severity] }}>● {inc.severity} severity</span><br />
                📍 {inc.location_name}<br />
                <small>{inc.description}</small><br />
                <small style={{ color: "#999" }}>{new Date(inc.created_at).toLocaleDateString()}</small>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
        <div style={styles.legend}>
          <span style={styles.legendItem}><span style={{ color: "#E74C3C" }}>●</span> High</span>
          <span style={styles.legendItem}><span style={{ color: "#F39C12" }}>●</span> Medium</span>
          <span style={styles.legendItem}><span style={{ color: "#27AE60" }}>●</span> Low</span>
        </div>
      </div>

      {/* FILTER */}
      <div style={styles.filterBar}>
        <span style={styles.filterLabel}>Filter by severity:</span>
        {["all", "high", "medium", "low"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              ...styles.filterBtn,
              backgroundColor: filter === f ? "#1A5276" : "#ddd",
              color: filter === f ? "white" : "#333"
            }}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div style={styles.columns}>
        {/* INCIDENTS */}
        <div style={styles.section}>
          <h3 style={styles.subheading}>📋 Recent Incidents ({filtered.length})</h3>
          {filtered.length === 0 && <p style={{ color: "#999" }}>No incidents match this filter.</p>}
          {filtered.map((inc) => (
            <div key={inc.id} style={{ ...styles.card, borderLeft: `4px solid ${severityColor[inc.severity]}` }}>
              <div style={styles.cardHeader}>
                <strong>{categoryEmoji[inc.category]} {inc.title}</strong>
                <span style={{
                  ...styles.badge,
                  backgroundColor: inc.status === "verified" ? "#27AE60" : inc.status === "dismissed" ? "#999" : "#F39C12"
                }}>
                  {inc.status}
                </span>
              </div>
              <p style={styles.meta}>📍 {inc.location_name} • {inc.category.replace("_", " ")} • <span style={{ color: severityColor[inc.severity], fontWeight: "bold" }}>{inc.severity}</span></p>
              <p style={styles.desc}>{inc.description}</p>
              <small style={styles.date}>
                {inc.is_anonymous ? "🕵️ Anonymous" : `👤 ${inc.reporter || "citizen"}`} • {new Date(inc.created_at).toLocaleDateString()}
              </small>

              {/* OFFICER CONTROLS */}
              {isOfficer && (
                <div style={styles.officerControls}>
                  <span style={styles.officerLabel}>🔐 Officer Actions:</span>
                  <button
                    onClick={() => handleStatusUpdate(inc.id, "verified")}
                    disabled={inc.status === "verified" || updating === inc.id}
                    style={{
                      ...styles.verifyBtn,
                      opacity: inc.status === "verified" ? 0.5 : 1
                    }}
                  >
                    {updating === inc.id ? "..." : "✅ Verify"}
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(inc.id, "dismissed")}
                    disabled={inc.status === "dismissed" || updating === inc.id}
                    style={{
                      ...styles.dismissBtn,
                      opacity: inc.status === "dismissed" ? 0.5 : 1
                    }}
                  >
                    {updating === inc.id ? "..." : "❌ Dismiss"}
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(inc.id, "pending")}
                    disabled={inc.status === "pending" || updating === inc.id}
                    style={{
                      ...styles.pendingBtn,
                      opacity: inc.status === "pending" ? 0.5 : 1
                    }}
                  >
                    {updating === inc.id ? "..." : "🔄 Reset"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* BULLETINS */}
        <div style={styles.section}>
          <h3 style={styles.subheading}>📢 Safety Bulletins ({bulletins.length})</h3>
          {bulletins.length === 0 && <p style={{ color: "#999" }}>No bulletins issued yet.</p>}
          {bulletins.map((bul) => (
            <div key={bul.id} style={{ ...styles.card, borderLeft: "4px solid #1A5276" }}>
              <div style={styles.cardHeader}>
                <strong>📢 {bul.title}</strong>
                <span style={{ ...styles.badge, backgroundColor: "#1A5276" }}>Official</span>
              </div>
              <p style={styles.meta}>📍 {bul.area} • by Officer {bul.officer_name}</p>
              <p style={styles.desc}>{bul.message}</p>
              <small style={styles.date}>{new Date(bul.created_at).toLocaleDateString()}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: "32px", fontFamily: "Arial, sans-serif", maxWidth: "1200px", margin: "0 auto" },
  heading: { color: "#1A5276", marginBottom: "24px", fontSize: "26px" },
  statsBar: { display: "flex", gap: "16px", marginBottom: "24px", flexWrap: "wrap" },
  stat: { backgroundColor: "white", padding: "20px 28px", borderRadius: "10px", textAlign: "center", flex: 1, minWidth: "120px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
  statNum: { display: "block", fontSize: "32px", fontWeight: "bold", color: "#27AE60" },
  statLabel: { fontSize: "13px", color: "#666" },
  mapWrapper: { borderRadius: "12px", overflow: "hidden", marginBottom: "16px", boxShadow: "0 2px 12px rgba(0,0,0,0.15)" },
  legend: { backgroundColor: "white", padding: "10px 16px", display: "flex", gap: "20px", fontSize: "14px" },
  legendItem: { display: "flex", alignItems: "center", gap: "6px" },
  filterBar: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px", flexWrap: "wrap" },
  filterLabel: { fontSize: "14px", color: "#555", fontWeight: "bold" },
  filterBtn: { padding: "8px 16px", borderRadius: "20px", border: "none", cursor: "pointer", fontSize: "13px" },
  columns: { display: "flex", gap: "24px", flexWrap: "wrap" },
  section: { flex: 1, minWidth: "300px" },
  subheading: { color: "#1A5276", marginBottom: "16px" },
  card: { backgroundColor: "white", padding: "16px", borderRadius: "8px", marginBottom: "12px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" },
  badge: { color: "white", fontSize: "11px", padding: "3px 10px", borderRadius: "12px", textTransform: "uppercase" },
  meta: { color: "#666", fontSize: "13px", margin: "4px 0" },
  desc: { fontSize: "14px", color: "#333", margin: "8px 0" },
  date: { color: "#999", fontSize: "12px" },
  officerControls: { marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #eee", display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" },
  officerLabel: { fontSize: "12px", color: "#888", marginRight: "4px" },
  verifyBtn: { backgroundColor: "#27AE60", color: "white", border: "none", padding: "6px 14px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" },
  dismissBtn: { backgroundColor: "#E74C3C", color: "white", border: "none", padding: "6px 14px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" },
  pendingBtn: { backgroundColor: "#F39C12", color: "white", border: "none", padding: "6px 14px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" }
};

export default Dashboard;