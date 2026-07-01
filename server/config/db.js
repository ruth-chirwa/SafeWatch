const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "safewatch",
  password: "safewatch",
  database: "safewatch"
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.message);
    return;
  }
  console.log("Connected to MySQL database.");
});

module.exports = db;