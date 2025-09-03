export type Notice = { id: string; type: "create" | "claim" | "release" | "status" | "attach"; caseId: string; ro: string; by: string; display: string; at: number; details?: string; };
const LS_KEY = "mas.notices.v1";
function load(): Notice[] { const raw = localStorage.getItem(LS_KEY); if (!raw) return []; try { return JSON.parse(raw) as Notice[]; } catch { return []; } }
function save(list: Notice[]) { localStorage.setItem(LS_KEY, JSON.stringify(list)); }
function uid() { return Math.random().toString(36).slice(2, 10); }
export function pushNotice(n: Omit<Notice, "id" | "at"> & { at?: number }) { const list = load(); list.push({ ...n, id: uid(), at: n.at ?? Date.now() }); save(list); }
export function listNotices(): Notice[] { return load().sort((a, b) => b.at - a.at); }
