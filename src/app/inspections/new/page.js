export default function NewInspection() {
  return (
    <main style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>New Inspection / كشف جديد</h1>
      <p>Select type / اختر النوع</p>

      <div style={{ marginTop: 16, display: "grid", gap: 12, maxWidth: 420 }}>
        <a
          href="/inspections/new/cruiser"
          style={{ padding: 14, border: "1px solid #eee", borderRadius: 12 }}
        >
          🛞 Cruiser / كروزر
        </a>

        <a
          href="/inspections/new/sport"
          style={{ padding: 14, border: "1px solid #eee", borderRadius: 12 }}
        >
          🏍️ Sport / سبورت
        </a>

        <a
          href="/inspections/new/scooter"
          style={{ padding: 14, border: "1px solid #eee", borderRadius: 12 }}
        >
          🛵 Scooter / سكوتر
        </a>
      </div>

      <p style={{ marginTop: 16, color: "#666" }}>
        More types later (Touring…)
      </p>
    </main>
  );
}
