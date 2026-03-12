"use client";
import React, { useState } from 'react';
import { 
  Settings, UserPlus, Users, Shield, Lock, 
  Mail, ChevronRight, Zap, Trash2, Edit, 
  CheckCircle2, Plus, Info, Globe, Database,
  Terminal, Layers, ShieldCheck, Fingerprint,
  X, AlertTriangle, Monitor, Server, Target
} from 'lucide-react';
import { POLICIES } from '../constants';
import { Policy, PolicyCategory } from '../../../types';

interface BWPUser {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'ANALYST' | 'VIEWER';
  status: 'ACTIVE' | 'PENDING';
  lastSeen: string;
}

const SettingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'USERS' | 'POLICIES' | 'SYSTEM'>('POLICIES');
  const [users, setUsers] = useState<BWPUser[]>([
    { id: 'u1', name: 'Administrador Principal', email: 'admin@bwp.com', role: 'ADMIN', status: 'ACTIVE', lastSeen: 'Justo ahora' },
    { id: 'u2', name: 'Analista de Seguridad 01', email: 'analyst1@bwp.com', role: 'ANALYST', status: 'ACTIVE', lastSeen: 'Hace 5 min' },
    { id: 'u3', name: 'Observador Externo', email: 'observer@bwp.com', role: 'VIEWER', status: 'PENDING', lastSeen: 'N/A' },
  ]);

  const [policyCatalog, setPolicyCatalog] = useState<Policy[]>(POLICIES);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showNewPolicyModal, setShowNewPolicyModal] = useState(false);

  // Form State para nueva Política
  const [newGpo, setNewGpo] = useState({
    name: '',
    description: '',
    category: 'Seguridad' as PolicyCategory,
    targetType: 'Todos'
  });

  const handleCreateGpo = () => {
    if (!newGpo.name || !newGpo.description) return;
    
    const newPolicy: Policy = {
      id: `p-custom-${Date.now()}`,
      name: newGpo.name,
      description: newGpo.description,
      category: newGpo.category,
      enabled: false
    };

    setPolicyCatalog([newPolicy, ...policyCatalog]);
    setShowNewPolicyModal(false);
    setNewGpo({ name: '', description: '', category: 'Seguridad', targetType: 'Todos' });
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter flex items-center gap-4">
            <div className="bg-[#1A1A1A] p-3 rounded-2xl shadow-xl shadow-black/10 text-[#7A0C0C]">
              <Settings className="w-8 h-8" />
            </div>
            Panel de Configuración Global
          </h1>
          <p className="text-gray-500 font-medium mt-2">Gestión de identidades, políticas de grupo (GPO) y parámetros del núcleo BWP.</p>
        </div>
        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
           {(['USERS', 'POLICIES', 'SYSTEM'] as const).map(t => (
             <button 
               key={t}
               onClick={() => setActiveTab(t)}
               className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === t ? 'bg-[#7A0C0C] text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
             >
               {t === 'USERS' ? 'Usuarios & Roles' : t === 'POLICIES' ? 'Catálogo de Políticas' : 'Sistema'}
             </button>
           ))}
        </div>
      </div>

      {activeTab === 'USERS' && (
        <div className="space-y-8">
           <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="p-4 bg-gray-50 rounded-2xl text-gray-400">
                       <Users size={24} />
                    </div>
                    <div>
                       <h2 className="text-2xl font-black text-gray-900 tracking-tighter">Gestión de Acceso (IAM)</h2>
                       <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Control de analistas y permisos granulares.</p>
                    </div>
                 </div>
                 <button 
                  onClick={() => setShowInviteModal(true)}
                  className="px-8 py-4 bg-[#7A0C0C] text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[#7A0C0C]/20 flex items-center gap-2 hover:-translate-y-1 transition-all"
                 >
                    <UserPlus size={16} /> Invitar Analista
                 </button>
              </div>

              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                          <th className="px-6 py-4">Usuario</th>
                          <th className="px-6 py-4">Rol en Plataforma</th>
                          <th className="px-6 py-4">Estado</th>
                          <th className="px-6 py-4">Última Actividad</th>
                          <th className="px-6 py-4 text-right">Acciones</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                       {users.map(user => (
                         <tr key={user.id} className="group hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-5">
                               <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-[10px] font-black text-white">
                                     {user.name.substring(0,2).toUpperCase()}
                                  </div>
                                  <div className="flex flex-col">
                                     <span className="text-sm font-black text-gray-800">{user.name}</span>
                                     <span className="text-[10px] text-gray-400 font-medium">{user.email}</span>
                                  </div>
                               </div>
                            </td>
                            <td className="px-6 py-5">
                               <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                                 user.role === 'ADMIN' ? 'bg-[#7A0C0C] text-white' : 
                                 user.role === 'ANALYST' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                               }`}>
                                  {user.role}
                               </span>
                            </td>
                            <td className="px-6 py-5">
                               <div className="flex items-center gap-2">
                                  <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'ACTIVE' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
                                  <span className="text-xs font-bold text-gray-600">{user.status}</span>
                               </div>
                            </td>
                            <td className="px-6 py-5">
                               <span className="text-xs font-medium text-gray-400">{user.lastSeen}</span>
                            </td>
                            <td className="px-6 py-5 text-right">
                               <button className="p-2 text-gray-300 hover:text-gray-900 transition-colors"><Edit size={16} /></button>
                               <button className="p-2 text-gray-300 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'POLICIES' && (
        <div className="space-y-8 animate-in slide-in-from-right-10 duration-500">
           <div className="bg-[#1A1A1A] text-white p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-10">
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#7A0C0C] blur-[120px] opacity-20"></div>
              <div className="relative z-10 max-w-2xl">
                 <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-[#7A0C0C] text-white text-[9px] font-black uppercase tracking-widest rounded-lg">SOC Force</span>
                    <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Active Directory Sync: Online</span>
                 </div>
                 <h2 className="text-4xl font-black tracking-tighter mb-4 leading-tight">GPO Master Studio</h2>
                 <p className="text-base text-gray-400 font-medium leading-relaxed">
                   Diseñe políticas lógicas de nivel kernel aplicables a flotas masivas de servidores y estaciones de trabajo. Controle desde el registro de Windows hasta el endurecimiento de SSH en Linux.
                 </p>
              </div>
              <button 
                onClick={() => setShowNewPolicyModal(true)}
                className="relative z-10 px-12 py-6 bg-[#7A0C0C] text-white rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-[#7A0C0C]/40 hover:-translate-y-2 transition-all flex items-center gap-4 group"
              >
                 <Plus size={20} className="group-hover:rotate-90 transition-transform" /> Crear Nueva GPO
              </button>
           </div>

           <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-10">
                 <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                   <Layers className="text-[#7A0C0C]" size={20} /> Catálogo de Cumplimiento ({policyCatalog.length})
                 </h3>
                 <div className="flex gap-2">
                    {['Todos', 'Seguridad', 'Sistema', 'Identidad', 'Red', 'Datos'].map(c => (
                      <button key={c} className="px-4 py-2 bg-gray-50 text-gray-400 hover:text-[#7A0C0C] rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">
                        {c}
                      </button>
                    ))}
                 </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {policyCatalog.map(p => (
                   <div key={p.id} className="group p-6 rounded-[2.5rem] border border-gray-100 bg-gray-50/20 hover:bg-white hover:shadow-2xl hover:border-transparent transition-all flex flex-col h-full">
                      <div className="flex items-start justify-between mb-4">
                         <div className="p-3.5 bg-white rounded-2xl shadow-md text-[#7A0C0C] group-hover:bg-[#7A0C0C] group-hover:text-white transition-all transform group-hover:rotate-6">
                            <ShieldCheck size={24} />
                         </div>
                         <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest bg-white px-3 py-1 rounded-full shadow-sm">
                            {p.category}
                         </span>
                      </div>
                      <h4 className="text-base font-black text-gray-900 tracking-tight mb-2 leading-tight">{p.name}</h4>
                      <p className="text-[11px] text-gray-500 font-medium leading-relaxed mb-6 flex-1">
                         {p.description}
                      </p>
                      <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                         <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${p.enabled ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-gray-300'}`}></div>
                            <span className={`text-[8px] font-black uppercase tracking-widest ${p.enabled ? 'text-green-600' : 'text-gray-400'}`}>
                               {p.enabled ? 'ACTIVA' : 'PLANTILLA'}
                            </span>
                         </div>
                         <div className="flex gap-1">
                            <button className="p-2 text-gray-300 hover:text-gray-900 transition-colors"><Edit size={14} /></button>
                            <button className="p-2 text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      )}

      {/* MODAL: CREAR NUEVA GPO LOGICA */}
      {showNewPolicyModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-md p-6 animate-in fade-in duration-300">
           <div className="bg-white rounded-[4rem] w-full max-w-2xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
              {/* Header Modal */}
              <div className="p-10 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                 <div className="flex items-center gap-6">
                    <div className="p-5 bg-gray-900 rounded-[2rem] text-[#7A0C0C] shadow-xl">
                       <Zap size={32} />
                    </div>
                    <div>
                       <h3 className="text-3xl font-black text-gray-900 tracking-tighter">Nueva Política Lógica</h3>
                       <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">Definición de GPO para agentes remotos</p>
                    </div>
                 </div>
                 <button onClick={() => setShowNewPolicyModal(false)} className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-red-500 transition-all">
                    <X size={24} />
                 </button>
              </div>

              {/* Form Modal */}
              <div className="flex-1 overflow-y-auto p-12 space-y-8 custom-scrollbar">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nombre Identificador (GPO Alias)</label>
                    <input 
                      autoFocus
                      className="w-full px-8 py-5 bg-gray-50 border-2 border-transparent focus:border-[#7A0C0C] rounded-3xl outline-none font-black text-gray-900 transition-all text-lg"
                      placeholder="Ej: BLOQUEO-PAGINAS-PHISHING"
                      value={newGpo.name}
                      onChange={(e) => setNewGpo({...newGpo, name: e.target.value})}
                    />
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Descripción Técnica / Objetivo</label>
                    <textarea 
                      rows={3}
                      className="w-full px-8 py-5 bg-gray-50 border-2 border-transparent focus:border-[#7A0C0C] rounded-3xl outline-none font-bold text-gray-600 transition-all resize-none"
                      placeholder="Describa qué cambios de registro o archivos realizará esta política..."
                      value={newGpo.description}
                      onChange={(e) => setNewGpo({...newGpo, description: e.target.value})}
                    />
                 </div>

                 <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Categoría SOC</label>
                       <select 
                         className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl font-black text-gray-800 outline-none appearance-none cursor-pointer"
                         value={newGpo.category}
                         onChange={(e) => setNewGpo({...newGpo, category: e.target.value as PolicyCategory})}
                       >
                          <option>Seguridad</option>
                          <option>Red</option>
                          <option>Identidad</option>
                          <option>Datos</option>
                          <option>Sistema</option>
                          <option>Cumplimiento</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Alcance de Despliegue</label>
                       <select 
                         className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl font-black text-gray-800 outline-none appearance-none cursor-pointer"
                         value={newGpo.targetType}
                         onChange={(e) => setNewGpo({...newGpo, targetType: e.target.value})}
                       >
                          <option>Todos los Activos</option>
                          <option>Solo Servidores</option>
                          <option>Solo Estaciones de Trabajo</option>
                          <option>Solo Infraestructura Crítica</option>
                       </select>
                    </div>
                 </div>

                 <div className="p-6 bg-[#7A0C0C]/5 rounded-3xl border border-[#7A0C0C]/10 flex items-start gap-4">
                    <Info size={20} className="text-[#7A0C0C] shrink-0 mt-1" />
                    <p className="text-xs text-[#7A0C0C] font-medium leading-relaxed">
                      Esta política se guardará como **Plantilla**. Deberá activarla manualmente desde el módulo de Monitoreo para que los agentes realicen el Pull y apliquen los cambios en caliente.
                    </p>
                 </div>
              </div>

              {/* Footer Modal */}
              <div className="p-10 border-t border-gray-100 flex gap-4">
                 <button 
                  onClick={() => setShowNewPolicyModal(false)}
                  className="flex-1 py-5 bg-gray-100 text-gray-500 rounded-3xl font-black uppercase text-[10px] tracking-widest hover:bg-gray-200 transition-all"
                 >
                    Descartar GPO
                 </button>
                 <button 
                  onClick={handleCreateGpo}
                  className="flex-[2] py-5 bg-[#7A0C0C] text-white rounded-3xl font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl shadow-[#7A0C0C]/20 hover:-translate-y-1 transition-all"
                 >
                    Registrar Política Global
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Invitación Modal (Existente) */}
      {showInviteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
           <div className="bg-white rounded-[3rem] w-full max-w-md p-10 shadow-2xl animate-in zoom-in-95 duration-300">
              <h3 className="text-3xl font-black text-gray-900 tracking-tighter mb-4">Invitar Analista</h3>
              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email del Profesional</label>
                    <div className="relative">
                       <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                       <input className="w-full pl-12 pr-6 py-4 bg-gray-50 border-none rounded-2xl outline-none font-bold" placeholder="analista@empresa.com" />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Rol BWP</label>
                    <select className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl outline-none font-bold appearance-none">
                       <option>Analista de Seguridad</option>
                       <option>Observador de Cumplimiento</option>
                       <option>Administrador de Sistema</option>
                    </select>
                 </div>
              </div>
              <div className="flex gap-4 mt-10">
                 <button onClick={() => setShowInviteModal(false)} className="flex-1 py-4 text-xs font-black uppercase text-gray-400">Cancelar</button>
                 <button className="flex-2 py-4 bg-[#7A0C0C] text-white rounded-2xl text-xs font-black uppercase shadow-xl">Enviar Invitación</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default SettingsView;
