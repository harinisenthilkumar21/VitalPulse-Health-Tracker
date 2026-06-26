import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, HeartPulse, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginProps {
  onNavigateToRegister: () => void;
  onLogin?: (data: any) => void;
}

const Login: React.FC<LoginProps> = ({ onNavigateToRegister, onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    setEmail('');
    setPassword('');
    localStorage.removeItem("email");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Login failed");
        return;
      }

      if (onLogin) onLogin(data);

    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">

      {/* LIGHT BACKGROUND */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky-300/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-300/20 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl w-full bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden flex flex-col md:flex-row z-10"
      >

        {/* LEFT SIDE */}
        <div className="md:w-1/2 bg-gradient-to-br from-sky-400 to-cyan-300 p-12 text-white flex flex-col justify-between">

          <div>
            <div className="flex items-center gap-3 mb-12">
              <div className="w-10 h-10 bg-white/30 rounded-xl flex items-center justify-center">
                <HeartPulse size={24} />
              </div>
              <span className="text-xl font-bold">VitalPulse</span>
            </div>

            <h2 className="text-4xl font-extrabold mb-6">
              Your Health,<br />
              <span className="text-white/90">Our Priority.</span>
            </h2>

            <p className="text-white/90 text-lg">
              Track your vitals and live a healthier life with ease.
            </p>
          </div>

          <div className="mt-12 text-sm text-white/90">
            Real-time vitals tracking ||
            Personalized health alerts ||
            Detailed lifestyle analysis
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">

          <div className="mb-10">
            <h1 className="text-3xl font-bold text-slate-900">
              Welcome Back
            </h1>
            <p className="text-slate-500 mt-2">
              Please enter your details to sign in.
            </p>
          </div>

          <form autoComplete="off" onSubmit={handleSubmit} className="space-y-6">

            {/* EMAIL */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                Email Address
              </label>
              <input
                type="email"
                name="no-email"
                autoComplete="off"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-5 py-4 bg-slate-100 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-sky-200 focus:border-sky-400 text-slate-900"
              />
            </div>

            {/* PASSWORD */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-bold text-slate-700">
                  Password
                </label>
                <span className="text-xs text-sky-600 cursor-pointer">
                  Forgot password?
                </span>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="no-password"
                  autoComplete="new-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-5 py-4 bg-slate-100 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-sky-200 focus:border-sky-400 text-slate-900"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* REMEMBER */}
            <div className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <label className="text-sm text-slate-600">
                Remember me
              </label>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full py-4 bg-sky-500 text-white font-bold rounded-2xl hover:bg-sky-600 transition-all flex items-center justify-center gap-2"
            >
              Sign In
              <ChevronRight size={18} />
            </button>
          </form>

          {/* FOOTER */}
          <div className="mt-10 text-center">
            <p className="text-sm text-slate-500">
              Don’t have an account?{" "}
              <button
                onClick={onNavigateToRegister}
                className="text-sky-600 font-bold"
              >
                Create Account
              </button>
            </p>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default Login;