const db = require("../config/db");

// CREATE incident
exports.createIncident = (req, res) => {
  const { title, description, category, severity, latitude, longitude, location_name, is_anonymous } = req.body;
  const user_id = is_anonymous ? null : req.user.id;

  if (!title || !description || !category || !latitude || !longitude) {
    return res.status(400).json({ message: "Please fill in all required fields." });
  }

  db.query(
    "INSERT INTO incidents (title, description, category, severity, latitude, longitude, location_name, is_anonymous, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [title, description, category, severity || "medium", latitude, longitude, location_name, is_anonymous || false, user_id],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Could not create incident.", error: err });
      res.status(201).json({ message: "Incident reported successfully!", id: result.insertId });
    }
  );
};

// GET all incidents
exports.getAllIncidents = (req, res) => {
  db.query(
    "SELECT incidents.*, users.name as reporter FROM incidents LEFT JOIN users ON incidents.user_id = users.id ORDER BY created_at DESC",
    (err, results) => {
      if (err) return res.status(500).json({ message: "Could not fetch incidents.", error: err });
      res.json(results);
    }
  );
};

// GET single incident
exports.getIncident = (req, res) => {
  const { id } = req.params;
  db.query(
    "SELECT incidents.*, users.name as reporter FROM incidents LEFT JOIN users ON incidents.user_id = users.id WHERE incidents.id = ?",
    [id],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Could not fetch incident.", error: err });
      if (results.length === 0) return res.status(404).json({ message: "Incident not found." });
      res.json(results[0]);
    }
  );
};

// UPDATE incident status (officers only)
exports.updateIncidentStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (req.user.role !== "safety_officer" && req.user.role !== "admin") {
    return res.status(403).json({ message: "Only safety officers can update incident status." });
  }

  if (!["verified", "dismissed", "pending"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value." });
  }

  db.query(
    "UPDATE incidents SET status = ? WHERE id = ?",
    [status, id],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Could not update status.", error: err });
      if (result.affectedRows === 0) return res.status(404).json({ message: "Incident not found." });
      res.json({ message: `Incident ${status} successfully!` });
    }
  );
};

// DELETE incident
exports.deleteIncident = (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role;

  // First check if incident exists and who owns it
  db.query("SELECT * FROM incidents WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });
    if (results.length === 0) return res.status(404).json({ message: "Incident not found." });

    const incident = results[0];

    // Only owner, safety officer or admin can delete
    if (incident.user_id !== userId && userRole !== "safety_officer" && userRole !== "admin") {
      return res.status(403).json({ message: "You are not authorized to delete this incident." });
    }

    db.query("DELETE FROM incidents WHERE id = ?", [id], (err, result) => {
      if (err) return res.status(500).json({ message: "Could not delete incident.", error: err });
      res.json({ message: "Incident deleted successfully!" });
    });
  });
};