import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { hideToast } from "../redux/toastSlice";

// Toast notification component
const Toast = () => {
  const { message, type, isVisible } = useSelector((state) => state.toast);
  const dispatch = useDispatch();

  // Auto-hide toast after a few seconds
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        dispatch(hideToast());
      }, 3000); // Toast visible for 3 seconds
      return () => clearTimeout(timer);
    }
  }, [isVisible, dispatch]);

  // Styles for different toast types
  const getToastStyles = () => {
    let backgroundColor = "#333"; // Default info
    let color = "white";

    switch (type) {
      case "success":
        backgroundColor = "#28a745";
        break;
      case "error":
        backgroundColor = "#dc3545";
        break;
      case "warning":
        backgroundColor = "#ffc107";
        color = "#333"; // Darker text for warning
        break;
      case "info":
      default:
        backgroundColor = "#17a2b8";
        break;
    }

    return {
      position: "fixed",
      bottom: "20px",
      left: "50%",
      transform: "translateX(-50%)",
      backgroundColor: backgroundColor,
      color: color,
      padding: "12px 20px",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      zIndex: 10000,
      opacity: isVisible ? 1 : 0,
      visibility: isVisible ? "visible" : "hidden",
      transition: "opacity 0.3s ease-in-out, visibility 0.3s ease-in-out",
      minWidth: "250px",
      textAlign: "center",
    };
  };

  if (!isVisible && !message) return null; // Don't render if not visible and no message

  return <div style={getToastStyles()}>{message}</div>;
};

export default Toast;
