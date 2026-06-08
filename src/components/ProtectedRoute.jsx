import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  // Check if token exists AND if the role matches
  if (!token || (role && userRole !== role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};