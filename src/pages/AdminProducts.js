import React, { useState, useEffect, useRef } from "react"; // Import useEffect and useRef
import { useProducts } from "../hooks/useProducts";
import { useToast } from "../hooks/useToast";
import Modal from "../components/Modal";
// import ProductForm from "../components/ProductForm"; // Assuming ProductForm is in a separate file or defined below

// Component for managing product data and UI.
const AdminProducts = () => {
  const {
    products,
    loading,
    error,
    // fetchProducts, // fetchProducts is not used directly in the provided snippet, but good to keep if used elsewhere
    createProduct,
    updateProduct,
    deleteProduct,
  } = useProducts();

  const { displayToast } = useToast();

  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [formKey, setFormKey] = useState(0);

  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    image_url: "",
    stock: "",
  });

  // Refs to hold the latest values to avoid stale closures
  const productFormRef = useRef(productForm);
  const isEditingRef = useRef(isEditing);
  const currentProductRef = useRef(currentProduct);

  // Update refs whenever their corresponding state changes
  useEffect(() => {
    productFormRef.current = productForm;
  }, [productForm]);

  useEffect(() => {
    isEditingRef.current = isEditing;
  }, [isEditing]);

  useEffect(() => {
    currentProductRef.current = currentProduct;
  }, [currentProduct]);

  // Handles changes in the product form inputs.
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setProductForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Sets up the modal for adding a new product.
  const handleAddClick = () => {
    setIsEditing(false);
    setCurrentProduct(null);
    setProductForm({
      name: "",
      description: "",
      price: "",
      image_url: "",
      stock: "",
    });
    setFormKey((prev) => prev + 1);
    setModalContent({
      title: "Tambah Produk Baru",
      type: "confirm",
      onConfirm: handleSaveProduct, // This will now use refs internally
      onCancel: () => setShowModal(false),
    });
    setShowModal(true);
  };

  // Sets up the modal for editing an existing product.
  const handleEditClick = (product) => {
    setIsEditing(true);
    setCurrentProduct(product);
    setProductForm({
      name: product.name,
      description: product.description || "",
      price: product.price,
      image_url: product.image_url || "",
      stock: product.stock,
    });
    setFormKey((prev) => prev + 1);
    setModalContent({
      title: "Edit Produk",
      type: "confirm",
      onConfirm: handleSaveProduct, // This will now use refs internally
      onCancel: () => setShowModal(false),
    });
    setShowModal(true);
  };

  // Saves or updates the product after form submission.
  const handleSaveProduct = async () => {
    // Access current values via refs
    const currentFormState = productFormRef.current;
    const editingMode = isEditingRef.current;
    const activeProduct = currentProductRef.current;

    const trimmedName = currentFormState.name.trim();
    const price = Number(currentFormState.price);
    const stock = Number(currentFormState.stock);

    if (!trimmedName || isNaN(price) || isNaN(stock)) {
      displayToast("Nama, Harga, dan Stok wajib diisi.", "warning");
      return;
    }

    if (price <= 0 || stock < 0) {
      displayToast("Harga dan Stok harus angka positif.", "warning");
      return;
    }

    setShowModal(false);

    let success = false;
    const payload = {
      ...currentFormState,
      name: trimmedName,
      price,
      stock,
    };

    if (editingMode && activeProduct) {
      success = await updateProduct(activeProduct.id, payload);
      if (success) displayToast("Produk berhasil diperbarui.", "success");
    } else {
      success = await createProduct(payload);
      if (success) displayToast("Produk berhasil ditambahkan.", "success");
    }
    // Optionally, refresh products list if not automatically done by useProducts hook
    // fetchProducts();
  };

  // Sets up the modal for confirming product deletion.
  const handleDeleteClick = (product) => {
    setModalContent({
      title: "Konfirmasi Hapus Produk",
      message: `Yakin ingin menghapus "${product.name}"?`,
      type: "confirm",
      onConfirm: async () => {
        setShowModal(false);
        const success = await deleteProduct(product.id);
        if (success) displayToast("Produk berhasil dihapus.", "success");
        // Optionally, refresh products list
        // fetchProducts();
      },
      onCancel: () => setShowModal(false),
    });
    setShowModal(true);
  };

  // Formats a number into Indonesian Rupiah currency format.
  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(number);
  };

  if (loading) return <div style={{ padding: "20px" }}>Memuat produk...</div>;
  if (error)
    return <div style={{ padding: "20px", color: "red" }}>Error: {error}</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        Manajemen Produk
      </h1>
      <button
        onClick={handleAddClick}
        style={{
          padding: "10px 20px",
          backgroundColor: "#28a745",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        Tambah Produk Baru
      </button>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th style={{ padding: "10px" }}>ID</th>
            <th style={{ padding: "10px" }}>Nama</th>
            <th style={{ padding: "10px" }}>Harga</th>
            <th style={{ padding: "10px" }}>Stok</th>
            <th style={{ padding: "10px" }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                Tidak ada produk.
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "10px" }}>{product.id.slice(0, 8)}...</td>
                <td style={{ padding: "10px" }}>{product.name}</td>
                <td style={{ padding: "10px" }}>
                  {formatRupiah(product.price)}
                </td>
                <td style={{ padding: "10px" }}>{product.stock}</td>
                <td style={{ padding: "10px" }}>
                  <button
                    onClick={() => handleEditClick(product)}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#ffc107",
                      color: "black", // Changed for better visibility on yellow
                      border: "none",
                      borderRadius: "3px",
                      cursor: "pointer",
                      marginRight: "5px",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(product)}
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
        message={
          modalContent.type === "confirm" &&
          (modalContent.title === "Tambah Produk Baru" ||
            modalContent.title === "Edit Produk") ? ( // Check if it's the product form modal
            <ProductForm
              key={formKey} // formKey forces re-mount with fresh state from productForm
              productForm={productForm} // Pass the current productForm state
              handleFormChange={handleFormChange}
            />
          ) : (
            modalContent.message // For delete confirmation message
          )
        }
        onConfirm={modalContent.onConfirm}
        onCancel={modalContent.onCancel}
        type={modalContent.type}
      />
    </div>
  );
};

