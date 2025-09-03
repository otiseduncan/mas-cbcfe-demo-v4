import React from "react";
import { listNotices } from "../store/noticeStore";
import { CLASSES } from "../theme";
import { Link } from "react-router-dom";

const Activity: React.FC = () => {
  const notices = listNotices();
  return (
    <div className={`${CLASSES.bg} min-h-screen`}>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl text-white font-semibold">Activity</h1>
          <Link to="/" className={CLASSES.btnPrimary}>Back</Link>
        </div>
        <div className={`${CLASSES.card} p-4 mt-4 divide-y divide-neutral-800`}>
          {notices.length === 0 && <div className="text-neutral-400">No activity yet.</div>}
          {notices.map(n => (
            <div key={n.id} className="py-3 flex items-center justify-between">
              <div>
                <div className="text-neutral-200 text-sm">{n.details}</div>
                <div className="text-neutral-400 text-xs mt-1">
                  <span className="text-red-400">{n.display}</span> • Case <span className="text-neutral-300">{n.ro}</span>
                </div>
              </div>
              <div className="text-neutral-500 text-xs">{new Date(n.at).toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Activity;
