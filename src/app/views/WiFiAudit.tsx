"use client";
import React, { useState } from 'react';
import { 
  Wifi, Shield, ShieldAlert, Plus, Search, 
  Zap, Lock, Unlock, Signal, Activity,
  Trash2, Settings, RefreshCw, Key,
  AlertTriangle, CheckCircle, Globe,
  Network, Radio, BarChart3, ChevronRight,
  Fingerprint, Smartphone, ShieldCheck
} from 'lucide-react';

interface WiFiNetwork {
  id: string;
  ssid: string;
  bssid: string;
  security: 'WPA3' | 'WPA2-AES' | 'WPA' | 'WEP' | 'OPEN';
  group: string;
  status: 'SAFE' | 'VULNERABLE' | 'CRITICAL';
  signal: number;
  wpsEnabled: boolean;
  clients: number;
  lastAudit: string;
  passwordStrength: number; // 0 to 100
  findings: string[];
}

const WiFiAudit: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isAuditing, setIsAuditing] = useState<string | null>(null);

  const [networks, setNetworks] = useState<WiFiNetwork[]>([
    {
      id: 'WF-01', ssid: 'BWP_CORP_SECURE', bssid: '00:1A:2B:3C:4D:5E',
      security: 'WPA3', group: 'Operaciones', status: 'SAFE',
      signal: 95, wpsEnabled: false, clients: 42, lastAudit: '2 hours ago',
      passwordStrength: 98, findings: []
    },
    {
      id: 'WF-02', ssid: 'BWP_GUEST_FREE', bssid: '00:1A:2B:3C:4D:5F',
      security: 'WPA2-AES', group: 'Cortesía', status: 'VULNERABLE',
      signal: 75, wpsEnabled: true, clients: 12, lastAudit: '1 day ago',
      passwordStrength: 45, findings: ['WPS Activo (Vulnerable a Reaver)', 'Contraseña de longitud mínima']
    },
    {
      id: 'WF-03', ssid: 'LAB_TEST_WIFI', bssid: '00:1A:2B:3C:4D:60',
      security: 'WEP', group: 'Desarrollo', status: 'CRITICAL',
      signal: 40, wpsEnabled: true, clients: 2, lastAudit: 'Just now',
      passwordStrength: 10, findings: ['Cifrado WEP Obsoleto', 'Contraseña por defecto detectada', 'Hidden SSID no activo']
    }
  ]);

  const groups = ['Operaciones', 'Cortesía', 'Desarrollo', 'Seguridad Física'];

  const filteredNetworks = networks.filter(net => {
    const matchesSearch = net.ssid.toLowerCase().includes(searchTerm.toLowerCase()) || net.bssid.includes(searchTerm);
    const matchesGroup = selectedGroup === 'ALL' || net.group === selectedGroup;
    return matchesSearch && matchesGroup;
  });

  const runAudit = (id: string) => {
    setIsAuditing(id);
    setTimeout(() => setIsAuditing(null), 3000);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-24">
      {/* Header SOC WiFi */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter flex items-center gap-4">
            <div className="bg-[#1A1A1A] p-3 rounded-2xl shadow-xl shadow-black/10 text-[#7A0C0C]">
              <Wifi className="w-8 h-8" />
            </div>
            WiFi Audit Center
          </h1>
          <p className="text-gray-500 font-medium mt-2">Auditoría de perímetros inalámbricos, fuerza de cifrado y vectores PSK.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-8 py-4 bg-[#7A0C0C] text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#8B1E1E] transition-all shadow-xl shadow-[#7A0C0C]/20"
        >
          <Plus size={18} /> Registrar Punto de Acceso
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Grupos */}
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Segmentos WiFi</h3>
              <div className="space-y-2">
                 <button 
                   onClick={() => setSelectedGroup('ALL')}
                   className={`w-full flex items-center justify-between p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedGroup === 'ALL' ? 'bg-[#1A1A1A] text-white' : 'text-gray-400 hover:bg-gray-50'}`}
                 >
                   Todas las Redes
                   <span className="bg-gray-100/10 px-2 py-0.5 rounded-lg text-[8px]">{networks.length}</span>
                 </button>
                 {groups.map(group => (
                   <button 
                     key={group}
                     onClick={() => setSelectedGroup(group)}
                     className={`w-full flex items-center justify-between p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedGroup === group ? 'bg-[#7A0C0C] text-white' : 'text-gray-400 hover:bg-gray-50'}`}
                   >
                     {group}
                     <span className="bg-gray-100/10 px-2 py-0.5 rounded-lg text-[8px]">{networks.filter(n => n.group === group).length}</span>
                   </button>
                 ))}
              </div>
           </div>

           <div className="bg-[#1A1A1A] p-8 rounded-[2.5rem] text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#7A0C0C] blur-[60px] opacity-20"></div>
              <h4 className="text-[10px] font-black text-[#7A0C0C] uppercase tracking-widest mb-4">Radio Frequency Health</h4>
              <div className="flex items-center gap-4 mb-6">
                 <div className="text-3xl font-black">74%</div>
                 <div className="h-2 flex-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[#7A0C0C] w-[74%]"></div>
                 </div>
              </div>
              <p className="text-[10px] text-gray-500 font-medium leading-relaxed italic">"3 redes críticas detectadas sin rotación de llaves en 90+ días."</p>
           </div>
        </div>

        {/* Listado de Redes */}
        <div className="lg:col-span-3 space-y-6">
           <div className="bg-white p-4 rounded-[1.5rem] border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Buscar por SSID o Dirección MAC (BSSID)..." 
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#7A0C0C]/10 outline-none font-bold text-gray-800"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="p-3 bg-gray-50 text-gray-400 hover:text-[#7A0C0C] rounded-xl transition-all">
                <Radio size={20} />
              </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredNetworks.map(net => (
                <WiFiCard 
                  key={net.id} 
                  net={net} 
                  isAuditing={isAuditing === net.id}
                  onAudit={() => runAudit(net.id)}
                />
              ))}
           </div>
        </div>
      </div>

      {/* Add Modal WiFi */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 animate-in fade-in duration-300">
           <div className="bg-white rounded-[3rem] w-full max-w-lg p-10 shadow-2xl space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#7A0C0C]/5 blur-3xl"></div>
              <div>
                 <h2 className="text-3xl font-black text-gray-900 tracking-tighter">Registrar Red WiFi</h2>
                 <p className="text-sm text-gray-400 font-bold uppercase mt-1">Alta de activo inalámbrico corporativo</p>
              </div>
              
              <div className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">SSID (Nombre de Red)</label>
                    <input className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold outline-none" placeholder="BWP-WIFI-MAIN" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Cifrado</label>
                        <select className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold outline-none">
                            <option>WPA3</option>
                            <option>WPA2-AES</option>
                            <option>WPA-TKIP</option>
                            <option>WEP</option>
                            <option>OPEN</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Segmento</label>
                        <select className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold outline-none">
                            {groups.map(g => <option key={g}>{g}</option>)}
                        </select>
                    </div>
                 </div>
              </div>

              <div className="flex gap-4 pt-4">
                 <button onClick={() => setShowAddModal(false)} className="flex-1 py-4 text-xs font-black uppercase text-gray-400">Cancelar</button>
                 <button className="flex-2 py-4 bg-[#7A0C0C] text-white rounded-2xl text-xs font-black uppercase shadow-xl">Vincular para Auditoría</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

// Subcomponent: WiFiCard
// Added React.FC type to handle JSX key attribute correctly
const WiFiCard: React.FC<{ net: WiFiNetwork, isAuditing: boolean, onAudit: any }> = ({ net, isAuditing, onAudit }) => {
  return (
    <div className={`bg-white rounded-[3.5rem] p-10 border border-gray-100 shadow-sm transition-all duration-500 relative overflow-hidden group hover:shadow-2xl hover:-translate-y-2 ${net.status === 'CRITICAL' ? 'border-red-100' : ''}`}>
       
       {isAuditing && (
         <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-30 flex flex-col items-center justify-center space-y-6 p-10">
            <div className="relative">
               <RefreshCw className="w-16 h-16 text-[#7A0C0C] animate-spin" />
               <Fingerprint className="absolute inset-0 m-auto text-[#7A0C0C] w-6 h-6 animate-pulse" />
            </div>
            <div className="text-center">
              <p className="text-xs font-black text-[#7A0C0C] uppercase tracking-[0.2em] mb-2">Crack Simulation v2.0</p>
              <div className="h-1 w-32 bg-gray-100 rounded-full mx-auto overflow-hidden">
                 <div className="h-full bg-[#7A0C0C] animate-progress-fast"></div>
              </div>
            </div>
         </div>
       )}

       {/* Header Card */}
       <div className="flex items-start justify-between mb-8 relative z-10">
          <div className={`p-6 rounded-[2.5rem] text-white shadow-xl group-hover:rotate-12 transition-transform ${
            net.status === 'SAFE' ? 'bg-green-600' : 
            net.status === 'VULNERABLE' ? 'bg-orange-500' : 'bg-[#7A0C0C]'
          }`}>
            <Wifi size={32} />
          </div>
          <div className="flex flex-col items-end gap-2">
             <div className="flex items-center gap-1.5">
                <Signal size={12} className={net.signal > 80 ? 'text-green-500' : 'text-orange-500'} />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{net.signal}% Power</span>
             </div>
             <span className="text-[10px] font-mono font-bold text-gray-300">{net.bssid}</span>
          </div>
       </div>

       {/* Info */}
       <div className="relative z-10">
          <h3 className="text-2xl font-black text-gray-900 tracking-tighter mb-1 flex items-center gap-2 group-hover:text-[#7A0C0C] transition-colors">
            {net.ssid}
            {/* Fix: Use ShieldCheck icon instead of incorrect prop usage on Shield */}
            {net.security === 'WPA3' && <ShieldCheck size={14} className="text-blue-500" />}
          </h3>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-8">{net.security} Protocol • {net.group}</p>

          {/* Password Strength Section */}
          <div className="bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100 mb-8 space-y-4">
             <div className="flex justify-between items-end">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Key size={10} /> Password Robustness
                </span>
                <span className={`text-xs font-black ${net.passwordStrength > 80 ? 'text-green-500' : 'text-red-500'}`}>{net.passwordStrength}%</span>
             </div>
             <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${net.passwordStrength > 80 ? 'bg-green-500' : 'bg-[#7A0C0C]'}`}
                  style={{ width: `${net.passwordStrength}%` }}
                ></div>
             </div>
          </div>

          {/* Hallazgos */}
          <div className="space-y-3 mb-8">
             <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <AlertTriangle size={12} /> Hallazgos de Seguridad
             </h4>
             {net.findings.length > 0 ? (
               net.findings.map((f, i) => (
                 <div key={i} className="flex items-start gap-3 p-3 bg-red-50 border border-red-100/50 rounded-2xl">
                    <ShieldAlert size={12} className="text-[#7A0C0C] mt-0.5" />
                    <span className="text-[10px] font-bold text-red-800 leading-tight">{f}</span>
                 </div>
               ))
             ) : (
               <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-100/50 rounded-2xl">
                  <CheckCircle size={12} className="text-green-600" />
                  <span className="text-[10px] font-bold text-green-800 uppercase">Perímetro robusto</span>
               </div>
             )}
          </div>

          {/* Footer Card */}
          <div className="grid grid-cols-2 gap-4 pt-8 border-t border-gray-50">
             <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 rounded-lg text-gray-400"><Smartphone size={12} /></div>
                <div className="flex flex-col">
                   <span className="text-[9px] font-black text-gray-400 uppercase">Clientes</span>
                   <span className="text-xs font-black text-gray-800">{net.clients} Activos</span>
                </div>
             </div>
             <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 rounded-lg text-gray-400"><Activity size={12} /></div>
                <div className="flex flex-col">
                   <span className="text-[9px] font-black text-gray-400 uppercase">Último Audit</span>
                   <span className="text-xs font-black text-gray-800">{net.lastAudit}</span>
                </div>
             </div>
          </div>
       </div>

       <div className="mt-8 pt-8 flex gap-2">
          <button 
            onClick={onAudit}
            className="flex-1 py-4 bg-[#1A1A1A] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#7A0C0C] transition-all flex items-center justify-center gap-2"
          >
            <Zap size={14} /> Full Security Scan
          </button>
          <button className="p-4 bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all">
            <Trash2 size={16} />
          </button>
       </div>
    </div>
  );
};

export default WiFiAudit;
