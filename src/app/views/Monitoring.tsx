"use client";
import React, { useState } from 'react';
import { 
  Search, Database, Monitor, ShieldAlert, Power, 
  Settings, Users, Plus, Shield, Camera,
  Lock, Smartphone, AlertCircle, Clock, Cpu, 
  HardDrive, Activity, Wifi, ChevronDown, CheckCircle, Info,
  ArrowRightLeft, Filter, Tag, LayoutGrid
} from 'lucide-react';
import { MOCK_DEVICES, POLICIES, COLORS } from '../constants';
import { DeviceStatus, Device, Policy, PolicyCategory } from '../../../types';

const Monitoring: React.FC = () => {
  const [tab, setTab] = useState<'Workstations' | 'Servers' | 'Network'>('Workstations');
  const [searchTerm, setSearchTerm] = useState('');
  const [devices, setDevices] = useState<Device[]>(MOCK_DEVICES);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [customDepartments, setCustomDepartments] = useState(['IT', 'Administración', 'Recursos Humanos', 'Logística']);
  const [policyFilter, setPolicyFilter] = useState<string>('');
  const [policyCategory, setPolicyCategory] = useState<PolicyCategory | 'All'>('All');

  const handleShutdown = (id: string, name: string) => {
    if (confirm(`SOC COMMAND: ¿Ejecutar APAGADO FORZADO en ${name}?`)) {
      setDevices(prev => prev.map(d => d.id === id ? { ...d, status: DeviceStatus.OFFLINE, lastOffline: new Date().toLocaleTimeString() } : d));
    }
  };

  const handleMoveDevice = (id: string, newDept: string) => {
    setDevices(prev => prev.map(d => d.id === id ? { ...d, department: newDept } : d));
    setShowMoveModal(false);
  };

  const filteredDevices = devices.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) || d.ip.includes(searchTerm);
    if (tab === 'Servers') return matchesSearch && d.type === 'Server';
    if (tab === 'Network') return matchesSearch && (d.type === 'Router' || d.type === 'Camera');
    return matchesSearch && d.type === 'PC';
  });

  const filteredPolicies = POLICIES.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(policyFilter.toLowerCase()) || p.description.toLowerCase().includes(policyFilter.toLowerCase());
    const matchesCat = policyCategory === 'All' || p.category === policyCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-500 pb-20">
      {/* Header SOC */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3 tracking-tighter">
            <LayoutGrid className="w-8 h-8 text-[#7A0C0C]" />
            Equipos Globales BWP
          </h1>
          <p className="text-gray-500 text-sm font-medium">Inventario de activos y gestión de políticas distribuidas.</p>
        </div>
        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-200">
          {(['Workstations', 'Servers', 'Network'] as const).map(t => (
            <button 
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${tab === t ? 'bg-[#7A0C0C] text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-wrap items-center justify-between gap-6">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Filtrar por nombre, OS, etiqueta o IP..." 
            className="pl-12 pr-4 py-3 w-full bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7A0C0C]/10 font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowGroupModal(true)}
            className="flex items-center gap-2 px-5 py-3 bg-gray-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-black transition-all shadow-md"
          >
            <Plus className="w-4 h-4" /> Nuevo Grupo
          </button>
          <button className="flex items-center gap-2 px-5 py-3 bg-[#7A0C0C] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#8B1E1E] transition-all shadow-md">
            <Lock className="w-4 h-4" /> Políticas Globales
          </button>
        </div>
      </div>

      {/* Device View */}
      <div className="space-y-12">
        {customDepartments.map(dept => {
          const deptDevices = filteredDevices.filter(d => d.department === dept);
          return (
            <div key={dept} className="group/dept">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-10 bg-[#7A0C0C] rounded-full group-hover/dept:scale-y-110 transition-transform"></div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tighter leading-none">{dept}</h2>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-2">Active Control Group • {deptDevices.length} Objetos</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black bg-gray-100 px-3 py-1 rounded-full text-gray-500 uppercase">Sincronizado</span>
                  <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400"><Settings size={16} /></button>
                </div>
              </div>

              {deptDevices.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {deptDevices.map(device => (
                    <DeviceCard 
                      key={device.id} 
                      device={device} 
                      onShutdown={handleShutdown} 
                      onPolicies={(d: React.SetStateAction<Device | null>) => { setSelectedDevice(d); setShowPolicyModal(true); }} 
                      onMove={(d: React.SetStateAction<Device | null>) => { setSelectedDevice(d); setShowMoveModal(true); }}
                    />
                  ))}
                </div>
              ) : (
                <div className="h-24 bg-gray-50/50 border-2 border-dashed border-gray-200 rounded-3xl flex items-center justify-center text-gray-300 font-bold text-sm">
                  Espacio de trabajo vacío en {dept}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Move Device Modal */}
      {showMoveModal && selectedDevice && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl p-8 overflow-hidden">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-[#7A0C0C]/10 p-4 rounded-2xl text-[#7A0C0C]"><ArrowRightLeft size={32} /></div>
              <div>
                <h3 className="text-xl font-black text-gray-900 leading-tight">Mover Dispositivo</h3>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Reasignar: {selectedDevice.name}</p>
              </div>
            </div>
            <div className="space-y-3 mb-8">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Seleccionar Nuevo Grupo</label>
              {customDepartments.map(dept => (
                <button 
                  key={dept}
                  onClick={() => handleMoveDevice(selectedDevice.id, dept)}
                  className={`w-full text-left p-4 rounded-2xl font-bold text-sm border-2 transition-all ${selectedDevice.department === dept ? 'border-[#7A0C0C] bg-[#7A0C0C]/5 text-[#7A0C0C]' : 'border-gray-50 hover:border-gray-200'}`}
                >
                  {dept}
                </button>
              ))}
            </div>
            <button onClick={() => setShowMoveModal(false)} className="w-full py-4 text-sm font-black text-gray-500 hover:bg-gray-50 rounded-2xl transition-all">Cancelar Acción</button>
          </div>
        </div>
      )}

      {/* Global Policy Manager Modal (The massive 50+ policy list) */}
      {showPolicyModal && selectedDevice && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 sm:p-8 animate-in fade-in duration-300">
          <div className="bg-[#F7F5F2] rounded-[2.5rem] w-full max-w-6xl h-full max-h-[90vh] shadow-2xl flex flex-col overflow-hidden border border-white/20">
            {/* Modal Header */}
            <div className="p-8 bg-white border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-[#7A0C0C] rounded-3xl flex items-center justify-center shadow-xl shadow-[#7A0C0C]/20 rotate-6"><Shield className="w-8 h-8 text-white" /></div>
                <div>
                  <h2 className="text-3xl font-black text-gray-900 tracking-tighter">BWP Policy Engine</h2>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs font-bold text-[#7A0C0C] uppercase tracking-widest">Configurando {selectedDevice.name}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span className="text-xs font-bold text-gray-400">Target IP: {selectedDevice.ip}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-4">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Buscar políticas..." 
                    className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm w-64 focus:ring-2 focus:ring-[#7A0C0C]/10 outline-none"
                    value={policyFilter}
                    onChange={(e) => setPolicyFilter(e.target.value)}
                  />
                </div>
                <button onClick={() => setShowPolicyModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-all font-bold">×</button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="px-8 py-4 bg-white/50 border-b border-gray-200 flex items-center gap-2 overflow-x-auto no-scrollbar">
              {(['All', 'Seguridad', 'Red', 'Datos', 'Identidad', 'Sistema', 'Cumplimiento'] as const).map(cat => (
                <button 
                  key={cat}
                  onClick={() => setPolicyCategory(cat)}
                  className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${policyCategory === cat ? 'bg-[#7A0C0C] text-white shadow-lg' : 'bg-white border border-gray-200 text-gray-400 hover:border-gray-400'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Massive Policy Grid */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-gray-50/50">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredPolicies.map(p => {
                    const isEnabled = selectedDevice.policies.includes(p.id);
                    return (
                      <div key={p.id} className={`group bg-white p-5 rounded-3xl border-2 transition-all hover:shadow-xl ${isEnabled ? 'border-[#7A0C0C]/30' : 'border-transparent shadow-sm'}`}>
                         <div className="flex items-start justify-between mb-3">
                           <div className={`p-2.5 rounded-2xl ${isEnabled ? 'bg-[#7A0C0C] text-white' : 'bg-gray-100 text-gray-400'}`}>
                              <Shield size={18} />
                           </div>
                           <label className="relative inline-flex items-center cursor-pointer">
                             <input type="checkbox" defaultChecked={isEnabled} className="sr-only peer" />
                             <div className="w-10 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7A0C0C]"></div>
                           </label>
                         </div>
                         <h4 className="font-black text-gray-800 text-sm mb-1 group-hover:text-[#7A0C0C] transition-colors">{p.name}</h4>
                         <p className="text-[11px] text-gray-500 leading-relaxed h-12 overflow-hidden">{p.description}</p>
                         <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{p.category}</span>
                            <Info size={12} className="text-gray-300" />
                         </div>
                      </div>
                    )
                  })}
               </div>
            </div>

            {/* Footer Modal */}
            <div className="p-8 bg-white border-t border-gray-200 flex items-center justify-between">
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Total Políticas Filtradas: {filteredPolicies.length}</p>
               <div className="flex gap-4">
                 <button onClick={() => setShowPolicyModal(false)} className="px-8 py-3 text-sm font-black text-gray-500">Descartar</button>
                 <button onClick={() => setShowPolicyModal(false)} className="px-10 py-3 bg-[#7A0C0C] text-white text-sm font-black rounded-2xl shadow-xl shadow-[#7A0C0C]/20 hover:-translate-y-1 transition-all">Propagar a Agente</button>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Group Create Modal */}
      {showGroupModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in zoom-in-95">
          <div className="bg-white rounded-[2rem] w-full max-w-sm shadow-2xl p-8">
            <h3 className="text-2xl font-black text-gray-900 mb-2">Nuevo Grupo SOC</h3>
            <p className="text-sm text-gray-500 mb-6 font-medium">Define una nueva unidad organizativa en la infraestructura BWP.</p>
            <input 
              autoFocus
              className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-[#7A0C0C] outline-none font-bold text-gray-800 transition-all mb-6"
              placeholder="Nombre del grupo..."
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
            />
            <div className="flex gap-4">
              <button onClick={() => setShowGroupModal(false)} className="flex-1 py-4 text-xs font-black uppercase text-gray-400 tracking-widest">Cancelar</button>
              <button 
                onClick={() => { if(newGroupName) { setCustomDepartments([...customDepartments, newGroupName]); setShowGroupModal(false); setNewGroupName(''); } }} 
                className="flex-1 py-4 bg-[#7A0C0C] text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-[#7A0C0C]/20"
              >
                Crear Ahora
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Subcomponent: Updated Device Card with Move & Policies
// Added React.FC type to handle JSX key attribute correctly
const DeviceCard: React.FC<{ device: Device, onShutdown: any, onPolicies: any, onMove: any }> = ({ device, onShutdown, onPolicies, onMove }) => {
  const isNetwork = device.type === 'Router' || device.type === 'Camera';
  
  return (
    <div className={`
      bg-white rounded-[2rem] border-2 transition-all duration-500 flex flex-col group relative overflow-hidden
      ${device.status === DeviceStatus.CRITICAL 
        ? 'border-[#7A0C0C] shadow-2xl shadow-[#7A0C0C]/10' 
        : 'border-transparent shadow-sm hover:shadow-2xl hover:border-gray-100 hover:-translate-y-2'}
      ${device.status === DeviceStatus.OFFLINE ? 'grayscale opacity-60' : ''}
    `}>
      {/* Decorative Gradient Background */}
      <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl opacity-10 transition-opacity group-hover:opacity-30 ${
        device.status === DeviceStatus.CRITICAL ? 'bg-[#7A0C0C]' : 'bg-green-500'
      }`}></div>

      <div className="p-6 relative z-10">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-3xl transition-all shadow-sm ${
              device.status === DeviceStatus.CRITICAL ? 'bg-[#7A0C0C] text-white' : 
              device.status === DeviceStatus.ONLINE ? 'bg-green-500/10 text-green-600' : 'bg-gray-100 text-gray-400'
            }`}>
              {device.type === 'PC' ? <Monitor size={24} /> : 
               device.type === 'Server' ? <Database size={24} /> : 
               device.type === 'Camera' ? <Camera size={24} /> : <HardDrive size={24} />}
            </div>
            <div>
              <h3 className="font-black text-gray-900 tracking-tighter text-lg leading-none mb-2">{device.name}</h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-gray-400 tracking-widest uppercase">{device.ip}</span>
                <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                <span className={`text-[10px] font-black uppercase tracking-tighter ${device.status === DeviceStatus.CRITICAL ? 'text-[#7A0C0C] animate-pulse' : 'text-gray-300'}`}>
                  {device.status}
                </span>
              </div>
            </div>
          </div>
          <button onClick={() => onMove(device)} className="p-2 hover:bg-gray-50 rounded-xl text-gray-300 hover:text-[#7A0C0C] transition-all" title="Mover a Grupo">
            <ArrowRightLeft size={16} />
          </button>
        </div>

        {/* Telemetry Dots */}
        <div className="flex gap-4 mb-6">
           <div className="flex-1 bg-gray-50 p-3 rounded-2xl border border-gray-100">
              <span className="block text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">CPU Load</span>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                   <div className={`h-full ${device.cpu > 70 ? 'bg-[#7A0C0C]' : 'bg-blue-500'}`} style={{ width: `${device.cpu}%` }}></div>
                </div>
                <span className="text-[10px] font-black text-gray-700">{device.cpu}%</span>
              </div>
           </div>
           <div className="flex-1 bg-gray-50 p-3 rounded-2xl border border-gray-100">
              <span className="block text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Protection</span>
              <div className="flex items-center gap-1.5">
                <Shield size={10} className={device.protectionActive ? 'text-[#7A0C0C]' : 'text-gray-300'} />
                <span className="text-[10px] font-black text-gray-700">{device.policies.length} Reglas</span>
              </div>
           </div>
        </div>

        {/* Technical Summary */}
        <div className="space-y-2 py-4 border-y border-gray-50">
           <div className="flex justify-between text-[10px] font-bold">
              <span className="text-gray-400 uppercase tracking-widest">OS System</span>
              <span className="text-gray-700">{device.os}</span>
           </div>
           <div className="flex justify-between text-[10px] font-bold">
              <span className="text-gray-400 uppercase tracking-widest">BWP Agent</span>
              <span className="text-[#7A0C0C] font-black">{device.agentVersion}</span>
           </div>
        </div>

        {/* Actions Button Group */}
        <div className="mt-6 flex gap-2">
           <button 
             onClick={() => onPolicies(device)}
             className="flex-1 py-3 bg-white border-2 border-gray-100 rounded-2xl text-[10px] font-black text-gray-700 uppercase tracking-widest hover:border-[#7A0C0C] hover:text-[#7A0C0C] transition-all shadow-sm"
           >
             Políticas
           </button>
           <button 
             onClick={() => onShutdown(device.id, device.name)}
             disabled={device.status === DeviceStatus.OFFLINE}
             className="w-12 h-12 flex items-center justify-center bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-2xl transition-all"
           >
             <Power size={18} />
           </button>
        </div>
      </div>
    </div>
  );
};

export default Monitoring;
