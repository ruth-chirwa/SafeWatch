const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const incidentController = require("../controllers/incidentController");

router.get("/", incidentController.getAllIncidents);
router.get("/:id", incidentController.getIncident);
router.post("/", auth, incidentController.createIncident);
router.put("/:id", auth, incidentController.updateIncident);
router.patch("/:id/status", auth, incidentController.updateIncidentStatus);
router.delete("/:id", auth, incidentController.deleteIncident);

module.exports = router;