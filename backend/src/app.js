// src/app.js
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());                 // <== ADD THIS
app.use(express.json());

const userRoutes = require("./routes/user.routes");
const employeeRoutes = require("./routes/employee.routes");

// serve uploaded images
app.use("/uploads", express.static("uploads"));  // <== for profile pics

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/emp", employeeRoutes);

module.exports = app;
