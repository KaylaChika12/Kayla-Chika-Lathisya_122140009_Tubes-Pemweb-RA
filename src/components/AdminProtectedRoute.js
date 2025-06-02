// File: components\AdminProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";

// Protected route component to restrict access to admin users
const AdminProtectedRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const { displayToast } = useToast();

  if (loading) {
    return <p>Memuat...</p>;
  }

  if (!isAuthenticated) {
    displayToast("Anda harus login untuk mengakses halaman ini.", "error");
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "admin") {
    displayToast("Akses ditolak: Anda bukan admin.", "error");
    return <Navigate to="/" replace />; // Redirect non-admin users to home
  }

  return children;
};

export default AdminProtectedRoute;
