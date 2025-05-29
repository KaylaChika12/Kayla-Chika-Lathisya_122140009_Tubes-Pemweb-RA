import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import axios from 'axios';
import './Home.css';

const Home = () => {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    axios.get('/api/products')
      .then((res) => {
        console.log("Produk dari backend:", res.data);
        setProducts(res.data);
      })
      .catch((err) => console.error('Gagal mengambil data produk:', err));
  }, []);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2000);
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(number);
  };

  return (
    <div className="home-container">
      <h1 className="welcome-title">
        Welcome to <span className="highlight">BOHE Parfume Bali</span>
      </h1>
      <p className="welcome-subtitle">
        Temukan aroma elegan khas Bali yang mencerminkan gaya dan kepercayaan diri Anda.
      </p>

      <h2 className="section-title">BOHE BALI Parfume</h2>

      {showPopup && (
        <div className="popup-notification">
          Produk berhasil ditambahkan ke keranjang!
        </div>
      )}

      <div className="product-grid">
        {products.length === 0 ? (
          <p>Produk belum tersedia.</p>
        ) : (
          products.map((product) => (
            <div key={product.id} className="product-card">
              <img
                src={product.image_url} 
                alt={product.name}
                className="product-image"
              />
              <h3 className="product-name">{product.name}</h3>
              <p className="product-price">
                Harga: {isNaN(product.price) ? "Tidak tersedia" : formatRupiah(product.price)}
              </p>
              <button
                onClick={() => handleAddToCart(product)}
                className="add-to-cart-button"
              >
                Tambah ke Keranjang
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
