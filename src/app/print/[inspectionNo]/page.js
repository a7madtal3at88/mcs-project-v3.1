"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getReports } from "@/lib/offlineStore";

function safe(v) {
  if (v === null || v === undefined) return "";
  return String(v);
}
function fmtDate(iso) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso || "";
  }
}
function slug(s) {
  return String(s || "")
    .toLowerCase()
    .trim()
    .replace(/[\n\r]+/g, " ")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}
function getNote(notesObj, ...candidates) {
  if (!notesObj) return "";
  for (const k of candidates) {
    if (!k) continue;
    const v = notesObj[k];
    if (v !== undefined && v !== null && String(v).trim() !== "") return String(v);
  }
  const keys = Object.keys(notesObj || {});
  for (const cand of candidates) {
    if (!cand) continue;
    const hit = keys.find((x) => x.toLowerCase() === String(cand).toLowerCase());
    if (hit) {
      const v = notesObj[hit];
      if (v !== undefined && v !== null && String(v).trim() !== "") return String(v);
    }
  }
  return "";
}
function pickSection(detailed, ...keys) {
  for (const k of keys) {
    const obj = detailed?.[k];
    if (obj && typeof obj === "object") return obj;
  }
  return {};
}

function DotLayer({ points = [] }) {
  return (
    <div className="dotLayer">
      {points.map((p, idx) => (
        <div
          key={idx}
          className="dot"
          style={{
            left: `${(p.x || 0) * 100}%`,
            top: `${(p.y || 0) * 100}%`,
          }}
        />
      ))}
    </div>
  );
}

function DamageImg({ title, ar, src, points }) {
  return (
    <div className="imgCard">
      <div className="imgTitle">
        <span>{title}</span>
        <span dir="rtl" style={{ color: "#666" }}>
          {ar}
        </span>
      </div>

      <div className="imgWrap">
        <img className="bikeImg" src={src} alt={title} />
        <DotLayer points={points || []} />
      </div>
    </div>
  );
}

function PrintPage({ children, footerLeft, footerRight }) {
  return (
    <section className="page">
      <div className="pageBody">{children}</div>
      <footer className="pageFooter">
        <div>{footerLeft || ""}</div>
        <div style={{ textAlign: "right" }}>{footerRight || ""}</div>
      </footer>
    </section>
  );
}
function Block({ titleEn, titleAr, subtitleEn, children }) {
  return (
    <div className="block">
      <div className="bar">
        <div>{titleEn}</div>
        <div dir="rtl">{titleAr || ""}</div>
      </div>
      {subtitleEn ? (
        <div className="subbar">
          <div>{subtitleEn}</div>
          <div />
        </div>
      ) : null}
      <div className="blockBody">{children}</div>
    </div>
  );
}

