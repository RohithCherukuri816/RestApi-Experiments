// app.js
// A full CRUD REST API for 'Student' resources using Express and Mongoose.

const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies from incoming requests.
app.use(express.json());

// --- MongoDB Connection ---
const mongoURI = 'mongodb://127.0.0.1:27017/my_school_db';

mongoose.connect(mongoURI)
  .then(() => console.log('Successfully connected to MongoDB.'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// --- Mongoose Schema and Model Definition ---
// Define the schema for a 'Student' document.
const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true,
    min: 18
  },
  major: {
    type: String,
    required: false,
    default: 'Undecided'
  }
});

// Create a Mongoose model from the schema.
const Student = mongoose.model('Student', studentSchema);

// --- REST API Routes for CRUD Operations ---

// CREATE: POST /api/students
// Creates a new student document.
app.post('/api/students', async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    const savedStudent = await newStudent.save();
    res.status(201).json(savedStudent); // 201 Created
  } catch (err) {
    res.status(400).json({ error: err.message }); // 400 Bad Request
  }
});

// READ: GET /api/students
// Retrieves all student documents.
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students); // 200 OK
  } catch (err) {
    res.status(500).json({ error: 'Server error' }); // 500 Internal Server Error
  }
});

// READ: GET /api/students/:id
// Retrieves a single student document by ID.
app.get('/api/students/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' }); // 404 Not Found
    }
    res.status(200).json(student); // 200 OK
  } catch (err) {
    res.status(400).json({ error: 'Invalid student ID' }); // 400 Bad Request (for invalid ID format)
  }
});

// UPDATE: PUT /api/students/:id
// Updates a student document by ID.
app.put('/api/students/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' }); // 404 Not Found
    }
    res.status(200).json(student); // 200 OK
  } catch (err) {
    res.status(400).json({ error: err.message }); // 400 Bad Request (for invalid data or ID)
  }
});

// DELETE: DELETE /api/students/:id
// Deletes a student document by ID.
app.delete('/api/students/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' }); // 404 Not Found
    }
    res.status(200).json({ message: 'Student deleted successfully' }); // 200 OK
  } catch (err) {
    res.status(400).json({ error: 'Invalid student ID' }); // 400 Bad Request (for invalid ID format)
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  console.log('API endpoints: /api/students (GET, POST), /api/students/:id (GET, PUT, DELETE)');
});