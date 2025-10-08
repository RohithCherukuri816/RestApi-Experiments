
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// Middleware for parsing JSON request bodies.
app.use(express.json());

// --- Experiment 6: MongoDB Connection ---

// Define the MongoDB connection URI string.
// Use this for a local MongoDB instance.
// Ensure your local MongoDB server is running on port 27017.
const mongoURI = 'mongodb://127.0.0.1:27017/FSD';

// If you are using MongoDB Atlas, replace the URI above with your own connection string.
// const atlasURI = 'mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/mydatabase?retryWrites=true&w=majority';

// Connect to MongoDB using Mongoose.
mongoose.connect(mongoURI)
  .then(() => console.log('Successfully connected to MongoDB.'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Mongoose Connection Event Handlers for debugging.
mongoose.connection.on('error', err => {
  console.error(`MongoDB connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected.');
});

// A simple GET route to confirm the Express server is running.
app.get('/', (req, res) => {
  res.status(200).send('Express server is running and connected to MongoDB.');
});


// --- Experiment 7: Mongoose Schema, Model, and CRUD ---

// Define the schema for a 'Student' document.
// The schema defines the structure, data types, and validation rules.
const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true // Removes whitespace from both ends of the string.
  },
  age: {
    type: Number,
    required: true,
    min: 18,
    max: 99
  },
  major: {
    type: String,
    required: false, // This field is optional.
    default: 'Undecided'
  },
  createdAt: {
    type: Date,
    default: Date.now // Sets a default value to the current date and time.
  }
});

// Create a Mongoose model from the schema.
// 'Student' is the name of our model, which will correspond to a 'students' collection in MongoDB.
const Student = mongoose.model('Student', studentSchema);


// --- REST API Routes for CRUD Operations ---

// POST route to create a new student record.
// Route: POST /api/students
app.post('/api/students', async (req, res) => {
  console.log('POST request received to create a new student.');
  try {
    const newStudent = new Student(req.body);
    const savedStudent = await newStudent.save();
    res.status(201).json(savedStudent); // 201 Created
  } catch (err) {
    // If validation fails (e.g., missing name or invalid age), catch the error.
    res.status(400).json({ error: err.message }); // 400 Bad Request
  }
});

// GET route to retrieve all student records.
// Route: GET /api/students
app.get('/api/students', async (req, res) => {
  console.log('GET request received for all students.');
  try {
    const students = await Student.find();
    res.status(200).json(students); // 200 OK
  } catch (err) {
    res.status(500).json({ error: 'Server error' }); // 500 Internal Server Error
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  console.log('Use Postman to test the /api/students endpoint.');
});
