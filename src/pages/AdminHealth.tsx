import React, { useEffect, useState } from "react";
import { CLASSES } from "../theme";
import AdminTabs from "./AdminTabs";

type Health = {
  storageKB: number;
  storagePct: number;
  online: boolean;
  uptimeMs: number;
  casesCount: number;
  openCount: number;
  claimedCount: number;
};

function readHealth(): Health {
  let used = 0;
  try { used = new Blob(Object.values(localStorage)).size; } catch {}
  const quota = 5 * 1024 * 1024; // approx
  let casesCount = 0, openCount = 0, claimedCount = 0;
  try {
    const keys = Object.keys(localStorage).filter(k => k.startsWith("mas.cases."));
    let all: any[] = [];
    for (const k of keys) {
      const arr = JSON.parse(localStorage.getItem(k) || "[]");
      if (Array.isArray(arr)) all = all.concat(arr);
    }
    casesCount = all.length;
    openCount = all.filter((c: any) => c?.status === "Open").length;
    claimedCount = all.filter((c: any) => !!c?.claimedBy).length;
  } catch {}
  return {
    storageKB: used / 1024,
    storagePct: Math.min(100, Math.round((used / quota) * 100)),
    online: navigator.onLine,
    uptimeMs: 0,
    casesCount, openCount, claimedCount
  };
}

const AdminHealth: React.FC = () => {
  const [mountedAt] = useState<number>(Date.now());
  const [health, setHealth] = useState<Health>(() => readHealth());
  useEffect(() => {
    const id = setInterval(() => setHealth(readHealth()), 3000);
    return () => clearInterval(id);
  }, []);
  const mins = Math.floor((Date.now() - mountedAt) / 60000);
  const secs = Math.floor(((Date.now() - mountedAt) % 60000) / 1000);

  return (
    <div className="min-h-screen bg-neutral-950">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-2xl text-white font-semibold">System Health</h1>
        <AdminTabs />
        <div className="grid md:grid-cols-3 gap-4 mt-2">
          <div className={`${CLASSES.card} p-4`}>
            <div className="text-white font-medium mb-2">Status</div>
            <div className="text-neutral-300 text-sm space-y-1">
              <div>Online: <span className="text-white">{health.online ? "Yes" : "No"}</span></div>
              <div>Uptime (page): <span className="text-white">{mins}m {secs}s</span></div>
            </div>
          </div>
          <div className={`${CLASSES.card} p-4`}>
            <div className="text-white font-medium mb-2">Storage</div>
            <div className="text-neutral-300 text-sm space-y-1">
              <div>LocalStorage used: <span className="text-white">{health.storageKB.toFixed(1)} KB</span></div>
              <div>Approx usage: <span className="text-white">{health.storagePct}%</span></div>
            </div>
          </div>
          <div className={`${CLASSES.card} p-4`}>
            <div className="text-white font-medium mb-2">Case Stats</div>
            <div className="text-neutral-300 text-sm space-y-1">
              <div>Cases: <span className="text-white">{health.casesCount}</span></div>
              <div>Open: <span className="text-white">{health.openCount}</span></div>
              <div>Claimed: <span className="text-white">{health.claimedCount}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminHealth;
