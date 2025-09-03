import React, { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { CLASSES } from "../theme";
import { useNavigate } from "react-router-dom";

const SplashLogin: React.FC = () => {
  const { login, user } = useAuth();
  const [username, setUsername] = useState("technician@mas.demo");
  const [password, setPassword] = useState("tech123");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
  const res = await login(username, password);
  if (!res.ok) { setError(res.error || "Login failed"); return; }
  // After login, redirect admin to dashboard
  if (user && user.role === "ADMIN") {
    navigate("/admin");
  } else {
    navigate("/");
  }
  };

  return (
    <div className={`${CLASSES.bg} min-h-screen text-center flex items-center justify-center p-6`}>
      <div className="max-w-lg w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-white">MAS Case by Case</h1>
          <p className="mt-2 text-neutral-400">Field-ready demo — no backend required</p>
        </div>
        <form onSubmit={onSubmit} className={`${CLASSES.card} p-6 text-left`}>
          <label className="block text-neutral-300 text-sm mb-1">Email</label>
          <input className={`${CLASSES.input} mb-4`} value={username} onChange={e => setUsername(e.target.value)} placeholder="you@mas.com" />
          <label className="block text-neutral-300 text-sm mb-1">Password</label>
          <input className={`${CLASSES.input} mb-4`} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
          {error && <div className="text-red-400 text-sm mb-3">{error}</div>}
          <button type="submit" className={`${CLASSES.btnPrimary} w-full`}>Sign in</button>
          <div className="mt-4 text-xs text-neutral-400">
            <p>Demo users:</p>
            <ul className="list-disc list-inside">
              <li>Technician — <code>technician@mas.demo</code> / <code>tech123</code></li>
              <li>Manager — <code>manager@mas.demo</code> / <code>mgr123</code></li>
              <li>Admin — <code>admin@mas.demo</code> / <code>admin123</code></li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  );
};
export default SplashLogin;
