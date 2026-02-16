import React, { useContext } from "react";
import { useLocation } from "react-router";
import { AuthContext } from "../Provider/AuthProvider";
import Loading from "../components/Loading";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, role, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    if (role === "student") {
      return <Navigate to="/dashboard/student" replace />;
    } else if (role === "tutor") {
      return <Navigate to="/dashboard/tutor" replace />;
    } else if (role === "admin") {
      return <Navigate to="/dashboard/admin" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
