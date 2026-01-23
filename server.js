require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const bookingRoutes = require("./routes/bookingRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Initialize Express
const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors({
  origin: [
    "https://hall-3-0.onrender.com",
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:5000"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(require("morgan")("dev")); // Logs requests to the console

// Routes
app.use("/api/booking", bookingRoutes);
app.use("/api/admin", adminRoutes);

// Health Check Endpoint
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Global Error Handler (Optional but recommended)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

