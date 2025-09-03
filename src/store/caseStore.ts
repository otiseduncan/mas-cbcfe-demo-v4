import type { User } from "../auth/AuthContext";
import { pushNotice } from "./noticeStore";
export type CaseStatus = "Open" | "Closed";
export type Attachment = { id: string; name: string; type: string; dataUrl: string; createdAt: number; by: string; };
export type CaseItem = {
  id: string; createdAt: number; updatedAt: number; status: CaseStatus;
  ro: string; vin: string; shop: string; issueType: string; notes: string; createdBy: string;
  attachments?: Attachment[]; claimedBy?: string; claimedByName?: string; claimedAt?: number;
};
const LS_KEY = "mas.cases.v7";
function load(): CaseItem[] { const raw = localStorage.getItem(LS_KEY); if (!raw) return []; try { return JSON.parse(raw) as CaseItem[]; } catch { return []; } }
function save(cases: CaseItem[]) { localStorage.setItem(LS_KEY, JSON.stringify(cases)); }
function uid() { return Math.random().toString(36).slice(2, 10); }

export function bootstrapDemoData() {
  if (load().length) return;
  const now = Date.now();
  const demo: CaseItem[] = [
    { id: uid(), createdAt: now - 3600_000 * 72, updatedAt: now - 3600_000 * 24, status: "Open", ro: "RO-1001", vin: "1HGCM82633A004352", shop: "Gerber #12", issueType: "Bumper install", notes: "Calibration target missing.", createdBy: "technician@mas.demo", attachments: [] },
    { id: uid(), createdAt: now - 3600_000 * 1, updatedAt: now - 3600_000 * 1, status: "Open", ro: "RO-1002", vin: "2GCEK19T3Y1234567", shop: "Gerber #45", issueType: "Waiting parts", notes: "No power to OBD port.", createdBy: "technician@mas.demo", attachments: [] },
    { id: uid(), createdAt: now - 3600_000 * 120, updatedAt: now - 3600_000 * 96, status: "Closed", ro: "RO-0998", vin: "5YJ3E1EA7JF000001", shop: "Gerber #07", issueType: "Alignment hold", notes: "Module re-encoded. Ready.", createdBy: "manager@mas.demo", attachments: [] },
  ];
  save(demo);
}

export function listCases(): CaseItem[] { return load().sort((a, b) => b.updatedAt - a.updatedAt); }
export function getCase(id: string): CaseItem | undefined { return load().find(c => c.id === id); }
export function createCase(input: { ro: string; vin: string; shop: string; issueType: string; notes: string; attachments?: Attachment[] }, user: User): CaseItem {
  const now = Date.now();
  const item: CaseItem = { id: uid(), createdAt: now, updatedAt: now, status: "Open", ro: input.ro, vin: input.vin, shop: input.shop, issueType: input.issueType, notes: input.notes, createdBy: user.username, attachments: input.attachments ?? [] };
  const cases = load(); cases.push(item); save(cases);
  pushNotice({ type: "create", caseId: item.id, ro: item.ro, by: user.username, display: user.displayName, details: "New case created" });
  return item;
}
export function updateCase(id: string, patch: Partial<Omit<CaseItem, "id" | "createdAt" | "createdBy">>) {
  const cases = load(); const idx = cases.findIndex(c => c.id === id); if (idx === -1) throw new Error("Case not found");
  cases[idx] = { ...cases[idx], ...patch, updatedAt: Date.now() }; save(cases); return cases[idx];
}
export function setStatus(id: string, status: CaseStatus, by?: User) {
  const updated = updateCase(id, { status }); if (by) pushNotice({ type: "status", caseId: id, ro: updated.ro, by: by.username, display: by.displayName, details: `Status set to ${status}` }); return updated;
}
export function addAttachments(id: string, attachments: Attachment[], by?: User) {
  const c = getCase(id); if (!c) throw new Error("Case not found");
  const next = [...(c.attachments ?? []), ...attachments]; const updated = updateCase(id, { attachments: next });
  if (by && attachments.length) pushNotice({ type: "attach", caseId: id, ro: updated.ro, by: by.username, display: by.displayName, details: `${attachments.length} photo(s) added` }); return updated;
}
export function claimCase(id: string, user: User) {
  const c = getCase(id); if (!c) throw new Error("Case not found");
  const updated = updateCase(id, { claimedBy: user.username, claimedByName: user.displayName, claimedAt: Date.now() });
  pushNotice({ type: "claim", caseId: id, ro: updated.ro, by: user.username, display: user.displayName, details: "Case claimed" }); return updated;
}
export function releaseCase(id: string, user: User) {
  const c = getCase(id); if (!c) throw new Error("Case not found");
  const updated = updateCase(id, { claimedBy: undefined, claimedByName: undefined, claimedAt: undefined });
  pushNotice({ type: "release", caseId: id, ro: c.ro, by: user.username, display: user.displayName, details: "Case released" }); return updated;
}
