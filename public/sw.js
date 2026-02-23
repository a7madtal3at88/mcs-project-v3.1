const CACHE_NAME = "mcs-insp-v1";

// صفحات ثابتة نضمن إنها تشتغل offline
const CORE = [
  "/",
  "/saved",
  "/inspections/new",
  "/inspections/new/cruiser",
  "/inspections/new/cruiser/preview",
  "/inspections/new/sport",
  "/inspections/new/sport/preview",
  "/inspections/new/scooter",
  "/inspections/new/scooter/preview",

  "/manifest.json",
  "/logo.png",

  // damage maps (ضيف اللي عندك فعلاً في public/bike)
  "/bike/cruiser/cruiserleft.png",
  "/bike/cruiser/cruiserright.png",
  "/bike/cruiser/cruiserfront.png",
  "/bike/cruiser/cruiserback.png",
  "/bike/cruiser/cruisertop.png",

  "/bike/sport/sportleft.png",
  "/bike/sport/sportright.png",
  "/bike/sport/sportfront.png",
  "/bike/sport/sportback.png",
  "/bike/sport/sporttop.png",

  "/bike/scooter/scooterleft.png",
  "/bike/scooter/scooterright.png",
  "/bike/scooter/scooterfront.png",
  "/bike/scooter/scooterback.png",
  "/bike/scooter/scootertop.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;

  if (req.method !== "GET") return;

  // Cache-first للـ navigation علشان يفتح Offline
  if (req.mode === "navigate") {
    event.respondWith(
      caches.match(req).then((cached) => cached || fetch(req).catch(() => caches.match("/")))
    );
    return;
  }

  // Stale-while-revalidate لباقي الملفات
  event.respondWith(
    caches.match(req).then((cached) => {
      const fetchPromise = fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(() => cached);

      return cached || fetchPromise;
    })
  );
});