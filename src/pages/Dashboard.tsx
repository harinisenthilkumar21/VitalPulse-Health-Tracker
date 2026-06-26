import React, { useState, useEffect } from "react";
import {
  Heart,
  Activity,
  Thermometer,
  Droplets,
  Flame,
  Moon,
  Footprints,
  TrendingUp,
  AlertCircle,
  Trophy,
  Plus,
  Edit2,
  Search,
  X,
  Check,
} from "lucide-react";
import VitalsCard from "../components/Dashboard/VitalsCard";
import Charts from "../components/Dashboard/Charts";
import { cn } from "../lib/utils";
import { motion } from "motion/react";
import axios from "axios";
import { User } from "../types";

interface DashboardProps {
  onPageChange: (page: any) => void;
  user: User;
  globalSearchQuery?: string;
}

const Dashboard: React.FC<DashboardProps> = ({
  onPageChange,
  user,
  globalSearchQuery = "",
}) => {
  const [vitals, setVitals] = useState<any[]>([]);
  const [lifestyle, setLifestyle] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [editType, setEditType] = useState<"vitals" | "lifestyle" | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const [vitalsRes, lifestyleRes, alertsRes] = await Promise.all([
        axios.get(`/api/vitals/${user.id}`, { headers }),
        axios.get(`/api/lifestyle/${user.id}`, { headers }),
        axios.get(`/api/alerts/${user.id}`, { headers }),
      ]);

      setVitals(vitalsRes.data);
      setLifestyle(lifestyleRes.data);
      setAlerts(alertsRes.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user.id]);

  const calculateStreak = () => {
    if (lifestyle.length === 0) return 0;

    const dates = lifestyle.map((l: any) =>
      new Date(l.recorded_at).toDateString(),
    );
    const uniqueDates = Array.from(new Set(dates)).map((d: any) => new Date(d));
    uniqueDates.sort((a, b) => b.getTime() - a.getTime());

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let currentStreak = 0;
    let lastDate = uniqueDates[0];

    const diffDays = Math.floor(
      (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (diffDays > 1) return 0;

    currentStreak = 1;
    for (let i = 1; i < uniqueDates.length; i++) {
      const diff = Math.floor(
        (uniqueDates[i - 1].getTime() - uniqueDates[i].getTime()) /
          (1000 * 60 * 60 * 24),
      );
      if (diff === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
    return currentStreak;
  };

  const handleEdit = (record: any, type: "vitals" | "lifestyle") => {
    setEditingRecord({ ...record });
    setEditType(type);
  };

  const handleSaveEdit = async () => {
    if (!editingRecord || !editType) return;
    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      if (editType === "vitals") {
        await axios.put(`/api/vitals/${editingRecord.id}`, editingRecord, {
          headers,
        });
      } else {
        await axios.put(`/api/lifestyle/${editingRecord.id}`, editingRecord, {
          headers,
        });
      }

      await fetchData();
      setEditingRecord(null);
      setEditType(null);
    } catch (error) {
      console.error("Error saving record:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const latestVital = vitals[0] || {};
  const latestLifestyle = lifestyle[0] || {};

  const calculateHealthScore = () => {
    if (!latestVital.heart_rate) return 85; // Default if no data

    let score = 100;

    // Heart Rate (Normal: 60-100)
    if (latestVital.heart_rate > 100 || latestVital.heart_rate < 60)
      score -= 15;

    // BP (Normal: <120/80)
    if (latestVital.systolic_bp > 140) score -= 20;
    else if (latestVital.systolic_bp > 130) score -= 10;

    // SpO2 (Normal: 95-100)
    if (latestVital.spo2 < 95) score -= 20;
    else if (latestVital.spo2 < 97) score -= 10;

    // Lifestyle factors
    if (latestLifestyle.steps < 5000) score -= 5;
    if (latestLifestyle.sleep_hours < 6) score -= 5;

    return Math.max(0, score);
  };

  const healthScore = calculateHealthScore();
  const streak = calculateStreak();

  const getHealthStatus = (score: number) => {
    if (score >= 80)
      return {
        label: "Normal",
        color: "text-emerald-500",
        border: "border-emerald-100",
        bg: "bg-emerald-50",
      };
    if (score >= 60)
      return {
        label: "Warning",
        color: "text-amber-500",
        border: "border-amber-100",
        bg: "bg-amber-50",
      };
    return {
      label: "Critical",
      color: "text-rose-500",
      border: "border-rose-100",
      bg: "bg-rose-50",
    };
  };

  const healthStatus = getHealthStatus(healthScore);

  const filteredVitals = vitals.filter(
    (v: any) =>
      new Date(v.recorded_at as any)
        .toLocaleDateString()
        .includes(searchQuery) || "vitals".includes(searchQuery.toLowerCase()),
  );

  const filteredLifestyle = lifestyle.filter(
    (l: any) =>
      new Date(l.recorded_at as any)
        .toLocaleDateString()
        .includes(searchQuery) ||
      "lifestyle".includes(searchQuery.toLowerCase()) ||
      (l.activity &&
        l.activity.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  // Global search filtering
  const globalFilteredVitals = vitals.filter(
    (v: any) =>
      new Date(v.recorded_at as any)
        .toLocaleDateString()
        .includes(globalSearchQuery) ||
      "vitals".includes(globalSearchQuery.toLowerCase()),
  );

  const globalFilteredLifestyle = lifestyle.filter(
    (l: any) =>
      new Date(l.recorded_at as any)
        .toLocaleDateString()
        .includes(globalSearchQuery) ||
      "lifestyle".includes(globalSearchQuery.toLowerCase()) ||
      (l.activity &&
        l.activity.toLowerCase().includes(globalSearchQuery.toLowerCase())),
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
    {/* Global Search Results Overlay/Section */}
{globalSearchQuery && (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-sky-50 p-6 rounded-3xl border border-sky-100 shadow-sm"
  >
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-bold text-sky-800 flex items-center gap-2">
        <Search size={20} />
        Search Results for "{globalSearchQuery}"
      </h3>
      <p className="text-sm text-sky-600 font-medium">
        {globalFilteredVitals.length + globalFilteredLifestyle.length} results found
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      {globalFilteredVitals.map((v) => (
        <div
          key={`gv-${v.id}`}
          className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between shadow-sm hover:shadow-md transition"
        >
          <div>
            <span className="px-2 py-0.5 bg-rose-50 text-rose-600 text-[10px] font-bold rounded uppercase">
              Vitals
            </span>

            <p className="text-sm font-bold text-slate-900 mt-1">
              HR: {v.heart_rate} | BP: {v.systolic_bp}/{v.diastolic_bp}
            </p>

            <p className="text-[10px] text-slate-400 mt-1">
              {new Date(v.recorded_at).toLocaleString()}
            </p>
          </div>

          <button
            onClick={() => handleEdit(v, "vitals")}
            className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all"
          >
            <Edit2 size={16} />
          </button>
        </div>
      ))}

      {globalFilteredLifestyle.map((l) => (
        <div
          key={`gl-${l.id}`}
          className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between shadow-sm hover:shadow-md transition"
        >
          <div>
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded uppercase">
              Lifestyle
            </span>

            <p className="text-sm font-bold text-slate-900 mt-1">
              Steps: {l.steps} | Sleep: {l.sleep_hours}h
            </p>

            <p className="text-[10px] text-slate-400 mt-1">
              {new Date(l.recorded_at).toLocaleString()}
            </p>
          </div>

          <button
            onClick={() => handleEdit(l, "lifestyle")}
            className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all"
          >
            <Edit2 size={16} />
          </button>
        </div>
      ))}

      {globalFilteredVitals.length === 0 &&
        globalFilteredLifestyle.length === 0 && (
          <div className="col-span-full py-8 text-center text-slate-400 text-sm bg-white rounded-2xl border border-dashed border-slate-200">
            No records match your search query.
          </div>
        )}

    </div>
  </motion.div>
)}

     {/* Header Section */}
<div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
  <div>
    <h1 className="text-3xl font-bold text-slate-900">
      Welcome, {user.name}
    </h1>
    <p className="text-slate-500 mt-1">
      Here's what's happening with your body today.
    </p>
  </div>

  <div className="flex items-center gap-4">

    <div
      className={cn(
        "bg-white px-6 py-3 rounded-2xl border border-slate-200 flex items-center gap-4 shadow-sm transition-all",
        healthStatus.border
      )}
    >
      <div
        className={cn(
          "w-12 h-12 rounded-full border-4 flex items-center justify-center font-bold",
          healthStatus.color,
          healthStatus.bg,
          healthStatus.border.replace("border-", "border-t-")
        )}
      >
        {healthScore}
      </div>

      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Health Score
        </p>
        <p className={cn("text-sm font-bold", healthStatus.color)}>
          {healthStatus.label} Condition
        </p>
      </div>
    </div>

    <div className="bg-white px-6 py-3 rounded-2xl border border-slate-200 flex items-center gap-4 shadow-sm">
      <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-500">
        <Trophy size={24} />
      </div>

      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Current Streak
        </p>
        <p className="text-sm font-bold text-slate-900">
          {streak} Days
        </p>
      </div>
    </div>

  </div>
</div>

      {/* Vitals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <VitalsCard
          title="Heart Rate"
          value={latestVital.heart_rate || "--"}
          unit="bpm"
          icon={Heart}
          status={
            latestVital.heart_rate
              ? latestVital.heart_rate > 100
                ? "Critical"
                : latestVital.heart_rate < 60
                  ? "Warning"
                  : "Normal"
              : "Normal"
          }
          trend=""
        />
        <VitalsCard
          title="Blood Pressure"
          value={
            latestVital.systolic_bp
              ? `${latestVital.systolic_bp}/${latestVital.diastolic_bp}`
              : "--"
          }
          unit="mmHg"
          icon={Activity}
          status={
            latestVital.systolic_bp
              ? latestVital.systolic_bp > 140
                ? "Critical"
                : latestVital.systolic_bp > 130
                  ? "Warning"
                  : "Normal"
              : "Normal"
          }
          trend=""
        />
        <VitalsCard
          title="Temperature"
          value={latestVital.temperature || "--"}
          unit="°F"
          icon={Thermometer}
          status={
            latestVital.temperature
              ? latestVital.temperature > 100
                ? "Critical"
                : latestVital.temperature > 99
                  ? "Warning"
                  : "Normal"
              : "Normal"
          }
          trend=""
        />
        <VitalsCard
          title="SpO2"
          value={latestVital.spo2 || "--"}
          unit="%"
          icon={Droplets}
          status={
            latestVital.spo2
              ? latestVital.spo2 < 95
                ? "Critical"
                : latestVital.spo2 < 97
                  ? "Warning"
                  : "Normal"
              : "Normal"
          }
          trend=""
        />
      </div>

{/* Charts Section */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

  <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm card-hover">
    <div className="flex items-center justify-between mb-8">
      <h3 className="text-lg font-bold text-slate-900">
        Heart Rate Trend
      </h3>
    </div>

    <Charts
      data={vitals
        .slice()
        .reverse()
        .map((v: any) => ({
          time: new Date(v.recorded_at as any).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          value: v.heart_rate,
        }))}

      type="area"
      dataKey="value"
      color="#fb7185"   // softer rose instead of strong red
      xAxisKey="time"
    />
  </div>

  <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm card-hover">
    <div className="flex items-center justify-between mb-8">
      <h3 className="text-lg font-bold text-slate-900">
        Sleep Analysis
      </h3>
    </div>

    <Charts
      data={lifestyle
        .slice()
        .reverse()
        .map((l: any) => ({
          day: new Date(l.recorded_at as any).toLocaleDateString([], {
            weekday: "short",
          }),
          hours: l.sleep_hours,
        }))}

      type="bar"
      dataKey="hours"
      color="#34d399"   // softer emerald
      xAxisKey="day"
    />
  </div>

</div>

{/* Bottom Section */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

  {/* Lifestyle Summary */}
  <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm card-hover">

    <h3 className="text-lg font-bold text-slate-900 mb-8">
      Lifestyle Summary
    </h3>

    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">

      {/* Steps */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
          <Footprints size={20} />
        </div>

        <p className="text-2xl font-bold text-slate-900">
          {latestLifestyle.steps || 0}
        </p>

        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mt-1">
          Steps
        </p>
      </div>

      {/* Sleep */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
        <div className="w-10 h-10 bg-sky-100 text-sky-600 rounded-xl flex items-center justify-center mb-4">
          <Moon size={20} />
        </div>

        <p className="text-2xl font-bold text-slate-900">
          {latestLifestyle.sleep_hours || 0}h
        </p>

        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mt-1">
          Sleep
        </p>
      </div>

      {/* Water */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
        <div className="w-10 h-10 bg-cyan-100 text-cyan-600 rounded-xl flex items-center justify-center mb-4">
          <Droplets size={20} />
        </div>

        <p className="text-2xl font-bold text-slate-900">
          {latestLifestyle.water_intake || 0}L
        </p>

        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mt-1">
          Water
        </p>
      </div>

      {/* Calories */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
        <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-4">
          <Flame size={20} />
        </div>

        <p className="text-2xl font-bold text-slate-900">
          {latestLifestyle.calories || 0}
        </p>

        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mt-1">
          Calories
        </p>
      </div>

    </div>
  </div>

    {/* Latest Alerts */}
    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm card-hover">

  <div className="flex items-center justify-between mb-8">
    <h3 className="text-lg font-bold text-slate-900">
      Recent Alerts
    </h3>
    <AlertCircle size={20} className="text-slate-400" />
  </div>

  <div className="space-y-4">
    {alerts.slice(0, 3).map((alert) => (
      <div
        key={alert.id}
        className="flex gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors"
      >

        <div
          className={
            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 " +
            (alert.severity === "High"
              ? "bg-rose-100 text-rose-600"
              : alert.severity === "Medium"
              ? "bg-amber-100 text-amber-600"
              : "bg-emerald-100 text-emerald-600")
          }
        >
          <AlertCircle size={18} />
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-900 line-clamp-1">
            {alert.message}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {new Date(alert.created_at).toLocaleString()}
          </p>
        </div>

      </div>
    ))}

    {alerts.length === 0 && (
      <p className="text-sm text-slate-500 text-center py-4">
        No recent alerts.
      </p>
    )}
  </div>

  <button
    onClick={() => onPageChange("alerts")}
    className="w-full mt-6 py-3 text-sm font-bold text-sky-600 hover:bg-sky-50 rounded-xl transition-colors"
  >
    View All Alerts
  </button>
</div>
</div>
      {/* Recent Activity & Search */}
<div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm card-hover">

  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">

    <div>
      <h3 className="text-xl font-bold text-slate-900">
        Health History
      </h3>
      <p className="text-sm text-slate-500 mt-1">
        View and manage your previous health records.
      </p>
    </div>

    <div className="relative max-w-xs w-full">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        size={18}
      />

      <input
        type="text"
        placeholder="Search by date or type..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
      />
    </div>

  </div>


  <div className="overflow-x-auto">
    <table className="w-full text-left">

      <thead>
        <tr className="text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-slate-100">
          <th className="px-4 py-3">Date</th>
          <th className="px-4 py-3">Type</th>
          <th className="px-4 py-3">Data</th>
          <th className="px-4 py-3 text-right">Action</th>
        </tr>
      </thead>

      <tbody className="divide-y divide-slate-100">

        {filteredVitals.slice(0, 5).map((v) => (
          <tr
            key={`v-${v.id}`}
            className="hover:bg-slate-50/50 transition-colors group"
          >
            <td className="px-4 py-4 text-sm text-slate-600">
              {new Date(v.recorded_at).toLocaleDateString()}
            </td>

            <td className="px-4 py-4">
              <span className="px-2 py-1 bg-rose-50 text-rose-600 text-[10px] font-bold rounded-md uppercase">
                Vitals
              </span>
            </td>

            <td className="px-4 py-4 text-sm font-medium text-slate-900">
              HR: {v.heart_rate} | BP: {v.systolic_bp}/{v.diastolic_bp} | SpO2: {v.spo2}%
            </td>

            <td className="px-4 py-4 text-right">
              <button
                onClick={() => handleEdit(v, "vitals")}
                className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all"
              >
                <Edit2 size={16} />
              </button>
            </td>
          </tr>
        ))}

        {filteredLifestyle.slice(0, 5).map((l) => (
          <tr
            key={`l-${l.id}`}
            className="hover:bg-slate-50/50 transition-colors group"
          >
            <td className="px-4 py-4 text-sm text-slate-600">
              {new Date(l.recorded_at).toLocaleDateString()}
            </td>

            <td className="px-4 py-4">
              <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-md uppercase">
                Lifestyle
              </span>
            </td>

            <td className="px-4 py-4 text-sm font-medium text-slate-900">
              Steps: {l.steps} | Sleep: {l.sleep_hours}h | Water: {l.water_intake}L
            </td>

            <td className="px-4 py-4 text-right">
              <button
                onClick={() => handleEdit(l, "lifestyle")}
                className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all"
              >
                <Edit2 size={16} />
              </button>
            </td>
          </tr>
        ))}

        {filteredVitals.length === 0 &&
          filteredLifestyle.length === 0 && (
            <tr>
              <td colSpan={4} className="px-4 py-8 text-center text-slate-400 text-sm">
                No records found matching your search.
              </td>
            </tr>
        )}

      </tbody>

    </table>
  </div>

</div>

     {/* Edit Modal */}
{editingRecord && (
  <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">

    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200"
    >

      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-900">
          Edit {editType === "vitals" ? "Vitals" : "Lifestyle"} Record
        </h3>

        <button
          onClick={() => setEditingRecord(null)}
          className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
      </div>


      <div className="p-8 space-y-6">

        {editType === "vitals" ? (
          <div className="grid grid-cols-2 gap-6">

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Heart Rate (bpm)
              </label>
              <input
                type="number"
                value={editingRecord.heart_rate}
                onChange={(e) =>
                  setEditingRecord({
                    ...editingRecord,
                    heart_rate: parseInt(e.target.value),
                  })
                }
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-200"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Systolic BP
              </label>
              <input
                type="number"
                value={editingRecord.systolic_bp}
                onChange={(e) =>
                  setEditingRecord({
                    ...editingRecord,
                    systolic_bp: parseInt(e.target.value),
                  })
                }
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-200"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Diastolic BP
              </label>
              <input
                type="number"
                value={editingRecord.diastolic_bp}
                onChange={(e) =>
                  setEditingRecord({
                    ...editingRecord,
                    diastolic_bp: parseInt(e.target.value),
                  })
                }
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-200"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                SpO2 (%)
              </label>
              <input
                type="number"
                value={editingRecord.spo2}
                onChange={(e) =>
                  setEditingRecord({
                    ...editingRecord,
                    spo2: parseInt(e.target.value),
                  })
                }
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-200"
              />
            </div>

          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6">

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Steps
              </label>
              <input
                type="number"
                value={editingRecord.steps}
                onChange={(e) =>
                  setEditingRecord({
                    ...editingRecord,
                    steps: parseInt(e.target.value),
                  })
                }
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-200"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Sleep Hours
              </label>
              <input
                type="number"
                step="0.5"
                value={editingRecord.sleep_hours}
                onChange={(e) =>
                  setEditingRecord({
                    ...editingRecord,
                    sleep_hours: parseFloat(e.target.value),
                  })
                }
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-200"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Water (L)
              </label>
              <input
                type="number"
                step="0.1"
                value={editingRecord.water_intake}
                onChange={(e) =>
                  setEditingRecord({
                    ...editingRecord,
                    water_intake: parseFloat(e.target.value),
                  })
                }
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-200"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Calories
              </label>
              <input
                type="number"
                value={editingRecord.calories}
                onChange={(e) =>
                  setEditingRecord({
                    ...editingRecord,
                    calories: parseInt(e.target.value),
                  })
                }
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-200"
              />
            </div>

          </div>
        )}

      </div>


      <div className="p-6 bg-slate-50 flex justify-end gap-3">

        <button
          onClick={() => setEditingRecord(null)}
          className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-all"
        >
          Cancel
        </button>

        <button
          onClick={handleSaveEdit}
          disabled={isSaving}
          className="px-8 py-2.5 bg-sky-500 text-white text-sm font-bold rounded-xl hover:bg-sky-600 transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {isSaving ? "Saving..." : (
            <>
              <Check size={18} /> Save Changes
            </>
          )}
        </button>

      </div>

    </motion.div>
  </div>
)}

      {/* Floating Quick Add Button */}
      <button
        onClick={() => onPageChange("track")}
        className="fixed bottom-8 right-8 w-14 h-14 bg-sky-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-sky-700 transition-all hover:scale-110 active:scale-95 z-40 group"
      >
        <Plus size={28} />
        <span className="absolute right-full mr-4 px-3 py-1 bg-slate-900 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Quick Add Data
        </span>
      </button>
    </div>
  );
};

export default Dashboard;
