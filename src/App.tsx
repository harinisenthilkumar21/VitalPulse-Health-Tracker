/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './components/Layout/Sidebar';
import Topbar from './components/Layout/Topbar';
import Dashboard from './pages/Dashboard';
import TrackData from './pages/TrackData';
import Insights from './pages/Insights';
import Alerts from './pages/Alerts';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import Settings from './pages/Settings';
import { Page, User } from './types';
import { AnimatePresence, motion } from 'motion/react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [activePage, setActivePage] = useState<Page>('dashboard');
  const [user, setUser] = useState<User | null>(null);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }

    // Initialize theme
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;
    const id = Number(user.id);
    if (!Number.isFinite(id) || id < 1) return;
    const token = localStorage.getItem('token');
    if (!token) return;

    let cancelled = false;
    void (async () => {
      try {
        const { data } = await axios.get<{ user: User }>(`/api/profile/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (cancelled || !data?.user) return;
        setUser(data.user);
        try {
          localStorage.setItem('user', JSON.stringify(data.user));
        } catch {
          /* localStorage quota — user stays in memory with avatar from DB */
        }
      } catch {
        /* offline or API down — keep cached user */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, String(user?.id ?? '')]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleLogin = (userData: any) => {
    setIsAuthenticated(true);
    setUser(userData.user);
    localStorage.setItem('token', userData.token);
    try {
      localStorage.setItem('user', JSON.stringify(userData.user));
    } catch {
      /* quota */
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setActivePage('dashboard');
  };

  const handleRegister = () => {
    setIsRegistering(false);
  };

  if (!isAuthenticated) {
    if (isRegistering) {
      return <Register onRegister={handleRegister} onNavigateToLogin={() => setIsRegistering(false)} />;
    }
    return <Login onLogin={handleLogin} onNavigateToRegister={() => setIsRegistering(true)} />;
  }

  const renderPage = () => {
    if (!user) return null;
    switch (activePage) {
      case 'dashboard':
        return <Dashboard onPageChange={setActivePage} user={user} globalSearchQuery={globalSearchQuery} />;
      case 'track':
        return <TrackData user={user} />;
      case 'insights':
        return <Insights user={user} />;
      case 'alerts':
        return <Alerts user={user} />;
      case 'profile':
        return <Profile user={user} setUser={setUser} />;
      case 'settings':
        return <Settings user={user} onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme} />;
      default:
        return <Dashboard onPageChange={setActivePage} user={user} globalSearchQuery={globalSearchQuery} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900 antialiased">
      <Sidebar 
        activePage={activePage} 
        onPageChange={setActivePage} 
        onLogout={handleLogout} 
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar 
          user={user} 
          onLogout={handleLogout} 
          onPageChange={setActivePage} 
          searchQuery={globalSearchQuery}
          onSearchChange={setGlobalSearchQuery}
        />
        
        <main className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
