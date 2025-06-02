// File: pages\AdminDashboard.js
import React from "react";
import { Link } from "react-router-dom";

// Admin Dashboard page component
const AdminDashboard = () => {
  const cardStyle = {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "20px",
    margin: "15px",
    textAlign: "center",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    backgroundColor: "#f9f9f9",
    flex: "1 1 calc(33% - 30px)", // Responsive sizing for cards
    minWidth: "250px",
  };

  const linkStyle = {
    display: "block",
    marginTop: "15px",
    padding: "10px 15px",
    backgroundColor: "#007bff",
    color: "white",
    textDecoration: "none",
    borderRadius: "5px",
    transition: "background-color 0.3s ease",
  };

  const hoverEffect = (e, color) => {
    e.target.style.backgroundColor = color;
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px", color: "#333" }}>
        Dashboard Admin
      </h1>
      <div
        style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
      >
        <div style={cardStyle}>
          <h2 style={{ color: "#555" }}>Manajemen Produk</h2>
          <p>Tambah, edit, atau hapus produk.</p>
          <Link
            to="/admin/products"
            style={linkStyle}
            onMouseOver={(e) => hoverEffect(e, "#0056b3")}
            onMouseOut={(e) => hoverEffect(e, "#007bff")}
          >
            Kelola Produk
          </Link>
        </div>
        <div style={cardStyle}>
          <h2 style={{ color: "#555" }}>Manajemen Pesanan</h2>
          <p>Lihat dan perbarui status pesanan pelanggan.</p>
          <Link
            to="/admin/orders"
            style={linkStyle}
            onMouseOver={(e) => hoverEffect(e, "#0056b3")}
            onMouseOut={(e) => hoverEffect(e, "#007bff")}
          >
            Kelola Pesanan
          </Link>
        </div>
        {/* Anda bisa menambahkan lebih banyak kartu di sini jika ada fitur admin lainnya */}
      </div>
    </div>
  );
};

export default AdminDashboard;
