import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const API_BASE = "http://localhost:5000/api";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("iw_token"));
  const [loading, setLoading] = useState(true);

  // On mount, rehydrate user from token
  useEffect(() => {
    if (token) {
      fetchCurrentUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  async function fetchCurrentUser(authToken) {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
      } else {
        logout();
      }
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  }

  async function login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || "Login failed");
    persist(data.token, data.user);
    return data.user;
  }

  async function signup(firstName, lastName, email, phone, password, confirmPassword) {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, email, phone, password, confirmPassword }),
    });
    const data = await res.json();
    if (!data.success) {
      // surface validation errors nicely
      const msg = data.errors
        ? data.errors.map((e) => e.msg).join(", ")
        : data.message || "Signup failed";
      throw new Error(msg);
    }
    persist(data.token, data.user);
    return data.user;
  }

  function persist(authToken, userData) {
    localStorage.setItem("iw_token", authToken);
    setToken(authToken);
    setUser(userData);
  }

  function logout() {
    localStorage.removeItem("iw_token");
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
