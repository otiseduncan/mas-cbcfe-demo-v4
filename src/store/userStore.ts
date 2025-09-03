export type Role = "TECH" | "MGR" | "ADMIN";
export type UserRec = { username: string; displayName: string; role: Role; password: string; active?: boolean };
const LS_KEY = "mas.users.v1";

export function bootstrapUsers() {
  if (localStorage.getItem(LS_KEY)) return;
  const demo: UserRec[] = [
    { username: "technician@mas.demo", displayName: "Technician", role: "TECH", password: "tech123", active: true },
    { username: "manager@mas.demo", displayName: "Manager", role: "MGR", password: "mgr123", active: true },
    { username: "admin@mas.demo", displayName: "Administrator", role: "ADMIN", password: "admin123", active: true },
  ];
  localStorage.setItem(LS_KEY, JSON.stringify(demo));
}
function load(): UserRec[] { const raw = localStorage.getItem(LS_KEY); if (!raw) return []; try { return JSON.parse(raw) as UserRec[]; } catch { return []; } }
function save(list: UserRec[]) { localStorage.setItem(LS_KEY, JSON.stringify(list)); }

export function listUsers(): UserRec[] { return load().sort((a,b) => a.username.localeCompare(b.username)); }
export function findUser(username: string): UserRec | undefined { return load().find(u => u.username.toLowerCase() === username.toLowerCase()); }
export function addUser(u: UserRec) {
  const list = load();
  if (list.some(x => x.username.toLowerCase() == u.username.toLowerCase())) throw new Error("User already exists");
  list.push({ ...u, active: u.active ?? true });
  save(list);
}
export function updateUser(username: string, patch: Partial<UserRec>) {
  const list = load();
  const idx = list.findIndex(u => u.username.toLowerCase() === username.toLowerCase());
  if (idx === -1) throw new Error("User not found");
  list[idx] = { ...list[idx], ...patch };
  save(list);
}
export function deleteUser(username: string) {
  const list = load().filter(u => u.username.toLowerCase() !== username.toLowerCase());
  save(list);
}
