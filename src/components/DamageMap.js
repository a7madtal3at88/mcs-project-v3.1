"use client";

import { useMemo, useState } from "react";

const DAMAGE_TYPES = [
  { key: "scratch", label: "Scratch / خدش" },
  { key: "dent", label: "Dent / خبطة" },
  { key: "crack", label: "Crack / كسر" },
  { key: "other", label: "Other / أخرى" },
];

export default function DamageMap({ title, imageSrc, points, onChange }) {
  const [type, setType] = useState("dent");
  const [note, setNote] = useState("");

  const safePoints = useMemo(() => Array.isArray(points) ? points : [], [points]);

  const addPoint = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;  // 0..1
    const y = (e.clientY - rect.top) / rect.height;  // 0..1

    const id =
      (typeof crypto !== "undefined" && crypto.randomUUID && crypto.randomUUID()) ||
      `${Date.now()}_${Math.random().toString(16).slice(2)}`;

    const newPoint = {
      id,
      x,
      y,
      type,
      note: note || "",
      createdAt: new Date().toISOString(),
    };

    onChange([...safePoints, newPoint]);
    setNote("");
  };

  const removePoint = (id) => {
    onChange(safePoints.filter((p) => p.id !== id));
  };

  return (
    <div style={card}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <h3 style={{ margin: 0 }}>{title}</h3>

        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <select value={type} onChange={(e) => setType(e.target.value)} style={select}>
            {DAMAGE_TYPES.map((t) => (
              <option key={t.key} value={t.key}>{t.label}</option>
            ))}
          </select>

          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Note (optional) / ملاحظة"
            style={input}
          />
          <span style={{ color: "#666", fontSize: 12 }}>
            اضغط على الصورة لإضافة نقطة
          </span>
        </div>
      </div>

      <div style={mapWrap} onClick={addPoint}>
        <img src={imageSrc} alt={title} style={img} />

        {safePoints.map((p, idx) => (
          <div
            key={p.id}
            title={`${idx + 1} - ${p.type}${p.note ? " - " + p.note : ""}`}
            style={{
              ...dot,
              left: `${p.x * 100}%`,
              top: `${p.y * 100}%`,
            }}
            onClick={(ev) => {
              ev.stopPropagation();
              if (confirm("Delete this mark? / مسح العلامة دي؟")) removePoint(p.id);
            }}
          >
            {idx + 1}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 10, color: "#666", fontSize: 13 }}>
        العلامات: {safePoints.length} (اضغط على العلامة لمسحها)
      </div>
    </div>
  );
}

const card = {
  border: "1px solid #eee",
  borderRadius: 16,
  padding: 14,
  background: "#fff",
};

const mapWrap = {
  marginTop: 12,
  border: "1px solid #eee",
  borderRadius: 14,
  overflow: "hidden",
  position: "relative",
  cursor: "crosshair",
};

const img = {
  width: "100%",
  height: "auto",
  display: "block",
};

const dot = {
  position: "absolute",
  transform: "translate(-50%, -50%)",
  width: 26,
  height: 26,
  borderRadius: 999,
  background: "#d10000",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 800,
  fontSize: 12,
  border: "2px solid #fff",
  boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
  userSelect: "none",
};

const select = {
  padding: "8px 10px",
  borderRadius: 10,
  border: "1px solid #ddd",
  cursor: "pointer",
};

const input = {
  padding: "8px 10px",
  borderRadius: 10,
  border: "1px solid #ddd",
  minWidth: 220,
};
