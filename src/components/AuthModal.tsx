import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Lock, LogIn, Eye, EyeOff, AlertCircle, ChevronRight } from "lucide-react";
import { AuthUser } from "../types";
import chomalLogo from "../assets/chomal-logo.png";
import { ADMIN_AUTH_USER, ADMIN_PASSWORD, initialEmployees } from "../data";

interface AuthModalProps {
  onLogin: (user: AuthUser) => void;
  theme: "light" | "dark";
}

export default function AuthModal({ onLogin }: AuthModalProps) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd]   = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const authenticate = (e: string, p: string): AuthUser | null => {
    if (e.trim().toLowerCase() === ADMIN_AUTH_USER.email && p === ADMIN_PASSWORD) {
      return ADMIN_AUTH_USER;
    }
    const emp = initialEmployees.find(
      em => em.email.toLowerCase() === e.trim().toLowerCase() && em.password === p
    );
    if (emp) {
      return {
        id: emp.id,
        name: emp.name,
        email: emp.email,
        role: "employee",
        avatar: emp.avatar,
        department: emp.department,
        jobTitle: emp.role,
        employeeId: emp.id,
      };
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) { setError("Please enter your email address."); return; }
    if (!password)     { setError("Please enter your password."); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const user = authenticate(email, password);
    setLoading(false);
    if (!user) { setError("Invalid email or password. Please try again."); return; }
    onLogin(user);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100 dark:from-slate-950 dark:via-indigo-950/20 dark:to-slate-900 p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-400/10 dark:bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-violet-400/10 dark:bg-violet-600/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative w-full max-w-md"
      >
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-700/60 rounded-3xl shadow-2xl shadow-indigo-500/10 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-600 px-8 py-7 relative overflow-hidden">
            <div className="relative flex items-center gap-3">
              <motion.img
                src={chomalLogo}
                alt="Chomal Exports"
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-12 h-12 rounded-full object-cover border-2 border-white/40 shadow-lg"
              />
              <div>
                <h1 className="text-white font-bold text-lg tracking-tight">HRMS-CE</h1>
                <p className="text-indigo-200 text-xs font-medium">Human Resource Management System</p>
              </div>
            </div>
            <p className="relative mt-4 text-white/80 text-sm font-medium leading-relaxed">
              Sign in with your company email to access your personalized HR portal.
            </p>
          </div>

          <div className="px-8 py-7 space-y-5">
            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="auth-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError(""); }}
                    placeholder="you@chomalexports.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="auth-password"
                    type={showPwd ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError(""); }}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-11 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(p => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
                  >
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -6, height: 0 }}
                    className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 text-xs font-medium"
                  >
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                whileHover={{ scale: 1.01, boxShadow: "0 8px 24px -4px rgba(79, 70, 229, 0.45)" }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                id="auth-submit-btn"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </>
                )}
              </motion.button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
