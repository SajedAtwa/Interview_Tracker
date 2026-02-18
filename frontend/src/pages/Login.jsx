import React, { useState } from "react";
import api from "../api.js";
import { setToken } from "../auth.js";

export default function Login({ onAuthed }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/api/auth/login", { email, password });

      const token = res.data?.token || res.data?.jwt || res.data?.accessToken || res.data;

      if (!token || typeof token !== "string") {
        throw new Error("Login response did not include a token.");
      }

      setToken(token);
      onAuthed();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data ||
          err.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="authPage">
      <h2 className="authTitle">Login</h2>

      <form onSubmit={submit} className="authForm">
        <label className="authLabel">
          Email
          <input
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. test@example.com"
            autoComplete="email"
          />
        </label>

        <label className="authLabel">
          Password
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            autoComplete="current-password"
          />
        </label>

        <button className="btn btnPrimary authSubmit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && <div className="alert alertError">{String(error)}</div>}
      </form>
    </div>
  );
}