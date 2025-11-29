import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";

export default function EditEmployeePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");
  const [salary, setSalary] = useState("");
  const [dateOfJoining, setDateOfJoining] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [existingImage, setExistingImage] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // ---- Load existing employee ----
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await axiosClient.get(`/employees/${id}`);
        const emp = res.data;

        setFirstName(emp.first_name || "");
        setLastName(emp.last_name || "");
        setEmail(emp.email || "");
        setDepartment(emp.department || "");
        setPosition(emp.position || "");
        setSalary(emp.salary || "");
        setDateOfJoining(
          emp.date_of_joining
            ? new Date(emp.date_of_joining).toISOString().slice(0, 10)
            : ""
        );
        setExistingImage(emp.profile_image || "");
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message || "Failed to load employee data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  const getImageUrl = () => {
    if (!existingImage) return null;
    if (existingImage.startsWith("/uploads")) {
      return `http://localhost:3000${existingImage}`;
    }
    return `http://localhost:3000/uploads/${existingImage}`;
  };

  // ---- Handle update ----
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("first_name", firstName);
      formData.append("last_name", lastName);
      formData.append("email", email);
      formData.append("department", department);
      formData.append("position", position);
      formData.append("salary", salary);
      formData.append("date_of_joining", dateOfJoining);

      if (profileImage) {
        formData.append("profile_image", profileImage); // only send if new file
      }

      await axiosClient.put(`/employees/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/employees");
    } catch (err) {
      console.error("Update employee error:", err);
      setError(
        err.response?.data?.message || "Failed to update employee."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="container mt-4">Loading...</div>;
  }

  if (error && !saving) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">{error}</div>
        <button className="btn btn-secondary" onClick={() => navigate("/employees")}>
          Back to List
        </button>
      </div>
    );
  }

  const imgUrl = getImageUrl();

  return (
    <div className="container mt-4" style={{ maxWidth: "600px" }}>
      <h2 className="mb-4">Update Employee</h2>

      {error && !saving && <div className="alert alert-danger">{error}</div>}

      {imgUrl && (
        <div className="mb-3 text-center">
          <img
            src={imgUrl}
            alt="Current profile"
            className="img-fluid rounded"
            style={{ maxHeight: "180px", objectFit: "cover" }}
          />
          <p className="text-muted mt-1">Current profile picture</p>
        </div>
      )}

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
          <label className="form-label">
            New Profile Image (optional – leave empty to keep current)
          </label>
          <input
            className="form-control"
            type="file"
            accept="image/*"
            onChange={(e) => setProfileImage(e.target.files[0])}
          />
        </div>

        <button
          className="btn btn-primary w-100"
          disabled={saving}
          type="submit"
        >
          {saving ? "Updating..." : "Update Employee"}
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
