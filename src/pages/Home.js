import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { useProducts } from "../hooks/useProducts";
import { Link } from "react-router-dom";
import { useToast } from "../hooks/useToast"; // Import useToast
import "./Home.css";

// Home page component displaying product listings
const Home = () => {
  const dispatch = useDispatch();
  const { products, loading, error, fetchProducts } = useProducts();
  const { displayToast } = useToast(); // Use the toast hook

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handles adding a product to the cart and shows a popup
  const handleAddToCart = (product) => {
    // Dispatch addToCart and check if it was successful (e.g., by checking stock)
    // The cartSlice itself should handle the stock check and potentially return a status
    // For now, we'll assume it's always added or handle the warning via console.warn in slice
    dispatch(addToCart(product));
    displayToast(
      `"${product.name}" berhasil ditambahkan ke keranjang!`,
      "success"
    );
  };

  // Formats number to Rupiah currency
  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(number);
  };

  if (loading) {
    return <div className="loading-message">Memuat produk...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="home-container">
      <h1 className="welcome-title">
        Selamat Datang di <span className="highlight">BOHE Parfume Bali</span>
      </h1>
      <p className="welcome-subtitle">
        Temukan aroma elegan khas Bali yang mencerminkan gaya dan kepercayaan
        diri Anda.
      </p>

      <h2 className="section-title">Produk BOHE BALI</h2>

      {/* Removed local popup, now using global toast */}

      <div className="product-grid">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="product-card">
              <img
                src={
                  product.image_url ||
                  "https://placehold.co/200x200/cccccc/000000?text=No+Image"
                }
                alt={product.name}
                className="product-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://placehold.co/200x200/cccccc/000000?text=No+Image";
                }}
              />
              <h3 className="product-name">{product.name}</h3>
              <p className="product-price">
                Harga: {formatRupiah(product.price)}
              </p>
              {/* Button to view product details */}
              <Link to={`/product/${product.id}`} className="detail-button">
                Lihat Detail
              </Link>
              <button
                onClick={() => handleAddToCart(product)}
                className="add-to-cart-button"
              >
                Tambah ke Keranjang
              </button>
            </div>
          ))
        ) : (
          <p>Tidak ada produk yang tersedia.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
