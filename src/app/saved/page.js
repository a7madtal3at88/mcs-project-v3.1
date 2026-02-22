"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getReports,
  clearReports,
  exportBackupData,
  importBackupData,
} from "@/lib/offlineStore";

function fmtDate(iso) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso || "-";
  }
}

function safeStr(v) {
  if (v === null || v === undefined || v === "") return "-";
  return String(v);
}

export default function SavedInspectionsPage() {
  const router = useRouter();
  const [reports, setReports] = useState([]);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setReports(getReports());
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return reports;

    return reports.filter((r) => {
      const hay = [r.inspectionNo, r.customerName, r.phone, r.motorcycle, r.type, r.date]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(s);
    });
  }, [q, reports]);

  function onClearAll() {
    const ok = confirm("Clear all saved inspections from this device?");
    if (!ok) return;
    clearReports();
    setReports([]);
  }

  async function onExportBackup() {
    try {
      setBusy(true);
      const data = exportBackupData();
      const json = JSON.stringify(data, null, 2);

      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
      a.href = url;
      a.download = `mcs-backup-${stamp}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      URL.revokeObjectURL(url);
    } catch (e) {
      alert(e?.message || "Export failed");
    } finally {
      setBusy(false);
    }
  }

  async function onImportBackupFile(file) {
    try {
      setBusy(true);
      const text = await file.text();
      const backup = JSON.parse(text);

      const res = importBackupData(backup);
      setReports(getReports());

      alert(`Imported ✅\nReports: ${res.reportsCount}\nCounter: ${res.counter}`);
    } catch (e) {
      alert(e?.message || "Import failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{ padding: 24, fontFamily: "system-ui", maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ margin: 0 }}>Saved Inspections</h1>
          <div dir="rtl" style={{ color: "#666" }}>
            التقارير دي متخزنة على نفس الجهاز (Offline).
          </div>
        </div>

        <button onClick={() => router.push("/")} style={btn} disabled={busy}>
          Back to Home
        </button>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by inspection no / customer / bike..."
          style={search}
          disabled={busy}
        />

        <button onClick={onExportBackup} style={btn} disabled={busy}>
          {busy ? "Working..." : "Export Backup"}
        </button>

        <label
          style={{
            ...btn,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            cursor: busy ? "not-allowed" : "pointer",
            opacity: busy ? 0.6 : 1,
            userSelect: "none",
          }}
        >
          Import Backup
          <input
            type="file"
            accept="application/json"
            style={{ display: "none" }}
            disabled={busy}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onImportBackupFile(f);
              e.target.value = "";
            }}
          />
        </label>

        <button onClick={onClearAll} style={btn} disabled={busy}>
          Clear All
        </button>
      </div>

      <div style={{ marginTop: 12, fontWeight: 800 }}>Total: {filtered.length}</div>

      <div style={{ marginTop: 10, overflowX: "auto" }}>
        <table style={tbl}>
          <thead>
            <tr>
              <th style={th}>Inspection No</th>
              <th style={th}>Date</th>
              <th style={th}>Customer</th>
              <th style={th}>Motorcycle</th>
              <th style={th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, index) => (
              <tr key={`${r.inspectionNo}-${index}`}>
                <td style={{ ...td, fontWeight: 900 }}>{r.inspectionNo}</td>
                <td style={td}>{fmtDate(r.date)}</td>
                <td style={td}>{safeStr(r.customerName)}</td>
                <td style={td}>{safeStr(r.motorcycle)}</td>
                <td style={td}>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button onClick={() => router.push(`/saved/${r.inspectionNo}`)} style={btnSmall} disabled={busy}>
                      View
                    </button>
                    <button
                      onClick={() => window.open(`/print/${r.inspectionNo}`, "_blank")}
                      style={btnSmall}
                      disabled={busy}
                    >
                      Print
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filtered.length === 0 ? (
              <tr>
                <td style={td} colSpan={5}>
                  No reports found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </main>
  );
}

const btn = {
  padding: "10px 14px",
  cursor: "pointer",
  border: "1px solid #ddd",
  borderRadius: 10,
  background: "#fff",
  fontWeight: 800,
};

const btnSmall = {
  padding: "8px 12px",
  cursor: "pointer",
  border: "1px solid #ddd",
  borderRadius: 10,
  background: "#fff",
  fontWeight: 700,
};

const search = {
  flex: 1,
  minWidth: 280,
  padding: 12,
  border: "1px solid #ddd",
  borderRadius: 12,
};

const tbl = {
  width: "100%",
  borderCollapse: "collapse",
};

const th = {
  textAlign: "left",
  borderBottom: "1px solid #ddd",
  padding: 10,
  background: "#f4f4f4",
  fontWeight: 900,
};

const td = {
  borderBottom: "1px solid #eee",
  padding: 10,
  verticalAlign: "top",
};