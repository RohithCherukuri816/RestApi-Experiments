const express = require("express");
const multer = require("multer");
const rateLimit = require("express-rate-limit");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// Create uploads folder if not exists
if (!fs.existsSync("./uploads")) {
  fs.mkdirSync("./uploads");
}

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Rate Limiter: max 5 requests per minute
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  message: { error: "Too many requests, please try again later" }
});

// Upload endpoint
router.post("/", limiter, upload.single("file"), (req, res) => {
  res.json({ message: "File uploaded successfully", file: req.file });
});

module.exports = router;
