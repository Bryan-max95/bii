"use client";
import React, { useState, useMemo } from 'react';
import { 
  Shield, Server, Monitor, Camera, Globe, 
  Cpu, Activity, ShieldAlert, CheckCircle, 
  ChevronRight, Zap, Settings, Search,
  Database, Share2, Filter, HardDrive,
  Lock, AlertTriangle, Layers, ShieldCheck
} from 'lucide-react';
import { MOCK_DEVICES, COLORS } from '../constants';
import { Device, DeviceStatus } from '../../../types';

interface CategoryStats {
  id: string;
  name: string;
  description: string;
  icon: any;
  total: number;
  online: number;
  riskCount: number;
  protectionCoverage: number;
  type: 'AGENT' | 'IP_REMOTE' | 'CLOUD';
  color: string;
}

const Categories: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Lógica de cálculo de categorías dinámicas basadas en los activos actuales
  const categoryData: CategoryStats[] = useMemo(() => {
    return [
      {
        id: 'cat-servers',
        name: 'Servidores Críticos',
        description: 'Infraestructura central, bases de datos y controladores de dominio.',
        icon: Server,
        total: MOCK_DEVICES.filter(d => d.type === 'Server').length + 5, // Mock extra
        online: MOCK_DEVICES.filter(d => d.type === 'Server' && d.status === DeviceStatus.ONLINE).length + 4,
        riskCount: MOCK_DEVICES.filter(d => d.type === 'Server' && d.status === DeviceStatus.CRITICAL).length,
        protectionCoverage: 98,
        type: 'AGENT',
        color: '#7A0C0C'
      },
      {
        id: 'cat-workstations',
        name: 'Estaciones de Trabajo',
        description: 'Laptops y PCs de escritorio con agente BWP instalado.',
        icon: Monitor,
        total: MOCK_DEVICES.filter(d => d.type === 'PC').length + 120,
        online: 112,
        riskCount: 2,
        protectionCoverage: 94,
        type: 'AGENT',
        color: '#3B82F6'
      },
      {
        id: 'cat-iot',
        name: 'Dispositivos IoT / Cámaras',
        description: 'Cámaras IP y sensores monitoreados vía IP/RTSP.',
        icon: Camera,
        total: MOCK_DEVICES.filter(d => d.type === 'Camera').length + 15,
        online: 12,
        riskCount: 1,
        protectionCoverage: 0, // No agent support
        type: 'IP_REMOTE',
        color: '#F97316'
      },
      {
        id: 'cat-network',
        name: 'Infraestructura de Red',
        description: 'Routers, Switches y Firewalls perimetrales monitoreados por SNMP.',
        icon: Globe,
        total: 8,
        online: 8,
        riskCount: 0,
        protectionCoverage: 100,
        type: 'IP_REMOTE',
        color: '#10B981'
      },
      {
        id: 'cat-cloud',
        name: 'Nube & Microservicios',
        description: 'Instancias AWS EC2, contenedores y activos elásticos.',
        icon: Database,
        total: 24,
        online: 24,
        riskCount: 0,
        protectionCoverage: 100,
        type: 'CLOUD',
        color: '#8B5CF6'
      }
    ];
  }, []);

  const filteredCategories = categoryData.filter(cat => 
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in zoom-in-95 duration-700 pb-24">
      {/* Header Corporativo */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter flex items-center gap-4">
            <div className="bg-[#1A1A1A] p-3 rounded-2xl shadow-xl shadow-black/10">
              <Layers className="w-8 h-8 text-[#7A0C0C]" />
            </div>
            Categorización de Activos
          </h1>
          <p className="text-gray-500 font-medium mt-2">Gestión de la superficie de ataque segmentada por tipo de activo.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm">
             Re-escanear Segmentos
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-[#7A0C0C] text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#8B1E1E] transition-all shadow-lg shadow-[#7A0C0C]/20">
            <Zap size={16} /> Acción Global
          </button>
        </div>
      </div>

      {/* Control & Search Bar */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-wrap items-center gap-6">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Filtrar categorías por nombre o función..." 
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#7A0C0C]/10 outline-none font-bold text-gray-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Agente BWP</span>
           </div>
           <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Monitoreo IP</span>
           </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredCategories.map(cat => (
          <CategoryCard key={cat.id} category={cat} />
        ))}
        
        {/* Add New Category Card */}
        <button className="group border-2 border-dashed border-gray-200 rounded-[3rem] p-10 flex flex-col items-center justify-center text-gray-300 hover:border-[#7A0C0C] hover:text-[#7A0C0C] transition-all hover:bg-[#7A0C0C]/5 min-h-[400px]">
           <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-6 group-hover:bg-[#7A0C0C] group-hover:text-white transition-all shadow-inner">
             <PlusIcon size={32} />
           </div>
           <h3 className="text-xl font-black tracking-tighter uppercase mb-2">Nueva Categoría</h3>
           <p className="text-sm font-medium opacity-60">Definir un nuevo segmento lógico</p>
        </button>
      </div>
    </div>
  );
};

const PlusIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

// Subcomponent: Category Card
// Added React.FC type to handle JSX key attribute correctly
const CategoryCard: React.FC<{ category: CategoryStats }> = ({ category }) => {
  const Icon = category.icon;
  
  return (
    <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group relative overflow-hidden flex flex-col min-h-[420px]">
      {/* Visual background indicator */}
      <div className="absolute top-0 right-0 w-32 h-32 blur-[80px] opacity-10" style={{ backgroundColor: category.color }}></div>
      
      {/* Card Header */}
      <div className="flex items-start justify-between mb-8 relative z-10">
        <div className="p-5 rounded-[2rem] text-white shadow-xl" style={{ backgroundColor: category.color }}>
          <Icon size={32} />
        </div>
        <div className="flex flex-col items-end">
           <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
             category.type === 'AGENT' ? 'bg-blue-50 text-blue-600' :
             category.type === 'IP_REMOTE' ? 'bg-orange-50 text-orange-600' : 'bg-purple-50 text-purple-600'
           }`}>
             {category.type.replace('_', ' ')}
           </span>
           <button className="mt-4 p-2 text-gray-300 hover:text-gray-900 transition-all">
             <Settings size={18} />
           </button>
        </div>
      </div>

      {/* Info Section */}
      <div className="flex-1 relative z-10">
        <h3 className="text-2xl font-black text-gray-900 tracking-tighter mb-2 group-hover:text-[#7A0C0C] transition-colors">
          {category.name}
        </h3>
        <p className="text-sm text-gray-400 font-medium leading-relaxed mb-8">
          {category.description}
        </p>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-6 mb-8">
           <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100">
              <span className="block text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Activos Totales</span>
              <span className="text-2xl font-black text-gray-900 tracking-tighter">{category.total}</span>
           </div>
           <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100">
              <span className="block text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Disponibilidad</span>
              <span className="text-2xl font-black text-green-500 tracking-tighter">
                {Math.round((category.online / category.total) * 100)}%
              </span>
           </div>
        </div>

        {/* Health Bar */}
        <div className="space-y-3">
           <div className="flex justify-between items-end">
             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
               <ShieldCheck size={12} className="text-green-500" /> Protección BWP
             </span>
             <span className="text-xs font-black text-gray-800">{category.protectionCoverage}%</span>
           </div>
           <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
             <div 
               className="h-full bg-gradient-to-r from-[#7A0C0C] to-[#DC2626] transition-all duration-1000"
               style={{ width: `${category.protectionCoverage}%` }}
             ></div>
           </div>
        </div>
      </div>

      {/* Actions Footer */}
      <div className="mt-8 pt-8 border-t border-gray-50 flex items-center justify-between relative z-10">
         <div className="flex items-center gap-2">
            {category.riskCount > 0 ? (
              <div className="flex items-center gap-1.5 text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-100">
                 <ShieldAlert size={12} />
                 <span className="text-[10px] font-black uppercase tracking-tighter">{category.riskCount} Riesgos</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                 <CheckCircle size={12} />
                 <span className="text-[10px] font-black uppercase tracking-tighter">Seguro</span>
              </div>
            )}
         </div>
         <button className="flex items-center gap-1 text-[10px] font-black text-[#7A0C0C] uppercase tracking-widest hover:underline">
           Ver Activos <ChevronRight size={14} />
         </button>
      </div>
    </div>
  );
};

export default Categories;
