"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getReports } from "@/lib/offlineStore";

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

function SectionBlock({ titleEn, titleAr, section }) {
  if (!section) return null;

  const notes = section.notes || {};
  const overallRate = section.overallRate || "";
  const generalNotes = section.generalNotes || "";

  const rows = Object.entries(notes)
    .map(([k, v]) => ({ key: k, value: v }))
    .filter((x) => (x.value || "").trim() !== "");

  return (
    <div style={paperBlock}>
      <div style={blockHeader}>
        <div style={{ fontWeight: 900 }}>{titleEn}</div>
        <div dir="rtl" style={{ fontWeight: 900 }}>
          {titleAr}
        </div>
      </div>

      <div style={{ padding: 12 }}>
        {rows.length === 0 ? (
          <div style={{ color: "#666" }} dir="rtl">
            لا توجد ملاحظات مكتوبة في هذا القسم.
          </div>
        ) : (
          <table style={tbl}>
            <thead>
              <tr>
                <th style={th}>Item</th>
                <th style={th}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.key}>
                  <td style={tdKey}>{r.key}</td>
                  <td style={td}>{r.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div style={infoBox}>
            <div style={{ fontWeight: 900 }}>Overall Rate</div>
            <div>{overallRate ? overallRate : "-"}</div>
          </div>
          <div style={infoBox}>
            <div style={{ fontWeight: 900 }}>General Notes</div>
            <div style={{ whiteSpace: "pre-wrap" }}>{generalNotes ? generalNotes : "-"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SavedInspectionDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const inspectionNo = params?.inspectionNo;

  const [reports, setReports] = useState([]);

  useEffect(() => {
    setReports(getReports());
  }, []);

  const selected = useMemo(() => {
    if (!inspectionNo) return null;
    return reports.find((r) => r.inspectionNo === inspectionNo) || null;
  }, [inspectionNo, reports]);

  if (!inspectionNo) {
    return (
      <main style={{ padding: 24, fontFamily: "system-ui" }}>
        <h1>Saved Inspection</h1>
        <p>Missing inspection number.</p>
        <button onClick={() => router.push("/saved")} style={btn}>
          Back
        </button>
      </main>
    );
  }

  if (!selected) {
    return (
      <main style={{ padding: 24, fontFamily: "system-ui", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
          <div>
            <h1 style={{ margin: 0 }}>Saved Inspection</h1>
            <div style={{ color: "#666" }}>{inspectionNo}</div>
          </div>

          <button onClick={() => router.push("/saved")} style={btn}>
            Back to Saved
          </button>
        </div>

        <div style={{ marginTop: 14, padding: 14, border: "1px solid #eee", borderRadius: 14 }}>
          Report not found on this device.
        </div>
      </main>
    );
  }

  return (
    <main style={{ padding: 24, fontFamily: "system-ui", maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ margin: 0 }}>{selected.inspectionNo}</h1>
          <div style={{ color: "#666" }}>{fmtDate(selected.date)}</div>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button onClick={() => router.push("/saved")} style={btn}>
            Back to Saved
          </button>

          <button onClick={() => window.open(`/print/${selected.inspectionNo}`, "_blank")} style={btnPrimary}>
            Print
          </button>
        </div>
      </div>

      <div style={{ marginTop: 14, display: "grid", gap: 12 }}>
        {/* Info */}
        <div style={paperBlock}>
          <div style={blockHeader}>
            <div style={{ fontWeight: 900 }}>Customer & Motorcycle</div>
            <div dir="rtl" style={{ fontWeight: 900 }}>
              بيانات العميل والموتسيكل
            </div>
          </div>

          <div style={{ padding: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div style={infoBox}>
              <div style={{ fontWeight: 900 }}>Owner</div>
              <div>{safeStr(selected.data?.customer?.owner)}</div>
            </div>
            <div style={infoBox}>
              <div style={{ fontWeight: 900 }}>Phone</div>
              <div>{safeStr(selected.data?.customer?.phone)}</div>
            </div>

            <div style={infoBox}>
              <div style={{ fontWeight: 900 }}>Brand</div>
              <div>{safeStr(selected.data?.motorcycle?.brand)}</div>
            </div>
            <div style={infoBox}>
              <div style={{ fontWeight: 900 }}>Model</div>
              <div>{safeStr(selected.data?.motorcycle?.model)}</div>
            </div>

            <div style={infoBox}>
              <div style={{ fontWeight: 900 }}>Plate</div>
              <div>{safeStr(selected.data?.motorcycle?.plate)}</div>
            </div>
            <div style={infoBox}>
              <div style={{ fontWeight: 900 }}>VIN</div>
              <div>{safeStr(selected.data?.motorcycle?.vin)}</div>
            </div>

            <div style={infoBox}>
              <div style={{ fontWeight: 900 }}>Date</div>
              <div>{safeStr(selected.data?.meta?.date)}</div>
            </div>
            <div style={infoBox}>
              <div style={{ fontWeight: 900 }}>Time</div>
              <div>{safeStr(selected.data?.meta?.time)}</div>
            </div>
          </div>

          <div style={{ padding: 12, paddingTop: 0 }}>
            <div style={{ fontWeight: 900 }}>Customer Notes</div>
            <div style={notesBox}>{safeStr(selected.data?.meta?.customerNotes)}</div>
          </div>
        </div>

        {/* Title & ECU */}
        <div style={paperBlock}>
          <div style={blockHeader}>
            <div style={{ fontWeight: 900 }}>Title Condition & ECU</div>
            <div dir="rtl" style={{ fontWeight: 900 }}>
              حالة الوثيقة وقراءة الأعطال
            </div>
          </div>

          <div style={{ padding: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div style={infoBox}>
                <div style={{ fontWeight: 900 }}>Clean</div>
                <div>{selected.data?.detailed?.titleCondition?.titleSituation?.clean ? "✓" : "-"}</div>
              </div>
              <div style={infoBox}>
                <div style={{ fontWeight: 900 }}>Salvage</div>
                <div>{selected.data?.detailed?.titleCondition?.titleSituation?.salvage ? "✓" : "-"}</div>
              </div>
              <div style={infoBox}>
                <div style={{ fontWeight: 900 }}>Rebuilt</div>
                <div>{selected.data?.detailed?.titleCondition?.titleSituation?.rebuilt ? "✓" : "-"}</div>
              </div>
              <div style={infoBox}>
                <div style={{ fontWeight: 900 }}>Flood</div>
                <div>{selected.data?.detailed?.titleCondition?.titleSituation?.flood ? "✓" : "-"}</div>
              </div>
              <div style={infoBox}>
                <div style={{ fontWeight: 900 }}>Theft</div>
                <div>{selected.data?.detailed?.titleCondition?.titleSituation?.theft ? "✓" : "-"}</div>
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <div style={{ fontWeight: 900 }}>ECU Faults</div>
              <div style={notesBox}>{safeStr(selected.data?.detailed?.titleCondition?.ecuFaults)}</div>
            </div>
          </div>
        </div>

        {/* Sections */}
        <SectionBlock titleEn="Panels & Plastic Covers" titleAr="الفايبر والبلاستيك" section={selected.data?.detailed?.panelsAndPlastic} />
        <SectionBlock titleEn="Tires & Wheels" titleAr="الإطارات والجنوط" section={selected.data?.detailed?.tiresAndWheels} />
        <SectionBlock titleEn="Braking System" titleAr="نظام الفرامل" section={selected.data?.detailed?.brakingSystem} />
        <SectionBlock titleEn="Controlling System" titleAr="التحكم" section={selected.data?.detailed?.controllingSystem} />
        <SectionBlock titleEn="Steering System" titleAr="نظام التوجيه" section={selected.data?.detailed?.steeringSystem} />
        <SectionBlock titleEn="Engine" titleAr="المحرك" section={selected.data?.detailed?.engine} />
        <SectionBlock titleEn="Chassis" titleAr="الشاسيه" section={selected.data?.detailed?.chassis} />
        <SectionBlock titleEn="Cooling System" titleAr="دورة التبريد" section={selected.data?.detailed?.coolingSystem} />
        <SectionBlock titleEn="Charging System" titleAr="الشحن" section={selected.data?.detailed?.chargingSystem} />
        <SectionBlock titleEn="Exhaust System" titleAr="الشكمان" section={selected.data?.detailed?.exhaustSystem} />
        <SectionBlock titleEn="Electrical System" titleAr="الكهرباء" section={selected.data?.detailed?.electricalSystem} />
        <SectionBlock titleEn="Final Drive" titleAr="نقل الحركة" section={selected.data?.detailed?.finalDrive} />
        <SectionBlock titleEn="Others" titleAr="أخرى" section={selected.data?.detailed?.others} />

        {/* Test drive + summary */}
        <div style={paperBlock}>
          <div style={blockHeader}>
            <div style={{ fontWeight: 900 }}>Test Drive</div>
            <div dir="rtl" style={{ fontWeight: 900 }}>
              تجربة القيادة
            </div>
          </div>
          <div style={{ padding: 12 }}>
            <div style={notesBox}>{safeStr(selected.data?.detailed?.testDrive?.results)}</div>
          </div>
        </div>

        <div style={paperBlock}>
          <div style={blockHeader}>
            <div style={{ fontWeight: 900 }}>Final Inspection Summary</div>
            <div dir="rtl" style={{ fontWeight: 900 }}>
              ملخص الفحص
            </div>
          </div>
          <div style={{ padding: 12 }}>
            <div style={notesBox}>{safeStr(selected.data?.detailed?.finalInspectionSummary?.summary)}</div>
          </div>
        </div>
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
};

const btnPrimary = {
  padding: "10px 14px",
  cursor: "pointer",
  border: "1px solid #222",
  borderRadius: 10,
  background: "#222",
  color: "#fff",
  fontWeight: 900,
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

const tdKey = {
  borderBottom: "1px solid #eee",
  padding: 10,
  verticalAlign: "top",
  fontWeight: 900,
  width: 260,
  color: "#111",
};

const paperBlock = {
  border: "1px solid #eee",
  borderRadius: 14,
  overflow: "hidden",
  background: "#fff",
};

const blockHeader = {
  background: "#000",
  color: "#fff",
  padding: "10px 14px",
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
};

const infoBox = {
  border: "1px solid #eee",
  borderRadius: 12,
  padding: 10,
  background: "#fafafa",
};

const notesBox = {
  border: "1px solid #eee",
  borderRadius: 12,
  padding: 12,
  background: "#fafafa",
  whiteSpace: "pre-wrap",
  minHeight: 60,
};