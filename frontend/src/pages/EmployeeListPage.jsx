import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";

export default function EmployeeListPage() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  // search state
  const [dept, setDept]         = useState("");
  const [position, setPosition] = useState("");

  // ---- Load all employees ----
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axiosClient.get("/employees");
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Failed to load employees."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // ---- Search employees ----
  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      const res = await axiosClient.get("/employees/search", {
        params: {
          department: dept || undefined,
          position: position || undefined,
        },
      });

      setEmployees(res.data);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Search failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetSearch = (e) => {
    e.preventDefault();
    setDept("");
    setPosition("");
    fetchEmployees();
  };

  // ---- Delete employee ----
  const handleDelete = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this employee?");
    if (!ok) return;

    try {
      await axiosClient.delete(`/employees/${id}`);
      setEmployees((prev) => prev.filter((emp) => emp._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete employee");
    }
  };

  // ---- Logout ----
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="container mt-4">
      {/* Header row */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Employees List</h2>
        <div>
          <button
            className="btn btn-success me-2"
            onClick={() => navigate("/employees/add")}
          >
            Add Employee
          </button>
          <button className="btn btn-outline-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Search form */}
      <form className="row g-3 mb-4" onSubmit={handleSearch}>
        <div className="col-md-4">
          <label className="form-label">Department</label>
          <input
            className="form-control"
            value={dept}
            onChange={(e) => setDept(e.target.value)}
            placeholder="e.g. IT, HR"
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Position</label>
          <input
            className="form-control"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            placeholder="e.g. Dev, Manager"
          />
        </div>
        <div className="col-md-4 d-flex align-items-end">
          <button type="submit" className="btn btn-primary me-2">
            Search
          </button>
          <button
            className="btn btn-secondary"
            onClick={handleResetSearch}
          >
            Reset
          </button>
        </div>
      </form>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <p>Loading employees...</p>}

      {!loading && employees.length === 0 && !error && (
        <p>No employees found.</p>
      )}

      {/* Employees table */}
      {!loading && employees.length > 0 && (
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Position</th>
                <th>Salary</th>
                <th>Date of Joining</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp._id}>
                  <td>{emp.first_name}</td>
                  <td>{emp.last_name}</td>
                  <td>{emp.email}</td>
                  <td>{emp.department}</td>
                  <td>{emp.position}</td>
                  <td>{emp.salary}</td>
                  <td>
                    {emp.date_of_joining
                      ? new Date(emp.date_of_joining).toLocaleDateString()
                      : ""}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-info me-2"
                      onClick={() => navigate(`/employees/${emp._id}`)}
                    >
                      View
                    </button>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => navigate(`/employees/${emp._id}/edit`)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(emp._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
