"use client";

export default function SectionTable({
  titleEn,
  titleAr,
  subtitleEn,
  subtitleAr,
  groups,
  notes,
  setNotes,
  overallRate,
  setOverallRate,
  generalNotes,
  setGeneralNotes,
}) {
  return (
    <section style={wrap}>
      <div style={header}>
        <div style={{ fontWeight: 800 }}>{titleEn}</div>
        <div dir="rtl" style={{ fontWeight: 800 }}>
          {titleAr}
        </div>
      </div>

      {subtitleEn || subtitleAr ? (
        <div style={subHeader}>
          <div style={{ fontWeight: 700 }}>{subtitleEn || ""}</div>
          <div dir="rtl" style={{ fontWeight: 700 }}>
            {subtitleAr || ""}
          </div>
        </div>
      ) : null}

      <div style={{ overflowX: "auto" }}>
        <table style={table}>
          <thead>
            <tr>
              <th style={{ ...th, width: 220 }}>Category / القسم</th>
              <th style={th}>Check Item / بند الفحص</th>
              <th style={{ ...th, width: 320 }}>Notes / ملاحظات</th>
            </tr>
          </thead>

          <tbody>
            {groups.map((g) => (
              <GroupRows
                key={g.groupId}
                group={g}
                notes={notes}
                setNotes={setNotes}
              />
            ))}

            {!!setOverallRate && (
              <tr>
                <td style={tdTitle}>Overall Condition Rate</td>
                <td style={td} colSpan={2}>
                  <select
                    value={overallRate}
                    onChange={(e) => setOverallRate(e.target.value)}
                    style={select}
                  >
                    <option value="">Select / اختر</option>
                    <option value="1">1 - Poor</option>
                    <option value="2">2</option>
                    <option value="3">3 - OK</option>
                    <option value="4">4</option>
                    <option value="5">5 - Excellent</option>
                  </select>
                </td>
              </tr>
            )}

            {!!setGeneralNotes && (
              <tr>
                <td style={tdTitle} dir="rtl">
                  ملاحظات عامة
                  <div style={{ fontSize: 12, color: "#666" }}>General Notes</div>
                </td>
                <td style={td} colSpan={2}>
                  <textarea
                    value={generalNotes}
                    onChange={(e) => setGeneralNotes(e.target.value)}
                    placeholder="Write general notes for this section..."
                    style={taBig}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function GroupRows({ group, notes, setNotes }) {
  const rowCount = group.items.length;

  return (
    <>
      {group.items.map((it, idx) => (
        <tr key={it.itemId}>
          {idx === 0 ? (
            <td style={tdGroup} rowSpan={rowCount}>
              <div style={{ fontWeight: 800 }}>{group.groupEn}</div>
              <div dir="rtl" style={{ color: "#666", fontWeight: 700 }}>
                {group.groupAr}
              </div>
            </td>
          ) : null}

          <td style={td}>
            <div style={{ fontWeight: 700 }}>{it.itemEn}</div>
            <div dir="rtl" style={{ color: "#666" }}>
              {it.itemAr}
            </div>
          </td>

          <td style={td}>
            <textarea
              value={notes[it.itemId] || ""}
              onChange={(e) =>
                setNotes((p) => ({ ...p, [it.itemId]: e.target.value }))
              }
              placeholder="..."
              style={ta}
            />
          </td>
        </tr>
      ))}
    </>
  );
}

const wrap = {
  border: "1px solid #ddd",
  borderRadius: 14,
  overflow: "hidden",
  background: "#fff",
};

const header = {
  background: "#000",
  color: "#fff",
  padding: "10px 14px",
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
};

const subHeader = {
  background: "#e5e5e5",
  padding: "8px 14px",
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
};

const th = {
  textAlign: "left",
  background: "#f2f2f2",
  borderBottom: "1px solid #ddd",
  padding: 10,
  fontWeight: 800,
  fontSize: 13,
};

const td = {
  borderBottom: "1px solid #eee",
  padding: 10,
  verticalAlign: "top",
  fontSize: 13,
};

const tdGroup = {
  ...td,
  background: "#fafafa",
  borderRight: "1px solid #eee",
};

const tdTitle = {
  ...td,
  background: "#f7f7f7",
  fontWeight: 800,
  width: 220,
};

const ta = {
  width: "100%",
  minHeight: 60,
  padding: 10,
  borderRadius: 10,
  border: "1px solid #ddd",
  fontFamily: "system-ui",
  fontSize: 13,
};

const taBig = {
  ...ta,
  minHeight: 110,
};

const select = {
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #ddd",
  cursor: "pointer",
  fontWeight: 700,
};
