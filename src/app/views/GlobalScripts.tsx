"use client";
import React, { useState, useMemo } from 'react';
import { 
  Code2, Terminal, Play, Search, Filter, 
  CheckSquare, Square, Users, Monitor, 
  Server, Zap, ChevronRight, X, Trash2,
  Cpu, Activity, Database, Shield, Save,
  Send, Loader2, AlertCircle, RefreshCw
} from 'lucide-react';
import { MOCK_DEVICES } from '../constants';
import { Device, DeviceStatus } from '../../../types';

const GlobalScripts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [scriptType, setScriptType] = useState<'PYTHON' | 'POWERSHELL' | 'BASH'>('PYTHON');
  const [scriptContent, setScriptContent] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [execProgress, setExecProgress] = useState(0);
  const [execLogs, setExecLogs] = useState<string[]>([]);
  const [showConsole, setShowConsole] = useState(false);

  // Lógica de filtrado de equipos (PC + Servidores)
  // Added explicit Device[] type to useMemo to ensure type safety for allTargets
  const allTargets = useMemo<Device[]>(() => MOCK_DEVICES, []);
  // Added explicit Device type to filter callback to ensure d is recognized as a Device
  const filteredTargets = allTargets.filter((d: Device) => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.ip.includes(searchTerm) ||
    d.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Added explicit type string[] to departments to ensure correct inference from Set
  // Fix: Added explicit type string[] to departments
  const departments: string[] = Array.from(new Set(allTargets.map((d: Device) => d.department)));

  const toggleSelect = (id: string) => {
    // Added explicit string[] type to prev in state updater to fix potential unknown type inference
    setSelectedIds((prev: string[]) => prev.includes(id) ? prev.filter((i: string) => i !== id) : [...prev, id]);
  };

  const selectGroup = (dept: string) => {
    // groupIds is string[] because d.id is string
    const groupIds = allTargets.filter((d: Device) => d.department === dept).map((d: Device) => d.id);
    // Added explicit string[] type to prev in state updater
    setSelectedIds((prev: string[]) => {
        const others = prev.filter((id: string) => !groupIds.includes(id));
        return [...others, ...groupIds];
    });
  };

  const handleExecute = () => {
    if (selectedIds.length === 0 || !scriptContent.trim()) return;
    
    setShowConsole(true);
    setIsExecuting(true);
    setExecProgress(0);
    setExecLogs(["[SYSTEM] SOC Remote Orchestrator v2.5 Initialized...", "[SYSTEM] Packaging payload for encrypted delivery..."]);

    const steps = [
        `[AUTH] Authenticating with ${selectedIds.length} nodes...`,
        `[PAYLOAD] Sending script to ${selectedIds.length} remote agents...`,
        `[RUN] Executing on Target IDs: ${selectedIds.slice(0, 3).join(', ')}${selectedIds.length > 3 ? '...' : ''}`,
        `[SYNC] Collecting STDOUT from endpoints...`,
        `[SUCCESS] Remote execution finished on ${selectedIds.length} assets.`
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
        if (currentStep < steps.length) {
            setExecLogs(prev => [...prev, steps[currentStep]]);
            setExecProgress(Math.min(((currentStep + 1) / steps.length) * 100, 100));
            currentStep++;
        } else {
            clearInterval(interval);
            setIsExecuting(false);
        }
    }, 1000);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-24">
      {/* Header SOC Scripts */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter flex items-center gap-5">
            <div className="bg-[#1A1A1A] p-4 rounded-[2.5rem] shadow-2xl shadow-black/20 text-[#7A0C0C]">
              <Code2 className="w-10 h-10" />
            </div>
            Orquestación Global
          </h1>
          <p className="text-gray-500 font-bold mt-2 uppercase tracking-[0.3em] text-[10px]">Gestión Remota Masiva • SOC Command Level 5</p>
        </div>
        <div className="flex bg-white px-8 py-4 rounded-[2rem] border border-gray-100 shadow-sm items-center gap-6">
           <div className="text-right border-r border-gray-100 pr-6">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Nodos Seleccionados</p>
              <p className="text-2xl font-black text-[#7A0C0C]">{selectedIds.length}</p>
           </div>
           <button onClick={() => setSelectedIds([])} className="text-gray-400 hover:text-red-600 transition-colors">
              <Trash2 size={20} />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* PANEL IZQUIERDO: SELECTOR DE ACTIVOS (4 cols) */}
        <div className="lg:col-span-4 space-y-6 flex flex-col h-[750px]">
           <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col flex-1 overflow-hidden">
              <div className="mb-8">
                 <h2 className="text-xl font-black text-gray-900 tracking-tighter mb-4 flex items-center gap-2">
                   <Users className="text-[#7A0C0C]" size={20} /> Selector de Objetivos
                 </h2>
                 <div className="relative">
                    <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                       className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-[#7A0C0C]/10 outline-none"
                       placeholder="Buscar por nombre o IP..."
                       value={searchTerm}
                       onChange={(e) => setSearchTerm(e.target.value)}
                    />
                 </div>
              </div>

              {/* Grupos Rápidos */}
              <div className="mb-6 space-y-2">
                 <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Selección por Grupo</span>
                 <div className="flex flex-wrap gap-2">
                    {/* Added explicit string type to dept in map callback to fix inference issue on line 131 */}
                    {/* Fix: Added explicit type string to dept */}
                    {departments.map((dept: string) => (
                       <button 
                         key={dept} 
                         onClick={() => selectGroup(dept)}
                         className="px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-xl text-[9px] font-black uppercase text-gray-500 hover:border-[#7A0C0C] hover:text-[#7A0C0C] transition-all"
                       >
                          {dept}
                       </button>
                    ))}
                 </div>
              </div>

              {/* Lista de Equipos Scrolleable */}
              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-2">
                 {/* Added explicit Device type to target in map callback to fix unknown type error on line 125 */}
                 {filteredTargets.map((target: Device) => (
                    <div 
                       key={target.id}
                       onClick={() => toggleSelect(target.id)}
                       className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer group ${
                         selectedIds.includes(target.id) ? 'border-[#7A0C0C] bg-[#7A0C0C]/5 shadow-md' : 'border-gray-50 hover:border-gray-200 bg-white'
                       }`}
                    >
                       <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-xl ${selectedIds.includes(target.id) ? 'bg-[#7A0C0C] text-white' : 'bg-gray-100 text-gray-400 group-hover:text-gray-600'}`}>
                             {target.type === 'Server' ? <Server size={14} /> : <Monitor size={14} />}
                          </div>
                          <div>
                             <p className="text-[11px] font-black text-gray-800 leading-none mb-1">{target.name}</p>
                             <p className="text-[9px] font-mono font-bold text-gray-400">{target.ip}</p>
                          </div>
                       </div>
                       {selectedIds.includes(target.id) ? <CheckSquare size={16} className="text-[#7A0C0C]" /> : <Square size={16} className="text-gray-200" />}
                    </div>
                 ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                 <button 
                  onClick={() => setSelectedIds(allTargets.map((t: Device) => t.id))}
                  className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-[#7A0C0C] bg-[#7A0C0C]/5 rounded-2xl hover:bg-[#7A0C0C]/10 transition-all"
                 >
                    Seleccionar Todo el Inventario
                 </button>
              </div>
           </div>
        </div>

        {/* PANEL DERECHO: EDITOR DE SCRIPTS (8 cols) */}
        <div className="lg:col-span-8 flex flex-col h-[750px]">
           <div className="bg-[#1A1A1A] rounded-[3.5rem] flex flex-col flex-1 overflow-hidden shadow-2xl relative border border-white/5">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#7A0C0C] blur-[120px] opacity-10 pointer-events-none"></div>
              
              {/* Toolbar del Editor */}
              <div className="p-8 border-b border-white/5 flex items-center justify-between relative z-10">
                 <div className="flex items-center gap-6">
                    <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/5">
                       {(['PYTHON', 'POWERSHELL', 'BASH'] as const).map(lang => (
                         <button 
                           key={lang}
                           onClick={() => setScriptType(lang)}
                           className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${scriptType === lang ? 'bg-[#7A0C0C] text-white shadow-xl' : 'text-gray-500 hover:text-white'}`}
                         >
                            {lang}
                         </button>
                       ))}
                    </div>
                 </div>
                 <div className="flex items-center gap-4">
                    <button className="p-3 bg-white/5 text-gray-500 rounded-xl hover:text-white transition-all"><Save size={18} /></button>
                    <button className="p-3 bg-white/5 text-gray-500 rounded-xl hover:text-white transition-all"><RefreshCw size={18} /></button>
                 </div>
              </div>

              {/* Área del Editor */}
              <div className="flex-1 p-8 font-mono text-[13px] bg-black/40 relative">
                 <textarea 
                    className="w-full h-full bg-transparent text-gray-300 resize-none outline-none border-none placeholder-gray-800"
                    spellCheck={false}
                    placeholder={`# Escriba su payload de ${scriptType} aquí...\n# El sistema inyectará automáticamente las credenciales del agente BWP.`}
                    value={scriptContent}
                    onChange={(e) => setScriptContent(e.target.value)}
                 />
                 <div className="absolute bottom-8 right-8 pointer-events-none opacity-10">
                    <Terminal size={120} />
                 </div>
              </div>

              {/* Control de Lanzamiento */}
              <div className="p-10 bg-[#0A0A0A] border-t border-white/5 flex items-center justify-between relative z-10">
                 <div className="flex items-center gap-6">
                    <div className="flex flex-col">
                       <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Nodos Objetivo</span>
                       <span className="text-xl font-black text-white">{selectedIds.length} Assets</span>
                    </div>
                    <div className="w-px h-8 bg-white/10"></div>
                    <div className="flex flex-col">
                       <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Seguridad de Salida</span>
                       <span className="text-xs font-bold text-green-500 uppercase">Payload Encrypt Active</span>
                    </div>
                 </div>
                 <button 
                   onClick={handleExecute}
                   disabled={selectedIds.length === 0 || !scriptContent.trim() || isExecuting}
                   className={`px-12 py-6 bg-[#7A0C0C] text-white rounded-[2.5rem] font-black uppercase text-xs tracking-[0.3em] shadow-2xl shadow-red-900/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-4 disabled:opacity-30 disabled:hover:scale-100`}
                 >
                    {isExecuting ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                    {isExecuting ? 'EJECUTANDO EN MASA...' : 'LANZAR PAYLOAD GLOBAL'}
                 </button>
              </div>
           </div>
        </div>
      </div>

      {/* CONSOLA DE EJECUCIÓN (MODAL ESTILO SOC) */}
      {showConsole && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-8 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-[#0A0A0A] rounded-[5rem] w-full max-w-5xl h-[80vh] shadow-2xl flex flex-col overflow-hidden relative border border-white/5">
              <div className="p-12 border-b border-white/5 flex items-center justify-between">
                 <div className="flex items-center gap-10">
                    <div className="relative">
                       <div className={`w-24 h-24 bg-[#7A0C0C]/20 rounded-full absolute ${isExecuting ? 'animate-ping' : ''}`}></div>
                       <div className="p-6 bg-[#7A0C0C] rounded-[2.5rem] text-white relative z-10 shadow-2xl">
                          {isExecuting ? <Activity size={32} className="animate-pulse" /> : <Terminal size={32} />}
                       </div>
                    </div>
                    <div>
                       <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none">Mass Remote Stream</h2>
                       <div className="flex items-center gap-6 mt-4">
                          <span className="text-[10px] font-black text-[#7A0C0C] uppercase tracking-[0.3em]">{isExecuting ? 'Transmitting...' : 'Stream Finished'}</span>
                          <div className="w-64 h-1.5 bg-white/5 rounded-full overflow-hidden">
                             <div className="h-full bg-[#7A0C0C] transition-all duration-500" style={{ width: `${execProgress}%` }}></div>
                          </div>
                          <span className="text-xs font-mono text-gray-500">{Math.round(execProgress)}%</span>
                       </div>
                    </div>
                 </div>
                 {!isExecuting && (
                    <button onClick={() => setShowConsole(false)} className="w-20 h-20 rounded-[2.5rem] bg-white/5 text-gray-500 flex items-center justify-center hover:text-white transition-all">
                       <X size={40} />
                    </button>
                 )}
              </div>

              <div className="flex-1 p-12 overflow-y-auto custom-scrollbar font-mono text-[12px] bg-black/60 relative">
                 <div className="space-y-4">
                    {execLogs.map((log, i) => (
                       <div key={i} className="flex gap-10 p-4 rounded-2xl hover:bg-white/5 transition-all group border-l-2 border-transparent hover:border-[#7A0C0C]">
                          <span className="text-gray-700 shrink-0 font-bold opacity-40 group-hover:opacity-100 transition-opacity">[{new Date().toLocaleTimeString()}]</span>
                          <span className={`${log.includes('SUCCESS') ? 'text-green-500' : log.includes('SYSTEM') ? 'text-blue-400' : 'text-gray-300'}`}>
                             {log}
                          </span>
                       </div>
                    ))}
                    {isExecuting && (
                       <div className="pt-10 flex flex-col items-center justify-center opacity-40 animate-pulse space-y-4">
                          <Terminal size={40} className="text-gray-600" />
                          <p className="text-[11px] font-black uppercase tracking-[0.5em] text-gray-500">Escuchando flujo binario SOC...</p>
                       </div>
                    )}
                 </div>
              </div>

              <div className="p-12 border-t border-white/5 flex justify-between items-center bg-black">
                 <div className="flex gap-6">
                    <button className="flex items-center gap-3 px-10 py-5 bg-white/5 border border-white/10 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                       Descargar Log de Salida
                    </button>
                 </div>
                 { !isExecuting && (
                    <div className="flex items-center gap-3 text-green-500">
                       <Shield size={20} />
                       <span className="text-xs font-black uppercase tracking-widest">Ejecución Firmada y Verificada</span>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default GlobalScripts;
