const Employee = require("../models/Employee");

// ---------------------------------------------------------------------
// LIST ALL EMPLOYEES
// GET /api/v1/emp/employees
// ---------------------------------------------------------------------
exports.list = async (req, res) => {
  try {
    const employees = await Employee.find();
    return res.status(200).json(employees);
  } catch (err) {
    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

// ---------------------------------------------------------------------
// CREATE EMPLOYEE (with optional profile_image)
// POST /api/v1/emp/employees
// Body validated already by validate middleware
// ---------------------------------------------------------------------
// ---------------------------------------------------------------------
// CREATE EMPLOYEE (with optional profile_image)
// POST /api/v1/emp/employees
// ---------------------------------------------------------------------
exports.create = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      position,
      salary,
      date_of_joining,
      department,
    } = req.body;

    // 🔍 simple validation
    if (
      !first_name ||
      !last_name ||
      !email ||
      !position ||
      !salary ||
      !date_of_joining ||
      !department
    ) {
      return res.status(400).json({
        status: false,
        message: 'Validation failed',
        errors: ['All fields are required'],
      });
    }

    const data = {
      first_name,
      last_name,
      email,
      position,
      salary,
      date_of_joining,
      department,
    };

    // if file uploaded, store its path
    if (req.file) {
      data.profile_image = `/uploads/${req.file.filename}`;
    }

    const emp = await Employee.create(data);

    return res.status(201).json({
      message: 'Employee created successfully.',
      employee_id: emp._id,
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Server error',
      error: err.message,
    });
  }
};


// ---------------------------------------------------------------------
// GET EMPLOYEE BY ID
// GET /api/v1/emp/employees/:eid
// ---------------------------------------------------------------------
exports.getById = async (req, res) => {
  try {
    const { eid } = req.params;
    const emp = await Employee.findById(eid);

    if (!emp) {
      return res.status(404).json({ message: "Employee not found." });
    }

    return res.status(200).json(emp);
  } catch (err) {
    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

// ---------------------------------------------------------------------
// UPDATE EMPLOYEE (with optional new profile_image)
// PUT /api/v1/emp/employees/:eid
// ---------------------------------------------------------------------
exports.update = async (req, res) => {
  try {
    const { eid } = req.params;
    const data = req.body;

    if (req.file) {
      data.profile_image = `/uploads/${req.file.filename}`;
    }

    const updated = await Employee.findByIdAndUpdate(eid, data, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Employee not found." });
    }

    return res
      .status(200)
      .json({ message: "Employee details updated successfully." });
  } catch (err) {
    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

// ---------------------------------------------------------------------
// DELETE EMPLOYEE
// DELETE /api/v1/emp/employees?eid=xxx
// Status: 204 (no content)
// ---------------------------------------------------------------------
exports.remove = async (req, res) => {
  try {
    const { eid } = req.query;

    if (!eid) {
      return res
        .status(400)
        .json({ message: "Employee id (eid) query param is required." });
    }

    const deleted = await Employee.findByIdAndDelete(eid);
    if (!deleted) {
      return res.status(404).json({ message: "Employee not found." });
    }

    // as per assignment: 204, no body
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

// ---------------------------------------------------------------------
// SEARCH EMPLOYEES BY DEPARTMENT/POSITION
// GET /api/v1/emp/employees/search?department=IT&position=Manager
// ---------------------------------------------------------------------
exports.searchEmployees = async (req, res) => {
  try {
    const { department, position } = req.query;

    const filter = {};
    if (department) filter.department = department;
    if (position) filter.position = position;

    const employees = await Employee.find(filter);
    return res.status(200).json(employees);
  } catch (err) {
    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};
