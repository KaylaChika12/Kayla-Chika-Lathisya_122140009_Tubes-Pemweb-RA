// File: hooks\useOrders.js
import { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import { useToast } from "./useToast";

const API_URL = "http://localhost:6543";

// Custom hook for managing order data
export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false); // Changed initial state to false
  const [error, setError] = useState(null);
  const { displayToast } = useToast();

  // Fetches all orders (Admin Only)
  const fetchAllOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/orders`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${Cookies.get("auth_tkt")}`,
        },
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        const errorMessage = data.error || "Gagal mengambil semua pesanan.";
        throw new Error(errorMessage);
      }
      setOrders(data.orders);
    } catch (err) {
      console.error("Error fetching all orders:", err);
      setError(err.message);
      displayToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }, [displayToast]);

  // Fetches orders belonging to the current user (User & Admin)
  const fetchMyOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/my-orders`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${Cookies.get("auth_tkt")}`,
        },
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        const errorMessage = data.error || "Gagal mengambil pesanan Anda.";
        throw new Error(errorMessage);
      }
      setOrders(data.orders);
    } catch (err) {
      console.error("Error fetching my orders:", err);
      setError(err.message);
      displayToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }, [displayToast]);

  // Fetches a single order's details by ID (Order Owner & Admin Only)
  const fetchOrderById = useCallback(
    async (id) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/orders/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${Cookies.get("auth_tkt")}`,
          },
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) {
          const errorMessage = data.error || "Gagal mengambil detail pesanan.";
          throw new Error(errorMessage);
        }
        return data;
      } catch (err) {
        console.error(`Error fetching order ${id}:`, err);
        setError(err.message);
        displayToast(err.message, "error");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [displayToast]
  );

  // Creates a new order (User & Admin)
  const createOrder = useCallback(
    async (orderData) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/orders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("auth_tkt")}`,
          },
          credentials: "include",
          body: JSON.stringify(orderData),
        });

        const data = await res.json();

        if (!res.ok) {
          const errorMessage = data.error || "Gagal membuat pesanan baru.";
          throw new Error(errorMessage);
        }
        fetchMyOrders(); // Refresh user's orders after creation
        displayToast("Pesanan berhasil dibuat!", "success");
        return data.order;
      } catch (err) {
        console.error("Error creating order:", err);
        setError(err.message);
        displayToast(err.message, "error");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [fetchMyOrders, displayToast]
  );

  // Updates an existing order (Admin Only)
  const updateOrder = useCallback(
    async (id, orderData) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/orders/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("auth_tkt")}`,
          },
          credentials: "include",
          body: JSON.stringify(orderData),
        });

        const data = await res.json();

        if (!res.ok) {
          const errorMessage = data.error || "Gagal memperbarui pesanan.";
          throw new Error(errorMessage);
        }
        // For admin, it's likely fetchAllOrders.
        fetchAllOrders();
        displayToast("Pesanan berhasil diperbarui!", "success");
        return data.order;
      } catch (err) {
        console.error(`Error updating order ${id}:`, err);
        setError(err.message);
        displayToast(err.message, "error");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [fetchAllOrders, displayToast]
  );

  // Deletes an order (Admin Only)
  const deleteOrder = useCallback(
    async (id) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/orders/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${Cookies.get("auth_tkt")}`,
          },
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) {
          const errorMessage = data.error || "Gagal menghapus pesanan.";
          throw new Error(errorMessage);
        }
        fetchAllOrders(); // Refresh all orders after deletion
        displayToast("Pesanan berhasil dihapus!", "success");
        return true;
      } catch (err) {
        console.error(`Error deleting order ${id}:`, err);
        setError(err.message);
        displayToast(err.message, "error");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchAllOrders, displayToast]
  );

  return {
    orders,
    loading,
    error,
    fetchAllOrders,
    fetchMyOrders,
    fetchOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
  };
}
