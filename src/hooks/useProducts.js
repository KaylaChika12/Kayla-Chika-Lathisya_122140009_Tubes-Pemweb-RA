import { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";

const API_URL = "http://localhost:6543";

// Custom hook for managing product data
export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/products`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengambil produk.");
      setProducts(data.products);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.message || "Gagal mengambil produk.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProductById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "Gagal mengambil detail produk.");
      return data;
    } catch (err) {
      console.error(`Error fetching product ${id}:`, err);
      setError(err.message || "Gagal mengambil detail produk.");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createProduct = useCallback(
    async (productData) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/products`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("auth_tkt")}`,
          },
          credentials: "include",
          body: JSON.stringify(productData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Gagal membuat produk.");
        await fetchProducts();
        return data.product;
      } catch (err) {
        console.error("Error creating product:", err);
        setError(err.message || "Gagal membuat produk.");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [fetchProducts]
  );

  const updateProduct = useCallback(
    async (id, productData) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/products/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("auth_tkt")}`,
          },
          credentials: "include",
          body: JSON.stringify(productData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Gagal memperbarui produk.");
        await fetchProducts();
        return data.product;
      } catch (err) {
        console.error(`Error updating product ${id}:`, err);
        setError(err.message || "Gagal memperbarui produk.");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [fetchProducts]
  );

  const deleteProduct = useCallback(
    async (id) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/products/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${Cookies.get("auth_tkt")}`,
          },
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Gagal menghapus produk.");
        await fetchProducts();
        return true;
      } catch (err) {
        console.error(`Error deleting product ${id}:`, err);
        setError(err.message || "Gagal menghapus produk.");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchProducts]
  );

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    fetchProducts,
    fetchProductById,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}
