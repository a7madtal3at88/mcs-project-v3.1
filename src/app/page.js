"use client";

import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const wrap = {
    minHeight: "100vh",
    padding: 24,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily:
      "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
    background:
      "radial-gradient(1000px 600px at 20% 10%, rgba(209,0,0,0.08), transparent 60%)," +
      "linear-gradient(180deg, #fafafa, #f3f4f6)",
  };

  const card = {
    width: "min(950px, 100%)",
    background: "#fff",
    borderRadius: 18,
    boxShadow:
      "0 10px 30px rgba(0,0,0,0.08), 0 1px 0 rgba(255,255,255,0.7) inset",
    overflow: "hidden",
  };

  const header = {
    padding: "28px 28px 20px",
    borderBottom: "1px solid rgba(0,0,0,0.06)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  };

  const brand = {
    display: "flex",
    alignItems: "center",
    gap: 20,
  };

  const title = {
    margin: 0,
    fontSize: 22,
    fontWeight: 800,
  };

  const sub = {
    margin: "6px 0 0",
    color: "#6b7280",
    fontSize: 13,
  };

  const body = {
    padding: 28,
  };

  const grid = {
    display: "grid",
    gridTemplateColumns: "repeat(12, 1fr)",
    gap: 18,
    marginTop: 20,
  };

  const cardMini = {
    gridColumn: "span 6",
    border: "1px solid rgba(0,0,0,0.08)",
    borderRadius: 16,
    padding: 22,
    background: "linear-gradient(180deg, #fff, #fafafa)",
  };

  const miniTitle = {
    margin: 0,
    fontSize: 15,
    fontWeight: 800,
  };

  const miniDesc = {
    margin: "8px 0 0",
    fontSize: 13,
    color: "#6b7280",
    lineHeight: 1.5,
  };

  const btnBase = {
    padding: "12px 18px",
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    border: "1px solid rgba(0,0,0,0.10)",
    background: "#fff",
  };

  const btnPrimary = {
    ...btnBase,
    border: "1px solid rgba(209,0,0,0.5)",
    background: "linear-gradient(135deg, #d10000, #9b0000)",
    color: "#fff",
    boxShadow: "0 10px 18px rgba(209,0,0,0.18)",
  };

  const footer = {
    padding: "14px 28px",
    borderTop: "1px solid rgba(0,0,0,0.06)",
    fontSize: 12,
    color: "#6b7280",
    display: "flex",
    justifyContent: "space-between",
  };

  return (
    <main style={wrap}>
      <div style={card}>
        <div style={header}>
          <div style={brand}>
            <Image
              src="/logo.png"
              alt="MCS Motorcycle Station"
              width={170}
              height={70}
              style={{ objectFit: "contain" }}
              priority
            />
            <div>
              <h1 style={title}>Inspection System</h1>
              <p style={sub}>Professional Motorcycle Inspection Platform</p>
            </div>
          </div>

          <div
            style={{
              padding: "8px 12px",
              borderRadius: 999,
              background: "rgba(0,0,0,0.05)",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            Offline Version
          </div>
        </div>

        <div style={body}>
          <div style={grid}>
            <div style={cardMini}>
              <h3 style={miniTitle}>New Inspection</h3>
              <p style={miniDesc}>
                Create a new Cruiser, Sport, or Scooter inspection report and
                generate printable results.
              </p>
              <div style={{ marginTop: 16 }}>
                <Link href="/inspections/new" style={{ textDecoration: "none" }}>
                  <button style={btnPrimary}>Start Inspection</button>
                </Link>
              </div>
            </div>

            <div style={cardMini}>
              <h3 style={miniTitle}>Saved Reports</h3>
              <p style={miniDesc}>
                View saved inspection reports, open details, and print anytime.
              </p>
              <div style={{ marginTop: 16 }}>
                <Link href="/saved" style={{ textDecoration: "none" }}>
                  <button style={btnBase}>Open Saved Reports</button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div style={footer}>
          <div>© {new Date().getFullYear()} MCS Motorcycle Station</div>
          <div>System Version 1.0</div>
        </div>
      </div>
    </main>
  );
}