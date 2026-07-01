const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const bulletinController = require("../controllers/bulletinController");

router.get("/", bulletinController.getAllBulletins);
router.get("/:id", bulletinController.getBulletin);
router.post("/", auth, bulletinController.createBulletin);
router.put("/:id", auth, bulletinController.updateBulletin);
router.delete("/:id", auth, bulletinController.deleteBulletin);

module.exports = router;