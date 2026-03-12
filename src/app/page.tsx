"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Routes, Route, Navigate } from "react-router-dom";

// Router solo en cliente
const HashRouter = dynamic(
  () => import("react-router-dom").then((mod) => mod.HashRouter),
  { ssr: false }
);

// Layout
import Sidebar from "./components/Layout/Sidebar";
import Topbar from "./components/Layout/Topbar";

// Views
import Overview from "./views/Overview";
import Monitoring from "./views/Monitoring";
import PCDevices from "./views/PCDevices";
import Vulnerabilities from "./views/Vulnerabilities";
import ExecutiveSummary from "./views/ExecutiveSummary";
import GlobalScripts from "./views/GlobalScripts";
import Cameras from "./views/Cameras";
import Logs from "./views/Logs";
import Incidents from "./views/Incidents";
import IncidentList from "./views/IncidentList";
import Categories from "./views/Categories";
import SmartViews from "./views/SmartViews";
import ExportCenter from "./views/ExportCenter";
import Notifications from "./views/Notifications";
import NetworkControl from "./views/NetworkControl";
import WiFiAudit from "./views/WiFiAudit";
import ServersControl from "./views/ServersControl";
import AWSCloudControl from "./views/AWSCloudControl";
import CloudMultiControl from "./views/CloudMultiControl";
import SecurityControl from "./views/SecurityControl";
import Settings from "./views/Settings";
import Profile from "./views/Profile";
import ActivityGraph from "./views/ActivityGraph";

// Auth
import Login from "./views/Login";
import Register from "./views/Register";
import VerifyEmail from "./views/VerifyEmail";
import ForgotPassword from "./views/ForgotPassword";
import ResetPassword from "./views/ResetPassword";

import { authService } from "./api/authService";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};

export default function App() {
  return (
    <HashRouter>
      <Routes>

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Dashboard */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>

              <div className="flex h-screen bg-[#F7F5F2] text-[#1A1A1A] overflow-hidden">

                <Sidebar />

                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

                  <Topbar />

                  <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">

                    <Routes>

                      <Route path="/overview" element={<Overview />} />
                      <Route path="/devices/pc" element={<PCDevices />} />
                      <Route path="/monitoring" element={<Monitoring />} />
                      <Route path="/activity-graph" element={<ActivityGraph />} />
                      <Route path="/scripts-global" element={<GlobalScripts />} />
                      <Route path="/vulnerabilities" element={<Vulnerabilities />} />
                      <Route path="/cameras" element={<Cameras />} />
                      <Route path="/dashboard/logs" element={<Logs />} />
                      <Route path="/dashboard/incidents" element={<Incidents />} />
                      <Route path="/dashboard/incidents/list" element={<IncidentList />} />
                      <Route path="/dashboard/incidents/categories" element={<Categories />} />
                      <Route path="/dashboard/incidents/smart-views" element={<SmartViews />} />
                      <Route path="/dashboard/incidents/export" element={<ExportCenter />} />
                      <Route path="/dashboard/incidents/notifications" element={<Notifications />} />
                      <Route path="/dashboard/monitoring/summary" element={<ExecutiveSummary />} />
                      <Route path="/dashboard/network" element={<NetworkControl />} />
                      <Route path="/wifi" element={<WiFiAudit />} />
                      <Route path="/servers" element={<ServersControl />} />
                      <Route path="/aws" element={<AWSCloudControl />} />
                      <Route path="/cloud-multi" element={<CloudMultiControl />} />
                      <Route path="/security" element={<SecurityControl />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/profile" element={<Profile />} />

                      <Route path="/" element={<Navigate to="/overview" />} />

                    </Routes>

                  </main>

                </div>

              </div>

            </ProtectedRoute>
          }
        />

      </Routes>
    </HashRouter>
  );
}
