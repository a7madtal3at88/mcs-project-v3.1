"use client";

import { useEffect } from "react";

export default function RegisterSW() {
  useEffect(() => {
    let didReload = false;

    async function run() {
      if (!("serviceWorker" in navigator)) return;

      try {
        await navigator.serviceWorker.register("/sw.js", { scope: "/" });

        // استنى لحد ما يبقى جاهز
        await navigator.serviceWorker.ready;

        // iOS ساعات بيسجل الـ SW بس مايمسكش الصفحة إلا بعد Reload
        if (!navigator.serviceWorker.controller) {
          // Reload مرة واحدة بس
          if (!didReload) {
            didReload = true;
            window.location.reload();
          }
        }
      } catch (e) {
        // ignore
      }
    }

    run();
  }, []);

  return null;
}