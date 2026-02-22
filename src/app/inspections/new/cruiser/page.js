"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import DamageMap from "@/components/DamageMap";
import SectionTable from "@/components/SectionTable";

function Field({ name, label, value, setValue, required }) {
  return (
    <div>
      <label style={lbl}>
        {label} {required ? <span style={{ color: "#d10000" }}>*</span> : null}
      </label>
      <input
        name={name}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        style={inp}
      />
    </div>
  );
}


export default function CruiserInspection() {
  const router = useRouter();

  // Page 1 - Info
  const [owner, setOwner] = useState("");
  const [phone, setPhone] = useState("");

  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [engineSize, setEngineSize] = useState("");
  const [plate, setPlate] = useState("");
  const [licenseValidity, setLicenseValidity] = useState("");
  const [mileage, setMileage] = useState("");
  const [motorNumber, setMotorNumber] = useState("");
  const [vin, setVin] = useState("");
  const [color, setColor] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState(() => new Date().toTimeString().slice(0, 5));

  const [customerNotes, setCustomerNotes] = useState("");
  const [receptionEngineer, setReceptionEngineer] = useState("");
  const [customerSignature, setCustomerSignature] = useState("");

  // Damage Points (5 views)
  const [damageLeft, setDamageLeft] = useState([]);
  const [damageRight, setDamageRight] = useState([]);
  const [damageFront, setDamageFront] = useState([]);
  const [damageBack, setDamageBack] = useState([]);
  const [damageTop, setDamageTop] = useState([]);

  // ===== Title Condition & ECU (Section مستقل) =====
  const [titleSituation, setTitleSituation] = useState({
    clean: false,
    salvage: false,
    rebuilt: false,
    flood: false,
    theft: false,
  });
  const [ecuFaults, setEcuFaults] = useState("");

  // ===== Detailed Sections (Notes per item) =====
  // Panels
  const [panelsNotes, setPanelsNotes] = useState({});
  const [panelsRate, setPanelsRate] = useState("");
  const [panelsGeneral, setPanelsGeneral] = useState("");

  // Tires & Wheels
  const [tiresWheelsNotes, setTiresWheelsNotes] = useState({});
  const [tiresWheelsRate, setTiresWheelsRate] = useState("");
  const [tiresWheelsGeneral, setTiresWheelsGeneral] = useState("");

  // Brakes
  const [brakesSysNotes, setBrakesSysNotes] = useState({});
  const [brakesSysRate, setBrakesSysRate] = useState("");
  const [brakesSysGeneral, setBrakesSysGeneral] = useState("");

  // Controlling
  const [controlNotes, setControlNotes] = useState({});
  const [controlRate, setControlRate] = useState("");
  const [controlGeneral, setControlGeneral] = useState("");

  // Steering
  const [steeringNotes, setSteeringNotes] = useState({});
  const [steeringRate, setSteeringRate] = useState("");
  const [steeringGeneral, setSteeringGeneral] = useState("");

  // Engine
  const [engineNotesMap, setEngineNotesMap] = useState({});
  const [engineRate, setEngineRate] = useState("");
  const [engineGeneral, setEngineGeneral] = useState("");

  // Chassis
  const [chassisNotes, setChassisNotes] = useState({});
  const [chassisRate, setChassisRate] = useState("");
  const [chassisGeneral, setChassisGeneral] = useState("");

  // Cooling
  const [coolingNotes, setCoolingNotes] = useState({});
  const [coolingRate, setCoolingRate] = useState("");
  const [coolingGeneral, setCoolingGeneral] = useState("");

  // Charging
  const [chargingNotes, setChargingNotes] = useState({});
  const [chargingRate, setChargingRate] = useState("");
  const [chargingGeneral, setChargingGeneral] = useState("");

  // Exhaust
  const [exhaustNotes, setExhaustNotes] = useState({});
  const [exhaustRate, setExhaustRate] = useState("");
  const [exhaustGeneral, setExhaustGeneral] = useState("");

  // Electrical
  const [electricalNotesMap, setElectricalNotesMap] = useState({});
  const [electricalRate, setElectricalRate] = useState("");
  const [electricalGeneral, setElectricalGeneral] = useState("");

  // Final Drive
  const [finalDriveNotes, setFinalDriveNotes] = useState({});
  const [finalDriveRate, setFinalDriveRate] = useState("");
  const [finalDriveGeneral, setFinalDriveGeneral] = useState("");

  // Others
  const [othersNotes, setOthersNotes] = useState({});
  const [othersRate, setOthersRate] = useState("");
  const [othersGeneral, setOthersGeneral] = useState("");

  // Test Drive + Final Summary
  const [testDriveResults, setTestDriveResults] = useState("");
  const [finalSummary, setFinalSummary] = useState("");

  // ✅ بدل ratings: نخلي الحد الأدنى "رقم الموبايل"
  const canSubmit = useMemo(() => {
    const requiredValues = [
      phone,
      owner,
      brand,
      model,
      year,
      engineSize,
      plate,
      licenseValidity,
      mileage,
      motorNumber,
      vin,
      color,
    ];

    return requiredValues.every((v) => String(v ?? "").trim().length > 0);
  }, [
    phone,
    owner,
    brand,
    model,
    year,
    engineSize,
    plate,
    licenseValidity,
    mileage,
    motorNumber,
    vin,
    color,
  ]);

  function onSubmit(e) {
    e.preventDefault();

    if (!canSubmit) {
      const required = [
        { name: "owner", value: owner },
        { name: "phone", value: phone },
        { name: "brand", value: brand },
        { name: "model", value: model },
        { name: "year", value: year },
        { name: "engineSize", value: engineSize },
        { name: "plate", value: plate },
        { name: "licenseValidity", value: licenseValidity },
        { name: "mileage", value: mileage },
        { name: "motorNumber", value: motorNumber },
        { name: "vin", value: vin },
        { name: "color", value: color },
      ];

      const firstMissing = required.find((f) => String(f.value ?? "").trim().length === 0);
      if (firstMissing) {
        const el = document.querySelector(`[name="${firstMissing.name}"]`);
        if (el && typeof el.scrollIntoView === "function") {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          setTimeout(() => el.focus?.(), 50);
        }
      }
      return;
    }

const payload = {
      type: "Cruiser",

      customer: { owner: owner || null, phone },

      motorcycle: {
        brand: brand || null,
        model: model || null,
        year: year || null,
        engineSize: engineSize || null,
        plate: plate || null,
        licenseValidity: licenseValidity || null,
        mileage: mileage || null,
        motorNumber: motorNumber || null,
        vin: vin || null,
        color: color || null,
      },

      meta: {
        date: date || null,
        time: time || null,
        receptionEngineer: receptionEngineer || null,
        customerSignature: customerSignature || null,
        customerNotes: customerNotes || "",
      },

      damage: {
        left: damageLeft,
        right: damageRight,
        front: damageFront,
        back: damageBack,
        top: damageTop,
      },

      detailed: {
        titleCondition: {
          titleSituation,
          ecuFaults: ecuFaults || "",
        },

        panelsAndPlastic: {
          notes: panelsNotes,
          overallRate: panelsRate || null,
          generalNotes: panelsGeneral || "",
        },

        tiresAndWheels: {
          notes: tiresWheelsNotes,
          overallRate: tiresWheelsRate || null,
          generalNotes: tiresWheelsGeneral || "",
        },

        brakingSystem: {
          notes: brakesSysNotes,
          overallRate: brakesSysRate || null,
          generalNotes: brakesSysGeneral || "",
        },

        controllingSystem: {
          notes: controlNotes,
          overallRate: controlRate || null,
          generalNotes: controlGeneral || "",
        },

        steeringSystem: {
          notes: steeringNotes,
          overallRate: steeringRate || null,
          generalNotes: steeringGeneral || "",
        },

        engine: {
          notes: engineNotesMap,
          overallRate: engineRate || null,
          generalNotes: engineGeneral || "",
        },

        chassis: {
          notes: chassisNotes,
          overallRate: chassisRate || null,
          generalNotes: chassisGeneral || "",
        },

        coolingSystem: {
          notes: coolingNotes,
          overallRate: coolingRate || null,
          generalNotes: coolingGeneral || "",
        },

        chargingSystem: {
          notes: chargingNotes,
          overallRate: chargingRate || null,
          generalNotes: chargingGeneral || "",
        },

        exhaustSystem: {
          notes: exhaustNotes,
          overallRate: exhaustRate || null,
          generalNotes: exhaustGeneral || "",
        },

        electricalSystem: {
          notes: electricalNotesMap,
          overallRate: electricalRate || null,
          generalNotes: electricalGeneral || "",
        },

        finalDrive: {
          notes: finalDriveNotes,
          overallRate: finalDriveRate || null,
          generalNotes: finalDriveGeneral || "",
        },

        others: {
          notes: othersNotes,
          overallRate: othersRate || null,
          generalNotes: othersGeneral || "",
        },

        testDrive: { results: testDriveResults || "" },

        finalInspectionSummary: { summary: finalSummary || "" },
      },
    };

    localStorage.setItem("draft_cruiser_inspection", JSON.stringify(payload));
    router.push("/inspections/new/cruiser/preview");
  }

  return (
    <main style={{ padding: 24, fontFamily: "system-ui", maxWidth: 1150, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ margin: 0 }}>Cruiser Inspection</h1>
          <div style={{ color: "#666" }} dir="rtl">
            كشف كروزر
          </div>
        </div>

        <a href="/dashboard" style={{ alignSelf: "center" }}>
          ← Dashboard
        </a>
      </div>

      <form onSubmit={onSubmit} style={{ marginTop: 18, display: "grid", gap: 16 }}>
        {/* Page 1 - Info */}
        <section style={section}>
          <h2 style={{ marginTop: 0 }}>Motorcycle and Customer Information</h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field name="owner" label="Owner / المالك" value={owner} setValue={setOwner} required />
            <Field name="phone" label="Phone (required) / رقم الموبايل" value={phone} setValue={setPhone} required />

            <Field name="brand" label="Brand / الماركة" value={brand} setValue={setBrand} required />
            <Field name="model" label="Model / الموديل" value={model} setValue={setModel} required />

            <Field name="year" label="Year / السنة" value={year} setValue={setYear} required />
            <Field name="engineSize" label="Engine Size / حجم الموتور" value={engineSize} setValue={setEngineSize} required />

            <Field name="plate" label="Plate Number / رقم اللوحات" value={plate} setValue={setPlate} required />
            <Field name="licenseValidity" label="License Validity / صلاحية الرخصة" value={licenseValidity} setValue={setLicenseValidity} required />

            <Field name="mileage" label="Mileage / العداد" value={mileage} setValue={setMileage} required />
            <Field name="motorNumber" label="Motor Number / رقم الموتور" value={motorNumber} setValue={setMotorNumber} required />

            <Field name="vin" label="VIN Number / رقم الشاسيه" value={vin} setValue={setVin} required />
            <Field name="color" label="Color / اللون" value={color} setValue={setColor} required />

            <div>
              <label style={lbl}>Date / التاريخ</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={inp} />
            </div>

            <div>
              <label style={lbl}>Time / الوقت</label>
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} style={inp} />
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <label style={lbl}>Customer Notes / ملاحظات من العميل</label>
            <textarea value={customerNotes} onChange={(e) => setCustomerNotes(e.target.value)} style={ta} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
            <Field name="receptionEngineer" label="Reception Engineer / مهندس الاستقبال" value={receptionEngineer} setValue={setReceptionEngineer} />
            <Field name="customerSignature" label="Customer Signature / إمضاء العميل (اكتب الاسم)" value={customerSignature} setValue={setCustomerSignature} />
          </div>
        </section>

        {/* Damage Maps */}
        <section style={section}>
          <h2 style={{ marginTop: 0 }}>Body Damage Marking / تحديد الخبطات والخدوش</h2>
          <p style={{ marginTop: 6, color: "#666" }} dir="rtl">
            اختار نوع الضرر واضغط على الصورة في مكان الخبطة/الخدش. اضغط على العلامة لمسحها.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <DamageMap title="Left / اليسار" imageSrc="/bike/cruiser/cruiserleft.png" points={damageLeft} onChange={setDamageLeft} />
            <DamageMap title="Right / اليمين" imageSrc="/bike/cruiser/cruiserright.png" points={damageRight} onChange={setDamageRight} />
            <DamageMap title="Front / الأمام" imageSrc="/bike/cruiser/cruiserfront.png" points={damageFront} onChange={setDamageFront} />
            <DamageMap title="Back / الخلف" imageSrc="/bike/cruiser/cruiserback.png" points={damageBack} onChange={setDamageBack} />
            <DamageMap title="Top / أعلى" imageSrc="/bike/cruiser/cruisertop.png" points={damageTop} onChange={setDamageTop} />
          </div>
        </section>

        {/* ✅ Title Condition & ECU (مستقل قبل Panels) */}
        <section style={section}>
          <div style={blackBar}>Title Condition & ECU Scanning</div>

          <div style={{ marginTop: 12 }}>
            <div style={{ fontWeight: 900 }}>Title Situation / حالة الوثيقة الرسمية</div>

            <div style={{ marginTop: 10, display: "flex", gap: 16, flexWrap: "wrap" }}>
              {[
                ["clean", "Clean Title", "ممتاز"],
                ["salvage", "Salvage Title", "حادث"],
                ["rebuilt", "Rebuilt Title", "حادث إعادة بناء"],
                ["flood", "Flood Title", "غرق"],
                ["theft", "Theft Title", "سرقة"],
              ].map(([k, en, ar]) => (
                <label key={k} style={{ display: "flex", gap: 8, alignItems: "center", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={!!titleSituation[k]}
                    onChange={(e) => setTitleSituation((p) => ({ ...p, [k]: e.target.checked }))}
                  />
                  <span style={{ fontWeight: 800 }}>{en}</span>
                  <span dir="rtl" style={{ color: "#666" }}>
                    {ar}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <label style={lbl}>ECU Faults / أعطال الكمبيوتر</label>
            <textarea value={ecuFaults} onChange={(e) => setEcuFaults(e.target.value)} style={ta} />
          </div>
        </section>

        {/* Panels */}
        <SectionTable
          titleEn="Panels & Plastic Covers"
          titleAr="الفايبر والبلاستيك"
          subtitleEn="Check Panels And Plastic Covers Paint & Condition"
          subtitleAr="فحص حالة الفايبر والغطاء"
          groups={[
            {
              groupId: "fairing",
              groupEn: "Fairing",
              groupAr: "الفايبر",
              items: [
                { itemId: "panel_front_fairing", itemEn: "Front Fairing", itemAr: "فايبر أمامي" },
                { itemId: "panel_front_fender", itemEn: "Front Fender", itemAr: "رفرف أمامي" },
                { itemId: "panel_tail_fairing", itemEn: "Tail Fairing", itemAr: "الذيل / الخلف" },
                { itemId: "panel_rear_fender", itemEn: "Rear Fender", itemAr: "رفرف خلفي" },
                { itemId: "panel_tank", itemEn: "Tank", itemAr: "تانك البنزين" },
              ],
            },
            {
              groupId: "chrome_paint",
              groupEn: "Chrome & Paint",
              groupAr: "الكروم والدهان",
              items: [
                { itemId: "chrome_condition", itemEn: "Chrome Condition", itemAr: "حالة الكروم" },
                { itemId: "paint_condition", itemEn: "Paint Condition", itemAr: "حالة الدهان" },
              ],
            },
          ]}
          notes={panelsNotes}
          setNotes={setPanelsNotes}
          overallRate={panelsRate}
          setOverallRate={setPanelsRate}
          generalNotes={panelsGeneral}
          setGeneralNotes={setPanelsGeneral}
        />

        {/* Tires & Wheels */}
        <SectionTable
          titleEn="Tires & Wheels"
          titleAr="الإطارات والجنوط"
          subtitleEn="Check Wheels Condition & Tires Production Date"
          subtitleAr="فحص حالة الجنوط وتاريخ الإطارات"
          groups={[
            {
              groupId: "rims",
              groupEn: "Rims",
              groupAr: "جنوط",
              items: [
                { itemId: "rim_front", itemEn: "Front Rim", itemAr: "جنط أمامي" },
                { itemId: "rim_rear", itemEn: "Rear Rim", itemAr: "جنط خلفي" },
              ],
            },
            {
              groupId: "tires",
              groupEn: "Tires",
              groupAr: "كاوتش",
              items: [
                { itemId: "tire_front", itemEn: "Front Tire", itemAr: "كاوتش أمامي" },
                { itemId: "tire_rear", itemEn: "Rear Tire", itemAr: "كاوتش خلفي" },
              ],
            },
          ]}
          notes={tiresWheelsNotes}
          setNotes={setTiresWheelsNotes}
          overallRate={tiresWheelsRate}
          setOverallRate={setTiresWheelsRate}
          generalNotes={tiresWheelsGeneral}
          setGeneralNotes={setTiresWheelsGeneral}
        />

        {/* Braking System */}
        <SectionTable
          titleEn="Braking System"
          titleAr="نظام الفرامل"
          subtitleEn="Check Calipers, Masters, Discs, Hoses and Pads"
          subtitleAr="فحص الكالبرز والماستر والديسكات والخراطيم والتيل"
          groups={[
            {
              groupId: "calipers",
              groupEn: "Disc brake Calipers",
              groupAr: "كالبرز",
              items: [
                { itemId: "calipers_front", itemEn: "Front Calipers", itemAr: "كالبر أمامي" },
                { itemId: "calipers_rear", itemEn: "Rear Caliper or Drum", itemAr: "كالبر خلفي / درام" },
              ],
            },
            {
              groupId: "masters",
              groupEn: "Masters",
              groupAr: "ماستر فرامل",
              items: [
                { itemId: "master_front", itemEn: "Front Master", itemAr: "ماستر أمامي" },
                { itemId: "master_rear", itemEn: "Rear Master", itemAr: "ماستر خلفي" },
              ],
            },
            {
              groupId: "discs",
              groupEn: "Discs",
              groupAr: "الديسكات",
              items: [
                { itemId: "disc_front", itemEn: "Front Discs", itemAr: "ديسك أمامي" },
                { itemId: "disc_rear", itemEn: "Rear Discs", itemAr: "ديسك خلفي" },
              ],
            },
            {
              groupId: "hoses",
              groupEn: "Brake Hoses",
              groupAr: "خراطيم",
              items: [
                { itemId: "hose_front", itemEn: "Front Hoses", itemAr: "خرطوم أمامي" },
                { itemId: "hose_rear", itemEn: "Rear Hose", itemAr: "خرطوم خلفي" },
              ],
            },
            {
              groupId: "pads",
              groupEn: "Brake Pads",
              groupAr: "تيل",
              items: [
                { itemId: "pads_front", itemEn: "Front Brake Pads", itemAr: "تيل أمامي" },
                { itemId: "pads_rear", itemEn: "Rear Brake Pads", itemAr: "تيل خلفي" },
              ],
            },
            {
              groupId: "oil",
              groupEn: "Brake Oil",
              groupAr: "زيت الفرامل",
              items: [{ itemId: "brake_oil_status", itemEn: "Brake Oil Status", itemAr: "حالة زيت الفرامل" }],
            },
          ]}
          notes={brakesSysNotes}
          setNotes={setBrakesSysNotes}
          overallRate={brakesSysRate}
          setOverallRate={setBrakesSysRate}
          generalNotes={brakesSysGeneral}
          setGeneralNotes={setBrakesSysGeneral}
        />

        {/* Controlling System */}
        <SectionTable
          titleEn="Controlling System"
          titleAr="التحكم"
          subtitleEn="Check Levers, Pedals and Mirrors"
          subtitleAr="فحص المقابض والدواسات والمرايات"
          groups={[
            {
              groupId: "levers",
              groupEn: "Levers",
              groupAr: "مقابض",
              items: [
                { itemId: "lever_front_right", itemEn: "Front Right Lever", itemAr: "مقبض يمين" },
                { itemId: "lever_front_left", itemEn: "Front Left Lever", itemAr: "مقبض شمال" },
              ],
            },
            {
              groupId: "pedals",
              groupEn: "Pedals",
              groupAr: "دواسات",
              items: [
                { itemId: "pedal_brake", itemEn: "Brake Pedal", itemAr: "دواسة فرامل" },
                { itemId: "pedal_shift", itemEn: "Shift Pedal", itemAr: "دواسة غيارات" },
              ],
            },
            {
              groupId: "mirrors",
              groupEn: "Mirrors",
              groupAr: "مرايات",
              items: [
                { itemId: "mirror_right", itemEn: "Right Mirror", itemAr: "مراية يمين" },
                { itemId: "mirror_left", itemEn: "Left Mirror", itemAr: "مراية شمال" },
              ],
            },
          ]}
          notes={controlNotes}
          setNotes={setControlNotes}
          overallRate={controlRate}
          setOverallRate={setControlRate}
          generalNotes={controlGeneral}
          setGeneralNotes={setControlGeneral}
        />

        {/* Steering */}
        <SectionTable
          titleEn="Steering System"
          titleAr="نظام التوجيه"
          subtitleEn="Check Steering Head, Handle Bars, and Forks"
          subtitleAr="فحص الرقبة والجادون والمساعدين"
          groups={[
            {
              groupId: "steering",
              groupEn: "Steering",
              groupAr: "الرقبة",
              items: [
                { itemId: "steering_head", itemEn: "Steering Head", itemAr: "الرقبة" },
                { itemId: "steering_bearing", itemEn: "Steering Head Ball Bearing", itemAr: "رولمان بلي الرقبة" },
              ],
            },
            {
              groupId: "handlebars",
              groupEn: "Handle Bars",
              groupAr: "الجادون",
              items: [{ itemId: "handle_bars", itemEn: "Handle Bars", itemAr: "الجادون" }],
            },
            {
              groupId: "forks",
              groupEn: "Forks & Shocks",
              groupAr: "المساعدين",
              items: [
                { itemId: "fork_front_right", itemEn: "Front Right Fork", itemAr: "مساعد أمامي يمين" },
                { itemId: "fork_front_left", itemEn: "Front Left Fork", itemAr: "مساعد أمامي شمال" },
                { itemId: "shock_rear_right", itemEn: "Rear Right Shock", itemAr: "مساعد خلفي يمين" },
                { itemId: "shock_rear_left", itemEn: "Rear Left Shock", itemAr: "مساعد خلفي شمال" },
              ],
            },
          ]}
          notes={steeringNotes}
          setNotes={setSteeringNotes}
          overallRate={steeringRate}
          setOverallRate={setSteeringRate}
          generalNotes={steeringGeneral}
          setGeneralNotes={setSteeringGeneral}
        />

        {/* Engine */}
        <SectionTable
          titleEn="Engine"
          titleAr="المحرك"
          subtitleEn="Check Engine Condition, Sound, Performance"
          subtitleAr="فحص حالة المحرك وصوته والأداء"
          groups={[
            {
              groupId: "engine_check",
              groupEn: "Engine Check",
              groupAr: "كشف المحرك",
              items: [
                { itemId: "eng_overall", itemEn: "Overall Condition & Bolts", itemAr: "الحالة العامة وربط المسامير" },
                { itemId: "eng_leaks", itemEn: "Any Fluid Leaks (Oil/Water/Fuel)", itemAr: "أي تسريب (زيت/مياه/بنزين)" },
                { itemId: "eng_damage", itemEn: "Any Damage or Welding", itemAr: "أي كسر أو لحام" },
                { itemId: "eng_gaskets", itemEn: "Covers Gaskets & Sealing", itemAr: "الجوانات والسيلكون" },
              ],
            },
            {
              groupId: "engine_sound",
              groupEn: "Engine Sound",
              groupAr: "صوت المحرك",
              items: [
                { itemId: "sound_valves", itemEn: "Valves Sound", itemAr: "صوت التكيهات" },
                { itemId: "sound_timing", itemEn: "Timing Chain/Cam Sound", itemAr: "صوت الكاتينة" },
                { itemId: "sound_strange", itemEn: "Any Strange Sound", itemAr: "أصوات غريبة" },
              ],
            },
            {
              groupId: "performance",
              groupEn: "Performance",
              groupAr: "الأداء",
              items: [{ itemId: "compression", itemEn: "Engine Compression", itemAr: "اختبار كبس المحرك" }],
            },
          ]}
          notes={engineNotesMap}
          setNotes={setEngineNotesMap}
          overallRate={engineRate}
          setOverallRate={setEngineRate}
          generalNotes={engineGeneral}
          setGeneralNotes={setEngineGeneral}
        />

        {/* Chassis */}
        <SectionTable
          titleEn="Chassis"
          titleAr="الشاسيه"
          subtitleEn="Check Chassis and Frame Condition"
          subtitleAr="فحص حالة الشاسيه"
          groups={[
            {
              groupId: "chassis",
              groupEn: "Chassis",
              groupAr: "الشاسيه",
              items: [
                { itemId: "frame_main", itemEn: "The Main Frame", itemAr: "الشاسيه الرئيسي" },
                { itemId: "frame_sub", itemEn: "The Sub Frame", itemAr: "الشاسيه الخلفي" },
                { itemId: "swingarm", itemEn: "The Swingarm", itemAr: "المقص الخلفي" },
              ],
            },
          ]}
          notes={chassisNotes}
          setNotes={setChassisNotes}
          overallRate={chassisRate}
          setOverallRate={setChassisRate}
          generalNotes={chassisGeneral}
          setGeneralNotes={setChassisGeneral}
        />

        {/* Cooling */}
        <SectionTable
          titleEn="Cooling System"
          titleAr="دورة التبريد"
          subtitleEn="Check Radiator, Fan and Thermostat Condition"
          subtitleAr="فحص الردياتير والمروحة"
          groups={[
            {
              groupId: "cooling",
              groupEn: "Cooling",
              groupAr: "التبريد",
              items: [
                { itemId: "radiator", itemEn: "Radiator Condition", itemAr: "حالة الردياتير" },
                { itemId: "fan", itemEn: "Radiator Fan Condition", itemAr: "حالة المروحة" },
                { itemId: "cooling_general", itemEn: "General Condition", itemAr: "حالة عامة" },
              ],
            },
          ]}
          notes={coolingNotes}
          setNotes={setCoolingNotes}
          overallRate={coolingRate}
          setOverallRate={setCoolingRate}
          generalNotes={coolingGeneral}
          setGeneralNotes={setCoolingGeneral}
        />

        {/* Charging */}
        <SectionTable
          titleEn="Charging System"
          titleAr="الشحن"
          subtitleEn="Check Battery, Generator And Rectifier"
          subtitleAr="فحص البطارية والدينامو والريجوليتر"
          groups={[
            {
              groupId: "charging",
              groupEn: "Charging",
              groupAr: "الشحن",
              items: [
                { itemId: "charging_status", itemEn: "Charging Condition", itemAr: "حالة الشحن" },
                { itemId: "battery", itemEn: "Battery Condition", itemAr: "حالة البطارية" },
                { itemId: "generator", itemEn: "Generator Condition", itemAr: "حالة الدينامو" },
                { itemId: "regulator", itemEn: "Regulator Plug Condition", itemAr: "فيشة الريجوليتر" },
              ],
            },
          ]}
          notes={chargingNotes}
          setNotes={setChargingNotes}
          overallRate={chargingRate}
          setOverallRate={setChargingRate}
          generalNotes={chargingGeneral}
          setGeneralNotes={setChargingGeneral}
        />

        {/* Exhaust */}
        <SectionTable
          titleEn="Exhaust System"
          titleAr="الشكمان"
          subtitleEn="Check Exhaust Pipes And Muffler Condition"
          subtitleAr="فحص الهيدر والشكمان"
          groups={[
            {
              groupId: "exhaust",
              groupEn: "Exhaust",
              groupAr: "الشكمان",
              items: [
                { itemId: "pipes", itemEn: "Exhaust Pipes Condition", itemAr: "حالة الهيدر" },
                { itemId: "muffler", itemEn: "Muffler Condition", itemAr: "حالة الشكمان" },
              ],
            },
          ]}
          notes={exhaustNotes}
          setNotes={setExhaustNotes}
          overallRate={exhaustRate}
          setOverallRate={setExhaustRate}
          generalNotes={exhaustGeneral}
          setGeneralNotes={setExhaustGeneral}
        />

        {/* Electrical */}
        <SectionTable
          titleEn="Electrical System"
          titleAr="الكهرباء"
          subtitleEn="Check All Switches, Lights and Connectors Condition"
          subtitleAr="فحص المفاتيح والإضاءة"
          groups={[
            {
              groupId: "switches",
              groupEn: "Switches",
              groupAr: "المفاتيح",
              items: [
                { itemId: "sw_ignition", itemEn: "Ignition Switch", itemAr: "مفتاح الكونتاكت" },
                { itemId: "sw_onoff", itemEn: "On/Off Switch", itemAr: "مفتاح الطوارئ" },
                { itemId: "sw_start", itemEn: "Start Engine Switch", itemAr: "زرار المارش" },
                { itemId: "sw_lights", itemEn: "Lights Switches", itemAr: "مفتاح الأنوار" },
                { itemId: "sw_signals", itemEn: "Turn Signal Switches", itemAr: "سوستة الإشارات" },
                { itemId: "sw_horn", itemEn: "Horn Switch", itemAr: "زرار الكلاكس" },
                { itemId: "sw_brakes", itemEn: "Brakes Switches", itemAr: "مفتاح لمبة الفرامل" },
              ],
            },
            {
              groupId: "lights",
              groupEn: "Lights",
              groupAr: "الإضاءة",
              items: [
                { itemId: "light_head", itemEn: "Head Lights", itemAr: "الأنوار الأمامية" },
                { itemId: "light_rear", itemEn: "Rear Light", itemAr: "النور الخلفي" },
                { itemId: "light_brake", itemEn: "Brakes Light", itemAr: "نور الفرامل" },
                { itemId: "light_signals", itemEn: "Turn Signal Lights", itemAr: "نور الإشارات" },
              ],
            },
            {
              groupId: "horn",
              groupEn: "Horn",
              groupAr: "الكلاكس",
              items: [{ itemId: "horn_item", itemEn: "Horn", itemAr: "الكلاكس" }],
            },
          ]}
          notes={electricalNotesMap}
          setNotes={setElectricalNotesMap}
          overallRate={electricalRate}
          setOverallRate={setElectricalRate}
          generalNotes={electricalGeneral}
          setGeneralNotes={setElectricalGeneral}
        />

        {/* Final Drive */}
        <SectionTable
          titleEn="Final Drive"
          titleAr="نقل الحركة"
          subtitleEn="Check Sprockets And Drive Chain"
          subtitleAr="فحص السير/الجنزير"
          groups={[
            {
              groupId: "drive_train",
              groupEn: "Drive Train",
              groupAr: "نقل الحركة",
              items: [
                {
                  itemId: "drive_chain",
                  itemEn: "Drive Chain / Belt / Differential Condition",
                  itemAr: "السير/الكورونة/الديفرنس",
                },
              ],
            },
          ]}
          notes={finalDriveNotes}
          setNotes={setFinalDriveNotes}
          overallRate={finalDriveRate}
          setOverallRate={setFinalDriveRate}
          generalNotes={finalDriveGeneral}
          setGeneralNotes={setFinalDriveGeneral}
        />

        {/* Others */}
        <SectionTable
          titleEn="Others"
          titleAr="أخرى"
          subtitleEn="Seats - kickstand etc..."
          subtitleAr="كرسي - الدبوس - دواسات..."
          groups={[
            {
              groupId: "seats",
              groupEn: "Seats & Backrests",
              groupAr: "الكراسي والمسند",
              items: [{ itemId: "seat_condition", itemEn: "Seat Condition", itemAr: "حالة الكرسي/المسند" }],
            },
            {
              groupId: "sidestand",
              groupEn: "Sidestand",
              groupAr: "الدبوس",
              items: [{ itemId: "sidestand_condition", itemEn: "Sidestand Condition", itemAr: "حالة الدبوس" }],
            },
            {
              groupId: "footpegs",
              groupEn: "Foot Pegs",
              groupAr: "الدواسات",
              items: [
                { itemId: "footpeg_right", itemEn: "Right Driver Foot Peg", itemAr: "دواسة يمين" },
                { itemId: "footpeg_left", itemEn: "Left Driver Foot Peg", itemAr: "دواسة شمال" },
                { itemId: "footpeg_passenger", itemEn: "Passenger Foot Peg", itemAr: "دواسة الراكب" },
              ],
            },
            {
              groupId: "windscreen",
              groupEn: "Windscreen",
              groupAr: "السكرينة",
              items: [{ itemId: "windscreen_condition", itemEn: "Windscreen Condition", itemAr: "حالة السكرينة" }],
            },
          ]}
          notes={othersNotes}
          setNotes={setOthersNotes}
          overallRate={othersRate}
          setOverallRate={setOthersRate}
          generalNotes={othersGeneral}
          setGeneralNotes={setOthersGeneral}
        />

        {/* Test Drive */}
        <section style={section}>
          <div style={blackBar}>TEST Drive / تجربة قيادة</div>
          <div style={{ marginTop: 10 }}>
            <label style={lbl}>TEST Drive Results / نتائج اختبار القيادة</label>
            <textarea value={testDriveResults} onChange={(e) => setTestDriveResults(e.target.value)} style={{ ...ta, minHeight: 110 }} />
          </div>
        </section>

        {/* Final Summary */}
        <section style={section}>
          <div style={blackBar}>Final Inspection Summary / ملخص الفحص</div>
          <div style={{ marginTop: 10 }}>
            <label style={lbl}>Conclusion / الخلاصة</label>
            <textarea value={finalSummary} onChange={(e) => setFinalSummary(e.target.value)} style={{ ...ta, minHeight: 160 }} />
          </div>
        </section>

        <button
          type="button"
          onClick={onSubmit}
          style={{
            padding: "12px 16px",
            borderRadius: 12,
            border: "none",
            background: canSubmit ? "#d10000" : "#eee",
            color: canSubmit ? "white" : "#666",
            fontWeight: 900,
            cursor: "pointer",
          }}
        >
          Preview
        </button>
      </form>
    </main>
  );
}

const section = {
  padding: 16,
  border: "1px solid #eee",
  borderRadius: 16,
  background: "#fff",
};

const blackBar = {
  background: "#000",
  color: "#fff",
  padding: "10px 14px",
  borderRadius: 12,
  fontWeight: 900,
};

const lbl = { fontWeight: 800, display: "block" };

const inp = {
  width: "100%",
  marginTop: 6,
  padding: 12,
  borderRadius: 12,
  border: "1px solid #ddd",
};

const ta = {
  width: "100%",
  marginTop: 6,
  padding: 12,
  borderRadius: 12,
  border: "1px solid #ddd",
  minHeight: 90,
  fontFamily: "system-ui",
};
