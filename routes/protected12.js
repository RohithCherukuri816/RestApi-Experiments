const express = require("express");
const authenticateToken = require("../middleware/authMiddleware12");

const router = express.Router();

router.get("/profile", authenticateToken, (req, res) => {
  res.json({ message: `Welcome ${req.user.username}`, role: req.user.role });
});

module.exports = router;
