"use client";
import React, { useState, useMemo } from 'react';
import { 
  Cloud, Globe, Shield, ShieldAlert, ShieldCheck, Zap, 
  Search, RefreshCw, Activity, Lock, Unlock, Database,
  ArrowUpRight, Network, Server, ChevronRight, Filter,
  Layers, Power, Terminal, Cpu, HardDrive, Plus,
  Monitor, LayoutGrid, Share2, AlertTriangle, Bug,
  X, CheckCircle, Loader2, CloudCog, Cpu as Processor,
  ArrowRightLeft, Radio, Key, Globe2, Boxes, Settings
} from 'lucide-react';
import { DeviceStatus } from '../../../types';

// Proveedores soportados
type CloudProvider = 'AZURE' | 'ORACLE' | 'GCP' | 'AWS' | 'OTHER';

interface CloudInstance {
  id: string;
  provider: CloudProvider;
  name: string;
  instanceId: string;
  region: string;
  publicIp: string;
  privateIp: string;
  status: DeviceStatus;
  agentVersion: string;
  protectionActive: boolean;
  cpu: number;
  ram: number;
  disk: number;
  openPorts: number[];
  vulnerabilities: string[];
}

const CloudMultiControl: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInstance, setSelectedInstance] = useState<CloudInstance | null>(null);
  const [filterProvider, setFilterProvider] = useState<'ALL' | CloudProvider>('ALL');
  
  // Estado para el Proceso de Vinculación Manual (Wizard)
  const [showLinkWizard, setShowLinkWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [isDeployingAgent, setIsDeployingAgent] = useState(false);
  const [deploymentProgress, setDeploymentProgress] = useState(0);

  // Formulario de nueva VM
  const [newVm, setNewVm] = useState({
    name: '',
    provider: 'AZURE' as CloudProvider,
    instanceId: '',
    ip: '',
    privateIp: '',
    region: 'East US 2',
    instanceType: 't3.xlarge'
  });

  // Lista de instancias activas
  const [instances, setInstances] = useState<CloudInstance[]>([
    {
      id: 'AZ-01', provider: 'AZURE', name: 'AZ-WIN-PROD-SQL', instanceId: 'i-9922-a81',
      region: 'East US 2', publicIp: '20.112.45.88', privateIp: '10.0.0.4', status: DeviceStatus.ONLINE,
      agentVersion: 'BWP-v2.6.1', protectionActive: true, cpu: 34, ram: 58, disk: 42, 
      openPorts: [1433, 443, 3389], vulnerabilities: []
    },
    {
      id: 'OCI-01', provider: 'ORACLE', name: 'OCI-LINUX-MASTER', instanceId: 'ocid1.instance.v1...',
      region: 'mx-queretaro-1', publicIp: '132.145.2.44', privateIp: '172.16.0.5', status: DeviceStatus.RISK,
      agentVersion: 'BWP-v2.5.4', protectionActive: true, cpu: 78, ram: 82, disk: 90,
      openPorts: [80, 22, 443], vulnerabilities: ['CVE-2024-1011']
    }
  ]);

  const filtered = instances.filter(i => {
    const matchesSearch = i.name.toLowerCase().includes(searchTerm.toLowerCase()) || i.publicIp.includes(searchTerm);
    const matchesProvider = filterProvider === 'ALL' || i.provider === filterProvider;
    return matchesSearch && matchesProvider;
  });

  const resetWizard = () => {
    setShowLinkWizard(false);
    setWizardStep(1);
    setIsDeployingAgent(false);
    setDeploymentProgress(0);
    setNewVm({
      name: '',
      provider: 'AZURE',
      instanceId: '',
      ip: '',
      privateIp: '',
      region: 'East US 2',
      instanceType: 't3.xlarge'
    });
  };

  const startAgentDeployment = () => {
    if (!newVm.name || !newVm.ip) return;
    setWizardStep(3);
    setIsDeployingAgent(true);
    setDeploymentProgress(0);

    const interval = setInterval(() => {
      setDeploymentProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          finishLinking();
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  const finishLinking = () => {
    const linkedInstance: CloudInstance = {
      id: `linked-${Date.now()}`,
      provider: newVm.provider,
      name: newVm.name,
      instanceId: newVm.instanceId || `ins-${Math.random().toString(36).substring(7)}`,
      region: newVm.region,
      publicIp: newVm.ip,
      privateIp: newVm.privateIp || '10.0.0.X',
      status: DeviceStatus.ONLINE,
      agentVersion: 'BWP-v2.6.2 (Latest)',
      protectionActive: true,
      cpu: 12,
      ram: 15,
      disk: 8,
      openPorts: [22, 443],
      vulnerabilities: []
    };

    setInstances([linkedInstance, ...instances]);
    setTimeout(() => {
      setIsDeployingAgent(false);
      setWizardStep(4);
    }, 500);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-24">
      {/* Header Central Cloud */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter flex items-center gap-4">
            <div className="bg-[#1A1A1A] p-3 rounded-2xl shadow-xl shadow-black/10 text-blue-500">
              <Cloud className="w-8 h-8" />
            </div>
            Orquestación Multi-Cloud
          </h1>
          <p className="text-gray-500 font-medium mt-2">Control unificado de servidores en Azure, Oracle, GCP y AWS con Agentes BWP.</p>
        </div>
        <button 
          onClick={() => setShowLinkWizard(true)}
          className="flex items-center gap-2 px-8 py-4 bg-[#7A0C0C] text-white rounded-[1.5rem] text-xs font-black uppercase tracking-widest hover:bg-[#8B1E1E] transition-all shadow-xl shadow-[#7A0C0C]/20 active:scale-95 group"
        >
          <Plus size={18} className="group-hover:rotate-90 transition-transform" /> Vincular Máquina Virtual
        </button>
      </div>

      {/* Control Tabs */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-wrap items-center gap-6">
        <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100 overflow-x-auto no-scrollbar">
           {(['ALL', 'AZURE', 'ORACLE', 'GCP', 'AWS'] as const).map(p => (
             <button 
               key={p}
               onClick={() => setFilterProvider(p)}
               className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filterProvider === p ? 'bg-[#1A1A1A] text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
             >
               {p}
             </button>
           ))}
        </div>
        <div className="flex-1 min-w-[300px] relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Filtrar instancias por IP, ID o Nombre..." 
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#7A0C0C]/10 outline-none font-bold text-gray-800 shadow-inner"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Grid de Instancias Vinculadas */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {filtered.map(instance => (
          <CloudInstanceCard 
            key={instance.id} 
            instance={instance} 
            onClick={() => setSelectedInstance(instance)} 
          />
        ))}
        {filtered.length === 0 && (
          <div className="xl:col-span-2 py-24 flex flex-col items-center justify-center text-gray-300 bg-white/50 rounded-[3rem] border-2 border-dashed border-gray-100">
             <CloudCog size={64} className="mb-4 opacity-10" />
             <p className="text-xl font-black uppercase tracking-tighter opacity-20">No hay máquinas virtuales vinculadas</p>
          </div>
        )}
      </div>

      {/* MODAL: WIZARD DE VINCULACIÓN MANUAL */}
      {showLinkWizard && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="bg-white rounded-[4rem] w-full max-w-4xl h-[80vh] shadow-2xl flex flex-col overflow-hidden border border-white/10 relative">
              
              {/* Header Wizard */}
              <div className="p-10 border-b border-gray-100 flex items-center justify-between bg-white">
                 <div className="flex items-center gap-8">
                    <div className="p-5 bg-gray-900 rounded-[2rem] text-[#7A0C0C] shadow-xl">
                       <Boxes size={32} />
                    </div>
                    <div>
                       <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">Vincular Nueva VM</h2>
                       <div className="flex items-center gap-4 mt-3">
                          {[1, 2, 3].map(step => (
                            <div key={step} className="flex items-center gap-2">
                               <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${wizardStep >= step ? 'bg-[#7A0C0C] text-white' : 'bg-gray-100 text-gray-400'}`}>
                                 {step}
                               </div>
                               {step < 3 && <div className={`w-8 h-0.5 rounded-full ${wizardStep > step ? 'bg-[#7A0C0C]' : 'bg-gray-100'}`}></div>}
                            </div>
                          ))}
                       </div>
                    </div>
                 </div>
                 <button onClick={resetWizard} className="w-14 h-14 rounded-full bg-gray-50 text-gray-400 hover:text-red-500 transition-all flex items-center justify-center shadow-sm hover:rotate-90">
                    <X size={28} />
                 </button>
              </div>

              {/* Wizard Steps */}
              <div className="flex-1 overflow-y-auto p-12 bg-gray-50/30 custom-scrollbar">
                 {wizardStep === 1 && (
                   <div className="max-w-2xl mx-auto space-y-10 animate-in slide-in-from-right-4 duration-500">
                      <div className="space-y-4">
                         <h3 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                           <Key className="text-[#7A0C0C]" size={20} /> Identidad y Proveedor
                         </h3>
                         <p className="text-sm text-gray-500 font-medium leading-relaxed">Asigne un alias profesional a su máquina virtual y seleccione la infraestructura de alojamiento.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Alias de la VM</label>
                            <input 
                              autoFocus
                              className="w-full p-5 bg-white border border-gray-100 rounded-2xl font-black text-gray-900 shadow-sm outline-none focus:ring-2 focus:ring-[#7A0C0C]/10" 
                              placeholder="Ej: SRV-APP-PROD-01"
                              value={newVm.name}
                              onChange={(e) => setNewVm({...newVm, name: e.target.value})}
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Instance ID (Opcional)</label>
                            <input 
                              className="w-full p-5 bg-white border border-gray-100 rounded-2xl font-mono text-xs font-bold text-gray-500 shadow-sm outline-none focus:ring-2 focus:ring-[#7A0C0C]/10" 
                              placeholder="i-0a1b2c3d4e..."
                              value={newVm.instanceId}
                              onChange={(e) => setNewVm({...newVm, instanceId: e.target.value})}
                            />
                         </div>
                      </div>

                      <div className="space-y-4">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Proveedor Cloud</label>
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {(['AZURE', 'ORACLE', 'GCP', 'AWS'] as CloudProvider[]).map(prov => (
                              <button 
                                key={prov}
                                onClick={() => setNewVm({...newVm, provider: prov})}
                                className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-3 ${newVm.provider === prov ? 'border-[#7A0C0C] bg-[#7A0C0C]/5 shadow-lg' : 'bg-white border-transparent hover:border-gray-200'}`}
                              >
                                 <Cloud size={24} className={newVm.provider === prov ? 'text-[#7A0C0C]' : 'text-gray-300'} />
                                 <span className="text-[10px] font-black uppercase tracking-widest">{prov}</span>
                              </button>
                            ))}
                         </div>
                      </div>
                   </div>
                 )}

                 {wizardStep === 2 && (
                   <div className="max-w-2xl mx-auto space-y-10 animate-in slide-in-from-right-4 duration-500">
                      <div className="space-y-4">
                         <h3 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                           <Globe2 className="text-[#7A0C0C]" size={20} /> Configuración de Red
                         </h3>
                         <p className="text-sm text-gray-500 font-medium leading-relaxed">Defina las interfaces IP para que el SOC BWP pueda establecer túneles de telemetría.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">IP Pública / Endpoint</label>
                            <input 
                              className="w-full p-5 bg-white border border-gray-100 rounded-2xl font-mono text-sm font-bold text-gray-900 shadow-sm outline-none focus:ring-2 focus:ring-[#7A0C0C]/10" 
                              placeholder="20.12.XXX.XX"
                              value={newVm.ip}
                              onChange={(e) => setNewVm({...newVm, ip: e.target.value})}
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">IP Privada (VPC)</label>
                            <input 
                              className="w-full p-5 bg-white border border-gray-100 rounded-2xl font-mono text-sm font-bold text-gray-900 shadow-sm outline-none focus:ring-2 focus:ring-[#7A0C0C]/10" 
                              placeholder="10.0.0.X"
                              value={newVm.privateIp}
                              onChange={(e) => setNewVm({...newVm, privateIp: e.target.value})}
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Región / Datacenter</label>
                            <input 
                              className="w-full p-5 bg-white border border-gray-100 rounded-2xl font-black text-gray-800 shadow-sm outline-none focus:ring-2 focus:ring-[#7A0C0C]/10" 
                              placeholder="East US 2"
                              value={newVm.region}
                              onChange={(e) => setNewVm({...newVm, region: e.target.value})}
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tipo de Instancia</label>
                            <input 
                              className="w-full p-5 bg-white border border-gray-100 rounded-2xl font-bold text-gray-800 shadow-sm outline-none focus:ring-2 focus:ring-[#7A0C0C]/10" 
                              placeholder="t3.xlarge / Standard_D2_v2"
                              value={newVm.instanceType}
                              onChange={(e) => setNewVm({...newVm, instanceType: e.target.value})}
                            />
                         </div>
                      </div>
                   </div>
                 )}

                 {wizardStep === 3 && (
                   <div className="max-w-2xl mx-auto flex flex-col items-center justify-center h-full text-center space-y-10 animate-in zoom-in-95 duration-700">
                      <div className="relative">
                         <div className="w-32 h-32 border-4 border-gray-100 border-t-[#7A0C0C] rounded-full animate-spin"></div>
                         <Shield className="absolute inset-0 m-auto text-[#7A0C0C] animate-pulse" size={40} />
                      </div>
                      <div className="space-y-4">
                         <h3 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">Inyectando Agente BWP</h3>
                         <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Sincronizando kernel remote con el nodo maestro...</p>
                      </div>
                      <div className="w-full max-w-md space-y-4">
                         <div className="flex justify-between items-end">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Despliegue: {deploymentProgress}%</span>
                            <span className="text-xs font-mono font-bold text-[#7A0C0C]">Payload Encrypted</span>
                         </div>
                         <div className="h-2 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                            <div className="h-full bg-[#7A0C0C] shadow-[0_0_15px_#7A0C0C] transition-all duration-300" style={{ width: `${deploymentProgress}%` }}></div>
                         </div>
                         <div className="p-4 bg-gray-900 rounded-2xl font-mono text-[9px] text-green-500 text-left overflow-hidden h-20">
                            <p>&gt; [SYSTEM] establishing TLS 1.3 tunnel to {newVm.ip}...</p>
                            <p>&gt; [AUTH] certificate verification: SUCCESS</p>
                            <p>&gt; [AGENT] extracting bwp-agent-v2.6.2.bin...</p>
                            <p>&gt; [AGENT] launching systemd service...</p>
                         </div>
                      </div>
                   </div>
                 )}

                 {wizardStep === 4 && (
                   <div className="max-w-2xl mx-auto flex flex-col items-center justify-center h-full text-center space-y-8 animate-in bounce-in duration-700">
                      <div className="w-24 h-24 bg-green-500 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl shadow-green-500/30">
                         <CheckCircle size={48} />
                      </div>
                      <div className="space-y-2">
                         <h3 className="text-4xl font-black text-gray-900 tracking-tighter leading-tight">¡Vinculación Exitosa!</h3>
                         <p className="text-sm text-gray-400 font-medium">La instancia <span className="font-black text-[#7A0C0C]">{newVm.name}</span> ya se encuentra bajo protección total.</p>
                      </div>
                      <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm w-full grid grid-cols-3 gap-6">
                         <div className="text-center">
                            <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Status</p>
                            <p className="text-xs font-black text-green-600">SECURED</p>
                         </div>
                         <div className="text-center border-x border-gray-100">
                            <p className="text-[8px] font-black text-gray-400 uppercase mb-1">ID SOC</p>
                            <p className="text-xs font-black text-gray-800">Linked-Active</p>
                         </div>
                         <div className="text-center">
                            <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Agent</p>
                            <p className="text-xs font-black text-gray-800">v2.6.2</p>
                         </div>
                      </div>
                      <button 
                        onClick={resetWizard}
                        className="px-12 py-5 bg-[#1A1A1A] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black shadow-xl transition-all"
                      >
                         Ir al Panel de Control
                      </button>
                   </div>
                 )}
              </div>

              {/* Footer Wizard */}
              {wizardStep < 3 && (
                <div className="p-10 border-t border-gray-100 flex items-center justify-between bg-white">
                   <div className="flex items-center gap-3 text-gray-400">
                      <ShieldAlert size={20} />
                      <span className="text-[9px] font-black uppercase tracking-widest italic">Inyección forzada de Agente requerida</span>
                   </div>
                   <div className="flex gap-4">
                      {wizardStep > 1 && (
                        <button onClick={() => setWizardStep(wizardStep - 1)} className="px-8 py-4 bg-gray-100 text-gray-500 rounded-2xl text-[10px] font-black uppercase tracking-widest">Anterior</button>
                      )}
                      {wizardStep === 1 && (
                        <button 
                          disabled={!newVm.name}
                          onClick={() => setWizardStep(2)} 
                          className="px-12 py-5 bg-[#1A1A1A] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl disabled:opacity-20 flex items-center gap-2"
                        >
                          Continuar <ChevronRight size={14} />
                        </button>
                      )}
                      {wizardStep === 2 && (
                        <button 
                          disabled={!newVm.ip}
                          onClick={startAgentDeployment} 
                          className="px-12 py-5 bg-[#7A0C0C] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#7A0C0C]/30 flex items-center gap-2 animate-pulse-wine"
                        >
                          <Zap size={14} /> Inyectar y Vincular
                        </button>
                      )}
                   </div>
                </div>
              )}
           </div>
        </div>
      )}

      {/* Detalle Forense de Instancia */}
      {selectedInstance && (
        <div className="fixed inset-0 z-[100] flex items-center justify-end bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="bg-[#F7F5F2] w-full max-w-3xl h-full shadow-2xl flex flex-col animate-in slide-in-from-right-full duration-500">
              <div className="p-10 bg-white border-b border-gray-200">
                 <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-6">
                       <div className={`p-5 rounded-[2rem] shadow-xl text-white ${
                         selectedInstance.provider === 'ORACLE' ? 'bg-[#F30000]' : 
                         selectedInstance.provider === 'AZURE' ? 'bg-blue-600' : 'bg-gray-900'
                       }`}>
                          <Server size={32} />
                       </div>
                       <div>
                          <h2 className="text-3xl font-black text-gray-900 tracking-tighter leading-none">{selectedInstance.name}</h2>
                          <div className="flex items-center gap-3 mt-2">
                             <span className="text-[10px] font-black text-[#7A0C0C] uppercase tracking-widest">{selectedInstance.provider}</span>
                             <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                             <span className="text-[10px] font-mono font-bold text-gray-400 uppercase">{selectedInstance.publicIp}</span>
                          </div>
                       </div>
                    </div>
                    <button onClick={() => setSelectedInstance(null)} className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:text-red-500 transition-all text-2xl font-bold">×</button>
                 </div>

                 <div className="grid grid-cols-4 gap-4">
                    <StatusBox label="VPC Region" value={selectedInstance.region} />
                    <StatusBox label="Private IP" value={selectedInstance.privateIp} />
                    <StatusBox label="BWP Agent" value={selectedInstance.agentVersion} color="text-green-600" />
                    <StatusBox label="SOC Status" value={selectedInstance.status.toUpperCase()} color={selectedInstance.status === DeviceStatus.RISK ? 'text-orange-500' : 'text-green-600'} />
                 </div>
              </div>

              <div className="flex-1 overflow-y-auto p-10 space-y-12 custom-scrollbar">
                 <section className="space-y-6">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                       <Activity size={14} className="text-[#7A0C0C]" /> Telemetría de Carga Cloud
                    </h3>
                    <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
                       <div className="grid grid-cols-2 gap-10">
                          <ResourceStat label="vCPU Utilization" value={selectedInstance.cpu} />
                          <ResourceStat label="Memory Usage" value={selectedInstance.ram} />
                       </div>
                       <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                             <ShieldCheck size={20} className="text-green-500" />
                             <span className="text-xs font-black text-gray-800 uppercase tracking-tight">Kernel Protection Verified</span>
                          </div>
                          <button className="text-[10px] font-black text-[#7A0C0C] uppercase hover:underline">Ver Procesos Activos</button>
                       </div>
                    </div>
                 </section>

                 <section className="space-y-6">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                       <Network size={14} className="text-[#7A0C0C]" /> Perímetro de Red (Port Security)
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                       {selectedInstance.openPorts.map(port => (
                          <div key={port} className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center justify-between shadow-sm group hover:border-[#7A0C0C]/30 transition-all">
                             <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${port === 22 || port === 3389 ? 'bg-orange-50 text-orange-600' : 'bg-gray-50 text-gray-400'}`}>
                                   <Lock size={18} />
                                </div>
                                <div>
                                   <p className="text-sm font-black text-gray-800 leading-none mb-1">Puerto {port}</p>
                                   <p className="text-[10px] text-gray-400 font-bold uppercase">{port === 22 ? 'SSH Access' : port === 3389 ? 'RDP Access' : 'HTTPS Standard'}</p>
                                </div>
                             </div>
                             {(port === 22 || port === 3389) && (
                               <span className="text-[10px] font-black text-orange-600 bg-orange-50 px-3 py-1 rounded-full uppercase border border-orange-100">Alerta: Exposición Alta</span>
                             )}
                          </div>
                       ))}
                    </div>
                 </section>
              </div>

              <div className="p-10 bg-white border-t border-gray-100 grid grid-cols-2 gap-4">
                 <button className="py-5 bg-[#1A1A1A] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg">
                    <Terminal size={16} /> CLI Shell Remote
                 </button>
                 <button className="py-5 bg-[#7A0C0C] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#7A0C0C]/20 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                    <Shield size={16} /> Full Security Hardening
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

// Componente: CloudInstanceCard
// Added React.FC type to handle JSX key attribute correctly
const CloudInstanceCard: React.FC<{ instance: CloudInstance, onClick: () => void }> = ({ instance, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-[3.5rem] p-10 border border-gray-100 shadow-sm transition-all duration-500 relative overflow-hidden group hover:shadow-2xl hover:-translate-y-2 cursor-pointer ${instance.status === DeviceStatus.RISK ? 'border-orange-100 shadow-orange-100/50' : ''}`}
    >
      {/* Decorative gradient for provider */}
      <div className={`absolute top-0 right-0 w-32 h-32 blur-[80px] opacity-10 transition-opacity group-hover:opacity-20 ${
        instance.provider === 'ORACLE' ? 'bg-[#F30000]' : 
        instance.provider === 'AZURE' ? 'bg-blue-600' : 'bg-gray-900'
      }`}></div>

      <div className="flex items-start justify-between mb-10 relative z-10">
         <div className={`p-6 rounded-[2.5rem] text-white shadow-xl transition-transform group-hover:rotate-12 ${
           instance.provider === 'AZURE' ? 'bg-blue-600' : 
           instance.provider === 'ORACLE' ? 'bg-[#F30000]' : 'bg-gray-900'
         }`}>
           <Cloud size={32} />
         </div>
         <div className="flex flex-col items-end gap-3">
            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
              instance.status === DeviceStatus.ONLINE ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
            }`}>{instance.status}</span>
            <div className="flex items-center gap-2 text-gray-400">
               <Globe size={12} />
               <span className="text-[10px] font-mono font-bold tracking-widest">{instance.publicIp}</span>
            </div>
         </div>
      </div>

      <div className="relative z-10">
         <h3 className="text-3xl font-black text-gray-900 tracking-tighter mb-1 group-hover:text-[#7A0C0C] transition-colors leading-none">{instance.name}</h3>
         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-10">{instance.provider} INFRASTRUCTURE • {instance.region}</p>

         <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="bg-gray-50/80 p-5 rounded-[2rem] border border-gray-100 flex flex-col items-center text-center group-hover:bg-white transition-colors">
               <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">VPC Security</span>
               <span className="text-sm font-black text-gray-800">{instance.openPorts.length} Puertos Aud.</span>
            </div>
            <div className={`bg-gray-50/80 p-5 rounded-[2rem] border border-gray-100 flex flex-col items-center text-center group-hover:bg-white transition-colors ${instance.protectionActive ? 'border-green-100' : ''}`}>
               <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Protección BWP</span>
               <span className={`text-[10px] font-black uppercase ${instance.protectionActive ? 'text-green-600' : 'text-gray-400'}`}>
                 {instance.protectionActive ? 'Full Agent Active' : 'Perimeter Only'}
               </span>
            </div>
         </div>

         {/* Mini CVE and Status list */}
         <div className="pt-8 border-t border-gray-50 flex items-center justify-between">
            <div className="flex gap-2">
               {instance.vulnerabilities.length > 0 ? (
                 <span className="px-3 py-1 bg-red-50 text-[#7A0C0C] rounded-lg text-[9px] font-black uppercase tracking-widest border border-red-100 animate-pulse">
                   {instance.vulnerabilities.length} Riesgos Críticos
                 </span>
               ) : (
                 <span className="flex items-center gap-2 text-green-600 text-[10px] font-black uppercase tracking-widest">
                   <ShieldCheck size={16} /> Kernel Endurecido
                 </span>
               )}
            </div>
            <button className="text-[10px] font-black text-[#7A0C0C] uppercase tracking-[0.2em] hover:underline flex items-center gap-1">
              Auditar VM <ChevronRight size={14} />
            </button>
         </div>
      </div>
    </div>
  );
};

// Subcomponentes Auxiliares
const StatusBox = ({ label, value, color = 'text-gray-800' }: any) => (
  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col justify-center shadow-inner">
     <span className="block text-[8px] font-black text-gray-400 uppercase mb-1 tracking-widest">{label}</span>
     <span className={`text-xs font-black truncate block ${color}`}>{value}</span>
  </div>
);

const ResourceStat = ({ label, value }: any) => (
  <div className="space-y-4">
     <div className="flex justify-between items-end">
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
        <span className="text-sm font-black text-gray-900">{value}%</span>
     </div>
     <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
        <div 
          className="h-full bg-[#7A0C0C] shadow-[0_0_10px_#7A0C0C] transition-all duration-1000"
          style={{ width: `${value}%` }}
        ></div>
     </div>
  </div>
);

export default CloudMultiControl;
