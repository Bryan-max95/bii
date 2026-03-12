"use client";
import React, { useState } from 'react';
import { 
  FileDown, FileText, Database, Calendar, 
  ChevronRight, Download, CheckCircle2, 
  Loader2, Filter, Shield, AlertTriangle, 
  Terminal, HardDrive, Share2, Zap
} from 'lucide-react';

interface ExportSource {
  id: string;
  name: string;
  description: string;
  icon: any;
  count: number;
}

const ExportCenter: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedSource, setSelectedSource] = useState<string>('incidents');
  const [format, setFormat] = useState<'csv' | 'xlsx' | 'json'>('csv');

  const sources: ExportSource[] = [
    { id: 'incidents', name: 'Historial de Incidentes', description: 'Reporte detallado de amenazas bloqueadas y pendientes.', icon: AlertTriangle, count: 1450 },
    { id: 'logs', name: 'Registros de Auditoría', description: 'Logs completos de sistema y acciones de usuario.', icon: Terminal, count: 85200 },
    { id: 'vulnerabilities', name: 'Inventario de CVE', description: 'Estado actual de vulnerabilidades por activo.', icon: Shield, count: 42 },
    { id: 'devices', name: 'Activos de Red', description: 'Listado completo de hardware y estado de agentes.', icon: HardDrive, count: 1248 },
  ];

  const handleExport = () => {
    setIsProcessing(true);
    setProgress(0);
    
    // Simulación de generación de reporte pesado
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsProcessing(false);
            alert(`Reporte generado exitosamente en formato ${format.toUpperCase()}`);
          }, 500);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  return (
    <div className="space-y-10 animate-in fade-in zoom-in-95 duration-700 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter flex items-center gap-4">
            <div className="bg-[#1A1A1A] p-3 rounded-2xl shadow-xl shadow-black/10 text-[#7A0C0C]">
              <FileDown className="w-8 h-8" />
            </div>
            Centro de Extracción
          </h1>
          <p className="text-gray-500 font-medium mt-2">Exportación de datos forenses y reportes de cumplimiento normativo.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Panel de Configuración */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
            <h2 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
              <Database size={20} className="text-[#7A0C0C]" /> 1. Seleccionar Origen de Datos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sources.map(source => (
                <button
                  key={source.id}
                  onClick={() => setSelectedSource(source.id)}
                  className={`flex items-start gap-4 p-6 rounded-[2rem] border-2 transition-all text-left ${
                    selectedSource === source.id 
                    ? 'border-[#7A0C0C] bg-[#7A0C0C]/5 shadow-lg' 
                    : 'border-gray-50 bg-gray-50/50 hover:border-gray-200'
                  }`}
                >
                  <div className={`p-4 rounded-2xl ${selectedSource === source.id ? 'bg-[#7A0C0C] text-white' : 'bg-white text-gray-400'}`}>
                    <source.icon size={24} />
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 tracking-tight">{source.name}</h3>
                    <p className="text-xs text-gray-400 font-medium mt-1 leading-relaxed">{source.description}</p>
                    <span className="text-[10px] font-black text-[#7A0C0C] uppercase tracking-widest mt-3 block">
                      ~{source.count.toLocaleString()} Entradas
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <Calendar size={20} className="text-[#7A0C0C]" /> 2. Rango Temporal
              </h2>
              <div className="space-y-3">
                {['Últimas 24 horas', 'Últimos 7 días', 'Este mes', 'Personalizado'].map(range => (
                  <button key={range} className="w-full py-3 px-6 bg-gray-50 hover:bg-gray-100 rounded-2xl text-xs font-black uppercase text-gray-500 text-left transition-all border border-transparent hover:border-gray-200">
                    {range}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <FileText size={20} className="text-[#7A0C0C]" /> 3. Formato de Salida
              </h2>
              <div className="flex gap-4">
                {(['csv', 'xlsx', 'json'] as const).map(fmt => (
                  <button 
                    key={fmt}
                    onClick={() => setFormat(fmt)}
                    className={`flex-1 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all border-2 ${
                      format === fmt ? 'border-[#7A0C0C] bg-[#7A0C0C] text-white' : 'border-gray-100 text-gray-400 hover:border-gray-300'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Panel de Acción / Status */}
        <div className="space-y-6">
          <div className="bg-[#1A1A1A] p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden h-full flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#7A0C0C] blur-[80px] opacity-20"></div>
            
            <div className="relative z-10">
              <h3 className="text-2xl font-black tracking-tighter mb-4">Resumen de Extracción</h3>
              <div className="space-y-4">
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-[10px] font-black text-gray-500 uppercase">Fuente</span>
                  <span className="text-sm font-bold text-[#7A0C0C] uppercase">{selectedSource}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-[10px] font-black text-gray-500 uppercase">Compresión</span>
                  <span className="text-sm font-bold">GZIP Enabled</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-[10px] font-black text-gray-500 uppercase">Seguridad</span>
                  <span className="text-sm font-bold text-green-500 uppercase">Encriptado AES-256</span>
                </div>
              </div>
            </div>

            <div className="mt-12 relative z-10">
              {isProcessing ? (
                <div className="space-y-6 animate-pulse">
                   <div className="flex justify-between items-end">
                      <div className="flex items-center gap-3">
                        <Loader2 className="animate-spin text-[#7A0C0C]" />
                        <span className="text-xs font-black uppercase tracking-widest">Generando...</span>
                      </div>
                      <span className="text-2xl font-black">{progress}%</span>
                   </div>
                   <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-[#7A0C0C] transition-all duration-300" style={{ width: `${progress}%` }}></div>
                   </div>
                   <p className="text-[10px] text-gray-500 font-medium italic">Compilando datos desde el nodo maestro...</p>
                </div>
              ) : (
                <button 
                  onClick={handleExport}
                  className="w-full py-6 bg-[#7A0C0C] text-white rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-[#7A0C0C]/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
                >
                  <Zap size={18} /> Iniciar Extracción
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportCenter;
