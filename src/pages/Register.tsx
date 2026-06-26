import React, { useState } from "react";
import {
  ChevronRight,
  ChevronLeft,
  HeartPulse,
  Check,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
import axios from "axios";

interface RegisterProps {
  onRegister: () => void;
  onNavigateToLogin: () => void;
}

const API_BASE_URL =
  import.meta.env.VITE_API_URL || import.meta.env.VITE_APP_URL || "/api";

const Register: React.FC<RegisterProps> = ({
  onRegister,
  onNavigateToLogin,
}) => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    gender: "Male",
    height: "",
    weight: "",
    contact: "",
    emergency_contact: "",
  });

  const totalSteps = 3;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    setIsLoading(true);
    setError("");
    try {
      await axios.post(`${API_BASE_URL}/register`, formData);
      onRegister();
      onNavigateToLogin();
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const renderStep = () => {
  switch (step) {
    case 1:
      return (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-6"
        >
          <h2 className="text-xl font-bold text-slate-900">
            Personal Account
          </h2>

          <div className="space-y-4">

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                Full Name
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                type="text"
                placeholder="Name"
                autoComplete="off"
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sky-200 focus:border-sky-400 transition-all placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                Email Address
              </label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="example@email.com"
                autoComplete="new-email"
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sky-200 focus:border-sky-400 transition-all placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                Password
              </label>
              <input
                name="password"
                value={formData.password}
                onChange={handleChange}
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sky-200 focus:border-sky-400 transition-all placeholder:text-slate-400"
              />
            </div>

          </div>
        </motion.div>
      );

    case 2:
      return (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-6"
        >
          <h2 className="text-xl font-bold text-slate-900">
            Health Profile
          </h2>

          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                Age
              </label>
              <input
                name="age"
                value={formData.age}
                onChange={handleChange}
                type="number"
                placeholder="00"
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sky-200 focus:border-sky-400 transition-all placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sky-200 focus:border-sky-400 transition-all"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                Height (cm)
              </label>
              <input
                name="height"
                value={formData.height}
                onChange={handleChange}
                type="number"
                placeholder="000"
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sky-200 focus:border-sky-400 transition-all placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                Weight (kg)
              </label>
              <input
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                type="number"
                placeholder="00"
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sky-200 focus:border-sky-400 transition-all placeholder:text-slate-400"
              />
            </div>

          </div>
        </motion.div>
      );

    case 3:
      return (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-6"
        >
          <h2 className="text-xl font-bold text-slate-900">
            Contact Details
          </h2>

          <div className="space-y-4">

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                Phone Number
              </label>
              <input
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                type="tel"
                placeholder="xx xxxxx xxxxx"
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sky-200 focus:border-sky-400 transition-all placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                Emergency Contact
              </label>
              <input
                name="emergency_contact"
                value={formData.emergency_contact}
                onChange={handleChange}
                type="tel"
                placeholder="xx xxxxx xxxxx"
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sky-200 focus:border-sky-400 transition-all placeholder:text-slate-400"
              />
            </div>

          </div>
        </motion.div>
      );

    default:
      return null;
  }
};

  return (
  <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">

    {/* Background */}
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky-400/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-400/10 rounded-full blur-[120px]" />
    </div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl w-full bg-white rounded-[2.5rem] shadow-2xl shadow-sky-100 border border-slate-100 overflow-hidden flex flex-col md:flex-row z-10"
    >

      {/* LEFT SIDE */}
      <div className="md:w-1/2 bg-gradient-to-br from-sky-400 to-pink-400 p-12 text-white flex flex-col justify-between relative overflow-hidden">

        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 border-4 border-white rounded-full" />
          <div className="absolute bottom-20 right-10 w-64 h-64 border-8 border-white rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-white rounded-full" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-white/30 rounded-xl flex items-center justify-center">
              <HeartPulse size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight">
              VitalPulse
            </span>
          </div>

          <h2 className="text-4xl font-extrabold leading-tight mb-6">
            Start Your <br />
            <span className="text-white/90">Health Journey.</span>
          </h2>

          <p className="text-white/80 text-lg leading-relaxed max-w-sm">
            Create an account to get personalized health insights and track
            your progress in real-time.
          </p>
        </div>

        <div className="relative z-10 mt-12 space-y-4">
          {[ 
            "Real-time vitals tracking",
            "Personalized health alerts",
            "Detailed lifestyle analysis"
          ].map((text, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-6 h-6 bg-white/30 rounded-full flex items-center justify-center">
                <Check size={14} />
              </div>
              <span className="text-sm font-medium">{text}</span>
            </div>
          ))}
        </div>

      </div>

      {/* RIGHT SIDE */}
      <div className="md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Create Account
          </h1>

          {/* STEP INDICATOR */}
          <div className="flex items-center gap-2 mt-6 w-full max-w-[240px]">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex-1 flex items-center">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                    step >= s
                      ? "bg-sky-500 text-white shadow-lg shadow-sky-100"
                      : "bg-slate-100 text-slate-400"
                  )}
                >
                  {step > s ? <Check size={14} /> : s}
                </div>

                {s < 3 && (
                  <div
                    className={cn(
                      "flex-1 h-1 mx-1 rounded-full",
                      step > s ? "bg-sky-500" : "bg-slate-100"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ERROR */}
        <div className="min-h-[320px]">
          {error && (
            <motion.div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-2xl border border-red-200 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              {error}
            </motion.div>
          )}
          <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
        </div>

        {/* BUTTONS */}
        <div className="mt-10 flex gap-4">
          {step > 1 && (
            <button
              onClick={prevStep}
              disabled={isLoading}
              className="flex-1 py-4 border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 flex items-center justify-center gap-2"
            >
              <ChevronLeft size={20} />
              Back
            </button>
          )}

          <button
            onClick={step === totalSteps ? handleRegister : nextStep}
            disabled={isLoading}
            className="flex-[2] py-4 bg-sky-500 text-white font-bold rounded-2xl hover:bg-sky-600 shadow-xl shadow-sky-100 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                {step === totalSteps ? "Complete" : "Next Step"}
                <ChevronRight size={20} />
              </>
            )}
          </button>
        </div>

        {/* LOGIN LINK */}
        <div className="mt-10 pt-8 border-t border-slate-100 text-center">
          <p className="text-slate-500 text-sm font-medium">
            Already have an account?{" "}
            <button
              onClick={onNavigateToLogin}
              className="text-sky-600 font-bold hover:text-sky-700"
            >
              Sign In
            </button>
          </p>
        </div>

      </div>
    </motion.div>
  </div>
);
}
export default Register;
