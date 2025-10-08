// app.js
// A simple Express.js application demonstrating REST API routes.

const express = require("express");
const app = express();
const port = 3000;

// Middleware to parse JSON bodies from incoming requests.
// This is essential for handling POST and PUT requests with a JSON payload.
app.use(express.json());

// A simple in-memory "database" to store our data.
// In a real-world application, this would be a database like MongoDB or PostgreSQL.
let books = [
  { id: 1, title: "The Lord of the Rings", author: "J.R.R. Tolkien" },
  { id: 2, title: "Pride and Prejudice", author: "Jane Austen" },
  { id: 3, title: "To Kill a Mockingbird", author: "Harper Lee" },
];

let nextId =
  books.length > 0 ? Math.max(...books.map((book) => book.id)) + 1 : 1;

// --- GET Routes ---

// GET all books
// Route: GET /api/books
app.get("/api/books", (req, res) => {
  console.log("GET request received for all books.");
  // Return the entire array of books with a 200 OK status.
  res.status(200).json(books);
});

// GET a single book by ID
// Route: GET /api/books/:id
app.get("/api/books/:id", (req, res) => {
  const id = parseInt(req.params.id);
  console.log(`GET request received for book with ID: ${id}`);

  // Find the book in our array.
  const book = books.find((b) => b.id === id);

  if (book) {
    // If the book is found, return it with a 200 OK status.
    res.status(200).json(book);
  } else {
    // If the book is not found, return a 404 Not Found status with a message.
    res.status(404).json({ message: "Book not found" });
  }
});

// --- POST Route ---

// POST a new book
// Route: POST /api/books
app.post("/api/books", (req, res) => {
  console.log("POST request received to add a new book.");
  const newBook = req.body;

  // Basic validation to ensure the required fields are present.
  if (!newBook.title || !newBook.author) {
    // Return a 400 Bad Request if the payload is missing fields.
    return res.status(400).json({ message: "Title and author are required." });
  }

  // Assign a new, unique ID to the new book.
  const bookWithId = {
    id: nextId++,
    title: newBook.title,
    author: newBook.author,
  };

  // Add the new book to our in-memory array.
  books.push(bookWithId);

  // Return the newly created book with a 201 Created status.
  res.status(201).json(bookWithId);
});

// --- PUT Route ---

// PUT (update) an existing book
// Route: PUT /api/books/:id
app.put("/api/books/:id", (req, res) => {
  const id = parseInt(req.params.id);
  console.log(`PUT request received for book with ID: ${id}`);

  // Find the index of the book to update.
  const bookIndex = books.findIndex((b) => b.id === id);

  if (bookIndex !== -1) {
    // If the book is found, update its details.
    const updatedBook = req.body;
    books[bookIndex] = { ...books[bookIndex], ...updatedBook };

    // Return the updated book with a 200 OK status.
    res.status(200).json(books[bookIndex]);
  } else {
    // If the book is not found, return a 404 Not Found status.
    res.status(404).json({ message: "Book not found" });
  }
}); 

// --- DELETE Route ---

// DELETE a book
// Route: DELETE /api/books/:id
app.delete("/api/books/:id", (req, res) => {
  const id = parseInt(req.params.id);
  console.log(`DELETE request received for book with ID: ${id}`);

  // Find the index of the book to delete.
  const bookIndex = books.findIndex((b) => b.id === id);

  if (bookIndex !== -1) {
    // If the book is found, remove it from the array using splice.
    const deletedBook = books.splice(bookIndex, 1);

    // Return the deleted book with a 200 OK status.
    res.status(200).json(deletedBook[0]);
  } else {
    // If the book is not found, return a 404 Not Found status.
    res.status(404).json({ message: "Book not found" });
  }
});

// Start the server and listen on the specified port.
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
