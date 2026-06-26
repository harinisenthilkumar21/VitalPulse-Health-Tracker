import React from 'react';
import { 
  LayoutDashboard, 
  Activity, 
  LineChart, 
  Bell, 
  User, 
  LogOut,
  HeartPulse,
  Settings
} from 'lucide-react';
import { Page } from '../../types';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

interface SidebarProps {
  activePage: Page;
  onPageChange: (page: Page) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onPageChange, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'track', label: 'Track Data', icon: Activity },
    { id: 'insights', label: 'Insights', icon: LineChart },
    { id: 'alerts', label: 'Alerts', icon: Bell },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0">

      {/* LOGO */}
      <div className="p-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center text-white shadow-md">
          <HeartPulse size={24} />
        </div>
        <span className="font-bold text-xl text-slate-900 tracking-tight">
          VitalPulse
        </span>
      </div>

      {/* MENU */}
      <nav className="flex-1 px-4 py-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id as Page)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 group relative overflow-hidden",
                isActive 
                  ? "text-white font-bold shadow-md"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              {/* ACTIVE BACKGROUND */}
              {isActive && (
                <motion.div 
                  layoutId="active-pill"
                  className="absolute inset-0 bg-gradient-to-r from-sky-500 to-cyan-400 z-0"
                />
              )}

              <Icon
                size={20}
                className={cn(
                  "z-10 transition-colors",
                  isActive
                    ? "text-white"
                    : "text-slate-400 group-hover:text-slate-900"
                )}
              />

              <span className="z-10">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* LOGOUT */}
      <div className="p-6 border-t border-slate-200">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all duration-200 font-medium"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>

    </aside>
  );
};

export default Sidebar;