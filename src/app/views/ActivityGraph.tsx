"use client";
import React, { useState, useMemo } from 'react';
import { 
  Target, Monitor, Server, Globe, Network, 
  ShieldCheck, ShieldOff, Zap, Bug, History, 
  Terminal, FileWarning, Cpu, HardDrive, 
  ChevronRight, Maximize2, Share2, Search, 
  RefreshCw, Skull, LayoutGrid, ExternalLink,
  Activity, ArrowRight, ShieldAlert, Boxes
} from 'lucide-react';
import { MOCK_DEVICES, MOCK_LOGS } from '../constants';
import { Device, DeviceStatus } from '../../../types';

// --- TIPADO TÉCNICO ---
interface ProcessTrace {
  pid: number;
  name: string;
  user: string;
  risk: 'low' | 'medium' | 'high' | 'critical';
}

const ActivityGraph: React.FC = () => {
  const allAssets = useMemo(() => MOCK_DEVICES, []);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>(allAssets[0].id);
  const [mlSensitivity, setMlSensitivity] = useState(82);
  const [isSyncing, setIsSyncing] = useState(false);

  // Equipo seleccionado
  const activeDevice = useMemo(() => 
    allAssets.find(d => d.id === selectedDeviceId) || allAssets[0], 
  [selectedDeviceId, allAssets]);

  // Telemetría de procesos simulada
  const processTraces: ProcessTrace[] = useMemo(() => [
    { pid: 1102, name: activeDevice.type === 'Server' ? 'sqlservr.exe' : 'outlook.exe', user: 'SYSTEM', risk: 'low' },
    { pid: 8842, name: 'powershell.exe', user: 'AD\\Administrator', risk: 'critical' },
    { pid: 4412, name: 'conhost.exe', user: 'AD\\Administrator', risk: 'high' },
    { pid: 302, name: 'svchost.exe', user: 'NETWORK SERVICE', risk: 'low' },
  ], [activeDevice]);

  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 1500);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col space-y-4 animate-in fade-in duration-700 overflow-hidden">
      
      {/* 1. COMPACT COMMAND HEADER */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-4">
          <div className="bg-[#1A1A1A] p-3 rounded-2xl shadow-xl text-[#7A0C0C]">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tighter leading-none">XDR Entity Orchestrator</h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">BWP SOC Node: 0x8F22 (Active)</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
           <div className="bg-white px-5 py-2 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-6">
              <div className="flex flex-col">
                 <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">AI Sensitivity</span>
                 <input type="range" className="w-24 accent-[#7A0C0C] h-1 bg-gray-100 rounded-full" value={mlSensitivity} onChange={e => setMlSensitivity(parseInt(e.target.value))} />
              </div>
              <div className="h-6 w-px bg-gray-100"></div>
              <button onClick={handleManualSync} className="flex items-center gap-2 text-[9px] font-black text-[#7A0C0C] uppercase tracking-widest">
                <RefreshCw size={12} className={isSyncing ? 'animate-spin' : ''} /> Sync
              </button>
           </div>
        </div>
      </div>

      {/* 2. MASTER WORKSPACE (GRID 12 COL) */}
      <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
        
        {/* PANEL A: ASSET HUB (3 Cols) */}
        <div className="col-span-3 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col overflow-hidden">
           <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <LayoutGrid size={14} /> Inventario SOC
              </h3>
              <span className="bg-gray-900 text-white text-[8px] font-black px-2 py-0.5 rounded-full">{allAssets.length}</span>
           </div>
           
           <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
              {allAssets.map(asset => (
                <div 
                  key={asset.id}
                  onClick={() => setSelectedDeviceId(asset.id)}
                  className={`p-4 rounded-[1.8rem] border-2 transition-all cursor-pointer flex items-center gap-3 group ${
                    selectedDeviceId === asset.id ? 'border-[#7A0C0C] bg-[#7A0C0C]/5 shadow-sm' : 'border-transparent bg-white hover:bg-gray-50'
                  }`}
                >
                   <div className={`p-2.5 rounded-xl ${
                     selectedDeviceId === asset.id ? 'bg-[#7A0C0C] text-white' : 'bg-gray-100 text-gray-400'
                   }`}>
                      {asset.type === 'Server' ? <Server size={16} /> : <Monitor size={16} />}
                   </div>
                   <div className="flex-1 overflow-hidden">
                      <p className={`text-[10px] font-black uppercase truncate ${selectedDeviceId === asset.id ? 'text-[#7A0C0C]' : 'text-gray-800'}`}>{asset.name}</p>
                      <p className="text-[9px] font-mono text-gray-400">{asset.ip}</p>
                   </div>
                   {asset.status === 'critical' && <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>}
                </div>
              ))}
           </div>
        </div>

        {/* PANEL B: TACTICAL TOPOLOGY (6 Cols) */}
        <div className="col-span-6 bg-white rounded-[3rem] border border-gray-100 shadow-sm relative flex flex-col overflow-hidden">
           {/* Grid Technical Background */}
           <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1A1A1A 1.5px, transparent 0)', backgroundSize: '30px 30px' }}></div>

           {/* Canvas Controls */}
           <div className="absolute top-6 left-6 z-20 flex gap-2">
              <div className="bg-[#1A1A1A] px-4 py-2 rounded-xl shadow-xl flex items-center gap-3">
                 <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">System Bus:</span>
                 <span className="text-[9px] font-bold text-[#7A0C0C] uppercase italic">Linear XDR</span>
              </div>
           </div>

           {/* Interactive Topology Canvas */}
           <div className="flex-1 relative flex items-center justify-center p-12">
              {/* SVG MASTER LINE */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                 <defs>
                    <filter id="lineGlow">
                       <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                       <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
                    </filter>
                 </defs>
                 
                 {/* Main Bézier Data Path */}
                 <path 
                   d="M 100,300 C 200,300 300,300 450,300" 
                   fill="none" 
                   stroke="#E5E7EB" 
                   strokeWidth="2" 
                   strokeDasharray="8 4"
                 />
                 <path 
                   d="M 100,300 C 200,300 300,300 450,300" 
                   fill="none" 
                   stroke="#7A0C0C" 
                   strokeWidth="3" 
                   filter="url(#lineGlow)"
                   strokeDasharray="12 8"
                   className="animate-[dash_20s_linear_infinite]"
                 />
              </svg>

              <div className="relative w-full h-full flex items-center justify-around z-10">
                 
                 {/* NODE: EXTERNAL GATEWAY */}
                 <div className="flex flex-col items-center gap-3 opacity-40 scale-90">
                    <div className="w-20 h-20 bg-gray-100 rounded-[1.5rem] flex items-center justify-center text-gray-400 border border-gray-200">
                       <Globe size={24} />
                    </div>
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Ext. Gateway</span>
                 </div>

                 {/* NODE: BWP CONTROLLER */}
                 <div className="flex flex-col items-center gap-4">
                    <div className="w-28 h-28 bg-[#1A1A1A] rounded-[2.5rem] flex items-center justify-center text-[#7A0C0C] shadow-2xl border-4 border-[#7A0C0C]/10 relative">
                       <Network size={36} />
                       <div className="absolute -top-2 -right-2 w-7 h-7 bg-green-500 rounded-xl flex items-center justify-center text-white border-4 border-white shadow-lg">
                          <ShieldCheck size={14} />
                       </div>
                    </div>
                    <div className="text-center">
                       <p className="text-[9px] font-black text-gray-900 uppercase tracking-widest">BWP Core Hub</p>
                    </div>
                 </div>

                 {/* NODE: SELECTED TARGET */}
                 <div className="flex flex-col items-center gap-4 animate-in zoom-in-95 duration-500">
                    <div className={`w-40 h-40 bg-white rounded-[3rem] flex flex-col items-center justify-center gap-3 shadow-2xl border-4 ${
                       activeDevice.status === 'critical' ? 'border-red-500' : 'border-gray-50'
                    }`}>
                       <div className={`p-5 rounded-2xl ${activeDevice.status === 'critical' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                          {activeDevice.type === 'Server' ? <Server size={40} /> : <Monitor size={40} />}
                       </div>
                       <div className="text-center px-2">
                          <p className="text-[11px] font-black text-gray-900 uppercase truncate w-32 leading-none">{activeDevice.name}</p>
                          <p className="text-[9px] font-mono font-bold text-gray-400 mt-1">{activeDevice.ip}</p>
                       </div>
                       
                       {/* Floating Threat Level */}
                       <div className="absolute -top-3 -right-3">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white border-4 border-white shadow-xl ${
                            activeDevice.status === 'critical' ? 'bg-[#7A0C0C] animate-pulse' : 'bg-green-500'
                          }`}>
                            {activeDevice.status === 'critical' ? <Skull size={18} /> : <ShieldCheck size={18} />}
                          </div>
                       </div>
                    </div>
                    <span className="text-[8px] font-black bg-gray-900 text-white px-4 py-1 rounded-full uppercase tracking-widest">Agent Active {activeDevice.agentVersion}</span>
                 </div>
              </div>
           </div>

           {/* COMPACT FLOATING ACTION BAR */}
           <div className="mx-6 mb-6 bg-white/80 backdrop-blur-md border border-gray-100 rounded-3xl p-5 flex items-center justify-between shadow-xl">
              <div className="flex items-center gap-6">
                 <div>
                    <span className="text-[8px] font-black text-gray-400 uppercase block mb-1">Impact Level</span>
                    <span className="text-2xl font-black text-gray-900">99.8<span className="text-xs text-[#7A0C0C]">%</span></span>
                 </div>
                 <div className="h-8 w-px bg-gray-100"></div>
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-50 text-[#7A0C0C] flex items-center justify-center">
                       <Bug size={20} className="animate-bounce" />
                    </div>
                    <div>
                       <p className="text-[9px] font-black text-red-600 uppercase">Ataque Detectado</p>
                       <p className="text-[10px] font-bold text-gray-500 leading-none mt-0.5 truncate w-48">PowerShell Malicioso interceptado.</p>
                    </div>
                 </div>
              </div>
              <div className="flex gap-2">
                 <button className="px-5 py-3 bg-gray-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2 shadow-lg">
                    <ShieldOff size={14} /> Isolate
                 </button>
                 <button className="px-5 py-3 bg-[#7A0C0C] text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#8B1E1E] transition-all flex items-center gap-2 shadow-lg shadow-[#7A0C0C]/20">
                    <Zap size={14} /> Remediate
                 </button>
              </div>
           </div>
        </div>

        {/* PANEL C: DEEP FORENSIC INVESTIGATOR (3 Cols) */}
        <div className="col-span-3 flex flex-col gap-4 overflow-hidden">
           
           {/* SUB-PANEL: IDENTITY & AUDIT */}
           <div className="flex-1 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col overflow-hidden">
              <div className="p-6 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
                 <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Forensic Intelligence</h3>
                 <History size={14} className="text-gray-300" />
              </div>

              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-6">
                 {/* Live Telemetry Meters */}
                 <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                       <MiniMeter label="vCPU" value={activeDevice.cpu} color="#7A0C0C" />
                       <MiniMeter label="Latency" value={activeDevice.latency} max={100} color="#3B82F6" />
                    </div>
                 </div>

                 {/* Active Vulnerabilities */}
                 <div className="space-y-3">
                    <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                       <FileWarning size={12} className="text-[#7A0C0C]" /> CVE Audit Results
                    </h4>
                    <div className="space-y-2">
                       {activeDevice.vulnerabilities.length > 0 ? (
                         activeDevice.vulnerabilities.map(v => (
                           <div key={v} className="bg-red-50 p-3 rounded-xl border border-red-100 flex items-center justify-between group cursor-pointer hover:bg-white transition-all">
                              <div className="flex items-center gap-3 overflow-hidden">
                                 <div className="w-8 h-8 bg-red-100 text-[#7A0C0C] rounded-lg flex items-center justify-center font-black text-[9px] shrink-0">{v.split('-')[1]}</div>
                                 <span className="text-[10px] font-black text-gray-800 uppercase truncate">{v}</span>
                              </div>
                              <ChevronRight size={12} className="text-red-200" />
                           </div>
                         ))
                       ) : (
                         <div className="bg-green-50 p-4 rounded-2xl border border-green-100 flex items-center gap-3">
                            <ShieldCheck size={18} className="text-green-600" />
                            <span className="text-[9px] font-black text-green-700 uppercase">Hardened Core</span>
                         </div>
                       )}
                    </div>
                 </div>

                 {/* Live Processes */}
                 <div className="space-y-3">
                    <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                       <Terminal size={12} className="text-gray-400" /> Live Process Tree
                    </h4>
                    <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 divide-y divide-gray-100">
                       {processTraces.map(p => (
                         <div key={p.pid} className="p-3 flex items-center justify-between hover:bg-white transition-colors cursor-default">
                            <div className="flex items-center gap-3 overflow-hidden">
                               <div className={`w-1 h-1 rounded-full ${p.risk === 'critical' ? 'bg-red-500 animate-pulse' : 'bg-blue-500'}`}></div>
                               <div className="overflow-hidden">
                                  <p className="text-[10px] font-black text-gray-800 truncate">{p.name}</p>
                                  <p className="text-[8px] font-mono font-bold text-gray-400 uppercase">PID: {p.pid}</p>
                               </div>
                            </div>
                            <span className={`text-[7px] font-black px-1.5 py-0.5 rounded uppercase ${
                              p.risk === 'critical' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-400'
                            }`}>{p.risk}</span>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>

           {/* SUB-PANEL: TELEMETRY JOURNAL */}
           <div className="h-64 bg-[#1A1A1A] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border border-white/5">
              <div className="p-5 border-b border-white/5 flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <History size={12} className="text-[#7A0C0C]" />
                    <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Telemetry Journal</h3>
                 </div>
                 <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar bg-black/20">
                 {MOCK_LOGS.map(log => (
                   <div key={log.id} className="p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-pointer group">
                      <div className="flex items-center justify-between mb-1.5">
                         <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">{log.category} EVENT</span>
                         <span className="text-[7px] font-mono text-gray-600">{log.timestamp.split(' ')[1]}</span>
                      </div>
                      <code className="block text-[8px] font-mono text-gray-400 leading-tight bg-black/40 p-2 rounded-lg border border-white/5 truncate group-hover:text-green-400 transition-colors">
                        {log.message}
                      </code>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes dash { to { stroke-dashoffset: -1000; } }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #7A0C0C; }
        @keyframes progress-fast { 0% { width: 0%; } 100% { width: 100%; } }
        .animate-progress-fast { animation: progress-fast 2.5s ease-in-out infinite; }
      `}} />
    </div>
  );
};

// COMPONENTES AUXILIARES

const MiniMeter = ({ label, value, max = 100, color }: { label: string, value: number, max?: number, color: string }) => (
  <div className="space-y-2">
     <div className="flex justify-between items-end">
        <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
        <span className="text-[10px] font-black text-gray-800">{value}{max === 100 ? '%' : 'ms'}</span>
     </div>
     <div className="h-1 bg-gray-50 rounded-full overflow-hidden">
        <div 
          className="h-full transition-all duration-1000" 
          style={{ width: `${(value/max)*100}%`, backgroundColor: color }}
        ></div>
     </div>
  </div>
);

export default ActivityGraph;
