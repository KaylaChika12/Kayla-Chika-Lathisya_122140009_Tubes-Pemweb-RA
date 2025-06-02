import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { useProducts } from "../hooks/useProducts";
import { useToast } from "../hooks/useToast"; // Import useToast

// Product detail page component
const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const dispatch = useDispatch();
  const { fetchProductById, loading, error } = useProducts();
  const { displayToast } = useToast(); // Use the toast hook

  // Fetch product details on component mount or ID change
  useEffect(() => {
    const getProduct = async () => {
      const fetchedProduct = await fetchProductById(id);
      setProduct(fetchedProduct);
      if (!fetchedProduct && !loading && error) {
        // <--- POTENSI BUG DI SINI
        displayToast(error, "error");
      }
    };
    getProduct();
  }, []);

  // Formats number to Rupiah currency
  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(number);
  };

  // Handles adding a product to the cart and shows a toast
  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    displayToast(
      `"${product.name}" berhasil ditambahkan ke keranjang!`,
      "success"
    );
  };

  if (loading) {
    return <p>Memuat detail produk...</p>;
  }

  if (error && !product) {
    // Only show error if product is null due to error
    return <p>Error: {error}</p>;
  }

  if (!product) {
    return <p>Produk tidak ditemukan.</p>;
  }

  return (
    <div
      style={{
        padding: "20px",
        display: "flex",
        gap: "20px",
        alignItems: "flex-start",
      }}
    >
      <img
        src={
          product.image_url ||
          "https://placehold.co/300x300/cccccc/000000?text=No+Image"
        }
        alt={product.name}
        style={{
          width: "300px",
          height: "300px",
          objectFit: "cover",
          borderRadius: "8px",
        }}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src =
            "https://placehold.co/300x300/cccccc/000000?text=No+Image";
        }}
      />
      <div>
        <h2 style={{ fontSize: "2em", marginBottom: "10px" }}>
          {product.name}
        </h2>
        <p style={{ fontSize: "1.1em", color: "#555", marginBottom: "15px" }}>
          {product.description}
        </p>
        <p
          style={{
            fontSize: "1.3em",
            fontWeight: "bold",
            color: "#333",
            marginBottom: "20px",
          }}
        >
          Harga: {formatRupiah(product.price)}
        </p>
        <p style={{ fontSize: "1em", color: "#777", marginBottom: "20px" }}>
          Stok Tersedia: {product.stock}
        </p>
        <button
          onClick={() => handleAddToCart(product)}
          style={{
            padding: "12px 25px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "1.1em",
            transition: "background-color 0.3s ease",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
        >
          Tambah ke Keranjang
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
