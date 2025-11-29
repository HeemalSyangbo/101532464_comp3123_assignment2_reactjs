import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";

export default function AddEmployeePage() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");
  const [salary, setSalary] = useState("");
  const [dateOfJoining, setDateOfJoining] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Use FormData because image upload
      const formData = new FormData();
      formData.append("first_name", firstName);
      formData.append("last_name", lastName);
      formData.append("email", email);
      formData.append("department", department);
      formData.append("position", position);
      formData.append("salary", salary);
      formData.append("date_of_joining", dateOfJoining);

      if (profileImage) {
        formData.append("profile_image", profileImage);
      }

      await axiosClient.post("/employees", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Redirect to employees list
      navigate("/employees");

    } catch (err) {
      console.error("Add employee error:", err);
      setError(err.response?.data?.message || "Failed to add employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: "600px" }}>
      <h2 className="mb-4">Add Employee</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">First Name</label>
          <input
            className="form-control"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Last Name</label>
          <input
            className="form-control"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            className="form-control"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Department</label>
          <input
            className="form-control"
            required
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Position</label>
          <input
            className="form-control"
            required
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Salary</label>
          <input
            className="form-control"
            type="number"
            required
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Date of Joining</label>
          <input
            className="form-control"
            type="date"
            required
            value={dateOfJoining}
            onChange={(e) => setDateOfJoining(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Profile Image (optional)</label>
          <input
            className="form-control"
            type="file"
            accept="image/*"
            onChange={(e) => setProfileImage(e.target.files[0])}
          />
        </div>

        <button
          className="btn btn-success w-100"
          disabled={loading}
          type="submit"
        >
          {loading ? "Saving..." : "Save Employee"}
        </button>

        <button
          className="btn btn-secondary w-100 mt-2"
          type="button"
          onClick={() => navigate("/employees")}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
