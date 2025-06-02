import React from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { Link } from "react-router-dom";

// Product card component for displaying product information
const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  // Format number to Rupiah currency
  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(number);
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "10px", margin: "10px" }}>
      {/* Link to product detail page */}
      <Link
        to={`/product/${product.id}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <h3>{product.name}</h3> {/* Use product.name for consistency */}
        <p>{product.description}</p>
        <p>Harga: {formatRupiah(product.price)}</p>
      </Link>
      <button onClick={() => dispatch(addToCart(product))}>
        Tambah ke Keranjang
      </button>
    </div>
  );
};

export default ProductCard;
