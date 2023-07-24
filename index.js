const express = require("express");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();
const openairoutes = require("./routes/openaiRoutes").router;
const cors = require("cors");

//routes path

const authRoutes = require("./routes/authRoute");
const errorHandler = require("./middlewares/errorMiddleware");
app.use(cors());
app.use(express.json());

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/auth", authRoutes);
app.use(errorHandler);
app.use("/api/v1/openai", openairoutes);
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
