const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const productRoutes = require("./routes/products14.js");

const app = express();
app.use(bodyParser.json());

mongoose.connect("mongodb://127.0.0.1:27017/restdb")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.use("/api/products", productRoutes);

app.listen(3000, () => console.log("Server running at http://localhost:3000"));
