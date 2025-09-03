import React, { useMemo } from "react";
import { listCases } from "../store/caseStore";
import { CLASSES } from "../theme";

function countBy(arr: string[]): Record<string, number> {
  return arr.reduce((acc, k) => { acc[k] = (acc[k] || 0) + 1; return acc; }, {} as Record<string, number>);
}
function maxVal(obj: Record<string, number>): number {
  return Math.max(1, ...Object.values(obj));
}
const Bar: React.FC<{label: string; value: number; max: number}> = ({ label, value, max }) => (
  <div className="flex items-center gap-3">
    <div className="w-40 text-sm text-neutral-300 truncate">{label}</div>
    <div className="flex-1 h-3 bg-neutral-800 rounded">
      <div className="h-3 bg-red-600 rounded" style={{ width: `${Math.round((value / max) * 100)}%` }} />
    </div>
    <div className="w-10 text-right text-neutral-400 text-sm">{value}</div>
  </div>
);

const Analytics: React.FC = () => {
  const cases = listCases();
  const byShop = useMemo(() => countBy(cases.map(c => c.shop)), [cases]);
  const byIssue = useMemo(() => countBy(cases.map(c => c.issueType)), [cases]);
  const byStatus = useMemo(() => countBy(cases.map(c => c.status)), [cases]);

  return (
    <div className={`${CLASSES.bg} min-h-screen`}>
      <div className="max-w-5xl mx-auto px-4 py-6">
        <h1 className="text-2xl text-white font-semibold">Analytics</h1>
        <div className="grid lg:grid-cols-2 gap-6 mt-6">
          <div className={`${CLASSES.card} p-6`}>
            <div className="text-white font-medium mb-4">Cases by Shop</div>
            <div className="space-y-3">
              {Object.entries(byShop).map(([k, v]) => (<Bar key={k} label={k} value={v} max={maxVal(byShop)} />))}
              {Object.keys(byShop).length === 0 && (<div className="text-neutral-400 text-sm">No data.</div>)}
            </div>
          </div>
          <div className={`${CLASSES.card} p-6`}>
            <div className="text-white font-medium mb-4">Cases by Issue Type</div>
            <div className="space-y-3">
              {Object.entries(byIssue).map(([k, v]) => (<Bar key={k} label={k} value={v} max={maxVal(byIssue)} />))}
              {Object.keys(byIssue).length === 0 && (<div className="text-neutral-400 text-sm">No data.</div>)}
            </div>
          </div>
        </div>
        <div className="grid lg:grid-cols-2 gap-6 mt-6">
          <div className={`${CLASSES.card} p-6`}>
            <div className="text-white font-medium mb-4">Open vs Closed</div>
            <div className="space-y-3">
              {["Open","Closed"].map(k => (<Bar key={k} label={k} value={byStatus[k] || 0} max={maxVal(byStatus)} />))}
            </div>
          </div>
          <div className={`${CLASSES.card} p-6`}>
            <div className="text-white font-medium mb-4">Totals</div>
            <div className="grid grid-cols-3 text-center gap-4">
              <div><div className="text-3xl text-white">{cases.length}</div><div className="text-neutral-400 text-sm">Cases</div></div>
              <div><div className="text-3xl text-white">{byStatus["Open"] || 0}</div><div className="text-neutral-400 text-sm">Open</div></div>
              <div><div className="text-3xl text-white">{byStatus["Closed"] || 0}</div><div className="text-neutral-400 text-sm">Closed</div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Analytics;
