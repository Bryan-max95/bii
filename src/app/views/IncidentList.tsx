"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { 
  AlertTriangle, Search, Filter, Download, MoreVertical, 
  ChevronRight, ArrowUpDown, ShieldAlert, CheckCircle, 
  Clock, Monitor, Server, Camera, HardDrive, FilterX,
  FileText, Trash2, LayoutList, Target
} from 'lucide-react';
import { authService } from '../api/authService';
import { Incident, Severity } from '../../../types';

const IncidentList: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<Severity | 'ALL'>('ALL');
  const [filterStatus, setFilterStatus] = useState<string | 'ALL'>('ALL');
  const [filterType, setFilterType] = useState<string | 'ALL'>('ALL');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Incident, direction: 'asc' | 'desc' } | null>(null);

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    setIsLoading(true);
    try {
      const data = await authService.getIncidents();
      if (Array.isArray(data)) {
        setIncidents(data);
      }
    } catch (err) {
      console.error('Error fetching incidents:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Lógica de Filtrado Completa
  const filteredData = useMemo(() => {
    return incidents.filter(inc => {
      const matchesSearch = 
        inc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        inc.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inc.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSeverity = filterSeverity === 'ALL' || inc.severity === filterSeverity;
      const matchesStatus = filterStatus === 'ALL' || inc.status === filterStatus;
      const matchesType = filterType === 'ALL' || inc.targetType === filterType;

      return matchesSearch && matchesSeverity && matchesStatus && matchesType;
    });
  }, [incidents, searchTerm, filterSeverity, filterStatus, filterType]);

  // Lógica de Ordenamiento
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;
    const sorted = [...filteredData].sort((a, b) => {
      if (a[sortConfig.key]! < b[sortConfig.key]!) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key]! > b[sortConfig.key]!) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredData, sortConfig]);

  const requestSort = (key: keyof Incident) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSeverityBadge = (sev: Severity) => {
    const styles = {
      [Severity.CRITICAL]: 'bg-red-600 text-white',
      [Severity.HIGH]: 'bg-orange-500 text-white',
      [Severity.MEDIUM]: 'bg-yellow-500 text-black',
      [Severity.LOW]: 'bg-blue-500 text-white',
    };
    return <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${styles[sev]}`}>{sev}</span>;
  };

  const getStatusBadge = (status: string) => {
    const styles: any = {
      'Blocked': 'text-green-600 bg-green-50 border-green-100',
      'Monitoring': 'text-blue-600 bg-blue-50 border-blue-100',
      'Pending': 'text-yellow-600 bg-yellow-50 border-yellow-100',
      'Dismissed': 'text-gray-400 bg-gray-50 border-gray-100',
    };
    return <span className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-tighter ${styles[status]}`}>{status}</span>;
  };

  const getTargetIcon = (type: string) => {
    switch(type) {
      case 'Server': return <Server size={14} />;
      case 'Camera': return <Camera size={14} />;
      case 'PC': return <Monitor size={14} />;
      default: return <HardDrive size={14} />;
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilterSeverity('ALL');
    setFilterStatus('ALL');
    setFilterType('ALL');
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header SOC */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter flex items-center gap-4">
            <div className="bg-[#1A1A1A] p-3 rounded-2xl shadow-xl shadow-black/10">
              <LayoutList className="w-8 h-8 text-[#7A0C0C]" />
            </div>
            Lista Maestra de Incidencias
          </h1>
          <p className="text-gray-500 font-medium mt-2">Visión tabular de todas las detecciones registradas por la infraestructura BWP.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm">
            <FileText size={16} /> Exportar Reporte
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-[#7A0C0C] text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#8B1E1E] transition-all shadow-lg shadow-[#7A0C0C]/20">
            <Download size={16} /> Descargar CSV
          </button>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <QuickStat label="Total Incidentes" value={incidents.length} color="gray" icon={Target} />
        <QuickStat label="Críticos / Alta" value={incidents.filter(i => i.severity === Severity.CRITICAL || i.severity === Severity.HIGH).length} color="red" icon={ShieldAlert} />
        <QuickStat label="Pendientes SOC" value={incidents.filter(i => i.status === 'Pending').length} color="yellow" icon={Clock} />
        <QuickStat label="Mitigados Hoy" value={incidents.filter(i => i.status === 'Blocked').length} color="green" icon={CheckCircle} />
      </div>

      {/* Advanced Filters */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar por ID, nombre del incidente o IP..." 
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#7A0C0C]/10 outline-none font-bold text-gray-800"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <FilterSelect 
              label="Gravedad" 
              value={filterSeverity} 
              onChange={setFilterSeverity} 
              options={['ALL', Severity.CRITICAL, Severity.HIGH, Severity.MEDIUM, Severity.LOW]} 
            />
            <FilterSelect 
              label="Estado" 
              value={filterStatus} 
              onChange={setFilterStatus} 
              options={['ALL', 'Blocked', 'Monitoring', 'Pending', 'Dismissed']} 
            />
            <FilterSelect 
              label="Tipo Activo" 
              value={filterType} 
              onChange={setFilterType} 
              options={['ALL', 'PC', 'Server', 'Camera', 'Router']} 
            />
            <button 
              onClick={resetFilters}
              className="p-3 text-gray-400 hover:text-[#7A0C0C] hover:bg-gray-50 rounded-xl transition-all"
              title="Limpiar Filtros"
            >
              <FilterX size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 font-black text-[9px] uppercase tracking-[0.2em] border-b border-gray-100">
                <th className="px-8 py-4 cursor-pointer hover:text-gray-900 transition-colors" onClick={() => requestSort('severity')}>
                  <div className="flex items-center gap-2">Gravedad <ArrowUpDown size={12} /></div>
                </th>
                <th className="px-8 py-4">Incidencia / ID</th>
                <th className="px-8 py-4 cursor-pointer hover:text-gray-900 transition-colors" onClick={() => requestSort('timestamp')}>
                  <div className="flex items-center gap-2">Fecha / Hora <ArrowUpDown size={12} /></div>
                </th>
                <th className="px-8 py-4">Activo Afectado</th>
                <th className="px-8 py-4">Departamento</th>
                <th className="px-8 py-4">Estado</th>
                <th className="px-8 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 font-medium text-xs">
              {sortedData.map(inc => (
                <tr key={inc.id} className="hover:bg-gray-50/80 transition-all group">
                  <td className="px-8 py-5">
                    {getSeverityBadge(inc.severity)}
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="font-black text-gray-900 text-sm tracking-tighter group-hover:text-[#7A0C0C] transition-colors">{inc.title}</span>
                      <span className="text-[10px] font-mono text-gray-400 mt-0.5">{inc.id}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Clock size={12} />
                      <span className="font-bold">{inc.timestamp}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg text-gray-400">
                        {getTargetIcon(inc.targetType)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-gray-800">{inc.target}</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase">{inc.targetType}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-[10px] font-black text-gray-500 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-tighter">
                      {inc.department}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    {getStatusBadge(inc.status)}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button className="p-2 hover:bg-white border border-transparent hover:border-gray-200 rounded-xl transition-all text-gray-400 hover:text-[#7A0C0C]">
                         <MoreVertical size={16} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {sortedData.length === 0 && (
            <div className="py-24 flex flex-col items-center justify-center text-gray-300">
              <ShieldAlert size={64} strokeWidth={1} className="mb-4 opacity-10" />
              <p className="font-bold text-xl uppercase tracking-tighter opacity-20">No se encontraron incidentes con estos criterios</p>
              <button onClick={resetFilters} className="mt-4 text-[#7A0C0C] font-black text-[10px] uppercase tracking-widest hover:underline">Limpiar todos los filtros</button>
            </div>
          )}
        </div>

        {/* Footer de Tabla */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
           <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mostrando {sortedData.length} de {incidents.length} registros totales</span>
           <div className="flex items-center gap-2">
              <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-[10px] font-black uppercase text-gray-400 hover:text-gray-900 transition-all">Anterior</button>
              <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-[10px] font-black uppercase text-gray-400 hover:text-gray-900 transition-all">Siguiente</button>
           </div>
        </div>
      </div>
    </div>
  );
};

// Subcomponente: Filtro Estilizado
const FilterSelect = ({ label, value, options, onChange }: any) => (
  <div className="flex items-center bg-gray-50 px-4 py-2.5 rounded-2xl border border-transparent hover:border-gray-200 transition-all">
    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-3">{label}:</span>
    <select 
      className="bg-transparent text-xs font-black uppercase tracking-tighter text-gray-800 outline-none cursor-pointer"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);

// Subcomponente: Estadística Rápida
const QuickStat = ({ label, value, color, icon: Icon }: any) => {
  const colorMap: any = {
    red: 'bg-red-50 text-red-600 border-red-100',
    green: 'bg-green-50 text-green-600 border-green-100',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-100',
    gray: 'bg-gray-50 text-gray-600 border-gray-200',
  };
  
  return (
    <div className={`p-5 rounded-[2rem] border flex items-center gap-5 bg-white shadow-sm transition-transform hover:-translate-y-1 ${colorMap[color]}`}>
      <div className={`p-3 rounded-2xl ${colorMap[color]} border-none shadow-sm`}>
        <Icon size={24} />
      </div>
      <div>
        <h4 className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1">{label}</h4>
        <p className="text-2xl font-black tracking-tighter leading-none">{value}</p>
      </div>
    </div>
  );
};

export default IncidentList;
