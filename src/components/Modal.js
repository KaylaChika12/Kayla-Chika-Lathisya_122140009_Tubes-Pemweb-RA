// File: components\Modal.js
import React from "react";

// Simple modal component for confirmations and alerts
const Modal = ({ show, title, message, onConfirm, onCancel, type }) => {
  if (!show) return null;

  const modalStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  };

  const modalContentStyle = {
    backgroundColor: "white",
    padding: "25px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    textAlign: "center",
    maxWidth: "400px",
    width: "90%",
  };

  const buttonGroupStyle = {
    marginTop: "20px",
    display: "flex",
    justifyContent: "center",
    gap: "10px",
  };

  const buttonStyle = {
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    border: "none",
    fontSize: "16px",
  };

  const confirmButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#dc3545",
    color: "white",
  };

  const cancelButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#6c757d",
    color: "white",
  };

  const okButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#007bff",
    color: "white",
  };

  return (
    <div style={modalStyle}>
      <div style={modalContentStyle}>
        <h3>{title}</h3>
        {/* Render message as a React node, allowing it to be a component */}
        {typeof message === "string" ? <p>{message}</p> : message}
        <div style={buttonGroupStyle}>
          {type === "confirm" && (
            <>
              <button style={confirmButtonStyle} onClick={onConfirm}>
                Ya
              </button>
              <button style={cancelButtonStyle} onClick={onCancel}>
                Batal
              </button>
            </>
          )}
          {type === "alert" && (
            <button style={okButtonStyle} onClick={onConfirm}>
              OK
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
