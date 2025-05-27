import React from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(number);
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
      <h3>{product.title}</h3>
      <p>{product.description}</p>
      <p>Harga: {formatRupiah(product.price)}</p>
      <button onClick={() => dispatch(addToCart(product))}>Tambah ke Keranjang</button>
    </div>
  );
};

export default ProductCard;