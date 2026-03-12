"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { 
  ShieldCheck, AlertTriangle, ShieldAlert, 
  Zap, Globe, Cpu, ArrowUpRight, Download, 
  Terminal, Shield, Monitor, Server, Activity,
  ChevronRight, X, Bug, Lock, ListFilter,
  Flame, Skull, Target, Layers, Database,
  Search, ShieldX, HardDrive, BarChart3,
  Network, Radio, AlertCircle, Crosshair,
  TrendingUp, Dna, Activity as PulseIcon
} from 'lucide-react';
import StatCard from '../components/Dashboard/StatCard';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend, AreaChart, Area, ComposedChart, Line,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { COLORS, MOCK_DEVICES } from '../constants';
import { DeviceStatus, Severity, Incident } from '../../../types';
import { authService } from '../api/authService';

const Overview: React.FC = () => {
  const [showRiskAudit, setShowRiskAudit] = useState(false);
  const [showFullForensics, setShowFullForensics] = useState(false);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [devices, setDevices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [incData, devData] = await Promise.all([
          authService.getIncidents(),
          authService.getDevices()
        ]);
        if (Array.isArray(incData)) setIncidents(incData);
        if (Array.isArray(devData)) setDevices(devData);
      } catch (err) {
        console.error('Error fetching overview data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Lógica: Radar de Inteligencia de Amenazas (Nuevo Vector Pro)
  const tacticalRadarData = [
    { metric: 'Frecuencia', 'SRV-SQL': 95, 'CEO-LAPTOP': 40, 'GCP-NODE': 75 },
    { metric: 'Severidad', 'SRV-SQL': 90, 'CEO-LAPTOP': 60, 'GCP-NODE': 85 },
    { metric: 'Persistencia', 'SRV-SQL': 65, 'CEO-LAPTOP': 95, 'GCP-NODE': 45 },
    { metric: 'Exfiltración', 'SRV-SQL': 30, 'CEO-LAPTOP': 20, 'GCP-NODE': 90 },
    { metric: 'Recurrencia', 'SRV-SQL': 85, 'CEO-LAPTOP': 55, 'GCP-NODE': 40 },
  ];

  // Lógica: Severidad consolidada por grupos departamentales (Nueva Estética Robusta)
  const groupSeverityMatrix = [
    { group: 'IT INFRASTRUCTURE', critical: 12, high: 24, medium: 45, load: 82 },
    { group: 'ADMINISTRACIÓN', critical: 8, high: 15, medium: 12, load: 45 },
    { group: 'VENTAS / RETAIL', critical: 2, high: 32, medium: 88, load: 68 },
    { group: 'DATACENTER CORE', critical: 18, high: 4, medium: 2, load: 94 },
  ];

  // Lógica: Equipos con más CVEs pendientes de actualización
  const cveUpdateQueue = useMemo(() => {
    return [...devices]
      .filter(d => d.vulnerabilities && d.vulnerabilities.length > 0)
      .sort((a, b) => b.vulnerabilities.length - a.vulnerabilities.length);
  }, [devices]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-24">
      
      {/* 1. TOP SOC HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-6xl font-black text-gray-900 tracking-tighter flex items-center gap-5">
            <div className="bg-[#1A1A1A] p-5 rounded-[2.5rem] shadow-2xl shadow-black/20 text-[#7A0C0C]">
              <Shield className="w-12 h-12" />
            </div>
            BWP Master Command
          </h1>
          <p className="text-gray-500 font-bold mt-2 uppercase tracking-[0.4em] text-[11px] ml-1">Control Global de Ciberdefensa • Operación Nivel 5</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-white px-8 py-4 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-6">
              <div className="text-right border-r border-gray-100 pr-6">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sistema</p>
                 <p className="text-sm font-black text-green-600">ONLINE</p>
              </div>
              <div className="flex flex-col items-center">
                 <Activity size={20} className="text-[#7A0C0C] animate-pulse" />
                 <span className="text-[8px] font-black text-gray-400 uppercase mt-1">Live Feed</span>
              </div>
           </div>
        </div>
      </div>

      {/* 2. KPI GRID: MEGA RIESGO + METRICAS ROBUSTAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <button 
          onClick={() => setShowRiskAudit(true)}
          className="lg:col-span-1 bg-gradient-to-br from-[#7A0C0C] to-[#450606] text-white p-10 rounded-[4rem] shadow-2xl shadow-[#7A0C0C]/40 relative overflow-hidden group hover:-translate-y-3 transition-all duration-500 text-left"
        >
           <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 blur-[80px] -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-700"></div>
           <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="flex items-center justify-between">
                 <span className="text-xs font-black text-red-200 uppercase tracking-[0.3em]">Threat Score</span>
                 <AlertCircle size={28} className="animate-pulse text-white" />
              </div>
              <div className="my-6">
                 <div className="flex items-baseline gap-2">
                    <span className="text-8xl font-black tracking-tighter leading-none">24<span className="text-4xl text-red-300 opacity-50">%</span></span>
                 </div>
                 <div className="mt-4 flex items-center gap-3">
                    <div className="px-3 py-1 bg-white/10 rounded-full text-[9px] font-black uppercase tracking-widest">Estado: Alerta</div>
                    <div className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                       <div className="h-full bg-red-400 w-[24%]"></div>
                    </div>
                 </div>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/60 group-hover:text-white group-hover:translate-x-2 transition-all">
                 Presione para Auditoría CVE <ChevronRight size={16} />
              </div>
           </div>
        </button>

        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8">
           <StatCard label="Endpoints Totales" value={devices.length.toString()} icon={Monitor} color="#3B82F6" />
           <StatCard label="Protección Cloud" value={`${devices.filter(d => d.type === 'Server').length} Serv.`} icon={Server} color="#8B5CF6" />
           <StatCard label="Eventos Block" value={incidents.filter(i => i.status === 'Blocked').length.toString()} icon={Zap} color="#10B981" trend={{ value: 12, isUp: true }} />
           
           <div className="md:col-span-3 bg-[#1A1A1A] p-8 rounded-[3.5rem] border border-white/5 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
              <div className="absolute left-0 top-0 w-full h-full bg-[#7A0C0C]/5 blur-[60px]"></div>
              <div className="relative z-10">
                 <h3 className="text-2xl font-black text-white tracking-tighter flex items-center gap-3">
                   <Download className="text-[#7A0C0C]" /> Deployment Agent Center
                 </h3>
                 <p className="text-gray-400 text-xs font-medium mt-1">Instale el agente BWP para monitoreo de Kernel y protección Anti-Ransomware.</p>
              </div>
              <div className="relative z-10 flex gap-4">
                 <button className="px-6 py-3 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all flex items-center gap-2">
                    <Monitor size={14} /> Windows
                 </button>
                 <button className="px-6 py-3 bg-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all">
                    Linux
                 </button>
                 <button className="px-6 py-3 bg-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all">
                    macOS
                 </button>
              </div>
           </div>
        </div>
      </div>

      {/* 3. VISUALIZACIONES PRINCIPALES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* RADAR DE HOSTILIDAD */}
        <div className="lg:col-span-2 bg-white p-12 rounded-[4rem] border border-gray-100 shadow-sm flex flex-col min-h-[550px] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03]">
             <Crosshair size={300} strokeWidth={1} />
          </div>
          
          <div className="flex items-center justify-between mb-12 relative z-10">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-[#1A1A1A] rounded-[2rem] text-[#7A0C0C] shadow-xl"><Crosshair size={32} /></div>
              <div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tighter">Radar de Hostilidad Multi-Activo</h2>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">Análisis comparativo de vectores de ataque sobre activos críticos.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
               <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-[#7A0C0C]"></div>
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-500"></div>
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-orange-500"></div>
               </div>
               <button className="p-3 bg-gray-50 rounded-xl text-gray-400 hover:text-gray-900"><ListFilter size={18} /></button>
            </div>
          </div>
          
          <div className="flex-1 w-full relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1 h-full min-h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={tacticalRadarData}>
                  <PolarGrid stroke="#E5E7EB" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 900 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} hide />
                  <Radar name="SRV-SQL-PROD" dataKey="SRV-SQL" stroke="#7A0C0C" fill="#7A0C0C" fillOpacity={0.4} />
                  <Radar name="GCP-NODE-01" dataKey="GCP-NODE" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.4} />
                  <Radar name="CEO-LAPTOP" dataKey="CEO-LAPTOP" stroke="#F97316" fill="#F97316" fillOpacity={0.4} />
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', fontSize: '11px', fontWeight: 'bold' }} />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-64 space-y-4">
               <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Target Insights</h4>
               <TargetInsight label="Critical Surface" asset="SRV-SQL" color="text-[#7A0C0C]" value="EXTREME" />
               <TargetInsight label="Data Exposure" asset="GCP-NODE" color="text-blue-600" value="HIGH" />
               <TargetInsight label="Persistence" asset="CEO-LAPTOP" color="text-orange-600" value="ALARM" />
            </div>
          </div>
        </div>

        {/* --- NUEVA MATRIZ DE SEVERIDAD ROBUSTA --- */}
        <div className="bg-[#0D0D0D] p-10 rounded-[4rem] text-white shadow-2xl relative overflow-hidden flex flex-col border border-white/5">
           <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1A1A1A 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
           
           <div className="relative z-10 flex items-center justify-between mb-12">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 text-[#7A0C0C]">
                  <PulseIcon size={24} className="animate-pulse" />
                </div>
                <div>
                   <h2 className="text-2xl font-black tracking-tighter uppercase italic">Hostility Matrix</h2>
                   <p className="text-[8px] font-black text-gray-500 uppercase tracking-[0.4em]">Grid de Amenazas Activas</p>
                </div>
              </div>
              <div className="text-right">
                 <span className="text-[10px] font-mono text-gray-500">REF: SOC_774</span>
              </div>
           </div>

           <div className="flex-1 space-y-8 relative z-10">
              {groupSeverityMatrix.map((item) => (
                <div key={item.group} className="group cursor-pointer">
                   <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-3">
                         <div className={`w-1.5 h-1.5 rounded-full ${item.critical > 10 ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' : 'bg-blue-500 shadow-[0_0_10px_#3b82f6]'}`}></div>
                         <span className="text-[10px] font-black text-gray-400 tracking-widest">{item.group}</span>
                      </div>
                      <span className="text-[9px] font-mono text-white/40">LOAD_{item.load}%</span>
                   </div>
                   
                   <div className="flex items-center gap-1.5">
                      {/* Generamos segmentos estilo rack industrial */}
                      {Array.from({ length: 15 }).map((_, i) => {
                        const threshold = (i / 15) * 100;
                        const isActive = item.load > threshold;
                        let colorClass = 'bg-white/5';
                        
                        if (isActive) {
                          if (threshold > 80) colorClass = 'bg-red-600 shadow-[0_0_8px_#dc2626]';
                          else if (threshold > 50) colorClass = 'bg-orange-500 shadow-[0_0_8px_#f97316]';
                          else colorClass = 'bg-[#7A0C0C] shadow-[0_0_8px_#7A0C0C]';
                        }

                        return (
                          <div 
                            key={i} 
                            className={`h-6 flex-1 rounded-sm transition-all duration-700 ${colorClass}`}
                            style={{ transitionDelay: `${i * 30}ms` }}
                          />
                        );
                      })}
                   </div>
                   
                   <div className="mt-3 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center gap-1.5">
                         <span className="text-[8px] font-black text-red-500 uppercase">Crit:</span>
                         <span className="text-[10px] font-bold">{item.critical}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                         <span className="text-[8px] font-black text-orange-500 uppercase">High:</span>
                         <span className="text-[10px] font-bold">{item.high}</span>
                      </div>
                      <div className="flex items-center gap-1.5 ml-auto">
                         <ChevronRight size={12} className="text-[#7A0C0C]" />
                      </div>
                   </div>
                </div>
              ))}
           </div>

           <div className="mt-10 p-6 bg-white/5 rounded-3xl border border-white/10 flex items-center justify-between">
              <div className="flex flex-col">
                 <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Protocolo de Respuesta</span>
                 <span className="text-[10px] font-bold text-red-500 animate-pulse">AISLAMIENTO NIVEL 4</span>
              </div>
              <button className="p-3 bg-red-600/10 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all border border-red-500/20">
                 <ShieldAlert size={18} />
              </button>
           </div>
        </div>
      </div>

      {/* 4. EVENT FEED & FORENSIC CTAS */}
      <div className="bg-white rounded-[4rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-12 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-[#1A1A1A] rounded-[2rem] text-white shadow-xl"><Activity size={32} /></div>
            <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tighter">Eventos de Amenazas en Vivo</h2>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">Análisis heurístico sincronizado con Agentes BWP.</p>
            </div>
          </div>
          <button onClick={() => setShowFullForensics(true)} className="group px-10 py-5 bg-[#7A0C0C] text-white rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[#8B1E1E] transition-all shadow-2xl shadow-[#7A0C0C]/30 flex items-center justify-center gap-3">
            <Skull size={18} className="group-hover:rotate-12 transition-transform" /> Ver Forense Completo
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 font-black text-[10px] uppercase tracking-[0.25em]">
                <th className="px-12 py-8">Incidente ID</th>
                <th className="px-12 py-8">Evento Detectado</th>
                <th className="px-12 py-8">Target Endpoint</th>
                <th className="px-12 py-8 text-right">Status SOC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {incidents.map((inc) => (
                <tr key={inc.id} className="hover:bg-gray-50/80 transition-all cursor-pointer group">
                  <td className="px-12 py-8 font-mono font-bold text-[#7A0C0C] text-sm">{inc.id}</td>
                  <td className="px-12 py-8">
                     <div className="flex flex-col">
                        <span className="font-black text-gray-800 text-base">{inc.title}</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase mt-1">Severity: {inc.severity}</span>
                     </div>
                  </td>
                  <td className="px-12 py-8">
                    <div className="flex items-center gap-4">
                       <div className="p-3 bg-gray-100 rounded-xl text-gray-400"><Monitor size={18} /></div>
                       <div className="flex flex-col">
                          <span className="text-sm font-black text-gray-800">{inc.target}</span>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{inc.department}</span>
                       </div>
                    </div>
                  </td>
                  <td className="px-12 py-8 text-right">
                    <span className="px-6 py-2 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                      {inc.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: AUDITORÍA DE RIESGOS (CVEs) */}
      {showRiskAudit && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="bg-white rounded-[4rem] w-full max-w-5xl h-[80vh] shadow-2xl flex flex-col overflow-hidden relative border border-white/20 animate-in zoom-in-95 duration-500">
              <div className="p-12 bg-gradient-to-r from-[#7A0C0C] to-[#450606] text-white flex items-center justify-between">
                 <div className="flex items-center gap-8">
                    <div className="p-6 bg-white/10 rounded-[2.5rem] shadow-2xl rotate-6"><Bug size={48} /></div>
                    <div>
                       <h2 className="text-5xl font-black tracking-tighter leading-none">Riesgo por CVEs Críticos</h2>
                       <p className="text-[11px] font-black text-red-200 uppercase tracking-[0.4em] mt-3 opacity-60">Auditoría de Vulnerabilidades BWP Intelligence</p>
                    </div>
                 </div>
                 <button onClick={() => setShowRiskAudit(false)} className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all">
                    <X size={32} />
                 </button>
              </div>
              <div className="p-12 flex-1 overflow-y-auto custom-scrollbar bg-gray-50/30">
                 <div className="grid grid-cols-1 gap-6">
                    {cveUpdateQueue.map(device => (
                      <div key={device.id} className="flex items-center justify-between p-8 bg-white rounded-[3rem] border-2 border-transparent hover:border-[#7A0C0C]/40 transition-all duration-300 group shadow-sm hover:shadow-xl">
                         <div className="flex items-center gap-8">
                            <div className={`p-6 rounded-[2rem] shadow-lg transition-all group-hover:scale-110 ${device.status === DeviceStatus.CRITICAL ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-400'}`}>
                               <Monitor size={36} />
                            </div>
                            <div>
                               <div className="flex items-center gap-3">
                                  <h4 className="text-2xl font-black text-gray-900 tracking-tighter">{device.name}</h4>
                                  <span className="text-[10px] font-black bg-[#7A0C0C] text-white px-3 py-1 rounded-full uppercase tracking-widest">{device.vulnerabilities.length} CVEs</span>
                               </div>
                               <p className="text-xs font-mono font-bold text-gray-400 uppercase mt-2 tracking-widest">{device.ip} • {device.department} • {device.os}</p>
                            </div>
                         </div>
                         <div className="flex items-center gap-10">
                            <div className="space-y-2">
                               {device.vulnerabilities.slice(0, 2).map((v: string) => (
                                 <div key={v} className="flex items-center gap-2 text-red-600">
                                    <ShieldX size={14} />
                                    <span className="text-[11px] font-black uppercase tracking-tighter">{v}</span>
                                 </div>
                               ))}
                            </div>
                            <button className="px-10 py-5 bg-[#1A1A1A] text-white rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest hover:bg-[#7A0C0C] transition-all shadow-xl">
                               Desplegar Parche
                            </button>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* MODAL: FORENSE COMPLETO */}
      {showFullForensics && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="bg-[#0A0A0A] rounded-[5rem] w-full max-w-7xl h-[90vh] shadow-2xl flex flex-col overflow-hidden relative border border-white/5 shadow-red-900/10">
              <div className="p-12 border-b border-white/5 flex items-center justify-between bg-black">
                 <div className="flex items-center gap-10">
                    <div className="relative">
                       <div className="w-24 h-24 bg-[#7A0C0C]/20 rounded-full animate-ping absolute"></div>
                       <div className="p-6 bg-[#7A0C0C] rounded-[2.5rem] text-white relative z-10 shadow-2xl"><Skull size={32} /></div>
                    </div>
                    <div>
                       <div className="flex items-center gap-4">
                          <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none">Forensic Stream v2.5</h2>
                          <div className="px-4 py-1.5 bg-red-500/10 text-red-500 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-red-500/20 animate-pulse">Critical Analysis Active</div>
                       </div>
                    </div>
                 </div>
                 <button onClick={() => setShowFullForensics(false)} className="w-20 h-20 rounded-[2.5rem] bg-white/5 text-gray-500 flex items-center justify-center hover:text-white hover:bg-white/10 transition-all">
                    <X size={40} />
                 </button>
              </div>
              <div className="flex-1 p-12 overflow-y-auto custom-scrollbar font-mono text-[12px] bg-black/60">
                 <ForensicLog time="14:52:01" source="SRV-PROD-SQL" msg="[!] CRITICAL: Unauthorized shell access via port 1433 detected." type="CRITICAL" />
                 <ForensicLog time="14:51:55" source="SRV-PROD-SQL" msg="[i] BWP-Shield intercepted memory injection in process sqlservr.exe." type="SUCCESS" />
                 <ForensicLog time="14:51:10" source="CEO-LAPTOP" msg="[+] WARNING: High disk entropy detected in /Users/Admin/Documents." type="WARNING" />
                 <ForensicLog time="14:45:00" source="GATEWAY-02" msg="[!] DDoS: Packet flood detected from segment IP: 45.12.XXX.XX." type="CRITICAL" />
                 <div className="pt-10 flex flex-col items-center justify-center opacity-40 animate-pulse space-y-4">
                    <Terminal size={40} className="text-gray-600" />
                    <p className="text-[11px] font-black uppercase tracking-[0.5em] text-gray-500">Escuchando flujo binario SOC...</p>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

// COMPONENTES AUXILIARES ESTILIZADOS

const TargetInsight = ({ label, asset, color, value }: any) => (
  <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 group hover:bg-white hover:shadow-md transition-all">
     <div className="flex justify-between items-center mb-1">
        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
        <span className={`text-[10px] font-black ${color}`}>{value}</span>
     </div>
     <div className="flex items-center justify-between">
        <span className="text-xs font-black text-gray-800">{asset}</span>
        <TrendingUp size={12} className="text-red-500" />
     </div>
  </div>
);

const ForensicLog = ({ time, source, msg, type }: any) => (
  <div className="flex gap-10 p-6 rounded-3xl hover:bg-white/5 transition-all border-l-4 border-transparent hover:border-[#7A0C0C] group">
     <span className="text-gray-600 shrink-0 font-bold opacity-40 group-hover:opacity-100 transition-opacity">[{time}]</span>
     <span className="text-[#7A0C0C] font-black shrink-0 w-32 truncate">[{source}]</span>
     <span className={`leading-relaxed ${
       type === 'CRITICAL' ? 'text-red-500 font-bold' : 
       type === 'WARNING' ? 'text-orange-400' : 
       type === 'SUCCESS' ? 'text-green-500' : 
       'text-gray-300'
     }`}>
        {msg}
     </span>
  </div>
);

export default Overview;
