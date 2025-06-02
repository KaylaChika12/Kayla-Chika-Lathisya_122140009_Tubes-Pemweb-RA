// File: pages\MyOrders.js
import React, { useEffect } from "react";
import { useOrders } from "../hooks/useOrders";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; // Import useAuth

// MyOrders page component to display a user's orders
const MyOrders = () => {
  const { orders, loading, error, fetchMyOrders } = useOrders();
  const { isAuthenticated } = useAuth(); // Dapatkan isAuthenticated state

  useEffect(() => {
    // Hanya ambil pesanan jika pengguna sudah terautentikasi
    if (isAuthenticated) {
      fetchMyOrders();
    }
  }, []); // Tambahkan isAuthenticated ke dependency array

  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(number);
  };

  // Fungsi untuk mengirim bukti transfer via WhatsApp
  const sendProofToWhatsApp = (order) => {
    const adminWhatsAppNumber = "6281234567890"; // Ganti dengan nomor WhatsApp admin yang sebenarnya
    const message = `Halo Admin, saya ingin mengirimkan bukti transfer untuk pesanan dengan ID: ${order.id.substring(
      0,
      8
    )}... dan total jumlah: ${formatRupiah(
      order.total_amount
    )}. Mohon instruksi selanjutnya untuk pengiriman bukti transfer.`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${adminWhatsAppNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  if (loading) {
    return <div style={{ padding: "20px" }}>Memuat pesanan Anda...</div>;
  }

  if (error) {
    return <div style={{ padding: "20px", color: "red" }}>Error: {error}</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Pesanan Saya</h2>
      {orders.length === 0 ? (
        <p>Anda belum memiliki pesanan.</p>
      ) : (
        <div style={{ display: "grid", gap: "20px" }}>
          {orders.map((order) => (
            <div
              key={order.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "15px",
                backgroundColor: "#f9f9f9",
              }}
            >
              <h3 style={{ marginBottom: "10px", color: "#333" }}>
                Order ID: {order.id.substring(0, 8)}...
              </h3>
              <p>
                <strong>Tanggal Pesanan:</strong>{" "}
                {new Date(order.order_date).toLocaleString()}
              </p>
              <p>
                <strong>Total Jumlah:</strong>{" "}
                {formatRupiah(order.total_amount)}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  style={{
                    fontWeight: "bold",
                    color:
                      order.status === "completed"
                        ? "green"
                        : order.status === "cancelled"
                        ? "red"
                        : "orange",
                  }}
                >
                  {order.status.replace(/_/g, " ").toUpperCase()}
                </span>
              </p>
              <p>
                <strong>Metode Pembayaran:</strong> {order.payment_method}
              </p>
              {order.proof_of_payment_url && (
                <p>
                  <strong>Bukti Pembayaran:</strong>{" "}
                  <a
                    href={order.proof_of_payment_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#007bff" }}
                  >
                    Lihat Bukti
                  </a>
                </p>
              )}
              {/* Tombol baru untuk mengirim bukti transfer via WhatsApp */}
              <button
                onClick={() => sendProofToWhatsApp(order)}
                style={{
                  display: "inline-block",
                  marginTop: "10px",
                  padding: "8px 15px",
                  backgroundColor: "#25D366", // Warna hijau WhatsApp
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "1em",
                  fontWeight: "bold",
                }}
              >
                Kirimkan Bukti Transfer ke Admin WhatsApp
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
