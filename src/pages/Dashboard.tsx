import React, { useEffect, useState, useMemo } from "react";
import { listCases } from "../store/caseStore";
import type { CaseItem } from "../store/caseStore";
import { CLASSES } from "../theme";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const STALE_MS = 15 * 60 * 1000;

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<"All" | "Open" | "Closed">("All");
  const [q, setQ] = useState("");

  useEffect(() => { setCases(listCases()); }, []);

  const filtered = useMemo(() => {
    return cases.filter(c => {
      if (statusFilter !== "All" && c.status !== statusFilter) return false;
      if (!q) return true;
      const text = (c.ro + " " + c.vin + " " + c.shop + " " + c.issueType + " " + c.notes).toLowerCase();
      return text.includes(q.toLowerCase());
    });
  }, [cases, statusFilter, q]);

  const ordered = useMemo(() => {
    const now = Date.now();
    const withFlags = filtered.map(c => ({ c, stale: (!c.claimedBy && c.status === "Open" && (now - c.createdAt) > STALE_MS) }));
    withFlags.sort((a,b) => {
      if (a.stale && !b.stale) return -1;
      if (!a.stale && b.stale) return 1;
      return b.c.updatedAt - a.c.updatedAt;
    });
    return withFlags;
  }, [filtered]);

  return (
    <div className={`${CLASSES.bg} min-h-screen`}>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="text-2xl text-white font-semibold">Cases</h1>
          <div className="flex items-center gap-2">
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} className={CLASSES.input + " w-auto"}>
              <option>All</option>
              <option>Open</option>
              <option>Closed</option>
            </select>
            <input placeholder="Search RO / VIN / Shop / Issue" className={CLASSES.input} value={q} onChange={e => setQ(e.target.value)} />
            <Link to="/new" className={CLASSES.btnPrimary}>New Case</Link>
          </div>
        </div>

        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ordered.map((item: { c: CaseItem; stale: boolean }) => {
            const { c, stale } = item;
            return (
              <Link to={`/case/${c.id}`} key={c.id} className={`${CLASSES.card} p-4 hover:border-neutral-600 transition relative ${stale ? 'glow-red' : ''}`}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-neutral-400">{new Date(c.updatedAt).toLocaleString()}</span>
                  {c.status === "Open" ? <span className={CLASSES.badgeOpen}>Open</span> : <span className={CLASSES.badgeClosed}>Closed</span>}
                </div>
                <div className="text-white font-medium">{c.ro} • {c.shop}</div>
                <div className="text-neutral-400 text-sm">{c.vin}</div>
                <div className="text-neutral-300 mt-2 text-sm">{c.issueType}</div>
                <div className="text-neutral-500 text-xs mt-1">Created by: <span className="text-neutral-300">{c.createdBy}</span></div>
                {c.claimedBy && (<div className="mt-2 text-xs text-red-300">Claimed by {c.claimedByName || c.claimedBy}</div>)}
                {c.attachments && c.attachments.length > 0 && (
                  <img src={c.attachments[0].dataUrl} alt="" className="absolute bottom-2 right-2 w-12 h-12 object-cover rounded border border-neutral-700 shadow" />
                )}
              </Link>
            );
          })}
          {ordered.length === 0 && (
            <div className={`${CLASSES.card} p-6 text-neutral-400`}>No cases match your filters.</div>
          )}
        </div>

        <div className="mt-10 text-xs text-neutral-500">
          Signed in as <span className="text-neutral-300">{user?.displayName}</span> — {user?.role === "MGR" ? "Manager" : user?.role === "ADMIN" ? "Admin" : "Technician"}
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
