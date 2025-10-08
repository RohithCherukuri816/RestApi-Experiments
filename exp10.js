// app.js
// Express.js application demonstrating Mongoose schema validation.

const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = 3000;

// Middleware to parse JSON bodies.
app.use(express.json());

// --- MongoDB Connection ---
const mongoURI = "mongodb://127.0.0.1:27017/my_school_db";

mongoose
  .connect(mongoURI)
  .then(() => console.log("Successfully connected to MongoDB."))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// --- Mongoose Schema and Model with Validation ---
const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Student name is required."],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required."],
    unique: true,
    trim: true,
    lowercase: true,
    // Regex to validate email format
    match: [
      /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
      "Please enter a valid email address.",
    ],
  },
  age: {
    type: Number,
    required: [true, "Student age is required."],
    min: [18, "Age must be at least 18."],
    max: [99, "Age cannot be more than 99."],
  },
  major: {
    type: String,
    required: false,
    default: "Undecided",
  },
});

const Student = mongoose.model("Student", studentSchema);

// --- REST API Routes with Error Handling ---

// CREATE: POST /api/students
app.post("/api/students", async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    const savedStudent = await newStudent.save();
    res.status(201).json(savedStudent);
  } catch (err) {
    if (err.name === "ValidationError") {
      let errors = {};
      Object.keys(err.errors).forEach((key) => {
        errors[key] = err.errors[key].message;
      });
      return res.status(400).json({ errors }); // 400 Bad Request
    }
    if (err.code === 11000) {
      return res.status(400).json({ error: "Email address already in use." }); // 400 Bad Request (for unique field)
    }
    res.status(500).json({ error: "An unexpected server error occurred." });
  }
});

// READ All, READ One, UPDATE, DELETE routes remain the same as previous experiment
// as they are already set up to handle validation and invalid IDs.

// READ: GET /api/students
app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ error: "Server error retrieving students." });
  }
});

// READ: GET /api/students/:id
app.get("/api/students/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }
    res.status(200).json(student);
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ error: "Invalid ID format." });
    }
    res.status(500).json({ error: "Server error retrieving student." });
  }
});

// UPDATE: PUT /api/students/:id
app.put("/api/students/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }
    res.status(200).json(student);
  } catch (err) {
    if (err.name === "ValidationError") {
      let errors = {};
      Object.keys(err.errors).forEach((key) => {
        errors[key] = err.errors[key].message;
      });
      return res.status(400).json({ errors });
    }
    if (err.name === "CastError") {
      return res.status(400).json({ error: "Invalid ID format." });
    }
    res.status(500).json({ error: "Server error updating student." });
  }
});

// DELETE: DELETE /api/students/:id
app.delete("/api/students/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }
    res.status(200).json({ message: "Student deleted successfully." });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ error: "Invalid ID format." });
    }
    res.status(500).json({ error: "Server error deleting student." });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
