

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MENU_ITEMS,  } from '../../constants';
import { Shield, ChevronLeft, ChevronRight, Menu, Globe } from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`
      ${isCollapsed ? 'w-20' : 'w-64'} 
      h-full bg-[#1A1A1A] text-white flex flex-col border-r border-white/5 transition-all duration-500 ease-in-out relative z-40
    `}>
      {/* Collapse Toggle Button - Posicionado fuera del área de scroll */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 bg-[#7A0C0C] p-1.5 rounded-xl border border-white/20 text-white z-[60] hover:bg-[#8B1E1E] transition-all shadow-2xl hover:scale-110 active:scale-95 flex items-center justify-center"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Logo Section - Fixed Header */}
      <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
        <div className="bg-gradient-to-br from-[#7A0C0C] to-[#450606] p-2.5 rounded-2xl shadow-xl shadow-black/40 shrink-0">
          <Shield className="w-6 h-6 text-white" />
        </div>
        {!isCollapsed && (
          <div className="flex flex-col">
            <span className="font-black text-xl tracking-tighter leading-none">BWP</span>
            <span className="text-[8px] font-black text-[#7A0C0C] tracking-[0.3em] uppercase mt-0.5">Cyber-SOC</span>
          </div>
        )}
      </div>

      {/* Navigation Items - Only this area scrolls */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-3 pb-6">
        <nav className="space-y-1">
          {MENU_ITEMS.map((item, idx) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={idx}
                to={item.path}
                title={isCollapsed ? item.name : ''}
                className={`
                  flex items-center px-4 py-3 text-[11px] transition-all duration-300 group relative rounded-xl
                  ${isActive 
                    ? 'bg-[#7A0C0C] text-white font-black shadow-lg shadow-[#7A0C0C]/20' 
                    : 'text-gray-500 hover:bg-white/5 hover:text-white'}
                  ${isCollapsed ? 'justify-center' : 'justify-between'}
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-gray-600 group-hover:text-[#7A0C0C]'}`} />
                  {!isCollapsed && <span className="truncate font-bold uppercase tracking-widest">{item.name}</span>}
                </div>
                
                {!isCollapsed && item.badge && (
                  <span className={`
                    px-1.5 py-0.5 rounded-md text-[8px] font-black 
                    ${item.alert ? 'bg-[#7A0C0C] text-white animate-pulse' : 'bg-white/10 text-gray-400'}
                  `}>
                    {item.badge}
                  </span>
                )}

                {isCollapsed && item.badge && (
                  <span className="absolute top-2 right-3 w-1.5 h-1.5 rounded-full bg-[#7A0C0C] shadow-lg shadow-[#7A0C0C]/50"></span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Status - Fixed Footer */}
      <div className={`p-5 border-t border-white/5 bg-black/20 ${isCollapsed ? 'flex justify-center' : ''}`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#7A0C0C]/20 border border-[#7A0C0C]/30 flex items-center justify-center font-black text-[#7A0C0C] text-xs shrink-0">
            AD
          </div>
          {!isCollapsed && (
            <div className="flex flex-col truncate">
              <span className="text-xs font-black text-white truncate">Administrator</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                 <div className="w-1 h-1 rounded-full bg-green-500"></div>
                 <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">Node Active</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
