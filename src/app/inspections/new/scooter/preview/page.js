"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getNextInspectionNo, saveReport } from "@/lib/offlineStore";

function InfoRow({ label, value }) {
  return (
    <div style={row}>
      <div style={{ fontWeight: 800 }}>{label}</div>
      <div style={{ color: "#333" }}>{value ?? "-"}</div>
    </div>
  );
}

function YesNoText(v) {
  return v ? "✓" : "-";
}

export default function ScooterPreviewPage() {
  const router = useRouter();
  const [draft, setDraft] = useState(null);

  // ملاحظات إضافية للفني في الـ Preview (لو حابب)
  const [extraNotes, setExtraNotes] = useState({
    technicianNotes: "",
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("draft_scooter_inspection") || "null");
    setDraft(stored);
  }, []);

  const canSave = useMemo(() => {
    return !!draft?.customer?.phone;
  }, [draft]);

  const onSave = () => {
    if (!canSave) {
      alert("Phone is required. رقم الموبايل مطلوب.");
      return;
    }

    const inspectionNo = getNextInspectionNo();

    const customerName = draft?.customer?.owner || null;
    const phone = draft?.customer?.phone || null;

    const motorcycleTitle =
      [draft?.motorcycle?.brand, draft?.motorcycle?.model].filter(Boolean).join(" ") || null;

    const report = {
      inspectionNo,
      date: new Date().toISOString(),
      type: "scooter",

      // عشان جدول /saved
      customerName,
      phone,
      motorcycle: motorcycleTitle,

      // البيانات الكاملة
      data: draft,

      // ملاحظات زيادة
      extraNotes,
    };

    saveReport(report);
    localStorage.removeItem("draft_scooter_inspection");
    router.push("/saved");
  };

  if (!draft) {
    return (
      <main style={{ padding: 24, fontFamily: "system-ui" }}>
        <h1 style={{ marginTop: 0 }}>Scooter Preview</h1>
        <p style={{ color: "#666" }}>مفيش بيانات Preview… ارجع للفورم.</p>

        <button onClick={() => router.push("/inspections/new/scooter")} style={btn}>
          Back to Form
        </button>
      </main>
    );
  }

  const titleSituation = draft?.detailed?.titleCondition?.titleSituation || {};
  const ecuFaults = draft?.detailed?.titleCondition?.ecuFaults || "";

  const damage = draft?.damage || {};
  const dmgCounts = {
    left: damage.left?.length ?? 0,
    right: damage.right?.length ?? 0,
    front: damage.front?.length ?? 0,
    back: damage.back?.length ?? 0,
    top: damage.top?.length ?? 0,
  };

  return (
    <main style={{ padding: 24, fontFamily: "system-ui", maxWidth: 1050, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ marginTop: 0 }}>Scooter Preview</h1>
          <p style={{ marginTop: 6, color: "#666" }} dir="rtl">
            راجع البيانات قبل الحفظ النهائي.
          </p>
        </div>

        <button onClick={() => router.push("/inspections/new/scooter")} style={btn}>
          Back
        </button>
      </div>

      {/* Page 1 Summary */}
      <section style={card}>
        <h2 style={{ marginTop: 0 }}>Motorcycle & Customer Info</h2>

        <div style={grid2}>
          <InfoRow label="Owner" value={draft?.customer?.owner} />
          <InfoRow label="Phone" value={draft?.customer?.phone} />

          <InfoRow label="Brand" value={draft?.motorcycle?.brand} />
          <InfoRow label="Model" value={draft?.motorcycle?.model} />

          <InfoRow label="Year" value={draft?.motorcycle?.year} />
          <InfoRow label="Engine Size" value={draft?.motorcycle?.engineSize} />

          <InfoRow label="Plate Number" value={draft?.motorcycle?.plate} />
          <InfoRow label="License Validity" value={draft?.motorcycle?.licenseValidity} />

          <InfoRow label="Mileage" value={draft?.motorcycle?.mileage} />
          <InfoRow label="Motor Number" value={draft?.motorcycle?.motorNumber} />

          <InfoRow label="VIN" value={draft?.motorcycle?.vin} />
          <InfoRow label="Color" value={draft?.motorcycle?.color} />

          <InfoRow label="Date" value={draft?.meta?.date} />
          <InfoRow label="Time" value={draft?.meta?.time} />

          <InfoRow label="Reception Engineer" value={draft?.meta?.receptionEngineer} />
          <InfoRow label="Customer Signature" value={draft?.meta?.customerSignature} />
        </div>

        <div style={{ marginTop: 12 }}>
          <div style={{ fontWeight: 900 }}>Customer Notes</div>
          <div style={box}>{draft?.meta?.customerNotes || "-"}</div>
        </div>
      </section>

      {/* Damage Summary */}
      <section style={card}>
        <h2 style={{ marginTop: 0 }}>Damage Marks Summary</h2>
        <div style={grid2}>
          <InfoRow label="Left marks" value={dmgCounts.left} />
          <InfoRow label="Right marks" value={dmgCounts.right} />
          <InfoRow label="Front marks" value={dmgCounts.front} />
          <InfoRow label="Back marks" value={dmgCounts.back} />
          <InfoRow label="Top marks" value={dmgCounts.top} />
        </div>
        <div style={{ marginTop: 10, color: "#666", fontSize: 13 }} dir="rtl">
          * العلامات هتظهر على الصور بشكل مطابق في صفحة الطباعة.
        </div>
      </section>

      {/* Title Condition & ECU (ملخص) */}
      <section style={card}>
        <h2 style={{ marginTop: 0 }}>Title Condition & ECU</h2>

        <div style={grid2}>
          <InfoRow label="Clean Title" value={YesNoText(titleSituation.clean)} />
          <InfoRow label="Salvage Title" value={YesNoText(titleSituation.salvage)} />
          <InfoRow label="Rebuilt Title" value={YesNoText(titleSituation.rebuilt)} />
          <InfoRow label="Flood Title" value={YesNoText(titleSituation.flood)} />
          <InfoRow label="Theft Title" value={YesNoText(titleSituation.theft)} />
        </div>

        <div style={{ marginTop: 12 }}>
          <div style={{ fontWeight: 900 }}>ECU Faults</div>
          <div style={box}>{ecuFaults || "-"}</div>
        </div>
      </section>

      {/* Extra Notes */}
      <section style={card}>
        <h2 style={{ marginTop: 0 }}>Extra Technician Notes (Optional)</h2>
        <textarea
          value={extraNotes.technicianNotes}
          onChange={(e) => setExtraNotes({ technicianNotes: e.target.value })}
          placeholder="Any extra notes before saving..."
          style={ta}
        />
      </section>

      {/* Actions */}
      <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
        <button onClick={() => router.push("/inspections/new/scooter")} style={btn}>
          Back
        </button>

        <button onClick={onSave} disabled={!canSave} style={btnPrimary}>
          Save Inspection
        </button>
      </div>
    </main>
  );
}

const card = {
  border: "1px solid #eee",
  borderRadius: 16,
  padding: 16,
  background: "#fff",
  marginTop: 14,
};

const grid2 = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 10,
};

const row = {
  border: "1px solid #f0f0f0",
  borderRadius: 12,
  padding: 10,
  background: "#fafafa",
};

const box = {
  marginTop: 6,
  border: "1px solid #eee",
  borderRadius: 12,
  padding: 12,
  background: "#fafafa",
  minHeight: 50,
  whiteSpace: "pre-wrap",
};

const ta = {
  width: "100%",
  minHeight: 110,
  padding: 10,
  fontSize: 14,
  border: "1px solid #ddd",
  borderRadius: 10,
  fontFamily: "system-ui",
};

const btn = {
  padding: "10px 14px",
  cursor: "pointer",
  border: "1px solid #ddd",
  borderRadius: 10,
  background: "#fff",
};

const btnPrimary = {
  ...btn,
  border: "1px solid #222",
  background: "#222",
  color: "#fff",
};
