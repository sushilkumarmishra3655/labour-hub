const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load env variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

/* =========================================
   MIDDLEWARE
========================================= */

// CORS Configuration (safer for production)
app.use(
  cors({
    origin: "http://localhost:5173", // Vite frontend
    credentials: true
  })
);

// Body parser
app.use(express.json());


/* =========================================
   ROUTES
========================================= */

app.get("/", (req, res) => {
  res.send("🚀 Labour Hub API is running...");
});

app.use("/api/auth", require("./routes/authRoutes"));


/* =========================================
   SERVER
========================================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});