import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "./index.css";

import App from "./App.jsx";
import Home from "./components/Home.jsx";
import Recordings from "./components/Recordings.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Toaster position="top-right" reverseOrder={false} />

    <Routes>
      {/* Public Route → Login/Register */}
      <Route path="/" element={<App />} />

      {/* Protected Routes */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route
        path="/recordings"
        element={
          <ProtectedRoute>
            <Recordings />
          </ProtectedRoute>
        }
      />

      {/* Catch-all → Redirect to Login */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);
