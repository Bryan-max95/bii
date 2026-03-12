"use client";
import React, { useState, useEffect } from 'react';
import { 
  Eye, Search, Filter, Download, Trash2, 
  Terminal, Shield, Zap, User, Network, 
  Settings, Clock, ArrowUpDown, ChevronRight, 
  Activity, Database, AlertCircle, Info, CheckCircle
} from 'lucide-react';
import { MOCK_LOGS, COLORS } from '../constants';
import { LogEntry, LogCategory } from '../../../types';

const Logs: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>(MOCK_LOGS);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<LogCategory | 'ALL'>('ALL');
  const [severityFilter, setSeverityFilter] = useState<string | 'ALL'>('ALL');
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);

  // Filtrado lógico
  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          log.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || log.category === categoryFilter;
    const matchesSeverity = severityFilter === 'ALL' || log.severity === severityFilter;
    return matchesSearch && matchesCategory && matchesSeverity;
  });

  const getSeverityColor = (sev: string) => {
    switch(sev) {
      case 'CRITICAL': return 'bg-red-600 text-white shadow-red-500/20';
      case 'ERROR': return 'bg-orange-500 text-white shadow-orange-500/20';
      case 'WARNING': return 'bg-yellow-500 text-black shadow-yellow-500/10';
      case 'NOTICE': return 'bg-blue-500 text-white shadow-blue-500/20';
      default: return 'bg-gray-200 text-gray-600';
    }
  };

  const getCategoryIcon = (cat: LogCategory) => {
    switch(cat) {
      case 'SCAN': return <Zap size={14} />;
      case 'SECURITY': return <Shield size={14} />;
      case 'NETWORK': return <Network size={14} />;
      case 'USER': return <User size={14} />;
      default: return <Settings size={14} />;
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-700 pb-20">
      {/* Header SOC de Registros */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter flex items-center gap-4">
            <div className="bg-[#1A1A1A] p-3 rounded-2xl shadow-xl shadow-black/10">
              <Terminal className="w-8 h-8 text-[#7A0C0C]" />
            </div>
            Registros del Sistema
          </h1>
          <p className="text-gray-500 font-medium mt-2">Auditoría inmutable de eventos, escaneos y acciones administrativas.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm">
            <Download size={16} /> Exportar CSV
          </button>
          <button 
            onClick={() => setLogs([])}
            className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-400 rounded-2xl text-xs font-black uppercase tracking-widest hover:text-red-600 hover:bg-red-50 transition-all"
          >
            <Trash2 size={16} /> Limpiar Todo
          </button>
        </div>
      </div>

      {/* Control Bar con Filtros Premium */}
      <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar por ID, mensaje, origen o usuario..." 
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#7A0C0C]/10 outline-none font-bold text-gray-800"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
             {(['ALL', 'SYSTEM', 'SECURITY', 'NETWORK', 'USER', 'SCAN'] as const).map(cat => (
               <button 
                 key={cat}
                 onClick={() => setCategoryFilter(cat)}
                 className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${categoryFilter === cat ? 'bg-[#7A0C0C] text-white shadow-lg' : 'bg-gray-50 text-gray-400 hover:text-gray-600'}`}
               >
                 {cat}
               </button>
             ))}
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t border-gray-50">
           <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Severidad:</span>
           <div className="flex items-center gap-2">
             {(['ALL', 'CRITICAL', 'ERROR', 'WARNING', 'NOTICE', 'INFO'] as const).map(sev => (
               <button 
                 key={sev}
                 onClick={() => setSeverityFilter(sev)}
                 className={`px-3 py-1.5 rounded-lg text-[9px] font-black transition-all border ${severityFilter === sev ? 'border-[#7A0C0C] text-[#7A0C0C] bg-[#7A0C0C]/5' : 'border-gray-100 text-gray-400 hover:border-gray-300'}`}
               >
                 {sev}
               </button>
             ))}
           </div>
        </div>
      </div>

      {/* Tabla de Logs */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col lg:flex-row min-h-[600px]">
        <div className="flex-1 overflow-x-auto border-r border-gray-50">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 font-black text-[9px] uppercase tracking-[0.2em] border-b border-gray-100">
                <th className="px-8 py-4">ID / Timestamp</th>
                <th className="px-8 py-4">Categoría</th>
                <th className="px-8 py-4">Severidad</th>
                <th className="px-8 py-4">Evento / Mensaje</th>
                <th className="px-8 py-4">Origen</th>
                <th className="px-8 py-4 text-right">Usuario</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredLogs.map(log => (
                <tr 
                  key={log.id} 
                  onClick={() => setSelectedLog(log)}
                  className={`group cursor-pointer transition-all ${selectedLog?.id === log.id ? 'bg-[#7A0C0C]/5' : 'hover:bg-gray-50/80'}`}
                >
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-black text-gray-800 tracking-tighter mb-0.5">{log.id}</span>
                      <div className="flex items-center gap-1.5 text-gray-400">
                         <Clock size={10} />
                         <span className="text-[9px] font-bold">{log.timestamp}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase">
                      {getCategoryIcon(log.category)}
                      {log.category}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm ${getSeverityColor(log.severity)}`}>
                      {log.severity}
                    </span>
                  </td>
                  <td className="px-8 py-5 max-w-md">
                    <p className="text-xs font-bold text-gray-700 truncate group-hover:text-[#7A0C0C] transition-colors">{log.message}</p>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-[10px] font-mono font-bold text-gray-400 px-2 py-1 bg-gray-50 rounded-lg">{log.origin}</span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[8px] font-black text-gray-400">
                         {log.user.substring(0,2).toUpperCase()}
                       </div>
                       <span className="text-xs font-black text-gray-800">{log.user}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredLogs.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center text-gray-300">
              <Eye size={64} strokeWidth={1} className="mb-4 opacity-10" />
              <p className="font-bold text-xl uppercase tracking-tighter opacity-20">No se encontraron registros</p>
            </div>
          )}
        </div>

        {/* Sidebar de Detalle de Log */}
        {selectedLog && (
          <div className="w-full lg:w-96 bg-gray-50/50 p-8 flex flex-col animate-in slide-in-from-right-10 duration-500">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-xl font-black text-gray-900 tracking-tighter">Detalle Forense</h3>
               <button onClick={() => setSelectedLog(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">×</button>
            </div>

            <div className="space-y-6">
               <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
                  <div className={`absolute top-0 right-0 w-2 h-full ${getSeverityColor(selectedLog.severity)} opacity-20`}></div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-xl ${getSeverityColor(selectedLog.severity)} shadow-lg`}>
                       {getCategoryIcon(selectedLog.category)}
                    </div>
                    <div>
                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{selectedLog.category} EVENT</span>
                       <h4 className="font-black text-gray-900 leading-none">{selectedLog.id}</h4>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-700 leading-relaxed mb-6 italic">"{selectedLog.message}"</p>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                       <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Timestamp</span>
                       <span className="text-xs font-bold text-gray-800">{selectedLog.timestamp}</span>
                     </div>
                     <div>
                       <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Severity</span>
                       <span className="text-xs font-bold text-gray-800">{selectedLog.severity}</span>
                     </div>
                  </div>
               </div>

               <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Metadatos Extendidos</h4>
                  <div className="space-y-2">
                     <MetadataRow label="IP / Origin" value={selectedLog.origin} icon={Activity} />
                     <MetadataRow label="Active User" value={selectedLog.user} icon={User} />
                     <MetadataRow label="DB ID" value={`ref_0x${Math.floor(Math.random()*10000)}`} icon={Database} />
                     <MetadataRow label="Session Token" value={`tk_${Math.random().toString(36).substring(7)}`} icon={Lock} />
                  </div>
               </div>

               <div className="mt-auto pt-8 flex gap-2">
                 <button className="flex-1 py-3 bg-[#7A0C0C] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#7A0C0C]/20">Ver Contexto</button>
                 <button className="px-5 py-3 bg-white border border-gray-200 text-gray-400 rounded-2xl hover:text-red-600 transition-all"><Trash2 size={16} /></button>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Subcomponente interno para filas de metadatos
const MetadataRow = ({ label, value, icon: Icon }: any) => (
  <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
    <div className="flex items-center gap-3">
       <div className="p-2 bg-gray-50 rounded-lg text-gray-400"><Icon size={12} /></div>
       <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
    </div>
    <span className="text-[11px] font-mono font-bold text-gray-800">{value}</span>
  </div>
);

export default Logs;
