"use client";
import React from 'react';
import { 
  FileText, Download, Share2, TrendingUp, ShieldCheck, 
  AlertOctagon, CheckCircle2, BarChart3, Clock, Target,
  ArrowUpRight, ArrowDownRight, Info, Zap
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, BarChart, Bar, Cell, PieChart, Pie 
} from 'recharts';
import { MOCK_DEVICES, MOCK_INCIDENTS, COLORS, POLICIES } from '../constants';
import { Severity } from '../../../types';

const ExecutiveSummary: React.FC = () => {
  // Lógica de cálculo de métricas
  const totalDevices = MOCK_DEVICES.length;
  const criticalVulnerabilities = MOCK_DEVICES.reduce((acc, d) => acc + d.vulnerabilities.length, 0);
  const healthScore = 84; // Cálculo simulado basado en riesgos
  
  const complianceData = [
    { name: 'Seguridad', value: 92 },
    { name: 'Red', value: 85 },
    { name: 'Datos', value: 78 },
    { name: 'Identidad', value: 95 },
    { name: 'Sistema', value: 88 },
  ];

  const trendData = [
    { day: 'Lun', incidents: 4 },
    { day: 'Mar', incidents: 7 },
    { day: 'Mie', incidents: 5 },
    { day: 'Jue', incidents: 12 },
    { day: 'Vie', incidents: 8 },
    { day: 'Sab', incidents: 3 },
    { day: 'Dom', incidents: 2 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-700 pb-20">
      {/* Header Corporativo */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 bg-[#7A0C0C]/10 text-[#7A0C0C] text-[10px] font-black uppercase tracking-widest rounded">Confidencial</span>
            <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Reporte Generado: {new Date().toLocaleDateString()}</span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter flex items-center gap-3">
            <FileText className="w-10 h-10 text-[#7A0C0C]" />
            Executive Security Summary
          </h1>
          <p className="text-gray-500 font-medium mt-1">Análisis integral de la postura de ciberseguridad y resiliencia de BWP Platform.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm">
            <Share2 size={16} /> Compartir
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-[#7A0C0C] text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#8B1E1E] transition-all shadow-lg shadow-[#7A0C0C]/20">
            <Download size={16} /> Exportar Reporte PDF
          </button>
        </div>
      </div>

      {/* Main KPI Row */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Health Score Card */}
        <div className="bg-[#1A1A1A] text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[250px]">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Health Score</span>
              <ShieldCheck className="text-green-500 w-5 h-5" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-black tracking-tighter">{healthScore}</span>
              <span className="text-gray-500 font-bold">/100</span>
            </div>
          </div>
          <div className="relative z-10 mt-4">
            <p className="text-sm text-gray-400 leading-relaxed">Su infraestructura presenta un <span className="text-green-400 font-bold">Nivel de Riesgo Bajo</span> con una mejora del 4% este mes.</p>
          </div>
          {/* Decorative background circle */}
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[#7A0C0C]/10 rounded-full blur-3xl"></div>
        </div>

        <SummaryKpiCard 
          label="Superficie de Ataque" 
          value={`${totalDevices} Activos`} 
          subValue="42% Nodos en Nube" 
          icon={Target} 
          trend={+2} 
        />
        <SummaryKpiCard 
          label="Detecciones Críticas" 
          value={MOCK_INCIDENTS.length} 
          subValue="2 Bloqueados Automáticamente" 
          icon={AlertOctagon} 
          trend={-15} 
          negativeIsGood
        />
        <SummaryKpiCard 
          label="Tiempo de Respuesta" 
          value="18m" 
          subValue="MTTR (Mean Time To Respond)" 
          icon={Clock} 
          trend={-5} 
          negativeIsGood
        />
      </div>

      {/* Insights & Narrativa */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-[#7A0C0C] p-2.5 rounded-2xl shadow-lg shadow-[#7A0C0C]/10"><Zap className="w-5 h-5 text-white" /></div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tighter">BWP Intelligence Insights</h2>
            </div>
            <span className="text-[10px] font-black bg-gray-100 text-gray-400 px-3 py-1 rounded-full uppercase tracking-widest">AI Analysis</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="p-5 bg-green-50 rounded-3xl border border-green-100">
                <h4 className="text-green-800 font-black text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                  <CheckCircle2 size={14} /> Fortalezas de Seguridad
                </h4>
                <p className="text-sm text-green-700 leading-relaxed font-medium">
                  El 95% de los puntos finales tienen el agente BWP en la versión v2.5.4, garantizando protección contra las últimas variantes de Ransomware detectadas esta semana.
                </p>
              </div>
              <div className="p-5 bg-red-50 rounded-3xl border border-red-100">
                <h4 className="text-red-800 font-black text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                  <AlertOctagon size={14} /> Áreas de Atención
                </h4>
                <p className="text-sm text-red-700 leading-relaxed font-medium">
                  Se detectó un incremento de escaneos de red en el segmento de Servidores. Se recomienda activar la política "Port Knocking" global para mitigar reconocimiento externo.
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-center border-l border-gray-100 pl-8">
               <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Tendencia de Incidentes (7 días)</h4>
               <div className="h-40 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#7A0C0C" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#7A0C0C" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#9CA3AF'}} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', fontSize: '12px' }}
                      />
                      <Area type="monotone" dataKey="incidents" stroke="#7A0C0C" strokeWidth={3} fill="url(#colorInc)" />
                    </AreaChart>
                  </ResponsiveContainer>
               </div>
            </div>
          </div>
        </div>

        {/* Compliance Pie */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col">
          <h2 className="text-xl font-black text-gray-900 tracking-tighter mb-6 flex items-center gap-2">
            <BarChart3 className="text-[#7A0C0C] w-5 h-5" />
            Cumplimiento por Categoría
          </h2>
          <div className="flex-1 space-y-5">
            {complianceData.map(item => (
              <div key={item.name} className="space-y-1.5">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{item.name}</span>
                  <span className="text-sm font-black text-gray-800">{item.value}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#7A0C0C] to-[#8B1E1E] transition-all duration-1000" 
                    style={{ width: `${item.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-2 text-[#7A0C0C]">
              <Info size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Alineado con el marco NIST CSF</span>
            </div>
          </div>
        </div>
      </div>

      {/* Asset Risk Table */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tighter">Puntos Finales de Alto Riesgo</h2>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Dispositivos que requieren intervención inmediata</p>
          </div>
          <button className="text-xs font-black text-[#7A0C0C] hover:bg-[#7A0C0C]/5 px-4 py-2 rounded-xl transition-all">Ver Análisis de Vulnerabilidades</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 font-black text-[9px] uppercase tracking-[0.2em] border-b border-gray-100">
                <th className="px-8 py-4 text-center">Riesgo</th>
                <th className="px-8 py-4">Activo</th>
                <th className="px-8 py-4">Departamento</th>
                <th className="px-8 py-4">Amenazas Detectadas</th>
                <th className="px-8 py-4">Agente</th>
                <th className="px-8 py-4 text-right">Acción Sugerida</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium text-sm">
              {MOCK_DEVICES.filter(d => d.vulnerabilities.length > 1 || d.status === 'critical').map(d => (
                <tr key={d.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-8 py-5">
                    <div className={`w-3 h-3 rounded-full mx-auto ${d.status === 'critical' ? 'bg-red-500 animate-pulse' : 'bg-orange-500'}`}></div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="font-black text-gray-800">{d.name}</span>
                      <span className="text-[10px] font-mono text-gray-400">{d.ip}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full uppercase">{d.department}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex gap-1.5">
                      {d.vulnerabilities.map(v => (
                        <span key={v} className="text-[9px] font-black bg-red-100 text-red-600 px-2 py-0.5 rounded uppercase tracking-tighter">{v}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="font-mono text-xs font-bold text-[#7A0C0C]">{d.agentVersion}</span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="px-4 py-1.5 bg-[#7A0C0C] text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-md hover:-translate-y-0.5 transition-all">
                      Remediar Ahora
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Internal Subcomponent for KPI Cards
const SummaryKpiCard = ({ label, value, subValue, icon: Icon, trend, negativeIsGood = false }: any) => {
  const isUp = trend > 0;
  const isPositiveTrend = negativeIsGood ? !isUp : isUp;

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
      <div className="flex items-start justify-between mb-6">
        <div className="p-4 bg-gray-50 rounded-2xl text-gray-400 group-hover:bg-[#7A0C0C]/5 group-hover:text-[#7A0C0C] transition-colors">
          <Icon size={24} />
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black ${isPositiveTrend ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {Math.abs(trend)}%
        </div>
      </div>
      <div>
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1.5">{label}</h3>
        <p className="text-3xl font-black text-gray-900 tracking-tighter mb-2">{value}</p>
        <p className="text-xs text-gray-500 font-medium">{subValue}</p>
      </div>
    </div>
  );
};

export default ExecutiveSummary;
