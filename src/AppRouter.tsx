import React, { useEffect } from "react";
import { HashRouter, Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import SplashLogin from "./components/SplashLogin";
import Dashboard from "./pages/Dashboard";
import NewCase from "./pages/NewCase";
import CaseDetail from "./pages/CaseDetail";
import EditCase from "./pages/EditCase";
import TopNav from "./components/TopNav";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import { bootstrapDemoData } from "./store/caseStore";
import Analytics from "./pages/Analytics";
import Activity from "./pages/Activity";
import AdminUsers from "./pages/AdminUsers";
import AdminHealth from "./pages/AdminHealth";

const RequireAuth: React.FC = () => {
  const { user } = useAuth();
  const loc = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: loc }} replace />;
  return <Outlet />;
};
const RequireManager: React.FC = () => {
  const { user } = useAuth();
  if (!user || user.role !== "MGR") return <Navigate to="/" replace />;
  return <Outlet />;
};
const RequireAdmin: React.FC = () => {
  const { user } = useAuth();
  if (!user || user.role !== "ADMIN") return <Navigate to="/" replace />;
  return <Outlet />;
};
const AppFrame: React.FC = () => {
  useEffect(() => { bootstrapDemoData(); }, []);
  return (<><TopNav /><Outlet /></>);
};
const AppRouter: React.FC = () => (
  <AuthProvider>
    <HashRouter>
      <Routes>
        <Route path="/login" element={<SplashLogin />} />
        <Route element={<RequireAuth />}>
          <Route element={<AppFrame />}>
            <Route index element={<Dashboard />} />
            <Route path="/new" element={<NewCase />} />
            <Route path="/case/:id" element={<CaseDetail />} />
            <Route path="/case/:id/edit" element={<EditCase />} />
            <Route path="/activity" element={<Activity />} />
            <Route element={<RequireManager />}>
              <Route path="/analytics" element={<Analytics />} />
            </Route>
            <Route element={<RequireAdmin />}>
              <Route path="/admin" element={<AdminUsers />} />
              <Route path="/admin/health" element={<AdminHealth />} />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  </AuthProvider>
);
export default AppRouter;
