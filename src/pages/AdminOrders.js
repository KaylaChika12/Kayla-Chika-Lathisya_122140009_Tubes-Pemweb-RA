import React, { useEffect, useState } from "react";
import { useOrders } from "../hooks/useOrders";
import { useToast } from "../hooks/useToast";
import Modal from "../components/Modal";

const AdminOrders = () => {
  const { orders, loading, error, fetchAllOrders, updateOrder, deleteOrder } =
    useOrders();
  const { displayToast } = useToast();

  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [currentOrder, setCurrentOrder] = useState(null);

  const allowedStatusUpdates = [
    "pending_payment",
    "waiting_confirmation",
    "processing",
    "shipped",
    "completed",
    "cancelled",
  ];

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const formatRupiah = (number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(number);

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "green";
      case "cancelled":
        return "red";
      case "shipped":
        return "blue";
      case "processing":
        return "#ff9900";
      case "waiting_confirmation":
        return "#ff6600";
      case "pending_payment":
        return "gray";
      default:
        return "black";
    }
  };

  const handleUpdateStatusClick = (order) => {
    setCurrentOrder({ ...order });

    setModalContent({
      title: `Pilih Status Baru untuk Pesanan ${order.id?.slice(0, 8)}...`,
      type: "confirm",
      onCancel: () => setShowModal(false),
      message: (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            marginTop: "10px",
          }}
        >
          {allowedStatusUpdates.map((status) => (
            <button
              key={status}
              onClick={() => handleSaveStatus(order.id, status)}
              style={{
                padding: "6px 10px",
                borderRadius: "5px",
                border: "none",
                backgroundColor: getStatusColor(status),
                color: "white",
                cursor: "pointer",
                flexGrow: 1,
              }}
            >
              {status.replace(/_/g, " ").toUpperCase()}
            </button>
          ))}
        </div>
      ),
    });

    setShowModal(true);
  };

  const handleSaveStatus = async (id, status) => {
    setShowModal(false);
    const success = await updateOrder(id, { status });
    if (success) displayToast("Status pesanan diperbarui!", "success");
  };

  const handleDeleteClick = (order) => {
    setModalContent({
      title: "Konfirmasi Hapus Pesanan",
      message: `Hapus pesanan ID: ${order.id?.slice(0, 8)}...?`,
      type: "confirm",
      onConfirm: async () => {
        setShowModal(false);
        const success = await deleteOrder(order.id);
        if (success) displayToast("Pesanan dihapus.", "success");
      },
      onCancel: () => setShowModal(false),
    });
    setShowModal(true);
  };

  if (loading) return <div style={{ padding: "20px" }}>Memuat pesanan...</div>;
  if (error)
    return (
      <div style={{ padding: "20px", color: "red" }}>
        Error: {error || "Terjadi kesalahan"}
      </div>
    );

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        Manajemen Pesanan
      </h1>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th style={{ padding: "10px" }}>ID</th>
            <th style={{ padding: "10px" }}>User</th>
            <th style={{ padding: "10px" }}>Tanggal</th>
            <th style={{ padding: "10px" }}>Nama</th>
            <th style={{ padding: "10px" }}>Telepon</th>
            <th style={{ padding: "10px" }}>Alamat</th>
            <th style={{ padding: "10px" }}>Metode</th>
            <th style={{ padding: "10px" }}>Total</th>
            <th style={{ padding: "10px" }}>Status</th>
            <th style={{ padding: "10px" }}>Bukti</th>
            <th style={{ padding: "10px" }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="11" style={{ textAlign: "center", padding: "20px" }}>
                Tidak ada pesanan.
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "10px" }}>{order.id?.slice(0, 8)}...</td>
                <td style={{ padding: "10px" }}>
                  {order.user_id?.slice(0, 8)}...
                </td>
                <td style={{ padding: "10px" }}>
                  {new Date(order.order_date).toLocaleString()}
                </td>
                <td style={{ padding: "10px" }}>{order.customer_name}</td>
                <td style={{ padding: "10px" }}>{order.phone_number}</td>
                <td style={{ padding: "10px" }}>{order.address}</td>
                <td style={{ padding: "10px" }}>{order.payment_method}</td>
                <td style={{ padding: "10px" }}>
                  {formatRupiah(order.total_amount)}
                </td>
                <td
                  style={{
                    padding: "10px",
                    fontWeight: "bold",
                    color: getStatusColor(order.status),
                  }}
                >
                  {order.status.replace(/_/g, " ").toUpperCase()}
                </td>
                <td style={{ padding: "10px" }}>
                  {order.proof_of_payment_url ? (
                    <a
                      href={order.proof_of_payment_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Lihat
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
                <td style={{ padding: "10px" }}>
                  <button
                    onClick={() => handleUpdateStatusClick(order)}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#007bff",
                      color: "white",
                      border: "none",
                      borderRadius: "3px",
                      cursor: "pointer",
                      marginRight: "5px",
                    }}
                  >
                    Ubah
                  </button>
                  <button
                    onClick={() => handleDeleteClick(order)}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#dc3545",
                      color: "white",
                      border: "none",
                      borderRadius: "3px",
                      cursor: "pointer",
                    }}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

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

export default AdminOrders;
