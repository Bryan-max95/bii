"use client";
import React, { useState, useMemo } from 'react';
import { 
  Eye, Zap, ShieldAlert, Target, Activity, 
  Search, Filter, Plus, ChevronRight, 
  Flame, Skull, Globe, Laptop, Camera, 
  Server, Lock, UserCheck, Share2, Settings,
  BarChart3, LayoutDashboard, Sparkles
} from 'lucide-react';
import { MOCK_INCIDENTS, MOCK_DEVICES, MOCK_LOGS } from '../constants';
import { Severity } from '../../../types';

interface SmartViewCard {
  id: string;
  title: string;
  description: string;
  icon: any;
  count: number;
  heatLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  color: string;
  tags: string[];
}

const SmartViews: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Lógica de agregación inteligente de datos
  const smartViewsData: SmartViewCard[] = useMemo(() => {
    return [
      {
        id: 'sv-ransomware',
        title: 'Patrones de Ransomware',
        description: 'Detecciones que coinciden con comportamientos de cifrado masivo y exfiltración.',
        icon: Skull,
        count: MOCK_INCIDENTS.filter(i => i.title.toLowerCase().includes('ransomware')).length,
        heatLevel: 'Critical',
        color: '#7A0C0C',
        tags: ['Cifrado', 'Bloqueo Automático', 'LockBit 3.0']
      },
      {
        id: 'sv-crit-infra',
        title: 'Infraestructura Crítica',
        description: 'Todo evento detectado en Servidores de Base de Datos y Controladores de Dominio.',
        icon: Server,
        count: MOCK_INCIDENTS.filter(i => i.targetType === 'Server' && i.severity === Severity.CRITICAL).length,
        heatLevel: 'High',
        color: '#E11D48',
        tags: ['Datacenter', 'Impacto Alto']
      },
      {
        id: 'sv-iot-unprotected',
        title: 'IoT No Protegido (IP)',
        description: 'Vulnerabilidades y accesos anómalos en cámaras y dispositivos sin agente BWP.',
        icon: Camera,
        count: MOCK_DEVICES.filter(d => d.type === 'Camera' && d.status === 'risk').length,
        heatLevel: 'Medium',
        color: '#F97316',
        tags: ['Cámaras', 'Shadow IP', 'RTSP']
      },
      {
        id: 'sv-lateral-mv',
        title: 'Movimientos Laterales',
        description: 'Detección de saltos entre estaciones de trabajo y accesos remotos no autorizados.',
        icon: Globe,
        count: MOCK_INCIDENTS.filter(i => i.title.toLowerCase().includes('ssh') || i.title.toLowerCase().includes('unauthorized')).length,
        heatLevel: 'High',
        color: '#8B5CF6',
        tags: ['SSH', 'RDP', 'Brute Force']
      },
      {
        id: 'sv-shadow-it',
        title: 'Shadow IT / Apps No Firmadas',
        description: 'Software no autorizado intentando ejecutarse en el endpoint.',
        icon: Laptop,
        count: MOCK_INCIDENTS.filter(i => i.title.toLowerCase().includes('app') || i.title.toLowerCase().includes('anydesk')).length,
        heatLevel: 'Low',
        color: '#3B82F6',
        tags: ['Políticas', 'Endpoint Control']
      },
      {
        id: 'sv-admin-audit',
        title: 'Auditoría de Privilegios',
        description: 'Registros de acciones realizadas por usuarios con nivel de administración.',
        icon: UserCheck,
        count: MOCK_LOGS.filter(l => l.user === 'Admin').length,
        heatLevel: 'Low',
        color: '#10B981',
        tags: ['Compliance', 'Admin Actions']
      }
    ];
  }, []);

  const filteredViews = smartViewsData.filter(v => 
    v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-10 animate-in slide-in-from-right-4 duration-700 pb-24">
      {/* Header SOC */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter flex items-center gap-4">
            <div className="bg-[#1A1A1A] p-3 rounded-2xl shadow-xl shadow-black/10">
              <Sparkles className="w-8 h-8 text-[#7A0C0C]" />
            </div>
            Smart Views
          </h1>
          <p className="text-gray-500 font-medium mt-2">Perspectivas inteligentes basadas en analítica de comportamiento y criticidad.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm">
             Sincronizar Vistas
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-[#7A0C0C] text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#8B1E1E] transition-all shadow-lg shadow-[#7A0C0C]/20">
            <Plus size={16} /> Crear Vista Personalizada
          </button>
        </div>
      </div>

      {/* View Browser Bar */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-wrap items-center gap-6">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar por perspectiva, amenaza o etiqueta..." 
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#7A0C0C]/10 outline-none font-bold text-gray-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
           <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2">Heat Filter:</span>
           {['Critical', 'High', 'Medium', 'Low'].map(lvl => (
             <button key={lvl} className="px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-[9px] font-black uppercase text-gray-500 hover:border-[#7A0C0C] transition-all">
               {lvl}
             </button>
           ))}
        </div>
      </div>

      {/* Grid de Smart Views */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredViews.map(view => (
          <ViewCard key={view.id} view={view} />
        ))}
      </div>

      {/* Preview Section */}
      <div className="bg-[#1A1A1A] p-10 rounded-[3rem] text-white overflow-hidden relative border border-white/5">
         <div className="absolute top-0 right-0 w-96 h-96 bg-[#7A0C0C]/10 blur-[100px] rounded-full"></div>
         <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="max-w-2xl">
               <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-[#7A0C0C] animate-pulse"></div>
                  <span className="text-[10px] font-black text-[#7A0C0C] uppercase tracking-widest">BWP Deep Intelligence</span>
               </div>
               <h2 className="text-3xl font-black tracking-tighter mb-4 leading-tight">¿Deseas una vista basada en predicción?</h2>
               <p className="text-gray-400 font-medium leading-relaxed">
                 Activa el motor de **Inteligencia Predictiva** para que el sistema cree Smart Views automáticas basadas en el historial de ataques sufridos por empresas de tu mismo sector industrial.
               </p>
            </div>
            <button className="px-10 py-5 bg-[#7A0C0C] text-white rounded-[1.5rem] font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-[#7A0C0C]/40 hover:-translate-y-1 transition-all">
               Activar Predictor SOC
            </button>
         </div>
      </div>
    </div>
  );
};

// Subcomponent: ViewCard
// Added React.FC type to handle JSX key attribute correctly
const ViewCard: React.FC<{ view: SmartViewCard }> = ({ view }) => {
  const Icon = view.icon;
  
  const heatColors = {
    Critical: 'text-red-600 bg-red-50',
    High: 'text-orange-600 bg-orange-50',
    Medium: 'text-yellow-600 bg-yellow-50',
    Low: 'text-blue-600 bg-blue-50'
  };

  return (
    <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group flex flex-col h-full relative overflow-hidden">
      {/* Background intensity indicator */}
      <div 
        className="absolute top-0 right-0 w-40 h-40 opacity-5 blur-[60px] group-hover:opacity-10 transition-opacity" 
        style={{ backgroundColor: view.color }}
      ></div>

      <div className="flex items-start justify-between mb-8 relative z-10">
        <div className={`p-5 rounded-[2rem] text-white shadow-xl transition-transform group-hover:rotate-6`} style={{ backgroundColor: view.color }}>
          <Icon size={32} />
        </div>
        <div className="flex flex-col items-end gap-3">
           <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${heatColors[view.heatLevel]}`}>
             <Flame size={12} className={view.heatLevel === 'Critical' ? 'animate-pulse' : ''} />
             Heat: {view.heatLevel}
           </div>
           <button className="p-2 text-gray-300 hover:text-gray-900 transition-all">
             <Settings size={18} />
           </button>
        </div>
      </div>

      <div className="flex-1 relative z-10">
        <h3 className="text-2xl font-black text-gray-900 tracking-tighter mb-3 group-hover:text-[#7A0C0C] transition-colors leading-none">
          {view.title}
        </h3>
        <p className="text-sm text-gray-400 font-medium leading-relaxed mb-8">
          {view.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-8">
           {view.tags.map(tag => (
             <span key={tag} className="text-[9px] font-black bg-gray-50 text-gray-400 px-3 py-1 rounded-full border border-gray-100 uppercase tracking-tighter">
               #{tag}
             </span>
           ))}
        </div>
      </div>

      <div className="mt-auto pt-8 border-t border-gray-50 flex items-center justify-between relative z-10">
         <div className="flex items-center gap-4">
            <div className="flex flex-col">
               <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Incidentes</span>
               <span className="text-2xl font-black text-gray-900">{view.count}</span>
            </div>
            <div className="w-px h-8 bg-gray-100"></div>
            <div className="flex flex-col">
               <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Tendencia</span>
               <div className="flex items-center gap-1 text-green-500">
                  <Activity size={12} />
                  <span className="text-xs font-black">Estable</span>
               </div>
            </div>
         </div>
         <button className="flex items-center gap-2 px-6 py-3 bg-[#1A1A1A] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#7A0C0C] transition-all shadow-lg group-hover:scale-105">
           Investigar <ChevronRight size={14} />
         </button>
      </div>
    </div>
  );
};

export default SmartViews;
