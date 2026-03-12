"use client";
import React, { useState, useRef, useEffect } from 'react';
import { 
  User, Mail, Shield, Lock, Key, 
  Camera, CheckCircle2, History, Globe, 
  Terminal, Smartphone, LogOut, Edit3,
  Fingerprint, Zap, QrCode, RefreshCw,
  Upload, X, Check, ShieldAlert, Copy, CheckCircle
} from 'lucide-react';
import { authService } from '../api/authService';

const ProfileView: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Form states
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [avatar, setAvatar] = useState('');
  const [isMfaEnabled, setIsMfaEnabled] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setName(currentUser.name || '');
      setAddress(currentUser.address || '');
      setAvatar(currentUser.profile_image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=300&h=300');
      setIsMfaEnabled(currentUser.mfa_enabled || false);
    }
  }, []);

  const handleAvatarClick = () => {
    if (isEditing) fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatar(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const updatedUser = await authService.updateProfile({
        name,
        address,
        profileImage: avatar,
        mfaEnabled: isMfaEnabled
      });
      setUser(updatedUser);
      setIsEditing(false);
      // Force refresh of other components by reloading or using a global state (here we just update local)
      window.location.reload(); 
    } catch (err) {
      console.error('Error updating profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyToken = () => {
    if (user?.api_token) {
      navigator.clipboard.writeText(user.api_token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const toggleMfa = () => {
    if (!isMfaEnabled) {
      setShowQrModal(true);
    } else {
      if(confirm("SOC WARNING: ¿Desactivar MFA? Esto reducirá el nivel de seguridad de su nodo a Nivel 1.")) {
        setIsMfaEnabled(false);
      }
    }
  };

  if (!user) return <div className="p-10 text-center font-bold text-gray-500">Cargando perfil...</div>;

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-24">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept="image/*"
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter flex items-center gap-4">
            <div className="bg-[#1A1A1A] p-3 rounded-2xl shadow-xl shadow-black/10 text-[#7A0C0C]">
              <User className="w-8 h-8" />
            </div>
            Gestión de Identidad
          </h1>
          <p className="text-gray-500 font-medium mt-2">Control maestro de credenciales y parámetros de acceso SOC.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col items-center text-center">
              <div className={`relative group mb-8 ${isEditing ? 'cursor-pointer' : ''}`} onClick={handleAvatarClick}>
                 <div className="w-40 h-40 rounded-full border-4 border-gray-50 overflow-hidden shadow-2xl relative transition-all group-hover:scale-105">
                    <img 
                      src={avatar} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      alt="Avatar"
                    />
                    {isEditing && (
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                         <Camera size={32} className="mb-1" />
                         <span className="text-[8px] font-black uppercase tracking-widest">Cambiar Foto</span>
                      </div>
                    )}
                 </div>
                 <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white shadow-lg shadow-green-500/20 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                 </div>
              </div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tighter leading-none mb-1">{user.name}</h2>
              <p className="text-[10px] font-black text-[#7A0C0C] uppercase tracking-[0.2em] mb-6">
                {user.user_type === 'company' ? 'Enterprise Security Node' : 'Personal Security Node'} • Nivel 5
              </p>
              
              <div className="w-full grid grid-cols-2 gap-4 pt-6 border-t border-gray-50">
                 <div className="flex flex-col">
                    <span className="text-[9px] font-black text-gray-400 uppercase">Estado MFA</span>
                    <span className={`text-sm font-black ${isMfaEnabled ? 'text-green-600' : 'text-red-500'}`}>
                      {isMfaEnabled ? 'Protegido' : 'Vulnerable'}
                    </span>
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[9px] font-black text-gray-400 uppercase">ID Nodo</span>
                    <span className="text-sm font-black text-gray-800">SOC-{user.id.toString().padStart(3, '0')}</span>
                 </div>
              </div>
           </div>

           <div className="bg-[#1A1A1A] p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#7A0C0C] blur-[60px] opacity-20"></div>
              <div className="flex items-center justify-between mb-8 relative z-10">
                <h3 className="text-xl font-black tracking-tighter">BWP MFA Engine</h3>
                <div 
                  onClick={isEditing ? toggleMfa : undefined}
                  className={`w-12 h-6 rounded-full relative ${isEditing ? 'cursor-pointer' : 'opacity-50'} transition-all ${isMfaEnabled ? 'bg-[#7A0C0C]' : 'bg-gray-700'}`}
                >
                   <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isMfaEnabled ? 'right-1' : 'left-1'}`}></div>
                </div>
              </div>

              <div className="space-y-4 relative z-10">
                <div className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${isMfaEnabled ? 'bg-white/5 border-white/5' : 'bg-red-500/10 border-red-500/20'}`}>
                   <div className={`p-3 rounded-xl ${isMfaEnabled ? 'bg-green-500/10 text-green-500' : 'bg-red-500 text-white'}`}>
                      {isMfaEnabled ? <Smartphone size={20} /> : <ShieldAlert size={20} />}
                   </div>
                   <div>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Seguridad de Acceso</span>
                      <p className="text-xs font-bold">{isMfaEnabled ? 'Autenticador Vinculado' : 'MFA Desactivado'}</p>
                   </div>
                </div>
                {isMfaEnabled && (
                  <button 
                    onClick={() => setShowQrModal(true)}
                    className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2"
                  >
                    <QrCode size={14} /> Ver Código de Sincronización
                  </button>
                )}
              </div>
           </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
           <section className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-10">
                 <h3 className="text-2xl font-black text-gray-900 tracking-tighter flex items-center gap-3">
                    <Edit3 className="text-[#7A0C0C]" size={20} /> Datos del Operador
                 </h3>
                 <button 
                   onClick={isEditing ? handleSave : () => setIsEditing(true)}
                   disabled={loading}
                   className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                     isEditing ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 'text-[#7A0C0C] bg-[#7A0C0C]/5 hover:bg-[#7A0C0C]/10'
                   }`}
                 >
                    {loading ? 'Procesando...' : (isEditing ? 'Guardar Cambios' : 'Editar Información')}
                 </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nombre Completo</label>
                    <input 
                      className={`w-full p-4 rounded-2xl font-bold transition-all border-2 outline-none ${
                        isEditing 
                          ? 'bg-white border-[#7A0C0C] text-gray-900 shadow-xl shadow-[#7A0C0C]/5' 
                          : 'bg-gray-50 border-transparent text-gray-800'
                      }`}
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                      readOnly={!isEditing} 
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Institucional</label>
                    <input className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-400 cursor-not-allowed" value={user.email} readOnly />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Dirección SOC</label>
                    <input 
                      className={`w-full p-4 rounded-2xl font-bold transition-all border-2 outline-none ${
                        isEditing 
                          ? 'bg-white border-[#7A0C0C] text-gray-900 shadow-xl shadow-[#7A0C0C]/5' 
                          : 'bg-gray-50 border-transparent text-gray-800'
                      }`}
                      value={address} 
                      onChange={(e) => setAddress(e.target.value)}
                      readOnly={!isEditing} 
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Token de Instalador (Global Control)</label>
                    <div className="relative">
                      <input 
                        className="w-full p-4 bg-gray-900 border-none rounded-2xl font-mono font-bold text-[#7A0C0C] pr-12" 
                        value={user.api_token} 
                        readOnly 
                      />
                      <button 
                        onClick={copyToken}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-white transition-colors"
                      >
                        {copied ? <CheckCircle size={18} className="text-green-500" /> : <Copy size={18} />}
                      </button>
                    </div>
                 </div>
              </div>
           </section>

           <section className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm">
              <h3 className="text-2xl font-black text-gray-900 tracking-tighter flex items-center gap-3 mb-10">
                 <Lock className="text-[#7A0C0C]" size={20} /> Seguridad de Cuenta
              </h3>
              <div className="space-y-6">
                 <div className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-gray-50 rounded-[2rem] gap-4 group hover:bg-white hover:shadow-xl hover:border-gray-100 border-2 border-transparent transition-all">
                    <div className="flex items-center gap-4">
                       <div className="p-3 bg-white rounded-xl shadow-sm text-gray-400 group-hover:text-[#7A0C0C]">
                          <Key size={20} />
                       </div>
                       <div>
                          <h4 className="font-black text-gray-800 text-sm">Actualizar Contraseña</h4>
                          <p className="text-[11px] text-gray-400 font-medium">Gestiona tus credenciales de acceso maestro.</p>
                       </div>
                    </div>
                    <button className="px-8 py-3 bg-white border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-[#7A0C0C] hover:text-[#7A0C0C] transition-all">Cambiar</button>
                 </div>

                 <div className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-gray-50 rounded-[2rem] gap-4 group hover:bg-white hover:shadow-xl hover:border-gray-100 border-2 border-transparent transition-all">
                    <div className="flex items-center gap-4">
                       <div className="p-3 bg-white rounded-xl shadow-sm text-gray-400 group-hover:text-[#7A0C0C]">
                          <History size={20} />
                       </div>
                       <div>
                          <h4 className="font-black text-gray-800 text-sm">Registros de Actividad</h4>
                          <p className="text-[11px] text-gray-400 font-medium">Ver auditoría completa de mis acciones en el SOC.</p>
                       </div>
                    </div>
                    <button className="px-8 py-3 bg-white border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-[#7A0C0C] hover:text-[#7A0C0C] transition-all">Ver Logs</button>
                 </div>
              </div>
           </section>
        </div>
      </div>

      {showQrModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 animate-in fade-in duration-300">
           <div className="bg-white rounded-[3.5rem] w-full max-w-md p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8">
                 <button onClick={() => setShowQrModal(false)} className="text-gray-300 hover:text-[#7A0C0C] transition-all">
                    <X size={24} />
                 </button>
              </div>
              
              <div className="text-center space-y-6">
                 <div className="bg-[#7A0C0C]/5 p-4 rounded-3xl inline-block">
                    <QrCode size={48} className="text-[#7A0C0C]" />
                 </div>
                 <div>
                    <h3 className="text-3xl font-black text-gray-900 tracking-tighter">Sincronizar MFA</h3>
                    <p className="text-sm text-gray-400 font-medium mt-1 leading-relaxed">Escanee este código con Google Authenticator o su App de confianza.</p>
                 </div>

                 <div className="bg-gray-900 p-8 rounded-[2.5rem] relative group">
                    <div className="aspect-square bg-white p-4 rounded-2xl">
                       <svg viewBox="0 0 100 100" className="w-full h-full text-black">
                          <rect x="10" y="10" width="20" height="20" fill="currentColor" />
                          <rect x="70" y="10" width="20" height="20" fill="currentColor" />
                          <rect x="10" y="70" width="20" height="20" fill="currentColor" />
                          <rect x="40" y="40" width="20" height="20" fill="currentColor" />
                          <rect x="40" y="10" width="10" height="10" fill="currentColor" />
                          <rect x="10" y="40" width="10" height="10" fill="currentColor" />
                          <rect x="70" y="40" width="10" height="20" fill="currentColor" />
                          <rect x="40" y="70" width="20" height="10" fill="currentColor" />
                          <rect x="70" y="70" width="10" height="10" fill="currentColor" />
                       </svg>
                    </div>
                    <div className="mt-6 flex flex-col items-center">
                       <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">O ingrese la clave manualmente:</span>
                       <code className="text-[#7A0C0C] font-mono font-bold tracking-[0.2em] text-sm">BWP-SOC-{user.api_token.split('-')[1]}</code>
                    </div>
                 </div>

                 <div className="space-y-4 pt-6">
                    <button 
                      onClick={() => { setIsMfaEnabled(true); setShowQrModal(false); }}
                      className="w-full py-5 bg-[#7A0C0C] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-[#7A0C0C]/30 hover:-translate-y-1 transition-all"
                    >
                       Confirmar Sincronización
                    </button>
                    <button className="flex items-center gap-2 mx-auto text-[9px] font-black text-gray-400 uppercase hover:text-gray-900 transition-colors">
                       <RefreshCw size={12} /> Regenerar Secreto de Identidad
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ProfileView;
