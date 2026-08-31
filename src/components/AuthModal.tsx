import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Lock, LogIn, Eye, EyeOff, AlertCircle, ChevronRight, ArrowLeft, KeyRound, CheckCircle2 } from "lucide-react";
import { AuthUser, Employee } from "../types";
import chomalLogo from "../assets/chomal-logo.png";
import { ADMIN_AUTH_USER, ADMIN_PASSWORD } from "../data";

interface AuthModalProps {
  onLogin: (user: AuthUser) => void;
  theme: "light" | "dark";
  employees: Employee[];
  onForgotPassword?: (email: string) => void;
}

type View = "login" | "forgot" | "forgot-sent";

export default function AuthModal({ onLogin, employees, onForgotPassword }: AuthModalProps) {
  const [view, setView]         = useState<View>("login");

  // Login state
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd]   = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  // Forgot password state
  const [resetEmail, setResetEmail]   = useState("");
  const [resetError, setResetError]   = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  const authenticate = (e: string, p: string): AuthUser | null => {
    if (e.trim().toLowerCase() === ADMIN_AUTH_USER.email && p === ADMIN_PASSWORD) {
      return ADMIN_AUTH_USER;
    }
    const emp = employees.find(
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

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError("");
    if (!resetEmail.trim()) { setResetError("Please enter your registered email address."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetEmail.trim())) {
      setResetError("Please enter a valid email address.");
      return;
    }
    setResetLoading(true);
    
    // Simulate network delay for UI feedback
    await new Promise(r => setTimeout(r, 600));
    
    if (onForgotPassword) {
      onForgotPassword(resetEmail.trim());
    }
    
    setView("forgot-sent");
    setResetLoading(false);
  };

  const goBack = () => {
    setView("login");
    setResetEmail("");
    setResetError("");
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

          {/* Header — always visible */}
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
            <AnimatePresence mode="wait">
              {view === "login" && (
                <motion.p
                  key="login-sub"
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="relative mt-4 text-white/80 text-sm font-medium leading-relaxed"
                >
                  Sign in with your company email to access your personalized HR portal.
                </motion.p>
              )}
              {view === "forgot" && (
                <motion.p
                  key="forgot-sub"
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="relative mt-4 text-white/80 text-sm font-medium leading-relaxed"
                >
                  Enter your registered email and we'll help you reset your password.
                </motion.p>
              )}
              {view === "forgot-sent" && (
                <motion.p
                  key="sent-sub"
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="relative mt-4 text-white/80 text-sm font-medium leading-relaxed"
                >
                  Your request has been received. Please check your inbox.
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Body — animated view transitions */}
          <AnimatePresence mode="wait">

            {/* ── LOGIN VIEW ─────────────────────────────────────────────── */}
            {view === "login" && (
              <motion.div
                key="login-view"
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="px-8 py-7 space-y-5"
              >
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email */}
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

                  {/* Password */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block">Password</label>
                      <button
                        type="button"
                        onClick={() => { setView("forgot"); setResetEmail(email); }}
                        className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline transition-colors cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    </div>
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
              </motion.div>
            )}

            {/* ── FORGOT PASSWORD VIEW ────────────────────────────────────── */}
            {view === "forgot" && (
              <motion.div
                key="forgot-view"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 24 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="px-8 py-7 space-y-5"
              >
                {/* Back link */}
                <button
                  onClick={goBack}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer group"
                >
                  <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                  Back to Sign In
                </button>

                <div className="flex items-center gap-3 p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600/10 dark:bg-indigo-600/20 flex items-center justify-center shrink-0">
                    <KeyRound className="w-4.5 h-4.5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    Enter your registered work email. Your HR Admin will be notified to reset your credentials.
                  </p>
                </div>

                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block">Registered Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        id="reset-email"
                        type="email"
                        autoComplete="email"
                        value={resetEmail}
                        onChange={e => { setResetEmail(e.target.value); setResetError(""); }}
                        placeholder="you@chomalexports.com"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                      />
                    </div>
                  </div>

                  <AnimatePresence>
                    {resetError && (
                      <motion.div
                        initial={{ opacity: 0, y: -6, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: "auto" }}
                        exit={{ opacity: 0, y: -6, height: 0 }}
                        className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 text-xs font-medium"
                      >
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{resetError}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.button
                    whileHover={{ scale: 1.01, boxShadow: "0 8px 24px -4px rgba(79, 70, 229, 0.35)" }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={resetLoading}
                    id="reset-submit-btn"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {resetLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Sending request...</span>
                      </>
                    ) : (
                      <>
                        <KeyRound className="w-4 h-4" />
                        <span>Send Reset Request</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </motion.button>
                </form>
              </motion.div>
            )}

            {/* ── CONFIRMATION VIEW ──────────────────────────────────────── */}
            {view === "forgot-sent" && (
              <motion.div
                key="sent-view"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="px-8 py-10 flex flex-col items-center text-center space-y-5"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -15 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                  className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 flex items-center justify-center shadow-lg shadow-emerald-500/10"
                >
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                </motion.div>

                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Request Sent!</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
                    Your password reset request for <span className="font-semibold text-indigo-600 dark:text-indigo-400">{resetEmail}</span> has been submitted.
                  </p>
                </div>

                <div className="w-full rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40 p-4 text-left space-y-1.5">
                  <p className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest">Next Steps</p>
                  <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    <li className="flex items-start gap-2"><span className="text-amber-500 font-bold mt-0.5">1.</span> Your HR Admin has been notified.</li>
                    <li className="flex items-start gap-2"><span className="text-amber-500 font-bold mt-0.5">2.</span> You'll receive your new credentials via your registered email.</li>
                    <li className="flex items-start gap-2"><span className="text-amber-500 font-bold mt-0.5">3.</span> If urgent, contact HR directly at <span className="font-semibold text-slate-700 dark:text-slate-300">chomalexports@gmail.com</span>.</li>
                  </ul>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={goBack}
                  className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer border border-slate-200 dark:border-slate-700"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Return to Sign In
                </motion.button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
