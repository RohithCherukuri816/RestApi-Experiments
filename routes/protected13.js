const express = require("express");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware13");

const router = express.Router();

// normal protected route
router.get("/profile", authenticateToken, (req, res) => {
  res.json({ message: `Welcome ${req.user.username}`, role: req.user.role });
});

// admin-only route
router.get("/admin", authenticateToken, authorizeRoles("admin"), (req, res) => {
  res.json({ message: "Welcome Admin! You have full access." });
});

module.exports = router;
