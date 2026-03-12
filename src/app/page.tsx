
"use client";
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Layout/Sidebar';
import Topbar from './components/Layout/Topbar';
import Overview from './views/Overview';
import Monitoring from './views/Monitoring';
import PCDevices from './views/PCDevices';
import Vulnerabilities from './views/Vulnerabilities';
import ExecutiveSummary from './views/ExecutiveSummary';
import GlobalScripts from './views/GlobalScripts';
import Cameras from './views/Cameras';
import Logs from './views/Logs';
import Incidents from './views/Incidents';
import IncidentList from './views/IncidentList';
import Categories from './views/Categories';
import SmartViews from './views/SmartViews';
import ExportCenter from './views/ExportCenter';
import Notifications from './views/Notifications';
import NetworkControl from './views/NetworkControl';
import WiFiAudit from './views/WiFiAudit';
import ServersControl from './views/ServersControl';
import AWSCloudControl from './views/AWSCloudControl';
import CloudMultiControl from './views/CloudMultiControl';
import SecurityControl from './views/SecurityControl';
import Settings from './views/Settings';
import Profile from './views/Profile';
import ActivityGraph from './views/ActivityGraph';

// Auth Views
import Login from './views/Login';
import Register from './views/Register';
import VerifyEmail from './views/VerifyEmail';
import ForgotPassword from './views/ForgotPassword';
import ResetPassword from './views/ResetPassword';
import { authService } from './api/authService';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Dashboard Routes */}
        <Route path="/*" element={
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
                    <Route path="*" element={
                      <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-2xl font-bold text-gray-300">404</span>
                        </div>
                        <div>
                          <h2 className="text-xl font-bold">Módulo en Desarrollo</h2>
                          <p className="text-gray-500">Esta sección del panel BWP está siendo integrada actualmente.</p>
                        </div>
                        <button onClick={() => window.location.hash = '#/overview'} className="text-[#7A0C0C] font-bold text-sm uppercase tracking-widest hover:underline">
                          Regresar al Resumen
                        </button>
                      </div>
                    } />
                  </Routes>
                </main>
              </div>
            </div>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
};

export default App;

