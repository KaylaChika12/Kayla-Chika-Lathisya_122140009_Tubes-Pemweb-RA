import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart } from '../redux/cartSlice';

const Cart = () => {
  const cart = useSelector(state => state.cart);
  const dispatch = useDispatch();

  const [selectedPayment, setSelectedPayment] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Simpan cart ke localStorage saat ada perubahan
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(number);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price, 0);
  };

  const handleRemove = (productId) => {
    const confirmDelete = window.confirm('Apakah Anda yakin ingin menghapus produk ini dari keranjang?');
    if (confirmDelete) {
      dispatch(removeFromCart(productId));
    }
  };

  const handlePayment = () => {
    if (!selectedPayment) {
      alert('Silakan pilih metode pembayaran terlebih dahulu.');
      return;
    }
    setShowConfirmation(true);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Keranjang Belanja</h2>
      {cart.length === 0 ? (
        <p>Keranjang kosong</p>
      ) : (
        <>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: '10px', textAlign: 'left' }}>Produk</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Harga</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {cart.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px', display: 'flex', alignItems: 'center' }}>
                    <img src={item.image} alt={item.name} style={{ width: '50px', height: '50px', marginRight: '10px' }} />
                    {item.name}
                  </td>
                  <td style={{ padding: '10px' }}>{formatRupiah(item.price)}</td>
                  <td style={{ padding: '10px' }}>
                    <button
                      onClick={() => handleRemove(item.id)}
                      style={{
                        backgroundColor: '#f00',
                        color: '#fff',
                        border: 'none',
                        padding: '8px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="2" style={{ textAlign: 'right', padding: '10px' }}>
                  Total:
                </td>
                <td style={{ padding: '10px' }}>{formatRupiah(calculateTotal())}</td>
              </tr>
            </tfoot>
          </table>

          {/* Metode Pembayaran */}
          <div style={{ marginTop: '30px' }}>
            <h3>Pilih Metode Pembayaran:</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginTop: '10px' }}>
              {['QRIS', 'Bank Mandiri', 'BCA', 'BRI', 'BSI', 'BNI'].map(method => (
                <label key={method} style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="radio"
                    name="payment"
                    value={method}
                    checked={selectedPayment === method}
                    onChange={() => setSelectedPayment(method)}
                    style={{ marginRight: '8px' }}
                  />
                  {method}
                </label>
              ))}
            </div>

            <button
              onClick={handlePayment}
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px',
              }}
            >
              Bayar Sekarang
            </button>

            {/* Konfirmasi Pembayaran */}
            {showConfirmation && (
              <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '5px' }}>
                <h4>Terima kasih!</h4>
                <p>Anda telah memilih metode pembayaran: <strong>{selectedPayment}</strong></p>
                <p>Total yang harus dibayar: <strong>{formatRupiah(calculateTotal())}</strong></p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;