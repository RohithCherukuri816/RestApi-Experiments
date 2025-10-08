const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth11");
const protectedRoutes = require("./routes/protected12");

const app = express();
app.use(bodyParser.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/authdb")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use("/api/auth", authRoutes);
app.use("/api", protectedRoutes);

app.listen(3000, () => console.log("Server running at http://localhost:3000"));
