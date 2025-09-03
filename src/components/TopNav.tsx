import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { CLASSES } from "../theme";
import { bootstrapDemoData } from "../store/caseStore";

const TopNav: React.FC = () => {
  const { user, logout } = useAuth();
  return (
    <div className="sticky top-0 z-30 border-b border-neutral-800 backdrop-blur bg-neutral-950/80">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Link to="/" className="text-white font-semibold">MAS Case by Case</Link>
          <Link to="/" className={CLASSES.link}>Cases</Link>
          {user?.role === "MGR" && (<Link to="/analytics" className={CLASSES.link}>Analytics</Link>)}
          <Link to="/activity" className={CLASSES.link}>Activity</Link>
          {user?.role === "ADMIN" && (<Link to="/admin" className={CLASSES.link}>Admin</Link>)}
        </div>
        <div className="flex items-center gap-2 text-sm">
          {user && (
            <>
              <span className="text-neutral-400">{user.displayName}</span>
              <span className="px-2 py-0.5 text-xs rounded border border-neutral-700 text-neutral-300">
                {user.role === "MGR" ? "Manager" : user.role === "ADMIN" ? "Admin" : "Technician"}
              </span>
              <button className={CLASSES.btnPrimary} onClick={() => { localStorage.clear(); bootstrapDemoData(); location.hash = "#/"; location.reload(); }}>Reset Demo</button>
              <button className={CLASSES.btnPrimary} onClick={logout}>Logout</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default TopNav;
