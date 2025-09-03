import React from "react";
import { Link, useLocation } from "react-router-dom";
import { CLASSES } from "../theme";

const AdminTabs: React.FC = () => {
  const { pathname } = useLocation();
  const tab = (to: string, label: string) => (
    <Link to={to} className={`${CLASSES.btnPrimary} ${pathname === to ? 'ring-2 ring-red-700' : ''}`}>{label}</Link>
  );
  return (
    <div className="flex items-center gap-2 flex-wrap mb-4">
      {tab('/admin', 'Admin Dashboard')}
      {tab('/admin/health', 'System Health')}
    </div>
  );
};
export default AdminTabs;
