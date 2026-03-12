"use client";
import React, { useState, useMemo } from 'react';
import { 
  Shield, ShieldCheck, ShieldAlert, Lock, Unlock, Zap, 
  Search, RefreshCw, Activity, Terminal, Layers, 
  Cpu, Network, Globe, AlertTriangle, CheckCircle, 
  Plus, Settings, Filter, ChevronRight, Fingerprint,
  Eye, Bug, Database, X, Target, Info,
  History, Server, Monitor, Smartphone, Play,
  Skull, Flame, Radio, Crosshair, Map, TrendingUp, BarChart3,
  Binary, Key, Radio as Signal, Wifi, Cpu as Processor,
  // Added missing Camera import
  Camera
} from 'lucide-react';
import { Severity, DeviceStatus, Device } from '../../../types';
import { POLICIES, MOCK_DEVICES } from '../constants';
import { 
  ResponsiveContainer, Radar, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, Tooltip
} from 'recharts';

interface GlobalPolicy {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'ACTIVE' | 'DRAFT' | 'INHERITED';
  targetGroups: string[];
  severity: Severity;
  logicParams?: string;
}

const SecurityControl: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'POLICIES' | 'INTEL'>('OVERVIEW');
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [showLogicEditor, setShowLogicEditor] = useState<GlobalPolicy | null>(null);
  
  // 1. ESTADO DINÁMICO: BWP DEEP SHIELD (Protección de Agentes)
  const [deepShieldFeatures, setDeepShieldFeatures] = useState([
    { id: 'ds1', name: 'Anti-Ransomware Heurístico', enabled: true, icon: Skull },
    { id: 'ds2', name: 'Kernel Self-Defense', enabled: true, icon: Shield },
    { id: 'ds3', name: 'Memory Stack Integrity', enabled: true, icon: Processor },
    { id: 'ds4', name: 'Zero-Day Sandboxing', enabled: false, icon: Zap },
    { id: 'ds5', name: 'Anti-Exploit Pro', enabled: true, icon: Bug },
    { id: 'ds6', name: 'USB Hardware Lock', enabled: false, icon: Lock },
    { id: 'ds7', name: 'Biometric Auth Proxy', enabled: false, icon: Fingerprint },
    { id: 'ds8', name: 'Registry Integrity Guard', enabled: true, icon: Database },
    { id: 'ds9', name: 'Process Behavior Analysis', enabled: true, icon: Activity },
  ]);

  // 2. ESTADO DINÁMICO: PERÍMETRO IP (Control Agentless)
  const [perimeterSettings, setPerimeterSettings] = useState([
    { id: 'ips1', name: 'Reputación IP de mi Red', active: true, desc: 'Consulta en listas negras de C&C.' },
    { id: 'ips2', name: 'Detección de Puertos Rogue', active: true, desc: 'Identifica servicios no autorizados.' },
    { id: 'ips3', name: 'Anti-DDoS Perimetral', active: false, desc: 'Mitiga inundación de paquetes.' },
    { id: 'ips4', name: 'Nodos Honeypot Internos', active: false, desc: 'Activos cebo para detectar intrusos.' },
    { id: 'ips5', name: 'Audit de Credenciales Default', active: true, desc: 'Prueba credenciales débiles en SSH/Web.' },
    { id: 'ips6', name: 'SSL/TLS Obsolescence Check', active: false, desc: 'Detecta protocolos SSL v2/v3.' },
  ]);

  // 3. ESTADO: ESCANEO DE VULNERABILIDADES IP (SELECTOR)
  const [showScanSelector, setShowScanSelector] = useState(false);
  const [selectedScanIps, setSelectedScanIps] = useState<string[]>([]);
  const [isIpScanning, setIsIpScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanFindings, setScanFindings] = useState<any[]>([]);
  const [showScanResults, setShowScanResults] = useState(false);

  // 4. ESTADO: MOTOR DE GPO
  const [activeGPOs, setActiveGPOs] = useState<GlobalPolicy[]>([
    { id: 'GP-001', name: 'Anti-Ransomware Heuristic v4', description: 'Monitoreo de entropía de archivos en tiempo real.', category: 'ENDPOINT', status: 'ACTIVE', targetGroups: ['Administración', 'IT'], severity: Severity.CRITICAL, logicParams: 'Entropy: 0.85; Action: Kill' },
    { id: 'GP-002', name: 'USB Storage Restriction', description: 'Bloqueo masivo de puertos físicos.', category: 'ENDPOINT', status: 'ACTIVE', targetGroups: ['Administración', 'Ventas'], severity: Severity.HIGH, logicParams: 'Allowed: [BWP-SEC-01]' },
  ]);

  const [selectedBasePolicyIds, setSelectedBasePolicyIds] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [policySearch, setPolicySearch] = useState('');

  const availableGroups = useMemo(() => Array.from(new Set(MOCK_DEVICES.map(d => d.department))), []);
  const filteredCatalog = useMemo(() => 
    POLICIES.filter(p => p.name.toLowerCase().includes(policySearch.toLowerCase()) || p.category.toLowerCase().includes(policySearch.toLowerCase())),
  [policySearch]);

  const toggleDeepShield = (id: string) => {
    setDeepShieldFeatures(prev => prev.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f));
  };

  const togglePerimeter = (id: string) => {
    setPerimeterSettings(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  const toggleScanIp = (ip: string) => {
    setSelectedScanIps(prev => prev.includes(ip) ? prev.filter(i => i !== ip) : [...prev, ip]);
  };

  const executeSelectedScan = () => {
    setShowScanSelector(false);
    setIsIpScanning(true);
    setScanProgress(0);
    setScanFindings([]);

    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsIpScanning(false);
          setShowScanResults(true);
          
          // Generar hallazgos basados en los activos seleccionados
          const results = selectedScanIps.map(ip => {
            const asset = MOCK_DEVICES.find(d => d.ip === ip);
            if (asset?.type === 'Camera') {
                return { ip, asset: asset.name, vuln: 'Unauthenticated RTSP Stream', risk: 'CRITICAL', type: 'Video Protocol' };
            } else if (asset?.type === 'Server') {
                return { ip, asset: asset.name, vuln: 'SSH Default Password (root/root)', risk: 'HIGH', type: 'Credentials' };
            }
            return { ip, asset: asset?.name || 'Unknown', vuln: 'Outdated SSL/TLS Version', risk: 'MEDIUM', type: 'Network' };
          });
          
          setScanFindings(results);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const handleDeployMultipleGPOs = () => {
    if (selectedBasePolicyIds.length === 0 || selectedGroups.length === 0) return;
    const newPolicies: GlobalPolicy[] = selectedBasePolicyIds.map(pid => {
      const base = POLICIES.find(p => p.id === pid)!;
      return {
        id: `GP-${Math.floor(Math.random() * 9999)}`,
        name: base.name,
        description: base.description,
        category: base.category.toUpperCase(),
        status: 'ACTIVE',
        targetGroups: selectedGroups,
        severity: Severity.HIGH
      };
    });
    setActiveGPOs([...newPolicies, ...activeGPOs]);
    setShowDeployModal(false);
    setSelectedBasePolicyIds([]);
    setSelectedGroups([]);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-24">
      {/* HEADER MASTER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter flex items-center gap-4">
            <div className="bg-[#1A1A1A] p-3 rounded-2xl shadow-xl shadow-black/10 text-[#7A0C0C]">
              <ShieldCheck className="w-8 h-8" />
            </div>
            Security Master Center
          </h1>
          <p className="text-gray-500 font-medium mt-2">Nivel de Operación SOC 5: Inteligencia de IPs Propias y Control de Agentes.</p>
        </div>
        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
          {(['OVERVIEW', 'POLICIES', 'INTEL'] as const).map(t => (
            <button 
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === t ? 'bg-[#7A0C0C] text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {t === 'OVERVIEW' ? 'Defensa de Mis IPs' : t === 'POLICIES' ? 'Motor de GPO' : 'IP Defense Intel'}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'OVERVIEW' && (
        <div className="space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             
             {/* Perímetro (IP-Only) - Toggles Dinámicos + Escaneo */}
             <div className="lg:col-span-1 bg-white p-8 rounded-[3.5rem] border border-gray-100 shadow-sm flex flex-col relative overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                   <h3 className="text-xl font-black text-gray-900 tracking-tighter">Perímetro (Agentless)</h3>
                   <span className="text-[9px] font-black text-blue-500 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest">Auditoría IP</span>
                </div>

                <div className="space-y-2 flex-1 overflow-y-auto custom-scrollbar pr-2">
                   {perimeterSettings.map(s => (
                     <div 
                      key={s.id} 
                      onClick={() => togglePerimeter(s.id)}
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer group ${s.active ? 'bg-gray-50 border-gray-200' : 'border-transparent opacity-50 hover:opacity-100'}`}
                     >
                        <div className="flex items-center gap-3">
                           <div className={`w-1.5 h-1.5 rounded-full ${s.active ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-gray-300'}`}></div>
                           <div>
                              <p className="text-xs font-black text-gray-800">{s.name}</p>
                              <p className="text-[9px] text-gray-400 font-medium">{s.desc}</p>
                           </div>
                        </div>
                        <div className={`w-8 h-4 rounded-full relative transition-colors ${s.active ? 'bg-green-500' : 'bg-gray-300'}`}>
                           <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${s.active ? 'right-0.5' : 'left-0.5'}`}></div>
                        </div>
                     </div>
                   ))}
                </div>

                <div className="mt-8 p-6 bg-gray-900 rounded-[2.5rem] space-y-4">
                   <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Escaneo de Vulnerabilidades</span>
                      {isIpScanning && <span className="text-[10px] font-black text-[#7A0C0C] animate-pulse italic">PROBING...</span>}
                   </div>
                   
                   {isIpScanning ? (
                     <div className="space-y-3">
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                           <div className="h-full bg-[#7A0C0C] shadow-[0_0_15px_#7A0C0C] transition-all duration-300" style={{ width: `${scanProgress}%` }}></div>
                        </div>
                        <p className="text-[9px] font-bold text-gray-500 uppercase text-center italic">Analizando {selectedScanIps.length} activos seleccionados...</p>
                     </div>
                   ) : (
                     <button 
                       onClick={() => setShowScanSelector(true)}
                       className="w-full py-4 bg-[#7A0C0C] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#8B1E1E] shadow-xl shadow-[#7A0C0C]/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                     >
                       <Zap size={14} /> Iniciar Escaneo IP Rápido
                     </button>
                   )}
                </div>
             </div>

             {/* BWP Deep Shield - Control Global de Agentes */}
             <div className="lg:col-span-2 bg-[#1A1A1A] text-white p-10 rounded-[4rem] shadow-2xl relative overflow-hidden flex flex-col">
                <div className="absolute top-0 right-0 w-80 h-80 bg-[#7A0C0C] blur-[120px] opacity-20"></div>
                <div className="relative z-10 flex flex-col md:flex-row gap-10">
                   <div className="flex-1 space-y-6">
                      <div className="flex items-center gap-4">
                         <div className="p-4 bg-[#7A0C0C] rounded-[1.5rem] shadow-xl"><ShieldCheck size={32} /></div>
                         <div>
                            <h3 className="text-3xl font-black tracking-tighter leading-none italic uppercase">Deep Shield</h3>
                            <p className="text-[10px] font-black text-[#7A0C0C] uppercase tracking-[0.2em] mt-2">Blindaje Global de Host</p>
                         </div>
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed font-medium">
                        Administre los módulos de defensa inyectados en sus Agentes instalados. Los cambios se propagan mediante túneles TLS cifrados a todas sus IPs en tiempo real.
                      </p>
                      <div className="p-6 bg-white/5 rounded-3xl border border-white/10 flex items-center justify-between">
                         <div>
                            <span className="block text-[8px] font-black text-gray-500 uppercase mb-1">Status de Salud de Mis IPs</span>
                            <div className="flex items-center gap-2">
                               <span className="text-3xl font-black text-green-500">99.4%</span>
                               <TrendingUp size={16} className="text-green-500" />
                            </div>
                         </div>
                         <Activity size={32} className="text-[#7A0C0C] animate-pulse" />
                      </div>
                   </div>
                   
                   <div className="flex-1 grid grid-cols-1 gap-2 overflow-y-auto max-h-[400px] custom-scrollbar pr-2">
                      {deepShieldFeatures.map(feat => (
                        <div 
                          key={feat.id} 
                          onClick={() => toggleDeepShield(feat.id)}
                          className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer group ${
                            feat.enabled ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-transparent border-white/5 opacity-40 hover:opacity-100'
                          }`}
                        >
                           <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${feat.enabled ? 'bg-[#7A0C0C]/20 text-[#7A0C0C]' : 'bg-gray-800 text-gray-500'}`}>
                                 <feat.icon size={16} />
                              </div>
                              <span className="text-[11px] font-bold tracking-tight">{feat.name}</span>
                           </div>
                           <div className={`w-8 h-4 rounded-full relative transition-colors ${feat.enabled ? 'bg-[#7A0C0C]' : 'bg-gray-700'}`}>
                              <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${feat.enabled ? 'right-0.5' : 'left-0.5'}`}></div>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>

          {/* MODAL: SELECTOR DE ACTIVOS PARA ESCANEO */}
          {showScanSelector && (
            <div className="bg-white p-8 rounded-[3.5rem] border border-gray-100 shadow-2xl animate-in zoom-in-95 duration-500">
               <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                     <div className="p-3 bg-[#7A0C0C] text-white rounded-2xl"><Target size={24} /></div>
                     <div>
                        <h3 className="text-2xl font-black text-gray-900 tracking-tighter uppercase italic">Selección de Objetivos IP</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Defina los activos para el escaneo de vulnerabilidades profundo</p>
                     </div>
                  </div>
                  <button onClick={() => setShowScanSelector(false)} className="text-gray-400 hover:text-red-500 transition-all"><X size={24} /></button>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto p-4 custom-scrollbar bg-gray-50 rounded-[2.5rem]">
                  {MOCK_DEVICES.map(device => (
                    <div 
                      key={device.id} 
                      onClick={() => toggleScanIp(device.ip)}
                      className={`p-6 rounded-[2rem] border-2 transition-all cursor-pointer flex flex-col gap-3 group ${selectedScanIps.includes(device.ip) ? 'border-[#7A0C0C] bg-white shadow-xl' : 'border-transparent bg-gray-100 hover:bg-white'}`}
                    >
                       <div className="flex items-center justify-between">
                          <div className={`p-3 rounded-xl ${selectedScanIps.includes(device.ip) ? 'bg-[#7A0C0C] text-white' : 'bg-gray-200 text-gray-400'}`}>
                             {/* Added missing Camera to the type check icon selector below */}
                             {device.type === 'PC' ? <Monitor size={18} /> : device.type === 'Server' ? <Server size={18} /> : <Camera size={18} />}
                          </div>
                          {selectedScanIps.includes(device.ip) && <CheckCircle size={14} className="text-[#7A0C0C]" />}
                       </div>
                       <div>
                          <h4 className="text-xs font-black text-gray-800 uppercase tracking-tighter leading-tight">{device.name}</h4>
                          <p className="text-[10px] font-mono font-bold text-gray-400 mt-1">{device.ip}</p>
                       </div>
                    </div>
                  ))}
               </div>

               <div className="mt-8 flex justify-between items-center">
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Objetivos seleccionados: <span className="text-[#7A0C0C]">{selectedScanIps.length}</span></div>
                  <div className="flex gap-3">
                     <button onClick={() => setSelectedScanIps([])} className="px-6 py-3 text-[10px] font-black uppercase text-gray-400 tracking-widest hover:text-gray-900">Limpiar</button>
                     <button 
                        disabled={selectedScanIps.length === 0}
                        onClick={executeSelectedScan}
                        className="px-10 py-4 bg-[#1A1A1A] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-black disabled:opacity-20 transition-all"
                     >Lanzar Deep Probe</button>
                  </div>
               </div>
            </div>
          )}

          {/* Resultados de Escaneo de Mis IPs */}
          {showScanResults && (
            <div className="bg-white p-8 rounded-[3.5rem] border border-gray-100 shadow-sm space-y-10">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                     <div className="bg-red-50 p-5 rounded-[2rem] text-[#7A0C0C] shadow-sm"><Bug size={32} /></div>
                     <div>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">Vulnerabilidades de Perímetro</h2>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Hallazgos detectados mediante escaneo remoto agentless.</p>
                     </div>
                  </div>
                  <button onClick={() => setShowScanResults(false)} className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-all shadow-sm"><X size={24} /></button>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {scanFindings.map((f, i) => (
                    <div key={i} className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 group hover:border-[#7A0C0C]/30 transition-all hover:bg-white hover:shadow-xl">
                       <div className="flex justify-between items-start mb-6">
                          <span className={`text-[8px] font-black px-2 py-1 rounded uppercase ${f.risk === 'CRITICAL' ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'}`}>{f.risk}</span>
                          <span className="text-[10px] font-mono font-bold text-gray-400 bg-white px-2 py-1 rounded shadow-sm">{f.ip}</span>
                       </div>
                       <h4 className="text-xs font-black text-gray-500 uppercase tracking-[0.1em] mb-1">{f.asset}</h4>
                       <h4 className="text-sm font-black text-gray-900 mb-2 leading-tight">{f.vuln}</h4>
                       <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5 mb-6"><Target size={10} /> {f.type}</p>
                       <button className="w-full py-3 bg-white border border-gray-200 text-gray-900 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] hover:bg-[#1A1A1A] hover:text-white transition-all shadow-sm">Remediar Asset</button>
                    </div>
                  ))}
               </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'POLICIES' && (
        <div className="space-y-10 animate-in slide-in-from-bottom-5 duration-500">
           <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm space-y-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                 <div className="flex items-center gap-6">
                    <div className="bg-[#1A1A1A] p-5 rounded-[2rem] text-white shadow-xl"><Layers size={32} /></div>
                    <div>
                       <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">GPO Policy Orchestrator</h2>
                       <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Control de políticas globales y herencia masiva para mis IPs.</p>
                    </div>
                 </div>
                 <button 
                  onClick={() => setShowDeployModal(true)}
                  className="flex items-center gap-4 px-12 py-6 bg-[#7A0C0C] text-white rounded-[2rem] text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-[#7A0C0C]/30 hover:-translate-y-2 transition-all group"
                 >
                    <Plus size={22} className="group-hover:rotate-90 transition-transform" /> Despliegue Masivo
                 </button>
              </div>

              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] border-b border-gray-100">
                          <th className="px-8 py-6">Estado</th>
                          <th className="px-8 py-6">Objeto de Política</th>
                          <th className="px-8 py-6">Alcance (Mis Grupos)</th>
                          <th className="px-8 py-6">Parámetros Lógicos</th>
                          <th className="px-8 py-6 text-right">Acción</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                       {activeGPOs.map(policy => (
                         <tr key={policy.id} className="group hover:bg-gray-50/50 transition-colors">
                            <td className="px-8 py-8"><div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e] animate-pulse"></div></td>
                            <td className="px-8 py-8">
                               <div className="flex flex-col">
                                  <span className="text-base font-black text-gray-800 leading-tight group-hover:text-[#7A0C0C] transition-colors">{policy.name}</span>
                                  <span className="text-[10px] text-gray-400 uppercase font-bold mt-1">{policy.category}</span>
                               </div>
                            </td>
                            <td className="px-8 py-8">
                               <div className="flex flex-wrap gap-2">
                                  {policy.targetGroups.map(g => (
                                    <span key={g} className="px-3 py-1 bg-white border border-gray-200 text-gray-500 rounded text-[9px] font-black uppercase shadow-sm">{g}</span>
                                  ))}
                               </div>
                            </td>
                            <td className="px-8 py-8">
                               <code className="text-[10px] font-mono font-bold text-[#7A0C0C] bg-[#7A0C0C]/5 px-3 py-1.5 rounded-lg border border-[#7A0C0C]/10">{policy.logicParams || 'Default:Strict'}</code>
                            </td>
                            <td className="px-8 py-8 text-right">
                               <button 
                                onClick={() => setShowLogicEditor(policy)}
                                className="p-4 bg-white border border-gray-100 text-gray-400 hover:text-[#7A0C0C] hover:border-[#7A0C0C] hover:shadow-lg rounded-2xl transition-all"
                               >
                                  <Settings size={20} />
                               </button>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'INTEL' && (
        <div className="space-y-10 animate-in slide-in-from-right-10 duration-500">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Mapa de Inteligencia de mis IPs */}
              <div className="lg:col-span-2 bg-[#0D0D0D] p-12 rounded-[4rem] text-white shadow-2xl relative overflow-hidden h-[550px]">
                 <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#7A0C0C 1.5px, transparent 0)', backgroundSize: '32px 32px' }}></div>
                 <div className="relative z-10 flex items-center justify-between mb-12">
                    <div>
                       <h3 className="text-3xl font-black tracking-tighter uppercase italic leading-none">IP Security Intel Map</h3>
                       <p className="text-[9px] font-black text-[#7A0C0C] uppercase tracking-[0.4em] mt-2">Visibilidad de mis Segmentos Globales</p>
                    </div>
                    <div className="px-6 py-2 bg-red-500/10 text-red-500 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-red-500/20 animate-pulse">3 Hostiles Detectadas (Internas)</div>
                 </div>
                 
                 <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                    <Signal size={400} strokeWidth={0.5} className="text-gray-800" />
                 </div>

                 {/* Segmentos de mi Red */}
                 <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-6">
                    <IPSegment label="DMZ Core" range="10.0.5.0/24" threats={2} color="#7A0C0C" />
                    <IPSegment label="Corporate LAN" range="192.168.1.0/24" threats={0} color="#10B981" />
                    <IPSegment label="WiFi Guest" range="172.16.10.0/24" threats={12} color="#F97316" />
                    <IPSegment label="Admin VLAN" range="10.10.0.0/16" threats={0} color="#3B82F6" />
                 </div>
              </div>

              {/* Hallazgos de Comportamiento IP */}
              <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm space-y-8 flex flex-col">
                 <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                    <Activity size={24} className="text-[#7A0C0C]" /> Top IP Risks (Mías)
                 </h3>
                 <div className="space-y-4 flex-1">
                    <IPRiskRow ip="192.168.10.155" action="Brute Force Port 22" count={45} />
                    <IPRiskRow ip="10.0.5.12" action="Internal Port Scan" count={12} />
                    <IPRiskRow ip="172.16.1.20" action="Unusual DNS Queries" count={8} />
                 </div>
                 
                 <div className="pt-8 border-t border-gray-100">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Cumplimiento SOC por Segmento</h4>
                    <div className="h-48 w-full">
                       <ResponsiveContainer width="100%" height="100%">
                          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                             { subject: 'Cifrado', A: 120, B: 110 },
                             { subject: 'Auth', A: 98, B: 130 },
                             { subject: 'Firewall', A: 86, B: 130 },
                             { subject: 'Agent', A: 99, B: 100 },
                             { subject: 'Patching', A: 85, B: 90 },
                          ]}>
                             <PolarGrid stroke="#F3F4F6" />
                             <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 900 }} />
                             <Radar name="Network Average" dataKey="A" stroke="#7A0C0C" fill="#7A0C0C" fillOpacity={0.4} />
                             <Tooltip />
                          </RadarChart>
                       </ResponsiveContainer>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* MODAL: EDITOR DE LÓGICA GPO */}
      {showLogicEditor && (
        <div className="fixed inset-0 z-[210] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="bg-white rounded-[4rem] w-full max-w-xl p-12 shadow-2xl space-y-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#7A0C0C]/5 blur-[60px]"></div>
              <div className="flex items-center gap-6">
                 <div className="p-5 bg-gray-900 rounded-[2rem] text-[#7A0C0C] shadow-lg"><Binary size={36} /></div>
                 <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">Logic Editor</h2>
                    <p className="text-sm text-gray-400 font-bold uppercase mt-1">{showLogicEditor.name}</p>
                 </div>
              </div>
              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Parámetros Críticos (Key-Value)</label>
                    <textarea 
                      rows={5}
                      className="w-full p-8 bg-gray-50 border-none rounded-[2.5rem] font-mono text-xs font-bold text-gray-700 focus:ring-2 focus:ring-[#7A0C0C]/10 outline-none shadow-inner"
                      defaultValue={showLogicEditor.logicParams || "Mode: Strict;\nSensitivity: 0.92;\nRetry_Policy: Immediate;\nLock_On_Fail: True;"}
                    />
                 </div>
                 <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100 flex items-start gap-4">
                    <Info size={24} className="text-blue-500 shrink-0 mt-1" />
                    <p className="text-[11px] text-blue-700 font-bold leading-relaxed">Este cambio inyectará un payload binario en el bus de herencia.</p>
                 </div>
              </div>
              <div className="flex gap-4 pt-4">
                 <button onClick={() => setShowLogicEditor(null)} className="flex-1 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Descartar</button>
                 <button onClick={() => setShowLogicEditor(null)} className="flex-[2] py-5 bg-[#7A0C0C] text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-[#7A0C0C]/20">Propagar Lógica</button>
              </div>
           </div>
        </div>
      )}

      {/* MODAL: ESTUDIO DE DESPLIEGUE MULTI-GPO */}
      {showDeployModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="bg-white rounded-[4rem] w-full max-w-6xl h-[85vh] shadow-2xl flex flex-col overflow-hidden relative border border-white/10">
              <div className="p-10 bg-white border-b border-gray-100 flex items-center justify-between">
                 <div className="flex items-center gap-8">
                    <div className="p-6 bg-gray-900 rounded-[2.5rem] text-[#7A0C0C] shadow-2xl"><Zap size={32} /></div>
                    <div>
                       <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">BWP Policy Orchestrator</h2>
                       <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-2">Endurecimiento masivo de mis IPs • Operación Nivel 5</p>
                    </div>
                 </div>
                 <button onClick={() => setShowDeployModal(false)} className="w-16 h-16 rounded-full bg-gray-50 text-gray-400 hover:text-red-500 transition-all flex items-center justify-center shadow-sm"><X size={32} /></button>
              </div>

              <div className="flex-1 flex overflow-hidden">
                 <div className="w-[450px] border-r border-gray-100 flex flex-col bg-gray-50/30">
                    <div className="p-8 pb-4">
                       <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">1. Seleccionar Políticas ({selectedBasePolicyIds.length})</h3>
                       <div className="relative">
                          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-[#7A0C0C]/10 outline-none" placeholder="Buscar en 55+ políticas..." value={policySearch} onChange={(e) => setPolicySearch(e.target.value)} />
                       </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-8 pt-0 custom-scrollbar space-y-2">
                       {filteredCatalog.map(p => {
                         const isSelected = selectedBasePolicyIds.includes(p.id);
                         return (
                           <div key={p.id} onClick={() => setSelectedBasePolicyIds(prev => prev.includes(p.id) ? prev.filter(id => id !== p.id) : [...prev, p.id])} className={`p-5 rounded-2xl border-2 transition-all cursor-pointer group ${isSelected ? 'border-[#7A0C0C] bg-white shadow-xl' : 'border-transparent bg-white/50 hover:bg-white'}`}>
                              <div className="flex items-center justify-between mb-2">
                                 <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${isSelected ? 'bg-[#7A0C0C] text-white shadow-sm' : 'bg-gray-100 text-gray-500'}`}>{p.category}</span>
                                 {isSelected && <CheckCircle size={16} className="text-[#7A0C0C]" />}
                              </div>
                              <h4 className="text-sm font-black text-gray-800 leading-tight">{p.name}</h4>
                           </div>
                         );
                       })}
                    </div>
                 </div>

                 <div className="flex-1 flex flex-col p-12 space-y-12 overflow-y-auto custom-scrollbar bg-white">
                    <section className="space-y-8">
                       <div className="flex items-center justify-between">
                          <h3 className="text-xs font-black text-gray-900 uppercase tracking-[0.2em] flex items-center gap-3"><Target size={20} className="text-[#7A0C0C]" /> 2. Unidades de mi Red (Scope)</h3>
                       </div>
                       <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                          {availableGroups.map(group => (
                            <button key={group} onClick={() => setSelectedGroups(prev => prev.includes(group) ? prev.filter(g => g !== group) : [...prev, group])} className={`p-8 rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-4 ${selectedGroups.includes(group) ? 'border-[#7A0C0C] bg-[#7A0C0C]/5 shadow-xl' : 'border-gray-100 bg-gray-50/50 hover:bg-white'}`}>
                               <div className={`p-4 rounded-2xl shadow-sm ${selectedGroups.includes(group) ? 'bg-[#7A0C0C] text-white' : 'bg-white text-gray-400'}`}><Monitor size={24} /></div>
                               <span className="text-[11px] font-black uppercase tracking-widest text-center">{group}</span>
                            </button>
                          ))}
                       </div>
                    </section>
                    <section className="bg-[#1A1A1A] p-10 rounded-[3.5rem] text-white relative overflow-hidden shadow-2xl">
                       <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#7A0C0C 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                       <h4 className="text-[10px] font-black text-[#7A0C0C] uppercase tracking-[0.3em] mb-6">Analítica de Impacto Global</h4>
                       <div className="flex items-baseline gap-3">
                          <span className="text-7xl font-black tracking-tighter leading-none">{(selectedGroups.length * 15) || 0}</span>
                          <span className="text-xl font-bold text-gray-500 uppercase tracking-widest">Activos en Scope</span>
                       </div>
                    </section>
                 </div>
              </div>

              <div className="p-10 bg-white border-t border-gray-100 flex items-center justify-between">
                 <div className="flex items-center gap-3 text-gray-400"><Shield size={20} /><span className="text-[10px] font-black uppercase tracking-widest italic">Signed & Verified: Master-SOC-Node</span></div>
                 <div className="flex gap-4">
                    <button onClick={() => setShowDeployModal(false)} className="px-10 py-5 bg-gray-100 text-gray-500 rounded-2xl text-[10px] font-black uppercase tracking-widest">Cancelar</button>
                    <button 
                      onClick={handleDeployMultipleGPOs} 
                      disabled={selectedBasePolicyIds.length === 0 || selectedGroups.length === 0} 
                      className="px-14 py-6 bg-[#7A0C0C] text-white rounded-[2rem] text-[11px] font-black uppercase tracking-[0.3em] shadow-xl shadow-[#7A0C0C]/20 hover:-translate-y-1 transition-all flex items-center gap-4"
                    >
                      <Play size={20} /> Sincronizar mis IPs
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

// Subcomponentes Auxiliares
const IPSegment = ({ label, range, threats, color }: any) => (
  <div className="bg-white/5 p-6 rounded-[2.5rem] border border-white/10 hover:bg-white/10 transition-all cursor-pointer group shadow-sm">
     <div className="flex items-center justify-between mb-5">
        <div className="w-2 h-2 rounded-full shadow-[0_0_10px_currentColor]" style={{ color: color, backgroundColor: color }}></div>
        {threats > 0 && <span className="text-[9px] font-black bg-red-600 text-white px-2.5 py-1 rounded-lg animate-pulse">{threats} Threats</span>}
     </div>
     <h4 className="text-[11px] font-black text-gray-200 uppercase tracking-tighter mb-1">{label}</h4>
     <p className="text-[10px] font-mono text-gray-500 group-hover:text-gray-300 transition-colors">{range}</p>
  </div>
);

const IPRiskRow = ({ ip, action, count }: any) => (
  <div className="flex items-center justify-between p-5 bg-gray-50 rounded-[2rem] border border-transparent hover:border-red-100 hover:bg-white hover:shadow-lg transition-all group">
     <div className="flex items-center gap-4">
        <div className="p-3 bg-white rounded-xl text-red-600 shadow-sm transition-transform group-hover:scale-110"><ShieldAlert size={18} /></div>
        <div>
           <p className="text-xs font-black text-gray-800">{ip}</p>
           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{action}</p>
        </div>
     </div>
     <div className="text-right">
        <p className="text-sm font-black text-[#7A0C0C]">{count}</p>
        <p className="text-[8px] font-black text-gray-400 uppercase">Alerts/Hr</p>
     </div>
  </div>
);

export default SecurityControl;
