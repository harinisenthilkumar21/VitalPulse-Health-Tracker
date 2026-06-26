import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Calendar,
  ChevronRight,
  Loader2
} from 'lucide-react';
import Charts from '../components/Dashboard/Charts';
import { cn } from '../lib/utils';
import axios from 'axios';
import { User } from '../types';

interface InsightsProps {
  user: User;
}

const Insights: React.FC<InsightsProps> = ({ user }) => {
  const [vitals, setVitals] = useState<any[]>([]);
  const [lifestyle, setLifestyle] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        
        const [vitalsRes, lifestyleRes] = await Promise.all([
          axios.get(`/api/vitals/${user.id}`, { headers }),
          axios.get(`/api/lifestyle/${user.id}`, { headers })
        ]);

        setVitals(vitalsRes.data);
        setLifestyle(lifestyleRes.data);
      } catch (error) {
        console.error('Error fetching insights data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        {/* ✅ FIXED */}
        <Loader2 className="animate-spin text-sky-500" size={32} />
      </div>
    );
  }

  const avgHeartRate = vitals.length > 0 
    ? Math.round(vitals.reduce((acc, curr) => acc + curr.heart_rate, 0) / vitals.length) 
    : 0;
  
  const avgSleep = lifestyle.length > 0 
    ? (lifestyle.reduce((acc, curr) => acc + curr.sleep_hours, 0) / lifestyle.length).toFixed(1) 
    : 0;

  const avgSteps = lifestyle.length > 0 
    ? Math.round(lifestyle.reduce((acc, curr) => acc + curr.steps, 0) / lifestyle.length) 
    : 0;

  return (
    <div className="space-y-8 pb-12">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Health Insights</h1>
          <p className="text-slate-500 mt-1">Deep dive into your health trends and patterns.</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-1 rounded-xl border border-slate-200">
          {/* ✅ FIXED */}
          <button className="px-4 py-2 text-sm font-bold bg-sky-500 text-white rounded-lg shadow-sm">Weekly</button>
          <button className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-900 rounded-lg">Monthly</button>
          <button className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-900 rounded-lg">Yearly</button>
        </div>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* ✅ FIXED */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-sky-50 text-sky-600 rounded-lg">
              <TrendingUp size={20} />
            </div>
            <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full">+12%</span>
          </div>
          <p className="text-sm text-slate-500">Avg. Heart Rate</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{avgHeartRate} bpm</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Calendar size={20} />
            </div>
            <span className="text-xs font-bold text-rose-500 bg-rose-50 px-2 py-1 rounded-full">-5%</span>
          </div>
          <p className="text-sm text-slate-500">Avg. Sleep</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{avgSleep} hrs</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Target size={20} />
            </div>
            <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full">+18%</span>
          </div>
          <p className="text-sm text-slate-500">Avg. Daily Steps</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{avgSteps.toLocaleString()}</p>
        </div>
      </div>

      {/* CHARTS */}
      <div className="space-y-8">

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-900">Activity Trends</h3>

            {/* ✅ FIXED */}
            <button className="text-sm font-bold text-sky-600 hover:underline flex items-center gap-2">
              Export Data <ChevronRight size={16} />
            </button>
          </div>

          <Charts 
            data={lifestyle.slice().reverse().map(l => ({
              day: new Date(l.recorded_at).toLocaleDateString([], { weekday: 'short' }),
              steps: l.steps
            }))} 
            type="bar" 
            dataKey="steps" 
            color="#ec4899" 
            xAxisKey="day" 
          />
        </div>

        <div className="grid grid-cols-2 gap-8">

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-8">Heart Rate Variability</h3>
            <Charts 
              data={vitals.slice().reverse().map(v => ({
                time: new Date(v.recorded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                value: v.heart_rate
              }))} 
              type="line" 
              dataKey="value" 
              color="#f59e0b" 
              xAxisKey="time" 
            />
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-8">Sleep Quality</h3>
            <Charts 
              data={lifestyle.slice().reverse().map(l => ({
                day: new Date(l.recorded_at).toLocaleDateString([], { weekday: 'short' }),
                hours: l.sleep_hours
              }))} 
              type="area" 
              dataKey="hours" 
              color="#8b5cf6" 
              xAxisKey="day" 
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Insights;