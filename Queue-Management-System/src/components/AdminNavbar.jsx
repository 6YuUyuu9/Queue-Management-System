import React from "react";
import { NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const AdminNavbar = () => {
  return (
    <div
      className="bg-light border-end p-3"
      style={{ width: "220px", height: "100vh", position: "fixed" }}
    >
      <h5 className="text-center mb-4">Admin</h5>

      <ul className="nav flex-column">

        <li className="nav-item mb-2">
          <NavLink to="/admin" className="nav-link">
            Home
          </NavLink>
        </li>

        <li className="nav-item mb-2">
          <NavLink to="/admin/dashboard" className="nav-link">
            Dashboard
          </NavLink>
        </li>

      </ul>
    </div>
  );
};

export default AdminNavbar;