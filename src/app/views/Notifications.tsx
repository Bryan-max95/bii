"use client";
import React, { useState } from 'react';
import { 
  Bell, Settings, ShieldAlert, CheckCircle2, 
  Mail, MessageSquare, Globe, Info, Clock, 
  Filter, Trash2, Sliders, Zap, Smartphone,
  ExternalLink, MoreVertical, Search, BellRing, Shield
} from 'lucide-react';

interface Alert {
  id: string;
  type: 'CRITICAL' | 'SECURITY' | 'SYSTEM' | 'INFO';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const Notifications: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'inbox' | 'settings'>('inbox');
  const [alerts, setAlerts] = useState<Alert[]>([
    { id: '1', type: 'CRITICAL', title: 'Intento de Infiltración Bloqueado', message: 'Se detectó fuerza bruta en SRV-PROD-01 desde IP 45.12.33.1.', time: '2 min ago', read: false },
    { id: '2', type: 'SECURITY', title: 'Nueva Vulnerabilidad Detectada', message: 'El equipo CEO-MACBOOK presenta CVE-2024-5511 (Crítico).', time: '15 min ago', read: false },
    { id: '3', type: 'SYSTEM', title: 'Backup Completado', message: 'Sincronización de logs de auditoría finalizada exitosamente.', time: '1 hour ago', read: true },
    { id: '4', type: 'INFO', title: 'Actualización de Agentes', message: '12 equipos han sido actualizados a la versión v2.5.5.', time: '3 hours ago', read: true },
  ]);

