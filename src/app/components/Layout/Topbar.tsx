"use client";
import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, Bell, Settings, LogOut, ChevronDown, 
  User, ShieldAlert, Cpu, BellRing, ShieldCheck,
  Zap, Clock, ExternalLink, Shield, Lock
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { COLORS } from '../../constants';

const Topbar: React.FC = () => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Cerrar menús al hacer click afuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const mockAlerts = [
    { id: 1, title: 'Infiltración Bloqueada', time: '2m ago', type: 'critical', desc: 'Fuerza bruta detectada en SRV-PROD.' },
    { id: 2, title: 'Vulnerabilidad CVE', time: '15m ago', type: 'warning', desc: 'CEO-LAPTOP requiere parche urgente.' },
    { id: 3, title: 'BWP Agent Sync', time: '1h ago', type: 'info', desc: '12 nodos actualizados exitosamente.' }
  ];

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-[60] shadow-sm">
      <div className="flex items-center gap-8">
        {/* Buscador Robusto */}
        <div className="relative group">
          <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2 group-focus-within:text-[#7A0C0C] transition-colors" />
          <input 
            type="text" 
            placeholder="Buscar ecosistema..." 
            className="pl-10 pr-6 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs w-64 focus:outline-none focus:ring-2 focus:ring-[#7A0C0C]/10 focus:bg-white transition-all font-medium"
          />
        </div>

        {/* Telemetría de Sistema */}
        <div className="hidden xl:flex items-center gap-6 border-l border-gray-100 pl-8">
           <div className="flex items-center gap-2.5">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]"></div>
             <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Node: Optimal</span>
           </div>
           <div className="flex items-center gap-2.5">
             <Cpu className="w-3.5 h-3.5 text-[#7A0C0C]" />
             <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">42ms</span>
           </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Botón de Notificaciones con Dropdown */}
        <div className="relative" ref={notificationRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2.5 rounded-xl transition-all relative group ${showNotifications ? 'bg-[#7A0C0C] text-white shadow-lg shadow-[#7A0C0C]/20' : 'hover:bg-gray-50 text-gray-400 hover:text-[#7A0C0C]'}`}
          >
            <BellRing size={18} className={showNotifications ? '' : 'group-hover:rotate-12 transition-transform'} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#7A0C0C] rounded-full border-2 border-white"></span>
          </button>

          {/* Panel de Notificaciones Desplegable */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
               <div className="p-5 bg-[#1A1A1A] text-white flex items-center justify-between">
                  <h3 className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <Zap size={12} className="text-[#7A0C0C]" /> SOC Feed
                  </h3>
                  <span className="text-[8px] font-bold text-gray-500 uppercase">3 New Events</span>
               </div>
               <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                  {mockAlerts.map(alert => (
                    <div key={alert.id} className="p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer group">
                       <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg shrink-0 ${alert.type === 'critical' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                             <ShieldAlert size={14} />
                          </div>
                          <div className="flex-1">
                             <div className="flex justify-between items-center mb-0.5">
                                <span className="text-[10px] font-black text-gray-900 group-hover:text-[#7A0C0C] transition-colors">{alert.title}</span>
                                <span className="text-[8px] font-bold text-gray-400">{alert.time}</span>
                             </div>
                             <p className="text-[10px] text-gray-500 leading-tight">{alert.desc}</p>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
               <div className="p-3 bg-gray-50 text-center">
                  <button onClick={() => {navigate('/dashboard/incidents'); setShowNotifications(false);}} className="text-[9px] font-black text-[#7A0C0C] uppercase tracking-[0.2em] hover:underline">Full History</button>
               </div>
            </div>
          )}
        </div>

        {/* Botón de Configuración Directa */}
        <button 
          onClick={() => navigate('/settings')}
          className="p-2.5 rounded-xl hover:bg-gray-50 text-gray-400 hover:text-[#7A0C0C] transition-all group"
          title="Configuración Global"
        >
          <Settings size={18} className="group-hover:rotate-45 transition-transform duration-500" />
        </button>

        <div className="h-6 w-px bg-gray-200 mx-1"></div>

        {/* Perfil de Usuario con Menú Táctico */}
        <div className="relative" ref={profileRef}>
          <div 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 cursor-pointer group px-3 py-1.5 rounded-xl hover:bg-gray-50 transition-all select-none"
          >
            <div className="flex flex-col text-right">
              <span className="text-xs font-black text-gray-900 tracking-tight leading-none mb-0.5">Admin</span>
              <span className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">Level 5</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-[#1A1A1A] border border-gray-100 flex items-center justify-center font-black text-[#7A0C0C] text-xs shadow-md group-hover:scale-105 transition-transform">
              AD
            </div>
            <ChevronDown size={12} className={`text-gray-300 transition-transform duration-300 ${showProfileMenu ? 'rotate-180 text-[#7A0C0C]' : ''}`} />
          </div>

          {/* Sub-Menú de Perfil (Dropdown) */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-64 bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 origin-top-right">
               <div className="p-6 border-b border-gray-50 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-[#7A0C0C] text-white flex items-center justify-center font-black text-xl mb-3 shadow-xl shadow-[#7A0C0C]/20">
                     AD
                  </div>
                  <h4 className="text-sm font-black text-gray-900">Administrator</h4>
                  <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">admin@bwp-protection.com</p>
               </div>

               <div className="p-3 space-y-1">
                  <ProfileMenuItem 
                    icon={User} 
                    label="Mi Perfil SOC" 
                    onClick={() => { navigate('/profile'); setShowProfileMenu(false); }} 
                  />
                  <ProfileMenuItem 
                    icon={Shield} 
                    label="Motor de Políticas" 
                    onClick={() => { navigate('/security'); setShowProfileMenu(false); }} 
                  />
                  <ProfileMenuItem 
                    icon={Lock} 
                    label="Credenciales & MFA" 
                    onClick={() => { navigate('/profile'); setShowProfileMenu(false); }} 
                  />
                  <div className="h-px bg-gray-50 my-2 mx-3"></div>
                  <button 
                    onClick={() => { if(confirm('¿Desea cerrar la sesión del SOC?')) navigate('/login'); }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all font-black text-[9px] uppercase tracking-widest"
                  >
                    <LogOut size={14} /> Cerrar Sesión
                  </button>
               </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

// Subcomponente: Item de Menú de Perfil
const ProfileMenuItem = ({ icon: Icon, label, onClick }: { icon: any, label: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-[#7A0C0C] transition-all group"
  >
    <Icon size={16} className="group-hover:scale-110 transition-transform" />
    <span className="font-black text-[9px] uppercase tracking-widest">{label}</span>
  </button>
);

export default Topbar;
