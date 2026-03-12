"use client";
import React, { useState } from 'react';
import { 
  Server, Shield, ShieldAlert, ShieldCheck, Zap, 
  Search, Plus, RefreshCw, HardDrive, Cpu, 
  Activity, Lock, Trash2, AlertTriangle, 
  CheckCircle2, Terminal, Database, ArrowUpRight,
  ExternalLink, Bug, FileWarning, Layers,
  ChevronRight, Ghost, Monitor
} from 'lucide-react';
import { Device, DeviceStatus, Severity } from '../../../types';

interface MalwareDetection {
  id: string;
  name: string;
  path: string;
  type: 'Trojan' | 'Ransomware' | 'Spyware' | 'Rootkit';
  timestamp: string;
  action: 'Eliminated' | 'Quarantined';
}

interface ServerAsset extends Device {
  malwareHistory: MalwareDetection[];
  patchesPending: number;
  uptime: string;
  diskIO: string;
}

const ServersControl: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isScanningAll, setIsScanningAll] = useState(false);
  const [selectedServer, setSelectedServer] = useState<ServerAsset | null>(null);

  const [servers, setServers] = useState<ServerAsset[]>([
    {
      id: 'SRV-001', name: 'SRV-PROD-SQL-01', type: 'Server', os: 'Windows Server 2022', ip: '10.0.1.50',
      status: DeviceStatus.ONLINE, cpu: 42, ram: 78, disk: 88, network: '450 Mbps', agentVersion: 'BWP-v2.6',
      latency: 4, lastUpdate: 'Just now', protectionActive: true, department: 'Datacenter',
      vulnerabilities: ['CVE-2024-21413', 'CVE-2023-44487'], policies: ['p1', 'p2', 'p3'],
      uptime: '142 days', diskIO: '250 MB/s', patchesPending: 3,
      malwareHistory: [
        { id: 'M-01', name: 'WannaCry.variant', path: 'C:/temp/svc_host.exe', type: 'Ransomware', timestamp: '2h ago', action: 'Eliminated' }
      ]
    },
    {
      id: 'SRV-002', name: 'SRV-WEB-NGINX', type: 'Server', os: 'Ubuntu 22.04 LTS', ip: '10.0.5.12',
      status: DeviceStatus.RISK, cpu: 92, ram: 95, disk: 40, network: '800 Mbps', agentVersion: 'BWP-v2.6',
      latency: 12, lastUpdate: '1 min ago', protectionActive: true, department: 'DMZ',
      vulnerabilities: ['CVE-2024-23912'], policies: ['p2', 'p5'],
      uptime: '12 days', diskIO: '45 MB/s', patchesPending: 12,
      malwareHistory: [
        { id: 'M-02', name: 'XMRig.Miner', path: '/var/www/cache/update', type: 'Trojan', timestamp: '10 min ago', action: 'Eliminated' }
      ]
    },
    {
      id: 'SRV-003', name: 'SRV-AD-BACKUP', type: 'Server', os: 'Windows Server 2019', ip: '10.0.1.100',
      status: DeviceStatus.ONLINE, cpu: 5, ram: 20, disk: 95, network: '10 Mbps', agentVersion: 'BWP-v2.5',
      latency: 2, lastUpdate: '5 mins ago', protectionActive: true, department: 'Datacenter',
      vulnerabilities: [], policies: ['p1', 'p2', 'p3', 'p4'],
      uptime: '340 days', diskIO: '2 MB/s', patchesPending: 0,
      malwareHistory: []
    }
  ]);

  const handleGlobalScan = () => {
    setIsScanningAll(true);
    setTimeout(() => setIsScanningAll(false), 3000);
  };

  const filteredServers = servers.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.ip.includes(searchTerm)
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-24">
      {/* Header SOC */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter flex items-center gap-4">
            <div className="bg-[#1A1A1A] p-3 rounded-2xl shadow-xl shadow-black/10 text-[#7A0C0C]">
              <Database className="w-8 h-8" />
            </div>
            Workload Control Center
          </h1>
          <p className="text-gray-500 font-medium mt-2">Gestión de Servidores Críticos y Auditoría de Amenazas en Tiempo Real.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleGlobalScan}
            disabled={isScanningAll}
            className="flex items-center gap-2 px-8 py-4 bg-[#7A0C0C] text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#8B1E1E] transition-all shadow-xl shadow-[#7A0C0C]/20 disabled:opacity-50"
          >
            {isScanningAll ? <RefreshCw className="animate-spin" size={18} /> : <Zap size={18} />}
            Full Network Scan
          </button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-4 rounded-[1.5rem] border border-gray-100 shadow-sm flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar por alias de servidor, IP o Sistema Operativo..." 
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#7A0C0C]/10 outline-none font-bold text-gray-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
           <button className="p-3 bg-gray-50 text-gray-400 hover:text-[#7A0C0C] rounded-xl"><RefreshCw size={20} /></button>
           <button className="p-3 bg-gray-50 text-gray-400 hover:text-[#7A0C0C] rounded-xl"><Layers size={20} /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {filteredServers.map(server => (
          <ServerCard 
            key={server.id} 
            server={server} 
            onViewDetail={() => setSelectedServer(server)} 
          />
        ))}
      </div>

      {/* Side Panel: Advanced Server Audit */}
      {selectedServer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-end bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="bg-[#F7F5F2] w-full max-w-2xl h-full shadow-2xl flex flex-col animate-in slide-in-from-right-full duration-500">
              {/* Header Panel */}
              <div className="p-10 bg-white border-b border-gray-200">
                 <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                       <div className="p-4 bg-[#7A0C0C] rounded-[1.5rem] text-white shadow-xl shadow-[#7A0C0C]/20">
                          <Server size={32} />
                       </div>
                       <div>
                          <h2 className="text-3xl font-black text-gray-900 tracking-tighter">{selectedServer.name}</h2>
                          <div className="flex items-center gap-3 mt-1">
                             <span className="text-[10px] font-black text-[#7A0C0C] uppercase tracking-widest">{selectedServer.ip}</span>
                             <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{selectedServer.os}</span>
                          </div>
                       </div>
                    </div>
                    <button 
                      onClick={() => setSelectedServer(null)}
                      className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:text-[#7A0C0C] transition-all font-bold text-2xl"
                    >
                      ×
                    </button>
                 </div>

                 <div className="grid grid-cols-3 gap-4">
                    <StatusBox label="Uptime" value={selectedServer.uptime} />
                    {/* Fix: replaced non-existent agentInstalled with protectionActive from Device interface */}
                    <StatusBox label="Agent Status" value={selectedServer.protectionActive ? 'Verified' : 'NONE'} />
                    <StatusBox label="Pending Patches" value={selectedServer.patchesPending.toString()} color={selectedServer.patchesPending > 0 ? 'text-orange-500' : 'text-green-500'} />
                 </div>
              </div>

              {/* Advanced Sections */}
              <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
                 {/* Malware Detections Area */}
                 <section className="space-y-4">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                       <Bug size={14} className="text-[#7A0C0C]" /> Motor Heurístico de Detección
                    </h3>
                    <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm">
                       <div className="p-6 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
                          <span className="text-[10px] font-black text-gray-500 uppercase">Actividad de Malware</span>
                          <button className="text-[9px] font-black text-[#7A0C0C] uppercase hover:underline">Ver Historial Completo</button>
                       </div>
                       <div className="divide-y divide-gray-50">
                          {selectedServer.malwareHistory.length > 0 ? (
                            selectedServer.malwareHistory.map(m => (
                              <div key={m.id} className="p-6 flex items-center justify-between group hover:bg-gray-50 transition-colors">
                                 <div className="flex items-center gap-4">
                                    <div className="p-3 bg-red-50 text-[#7A0C0C] rounded-xl">
                                       <Ghost size={18} />
                                    </div>
                                    <div>
                                       <h4 className="text-xs font-black text-gray-800">{m.name}</h4>
                                       <p className="text-[9px] font-mono text-gray-400 mt-0.5">{m.path}</p>
                                    </div>
                                 </div>
                                 <div className="text-right">
                                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-[8px] font-black uppercase tracking-widest">{m.action}</span>
                                    <p className="text-[9px] text-gray-400 font-bold mt-1 uppercase">{m.timestamp}</p>
                                 </div>
                              </div>
                            ))
                          ) : (
                            <div className="p-10 flex flex-col items-center text-center opacity-40">
                               <ShieldCheck size={48} className="text-green-500 mb-2" />
                               <p className="text-xs font-black uppercase text-gray-400">Zero Threats Found</p>
                            </div>
                          )}
                       </div>
                    </div>
                 </section>

                 {/* CVE & Patches Area */}
                 <section className="space-y-4">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                       <FileWarning size={14} className="text-[#7A0C0C]" /> Vulnerabilidades de Firmware/OS
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                       {selectedServer.vulnerabilities.map(v => (
                          <div key={v} className="bg-white p-6 rounded-[1.5rem] border border-gray-100 flex items-center justify-between shadow-sm group hover:border-[#7A0C0C]/30 transition-all">
                             <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-[10px] font-black text-white">{v.split('-')[1]}</div>
                                <div>
                                   <h4 className="text-xs font-black text-gray-900">{v}</h4>
                                   <p className="text-[9px] font-bold text-gray-400 uppercase">CVSS Score: 9.8 (Critical)</p>
                                </div>
                             </div>
                             <button className="px-4 py-2 bg-gray-50 text-gray-400 hover:text-[#7A0C0C] rounded-xl transition-all">
                                <ArrowUpRight size={16} />
                             </button>
                          </div>
                       ))}
                       {selectedServer.vulnerabilities.length === 0 && (
                         <div className="bg-green-50 p-6 rounded-[1.5rem] border border-green-100 flex items-center gap-4">
                            <CheckCircle2 size={24} className="text-green-600" />
                            <div>
                               <h4 className="text-xs font-black text-green-800">Sistema Endurecido (Hardened)</h4>
                               <p className="text-[9px] font-bold text-green-700/60 uppercase">No hay CVEs críticos pendientes de parcheo.</p>
                            </div>
                         </div>
                       )}
                    </div>
                 </section>
              </div>

              {/* Footer Actions */}
              <div className="p-10 bg-white border-t border-gray-200 grid grid-cols-2 gap-4">
                 <button className="py-4 bg-[#1A1A1A] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2">
                    <Terminal size={14} /> Remote Terminal
                 </button>
                 <button className="py-4 bg-[#7A0C0C] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#7A0C0C]/20 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                    <Zap size={14} /> Deploy Security Patch
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

// Subcomponente: Server Card SOC Visual
// Added React.FC type to handle JSX key attribute correctly
const ServerCard: React.FC<{ server: ServerAsset, onViewDetail: any }> = ({ server, onViewDetail }) => {
  const [scanning, setScanning] = useState(false);

  const triggerScan = (e: any) => {
    e.stopPropagation();
    setScanning(true);
    setTimeout(() => setScanning(false), 3000);
  };

  return (
    <div 
      onClick={onViewDetail}
      className={`bg-white rounded-[3.5rem] p-10 border border-gray-100 shadow-sm transition-all duration-500 relative overflow-hidden group hover:shadow-2xl hover:-translate-y-2 cursor-pointer ${server.status === DeviceStatus.RISK ? 'border-orange-100' : ''}`}
    >
      {scanning && (
        <div className="absolute inset-0 bg-[#7A0C0C]/5 backdrop-blur-sm z-30 flex flex-col items-center justify-center space-y-6">
           <div className="relative">
              <RefreshCw className="w-20 h-20 text-[#7A0C0C] animate-spin" />
              <Shield className="absolute inset-0 m-auto text-[#7A0C0C] w-8 h-8 animate-pulse" />
           </div>
           <div className="text-center">
             <p className="text-[10px] font-black text-[#7A0C0C] uppercase tracking-[0.3em] mb-2">Deep Agent Auditing...</p>
             <div className="h-1 w-40 bg-gray-200 rounded-full mx-auto overflow-hidden">
                <div className="h-full bg-[#7A0C0C] animate-progress-fast"></div>
             </div>
           </div>
        </div>
      )}

      {/* Header Card */}
      <div className="flex items-start justify-between mb-8 relative z-10">
         <div className={`p-6 rounded-[2.5rem] text-white shadow-xl transition-transform group-hover:scale-110 ${
           server.status === DeviceStatus.ONLINE ? 'bg-[#7A0C0C]' : 'bg-orange-50 text-orange-600'
         }`}>
            <Server size={32} />
         </div>
         <div className="flex flex-col items-end gap-2">
            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.1em] ${
              server.status === DeviceStatus.ONLINE ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
            }`}>{server.status}</span>
            <div className="flex items-center gap-2">
               <span className="text-[10px] font-mono font-bold text-gray-400">{server.ip}</span>
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            </div>
         </div>
      </div>

      <div className="relative z-10">
         <h3 className="text-3xl font-black text-gray-900 tracking-tighter mb-1 group-hover:text-[#7A0C0C] transition-colors">{server.name}</h3>
         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-10">{server.os} • {server.agentVersion}</p>

         {/* Resources Grid */}
         <div className="grid grid-cols-3 gap-4 mb-10">
            <ResourceGauge label="CPU" value={server.cpu} color={server.cpu > 80 ? 'bg-red-500' : 'bg-[#7A0C0C]'} />
            <ResourceGauge label="RAM" value={server.ram} color={server.ram > 80 ? 'bg-red-500' : 'bg-blue-600'} />
            <ResourceGauge label="DISK" value={server.disk} color={server.disk > 90 ? 'bg-red-500' : 'bg-gray-900'} />
         </div>

         {/* Summary Security */}
         <div className="space-y-4 pt-10 border-t border-gray-50">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 flex items-center justify-center rounded-xl ${server.malwareHistory.length > 0 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                    {server.malwareHistory.length > 0 ? <AlertTriangle size={20} /> : <ShieldCheck size={20} />}
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black text-gray-800 uppercase tracking-tight">Postura Antimalware</h4>
                    <p className="text-[9px] font-bold text-gray-400 uppercase">
                      {server.malwareHistory.length > 0 ? `${server.malwareHistory.length} Amenazas Neutralizadas` : 'Sin detecciones activas'}
                    </p>
                  </div>
               </div>
               <button 
                onClick={triggerScan}
                className="text-[10px] font-black text-[#7A0C0C] uppercase tracking-widest hover:underline flex items-center gap-2"
               >
                 Escanear <ChevronRight size={14} />
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

const ResourceGauge = ({ label, value, color }: { label: string, value: number, color: string }) => (
  <div className="space-y-2">
     <div className="flex justify-between items-end">
        <span className="text-[9px] font-black text-gray-400 uppercase">{label}</span>
        <span className="text-[10px] font-black text-gray-800">{value}%</span>
     </div>
     <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-1000 ${color}`}
          style={{ width: `${value}%` }}
        ></div>
     </div>
  </div>
);

const StatusBox = ({ label, value, color = 'text-gray-800' }: any) => (
  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
     <span className="block text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</span>
     <span className={`text-xs font-black truncate block ${color}`}>{value}</span>
  </div>
);

export default ServersControl;
