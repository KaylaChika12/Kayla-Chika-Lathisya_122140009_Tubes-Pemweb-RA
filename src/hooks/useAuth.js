import { useState } from "react";
import Cookies from "js-cookie";
import { useToast } from "./useToast"; // Import useToast

const API_URL = "http://localhost:6543";

// Custom hook for authentication logic
export function useAuth() {
  const [user, setUser] = useState(() => {
    try {
      const storedUserCookie = Cookies.get("user_info");
      return storedUserCookie ? JSON.parse(storedUserCookie) : null;
    } catch (e) {
      console.error("Failed to parse user_info cookie:", e);
      return null;
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Keep local error state for hook, but also use toast
  const { displayToast } = useToast(); // Use the toast hook

  // Handles user login
  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        const errorMessage = data.error || data.message || "Login failed";
        setError(errorMessage);
        displayToast(errorMessage, "error"); // Show toast for login error
        setLoading(false);
        return false;
      }

      const userInfoToStore = {
        id: data.user.id,
        username: data.user.username,
        email: data.user.email,
        role: data.user.role,
      };
      Cookies.set("user_info", JSON.stringify(userInfoToStore), {
        expires: 7,
        secure: false,
        sameSite: "Lax",
      });

      setUser(userInfoToStore);
      setLoading(false);

      window.location.href = "/";
      return true;
    } catch (err) {
      console.error("Login request failed:", err);
      const errorMessage =
        "An unexpected error occurred during login. Please try again.";
      setError(errorMessage);
      displayToast(errorMessage, "error"); // Show toast for network/unexpected error
      setLoading(false);
      return false;
    }
  };

  // Handles user registration
  const register = async (username, email, password) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        const errorMessage =
          data.error || data.message || "Registration failed";
        setError(errorMessage);
        displayToast(errorMessage, "error"); // Show toast for registration error
        setLoading(false);
        return false;
      }

      setLoading(false);
      return true;
    } catch (err) {
      console.error("Registration request failed:", err);
      const errorMessage =
        "An unexpected error occurred during registration. Please try again.";
      setError(errorMessage);
      displayToast(errorMessage, "error"); // Show toast for network/unexpected error
      setLoading(false);
      return false;
    }
  };

  // Handles user logout
  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await fetch(`${API_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });
      displayToast("Anda telah berhasil logout.", "info"); // Show toast for logout
    } catch (err) {
      console.error("Error during backend logout:", err);
      displayToast("Terjadi kesalahan saat logout.", "error"); // Show toast for logout error
    } finally {
      Cookies.remove("auth_tkt");
      Cookies.remove("user_info");
      setUser(null);
      setLoading(false);
      window.location.href = "/login";
    }
  };

  // Checks current session status based on cookies
  const checkSession = () => {
    const authToken = Cookies.get("auth_tkt");
    const storedUserCookie = Cookies.get("user_info");
    let currentUser = null;

    if (storedUserCookie) {
      try {
        currentUser = JSON.parse(storedUserCookie);
      } catch (e) {
        console.error(
          "Failed to parse user_info cookie during session check:",
          e
        );
        Cookies.remove("user_info");
        currentUser = null;
      }
    }

    const isValid = !!authToken && !!currentUser;

    return {
      isValid,
      user: isValid ? currentUser : null,
    };
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user && !!Cookies.get("auth_tkt"),
    checkSession,
  };
}
