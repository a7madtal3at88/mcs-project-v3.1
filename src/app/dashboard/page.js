export default function Dashboard() {
  return (
    <main style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>MCS Inspection System</h1>
      <p>Dashboard / لوحة التحكم</p>

      <div style={{ marginTop: 16, display: "grid", gap: 12, maxWidth: 420 }}>
        <a href="/inspections/new" style={{ padding: 14, border: "1px solid #eee", borderRadius: 12 }}>
          ➕ New Inspection / كشف جديد
        </a>

        <a href="/inspections" style={{ padding: 14, border: "1px solid #eee", borderRadius: 12 }}>
          📄 Inspections List / كل الكشوفات
        </a>

        <a href="/customers" style={{ padding: 14, border: "1px solid #eee", borderRadius: 12 }}>
          👤 Customers / العملاء
        </a>
      </div>
    </main>
  );
}
