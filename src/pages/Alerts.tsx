import React, { useState, useEffect } from 'react';
import { AlertCircle, Bell, Filter, MoreVertical, Search, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import axios from 'axios';
import { User } from '../types';

interface AlertsProps {
  user: User;
}

const Alerts: React.FC<AlertsProps> = ({ user }) => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get(`/api/alerts/${user.id}`, { headers });
        setAlerts(response.data);
      } catch (err: any) {
        setError('Failed to load alerts');
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, [user.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
<Loader2 className="animate-spin text-sky-500" size={32} />      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Health Alerts</h1>
          <p className="text-slate-500 mt-1">Stay informed about your health status and critical updates.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
            <Filter size={18} />
            Filter
          </button>
<button className="px-6 py-2 bg-sky-500 text-white rounded-xl text-sm font-bold hover:bg-sky-600 transition-all shadow-md">            Mark all as read
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-sm font-medium">
          {error}
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                <th className="px-8 py-4">Severity</th>
                <th className="px-8 py-4">Message</th>
                <th className="px-8 py-4">Time</th>
                
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {alerts.map((alert) => (
                <tr key={alert.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border",
                      alert.severity === 'High' ? "bg-rose-50 text-rose-600 border-rose-100" : 
                      alert.severity === 'Medium' ? "bg-amber-50 text-amber-600 border-amber-100" : 
                      "bg-emerald-50 text-emerald-600 border-emerald-100"
                    )}>
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        alert.severity === 'High' ? "bg-rose-600" : 
                        alert.severity === 'Medium' ? "bg-amber-600" : 
                        "bg-emerald-600"
                      )} />
                      {alert.severity}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-semibold text-slate-900">{alert.message}</p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm text-slate-500">{new Date(alert.created_at).toLocaleString()}</p>
                  </td>
                  
                </tr>
              ))}
              {alerts.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-8 py-12 text-center text-slate-500 font-medium">
                    No alerts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {alerts.length > 10 && (
          <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-center">
            <button className="text-sm font-bold text-indigo-600 hover:underline">Load more alerts</button>
          </div>
        )}
      </div>

      {/* Alert Settings Preview removed as per request */}
    </div>
  );
};

export default Alerts;