  const markAllRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, read: true })));
  };

  return (
    <div className="space-y-10 animate-in slide-in-from-bottom-6 duration-700 pb-24">
      {/* Header SOC */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter flex items-center gap-4">
            <div className="bg-[#1A1A1A] p-3 rounded-2xl shadow-xl shadow-black/10 text-[#7A0C0C]">
              <BellRing className="w-8 h-8" />
            </div>
            Notification Hub
          </h1>
          <p className="text-gray-500 font-medium mt-2">Centro de Alerta Temprana y gestión de respuesta inmediata.</p>
        </div>
        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
           <button onClick={() => setActiveTab('inbox')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'inbox' ? 'bg-[#7A0C0C] text-white' : 'text-gray-400'}`}>Alert Inbox</button>
           <button onClick={() => setActiveTab('settings')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'settings' ? 'bg-[#7A0C0C] text-white' : 'text-gray-400'}`}>Settings</button>
        </div>
      </div>

      {activeTab === 'inbox' ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
           {/* Sidebar Filtros */}
           <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                 <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Categorías</h3>
                 <div className="space-y-2">
                    {['Todos', 'Críticos', 'Seguridad', 'Sistema'].map(f => (
                      <button key={f} className={`w-full flex items-center justify-between p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${f === 'Todos' ? 'bg-gray-50 text-gray-900' : 'text-gray-400 hover:bg-gray-50'}`}>
                        {f}
                        <span className="bg-gray-100 px-2 py-0.5 rounded-lg text-[8px]">{f === 'Todos' ? alerts.length : 0}</span>
                      </button>
                    ))}
                 </div>
              </div>
              <button className="w-full py-4 bg-gray-900 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-2" onClick={markAllRead}>
                 <CheckCircle2 size={14} /> Marcar Leídos
              </button>
           </div>

           {/* Listado de Alertas */}
           <div className="lg:col-span-3 space-y-4">
              {alerts.map(alert => (
                <div key={alert.id} className={`bg-white p-8 rounded-[2.5rem] border transition-all flex items-start gap-6 group relative overflow-hidden ${!alert.read ? 'border-[#7A0C0C]/30 shadow-lg' : 'border-gray-100'}`}>
                   {!alert.read && <div className="absolute top-0 left-0 w-2 h-full bg-[#7A0C0C]"></div>}
                   
                   <div className={`p-4 rounded-2xl shrink-0 ${
                     alert.type === 'CRITICAL' ? 'bg-red-500 text-white shadow-red-500/20' :
                     alert.type === 'SECURITY' ? 'bg-orange-500 text-white shadow-orange-500/20' : 'bg-blue-500 text-white shadow-blue-500/20'
                   }`}>
                     <ShieldAlert size={24} />
                   </div>

                   <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                           <span className="text-[10px] font-black text-[#7A0C0C] uppercase tracking-[0.2em]">{alert.type}</span>
                           <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                           <div className="flex items-center gap-1.5 text-gray-400">
                              <Clock size={10} />
                              <span className="text-[9px] font-bold">{alert.time}</span>
                           </div>
                        </div>
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-50 rounded-full text-gray-400">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                      <h3 className="text-xl font-black text-gray-900 tracking-tighter mb-2 group-hover:text-[#7A0C0C] transition-colors">{alert.title}</h3>
                      <p className="text-sm font-medium text-gray-500 leading-relaxed">{alert.message}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      ) : (
        <div className="max-w-4xl space-y-8">
           <section className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
              <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                <Smartphone size={20} className="text-[#7A0C0C]" /> Canales de Comunicación
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <IntegrationToggle 
                  icon={Mail} 
                  name="Correo Electrónico" 
                  desc="Reportes diarios e incidentes críticos." 
                  enabled={true} 
                  color="bg-blue-500"
                />
                <IntegrationToggle 
                  icon={MessageSquare} 
                  name="Slack Integration" 
                  desc="Streaming de alertas en tiempo real al canal SOC." 
                  enabled={false} 
                  color="bg-purple-600"
                />
                <IntegrationToggle 
                  icon={Globe} 
                  name="Webhooks (API)" 
                  desc="Enviar JSON de incidentes a un endpoint externo." 
                  enabled={true} 
                  color="bg-[#7A0C0C]"
                />
                <IntegrationToggle 
                  icon={Shield} 
                  name="BWP Mobile Alert" 
                  desc="Notificaciones Push en la App de administrador." 
                  enabled={true} 
                  color="bg-black"
                />
              </div>
           </section>

           <section className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
              <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                <Sliders size={20} className="text-[#7A0C0C]" /> Reglas de Disparo
              </h3>
              <div className="space-y-4">
                 <div className="flex items-center justify-between p-6 bg-gray-50 rounded-[2rem]">
                    <div>
                       <h4 className="font-black text-gray-900 text-sm">Nivel de Sensibilidad</h4>
                       <p className="text-[11px] text-gray-500 font-medium">Alertar solo incidentes con severidad mayor a MEDIUM.</p>
                    </div>
                    <select className="bg-white border-none rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest outline-none shadow-sm">
                       <option>High / Critical Only</option>
                       <option>All Alerts</option>
                       <option>Critical Only</option>
                    </select>
                 </div>
                 <div className="flex items-center justify-between p-6 bg-gray-50 rounded-[2rem]">
                    <div>
                       <h4 className="font-black text-gray-900 text-sm">Resumen Ejecutivo</h4>
                       <p className="text-[11px] text-gray-500 font-medium">Enviar PDF consolidado todos los lunes a las 08:00 AM.</p>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className="w-10 h-6 bg-[#7A0C0C] rounded-full relative">
                          <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                       </div>
                    </div>
                 </div>
              </div>
           </section>
        </div>
      )}
    </div>
  );
};

const IntegrationToggle = ({ icon: Icon, name, desc, enabled, color }: any) => (
  <div className="bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100 flex items-start gap-4">
     <div className={`p-4 rounded-2xl text-white shadow-lg ${color}`}>
        <Icon size={20} />
     </div>
     <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
           <h4 className="font-black text-gray-900 text-xs uppercase tracking-tight">{name}</h4>
           <div className={`w-2 h-2 rounded-full ${enabled ? 'bg-green-500 shadow-lg shadow-green-500/40' : 'bg-gray-300'}`}></div>
        </div>
        <p className="text-[10px] text-gray-400 font-medium leading-tight mb-4">{desc}</p>
        <button className="text-[9px] font-black text-[#7A0C0C] uppercase tracking-[0.2em] flex items-center gap-1 hover:underline">
           Configurar <ExternalLink size={10} />
         </button>
     </div>
  </div>
);

export default Notifications;
