"use client";

import { useEffect, useState } from "react";

export default function DebugPage() {
  const [info, setInfo] = useState({
    online: typeof navigator !== "undefined" ? navigator.onLine : false,
    controller: false,
    registrations: [],
    cacheNames: [],
    cachedCore: [],
  });

  useEffect(() => {
    let mounted = true;

    async function run() {
      const online = navigator.onLine;
      const controller = !!navigator.serviceWorker?.controller;

      let registrations = [];
      try {
        const regs = await navigator.serviceWorker.getRegistrations();
        registrations = regs.map((r) => ({
          scope: r.scope,
          active: !!r.active,
          installing: !!r.installing,
          waiting: !!r.waiting,
        }));
      } catch {}

      let cacheNames = [];
      try {
        cacheNames = await caches.keys();
      } catch {}

      // شوف هل صفحات الـ CORE موجودة فعلاً في الكاش
      const checkUrls = ["/", "/saved", "/inspections/new", "/manifest.json", "/logo.png", "/offline.html"];
      let cachedCore = [];
      try {
        const cacheToUse = cacheNames[0];
        if (cacheToUse) {
          const cache = await caches.open(cacheToUse);
          const results = await Promise.all(
            checkUrls.map(async (u) => {
              const hit = await cache.match(u);
              return { url: u, cached: !!hit };
            })
          );
          cachedCore = results;
        }
      } catch {}

      if (!mounted) return;
      setInfo({ online, controller, registrations, cacheNames, cachedCore });
    }

    run();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main style={{ padding: 18, fontFamily: "system-ui", maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ marginTop: 0 }}>MCS Debug</h1>

      <div style={box}>
        <div><b>Online:</b> {String(info.online)}</div>
        <div><b>SW Controller:</b> {String(info.controller)}</div>
      </div>

      <h3>Registrations</h3>
      <pre style={pre}>{JSON.stringify(info.registrations, null, 2)}</pre>

      <h3>Cache Names</h3>
      <pre style={pre}>{JSON.stringify(info.cacheNames, null, 2)}</pre>

      <h3>Core Cached?</h3>
      <pre style={pre}>{JSON.stringify(info.cachedCore, null, 2)}</pre>

      <p style={{ color: "#666" }}>
        لو <b>SW Controller = false</b> حتى وإنت فاتح نت، يبقى الـ Home Screen standalone عندك مش بيدي التحكم للـ SW (ده غالبًا iPadOS قديم/bug).
      </p>
    </main>
  );
}

const box = {
  border: "1px solid #eee",
  borderRadius: 12,
  padding: 12,
  background: "#fafafa",
};

const pre = {
  border: "1px solid #eee",
  borderRadius: 12,
  padding: 12,
  background: "#fff",
  overflowX: "auto",
};