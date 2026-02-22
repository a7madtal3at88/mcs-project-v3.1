const REPORTS_KEY = "mcs_reports_v1";
const COUNTER_KEY = "mcs_inspection_counter_v1";

// 👇 حط هنا أي Keys قديمة كنت مستخدمها قبل كده
const LEGACY_REPORT_KEYS = [
  "mcs_reports",            // احتمال
  "reports",                // احتمال
  "REPORTS_KEY",            // احتمال
  "mcs_inspections_reports",// احتمال
];

const LEGACY_COUNTER_KEYS = [
  "mcs_inspection_counter",
  "counter",
  "INSPECTION_COUNTER",
];

function isBrowser() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function readJSON(key, fallback) {
  if (!isBrowser()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

function migrateIfNeeded() {
  if (!isBrowser()) return;

  // لو الجديد فاضي… نحاول نجيب من القديم
  const currentReports = readJSON(REPORTS_KEY, null);
  const hasNew = Array.isArray(currentReports) && currentReports.length > 0;

  if (!hasNew) {
    for (const k of LEGACY_REPORT_KEYS) {
      const legacy = readJSON(k, null);
      if (Array.isArray(legacy) && legacy.length > 0) {
        writeJSON(REPORTS_KEY, legacy);
        break;
      }
    }
  }

  const currentCounter = readJSON(COUNTER_KEY, null);
  const hasCounter = typeof currentCounter === "number" || typeof currentCounter === "string";

  if (!hasCounter) {
    for (const k of LEGACY_COUNTER_KEYS) {
      const legacyCounter = readJSON(k, null);
      if (legacyCounter !== null && legacyCounter !== undefined) {
        const n = Number(legacyCounter || 0);
        writeJSON(COUNTER_KEY, isNaN(n) ? 0 : n);
        break;
      }
    }
  }
}

// ===================== Reports =====================

export function getReports() {
  migrateIfNeeded();
  return readJSON(REPORTS_KEY, []);
}

export function saveReport(reportObject) {
  migrateIfNeeded();
  const all = getReports();
  all.unshift(reportObject); // newest first
  writeJSON(REPORTS_KEY, all);
}

export function clearReports() {
  if (!isBrowser()) return;
  try {
    localStorage.removeItem(REPORTS_KEY);
  } catch {
    // ignore
  }
}

// ===================== Counter / Inspection No =====================

export function getNextInspectionNo() {
  migrateIfNeeded();
  const current = readJSON(COUNTER_KEY, 0);
  const next = Number(current || 0) + 1;
  writeJSON(COUNTER_KEY, next);
  return `MCS-INSP-${String(next).padStart(5, "0")}`;
}

export function resetInspectionCounter() {
  writeJSON(COUNTER_KEY, 0);
}
export function exportBackupData() {
  migrateIfNeeded();

  const reports = readJSON(REPORTS_KEY, []);
  const counter = readJSON(COUNTER_KEY, 0);

  return {
    app: "MCS Inspection System",
    version: 1,
    exportedAt: new Date().toISOString(),
    reports,
    counter,
  };
}

export function importBackupData(backup) {
  if (!backup || typeof backup !== "object") throw new Error("Invalid backup file");

  const reports = Array.isArray(backup.reports) ? backup.reports : null;
  if (!reports) throw new Error("Backup missing reports");

  const counter = Number(backup.counter || 0);
  if (Number.isNaN(counter)) throw new Error("Backup counter is invalid");

  writeJSON(REPORTS_KEY, reports);
  writeJSON(COUNTER_KEY, counter);

  return { reportsCount: reports.length, counter };
}