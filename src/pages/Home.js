import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import './Home.css';

const products = [
  { id: 1, name: 'Bohe Parfums Scent of Heaven', price: 59500, image: '/images/scent of heaven.jpg' },
  { id: 2, name: 'Bohe Parfums Noir', price: 59500, image: '/images/Noir.jpg' },
  { id: 3, name: 'Bohe Parfums Feyre', price: 136400, image: '/images/Feyre.jpg' },
  { id: 4, name: 'Bohe Parfums Dose of Love', price: 136400, image: '/images/Dose of Love.jpg' },
  { id: 5, name: 'Bohe Parfums Berly', price: 136400, image: '/images/Berly.jpg' },
  { id: 6, name: 'Bohe Parfums Ladyboss', price: 140360, image: '/images/Ladyboss.jpg' },
  { id: 7, name: 'Bohe Parfums Badassery', price: 127600, image: '/images/Badassery.jpg' },
  { id: 8, name: 'Bohe Parfums Hedon', price: 136400, image: '/images/Hedon.jpg' },
  { id: 9, name: 'Bohe Parfums Ambitchous', price: 136400, image: '/images/Ambitchous.jpg' },
  { id: 10, name: 'Bohe Parfums Horne', price: 145200, image: '/images/Horne.jpg' },
  { id: 11, name: 'Bohe Parfums Savage', price: 136400, image: '/images/Savage.jpg' },
];

const Home = () => {
  const dispatch = useDispatch();
  const [showPopup, setShowPopup] = useState(false);

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
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} className="product-image" />
            <h3 className="product-name">{product.name}</h3>
            <p className="product-price">Price: {formatRupiah(product.price)}</p>
            <button
              onClick={() => handleAddToCart(product)}
              className="add-to-cart-button"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
