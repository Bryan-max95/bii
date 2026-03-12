"use client";
import React, { useState, useMemo } from 'react';
import { 
  Network, Shield, ShieldAlert, Plus, Search, 
  Settings, Database, Server, RefreshCw, Zap,
  AlertTriangle, CheckCircle, Activity, MoreVertical,
  Globe, Lock, HardDrive, Trash2, LayoutGrid,
  ChevronRight, Filter, Cpu, Wifi, Smartphone,
  BarChart3, Layers, Terminal
} from 'lucide-react';
import { MOCK_DEVICES } from '../constants';
import { Device, DeviceStatus, NetworkFinding } from '../../../types';

const NetworkControl: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Infrastructure' | 'Security'>('Infrastructure');
  const [searchTerm, setSearchTerm] = useState('');
  const [groups, setGroups] = useState(['Core Backbone', 'Edge Security', 'Access Switches', 'DMZ Zone']);
  const [selectedGroup, setSelectedGroup] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isAuditing, setIsAuditing] = useState<string | null>(null);

  // Estado local de equipos de red extendido
  const [networkAssets, setNetworkAssets] = useState<Device[]>([
    {
      id: 'NET-001', name: 'FW-MAIN-FORTI', type: 'Firewall', os: 'FortiOS v7.2', ip: '10.0.0.1',
      status: DeviceStatus.ONLINE, cpu: 22, ram: 45, disk: 10, network: '1.2 Gbps', agentVersion: 'Agentless',
      latency: 2, lastUpdate: '1 min ago', protectionActive: true, department: 'Edge Security',
      vulnerabilities: [], policies: [], 
      findings: [
        { id: 'f1', title: 'Default Admin Account', severity: 'critical', description: 'El usuario admin no ha sido renombrado.' },
        { id: 'f2', title: 'Legacy SSL Version', severity: 'medium', description: 'Soporte para TLS 1.0 detectado en VPN.' }
      ]
    },
    {
      id: 'NET-002', name: 'SW-CORE-CISCO', type: 'Switch', os: 'IOS-XE 17.6', ip: '10.0.0.5',
      status: DeviceStatus.ONLINE, cpu: 12, ram: 30, disk: 5, network: '10 Gbps', agentVersion: 'Agentless',
      latency: 1, lastUpdate: '5 min ago', protectionActive: true, department: 'Core Backbone',
      vulnerabilities: [], policies: [],
      findings: [
        { id: 'f3', title: 'Unencrypted SNMP', severity: 'high', description: 'SNMP v2c en uso sin cifrado.' }
      ]
    },
    {
      id: 'NET-003', name: 'RTR-OFFICE-GATEWAY', type: 'Router', os: 'MikroTik v6.49', ip: '192.168.1.1',
      status: DeviceStatus.RISK, cpu: 85, ram: 90, disk: 2, network: '450 Mbps', agentVersion: 'Agentless',
      latency: 15, lastUpdate: 'Just now', protectionActive: false, department: 'DMZ Zone',
      vulnerabilities: ['CVE-2023-3241'], policies: [],
      findings: [
        { id: 'f4', title: 'Telnet Enabled', severity: 'critical', description: 'Acceso vía Telnet abierto en puerto 23.' }
      ]
    }
  ]);

  const filteredAssets = networkAssets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) || asset.ip.includes(searchTerm);
    const matchesGroup = selectedGroup === 'ALL' || asset.department === selectedGroup;
    return matchesSearch && matchesGroup;
  });

  const handleAudit = (id: string) => {
    setIsAuditing(id);
    setTimeout(() => setIsAuditing(null), 2500);
  };

  return (
    <div className="space-y-10 animate-in slide-in-from-right-6 duration-700 pb-24">
      {/* Header SOC */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter flex items-center gap-4">
            <div className="bg-[#1A1A1A] p-3 rounded-2xl shadow-xl shadow-black/10 text-[#7A0C0C]">
              <Network className="w-8 h-8" />
            </div>
            Infraestructura de Red
          </h1>
          <p className="text-gray-500 font-medium mt-2">Gestión de Firewalls, Routers y Switches con auditoría profunda de configuración.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[#7A0C0C] text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#8B1E1E] transition-all shadow-lg shadow-[#7A0C0C]/20"
          >
            <Plus size={16} /> Agregar Equipo IP
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar de Grupos */}
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center justify-between">
                Grupos de Red
                <button className="text-[#7A0C0C] hover:scale-110 transition-transform"><Plus size={14} /></button>
              </h3>
              <div className="space-y-2">
                 <button 
                   onClick={() => setSelectedGroup('ALL')}
                   className={`w-full flex items-center justify-between p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedGroup === 'ALL' ? 'bg-[#1A1A1A] text-white shadow-xl' : 'text-gray-400 hover:bg-gray-50'}`}
                 >
                   Todos los Equipos
                   <span className="text-[9px] opacity-50">{networkAssets.length}</span>
                 </button>
                 {groups.map(group => (
                   <button 
                     key={group}
                     onClick={() => setSelectedGroup(group)}
                     className={`w-full flex items-center justify-between p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedGroup === group ? 'bg-[#7A0C0C] text-white shadow-xl' : 'text-gray-400 hover:bg-gray-50'}`}
                   >
                     {group}
                     <span className="text-[9px] opacity-50">{networkAssets.filter(a => a.department === group).length}</span>
                   </button>
                 ))}
              </div>
           </div>

           <div className="bg-[#1A1A1A] p-8 rounded-[2.5rem] text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#7A0C0C] blur-3xl opacity-20"></div>
              <h4 className="text-[10px] font-black text-[#7A0C0C] uppercase tracking-widest mb-4">Security Posture</h4>
              <div className="flex items-baseline gap-2 mb-6">
                 <span className="text-4xl font-black">92%</span>
                 <span className="text-xs text-gray-500 font-bold">Hardened</span>
              </div>
              <div className="space-y-3">
                 <div className="flex justify-between text-[8px] font-black uppercase text-gray-500">
                    <span>Config Audit</span>
                    <span>9/10 Passed</span>
                 </div>
                 <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-[90%]"></div>
                 </div>
              </div>
           </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-6">
           {/* Browser bar */}
           <div className="bg-white p-4 rounded-[1.5rem] border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Buscar por nombre, IP o Sistema Operativo..." 
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#7A0C0C]/10 outline-none font-bold text-gray-800"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="p-3 bg-gray-50 text-gray-400 hover:text-[#7A0C0C] rounded-xl transition-all">
                <Filter size={20} />
              </button>
           </div>

           {/* Assets Grid */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredAssets.map(asset => (
                <NetworkAssetCard 
                  key={asset.id} 
                  asset={asset} 
                  isAuditing={isAuditing === asset.id}
                  onAudit={() => handleAudit(asset.id)}
                />
              ))}
           </div>
           
           {filteredAssets.length === 0 && (
             <div className="py-20 flex flex-col items-center justify-center text-gray-300 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
               <Globe size={64} strokeWidth={1} className="mb-4 opacity-10" />
               <p className="font-bold text-xl uppercase tracking-tighter opacity-30">No se encontraron activos de red</p>
             </div>
           )}
        </div>
      </div>

      {/* Add Device Modal (Simplified) */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 animate-in fade-in duration-300">
           <div className="bg-white rounded-[3rem] w-full max-w-lg p-10 shadow-2xl space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#7A0C0C]/5 blur-3xl"></div>
              <div>
                 <h2 className="text-3xl font-black text-gray-900 tracking-tighter">Registrar Equipo</h2>
                 <p className="text-sm text-gray-400 font-bold uppercase mt-1">Escaneo de activos sin agente BWP</p>
              </div>
              
              <div className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Alias del Dispositivo</label>
                    <input className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold outline-none" placeholder="FW-EDGE-PROD" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">IP del Equipo</label>
                    <input className="w-full p-4 bg-gray-50 border-none rounded-2xl font-mono font-bold outline-none" placeholder="10.0.X.X" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tipo</label>
                        <select className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold outline-none">
                            <option>Firewall</option>
                            <option>Router</option>
                            <option>Switch</option>
                            <option>Access Point</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Grupo</label>
                        <select className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold outline-none">
                            {groups.map(g => <option key={g}>{g}</option>)}
                        </select>
                    </div>
                 </div>
              </div>

              <div className="flex gap-4 pt-4">
                 <button onClick={() => setShowAddModal(false)} className="flex-1 py-4 text-xs font-black uppercase text-gray-400">Cancelar</button>
                 <button className="flex-2 py-4 bg-[#7A0C0C] text-white rounded-2xl text-xs font-black uppercase shadow-xl">Iniciar Sincronización</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

// Subcomponente: Network Asset Card SOC Style
// Added React.FC type to handle JSX key attribute correctly
const NetworkAssetCard: React.FC<{ asset: Device, isAuditing: boolean, onAudit: any }> = ({ asset, isAuditing, onAudit }) => {
  return (
    <div className={`bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm transition-all duration-500 relative overflow-hidden group hover:shadow-2xl hover:-translate-y-2 ${asset.status === DeviceStatus.RISK ? 'border-orange-100' : ''}`}>
      
      {isAuditing && (
        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-30 flex flex-col items-center justify-center space-y-4">
          <RefreshCw className="w-12 h-12 text-[#7A0C0C] animate-spin" />
          <p className="text-[10px] font-black text-[#7A0C0C] uppercase tracking-[0.2em] animate-pulse">Analizando Puertos y Firmas...</p>
        </div>
      )}

      {/* Type Badge */}
      <div className="flex items-center justify-between mb-10 relative z-10">
         <div className={`p-5 rounded-[2rem] text-white shadow-xl group-hover:rotate-6 transition-transform ${
           asset.type === 'Firewall' ? 'bg-[#7A0C0C]' : 
           asset.type === 'Switch' ? 'bg-blue-600' : 'bg-gray-900'
         }`}>
           {asset.type === 'Firewall' ? <Lock size={32} /> : 
            asset.type === 'Switch' ? <Layers size={32} /> : <Globe size={32} />}
         </div>
         <div className="flex flex-col items-end gap-2">
            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
              asset.status === DeviceStatus.ONLINE ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
            }`}>{asset.status}</span>
            <span className="text-[10px] font-mono font-bold text-gray-400">{asset.ip}</span>
         </div>
      </div>

      <div className="relative z-10">
         <h3 className="text-2xl font-black text-gray-900 tracking-tighter mb-1 group-hover:text-[#7A0C0C] transition-colors">{asset.name}</h3>
         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-8">{asset.os} • {asset.department}</p>

         {/* Findings / Vulnerabilities Section */}
         <div className="space-y-4 mb-8">
            <div className="flex items-center justify-between">
               <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                 <ShieldAlert size={12} /> Hallazgos Técnicos
               </h4>
               <button onClick={onAudit} className="text-[#7A0C0C] hover:scale-110 transition-transform"><RefreshCw size={12} /></button>
            </div>
            <div className="space-y-2">
               {asset.findings && asset.findings.length > 0 ? (
                 asset.findings.map(f => (
                   <div key={f.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100 group/item hover:border-[#7A0C0C]/30 transition-all">
                      <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                        f.severity === 'critical' ? 'bg-red-500 animate-pulse' : 
                        f.severity === 'high' ? 'bg-orange-500' : 'bg-blue-500'
                      }`}></div>
                      <div>
                         <p className="text-[11px] font-black text-gray-800 leading-none mb-1">{f.title}</p>
                         <p className="text-[9px] font-medium text-gray-400 leading-tight">{f.description}</p>
                      </div>
                   </div>
                 ))
               ) : (
                 <div className="flex items-center gap-2 bg-green-50 p-4 rounded-2xl border border-green-100">
                    <CheckCircle size={14} className="text-green-600" />
                    <span className="text-[10px] font-black text-green-800 uppercase">Sin vulnerabilidades activas</span>
                 </div>
               )}
            </div>
         </div>

         {/* Metricas de Red */}
         <div className="grid grid-cols-2 gap-4 pt-8 border-t border-gray-50">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-gray-50 rounded-lg text-gray-400"><Activity size={12} /></div>
               <div className="flex flex-col">
                  <span className="text-[9px] font-black text-gray-400 uppercase">Latencia</span>
                  <span className="text-xs font-black text-green-500">{asset.latency}ms</span>
               </div>
            </div>
            <div className="flex items-center gap-3">
               <div className="p-2 bg-gray-50 rounded-lg text-gray-400"><HardDrive size={12} /></div>
               <div className="flex flex-col">
                  <span className="text-[9px] font-black text-gray-400 uppercase">Uptime</span>
                  <span className="text-xs font-black text-gray-800">99.98%</span>
               </div>
            </div>
         </div>
      </div>

      <div className="mt-8 pt-8 flex gap-2">
         <button className="flex-1 py-4 bg-[#1A1A1A] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#7A0C0C] transition-all flex items-center justify-center gap-2">
           <Terminal size={14} /> CLI Remote
         </button>
         <button className="p-4 bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all">
           <Trash2 size={16} />
         </button>
      </div>
    </div>
  );
};

export default NetworkControl;
