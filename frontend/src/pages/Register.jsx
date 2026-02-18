import React, { useState } from "react";
import api from "../api.js";

export default function Register({ onGoLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setOk("");
    setLoading(true);

    try {
      await api.post("/api/auth/register", { email, password });
      setOk("Registered successfully.");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data ||
          err.message ||
          "Register failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="authPage">
      <h2 className="authTitle">Register</h2>

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
            autoComplete="new-password"
          />
        </label>

        <button className="btn btnPrimary authSubmit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        {ok && (
          <div className="alert alertOk">
            {ok}{" "}
            <button type="button" className="linkBtn" onClick={onGoLogin}>
              Go to Login →
            </button>
          </div>
        )}

        {error && <div className="alert alertError">{String(error)}</div>}
      </form>
    </div>
  );
}