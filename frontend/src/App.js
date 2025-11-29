import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import EmployeeListPage from "./pages/EmployeeListPage";
import AddEmployeePage from "./pages/AddEmployeePage";
import EditEmployeePage from "./pages/EditEmployeePage";
import ViewEmployeePage from "./pages/ViewEmployeePage";

function App() {
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected routes */}
        <Route
          path="/employees"
          element={
            isAuthenticated ? <EmployeeListPage /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/employees/add"
          element={
            isAuthenticated ? <AddEmployeePage /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/employees/:id"
          element={
            isAuthenticated ? <ViewEmployeePage /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/employees/:id/edit"
          element={
            isAuthenticated ? <EditEmployeePage /> : <Navigate to="/login" />
          }
        />

        {/* Root redirect */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/employees" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
