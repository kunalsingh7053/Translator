import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  // read both users and initialized from store
  const { users, initialized } = useSelector((state) => state.userReducer);

  // debug
  // eslint-disable-next-line no-console

  // still waiting for profile fetch to complete
  if (!initialized) return null; // or a spinner while we restore session

  // no user -> redirect
  if (!users) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute; 