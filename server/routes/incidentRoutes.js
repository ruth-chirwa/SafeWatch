const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  createIncident,
  getAllIncidents,
  getIncident,
  updateIncident,
  deleteIncident
} = require("../controllers/incidentController");
const incidentController = require("../controllers/incidentController");


router.get("/", getAllIncidents);
router.get("/:id", getIncident);
router.post("/", auth, createIncident);
router.put("/:id", auth, updateIncident);
router.patch("/:id/status", auth, incidentController.updateIncidentStatus);
router.delete("/:id", auth, deleteIncident);

module.exports = router;