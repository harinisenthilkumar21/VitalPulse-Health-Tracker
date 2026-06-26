import React, { useState } from "react";
import {
  Heart,
  Activity,
  Thermometer,
  Droplets,
  Footprints,
  Moon,
  Flame,
  Plus,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import axios from "axios";
import { User } from "../types";

interface TrackDataProps {
  user: User;
}

const TrackData: React.FC<TrackDataProps> = ({ user }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [vitals, setVitals] = useState({
    heart_rate: "",
    systolic_bp: "",
    diastolic_bp: "",
    temperature: "",
    spo2: "",
    respiratory_rate: "16",
  });

  const [lifestyle, setLifestyle] = useState({
    steps: "",
    sleep_hours: "",
    water_intake: "",
    calories: "",
    activity: "None",
  });

  const handleVitalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVitals({ ...vitals, [e.target.name]: e.target.value });
  };

  const handleLifestyleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setLifestyle({ ...lifestyle, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      // Submit Vitals
      if (
        vitals.heart_rate ||
        vitals.systolic_bp ||
        vitals.temperature ||
        vitals.spo2
      ) {
        await axios.post(
          "/api/vitals",
          {
            user_id: user.id,
            ...vitals,
          },
          { headers },
        );
      }

      // Submit Lifestyle
      if (
        lifestyle.steps ||
        lifestyle.sleep_hours ||
        lifestyle.water_intake ||
        lifestyle.calories
      ) {
        await axios.post(
          "/api/lifestyle",
          {
            user_id: user.id,
            ...lifestyle,
          },
          { headers },
        );
      }

      setIsSubmitted(true);
      setVitals({
        heart_rate: "",
        systolic_bp: "",
        diastolic_bp: "",
        temperature: "",
        spo2: "",
        respiratory_rate: "16",
      });
      setLifestyle({
        steps: "",
        sleep_hours: "",
        water_intake: "",
        calories: "",
        activity: "None",
      });
      setTimeout(() => setIsSubmitted(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save health records");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Track Health Data</h1>
        <p className="text-slate-500 mt-1">
          Log your vitals and daily activities to keep your profile updated.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Vitals Section */}
        <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
              <Heart size={20} />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Vitals</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Heart Rate (bpm)
              </label>
              <div className="relative">
                <Heart
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="number"
                  name="heart_rate"
                  value={vitals.heart_rate}
                  onChange={handleVitalChange}
                  placeholder="72"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Blood Pressure (Systolic/Diastolic)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  name="systolic_bp"
                  value={vitals.systolic_bp}
                  onChange={handleVitalChange}
                  placeholder="120"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                />
                <input
                  type="number"
                  name="diastolic_bp"
                  value={vitals.diastolic_bp}
                  onChange={handleVitalChange}
                  placeholder="80"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Temperature (°F)
              </label>
              <div className="relative">
                <Thermometer
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="number"
                  step="0.1"
                  name="temperature"
                  value={vitals.temperature}
                  onChange={handleVitalChange}
                  placeholder="98.6"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                SpO2 (%)
              </label>
              <div className="relative">
                <Droplets
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="number"
                  name="spo2"
                  value={vitals.spo2}
                  onChange={handleVitalChange}
                  placeholder="98"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Lifestyle Section */}
        <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-sky-50 text-sky-600 rounded-lg">
              <Activity size={20} />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Lifestyle</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Steps Count
              </label>
              <div className="relative">
                <Footprints
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="number"
                  name="steps"
                  value={lifestyle.steps}
                  onChange={handleLifestyleChange}
                  placeholder="10000"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Sleep Hours
              </label>
              <div className="relative">
                <Moon
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="number"
                  step="0.5"
                  name="sleep_hours"
                  value={lifestyle.sleep_hours}
                  onChange={handleLifestyleChange}
                  placeholder="8"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Water Intake (Liters)
              </label>
              <div className="relative">
                <Droplets
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="number"
                  step="0.1"
                  name="water_intake"
                  value={lifestyle.water_intake}
                  onChange={handleLifestyleChange}
                  placeholder="2.5"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Calories Burned
              </label>
              <div className="relative">
                <Flame
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="number"
                  name="calories"
                  value={lifestyle.calories}
                  onChange={handleLifestyleChange}
                  placeholder="2500"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Activity Type
              </label>
              <select
                name="activity"
                value={lifestyle.activity}
                onChange={handleLifestyleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
              >
                <option>None</option>
                <option>Walking</option>
                <option>Running</option>
                <option>Cycling</option>
                <option>Swimming</option>
                <option>Gym / Workout</option>
              </select>
            </div>
          </div>
        </section>

        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => {
              setVitals({
                heart_rate: "",
                systolic_bp: "",
                diastolic_bp: "",
                temperature: "",
                spo2: "",
                respiratory_rate: "16",
              });
              setLifestyle({
                steps: "",
                sleep_hours: "",
                water_intake: "",
                calories: "",
                activity: "None",
              });
            }}
            className="px-8 py-3.5 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-all"
          >
            Clear
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-12 py-3.5 bg-sky-600 text-white font-bold rounded-xl hover:bg-sky-700 shadow-lg shadow-sky-200 transition-all active:scale-[0.98] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Plus size={20} />
            )}
            Save Records
          </button>
        </div>
      </form>

      <AnimatePresence>
        {isSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-50"
          >
            <CheckCircle2 size={24} />
            <span className="font-bold">
              Health records saved successfully!
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TrackData;
