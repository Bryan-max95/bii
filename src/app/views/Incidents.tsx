"use client";
import React, { useState } from 'react';
import { 
  AlertTriangle, ShieldAlert, ShieldCheck, Clock, Search, 
  Filter, MoreVertical, ShieldOff, Zap, Bell, Target, 
  Monitor, Server, Camera, HardDrive, Info, ChevronRight,
  ExternalLink, UserX, Ghost, Activity, Trash2
} from 'lucide-react';
import { MOCK_INCIDENTS, COLORS } from '../constants';
import { Incident, Severity } from '../../../types';

const Incidents: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>(MOCK_INCIDENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<Severity | 'ALL'>('ALL');
  const [filterGroup, setFilterGroup] = useState<string | 'ALL'>('ALL');

  const groups = Array.from(new Set(incidents.map(inc => inc.department)));

  const filteredIncidents = incidents.filter(inc => {
    const matchesSearch = inc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          inc.target.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = filterSeverity === 'ALL' || inc.severity === filterSeverity;
    const matchesGroup = filterGroup === 'ALL' || inc.department === filterGroup;
    return matchesSearch && matchesSeverity && matchesGroup;
  });

  const getSeverityStyle = (sev: Severity) => {
    switch(sev) {
      case Severity.CRITICAL: return 'bg-red-600 text-white shadow-red-500/20';
      case Severity.HIGH: return 'bg-orange-500 text-white shadow-orange-500/20';
      case Severity.MEDIUM: return 'bg-yellow-500 text-black shadow-yellow-500/10';
      default: return 'bg-blue-500 text-white shadow-blue-500/20';
    }
  };

  const getTargetIcon = (type: string) => {
    switch(type) {
      case 'Server': return <Server size={14} />;
      case 'Camera': return <Camera size={14} />;
      case 'PC': return <Monitor size={14} />;
      default: return <HardDrive size={14} />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      {/* Header SOC */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter flex items-center gap-4">
            <div className="bg-[#7A0C0C] p-3 rounded-2xl shadow-xl shadow-[#7A0C0C]/20 animate-pulse-wine">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            Centro de Incidentes
          </h1>
          <p className="text-gray-500 font-medium mt-2">Monitoreo y respuesta ante amenazas detectadas por los Agentes BWP.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-[#1A1A1A] p-4 rounded-2xl flex items-center gap-6">
             <div className="text-center">
               <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Activos</p>
               <p className="text-xl font-black text-white">{incidents.filter(i => i.status !== 'Dismissed').length}</p>
             </div>
             <div className="w-px h-8 bg-white/10"></div>
             <div className="text-center">
               <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Críticos</p>
               <p className="text-xl font-black text-red-500">{incidents.filter(i => i.severity === Severity.CRITICAL).length}</p>
             </div>
          </div>
        </div>
      </div>

      {/* Advanced Filter Bar */}
      <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar por equipo, IP atacante o tipo de alerta..." 
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#7A0C0C]/10 outline-none font-bold text-gray-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <select 
          className="px-4 py-3 bg-gray-50 border-none rounded-xl text-xs font-black uppercase tracking-widest text-gray-500 outline-none cursor-pointer hover:bg-gray-100 transition-all"
          value={filterSeverity}
          onChange={(e) => setFilterSeverity(e.target.value as any)}
        >
          <option value="ALL">Todas las Gravedades</option>
          <option value={Severity.CRITICAL}>Crítico</option>
          <option value={Severity.HIGH}>Alta</option>
          <option value={Severity.MEDIUM}>Media</option>
          <option value={Severity.LOW}>Baja</option>
        </select>

        <select 
          className="px-4 py-3 bg-gray-50 border-none rounded-xl text-xs font-black uppercase tracking-widest text-gray-500 outline-none cursor-pointer hover:bg-gray-100 transition-all"
          value={filterGroup}
          onChange={(e) => setFilterGroup(e.target.value)}
        >
          <option value="ALL">Todos los Departamentos</option>
          {groups.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Incidents List */}
        <div className="xl:col-span-2 space-y-4">
          {filteredIncidents.length === 0 ? (
            <div className="py-20 bg-white rounded-[2.5rem] border border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-300">
              <Ghost size={64} className="mb-4 opacity-10" />
              <p className="font-bold text-xl uppercase tracking-tighter opacity-20">No se detectan amenazas activas</p>
            </div>
          ) : (
            filteredIncidents.map(inc => (
              <div 
                key={inc.id}
                onClick={() => setSelectedIncident(inc)}
                className={`
                  bg-white p-6 rounded-[2.5rem] border-2 transition-all cursor-pointer group flex flex-col md:flex-row md:items-center gap-6
                  ${selectedIncident?.id === inc.id ? 'border-[#7A0C0C] shadow-2xl shadow-[#7A0C0C]/10 translate-x-2' : 'border-transparent shadow-sm hover:border-gray-100'}
                `}
              >
                <div className={`p-5 rounded-[2rem] flex items-center justify-center shrink-0 shadow-lg ${getSeverityStyle(inc.severity)}`}>
                  <ShieldAlert size={28} />
                </div>
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-[#7A0C0C] uppercase tracking-[0.2em]">{inc.id}</span>
                    <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{inc.timestamp}</span>
                  </div>
                  <h3 className="text-xl font-black text-gray-900 tracking-tighter group-hover:text-[#7A0C0C] transition-colors">{inc.title}</h3>
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                      <div className="text-[#7A0C0C]">{getTargetIcon(inc.targetType)}</div>
                      <span className="text-[11px] font-bold text-gray-700">{inc.target}</span>
                    </div>
                    <span className="text-[11px] font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full uppercase">{inc.department}</span>
                    {inc.attackerIp && (
                      <span className="text-[10px] font-mono font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-100">Origin: {inc.attackerIp}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 ml-auto">
                   <div className="flex flex-col items-end">
                      <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm ${
                        inc.status === 'Blocked' ? 'bg-green-100 text-green-700' :
                        inc.status === 'Monitoring' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {inc.status}
                      </span>
                   </div>
                   <ChevronRight className={`text-gray-200 transition-all ${selectedIncident?.id === inc.id ? 'translate-x-1 text-[#7A0C0C]' : ''}`} />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Selected Incident Sidebar / Panel */}
        <div className="xl:col-span-1">
          {selectedIncident ? (
            <div className="bg-[#1A1A1A] text-white rounded-[2.5rem] p-8 shadow-2xl sticky top-24 animate-in slide-in-from-right-10 duration-500 overflow-hidden relative">
              {/* Decorative wine gradient */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#7A0C0C]/20 rounded-full blur-[100px]"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <span className="text-[10px] font-black text-[#7A0C0C] uppercase tracking-[0.3em]">Incidente Forense</span>
                  <button onClick={() => setSelectedIncident(null)} className="text-gray-500 hover:text-white transition-all">×</button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-black tracking-tighter mb-4 leading-tight">{selectedIncident.title}</h2>
                    <p className="text-sm text-gray-400 leading-relaxed font-medium mb-6">"{selectedIncident.description}"</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-4 rounded-3xl border border-white/5">
                      <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-1">Target IP</span>
                      <span className="text-xs font-mono font-bold text-[#7A0C0C]">192.168.1.XX</span>
                    </div>
                    <div className="bg-white/5 p-4 rounded-3xl border border-white/5">
                      <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-1">BWP Agent</span>
                      <span className="text-xs font-bold text-green-400">Verificado</span>
                    </div>
                  </div>

                  {/* Timeline Simulation */}
                  <div className="space-y-4 pt-4">
                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                      <Activity size={12} /> Timeline de Respuesta
                    </h4>
                    <div className="space-y-4 border-l border-white/10 ml-2 pl-4">
                       <TimelineItem time="12:45:00" event="Anomalía de red detectada por motor heurístico." done />
                       <TimelineItem time="12:45:01" event="Escritura de archivos masiva bloqueada por BWP-Shield." done />
                       <TimelineItem time="12:45:05" event="Host aislado automáticamente de la red externa." done />
                       <TimelineItem time="12:50:00" event="Analista SOC asignado para revisión manual." />
                    </div>
                  </div>

                  {/* SOC Buttons */}
                  <div className="pt-8 space-y-3">
                    <button className="w-full py-4 bg-[#7A0C0C] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#7A0C0C]/30 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                      <ShieldAlert size={14} /> Aislar Host de la Red
                    </button>
                    <div className="grid grid-cols-2 gap-3">
                       <button className="py-3 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest border border-white/5 transition-all">
                         Descartar Falso P.
                       </button>
                       <button className="py-3 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest border border-white/5 transition-all">
                         Enviar a Forense
                       </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/50 border-2 border-dashed border-gray-200 rounded-[2.5rem] h-[600px] flex flex-col items-center justify-center p-10 text-center text-gray-400">
               <Target size={48} className="mb-4 opacity-10" />
               <h3 className="text-lg font-black tracking-tighter uppercase mb-2">Selección Requerida</h3>
               <p className="text-sm font-medium leading-relaxed">Seleccione un incidente de la lista para ver el análisis de impacto y opciones de respuesta SOC.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TimelineItem = ({ time, event, done = false }: { time: string, event: string, done?: boolean }) => (
  <div className="relative">
    <div className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border-2 border-[#1A1A1A] ${done ? 'bg-[#7A0C0C]' : 'bg-gray-700'}`}></div>
    <div className="flex flex-col">
       <span className="text-[9px] font-mono font-bold text-gray-500">{time}</span>
       <span className={`text-[11px] font-medium leading-tight ${done ? 'text-gray-200' : 'text-gray-500'}`}>{event}</span>
    </div>
  </div>
);

export default Incidents;
