// src/components/ProtectedRoute.jsx
import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((state) => state.userReducer
); // from userSlice

  // Agar user login nahi hai
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Agar user login hai
  return children;
};

export default ProtectedRoute;
