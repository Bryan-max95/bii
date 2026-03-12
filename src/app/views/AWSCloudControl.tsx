"use client";
import React, { useState } from 'react';
import { 
  Cloud, CloudLightning, Shield, ShieldAlert, ShieldCheck, 
  Zap, Search, RefreshCw, Cpu, Activity, Lock, Unlock,
  Trash2, AlertTriangle, Terminal, ArrowUpRight, Globe,
  Network, Server, Database, ChevronRight, Filter,
  Share2, HardDrive, Eye, Layers, Wifi, Power, Plus
} from 'lucide-react';
import { DeviceStatus, Severity } from '../../../types';

interface IngressRule {
  port: number;
  protocol: string;
  source: string;
  status: 'SAFE' | 'RISK';
}

interface AWSInstance {
  id: string;
  instanceId: string;
  name: string;
  region: string;
  type: string;
  publicIp: string;
  privateIp: string;
  status: DeviceStatus;
  agentInstalled: boolean;
  securityGroups: string[];
  ingressRules: IngressRule[];
  vulnerabilities: string[];
  cpu: number;
  ram: number;
  trafficIn: string;
  trafficOut: string;
}

const AWSCloudControl: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInstance, setSelectedInstance] = useState<AWSInstance | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [instances] = useState<AWSInstance[]>([
    {
      id: '1', instanceId: 'i-0a1b2c3d4e5f6g7h8', name: 'EC2-PROD-BACKEND-01',
      region: 'us-east-1 (N. Virginia)', type: 't3.xlarge',
      publicIp: '54.210.12.44', privateIp: '172.31.10.5',
      status: DeviceStatus.ONLINE, agentInstalled: true,
      securityGroups: ['sg-085e42f', 'default'],
      cpu: 28, ram: 45, trafficIn: '1.2 GB/s', trafficOut: '850 MB/s',
      vulnerabilities: ['CVE-2024-21413'],
      ingressRules: [
        { port: 80, protocol: 'TCP', source: '0.0.0.0/0', status: 'SAFE' },
        { port: 443, protocol: 'TCP', source: '0.0.0.0/0', status: 'SAFE' },
        { port: 22, protocol: 'TCP', source: '201.44.12.0/24', status: 'SAFE' }
      ]
    },
    {
      id: '2', instanceId: 'i-09988776655443322', name: 'EC2-STAGING-REDIS',
      region: 'us-west-2 (Oregon)', type: 'm5.large',
      publicIp: '34.12.55.101', privateIp: '10.0.5.112',
      status: DeviceStatus.RISK, agentInstalled: false,
      securityGroups: ['sg-0123abcd'],
      cpu: 88, ram: 92, trafficIn: '4.5 GB/s', trafficOut: '2.1 GB/s',
      vulnerabilities: ['UNAUTH-REDIS-ACCESS', 'OPEN-SSH-WORLD'],
      ingressRules: [
        { port: 6379, protocol: 'TCP', source: '0.0.0.0/0', status: 'RISK' },
        { port: 22, protocol: 'TCP', source: '0.0.0.0/0', status: 'RISK' }
      ]
    },
    {
      id: '3', instanceId: 'i-1234567890abcdefg', name: 'EC2-VPN-GATEWAY',
      region: 'eu-central-1 (Frankfurt)', type: 'c6g.medium',
      publicIp: '3.122.44.5', privateIp: '192.168.10.1',
      status: DeviceStatus.ONLINE, agentInstalled: true,
      securityGroups: ['sg-vpn-01'],
      cpu: 12, ram: 15, trafficIn: '45 MB/s', trafficOut: '40 MB/s',
      vulnerabilities: [],
      ingressRules: [
        { port: 1194, protocol: 'UDP', source: '0.0.0.0/0', status: 'SAFE' }
      ]
    }
  ]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  const filteredInstances = instances.filter(i => 
    i.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    i.publicIp.includes(searchTerm) || 
    i.instanceId.includes(searchTerm)
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-24">
      {/* Header AWS SOC */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter flex items-center gap-4">
            <div className="bg-[#1A1A1A] p-3 rounded-2xl shadow-xl shadow-black/10 text-[#FF9900]">
              <Cloud className="w-8 h-8" />
            </div>
            AWS EC2 Shield Center
          </h1>
          <p className="text-gray-500 font-medium mt-2">Defensa perimetral y auditoría de carga de trabajo para infraestructura Cloud.</p>
        </div>
        <div className="flex gap-3">
           <button 
             onClick={handleRefresh}
             className="flex items-center gap-2 px-6 py-4 bg-white border border-gray-100 text-gray-700 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm"
           >
             <RefreshCw className={isRefreshing ? 'animate-spin' : ''} size={16} /> Sync AWS Assets
           </button>
           <button className="flex items-center gap-2 px-8 py-4 bg-[#7A0C0C] text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#8B1E1E] transition-all shadow-xl shadow-[#7A0C0C]/20">
             <Plus size={18} /> Vincular Nueva IP
           </button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-4 rounded-[1.5rem] border border-gray-100 shadow-sm flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar por Instance ID, Nombre de instancia o IP Pública..." 
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#7A0C0C]/10 outline-none font-bold text-gray-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
           <button className="p-3 bg-gray-50 text-gray-400 hover:text-[#7A0C0C] rounded-xl"><Filter size={20} /></button>
           <button className="p-3 bg-gray-50 text-gray-400 hover:text-[#7A0C0C] rounded-xl"><Layers size={20} /></button>
        </div>
      </div>

      {/* Instance Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {filteredInstances.map(instance => (
          <EC2Card 
            key={instance.id} 
            instance={instance} 
            onDetails={() => setSelectedInstance(instance)} 
          />
        ))}
      </div>

      {/* Side Detail Panel (Forense AWS) */}
      {selectedInstance && (
        <div className="fixed inset-0 z-[100] flex items-center justify-end bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="bg-[#F7F5F2] w-full max-w-3xl h-full shadow-2xl flex flex-col animate-in slide-in-from-right-full duration-500">
              {/* Header Panel */}
              <div className="p-10 bg-white border-b border-gray-200">
                 <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                       <div className="p-4 bg-gray-900 rounded-[1.5rem] text-[#FF9900] shadow-xl">
                          <Cloud size={32} />
                       </div>
                       <div>
                          <h2 className="text-3xl font-black text-gray-900 tracking-tighter">{selectedInstance.name}</h2>
                          <div className="flex items-center gap-3 mt-1">
                             <span className="text-[10px] font-black text-[#7A0C0C] uppercase tracking-widest">{selectedInstance.instanceId}</span>
                             <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{selectedInstance.region}</span>
                          </div>
                       </div>
                    </div>
                    <button 
                      onClick={() => setSelectedInstance(null)}
                      className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:text-[#7A0C0C] transition-all font-bold text-2xl"
                    >
                      ×
                    </button>
                 </div>

                 <div className="grid grid-cols-4 gap-4">
                    <StatusItem label="Public IP" value={selectedInstance.publicIp} color="text-gray-800" />
                    <StatusItem label="Instance Type" value={selectedInstance.type} color="text-gray-800" />
                    <StatusItem label="BWP Agent" value={selectedInstance.agentInstalled ? 'ACTIVE' : 'NONE'} color={selectedInstance.agentInstalled ? 'text-green-600' : 'text-orange-500'} />
                    <StatusItem label="Risk Level" value={selectedInstance.status.toUpperCase()} color={selectedInstance.status === DeviceStatus.RISK ? 'text-orange-500' : 'text-green-600'} />
                 </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-10 space-y-12 custom-scrollbar">
                 {/* Traffic Flow Analysis */}
                 <section className="space-y-6">
                    <div className="flex items-center justify-between">
                       <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                         <Network size={14} className="text-[#7A0C0C]" /> VPC Traffic Flow (Ingress Rules)
                       </h3>
                       <span className="text-[10px] font-black text-gray-400 bg-gray-100 px-3 py-1 rounded-full uppercase">Firewall Audit</span>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3">
                       {selectedInstance.ingressRules.map((rule, idx) => (
                         <div key={idx} className={`p-5 rounded-2xl border-2 flex items-center justify-between transition-all ${rule.status === 'RISK' ? 'border-red-100 bg-red-50/30' : 'border-gray-50 bg-white shadow-sm'}`}>
                            <div className="flex items-center gap-4">
                               <div className={`p-3 rounded-xl ${rule.status === 'RISK' ? 'bg-red-500 text-white shadow-lg' : 'bg-gray-100 text-gray-400'}`}>
                                  {rule.status === 'RISK' ? <ShieldAlert size={18} /> : <Lock size={18} />}
                               </div>
                               <div>
                                  <div className="flex items-center gap-2">
                                     <span className="text-sm font-black text-gray-800">Port {rule.port}</span>
                                     <span className="text-[10px] font-bold text-gray-400">{rule.protocol}</span>
                                  </div>
                                  <p className="text-[10px] font-mono text-gray-500 mt-0.5">Source: {rule.source}</p>
                               </div>
                            </div>
                            <div className="text-right">
                               <span className={`text-[10px] font-black uppercase tracking-widest ${rule.status === 'RISK' ? 'text-red-600' : 'text-green-600'}`}>
                                 {rule.status === 'RISK' ? 'Exposure Detected' : 'Restricted'}
                               </span>
                            </div>
                         </div>
                       ))}
                    </div>
                 </section>

                 {/* System Telemetry (Only if agent active) */}
                 <section className="space-y-6">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                       <Activity size={14} className="text-[#7A0C0C]" /> Profundidad de Agente (Inside Telemetry)
                    </h3>
                    {selectedInstance.agentInstalled ? (
                      <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
                         <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-4">
                               <div className="flex justify-between items-end">
                                  <span className="text-[10px] font-black text-gray-400 uppercase">Procesador (Virtual Cores)</span>
                                  <span className="text-sm font-black text-gray-800">{selectedInstance.cpu}%</span>
                               </div>
                               <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                  <div className="h-full bg-[#7A0C0C] transition-all duration-1000" style={{ width: `${selectedInstance.cpu}%` }}></div>
                               </div>
                            </div>
                            <div className="space-y-4">
                               <div className="flex justify-between items-end">
                                  <span className="text-[10px] font-black text-gray-400 uppercase">Memoria elástica</span>
                                  <span className="text-sm font-black text-gray-800">{selectedInstance.ram}%</span>
                               </div>
                               <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                  <div className="h-full bg-blue-600 transition-all duration-1000" style={{ width: `${selectedInstance.ram}%` }}></div>
                               </div>
                            </div>
                         </div>
                         <div className="pt-6 border-t border-gray-50 grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3">
                               <ArrowUpRight className="text-green-500" size={16} />
                               <div className="flex flex-col">
                                  <span className="text-[8px] font-black text-gray-400 uppercase">Ingress Bandwidth</span>
                                  <span className="text-xs font-black text-gray-800">{selectedInstance.trafficIn}</span>
                               </div>
                            </div>
                            <div className="flex items-center gap-3">
                               <div className="rotate-180"><ArrowUpRight className="text-[#7A0C0C]" size={16} /></div>
                               <div className="flex flex-col">
                                  <span className="text-[8px] font-black text-gray-400 uppercase">Egress Bandwidth</span>
                                  <span className="text-xs font-black text-gray-800">{selectedInstance.trafficOut}</span>
                               </div>
                            </div>
                         </div>
                      </div>
                    ) : (
                      <div className="bg-[#7A0C0C]/5 border-2 border-dashed border-[#7A0C0C]/20 p-10 rounded-[2.5rem] text-center flex flex-col items-center">
                         <Zap size={32} className="text-[#7A0C0C] mb-4 animate-pulse" />
                         <h4 className="text-sm font-black text-[#7A0C0C] uppercase tracking-widest mb-2">Potencial de Defensa Limitado</h4>
                         <p className="text-xs font-medium text-gray-500 leading-relaxed max-w-sm">Instale el Agente BWP en esta instancia para ver telemetría interna, procesos activos y detener malware antes de que se propague.</p>
                         <button className="mt-6 px-8 py-3 bg-[#7A0C0C] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#7A0C0C]/20">Instalar Agente Remotamente</button>
                      </div>
                    )}
                 </section>
              </div>

              {/* Action Footer */}
              <div className="p-10 bg-white border-t border-gray-200 grid grid-cols-2 gap-4">
                 <button className="py-4 bg-[#1A1A1A] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2">
                    <Unlock size={14} /> Update Sec. Group
                 </button>
                 <button className="py-4 bg-[#7A0C0C] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#7A0C0C]/20 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                    <ShieldAlert size={14} /> Isolate Instance
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

// Subcomponent: EC2Card
// Added React.FC type to handle JSX key attribute correctly
const EC2Card: React.FC<{ instance: AWSInstance, onDetails: any }> = ({ instance, onDetails }) => {
  return (
    <div 
      onClick={onDetails}
      className={`bg-white rounded-[3.5rem] p-10 border border-gray-100 shadow-sm transition-all duration-500 relative overflow-hidden group hover:shadow-2xl hover:-translate-y-2 cursor-pointer ${instance.status === DeviceStatus.RISK ? 'border-red-100' : ''}`}
    >
      <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl opacity-5 ${instance.status === DeviceStatus.RISK ? 'bg-red-500' : 'bg-[#FF9900]'}`}></div>

      <div className="flex items-start justify-between mb-8 relative z-10">
         <div className={`p-6 rounded-[2.5rem] shadow-xl transition-transform group-hover:rotate-12 ${
           instance.agentInstalled ? 'bg-gray-900 text-[#FF9900]' : 'bg-gray-100 text-gray-400'
         }`}>
           {instance.agentInstalled ? <CloudLightning size={32} /> : <Cloud size={32} />}
         </div>
         <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
               <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{instance.region.split(' ')[0]}</span>
               <div className={`w-2.5 h-2.5 rounded-full ${instance.status === DeviceStatus.ONLINE ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`}></div>
            </div>
            <span className="text-[10px] font-mono font-bold text-gray-300">{instance.instanceId}</span>
         </div>
      </div>

      <div className="relative z-10">
         <h3 className="text-2xl font-black text-gray-900 tracking-tighter mb-1 group-hover:text-[#7A0C0C] transition-colors">{instance.name}</h3>
         <div className="flex items-center gap-2 mb-8">
            <Globe size={10} className="text-gray-400" />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{instance.publicIp}</span>
         </div>

         <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
               <span className="block text-[8px] font-black text-gray-400 uppercase mb-1">VPC Security</span>
               <div className="flex items-center gap-1.5">
                  <Shield size={10} className={instance.ingressRules.some(r => r.status === 'RISK') ? 'text-red-500' : 'text-green-500'} />
                  <span className="text-[10px] font-black text-gray-800">{instance.securityGroups.length} Groups Audit</span>
               </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
               <span className="block text-[8px] font-black text-gray-400 uppercase mb-1">Protection Level</span>
               <span className={`text-[10px] font-black ${instance.agentInstalled ? 'text-green-600' : 'text-gray-400'}`}>
                 {instance.agentInstalled ? 'Deep Agent Shield' : 'Remote External'}
               </span>
            </div>
         </div>

         {/* Mini CVE list */}
         <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
            <div className="flex gap-2">
               {instance.vulnerabilities.length > 0 ? (
                 instance.vulnerabilities.slice(0, 2).map(v => (
                   <span key={v} className="px-2 py-0.5 bg-red-50 text-red-600 rounded text-[8px] font-black uppercase border border-red-100">{v}</span>
                 ))
               ) : (
                 <span className="text-[9px] font-black text-green-600 uppercase tracking-widest flex items-center gap-1.5">
                   <ShieldCheck size={12} /> Postura Optima
                 </span>
               )}
            </div>
            <button className="text-[10px] font-black text-[#7A0C0C] uppercase tracking-widest hover:underline flex items-center gap-1">
              Audit <ChevronRight size={14} />
            </button>
         </div>
      </div>
    </div>
  );
};

const StatusItem = ({ label, value, color }: { label: string, value: string, color: string }) => (
  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
     <span className="block text-[8px] font-black text-gray-400 uppercase mb-1 tracking-widest">{label}</span>
     <span className={`text-xs font-black truncate block ${color}`}>{value}</span>
  </div>
);

export default AWSCloudControl;
