const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

require("dotenv").config();

// Connect MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// ⭐ Make uploads folder public
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Routes
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/employees", require("./routes/employee.routes"));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
