import React from "react";
import { Navigate } from "react-router-dom";

const RoleBasedRoute = ({
  adminComponent: AdminComponent,
  clinicComponent: ClinicComponent,
}) => {
  const role = localStorage.getItem("role");
  alert(`User role is: ${role}`);

  if (role === "admin") {
    return <AdminComponent />;
  } else if (role === "clinic") {
    return <ClinicComponent />;
  } else {
    return <Navigate to="/login" />;
  }
};

export default RoleBasedRoute;
