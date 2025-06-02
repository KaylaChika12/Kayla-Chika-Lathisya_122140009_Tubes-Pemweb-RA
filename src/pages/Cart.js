// File: pages\Cart.js
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  updateItemQuantity,
  clearCart,
} from "../redux/cartSlice";
import { useToast } from "../hooks/useToast";
import { useAuth } from "../hooks/useAuth";
import { useOrders } from "../hooks/useOrders"; // Import useOrders
import Modal from "../components/Modal"; // Import Modal from its new location

// Cart page component
const Cart = () => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const { displayToast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const { createOrder, loading: orderLoading } = useOrders(); // Dapatkan createOrder dan loading state

  const [selectedPayment, setSelectedPayment] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    type: "alert",
    onConfirm: null,
    onCancel: null,
  });
  const [itemToRemoveId, setItemToRemoveId] = useState(null);

  // Tambahkan state untuk form checkout
  const [checkoutForm, setCheckoutForm] = useState({
    customer_name: user?.username || "",
    phone_number: "",
    address: "",
  });

  // Update customer_name if user changes after initial render
  useEffect(() => {
    if (user && !checkoutForm.customer_name) {
      setCheckoutForm((prevForm) => ({
        ...prevForm,
        customer_name: user.username,
      }));
    }
  }, [user, checkoutForm.customer_name]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Handle perubahan input form checkout
  const handleCheckoutFormChange = (e) => {
    setCheckoutForm({
      ...checkoutForm,
      [e.target.name]: e.target.value,
    });
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(number);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.totalPrice, 0);
  };

  const handleQuantityChange = (id, newQuantity) => {
    const productInCart = cart.find((item) => item.id === id);
    if (productInCart && newQuantity > productInCart.stock) {
      displayToast(
        `Stok untuk ${productInCart.name} hanya ${productInCart.stock}.`,
        "warning"
      );
      return;
    }
    if (newQuantity <= 0) {
      handleRemoveClick(id);
    } else {
      dispatch(updateItemQuantity({ id, quantity: newQuantity }));
    }
  };

  const handleRemoveClick = (productId) => {
    setItemToRemoveId(productId);
    setModalContent({
      title: "Konfirmasi Hapus",
      message: "Apakah Anda yakin ingin menghapus produk ini dari keranjang?",
      type: "confirm",
      onConfirm: () => handleConfirmRemove(productId),
      onCancel: handleCancelModal,
    });
    setShowModal(true);
  };

  const handleConfirmRemove = (productId) => {
    dispatch(removeFromCart(productId));
    setItemToRemoveId(null);
    setShowModal(false);
    displayToast("Produk berhasil dihapus dari keranjang!", "success");
  };

  const handleCancelModal = () => {
    setItemToRemoveId(null);
    setShowModal(false);
  };

  // Fungsi untuk mengirim order ke backend
  const handlePlaceOrder = async () => {
    // Validasi awal menggunakan toast global
    if (!isAuthenticated) {
      displayToast("Anda harus login untuk membuat pesanan.", "error");
      return;
    }
    if (cart.length === 0) {
      displayToast(
        "Keranjang Anda kosong. Tambahkan produk terlebih dahulu.",
        "warning"
      );
      return;
    }
    if (!selectedPayment) {
      displayToast(
        "Silakan pilih metode pembayaran terlebih dahulu.",
        "warning"
      );
      return;
    }
    if (
      !checkoutForm.customer_name ||
      !checkoutForm.phone_number ||
      !checkoutForm.address
    ) {
      displayToast("Mohon lengkapi semua detail pengiriman.", "warning");
      return;
    }

    const orderItemsPayload = cart.map((item) => ({
      product_id: item.id,
      quantity: item.quantity,
    }));

    const orderPayload = {
      customer_name: checkoutForm.customer_name,
      phone_number: checkoutForm.phone_number,
      address: checkoutForm.address,
      payment_method: selectedPayment,
      items: orderItemsPayload,
    };

    try {
      const createdOrder = await createOrder(orderPayload);
      if (createdOrder) {
        displayToast("Pesanan Anda berhasil dibuat!", "success");
        dispatch(clearCart());
        setShowConfirmation(true);
        // Anda mungkin ingin mengarahkan user ke halaman riwayat pesanan
        // navigate('/my-orders');
      } else {
        // Jika createOrder mengembalikan null/false (misalnya karena error di useOrders hook)
        // useOrders hook sudah menampilkan toast error, jadi tidak perlu lagi di sini
      }
    } catch (error) {
      // Ini akan menangkap error yang tidak ditangani oleh useOrders hook,
      // tetapi useOrders hook sudah cukup komprehensif dalam menangani error API.
      console.error("Failed to place order (unexpected error):", error);
      displayToast(
        "Terjadi kesalahan tak terduga saat membuat pesanan.",
        "error"
      );
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Keranjang Belanja</h2>
      {cart.length === 0 ? (
        <p>Keranjang kosong</p>
      ) : (
        <>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ padding: "10px", textAlign: "left" }}>Produk</th>
                <th style={{ padding: "10px", textAlign: "left" }}>
                  Harga Satuan
                </th>
                <th style={{ padding: "10px", textAlign: "left" }}>
                  Kuantitas
                </th>
                <th style={{ padding: "10px", textAlign: "left" }}>
                  Total Harga
                </th>
                <th style={{ padding: "10px", textAlign: "left" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td
                    style={{
                      padding: "10px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={
                        item.image_url ||
                        item.image ||
                        "https://placehold.co/50x50/cccccc/000000?text=No+Image"
                      }
                      alt={item.name}
                      style={{
                        width: "50px",
                        height: "50px",
                        marginRight: "10px",
                        borderRadius: "4px",
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://placehold.co/50x50/cccccc/000000?text=No+Image";
                      }}
                    />
                    {item.name}
                  </td>
                  <td style={{ padding: "10px" }}>
                    {formatRupiah(item.price_at_purchase)}{" "}
                  </td>
                  <td style={{ padding: "10px" }}>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item.id, parseInt(e.target.value))
                      }
                      style={{ width: "60px", padding: "5px" }}
                    />
                  </td>
                  <td style={{ padding: "10px" }}>
                    {formatRupiah(item.totalPrice)}{" "}
                  </td>
                  <td style={{ padding: "10px" }}>
                    <button
                      onClick={() => handleRemoveClick(item.id)}
                      style={{
                        backgroundColor: "#f00",
                        color: "#fff",
                        border: "none",
                        padding: "8px 12px",
                        borderRadius: "4px",
                        cursor: "pointer",
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
                <td colSpan="3" style={{ textAlign: "right", padding: "10px" }}>
                  Total Belanja:
                </td>
                <td colSpan="2" style={{ padding: "10px" }}>
                  {formatRupiah(calculateTotal())}
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Shipping Details Form */}
          <div
            style={{
              marginTop: "30px",
              border: "1px solid #eee",
              padding: "20px",
              borderRadius: "8px",
            }}
          >
            <h3>Detail Pengiriman</h3>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>
                Nama Penerima:
              </label>
              <input
                type="text"
                name="customer_name"
                value={checkoutForm.customer_name}
                onChange={handleCheckoutFormChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
                required
              />
            </div>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>
                Nomor Telepon:
              </label>
              <input
                type="text"
                name="phone_number"
                value={checkoutForm.phone_number}
                onChange={handleCheckoutFormChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
                required
              />
            </div>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>
                Alamat Lengkap:
              </label>
              <textarea
                name="address"
                value={checkoutForm.address}
                onChange={handleCheckoutFormChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  minHeight: "80px",
                }}
                required
              />
            </div>
          </div>

          {/* Payment method selection */}
          <div style={{ marginTop: "30px" }}>
            <h3>Pilih Metode Pembayaran:</h3>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "15px",
                marginTop: "10px",
              }}
            >
              {["QRIS", "Bank Mandiri", "BCA", "BRI", "BSI", "BNI"].map(
                (method) => (
                  <label
                    key={method}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method}
                      checked={selectedPayment === method}
                      onChange={() => setSelectedPayment(method)}
                      style={{ marginRight: "8px" }}
                    />
                    {method}
                  </label>
                )
              )}
            </div>

            <button
              onClick={handlePlaceOrder}
              style={{
                marginTop: "20px",
                padding: "10px 20px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "16px",
                opacity: orderLoading ? 0.7 : 1,
                cursor: orderLoading ? "not-allowed" : "pointer",
              }}
              disabled={orderLoading}
            >
              {orderLoading ? "Membuat Pesanan..." : "Buat Pesanan"}
            </button>

            {/* Payment confirmation display */}
            {showConfirmation && (
              <div
                style={{
                  marginTop: "20px",
                  padding: "15px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  backgroundColor: "#e6ffe6",
                }}
              >
                <h4>Terima kasih!</h4>
                <p>
                  Pesanan Anda telah diterima dengan metode pembayaran:{" "}
                  <strong>{selectedPayment}</strong>.
                </p>
                <p>
                  Total yang akan dibayar:{" "}
                  <strong>{formatRupiah(calculateTotal())}</strong>.
                </p>
                <p>Silakan lanjutkan proses pembayaran.</p>
              </div>
            )}
          </div>
        </>
      )}

      <Modal
        show={showModal}
        title={modalContent.title}
        message={modalContent.message}
        onConfirm={modalContent.onConfirm}
        onCancel={modalContent.onCancel}
        type={modalContent.type}
      />
    </div>
  );
};

export default Cart;
