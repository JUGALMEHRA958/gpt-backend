const express = require("express");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();

//routes path

const authRoutes = require("./routes/authRoute");
const errorHandler = require("./middlewares/errorMiddleware");

app.use("/api/v1/auth", authRoutes);
app.use(errorHandler);
mongoose.connect(process.env.dburl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

// Event listeners to check for successful connection and error
db.on("connected", () => {
  console.log("Connected to MongoDB successfully!");
});

db.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

const port = process.env.PORT;

app.listen(port, () => {
  console.log("Server running on port", port);
});
