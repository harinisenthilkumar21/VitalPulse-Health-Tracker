import React, { useState, useEffect } from 'react';
import { Bell, Search, User as UserIcon, Settings, LogOut, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { User } from '../../types';
import axios from 'axios';

interface TopbarProps {
  user: User;
  onLogout: () => void;
  onPageChange: (page: any) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const Topbar: React.FC<TopbarProps> = ({ user, onLogout, onPageChange, searchQuery, onSearchChange }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [alertCount, setAlertCount] = useState(0);

  useEffect(() => {
    const fetchAlertCount = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/api/alerts/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const highSeverityAlerts = response.data.filter((a: any) => a.severity === 'High');
        setAlertCount(highSeverityAlerts.length);
      } catch (error) {
        console.error('Error fetching alert count:', error);
      }
    };

    fetchAlertCount();
    const interval = setInterval(fetchAlertCount, 60000);
    return () => clearInterval(interval);
  }, [user.id]);

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30">
      
      <div className="h-full px-8 flex items-center justify-between">

        {/* SEARCH */}
        <div className="flex-1 max-w-xl">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors" size={20} />
            
            <input 
              type="text" 
              placeholder="Search health records, insights, or alerts..." 
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-sky-200 focus:border-sky-400 transition-all text-slate-900 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-6">

          {/* ALERTS */}
          <button 
            onClick={() => onPageChange('alerts')}
            className="relative p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl transition-all group"
          >
            <Bell size={22} className="group-hover:scale-110 transition-transform" />

            {alertCount > 0 && (
              <span className="absolute top-2 right-2 w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white animate-bounce">
                {alertCount}
              </span>
            )}
          </button>

          <div className="w-px h-8 bg-slate-200" />

          {/* PROFILE */}
          <div className="relative">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 p-1.5 pr-4 hover:bg-slate-100 rounded-2xl transition-all group"
            >
              <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-sky-200 group-hover:border-sky-400 transition-colors flex items-center justify-center bg-sky-100 text-sky-600 font-bold text-sm shrink-0">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  user.name.split(' ').map(n => n[0]).join('')
                )}
              </div>

              <div className="text-left hidden sm:block">
                <p className="text-sm font-bold text-slate-900 leading-none">{user.name}</p>
                <p className="text-[10px] font-medium text-slate-400 mt-1 uppercase tracking-wider">
                  Premium Member
                </p>
              </div>

              <ChevronDown 
                size={16} 
                className={cn("text-slate-400 transition-transform duration-300", isProfileOpen && "rotate-180")} 
              />
            </button>

            {/* DROPDOWN */}
            <AnimatePresence>
              {isProfileOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50"
                >
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Account
                    </p>
                    <p className="text-sm font-medium text-slate-900 mt-1 truncate">
                      {user.email}
                    </p>
                  </div>

                  <div className="p-2">

                    <button 
                      onClick={() => { onPageChange('profile'); setIsProfileOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                      <UserIcon size={18} />
                      My Profile
                    </button>

                    <button 
                      onClick={() => { onPageChange('settings'); setIsProfileOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                      <Settings size={18} />
                      Account Settings
                    </button>

                    <div className="h-px bg-slate-100 my-2 mx-2" />

                    <button 
                      onClick={onLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <LogOut size={18} />
                      Sign Out
                    </button>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Topbar;