// Defines the form structure for adding or editing a product.
const ProductForm = ({ productForm, handleFormChange }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
    <label>
      Nama Produk:
      <input
        type="text"
        name="name"
        value={productForm.name}
        onChange={handleFormChange}
        required
        style={{
          width: "100%",
          padding: "8px",
          borderRadius: "4px",
          border: "1px solid #ccc",
          boxSizing: "border-box", // Added for consistent sizing
        }}
      />
    </label>
    <label>
      Deskripsi:
      <textarea
        name="description"
        value={productForm.description}
        onChange={handleFormChange}
        style={{
          width: "100%",
          padding: "8px",
          borderRadius: "4px",
          border: "1px solid #ccc",
          minHeight: "60px",
          boxSizing: "border-box", // Added for consistent sizing
        }}
      />
    </label>
    <label>
      Harga:
      <input
        type="number"
        name="price"
        value={productForm.price}
        onChange={handleFormChange}
        required
        min="0" // Optional: prevent negative numbers at browser level
        style={{
          width: "100%",
          padding: "8px",
          borderRadius: "4px",
          border: "1px solid #ccc",
          boxSizing: "border-box", // Added for consistent sizing
        }}
      />
    </label>
    <label>
      URL Gambar:
      <input
        type="text"
        name="image_url"
        value={productForm.image_url}
        onChange={handleFormChange}
        style={{
          width: "100%",
          padding: "8px",
          borderRadius: "4px",
          border: "1px solid #ccc",
          boxSizing: "border-box", // Added for consistent sizing
        }}
      />
    </label>
    <label>
      Stok:
      <input
        type="number"
        name="stock"
        value={productForm.stock}
        onChange={handleFormChange}
        required
        min="0" // Optional: prevent negative numbers at browser level
        style={{
          width: "100%",
          padding: "8px",
          borderRadius: "4px",
          border: "1px solid #ccc",
          boxSizing: "border-box", // Added for consistent sizing
        }}
      />
    </label>
  </div>
);

export default AdminProducts;
