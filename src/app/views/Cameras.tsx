"use client";
import React, { useState, useEffect } from 'react';
import { 
  Camera, Plus, Search, ShieldAlert, Wifi, Globe, 
  Settings, RefreshCw, Zap, AlertTriangle, CheckCircle, 
  Activity, MoreVertical, Eye, Lock, HardDrive, Info,
  ExternalLink, Trash2, Server, LayoutGrid, Shield
} from 'lucide-react';
import { MOCK_DEVICES, COLORS } from '../constants';
import { Device, DeviceStatus, NetworkPort } from '../../../types';

const Cameras: React.FC = () => {
  const [cameras, setCameras] = useState<Device[]>(
    MOCK_DEVICES.filter(d => d.type === 'Camera')
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [scanningId, setScanningId] = useState<string | null>(null);
  
  // Form state
  const [newCam, setNewCam] = useState({
    name: '',
    ip: '',
    department: 'Seguridad Perimetral'
  });

  const departments = Array.from(new Set(cameras.map(c => c.department)));

  const handleAddCamera = () => {
    if (!newCam.name || !newCam.ip) return;
    
    const id = (cameras.length + 100).toString();
    const camera: Device = {
      id,
      name: newCam.name,
      type: 'Camera',
      os: 'Linux Embedded v4.2',
      ip: newCam.ip,
      status: DeviceStatus.ONLINE,
      cpu: 15,
      ram: 20,
      disk: 5,
      network: '12 Mbps',
      agentVersion: 'N/A (Agentless)',
      latency: 24,
      lastUpdate: new Date().toLocaleString(),
      protectionActive: false,
      department: newCam.department,
      vulnerabilities: [],
      policies: [],
      ports: [
        { port: 80, service: 'HTTP', status: 'open', severity: 'medium' },
        { port: 554, service: 'RTSP', status: 'open', severity: 'high' }
      ]
    };

    setCameras([...cameras, camera]);
    setShowAddModal(false);
    setNewCam({ name: '', ip: '', department: 'Seguridad Perimetral' });
    // Trigger auto-scan for new camera
    handleScan(id);
  };

  const handleScan = (id: string) => {
    setScanningId(id);
    setTimeout(() => {
      setCameras(prev => prev.map(c => {
        if (c.id === id) {
          return {
            ...c,
            status: DeviceStatus.RISK,
            vulnerabilities: ['CVE-2023-1122', 'RTSP-UNAUTH-01'],
            ports: [
              { port: 80, service: 'HTTP', status: 'open', severity: 'high' },
              { port: 554, service: 'RTSP', status: 'open', severity: 'critical' },
              { port: 8000, service: 'ONVIF', status: 'open', severity: 'medium' },
              { port: 23, service: 'Telnet', status: 'open', severity: 'critical' }
            ]
          };
        }
        return c;
      }));
      setScanningId(null);
    }, 3000);
  };

  const filteredCameras = cameras.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.ip.includes(searchTerm)
  );

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header SOC */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter flex items-center gap-4">
            <div className="bg-[#7A0C0C] p-3 rounded-2xl shadow-xl shadow-[#7A0C0C]/20">
              <Camera className="w-8 h-8 text-white" />
            </div>
            Gestión de Cámaras IP
          </h1>
          <p className="text-gray-500 font-medium mt-2">Monitoreo de integridad, puertos y vulnerabilidades de infraestructura de video.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-8 py-4 bg-[#7A0C0C] text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#8B1E1E] transition-all shadow-xl shadow-[#7A0C0C]/20 transform hover:-translate-y-1"
        >
          <Plus size={18} /> Registrar Nueva Cámara
        </button>
      </div>

      {/* Control Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar por IP, nombre de cámara o segmento de red..." 
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#7A0C0C]/10 outline-none font-bold text-gray-800"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-3 bg-gray-50 text-gray-400 hover:text-[#7A0C0C] rounded-2xl transition-all">
            <RefreshCw size={20} />
          </button>
        </div>
        <div className="bg-[#1A1A1A] p-4 rounded-3xl flex items-center justify-around">
          <div className="text-center">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Online</p>
            <p className="text-xl font-black text-green-500">{cameras.filter(c => c.status === DeviceStatus.ONLINE).length}</p>
          </div>
          <div className="w-px h-8 bg-white/10"></div>
          <div className="text-center">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Vulnerable</p>
            <p className="text-xl font-black text-red-500">{cameras.filter(c => c.status === DeviceStatus.RISK || c.status === DeviceStatus.CRITICAL).length}</p>
          </div>
        </div>
      </div>

      {/* Grouped Camera List */}
      <div className="space-y-10">
        {departments.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center text-gray-300">
            <Camera size={64} strokeWidth={1} className="mb-4 opacity-20" />
            <p className="font-bold text-xl uppercase tracking-tighter">No hay cámaras registradas</p>
          </div>
        )}

        {departments.map(dept => {
          const deptCams = filteredCameras.filter(c => c.department === dept);
          if (deptCams.length === 0) return null;
          
          return (
            <div key={dept} className="space-y-4">
              <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                <div className="w-2 h-8 bg-[#7A0C0C] rounded-full"></div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tighter">{dept}</h2>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{deptCams.length} Dispositivos Activos</p>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {deptCams.map(cam => (
                  <CameraCard 
                    key={cam.id} 
                    camera={cam} 
                    isScanning={scanningId === cam.id}
                    onScan={() => handleScan(cam.id)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Camera Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl p-10 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8">
              <button onClick={() => setShowAddModal(false)} className="text-gray-300 hover:text-[#7A0C0C] transition-all">
                <LayoutGrid size={24} className="rotate-45" />
              </button>
            </div>
            
            <div className="flex items-center gap-6 mb-10">
              <div className="w-20 h-20 bg-[#7A0C0C]/10 text-[#7A0C0C] rounded-[2rem] flex items-center justify-center">
                <Globe size={40} />
              </div>
              <div>
                <h3 className="text-3xl font-black text-gray-900 tracking-tighter">Nuevo Asset IP</h3>
                <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">Video Vigilancia BWP</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Alias de Identificación</label>
                <input 
                  autoFocus
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-[#7A0C0C] rounded-2xl outline-none font-bold text-gray-800 transition-all"
                  placeholder="Ej: CAM-PARKING-04"
                  value={newCam.name}
                  onChange={(e) => setNewCam({...newCam, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Dirección IP de Destino</label>
                <input 
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-[#7A0C0C] rounded-2xl outline-none font-mono font-bold text-gray-800 transition-all"
                  placeholder="192.168.1.XX"
                  value={newCam.ip}
                  onChange={(e) => setNewCam({...newCam, ip: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Segmento / Grupo SOC</label>
                <select 
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-[#7A0C0C] rounded-2xl outline-none font-bold text-gray-800 transition-all appearance-none"
                  value={newCam.department}
                  onChange={(e) => setNewCam({...newCam, department: e.target.value})}
                >
                  <option>Seguridad Perimetral</option>
                  <option>Acceso Principal</option>
                  <option>Servidores & DataCenter</option>
                  <option>Oficinas Administrativas</option>
                </select>
              </div>
            </div>

            <div className="mt-10 flex gap-4">
              <button 
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-all"
              >
                Cancelar
              </button>
              <button 
                onClick={handleAddCamera}
                className="flex-[2] py-4 bg-[#7A0C0C] text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[#7A0C0C]/20 hover:-translate-y-1 transition-all"
              >
                Sincronizar Asset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Internal Subcomponent: Camera Professional Card
// Added React.FC type to handle JSX key attribute correctly
const CameraCard: React.FC<{ camera: Device, isScanning: boolean, onScan: () => void }> = ({ camera, isScanning, onScan }) => {
  return (
    <div className={`
      bg-white rounded-[2.5rem] border-2 transition-all duration-500 flex flex-col overflow-hidden relative group
      ${camera.status === DeviceStatus.RISK ? 'border-orange-200' : 'border-transparent shadow-sm hover:shadow-2xl hover:border-gray-100'}
    `}>
      {isScanning && (
        <div className="absolute inset-0 bg-[#7A0C0C]/5 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center space-y-4">
           <div className="relative">
             <div className="w-16 h-16 border-4 border-[#7A0C0C]/20 border-t-[#7A0C0C] rounded-full animate-spin"></div>
             {/* Fix: Use Shield icon, ensuring it is imported from lucide-react */}
             <Shield className="absolute inset-0 m-auto text-[#7A0C0C] w-6 h-6 animate-pulse" />
           </div>
           <div className="text-center">
             <p className="text-xs font-black text-[#7A0C0C] uppercase tracking-[0.2em] animate-pulse">Deep Scan en Proceso</p>
             <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">Auditando Puertos: {camera.ip}</p>
           </div>
        </div>
      )}

      <div className="p-8 flex flex-col h-full">
        {/* Top Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-5">
            <div className={`p-5 rounded-[2rem] transition-all shadow-lg ${
              camera.status === DeviceStatus.RISK ? 'bg-orange-500 text-white shadow-orange-500/20' : 
              camera.status === DeviceStatus.ONLINE ? 'bg-green-500 text-white shadow-green-500/20' : 'bg-gray-100 text-gray-400'
            }`}>
              <Camera size={32} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                 <h3 className="text-2xl font-black text-gray-900 tracking-tighter leading-none">{camera.name}</h3>
                 <span className={`w-2 h-2 rounded-full ${camera.status === DeviceStatus.ONLINE ? 'bg-green-500' : 'bg-orange-500'}`}></span>
              </div>
              <p className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest">{camera.ip}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <button 
              onClick={onScan}
              className="p-3 bg-gray-50 text-gray-400 hover:text-[#7A0C0C] hover:bg-[#7A0C0C]/5 rounded-2xl transition-all"
              title="Iniciar Escaneo de Vulnerabilidades"
            >
              <Zap size={20} />
            </button>
          </div>
        </div>

        {/* Content Section: Ports & Security */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
               <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                 <Server size={12} /> Puertos de Servicio
               </h4>
               <span className="text-[9px] font-bold text-gray-300">ACTIVO</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {camera.ports?.map(p => (
                <div key={p.port} className="flex flex-col items-center bg-gray-50 px-3 py-2 rounded-xl border border-gray-100 min-w-[60px] group/port hover:border-[#7A0C0C]/30 transition-all">
                  <span className="text-[10px] font-black text-gray-800">{p.port}</span>
                  <span className={`text-[8px] font-bold uppercase ${
                    p.severity === 'critical' ? 'text-red-500' : 
                    p.severity === 'high' ? 'text-orange-500' : 'text-gray-400'
                  }`}>{p.service}</span>
                </div>
              )) || <p className="text-xs text-gray-300 italic">No se han auditado puertos todavía</p>}
            </div>
          </div>

          <div className="space-y-4">
             <div className="flex items-center justify-between">
               <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                 <ShieldAlert size={12} /> Hallazgos de Seguridad
               </h4>
               <span className="text-[9px] font-bold text-red-400">SOC DETECTED</span>
            </div>
            <div className="space-y-2">
              {camera.vulnerabilities.length > 0 ? (
                camera.vulnerabilities.map(v => (
                  <div key={v} className="flex items-center gap-2 bg-red-50 px-3 py-2 rounded-xl border border-red-100/50">
                    <AlertTriangle size={12} className="text-red-600" />
                    <span className="text-[10px] font-black text-red-800 uppercase tracking-tighter">{v}</span>
                  </div>
                ))
              ) : (
                <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-xl border border-green-100/50">
                  <CheckCircle size={12} className="text-green-600" />
                  <span className="text-[10px] font-black text-green-800 uppercase tracking-widest">Sin Riesgos Activos</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
           <div className="flex items-center gap-4">
             <div className="flex flex-col">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Firmware</span>
                <span className="text-[11px] font-bold text-gray-800">{camera.os}</span>
             </div>
             <div className="w-px h-6 bg-gray-100"></div>
             <div className="flex flex-col">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Latencia</span>
                <span className="text-[11px] font-bold text-green-600">{camera.latency}ms</span>
             </div>
           </div>
           <div className="flex gap-2">
              <button className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all">
                Abrir Stream
              </button>
              <button className="p-2.5 bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                <Trash2 size={16} />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Cameras;
