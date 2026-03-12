"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Monitor, Search, Plus, Shield, 
  ShieldAlert, ShieldCheck, Zap, Activity,
  Cpu, HardDrive, ChevronRight,
  RefreshCw, Terminal, Power,
  Layers, Lock, CheckCircle2,
  X, Play, Code2, 
  Move, AlertCircle, Save, Download,
  MoreVertical, Command, ArrowRightLeft, Trash2
} from 'lucide-react';
import { authService } from '../api/authService';
import { Device, DeviceStatus } from '../../../types';

const PCDevices: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPC, setSelectedPC] = useState<Device | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [groups, setGroups] = useState(['Administración', 'IT INFRASTRUCTURE', 'Ventas', 'Recursos Humanos', 'SEGURIDAD FÍSICA', 'DATACENTER CORE']);
  const [localDevices, setLocalDevices] = useState<Device[]>([]);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [scriptType, setScriptType] = useState<'python' | 'shell' | 'cmd'>('python');
  const [scriptInput, setScriptInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Sincronización inicial
  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    setIsLoading(true);
    try {
      const data = await authService.getDevices();
      if (Array.isArray(data)) {
        setLocalDevices(data);
      }
    } catch (err) {
      console.error('Error fetching devices:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPCs = useMemo(() => 
    localDevices.filter(pc => 
      pc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      pc.ip.includes(searchTerm)
    ), [localDevices, searchTerm]);

  const handleSync = () => {
    setIsSyncing(true);
    fetchDevices();
    setTimeout(() => setIsSyncing(false), 2000);
  };

  // Manejo seguro de IDs para eliminar dispositivo
  const deleteDevice = async (id: string | number) => {
    if (confirm('¿Estás seguro de que deseas eliminar este dispositivo? Esta acción no se puede deshacer.')) {
      try {
        // Convertir a número de forma segura
        const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
        
        // Validar que sea un número válido
        if (isNaN(numericId)) {
          console.error('ID inválido:', id);
          return;
        }

        await authService.deleteDevice(numericId);
        setLocalDevices(prev => prev.filter(d => Number(d.id) !== numericId));
        if (selectedPC && Number(selectedPC.id) === numericId) {
          setSelectedPC(null);
        }
      } catch (err) {
        console.error('Error deleting device:', err);
      }
    }
  };

  // Manejo seguro de IDs para mover dispositivo
  const moveDevice = (deviceId: string | number, newDept: string) => {
    setLocalDevices(prev => prev.map(d => 
      String(d.id) === String(deviceId) ? { ...d, department: newDept } : d
    ));
    if (selectedPC && String(selectedPC.id) === String(deviceId)) {
        setSelectedPC(prev => prev ? { ...prev, department: newDept } : null);
    }
  };

  const shutdownPC = (pc: Device) => {
    if (confirm(`CRITICAL SOC COMMAND: ¿Enviar señal de apagado forzado a ${pc.name} (${pc.ip})?`)) {
      setLocalDevices(prev => prev.map(d => 
        d.id === pc.id ? { ...d, status: DeviceStatus.OFFLINE } : d
      ));
      setSelectedPC(null);
    }
  };

  const executeScript = () => {
    if (!scriptInput.trim()) return;
    const timestamp = new Date().toLocaleTimeString();
    setConsoleOutput(prev => [...prev, `[${timestamp}] bwp@admin: executing ${scriptType}...`, `[LOG] Sending payload to agent ${selectedPC?.ip}`]);
    
    setTimeout(() => {
      setConsoleOutput(prev => [...prev, `[${new Date().toLocaleTimeString()}] > Execution finished (Return Code: 0)`, `[OUTPUT] Action applied successfully.`]);
      setScriptInput('');
    }, 1200);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-24">
      {/* Header SOC de Equipos */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter flex items-center gap-5">
            <div className="bg-[#1A1A1A] p-4 rounded-[2.5rem] shadow-2xl shadow-black/20 text-[#7A0C0C]">
              <Monitor className="w-10 h-10" />
            </div>
            Endpoints PC
          </h1>
          <p className="text-gray-500 font-bold mt-2 uppercase tracking-[0.25em] text-[10px]">Gestión Masiva de Agentes y Control Remoto</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleSync}
            className="flex items-center gap-3 px-8 py-5 bg-white border border-gray-100 text-gray-700 rounded-[2rem] text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm"
          >
            <RefreshCw className={isSyncing ? 'animate-spin' : ''} size={18} /> Sincronizar
          </button>
          <button className="flex items-center gap-3 px-10 py-5 bg-[#7A0C0C] text-white rounded-[2rem] text-xs font-black uppercase tracking-widest hover:bg-[#8B1E1E] transition-all shadow-2xl shadow-[#7A0C0C]/30 group">
            <Download size={18} className="group-hover:translate-y-1 transition-transform" /> Descargar Agente
          </button>
        </div>
      </div>

      {/* Barra de Filtros SOC */}
      <div className="bg-white p-6 rounded-[3rem] border border-gray-100 shadow-sm flex flex-wrap items-center gap-8">
        <div className="relative flex-1 min-w-[350px]">
          <Search className="w-6 h-6 absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" />
          <input 
            type="text" 
            placeholder="Buscar por alias de equipo, dirección IP o departamento..." 
            className="w-full pl-16 pr-6 py-4 bg-gray-50 border-none rounded-[2rem] focus:ring-2 focus:ring-[#7A0C0C]/10 outline-none font-bold text-gray-800 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4">
           <button className="p-4 bg-gray-900 text-white rounded-2xl hover:scale-105 transition-all shadow-lg">
              <Layers size={20} />
           </button>
        </div>
      </div>

      {/* Grupos de Trabajo */}
      <div className="space-y-20">
        {groups.map(group => {
          const groupPCs = filteredPCs.filter(pc => pc.department === group);
          if (groupPCs.length === 0 && searchTerm) return null;

          return (
            <div key={group} className="space-y-8">
              <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                <div className="flex items-center gap-6">
                  <div className="w-3 h-10 bg-[#7A0C0C] rounded-full shadow-lg shadow-[#7A0C0C]/20"></div>
                  <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tighter leading-none">{group}</h2>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-2">{groupPCs.length} Agentes en Línea</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   <button className="text-[9px] font-black uppercase text-[#7A0C0C] bg-[#7A0C0C]/5 px-4 py-2 rounded-xl">Configurar Políticas GPO</button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {groupPCs.map(pc => (
                  <PCCard 
                    key={pc.id} 
                    pc={pc} 
                    onDetails={() => setSelectedPC(pc)} 
                    groups={groups}
                    onMove={(g) => moveDevice(pc.id, g)}
                    onDelete={deleteDevice}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* SOC Command Center - Diálogo Central */}
      {selectedPC && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="bg-white rounded-[4rem] w-full max-w-6xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden relative border border-white/20">
              
              {/* Top Control Bar */}
              <div className="p-10 bg-white border-b border-gray-100 flex items-center justify-between">
                 <div className="flex items-center gap-8">
                    <div className={`p-8 rounded-[3rem] text-white shadow-2xl ${selectedPC.status === DeviceStatus.CRITICAL ? 'bg-[#7A0C0C]' : 'bg-gray-900'}`}>
                       <Monitor size={44} />
                    </div>
                    <div>
                       <div className="flex items-center gap-4">
                          <h2 className="text-5xl font-black text-gray-900 tracking-tighter">{selectedPC.name}</h2>
                          <span className={`px-6 py-2 rounded-full text-[11px] font-black uppercase tracking-widest ${selectedPC.status === DeviceStatus.ONLINE ? 'bg-green-100 text-green-700' : 'bg-red-100 text-[#7A0C0C]'}`}>{selectedPC.status}</span>
                       </div>
                       <div className="flex items-center gap-6 mt-3">
                          <div className="flex items-center gap-2">
                             <Command size={14} className="text-gray-300" />
                             <span className="text-xs font-mono font-bold text-[#7A0C0C]">{selectedPC.ip}</span>
                          </div>
                          <div className="flex items-center gap-2">
                             <Shield size={14} className="text-gray-300" />
                             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{selectedPC.os}</span>
                          </div>
                          <div className="h-6 w-px bg-gray-100"></div>
                          <div className="flex items-center gap-3">
                             <span className="text-[10px] font-black text-gray-400 uppercase">Grupo:</span>
                             <div className="relative group/sel">
                                <select 
                                  className="bg-gray-50 hover:bg-gray-100 px-4 py-2 border-none rounded-xl text-[10px] font-black uppercase text-[#7A0C0C] outline-none cursor-pointer transition-all"
                                  value={selectedPC.department}
                                  onChange={(e) => moveDevice(selectedPC.id, e.target.value)}
                                >
                                   {groups.map(g => <option key={g} value={g}>{g}</option>)}
                                </select>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
                 <button onClick={() => setSelectedPC(null)} className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all group">
                    <X size={32} className="group-hover:rotate-90 transition-transform" />
                 </button>
              </div>

              {/* Main Workspace Area */}
              <div className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar bg-[#FDFCFB]">
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    
                    {/* Panel Izquierdo: Telemetría y Salud */}
                    <div className="space-y-10">
                       <section>
                          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                             <Activity size={16} className="text-[#7A0C0C]" /> Hardware Telemetry (Realtime)
                          </h3>
                          <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm flex items-center justify-around">
                             <ResourceMeter label="CPU LOAD" value={selectedPC.cpu} color="#7A0C0C" />
                             <ResourceMeter label="RAM USAGE" value={selectedPC.ram} color="#3B82F6" />
                             <ResourceMeter label="IO DISK" value={selectedPC.disk} color="#1A1A1A" />
                          </div>
                       </section>

                       <section className="bg-[#1A1A1A] p-10 rounded-[3.5rem] text-white space-y-8 relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-[#7A0C0C] blur-[60px] opacity-20"></div>
                          <h3 className="text-[10px] font-black text-[#7A0C0C] uppercase tracking-[0.3em] relative z-10">Security Engine Status</h3>
                          <div className="grid grid-cols-2 gap-4 relative z-10">
                             <ProtectionFeature name="Anti-Ransomware" active={selectedPC.policies.includes('p3')} />
                             <ProtectionFeature name="USB Shield" active={selectedPC.policies.includes('p1')} />
                             <ProtectionFeature name="IPS Active" active={selectedPC.policies.includes('p2')} />
                             <ProtectionFeature name="Self-Defense" active={selectedPC.policies.includes('p55')} />
                          </div>
                          <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all relative z-10">Force Policy Refresh (GPO Sync)</button>
                       </section>
                    </div>

                    {/* Panel Derecho: BWP Shell Master Console */}
                    <div className="space-y-8">
                       <div className="flex items-center justify-between">
                          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-3">
                             <Terminal size={16} className="text-[#7A0C0C]" /> BWP Shell Master Console
                          </h3>
                          <div className="flex bg-gray-100 p-1.5 rounded-[1.2rem]">
                             {(['python', 'shell', 'cmd'] as const).map(type => (
                               <button 
                                 key={type}
                                 onClick={() => setScriptType(type)}
                                 className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${scriptType === type ? 'bg-[#7A0C0C] text-white shadow-xl' : 'text-gray-400 hover:text-gray-600'}`}
                               >
                                 {type}
                               </button>
                             ))}
                          </div>
                       </div>
                       
                       <div className="bg-[#0A0A0A] rounded-[3rem] overflow-hidden shadow-2xl flex flex-col border-4 border-gray-900 h-[450px]">
                          {/* Output Area */}
                          <div className="flex-1 p-8 font-mono text-[11px] text-green-400/90 overflow-y-auto space-y-2 custom-scrollbar bg-black/50">
                             {consoleOutput.length === 0 && (
                               <div className="text-gray-600 flex flex-col items-center justify-center h-full space-y-4 opacity-50">
                                  <Terminal size={40} strokeWidth={1} />
                                  <p className="font-bold text-[10px] uppercase tracking-widest text-center">Consola lista para comandos remotos<br/>Puerto SOC-Encrypted Activo</p>
                               </div>
                             )}
                             {consoleOutput.map((log, i) => (
                               <div key={i} className="flex gap-4">
                                  <span className="text-[#7A0C0C] font-black select-none opacity-50">#</span>
                                  <span className="leading-relaxed">{log}</span>
                                </div>
                             ))}
                          </div>
                          
                          {/* Command Input Area */}
                          <div className="p-6 bg-white/5 border-t border-white/5 flex items-center gap-4">
                             <div className="p-3 bg-[#7A0C0C] text-white rounded-xl shadow-lg">
                                <Zap size={16} />
                             </div>
                             <input 
                               autoFocus
                               className="flex-1 bg-transparent border-none outline-none font-mono text-sm text-white placeholder-gray-700"
                               placeholder={`Escriba el script de ${scriptType.toUpperCase()} para ejecutar como Admin...`}
                               value={scriptInput}
                               onChange={(e) => setScriptInput(e.target.value)}
                               onKeyDown={(e) => e.key === 'Enter' && executeScript()}
                             />
                             <button 
                               onClick={executeScript}
                               className="px-6 py-3 bg-[#7A0C0C] text-white rounded-xl hover:scale-105 transition-all shadow-xl shadow-[#7A0C0C]/40 flex items-center gap-2 font-black text-[10px] uppercase tracking-widest"
                             >
                                <Play size={12} /> Ejecutar
                             </button>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Action Bar Final SOC */}
              <div className="p-10 bg-white border-t border-gray-100 grid grid-cols-3 gap-8">
                 <button className="flex items-center justify-center gap-4 py-6 bg-gray-900 text-white rounded-[2rem] text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl">
                    <Code2 size={20} className="text-[#7A0C0C]" /> Inyectar Política BWP
                 </button>
                 <button 
                   onClick={() => shutdownPC(selectedPC)}
                   className="flex items-center justify-center gap-4 py-6 bg-[#7A0C0C] text-white rounded-[2rem] text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-[#7A0C0C]/30 hover:-translate-y-2 transition-all active:scale-95"
                 >
                    <Power size={20} /> Apagar Nodo (Remote Force)
                 </button>
                 <button 
                   onClick={() => setSelectedPC(null)}
                   className="flex items-center justify-center gap-4 py-6 bg-white border-2 border-gray-100 text-gray-400 rounded-[2rem] text-[11px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm"
                 >
                    Cerrar Auditoría
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

// PCCard con tipos correctos
const PCCard: React.FC<{ 
  pc: Device, 
  onDetails: () => void, 
  groups: string[], 
  onMove: (g: string) => void, 
  onDelete: (id: string | number) => void 
}> = ({ pc, onDetails, groups, onMove, onDelete }) => {
  return (
    <div className={`bg-white rounded-[3.5rem] p-10 border-2 transition-all duration-500 relative overflow-hidden group hover:shadow-2xl hover:-translate-y-3 cursor-pointer ${pc.status === DeviceStatus.CRITICAL ? 'border-[#7A0C0C] shadow-xl shadow-[#7A0C0C]/10' : 'border-transparent shadow-sm hover:border-gray-200'}`}>
      
      {/* Visual background dynamics */}
      <div className={`absolute top-0 right-0 w-40 h-40 blur-[80px] opacity-10 transition-opacity group-hover:opacity-20 ${pc.status === DeviceStatus.CRITICAL ? 'bg-red-500' : 'bg-green-500'}`}></div>

      <div className="flex items-start justify-between mb-10 relative z-10">
         <div 
           onClick={onDetails}
           className={`p-6 rounded-[2.5rem] shadow-2xl transition-transform group-hover:scale-110 group-hover:rotate-6 ${
           pc.status === DeviceStatus.CRITICAL ? 'bg-[#7A0C0C] text-white' : 
           pc.status === DeviceStatus.ONLINE ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-400'
         }`}>
            <Monitor size={36} />
         </div>
         <div className="flex flex-col items-end gap-3">
            <div className="flex items-center gap-2">
              <button 
                onClick={(e) => { e.stopPropagation(); onDelete(pc.id); }}
                className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all"
                title="Eliminar Dispositivo"
              >
                <Trash2 size={14} />
              </button>
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
                pc.status === DeviceStatus.ONLINE ? 'bg-green-50 text-green-600' : 
                pc.status === DeviceStatus.CRITICAL ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-orange-50 text-orange-600'
              }`}>{pc.status}</span>
            </div>
            <div className="flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
               <span className="text-[10px] font-mono font-bold text-gray-400">{pc.ip}</span>
            </div>
         </div>
      </div>

      <div className="relative z-10" onClick={onDetails}>
         <h3 className="text-2xl font-black text-gray-900 tracking-tighter mb-2 group-hover:text-[#7A0C0C] transition-colors leading-none">{pc.name}</h3>
         <div className="flex items-center gap-2 mb-10">
            <ShieldCheck size={12} className={pc.protectionActive ? 'text-green-500' : 'text-gray-300'} />
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.1em]">{pc.os}</span>
         </div>

         {/* Mini Telemetry Bars */}
         <div className="flex gap-3 mb-10">
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden" title={`CPU: ${pc.cpu}%`}>
               <div className="h-full bg-[#7A0C0C] transition-all duration-1000" style={{ width: `${pc.cpu}%` }}></div>
            </div>
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden" title={`RAM: ${pc.ram}%`}>
               <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${pc.ram}%` }}></div>
            </div>
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden" title={`DISK: ${pc.disk}%`}>
               <div className="h-full bg-gray-900 transition-all duration-1000" style={{ width: `${pc.disk}%` }}></div>
            </div>
         </div>
      </div>

      {/* Footer SOC - Mover de Grupo */}
      <div className="pt-8 border-t border-gray-50 flex items-center justify-between relative z-10">
         <div className="flex items-center gap-2 group/move">
            <ArrowRightLeft size={14} className="text-gray-300 group-hover/move:text-[#7A0C0C] transition-colors" />
            <select 
              className="bg-transparent border-none outline-none cursor-pointer text-[10px] font-black uppercase text-gray-400 hover:text-gray-800 transition-all appearance-none"
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => onMove(e.target.value)}
              value={pc.department}
            >
               {groups.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
         </div>
         <button onClick={onDetails} className="flex items-center gap-2 text-[10px] font-black text-[#7A0C0C] uppercase tracking-widest hover:underline">
           Consola <ChevronRight size={14} />
         </button>
      </div>
    </div>
  );
};

const ProtectionFeature = ({ name, active }: { name: string, active: boolean }) => (
  <div className="flex items-center justify-between p-5 bg-white/5 border border-white/5 rounded-3xl group hover:bg-white/10 transition-all">
     <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${active ? 'bg-green-500 shadow-lg shadow-green-500/40' : 'bg-gray-700'}`}></div>
        <span className="text-[11px] font-bold text-gray-300 group-hover:text-white transition-colors">{name}</span>
     </div>
     <span className={`text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-widest ${active ? 'bg-green-500/10 text-green-500' : 'bg-white/5 text-gray-600'}`}>
        {active ? 'SECURED' : 'OFF'}
     </span>
  </div>
);

const ResourceMeter = ({ label, value, color }: { label: string, value: number, color: string }) => (
  <div className="flex flex-col items-center gap-4">
     <div className="w-24 h-24 rounded-full border-8 border-gray-50 flex items-center justify-center relative overflow-hidden group">
        <div className="absolute bottom-0 w-full bg-gray-50/50" style={{ height: `${100-value}%` }}></div>
        <div className="absolute bottom-0 w-full opacity-30 group-hover:opacity-50 transition-opacity" style={{ height: `${value}%`, backgroundColor: color }}></div>
        <span className="text-xl font-black relative z-10" style={{ color }}>{value}%</span>
     </div>
     <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">{label}</span>
  </div>
);

export default PCDevices;