function SectionTable({ rows = [], notes = {}, overallRate, generalNotes }) {
  return (
    <table className="grid">
      <thead>
        <tr>
          <th style={{ width: 150 }}>
            Group
            <div dir="rtl" style={{ fontWeight: 800, marginTop: 4 }}>
              القسم
            </div>
          </th>
          <th>
            Item
            <div dir="rtl" style={{ fontWeight: 800, marginTop: 4 }}>
              البند
            </div>
          </th>
          <th style={{ width: 260 }}>
            Notes
            <div dir="rtl" style={{ fontWeight: 800, marginTop: 4 }}>
              الملاحظات
            </div>
          </th>
        </tr>
      </thead>

      <tbody>
        {rows.map((r, i) => {
          const id1 = r.id;
          const id2 = slug(r.itemEn);
          const id3 = slug(r.itemAr);
          const id4 = slug(`${r.group}_${r.itemEn}`);
          return (
            <tr key={i}>
              <td style={{ fontWeight: 900 }}>{r.group}</td>
              <td>
                <div style={{ fontWeight: 800 }}>{r.itemEn}</div>
                <div dir="rtl" style={{ fontSize: 12 }}>
                  {r.itemAr}
                </div>
              </td>
              <td style={{ whiteSpace: "pre-wrap" }}>
                {getNote(notes, id1, id2, id3, id4)}
              </td>
            </tr>
          );
        })}

        <tr>
          <td style={{ fontWeight: 900 }}>
            Overall Condition Rate
            <div dir="rtl" style={{ fontSize: 12 }}>
              تقييم الحالة العامة
            </div>
          </td>
          <td colSpan={2} style={{ height: 34 }}>
            {overallRate || ""}
          </td>
        </tr>

        <tr>
          <td style={{ fontWeight: 900 }}>
            General Notes
            <div dir="rtl" style={{ fontSize: 12 }}>
              ملاحظات عامة
            </div>
          </td>
          <td colSpan={2} style={{ whiteSpace: "pre-wrap", height: 110 }}>
            {generalNotes || ""}
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export default function PrintInspectionPage() {
  const router = useRouter();
  const params = useParams();
  const inspectionNo = params?.inspectionNo;

  const [mounted, setMounted] = useState(false);
  const [report, setReport] = useState(null);

  useEffect(() => {
    setMounted(true);
    const all = getReports();
    const found = all.find((r) => r.inspectionNo === inspectionNo) || null;
    setReport(found);
  }, [inspectionNo]);

  if (!mounted) {
    return <main style={{ padding: 24, fontFamily: "system-ui" }}>Loading...</main>;
  }

  const bikeType = report?.type || "cruiser";
  const bikeImg = (view) => `/bike/${bikeType}/${bikeType}${view}.png`;

  if (!report) {
    return (
      <main style={{ padding: 24, fontFamily: "system-ui" }}>
        <h1>Print</h1>
        <p>Report not found: {inspectionNo}</p>
        <button onClick={() => router.push("/saved")} style={btn}>
          Back
        </button>
      </main>
    );
  }

  const d = report.data || {};
  const detailed = d?.detailed || {};
  const damage = d?.damage || {};

  const titleCondition = pickSection(detailed, "titleCondition", "titleAndEcu", "ecu");
  const titleSituation = titleCondition?.titleSituation || {};
  const ecuFaults = titleCondition?.ecuFaults || "";

  // Footer (appears on every printed page)
  const totalPages = 8;
  const footerLeft = `Inspection No: ${inspectionNo}`;
  const footerSaved = `Saved: ${fmtDate(report?.date)}`;


  const panelsAndPlastic = pickSection(detailed, "panelsAndPlastic", "panels", "plastic");
  const tiresAndWheels = pickSection(detailed, "tiresAndWheels", "tires", "wheels");
  const brakingSystem = pickSection(detailed, "brakingSystem", "brakesSystem", "braking");
  const controllingSystem = pickSection(detailed, "controllingSystem", "controlSystem", "controls");
  const steeringSystem = pickSection(detailed, "steeringSystem", "steering");
  const engineSection = pickSection(detailed, "engine", "engineSection");
  const chassisSection = pickSection(detailed, "chassis", "frame");
  const coolingSystem = pickSection(detailed, "coolingSystem", "cooling");
  const chargingSystem = pickSection(detailed, "chargingSystem", "charging");
  const exhaustSystem = pickSection(detailed, "exhaustSystem", "exhaust");
  const electricalSystem = pickSection(detailed, "electricalSystem", "electrical");
  const finalDrive = pickSection(detailed, "finalDrive", "driveTrain", "drive");
  const others = pickSection(detailed, "others", "other");
  const testDrive = pickSection(detailed, "testDrive", "roadTest");
  // NOTE: our forms save the final notes under detailed.finalInspectionSummary
  // (older versions used other keys), so we support all of them here.
  const summary = pickSection(
    detailed,
    "finalInspectionSummary",
    "inspectionSummary",
    "summary",
    "finalSummary"
  );

  const panelsRows = [
    { group: "Fairing", id: "panel_front_fairing", itemEn: "Front Fairing", itemAr: "فايبر أمامي" },
    { group: "Fairing", id: "panel_front_fender", itemEn: "Front Fender", itemAr: "رفرف أمامي" },
    { group: "Fairing", id: "panel_tail_fairing", itemEn: "Tail Fairing", itemAr: "الديل الخلفي" },
    { group: "Fairing", id: "panel_rear_fender", itemEn: "Rear Fender", itemAr: "رفرف خلفي" },
    { group: "Fairing", id: "panel_tank", itemEn: "Tank", itemAr: "تانك البنزين" },
    { group: "Chrome & Paint", id: "chrome_condition", itemEn: "Chrome Condition", itemAr: "حالة الكروم" },
    { group: "Chrome & Paint", id: "paint_condition", itemEn: "Paint Condition", itemAr: "حالة الدهان" },
  ];

  const tiresRows = [
    { group: "Rims", id: "rim_front", itemEn: "Front Rim", itemAr: "جنط أمامي" },
    { group: "Rims", id: "rim_rear", itemEn: "Rear Rim", itemAr: "جنط خلفي" },
    { group: "Tires", id: "tire_front", itemEn: "Front Tire", itemAr: "كاوتش أمامي" },
    { group: "Tires", id: "tire_rear", itemEn: "Rear Tire", itemAr: "كاوتش خلفي" },
  ];

  const brakingRows = [
    { group: "Disc brake Calipers", id: "brake_front_calipers", itemEn: "Front Calipers", itemAr: "كاليبر فرامل أمامي" },
    { group: "Disc brake Calipers", id: "brake_rear_caliper_drum", itemEn: "Rear Caliper or Drum", itemAr: "كاليبر خلفي / درام" },
    { group: "Masters", id: "master_front", itemEn: "Front Master", itemAr: "ماستر فرامل أمامي" },
    { group: "Masters", id: "master_rear", itemEn: "Rear Master", itemAr: "ماستر فرامل خلفي" },
    { group: "Discs", id: "disc_front", itemEn: "Front Discs", itemAr: "دسكات أمامية" },
    { group: "Discs", id: "disc_rear", itemEn: "Rear Discs", itemAr: "دسكات خلفية" },
    { group: "Brake Hoses", id: "hose_front", itemEn: "Front Hoses", itemAr: "باكم أمامي" },
    { group: "Brake Hoses", id: "hose_rear", itemEn: "Rear Hose", itemAr: "باكم خلفي" },
    { group: "Brake Pads", id: "pads_front", itemEn: "Front Brake Pads", itemAr: "تيل فرامل أمامي" },
    { group: "Brake Pads", id: "pads_rear", itemEn: "Rear Brake Pads", itemAr: "تيل فرامل خلفي" },
    { group: "Brake Oil", id: "brake_oil", itemEn: "Brake Oil Status", itemAr: "حالة زيت الباكم" },
  ];

  const controllingRows = [
    { group: "Levers", id: "lever_front_right", itemEn: "Front Right Lever", itemAr: "مقبض فرامل يمين" },
    { group: "Levers", id: "lever_front_left", itemEn: "Front Left Lever", itemAr: "مقبض دبرياج" },
    { group: "Pedals", id: "pedal_brake", itemEn: "Brake Pedal", itemAr: "دواسة فرامل" },
    { group: "Pedals", id: "pedal_shift", itemEn: "Shift Pedal", itemAr: "دواسة غيارات" },
    { group: "Mirrors", id: "mirror_right", itemEn: "Right Mirror", itemAr: "مراية يمين" },
    { group: "Mirrors", id: "mirror_left", itemEn: "Left Mirror", itemAr: "مراية شمال" },
  ];

  const steeringRows = [
    { group: "Steering", id: "steering_head", itemEn: "Steering Head", itemAr: "الرقبة" },
    { group: "Steering", id: "steering_bearing", itemEn: "Steering Head Ball Bearing", itemAr: "رمان بلي الرقبة" },
    { group: "Handle Bars", id: "handle_bars", itemEn: "Handle Bars", itemAr: "الجادون" },
    { group: "Forks", id: "fork_front_right", itemEn: "Front Right Fork", itemAr: "مساعد أمامي يمين" },
    { group: "Forks", id: "fork_front_left", itemEn: "Front Left Fork", itemAr: "مساعد أمامي شمال" },
    { group: "Forks", id: "shock_rear_right", itemEn: "Rear Right Shock", itemAr: "مساعد خلفي يمين" },
    { group: "Forks", id: "shock_rear_left", itemEn: "Rear Left Shock", itemAr: "مساعد خلفي شمال" },
  ];

  const engineRows = [
    { group: "Engine Check", id: "engine_overall", itemEn: "Overall Engine Condition, Bolts Condition", itemAr: "حالة المحرك وآثار فك وإصلاح" },
    { group: "Engine Check", id: "engine_leaks", itemEn: "Any Fluid Leaks (Oil, Water and Fuel)", itemAr: "تسريبات زيت/مياه/بنزين" },
    { group: "Engine Check", id: "engine_damage_weld", itemEn: "Any Damage or Welding", itemAr: "كسور أو لحامات" },
    { group: "Engine Check", id: "engine_gaskets", itemEn: "Covers Gaskets and Sealing Condition", itemAr: "الجوانات والسيليكون" },
    { group: "Engine Sound", id: "sound_valves", itemEn: "Valves Sound", itemAr: "صوت التكيهات" },
    { group: "Engine Sound", id: "sound_timing", itemEn: "Timing Chain Cam Sound", itemAr: "صوت الكتينة" },
    { group: "Engine Sound", id: "sound_strange", itemEn: "Any Strange Sound", itemAr: "أصوات غريبة" },
    { group: "Performance", id: "engine_compression", itemEn: "Engine Compression", itemAr: "اختبار كبس المحرك" },
  ];

  const chassisRows = [
    { group: "Chassis", id: "frame_main", itemEn: "The Main Frame", itemAr: "الشاسيه الرئيسي" },
    { group: "Chassis", id: "frame_sub", itemEn: "The Sub Frame", itemAr: "الشاسيه الخلفي" },
    { group: "Chassis", id: "swingarm", itemEn: "The Swingarm", itemAr: "المقص الخلفي" },
  ];

  const coolingRows = [
    { group: "Cooling", id: "radiator", itemEn: "Radiator Condition", itemAr: "الردياتير" },
    { group: "Cooling", id: "radiator_fan", itemEn: "Radiator Fan Condition", itemAr: "مروحة الردياتير" },
    { group: "Cooling", id: "cooling_general", itemEn: "General Condition", itemAr: "حالة عامة" },
  ];

  const chargingRows = [
    { group: "Charging", id: "charging_condition", itemEn: "Charging Condition", itemAr: "حالة الشحن" },
    { group: "Charging", id: "battery_condition", itemEn: "Battery Condition", itemAr: "حالة البطارية" },
    { group: "Charging", id: "generator_condition", itemEn: "Generator Condition", itemAr: "حالة الدينامو" },
    { group: "Charging", id: "regulator_plug", itemEn: "Regulator Plug Condition", itemAr: "حالة فيشة البلاطة / أصلي أم لا" },
  ];

  const exhaustRows = [
    { group: "Exhaust", id: "exhaust_pipes", itemEn: "Exhaust Pipes Condition", itemAr: "حالة الهيدر" },
    { group: "Exhaust", id: "muffler", itemEn: "Muffler Condition", itemAr: "علبة الشكمان" },
  ];

  const electricalRows = [
    { group: "Switches", id: "ignition_switch", itemEn: "Ignition Switch", itemAr: "مفتاح الكونتاكت" },
    { group: "Switches", id: "on_off_switch", itemEn: "On / Off Switch", itemAr: "مفتاح الطرمبة" },
    { group: "Switches", id: "start_engine_switch", itemEn: "Start Engine Switch", itemAr: "زرار المارش" },
    { group: "Switches", id: "lights_switches", itemEn: "Lights Switches", itemAr: "زرار الأنوار" },
    { group: "Switches", id: "turn_signal_switches", itemEn: "Turn Signal Switches", itemAr: "سوتش الإشارات" },
    { group: "Switches", id: "horn_switch", itemEn: "Horn Switch", itemAr: "زرار الكلاكس" },
    { group: "Switches", id: "brakes_switches", itemEn: "Brakes Switches", itemAr: "سوتش إضاءة الفرامل" },
    { group: "Lights", id: "head_lights", itemEn: "Head Lights", itemAr: "الأنوار الأمامية" },
    { group: "Lights", id: "rear_light", itemEn: "Rear Light", itemAr: "النور الخلفي" },
    { group: "Lights", id: "brakes_light", itemEn: "Brakes Light", itemAr: "نور الفرامل" },
    { group: "Lights", id: "turn_signal_lights", itemEn: "Turn Signal Lights", itemAr: "الإشارات" },
    { group: "Horn", id: "horn", itemEn: "Horn", itemAr: "الكلاكس" },
  ];

  const finalDriveRows = [
    { group: "Drive Train", id: "drive_chain_belt_diff", itemEn: "Drive Chain - Belt - Differential Condition", itemAr: "السير / الكرونة / الجنزير" },
  ];

  const othersRows = [
    { group: "Seats and Backrests", id: "seat_condition", itemEn: "Seat Condition", itemAr: "حالة الكراسي والمساند" },
    { group: "Sidestand", id: "sidestand_condition", itemEn: "Sidestand Condition", itemAr: "حالة الدبوس" },
    { group: "Foot Pegs", id: "footpeg_right_driver", itemEn: "Right Driver Foot Peg", itemAr: "دواسة يمين" },
    { group: "Foot Pegs", id: "footpeg_left_driver", itemEn: "Left Driver Foot Peg", itemAr: "دواسة شمال" },
    { group: "Foot Pegs", id: "footpeg_passenger", itemEn: "Passenger Foot Peg", itemAr: "دواسات الراكب" },
    { group: "Windscreen", id: "windscreen_condition", itemEn: "Windscreen Condition", itemAr: "حالة السكرينة" },
  ];

  return (
    <main className="printRoot">
      <div className="noPrint topControls">
        <button onClick={() => router.push("/saved")} style={btn}>
          ← Back
        </button>
        <button onClick={() => window.print()} style={btnPrimary}>
          Print
        </button>
        <div style={{ marginLeft: "auto", color: "#666" }}>
          {report.inspectionNo} — Saved: {fmtDate(report.date)}
        </div>
      </div>

      {/* ====== PAGE 1 ====== */}
      <PrintPage footerLeft={footerLeft} footerRight={`Page 1/${totalPages} • ${footerSaved}`}>
        <div className="sheetHeader">
          <div className="logoBox">
            <div style={{ fontWeight: 1000, fontSize: 22 }}>MCS</div>
            <div style={{ fontSize: 12, color: "#666" }}>Motorcycle Station</div>
          </div>
          <div style={{ textAlign: "right", fontWeight: 1000, fontSize: 22 }}>
            Cruiser Bike Inspection Form
          </div>
        </div>

        <Block titleEn="Motorcycle and Customer Information" titleAr="">
          <div className="infoGrid">
            <div className="infoTable">
              {line("Brand", "الماركة", safe(d?.motorcycle?.brand))}
              {line("Model", "الموديل", safe(d?.motorcycle?.model))}
              {line("Year", "السنة", safe(d?.motorcycle?.year))}
              {line("Engine Size", "حجم الموتور", safe(d?.motorcycle?.engineSize))}
              {line("Plate Number", "رقم اللوحات", safe(d?.motorcycle?.plate))}
              {line("License Validity", "صلاحية الرخصة", safe(d?.motorcycle?.licenseValidity))}
              {line("Mileage", "العداد", safe(d?.motorcycle?.mileage))}
              {line("Motor Number", "رقم الموتور", safe(d?.motorcycle?.motorNumber))}
              {line("VIN Number", "رقم الشاسيه", safe(d?.motorcycle?.vin))}
              {line("Color", "اللون", safe(d?.motorcycle?.color))}
              {line("Owner", "المالك", safe(d?.customer?.owner))}
              {line("Phone", "رقم الموبايل", safe(d?.customer?.phone))}
              {line("Date", "التاريخ", safe(d?.meta?.date))}
              {line("Time", "الوقت", safe(d?.meta?.time))}
            </div>

            <div className="imagesCol">
              <DamageImg title="Right" ar="يمين" src={bikeImg("right")} points={damage.right} />
              <DamageImg title="Left" ar="شمال" src={bikeImg("left")} points={damage.left} />
              <DamageImg title="Front" ar="أمام" src={bikeImg("front")} points={damage.front} />
              <DamageImg title="Back" ar="خلف" src={bikeImg("back")} points={damage.back} />
              <DamageImg title="Top" ar="أعلى" src={bikeImg("top")} points={damage.top} />
            </div>
          </div>

          <div className="signRow">
            <div>
              <div className="smallLabel">Customer Notes / ملاحظات من العميل</div>
              <div className="bigBox">{safe(d?.meta?.customerNotes)}</div>
            </div>

            <div className="rightBoxes">
              <div>
                <div className="smallLabel">Reception Engineer / مهندس الاستقبال</div>
                <div className="bigBox short">{safe(d?.meta?.receptionEngineer)}</div>
              </div>
              <div>
                <div className="smallLabel">Customer Signature / إمضاء العميل</div>
                <div className="bigBox short">{safe(d?.meta?.customerSignature)}</div>
              </div>
              <div>
                <div className="smallLabel">Inspection No</div>
                <div className="bigBox short" style={{ fontWeight: 1000 }}>
                  {report.inspectionNo}
                </div>
              </div>
            </div>
          </div>
        </Block>
      </PrintPage>

      {/* ====== PAGE 2 ====== */}
      <PrintPage footerLeft={footerLeft} footerRight={`Page 2/${totalPages} • ${footerSaved}`}>
        <Block titleEn="Title Condition & ECU Scanning" titleAr="">
          <table className="grid">
            <thead>
              <tr>
                <th style={{ width: 160 }}>
                  Title Situation
                  <div dir="rtl" style={{ fontWeight: 800, marginTop: 4 }}>
                    حالة الوثيقة الرسمية
                  </div>
                </th>
                <th>Check VIN Number & ECU Diagnostic Scan</th>
                <th style={{ width: 240 }}>
                  Notes
                  <div dir="rtl" style={{ fontWeight: 800, marginTop: 4 }}>
                    الملاحظات
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td />
                <td style={{ padding: 10, fontWeight: 800 }}>
                  Clean: {titleSituation.clean ? "✓" : "□"} &nbsp;&nbsp; Salvage: {titleSituation.salvage ? "✓" : "□"} &nbsp;&nbsp;
                  Rebuilt: {titleSituation.rebuilt ? "✓" : "□"} &nbsp;&nbsp; Flood: {titleSituation.flood ? "✓" : "□"} &nbsp;&nbsp;
                  Theft: {titleSituation.theft ? "✓" : "□"}
                </td>
                <td />
              </tr>
              <tr>
                <td style={{ fontWeight: 900 }}>
                  ECU Faults
                  <div dir="rtl" style={{ fontSize: 12 }}>
                    أعطال الكمبيوتر
                  </div>
                </td>
                <td colSpan={2} style={{ height: 110, whiteSpace: "pre-wrap" }}>
                  {ecuFaults || ""}
                </td>
              </tr>
            </tbody>
          </table>
        </Block>

        <Block titleEn="Panels & Plastic Covers" titleAr="الفايبر والبلاستيك" subtitleEn="Check Panels And Plastic Covers Paint & Condition">
          <SectionTable
            rows={panelsRows}
            notes={panelsAndPlastic?.notes || {}}
            overallRate={panelsAndPlastic?.overallRate || ""}
            generalNotes={panelsAndPlastic?.generalNotes || ""}
          />
        </Block>

        <Block titleEn="Tires & Wheels" titleAr="الإطارات والجنوط" subtitleEn="Check Wheels Condition & Tires Production Date">
          <SectionTable
            rows={tiresRows}
            notes={tiresAndWheels?.notes || {}}
            overallRate={tiresAndWheels?.overallRate || ""}
            generalNotes={tiresAndWheels?.generalNotes || ""}
          />
        </Block>
      </PrintPage>

      {/* ====== PAGE 3 ====== */}
      <PrintPage footerLeft={footerLeft} footerRight={`Page 3/${totalPages} • ${footerSaved}`}>
        <Block titleEn="Braking System" titleAr="الفرامل" subtitleEn="Check Calipers, Masters, Discs, Hoses and Pads">
          <SectionTable
            rows={brakingRows}
            notes={brakingSystem?.notes || {}}
            overallRate={brakingSystem?.overallRate || ""}
            generalNotes={brakingSystem?.generalNotes || ""}
          />
        </Block>

        <Block titleEn="Controlling System" titleAr="التحكم" subtitleEn="Check Levers, Pedals and Mirrors">
          <SectionTable
            rows={controllingRows}
            notes={controllingSystem?.notes || {}}
            overallRate={controllingSystem?.overallRate || ""}
            generalNotes={controllingSystem?.generalNotes || ""}
          />
        </Block>
      </PrintPage>

      {/* ====== PAGE 4 ====== */}
      <PrintPage footerLeft={footerLeft} footerRight={`Page 4/${totalPages} • ${footerSaved}`}>
        <Block titleEn="Steering System" titleAr="الدركسيون والعفشة" subtitleEn="Check Steering Head, Handle Bars, and Forks">
          <SectionTable
            rows={steeringRows}
            notes={steeringSystem?.notes || {}}
            overallRate={steeringSystem?.overallRate || ""}
            generalNotes={steeringSystem?.generalNotes || ""}
          />
        </Block>

        <Block titleEn="Engine" titleAr="المحرك" subtitleEn="Check Engine Condition, Sound, Performance">
          <SectionTable
            rows={engineRows}
            notes={engineSection?.notes || {}}
            overallRate={engineSection?.overallRate || ""}
            generalNotes={engineSection?.generalNotes || ""}
          />
        </Block>
      </PrintPage>

      {/* ====== PAGE 5 ====== */}
      <PrintPage footerLeft={footerLeft} footerRight={`Page 5/${totalPages} • ${footerSaved}`}>
        <Block titleEn="Chassis" titleAr="الشاسيه" subtitleEn="Check Chassis and Frame Condition">
          <SectionTable
            rows={chassisRows}
            notes={chassisSection?.notes || {}}
            overallRate={chassisSection?.overallRate || ""}
            generalNotes={chassisSection?.generalNotes || ""}
          />
        </Block>

        <Block titleEn="Cooling System" titleAr="التبريد" subtitleEn="Check Radiator, Fan and Thermostat Condition">
          <SectionTable
            rows={coolingRows}
            notes={coolingSystem?.notes || {}}
            overallRate={coolingSystem?.overallRate || ""}
            generalNotes={coolingSystem?.generalNotes || ""}
          />
        </Block>
      </PrintPage>

      {/* ====== PAGE 6 ====== */}
      <PrintPage footerLeft={footerLeft} footerRight={`Page 6/${totalPages} • ${footerSaved}`}>
        <Block titleEn="Charging System" titleAr="الشحن" subtitleEn="Check Battery, Generator and Rectifier">
          <SectionTable
            rows={chargingRows}
            notes={chargingSystem?.notes || {}}
            overallRate={chargingSystem?.overallRate || ""}
            generalNotes={chargingSystem?.generalNotes || ""}
          />
        </Block>

        <Block titleEn="Exhaust System" titleAr="الشكمان" subtitleEn="Check Exhaust Pipes and Muffler Condition">
          <SectionTable
            rows={exhaustRows}
            notes={exhaustSystem?.notes || {}}
            overallRate={exhaustSystem?.overallRate || ""}
            generalNotes={exhaustSystem?.generalNotes || ""}
          />
        </Block>
      </PrintPage>

      {/* ====== PAGE 7 ====== */}
      <PrintPage footerLeft={footerLeft} footerRight={`Page 7/${totalPages} • ${footerSaved}`}>
        <Block titleEn="Electrical System" titleAr="الكهرباء" subtitleEn="Check Switches, Lights and Connectors Condition">
          <SectionTable
            rows={electricalRows}
            notes={electricalSystem?.notes || {}}
            overallRate={electricalSystem?.overallRate || ""}
            generalNotes={electricalSystem?.generalNotes || ""}
          />
        </Block>

        <Block titleEn="Final Drive" titleAr="نقل الحركة" subtitleEn="Check Sprockets and Drive Chain">
          <SectionTable
            rows={finalDriveRows}
            notes={finalDrive?.notes || {}}
            overallRate={finalDrive?.overallRate || ""}
            generalNotes={finalDrive?.generalNotes || ""}
          />
        </Block>
      </PrintPage>

      {/* ====== PAGE 8 ====== */}
      <PrintPage footerLeft={footerLeft} footerRight={`Page 8/${totalPages} • ${footerSaved}`}>
        <Block titleEn="Others" titleAr="أخرى" subtitleEn="Seats - kickstand etc...">
          <SectionTable
            rows={othersRows}
            notes={others?.notes || {}}
            overallRate={others?.overallRate || ""}
            generalNotes={others?.generalNotes || ""}
          />
        </Block>

        <Block titleEn="TEST Drive" titleAr="اختبار القيادة" subtitleEn="Real Road Test Drive">
          <div className="bigBox" style={{ minHeight: 120 }}>
            {safe(testDrive?.results || testDrive?.notes || "")}
          </div>
        </Block>

        <Block titleEn="Final Inspection Summary" titleAr="ملخص نهائي" subtitleEn="Conclusion">
          <div className="bigBox" style={{ minHeight: 170 }}>
            {safe(summary?.text || summary?.summary || summary?.notes || "")}
          </div>
        </Block>
      </PrintPage>

      <style jsx global>{`
        /* شاشة */
        .printRoot {
          font-family: system-ui;
          padding: 18px;
          background: #f4f4f4;
        }
        .topControls {
          display: flex;
          gap: 10px;
          margin-bottom: 14px;
          align-items: center;
        }

        /* ✅ صفحة A4 */
        .page {
          background: #fff;
          border: 2px solid #111;
          width: 210mm;
          min-height: 297mm;
          margin: 0 auto 16px auto;
          padding: 0;
          box-sizing: border-box;
          position: relative;
        }

        .pageBody {
          padding-bottom: 14mm; /* مساحة للفوتر */
        }

        .pageFooter {
          position: absolute;
          left: 14px;
          right: 14px;
          bottom: 10px;
          border-top: 1px solid #111;
          padding-top: 6px;
          font-size: 12px;
          font-weight: 700;
          display: flex;
          justify-content: space-between;
          gap: 10px;
        }

        .sheetHeader {
          display: grid;
          grid-template-columns: 1fr 2fr;
          align-items: center;
          gap: 10px;
          padding: 12px 14px;
          border-bottom: 2px solid #111;
        }

        .logoBox {
          border: 1px solid #ddd;
          border-radius: 10px;
          padding: 8px 10px;
          width: fit-content;
        }

        .block {
          border-bottom: 2px solid #111;
        }

        .bar {
          background: #000;
          color: #fff;
          font-weight: 1000;
          padding: 8px 12px;
          display: flex;
          justify-content: space-between;
          gap: 10px;
          font-size: 13px;
        }

        .subbar {
          background: #e9e9e9;
          font-weight: 900;
          padding: 6px 12px;
          display: flex;
          justify-content: space-between;
          font-size: 12px;
        }

        .blockBody {
          padding: 0;
        }

        .infoGrid {
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          border-bottom: 2px solid #111;
        }

        .infoTable {
          border-right: 1px solid #111;
        }

        .infoLine {
          display: grid;
          grid-template-columns: 150px 1fr;
          border-bottom: 1px solid #999;
          min-height: 30px;
          font-size: 12px;
        }

        .infoLabel {
          border-right: 1px solid #999;
          padding: 6px 8px;
          font-weight: 900;
          background: #f7f7f7;
        }

        .infoValue {
          padding: 6px 8px;
        }

        .imagesCol {
          padding: 8px;
          display: grid;
          gap: 8px;
        }

        .imgCard {
          border: 1px solid #999;
          padding: 6px;
        }

        .imgTitle {
          font-weight: 900;
          margin-bottom: 4px;
          display: flex;
          justify-content: space-between;
          font-size: 12px;
        }

        .imgWrap {
          position: relative;
          width: 100%;
          height: 95px; /* ✅ علشان 5 صور يدخلوا */
        }

        .bikeImg {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
        }

        .dotLayer {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .dot {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 999px;
          transform: translate(-50%, -50%);
          background: #d10000;
          border: 2px solid #fff;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
        }

        .signRow {
          padding: 10px 12px;
          display: grid;
          grid-template-columns: 1.4fr 0.6fr;
          gap: 10px;
        }

        .smallLabel {
          font-weight: 900;
          margin-bottom: 6px;
          font-size: 12px;
        }

        .bigBox {
          border: 1px solid #999;
          min-height: 85px;
          padding: 8px;
          white-space: pre-wrap;
          font-size: 12px;
        }
        .bigBox.short {
          min-height: 38px;
        }

        .rightBoxes {
          display: grid;
          gap: 8px;
        }

        .grid {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
        }
        .grid th,
        .grid td {
          border: 1px solid #111;
          padding: 6px 8px;
          vertical-align: top;
          font-size: 11.5px;
          overflow-wrap: anywhere;
        }

        /* ✅ منع التقطيع داخل الجدول */
        .grid tr {
          break-inside: avoid;
          page-break-inside: avoid;
        }

        /* PRINT */
        @media print {
          @page {
            size: A4;
            margin: 8mm;
          }
          .noPrint {
            display: none !important;
          }
          html,
          body {
            background: #fff !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .printRoot {
            padding: 0;
            background: #fff;
          }
          .page {
            margin: 0;
            border: none;
            page-break-after: always;
            break-after: page;
          }
        }
      `}</style>
    </main>
  );
}

function line(en, ar, value) {
  return (
    <div className="infoLine">
      <div className="infoLabel">
        <div>{en}</div>
        <div dir="rtl" style={{ fontWeight: 800, fontSize: 11, marginTop: 2 }}>
          {ar}
        </div>
      </div>
      <div className="infoValue">{value || ""}</div>
    </div>
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
  ...btn,
  border: "1px solid #222",
  background: "#222",
  color: "#fff",
  fontWeight: 900,
};
