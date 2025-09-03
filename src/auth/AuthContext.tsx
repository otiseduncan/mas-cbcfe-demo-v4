import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { bootstrapUsers, findUser } from "../store/userStore";
export type Role = "TECH" | "MGR" | "ADMIN";
export type User = { username: string; displayName: string; role: Role };
type AuthContextType = {
  user: User | null;
  login: (username: string, password: string) => Promise<{ok: boolean; error?: string}>;
  logout: () => void;
};
const AuthContext = createContext<AuthContextType | undefined>(undefined);
const LS_KEY = "mas.auth.user";
export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => { bootstrapUsers(); const raw = localStorage.getItem(LS_KEY); if (raw) try { setUser(JSON.parse(raw) as User); } catch {} }, []);
  const login: AuthContextType["login"] = async (username, password) => {
    const rec = findUser(username);
    if (!rec || rec.active === false) return { ok: false, error: "User not found or inactive" };
    if (rec.password !== password) return { ok: false, error: "Incorrect password" };
    const u: User = { username: rec.username.toLowerCase(), displayName: rec.displayName, role: rec.role };
    setUser(u); localStorage.setItem(LS_KEY, JSON.stringify(u)); return { ok: true };
  };
  const logout = () => { setUser(null); localStorage.removeItem(LS_KEY); };
  const value = useMemo(() => ({ user, login, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export const useAuth = () => { const ctx = useContext(AuthContext); if (!ctx) throw new Error("useAuth must be used within AuthProvider"); return ctx; };
