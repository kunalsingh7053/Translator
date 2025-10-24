import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Register from "../pages/Register";
import Login from "../pages/Login";
import About from "../pages/About";
import Bookmark from "../pages/Bookmark";
import History from "../pages/History";
import Profile from "../pages/Profile";
import PageNotFound from "../pages/PageNotFound";
import ProtectedRoute from "../routes/ProtectedRoute";

const Mainroutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* 🔒 Protected Routes */}

        <Route path="/" element={
          <ProtectedRoute>
          <Home />
          </ProtectedRoute>
          } />
        <Route path="/about" element={
                      <ProtectedRoute>
          <About />
          </ProtectedRoute>
          } />
        <Route
          path="/bookmark"
          element={
            <ProtectedRoute>
              <Bookmark />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Not Found */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Mainroutes;
