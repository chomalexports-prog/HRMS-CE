import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Lock, LogIn, AlertCircle, ChevronRight, ArrowLeft, KeyRound, CheckCircle2, UserPlus } from "lucide-react";
import chomalLogo from "../assets/chomal-logo.png";
import { supabase } from "../supabase";

type View = "login" | "signup" | "forgot" | "forgot-sent" | "update-password";

interface AuthModalProps {
  theme: "light" | "dark";
}

export default function AuthModal({ theme }: AuthModalProps) {
  const [view, setView] = useState<View>("login");

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setView("update-password");
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setError(error.message);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setView("login");
      alert("Sign up successful! You can now log in.");
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setView("forgot-sent");
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setView("login");
      alert("Password updated successfully!");
    }
  };

  const goBack = () => {
    setView("login");
    setError("");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100 dark:from-slate-950 dark:via-indigo-950/20 dark:to-slate-900 p-4 relative overflow-hidden">
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
            <p className="mt-4 text-white/80 text-sm font-medium">
              {view === "login" && "Sign in to your account."}
              {view === "signup" && "Create a new employee account."}
              {view === "forgot" && "Reset your password."}
              {view === "update-password" && "Set your new password."}
            </p>
          </div>

          <div className="p-8">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-xl p-4 flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-red-700 dark:text-red-300 font-medium leading-relaxed">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Login / Sign Up */}
            {(view === "login" || view === "signup" || view === "update-password") && (
              <motion.form
                key={view}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={view === "login" ? handleLogin : view === "signup" ? handleSignUp : handleUpdatePassword}
                className="space-y-5"
              >
                {(view === "login" || view === "signup") && (
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                    <div className="relative group">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white transition-all text-sm outline-none"
                        placeholder="employee@chomalexports.com"
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {view === "update-password" ? "New Password" : "Password"}
                    </label>
                    {view === "login" && (
                      <button
                        type="button"
                        onClick={() => { setView("forgot"); setError(""); }}
                        className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white transition-all text-sm outline-none"
                      placeholder="••••••••"
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-indigo-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:pointer-events-none mt-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      {view === "login" ? "Sign In" : view === "signup" ? "Create Account" : "Update Password"}
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                {view === "login" && (
                  <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-4">
                    First time here?{" "}
                    <button type="button" onClick={() => { setView("signup"); setError(""); }} className="font-semibold text-indigo-600 hover:underline">
                      Sign Up
                    </button>
                  </p>
                )}
                {view === "signup" && (
                  <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-4">
                    Already have an account?{" "}
                    <button type="button" onClick={() => { setView("login"); setError(""); }} className="font-semibold text-indigo-600 hover:underline">
                      Sign In
                    </button>
                  </p>
                )}
              </motion.form>
            )}

            {/* Forgot Password */}
            {view === "forgot" && (
              <motion.form
                key="forgot"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleForgotPassword}
                className="space-y-6"
              >
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Registered Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white transition-all text-sm outline-none"
                      placeholder="employee@chomalexports.com"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={goBack}
                    className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      "Reset Password"
                    )}
                  </button>
                </div>
              </motion.form>
            )}

            {/* Forgot Password Sent */}
            {view === "forgot-sent" && (
              <motion.div
                key="forgot-sent"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Check your inbox</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-[280px] mx-auto text-sm leading-relaxed">
                  We've sent a password reset link to <strong>{email}</strong>.
                </p>
                <button
                  onClick={goBack}
                  className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-700 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to login
                </button>
              </motion.div>
            )}

          </div>
        </div>
      </motion.div>
    </div>
  );
}
