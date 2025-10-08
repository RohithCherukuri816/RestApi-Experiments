const express = require("express");
const morgan = require("morgan"); // Import the morgan logging middleware
const app = express();
const port = 3000;

// --- Middleware Section ---

// 1. JSON Body Parsing Middleware
// This middleware parses incoming requests with JSON payloads.
// It populates the `req.body` property with the parsed data.
app.use(express.json());

// 2. Logging Middleware
// The 'dev' format provides a concise, color-coded log of each request.
app.use(morgan("dev"));

// --- Routes Section ---

// GET route to demonstrate logging for a simple request.
app.get("/", (req, res) => {
  // A log of this request will appear in the terminal due to morgan.
  res.status(200).send("Hello, the server is running!");
});

// POST route to demonstrate JSON body parsing.
// The `req.body` object will contain the JSON data sent in the request.
app.post("/api/data", (req, res) => {
  console.log("Received data from POST request: ", req.body);

  // Check if the body contains data.
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: "Request body cannot be empty." });
  }

  // Send a response confirming the received data.
  res.status(200).json({
    message: "Data received successfully!",
    your_data: req.body,
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  console.log("Use POSTMAN to test the /api/data endpoint with a JSON body.");
});
