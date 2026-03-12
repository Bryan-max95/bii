"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { 
  ShieldAlert, ShieldCheck, Bug, Search, Filter, 
  ChevronRight, ArrowUpRight, Database, Monitor, 
  Globe, Zap, AlertTriangle, Layers, Server, 
  Cpu, RefreshCw, Download, FileText, Terminal, 
  Lock, Activity, Network, Info, CheckCircle2, 
  Loader2, X, List, Play, Shield, ArrowRight,
  BrainCircuit, LayoutGrid, Clock
} from 'lucide-react';
import { MOCK_DEVICES, COLORS } from '../constants';
import { Severity, DeviceStatus, Device } from '../../../types';

interface VulnerabilityDetail {
  id: string;
  cve: string;
  cvss: number;
  severity: Severity;
  target: string;
  targetType: 'Server' | 'PC' | 'Network' | 'Cloud';
  group: string;
  description: string;
  remediation: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'MITIGATED';
  detectedVia: 'AGENT' | 'IP_SCAN';
}

interface RemediationPlan {
  id: string;
  name: string;
  type: 'Automatic' | 'Manual' | 'Hybrid';
  steps: string[];
  estimatedTime: string;
  riskLevel: 'Low' | 'Medium';
}

const Vulnerabilities: React.FC = () => {
  const [activeSegment, setActiveSegment] = useState<'ALL' | 'SERVER' | 'PC' | 'NETWORK' | 'CLOUD'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [showAIConsole, setShowAIConsole] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [executionLogs, setExecutionLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [isExecuting, setIsExecuting] = useState(false);
  const [patchingQueue, setPatchingQueue] = useState<Device[]>([]);

  // Datos extendidos
  const allVulnerabilities: VulnerabilityDetail[] = useMemo(() => [
    {
      id: 'V-101', cve: 'CVE-2024-21413', cvss: 9.8, severity: Severity.CRITICAL, 
      target: 'SRV-PROD-SQL-01', targetType: 'Server', group: 'Datacenter',
      description: 'Microsoft Outlook Remote Code Execution Vulnerability.',
      remediation: 'Instalar Cumulative Update KB5034765.',
      status: 'OPEN', detectedVia: 'AGENT'
    },
    {
      id: 'V-102', cve: 'CVE-2023-44487', cvss: 7.5, severity: Severity.HIGH, 
      target: 'GCP-LINUX-WEB-02', targetType: 'Cloud', group: 'GCP-Production',
      description: 'HTTP/2 Rapid Reset Attack (DDoS mitigation required).',
      remediation: 'Actualizar configuración de Nginx a versión 1.25.3.',
      status: 'IN_PROGRESS', detectedVia: 'IP_SCAN'
    },
    {
      id: 'V-103', cve: 'CVE-2024-1011', cvss: 8.2, severity: Severity.HIGH, 
      target: 'SW-CORE-CISCO', targetType: 'Network', group: 'Backbone',
      description: 'Cisco IOS-XE Web UI Privilege Escalation.',
      remediation: 'Desactivar HTTP Server y actualizar Firmware a IOS-XE 17.9.4.',
      status: 'OPEN', detectedVia: 'IP_SCAN'
    },
    {
      id: 'V-105', cve: 'CVE-2024-23912', cvss: 9.1, severity: Severity.CRITICAL, 
      target: 'CEO-LAPTOP-01', targetType: 'PC', group: 'Administración',
      description: 'Local Privilege Escalation in BWP Agent v2.4 (Outdated).',
      remediation: 'Forzar actualización de Agente BWP a v2.6.',
      status: 'OPEN', detectedVia: 'AGENT'
    },
  ], []);

  const remediationPlans: RemediationPlan[] = [
    {
      id: 'plan-01',
      name: 'BWP Zero-Day Shielding',
      type: 'Automatic',
      steps: ['Analizar firma binaria', 'Aislar proceso afectado', 'Inyectar parche hot-fix', 'Verificar checksum'],
      estimatedTime: '45s',
      riskLevel: 'Low'
    },
    {
      id: 'plan-02',
      name: 'Full OS Patch Lifecycle',
      type: 'Hybrid',
      steps: ['Respaldar configuración actual', 'Descargar KB de repositorio BWP', 'Instalación silenciosa', 'Reinicio programado'],
      estimatedTime: '15m',
      riskLevel: 'Medium'
    }
  ];

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 2500);
  };

  const startAIPatching = (specificTarget?: string) => {
    setShowAIConsole(true);
    setIsExecuting(true);
    setProgress(0);
    
    // Si no hay target específico, seleccionamos todos los críticos
    const targets = specificTarget 
      ? MOCK_DEVICES.filter(d => d.name === specificTarget)
      : MOCK_DEVICES.filter(d => d.vulnerabilities.length > 0);
    
    setPatchingQueue(targets);
    setExecutionLogs(["[AI-CORE] Inicializando motor de remediación BWP...", "[INFO] Analizando dependencias y criticidad de activos..."]);

    const logs = [
      `[AUTH] Credenciales de Agente verificadas en ${targets.length} nodos.`,
      `[PLAN] Aplicando Playbook: "Intelligent Auto-Mitigation v2"`,
      `[EXEC] Desplegando parches en: ${targets.map(t => t.name).join(', ')}`,
      `[VERIFY] Validando integridad de archivos post-parcheo...`,
      `[SUCCESS] Operación finalizada. 0 errores detectados.`
    ];

    let step = 0;
    const interval = setInterval(() => {
      if (step < logs.length) {
        setExecutionLogs(prev => [...prev, logs[step]]);
        setProgress(Math.min(((step + 1) / logs.length) * 100, 100));
        step++;
      } else {
        clearInterval(interval);
        setIsExecuting(false);
      }
    }, 1500);
  };

  const filtered = allVulnerabilities.filter(v => {
    const matchesSearch = v.cve.toLowerCase().includes(searchTerm.toLowerCase()) || v.target.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSegment = activeSegment === 'ALL' || v.targetType.toUpperCase() === activeSegment;
    return matchesSearch && matchesSegment;
  });

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-24">
      {/* Header Central de Inteligencia */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter flex items-center gap-4">
            <div className="bg-[#1A1A1A] p-3 rounded-2xl shadow-xl shadow-black/10 text-[#7A0C0C]">
              <Bug className="w-8 h-8" />
            </div>
            Gestión de Vulnerabilidades (CVE)
          </h1>
          <p className="text-gray-500 font-medium mt-2">Centro de Remediación Inteligente • Nivel de Control SOC 5</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowPlanModal(true)}
            className="flex items-center gap-2 px-6 py-4 bg-white border border-gray-200 text-gray-700 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm"
          >
            <List size={16} /> Ver Planes de Remediación
          </button>
          <button 
            onClick={handleSync}
            className="flex items-center gap-2 px-6 py-4 bg-white border border-gray-200 text-gray-700 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm"
          >
            <RefreshCw className={isSyncing ? 'animate-spin' : ''} size={16} /> Sincronizar NVD
          </button>
        </div>
      </div>

      {/* Stats Board Premium */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <VulnStatCard label="Total Críticas" value={allVulnerabilities.filter(v => v.severity === Severity.CRITICAL).length} color="#7A0C0C" icon={ShieldAlert} trend="+2" />
         <VulnStatCard label="Sistemas en Riesgo" value={allVulnerabilities.length} color="#1A1A1A" icon={Monitor} trend="-15%" />
         <VulnStatCard label="CVSS Promedio" value="8.4" color="#F97316" icon={Activity} />
         <VulnStatCard label="Mitigados/Mes" value="152" color="#10B981" icon={ShieldCheck} />
      </div>

      {/* AI Action Area */}
      <div className="bg-[#1A1A1A] p-10 rounded-[3.5rem] text-white relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-10 border border-white/5 shadow-2xl">
         <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#7A0C0C 1.5px, transparent 0)', backgroundSize: '32px 32px' }}></div>
         <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#7A0C0C] blur-[120px] opacity-20"></div>
         
         <div className="max-w-xl space-y-4 relative z-10">
            <div className="flex items-center gap-3 mb-2">
               <div className="px-3 py-1 bg-[#7A0C0C] text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-lg">AI Engine Active</div>
               <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Version 2.5 Cognitive</span>
            </div>
            <h2 className="text-4xl font-black tracking-tighter leading-tight">Remediación Cognitiva BWP</h2>
            <p className="text-sm text-gray-400 font-medium leading-relaxed">
               Nuestra IA ha analizado el parque informático y detectado **4 vectores de entrada críticos**. ¿Desea ejecutar un parcheo inteligente masivo en los activos de mayor impacto?
            </p>
         </div>
         
         <div className="flex flex-col gap-4 relative z-10 min-w-[280px]">
            <button 
               onClick={() => startAIPatching()}
               className="px-10 py-6 bg-[#7A0C0C] text-white rounded-3xl font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-[#7A0C0C]/40 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3 group"
            >
               <BrainCircuit size={20} className="group-hover:rotate-12 transition-transform" /> Ejecutar Parcheo Inteligente
            </button>
            <p className="text-[9px] text-center text-gray-500 font-bold uppercase tracking-widest">Afectará a {MOCK_DEVICES.filter(d => d.vulnerabilities.length > 0).length} equipos críticos</p>
         </div>
      </div>

      {/* Control & Segment Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="flex bg-white p-1.5 rounded-[1.5rem] shadow-sm border border-gray-100 overflow-x-auto no-scrollbar">
           {(['ALL', 'SERVER', 'PC', 'NETWORK', 'CLOUD'] as const).map(s => (
             <button 
               key={s}
               onClick={() => setActiveSegment(s)}
               className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeSegment === s ? 'bg-[#1A1A1A] text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
             >
               {s === 'ALL' ? 'Todos los Activos' : s === 'SERVER' ? 'Servidores' : s === 'PC' ? 'Computadoras' : s === 'NETWORK' ? 'Network IP' : 'Cloud'}
             </button>
           ))}
        </div>
        <div className="flex-1 max-w-md relative">
           <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
           <input 
             type="text" 
             placeholder="Filtrar por CVE, equipo o grupo..." 
             className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#7A0C0C]/10 outline-none font-bold text-gray-800 shadow-sm"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
      </div>

      {/* Main Matrix View */}
      <div className="grid grid-cols-1 gap-6">
        {filtered.map(vuln => (
          <VulnerabilityDetailedCard 
            key={vuln.id} 
            vuln={vuln} 
            onApplyRemediation={() => startAIPatching(vuln.target)} 
          />
        ))}
      </div>

      {/* MODAL: CONSOLA DE EJECUCIÓN AI */}
      {showAIConsole && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-8 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="bg-[#0D0D0D] rounded-[4rem] w-full max-w-5xl h-[85vh] shadow-2xl flex flex-col overflow-hidden relative border border-white/5 shadow-[#7A0C0C]/10">
              {/* Header Consola */}
              <div className="p-10 border-b border-white/5 flex items-center justify-between bg-black">
                 <div className="flex items-center gap-8">
                    <div className="relative">
                       <div className={`w-24 h-24 bg-[#7A0C0C]/20 rounded-full absolute ${isExecuting ? 'animate-ping' : ''}`}></div>
                       <div className="p-6 bg-[#7A0C0C] rounded-[2.5rem] text-white relative z-10 shadow-2xl">
                          {isExecuting ? <BrainCircuit size={32} className="animate-pulse" /> : <Terminal size={32} />}
                       </div>
                    </div>
                    <div>
                       <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">BWP Remediation Console</h2>
                       <div className="flex items-center gap-6 mt-4">
                          <div className="flex items-center gap-2">
                             <div className={`w-2 h-2 rounded-full ${isExecuting ? 'bg-[#7A0C0C] animate-pulse' : 'bg-green-500'}`}></div>
                             <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">{isExecuting ? 'Patching Active' : 'Operation Complete'}</span>
                          </div>
                          <div className="w-64 h-1.5 bg-white/5 rounded-full overflow-hidden">
                             <div className="h-full bg-[#7A0C0C] transition-all duration-500" style={{ width: `${progress}%` }}></div>
                          </div>
                          <span className="text-xs font-mono text-[#7A0C0C] font-bold">{Math.round(progress)}%</span>
                       </div>
                    </div>
                 </div>
                 {!isExecuting && (
                    <button onClick={() => setShowAIConsole(false)} className="w-16 h-16 rounded-[2rem] bg-white/5 text-gray-500 flex items-center justify-center hover:text-white transition-all">
                       <X size={32} />
                    </button>
                 )}
              </div>

              {/* Body Consola: Split View */}
              <div className="flex-1 flex overflow-hidden">
                 {/* Lista de Equipos en Ejecución */}
                 <div className="w-80 border-r border-white/5 p-8 overflow-y-auto custom-scrollbar bg-black/20">
                    <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-6">Host Queue</h3>
                    <div className="space-y-3">
                       {patchingQueue.map(device => (
                         <div key={device.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                            <div className={`p-2 rounded-lg ${isExecuting ? 'bg-gray-800 text-gray-500' : 'bg-green-500/10 text-green-500'}`}>
                               <Monitor size={14} />
                            </div>
                            <div className="flex-1 overflow-hidden">
                               <p className="text-[11px] font-black text-gray-300 truncate leading-none mb-1">{device.name}</p>
                               <p className="text-[9px] font-mono text-gray-600">{device.ip}</p>
                            </div>
                            {!isExecuting && <CheckCircle2 size={14} className="text-green-500" />}
                         </div>
                       ))}
                    </div>
                 </div>

                 {/* Logs de Salida */}
                 <div className="flex-1 p-10 font-mono text-[11px] text-gray-300 overflow-y-auto custom-scrollbar bg-black/40">
                    <div className="space-y-3">
                       {executionLogs.map((log, i) => (
                         <div key={i} className="flex gap-6 p-3 rounded-xl hover:bg-white/5 transition-all group">
                            <span className="text-gray-700 shrink-0 font-bold opacity-40">[{new Date().toLocaleTimeString()}]</span>
                            <span className={`${log.includes('SUCCESS') ? 'text-green-500' : log.includes('AI-CORE') ? 'text-[#7A0C0C] font-black' : 'text-gray-400'}`}>
                               {log}
                            </span>
                         </div>
                       ))}
                       {isExecuting && (
                          <div className="pt-8 flex flex-col items-center justify-center opacity-40 animate-pulse space-y-4">
                             <Loader2 size={32} className="text-gray-600 animate-spin" />
                             <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-600">Interfacing with Remote Agents...</p>
                          </div>
                       )}
                    </div>
                 </div>
              </div>

              {/* Footer Consola */}
              <div className="p-10 border-t border-white/5 bg-black flex justify-between items-center">
                 <div className="flex items-center gap-3 text-gray-500">
                    <Shield size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Encrypted Tunnel: SOC-8842-X</span>
                 </div>
                 {!isExecuting && (
                    <div className="flex gap-4">
                       <button className="px-8 py-3 bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20">Descargar Log</button>
                       <button onClick={() => setShowAIConsole(false)} className="px-8 py-3 bg-[#7A0C0C] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#7A0C0C]/20">Cerrar Consola</button>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}

      {/* MODAL: PLANES DE REMEDIACIÓN */}
      {showPlanModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-8 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white rounded-[4rem] w-full max-w-4xl max-h-[80vh] shadow-2xl flex flex-col overflow-hidden">
              <div className="p-10 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                 <div className="flex items-center gap-6">
                    <div className="p-4 bg-[#7A0C0C] rounded-2xl text-white shadow-lg"><List size={24} /></div>
                    <div>
                       <h3 className="text-3xl font-black text-gray-900 tracking-tighter">Playbooks de Remediación</h3>
                       <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">Estrategias automáticas certificadas por BWP SOC</p>
                    </div>
                 </div>
                 <button onClick={() => setShowPlanModal(false)} className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-300 hover:text-[#7A0C0C] transition-all"><X size={24} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-10 space-y-6 bg-[#FDFCFB]">
                 {remediationPlans.map(plan => (
                    <div key={plan.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                       <div className="flex items-start justify-between mb-8">
                          <div>
                             <div className="flex items-center gap-3 mb-2">
                                <h4 className="text-xl font-black text-gray-900 tracking-tight">{plan.name}</h4>
                                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[8px] font-black uppercase">{plan.type}</span>
                             </div>
                             <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase">
                                   {/* Fixed missing Clock import */}
                                   <Clock size={12} /> Est. {plan.estimatedTime}
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-green-500 uppercase">
                                   <ShieldCheck size={12} /> Riesgo: {plan.riskLevel}
                                </div>
                             </div>
                          </div>
                          <button className="px-6 py-3 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all">Seleccionar Plan</button>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          {plan.steps.map((step, i) => (
                             <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                <span className="text-[10px] font-black text-[#7A0C0C] w-5">0{i+1}</span>
                                <span className="text-[11px] font-medium text-gray-600">{step}</span>
                             </div>
                          ))}
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

// Subcomponente: Tarjeta de Vulnerabilidad Detallada
const VulnerabilityDetailedCard: React.FC<{ vuln: VulnerabilityDetail, onApplyRemediation: () => void }> = ({ vuln, onApplyRemediation }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`bg-white rounded-[2.5rem] border border-gray-100 shadow-sm transition-all duration-500 overflow-hidden group hover:shadow-xl ${vuln.severity === Severity.CRITICAL ? 'border-l-4 border-l-[#7A0C0C]' : ''}`}>
       <div className="p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          {/* Identificación CVE */}
          <div className="flex items-center gap-6 min-w-[280px]">
             <div className={`w-16 h-16 rounded-[1.5rem] flex flex-col items-center justify-center text-white shadow-xl transition-transform group-hover:rotate-3 ${
               vuln.severity === Severity.CRITICAL ? 'bg-[#7A0C0C]' : 'bg-orange-500'
             }`}>
                <span className="text-[9px] font-black uppercase opacity-60 leading-none">CVSS</span>
                <span className="text-xl font-black">{vuln.cvss}</span>
             </div>
             <div>
                <h3 className="text-xl font-black text-gray-900 tracking-tighter group-hover:text-[#7A0C0C] transition-colors leading-none mb-2">{vuln.cve}</h3>
                <div className="flex items-center gap-2">
                   <div className={`w-2 h-2 rounded-full ${vuln.severity === Severity.CRITICAL ? 'bg-[#7A0C0C] animate-pulse' : 'bg-orange-500'}`}></div>
                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{vuln.severity} RISK</span>
                   <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                   <span className={`text-[10px] font-black uppercase ${vuln.status === 'OPEN' ? 'text-red-500' : 'text-blue-500'}`}>{vuln.status}</span>
                </div>
             </div>
          </div>

          {/* Activo Afectado */}
          <div className="flex items-center gap-5 flex-1">
             <div className="p-4 bg-gray-50 rounded-2xl text-gray-400 group-hover:text-[#7A0C0C] transition-colors">
                {vuln.targetType === 'Server' ? <Server size={26} /> : 
                 vuln.targetType === 'PC' ? <Monitor size={26} /> : 
                 vuln.targetType === 'Cloud' ? <Database size={26} /> : <Network size={26} />}
             </div>
             <div>
                <p className="text-sm font-black text-gray-800 leading-none mb-1">{vuln.target}</p>
                <div className="flex items-center gap-2">
                   <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-100 px-2 py-0.5 rounded-lg">{vuln.group}</span>
                   <div className="flex items-center gap-1.5 text-[9px] font-black text-[#7A0C0C] uppercase tracking-tighter">
                      <Zap size={10} /> {vuln.detectedVia === 'AGENT' ? 'Deep Agent Analysis' : 'External IP Probe'}
                   </div>
                </div>
             </div>
          </div>

          {/* Acciones Rápidas */}
          <div className="flex items-center gap-4">
             <button 
               onClick={() => setIsExpanded(!isExpanded)}
               className="px-6 py-3 bg-gray-50 text-gray-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all flex items-center gap-2"
             >
                {isExpanded ? 'Ocultar Forense' : 'Ver Remediación'}
                <ChevronRight size={14} className={`transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
             </button>
             <button className="p-3 bg-gray-900 text-white rounded-xl hover:bg-[#7A0C0C] transition-all shadow-md">
                <Terminal size={18} />
             </button>
          </div>
       </div>

       {/* Panel Forense Expandible */}
       {isExpanded && (
         <div className="p-10 bg-gray-50/50 border-t border-gray-100 grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-top-4 duration-500">
            <div className="lg:col-span-7 space-y-8">
               <div>
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-4">
                    <FileText size={14} /> Análisis Técnico del Hallazgo
                  </h4>
                  <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
                     <p className="text-sm font-medium text-gray-700 leading-relaxed italic">
                        "{vuln.description}"
                     </p>
                     <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-50">
                        <AnalysisMetric label="Exploitability" value="HIGH" color="text-red-500" />
                        <AnalysisMetric label="Network Vector" value="REMOTE" color="text-orange-500" />
                        <AnalysisMetric label="Authentication" value="NOT REQ." color="text-red-600" />
                     </div>
                  </div>
               </div>
               
               <div>
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-4">
                    <Shield size={14} /> Impacto en Infraestructura
                  </h4>
                  <div className="flex gap-4">
                     <div className="flex-1 bg-[#1A1A1A] p-5 rounded-2xl border border-white/5">
                        <span className="block text-[8px] font-black text-gray-500 uppercase mb-1">Confidencialidad</span>
                        <span className="text-xs font-black text-red-500 uppercase tracking-tighter">Compromiso Total</span>
                     </div>
                     <div className="flex-1 bg-[#1A1A1A] p-5 rounded-2xl border border-white/5">
                        <span className="block text-[8px] font-black text-gray-400 uppercase mb-1">Integridad</span>
                        <span className="text-xs font-black text-orange-500 uppercase tracking-tighter">Modificación Parcial</span>
                     </div>
                  </div>
               </div>
            </div>

            <div className="lg:col-span-5 flex flex-col">
               <h4 className="text-[10px] font-black text-[#7A0C0C] uppercase tracking-widest flex items-center gap-2 mb-4">
                 <Zap size={14} /> Playbook de Respuesta BWP
               </h4>
               <div className="flex-1 bg-[#1A1A1A] p-10 rounded-[3rem] text-white flex flex-col justify-between relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#7A0C0C] blur-[60px] opacity-10"></div>
                  
                  <div className="relative z-10 space-y-6">
                     <div className="p-5 bg-white/5 rounded-2xl border border-white/5">
                        <p className="text-xs font-bold leading-relaxed text-gray-300">
                           {vuln.remediation}
                        </p>
                     </div>
                     
                     <div className="space-y-3">
                        <RemediationCheck text="Validar versión de Agente v2.6+" />
                        <RemediationCheck text="Descarga de KB firmada digitalmente" />
                        <RemediationCheck text="Reinicio de servicios dependientes" />
                     </div>
                  </div>

                  <button 
                    onClick={onApplyRemediation}
                    className="mt-10 relative z-10 w-full py-5 bg-[#7A0C0C] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#8B1E1E] transition-all shadow-xl shadow-[#7A0C0C]/20 flex items-center justify-center gap-3 group"
                  >
                     <Play size={14} className="group-hover:translate-x-1 transition-transform" /> Aplicar Remediación Ahora
                  </button>
               </div>
            </div>
         </div>
       )}
    </div>
  );
};

const AnalysisMetric = ({ label, value, color }: any) => (
  <div>
     <span className="block text-[8px] font-black text-gray-400 uppercase mb-0.5">{label}</span>
     <span className={`text-[10px] font-black uppercase ${color}`}>{value}</span>
  </div>
);

const RemediationCheck = ({ text }: { text: string }) => (
  <div className="flex items-center gap-3 text-[10px] font-black uppercase text-gray-400">
     <div className="w-1.5 h-1.5 rounded-full bg-[#7A0C0C]"></div>
     {text}
  </div>
);

const VulnStatCard = ({ label, value, color, icon: Icon, trend }: any) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm group hover:shadow-xl transition-all hover:-translate-y-1 relative overflow-hidden">
     <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
        <Icon size={80} />
     </div>
     <div className="flex items-start justify-between mb-6 relative z-10">
        <div className="p-4 rounded-2xl bg-gray-50 text-gray-400 group-hover:bg-[#7A0C0C]/5 group-hover:text-[#7A0C0C] transition-colors shadow-sm">
           <Icon size={24} />
        </div>
        {trend && (
          <span className={`text-[9px] font-black px-2 py-1 rounded-lg ${trend.includes('+') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
            {trend}
          </span>
        )}
     </div>
     <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 relative z-10">{label}</h3>
     <p className="text-4xl font-black text-gray-900 tracking-tighter relative z-10" style={{ color }}>{value}</p>
  </div>
);

export default Vulnerabilities;
