"use client";

import { useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data?.error || "Login failed");
      } else {
        localStorage.setItem("mcs_user", JSON.stringify(data));
window.location.href = "/dashboard";
      }
    } catch (err) {
      setMsg("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", fontFamily: "system-ui" }}>
      <form onSubmit={onSubmit} style={{ width: 360, padding: 24, border: "1px solid #eee", borderRadius: 16 }}>
        <h1 style={{ margin: 0 }}>MCS Inspection System</h1>
        <p style={{ marginTop: 8, color: "#666" }}>Login / تسجيل الدخول</p>

        <label style={{ display: "block", marginTop: 16 }}>Username</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="A"
          style={{ width: "100%", padding: 12, borderRadius: 10, border: "1px solid #ddd" }}
          required
        />

        <label style={{ display: "block", marginTop: 12 }}>Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="••••••••"
          style={{ width: "100%", padding: 12, borderRadius: 10, border: "1px solid #ddd" }}
          required
        />

        <button
          disabled={loading}
          style={{
            width: "100%",
            marginTop: 16,
            padding: 12,
            borderRadius: 10,
            border: "none",
            background: "#e60000",
            color: "white",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

        {msg && <div style={{ marginTop: 12 }}>{msg}</div>}
      </form>
    </main>
  );
}
