// File: components\Navbar.js
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login as reduxLogin, logout as reduxLogout } from "../redux/authSlice";
import { useAuth } from "../hooks/useAuth";
import Cookies from "js-cookie";

// Navbar component for navigation and authentication status display
const Navbar = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, logout, checkSession } = useAuth();

  // Sync Redux state with auth session from cookies
  useEffect(() => {
    const { isValid, user: authUser } = checkSession();
    if (isValid && authUser) {
      dispatch(reduxLogin(authUser));
    } else {
      dispatch(reduxLogout());
    }
  }, [checkSession, dispatch]);

  const linkStyle = {
    color: "white",
    textDecoration: "none",
    padding: "8px 12px",
    borderRadius: "4px",
    transition: "background-color 0.3s ease",
  };

  const hoverEffect = (e, color) => {
    e.target.style.backgroundColor = color;
  };

  return (
    <nav
      style={{ backgroundColor: "#333", padding: "10px 20px", color: "white" }}
    >
      <ul
        style={{
          listStyle: "none",
          display: "flex",
          margin: 0,
          padding: 0,
          alignItems: "center",
        }}
      >
        <li style={{ marginRight: "20px" }}>
          <Link
            to="/"
            style={linkStyle}
            onMouseOver={(e) => hoverEffect(e, "#555")}
            onMouseOut={(e) => hoverEffect(e, "transparent")}
          >
            Beranda
          </Link>
        </li>
        <li style={{ marginRight: "20px" }}>
          <Link
            to="/cart"
            style={linkStyle}
            onMouseOver={(e) => hoverEffect(e, "#555")}
            onMouseOut={(e) => hoverEffect(e, "transparent")}
          >
            Keranjang
          </Link>
        </li>

        {isAuthenticated && (
          <li style={{ marginRight: "20px" }}>
            <Link
              to="/my-orders" // Tautan baru untuk pesanan saya
              style={linkStyle}
              onMouseOver={(e) => hoverEffect(e, "#555")}
              onMouseOut={(e) => hoverEffect(e, "transparent")}
            >
              Pesanan Saya
            </Link>
          </li>
        )}

        {/* Admin Dashboard Link */}
        {isAuthenticated && user?.role === "admin" && (
          <li style={{ marginRight: "20px" }}>
            <Link
              to="/admin"
              style={{ ...linkStyle, backgroundColor: "#007bff" }}
              onMouseOver={(e) => hoverEffect(e, "#0056b3")}
              onMouseOut={(e) => hoverEffect(e, "#007bff")}
            >
              Dashboard Admin
            </Link>
          </li>
        )}

        <li style={{ flexGrow: 1 }}></li>

        {isAuthenticated ? (
          <>
            <li style={{ marginRight: "20px" }}>
              Hai, {user?.username || "Pengguna"}
            </li>
            <li>
              <button
                onClick={logout}
                style={{
                  ...linkStyle,
                  backgroundColor: "#555",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li style={{ marginRight: "10px" }}>
              <Link
                to="/login"
                style={linkStyle}
                onMouseOver={(e) => hoverEffect(e, "#555")}
                onMouseOut={(e) => hoverEffect(e, "transparent")}
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                style={linkStyle}
                onMouseOver={(e) => hoverEffect(e, "#555")}
                onMouseOut={(e) => hoverEffect(e, "transparent")}
              >
                Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
