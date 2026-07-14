const db = require("../config/db");

// CREATE bulletin
exports.createBulletin = (req, res) => {
  const { title, message, area } = req.body;
  const issued_by = req.user.id;

  if (req.user.role !== "safety_officer" && req.user.role !== "admin") {
    return res.status(403).json({ message: "Only safety officers can issue bulletins." });
  }

  if (!title || !message || !area) {
    return res.status(400).json({ message: "Please fill in all fields." });
  }

  db.query(
    "INSERT INTO bulletins (title, message, area, issued_by) VALUES (?, ?, ?, ?)",
    [title, message, area, issued_by],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Could not create bulletin.", error: err });
      res.status(201).json({ message: "Bulletin published successfully!", id: result.insertId });
    }
  );
};

// GET all bulletins
exports.getAllBulletins = (req, res) => {
  db.query(
    "SELECT bulletins.*, users.name as officer_name FROM bulletins LEFT JOIN users ON bulletins.issued_by = users.id ORDER BY created_at DESC",
    (err, results) => {
      if (err) return res.status(500).json({ message: "Could not fetch bulletins.", error: err });
      res.json(results);
    }
  );
};

// GET single bulletin
exports.getBulletin = (req, res) => {
  const { id } = req.params;
  db.query(
    "SELECT bulletins.*, users.name as officer_name FROM bulletins LEFT JOIN users ON bulletins.issued_by = users.id WHERE bulletins.id = ?",
    [id],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Could not fetch bulletin.", error: err });
      if (results.length === 0) return res.status(404).json({ message: "Bulletin not found." });
      res.json(results[0]);
    }
  );
};

// UPDATE bulletin
exports.updateBulletin = (req, res) => {
  const { id } = req.params;
  const { title, message, area } = req.body;
  const userId = req.user.id;
  const userRole = req.user.role;

  if (userRole !== "safety_officer" && userRole !== "admin") {
    return res.status(403).json({ message: "Only safety officers can update bulletins." });
  }

  db.query("SELECT * FROM bulletins WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });
    if (results.length === 0) return res.status(404).json({ message: "Bulletin not found." });

    const bulletin = results[0];

    // Only the officer who created it or an admin can update
    if (bulletin.issued_by !== userId && userRole !== "admin") {
      return res.status(403).json({ message: "You can only update your own bulletins." });
    }

    db.query(
      "UPDATE bulletins SET title = ?, message = ?, area = ? WHERE id = ?",
      [title, message, area, id],
      (err, result) => {
        if (err) return res.status(500).json({ message: "Could not update bulletin.", error: err });
        res.json({ message: "Bulletin updated successfully!" });
      }
    );
  });
};

// DELETE bulletin
exports.deleteBulletin = (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role;

  if (userRole !== "safety_officer" && userRole !== "admin") {
    return res.status(403).json({ message: "Only safety officers can delete bulletins." });
  }

  db.query("SELECT * FROM bulletins WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err });
    if (results.length === 0) return res.status(404).json({ message: "Bulletin not found." });

    const bulletin = results[0];

    if (bulletin.issued_by !== userId && userRole !== "admin") {
      return res.status(403).json({ message: "You can only delete your own bulletins." });
    }

    db.query("DELETE FROM bulletins WHERE id = ?", [id], (err, result) => {
      if (err) return res.status(500).json({ message: "Could not delete bulletin.", error: err });
      res.json({ message: "Bulletin deleted successfully!" });
    });
  });
};