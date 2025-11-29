import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";

export default function ViewEmployeePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axiosClient.get(`/employees/${id}`);
        setEmployee(res.data);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message || "Failed to load employee details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  const getImageUrl = () => {
    if (!employee?.profile_image) return null;

    // if backend already returns "/uploads/filename.jpg"
    if (employee.profile_image.startsWith("/uploads")) {
      return `http://localhost:3000${employee.profile_image}`;
    }
    // if backend returns just filename
    return `http://localhost:3000/uploads/${employee.profile_image}`;
  };

  if (loading) return <div className="container mt-4">Loading...</div>;

  if (error)
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">{error}</div>
        <button className="btn btn-secondary" onClick={() => navigate("/employees")}>
          Back to List
        </button>
      </div>
    );

  if (!employee) return null;

  const imgUrl = getImageUrl();

  return (
    <div className="container mt-4" style={{ maxWidth: "700px" }}>
      <h2 className="mb-4">View Employee Details</h2>

      <div className="card p-3">
        <div className="row g-3">
          {imgUrl && (
            <div className="col-md-4 d-flex justify-content-center align-items-start">
              <img
                src={imgUrl}
                alt="Profile"
                className="img-fluid rounded"
                style={{ maxHeight: "200px", objectFit: "cover" }}
              />
            </div>
          )}

          <div className={imgUrl ? "col-md-8" : "col-12"}>
            <p>
              <strong>First Name:</strong> {employee.first_name}
            </p>
            <p>
              <strong>Last Name:</strong> {employee.last_name}
            </p>
            <p>
              <strong>Email:</strong> {employee.email}
            </p>
            <p>
              <strong>Department:</strong> {employee.department}
            </p>
            <p>
              <strong>Position:</strong> {employee.position}
            </p>
            <p>
              <strong>Salary:</strong> {employee.salary}
            </p>
            <p>
              <strong>Date of Joining:</strong>{" "}
              {employee.date_of_joining
                ? new Date(employee.date_of_joining).toLocaleDateString()
                : ""}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-3 d-flex gap-2">
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/employees")}
        >
          Back to List
        </button>
        <button
          className="btn btn-warning"
          onClick={() => navigate(`/employees/${employee._id}/edit`)}
        >
          Edit
        </button>
      </div>
    </div>
  );
}
