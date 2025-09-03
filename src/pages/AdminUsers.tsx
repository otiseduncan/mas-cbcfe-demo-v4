import React, { useEffect, useState } from "react";
import { CLASSES } from "../theme";
import { addUser, deleteUser, listUsers, updateUser } from "../store/userStore";
import type { UserRec } from "../store/userStore";
import AdminTabs from "./AdminTabs";

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<UserRec[]>([]);
  const [form, setForm] = useState<UserRec>({ username: "", displayName: "", role: "TECH", password: "", active: true });
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const reload = () => setUsers(listUsers());
  useEffect(() => { reload(); }, []);

  const onAdd = (e: React.FormEvent) => {
    e.preventDefault(); setError(null); setOk(null);
    try {
      if (!form.username || !form.displayName || !form.password) throw new Error("All fields required");
      addUser(form); setForm({ username: "", displayName: "", role: "TECH", password: "", active: true }); reload(); setOk("User added");
    } catch (err: any) { setError(err.message || "Failed to add user"); }
  };
  const onUpdate = (u: UserRec, patch: Partial<UserRec>) => {
    try { updateUser(u.username, patch); reload(); setOk("Updated"); } catch (err: any) { setError(err.message || "Update failed"); }
  };
  const onDelete = (u: UserRec) => {
    if (!confirm(`Delete ${u.username}?`)) return;
    try { deleteUser(u.username); reload(); setOk("Deleted"); } catch (err: any) { setError(err.message || "Delete failed"); }
  };

  return (
    <div className="min-h-screen bg-neutral-950">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-2xl text-white font-semibold">Admin Dashboard</h1>
        <AdminTabs />
        <div className={`${CLASSES.card} p-4 mt-2`}>
          <div className="text-white font-medium mb-2">Add User</div>
          <form onSubmit={onAdd}>
            <div className="grid md:grid-cols-5 gap-2">
              <input className={CLASSES.input + " md:col-span-2"} placeholder="username (email)" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
              <input className={CLASSES.input + " md:col-span-1"} placeholder="display name" value={form.displayName} onChange={e => setForm({ ...form, displayName: e.target.value })} />
              <select className={CLASSES.input} value={form.role} onChange={e => setForm({ ...form, role: e.target.value as any })}>
                <option value="TECH">TECH</option>
                <option value="MGR">MGR</option>
                <option value="ADMIN">ADMIN</option>
              </select>
              <input className={CLASSES.input} placeholder="password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            </div>
            <div className="mt-3 flex items-center gap-2">
              <button className={CLASSES.btnPrimary} type="submit">Add User</button>
            </div>
            {error && <div className="text-red-400 text-sm mt-2">{error}</div>}
            {ok && <div className="text-emerald-400 text-sm mt-2">{ok}</div>}
          </form>
        </div>

        <div className={`${CLASSES.card} p-4 mt-4 overflow-x-auto`}>
          <div className="text-white font-medium mb-2">Users</div>
          <table className="w-full text-left text-sm">
            <thead className="text-neutral-400">
              <tr><th className="py-2">Username</th><th>Display</th><th>Role</th><th>Active</th><th>Password</th><th></th></tr>
            </thead>
            <tbody className="text-neutral-200">
              {users.map(u => (
                <tr key={u.username} className="border-t border-neutral-800">
                  <td className="py-2">{u.username}</td>
                  <td><input className={CLASSES.input} value={u.displayName} onChange={e => onUpdate(u, { displayName: e.target.value })} /></td>
                  <td>
                    <select className={CLASSES.input} value={u.role} onChange={e => onUpdate(u, { role: e.target.value as any })}>
                      <option value="TECH">TECH</option>
                      <option value="MGR">MGR</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>
                  <td>
                    <select className={CLASSES.input} value={u.active !== false ? "true" : "false"} onChange={e => onUpdate(u, { active: e.target.value === "true" })}>
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </td>
                  <td><button className={CLASSES.btn} onClick={() => onUpdate(u, { password: prompt("New password:") || u.password })}>Reset</button></td>
                  <td><button className={CLASSES.btn} onClick={() => onDelete(u)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default AdminUsers;
