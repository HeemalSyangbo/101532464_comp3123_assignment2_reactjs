// backend/src/routes/employeeRoutes.js
const express = require("express");
const router = express.Router();
const Employee = require("../models/Employee");
const upload = require("../middlewares/upload");

// 🔹 CREATE EMPLOYEE (with optional profile image)
// POST /api/employees
router.post(
  "/",
  upload.single("profile_image"), // field name from frontend form
  async (req, res) => {
    try {
      const {
        first_name,
        last_name,
        email,
        department,
        position,
        salary,
        date_of_joining,
      } = req.body;

      const profile_image = req.file
        ? `/uploads/${req.file.filename}`
        : null;

      const newEmployee = new Employee({
        first_name,
        last_name,
        email,
        department,
        position,
        salary,
        date_of_joining,
        profile_image,
      });

      const saved = await newEmployee.save();
      res.status(201).json(saved);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error creating employee" });
    }
  }
);

// 🔹 GET ALL EMPLOYEES
// GET /api/employees
router.get("/", async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.json(employees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching employees" });
  }
});

// 🔹 SEARCH EMPLOYEES BY DEPARTMENT/POSITION
// GET /api/employees/search?department=IT&position=Manager
router.get("/search", async (req, res) => {
  try {
    const { department, position } = req.query;
    const filter = {};

    if (department) {
      filter.department = new RegExp(department, "i"); // case-insensitive
    }

    if (position) {
      filter.position = new RegExp(position, "i");
    }

    const employees = await Employee.find(filter).sort({ createdAt: -1 });
    res.json(employees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error searching employees" });
  }
});

// 🔹 GET SINGLE EMPLOYEE BY ID
// GET /api/employees/:id
router.get("/:id", async (req, res) => {
  try {
    const emp = await Employee.findById(req.params.id);
    if (!emp) return res.status(404).json({ message: "Employee not found" });
    res.json(emp);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching employee" });
  }
});

// 🔹 UPDATE EMPLOYEE (with optional new profile image)
// PUT /api/employees/:id
router.put(
  "/:id",
  upload.single("profile_image"), // same field name
  async (req, res) => {
    try {
      const {
        first_name,
        last_name,
        email,
        department,
        position,
        salary,
        date_of_joining,
      } = req.body;

      const updateData = {
        first_name,
        last_name,
        email,
        department,
        position,
        salary,
        date_of_joining,
      };

      // If new image uploaded, update path
      if (req.file) {
        updateData.profile_image = `/uploads/${req.file.filename}`;
      }

      const updated = await Employee.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );

      if (!updated)
        return res.status(404).json({ message: "Employee not found" });

      res.json(updated);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error updating employee" });
    }
  }
);

// 🔹 DELETE EMPLOYEE
// DELETE /api/employees/:id
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Employee.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Employee not found" });
    res.json({ message: "Employee deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting employee" });
  }
});

module.exports = router;
