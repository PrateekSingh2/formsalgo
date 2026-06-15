// ============================================================================
// LOGIN PAGE — Notebook Aesthetic Authentication
// ============================================================================

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Star, ShieldCheck, User, ArrowLeft, Sparkles } from "lucide-react";
import { AuthGuard } from "@/components/auth-guard";
import { useEffect } from "react";

export default function LoginPage() {
  const { signIn, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState<number | null>(null);

  const isLockedOut = lockoutTime && Date.now() < lockoutTime;

  // Clear lockout when time expires
  useEffect(() => {
    if (!lockoutTime) return;
    const interval = setInterval(() => {
      if (Date.now() >= lockoutTime) {
        setLockoutTime(null);
        setError("");
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutTime]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLockedOut) {
      setError(`Too many attempts. Please wait ${Math.ceil((lockoutTime - Date.now())/1000)}s.`);
      return;
    }
    setError("");
    setLoading(true);
    try {
      await signIn(email, password);
      router.push("/dashboard");
    } catch (err: unknown) {
      setAttempts((prev) => {
        const next = prev + 1;
        if (next >= 3) {
          setLockoutTime(Date.now() + 60000); // 60 seconds
          setError("Too many failed attempts. Please wait 1 minute.");
          return 0;
        }
        setError("Invalid email or password.");
        return next;
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    if (isLockedOut) return;
    setError("");
    try {
      await signInWithGoogle();
      router.push("/dashboard");
    } catch (err: unknown) {
      setError("Google sign-in failed.");
    }
  };

  return (
    <AuthGuard requireAuth={false}>
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-200/40 rounded-full blur-3xl mix-blend-multiply"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-200/40 rounded-full blur-3xl mix-blend-multiply"></div>
        <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-emerald-200/30 rounded-full blur-3xl mix-blend-multiply"></div>
      </div>

      {/* Back Button */}
      <div className="absolute top-4 left-4 sm:top-8 sm:left-8 z-50">
        <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-[1rem_0.5rem_1rem_0.5rem] font-sans font-bold text-gray-600 hover:text-purple-600 hover:border-purple-200 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
          <ArrowLeft className="w-4 h-4" /> <span className="hidden sm:inline">Back to Home</span>
        </Link>
      </div>

      {/* Main Container */}
      <div className="max-w-[1000px] w-full min-h-[500px] bg-white/80 backdrop-blur-md shadow-sm relative flex rounded-[2rem_1rem_3rem_1rem] overflow-hidden border-2 border-dashed border-gray-300">

        {/* Content Area */}
        <div className="flex-1 p-6 md:p-10 flex flex-col lg:flex-row gap-8 relative z-10">

          {/* LEFT SIDE: Header & Form */}
          <div className="flex-1 max-w-md w-full mx-auto flex flex-col justify-center">

            {/* Header */}
            <div className="mb-8 text-center lg:text-left relative">
              <h1 className="font-balsamiq text-4xl font-black text-gray-900 mb-2">Welcome back! 👋</h1>
              <motion.div animate={{ rotate: [0, 15, 0], scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 3 }} className="absolute top-16 right-10 lg:right-32">
                <Sparkles className="w-10 h-10 text-amber-400 fill-amber-400/20" />
              </motion.div>
              <p className="font-sans text-gray-500 text-lg mt-4">
                Login to continue building amazing forms.
              </p>
            </div>

            {/* Form Container */}
            <div className="bg-white rounded-[1.5rem_2rem_1.5rem_2rem] border border-gray-100 p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] w-full">
              <form onSubmit={handleSubmit} className="space-y-4">

                <div>
                  <label className="font-sans font-bold text-gray-700 block mb-2 text-sm">Email address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com"
                      className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl font-sans text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-300 focus:bg-white focus:ring-4 focus:ring-purple-50 transition-all shadow-sm" />
                  </div>
                </div>

                <div>
                  <label className="font-sans font-bold text-gray-700 block mb-2 text-sm">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                    <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••"
                      className="w-full pl-12 pr-12 py-3 bg-gray-50/50 border border-gray-200 rounded-xl font-sans text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-300 focus:bg-white focus:ring-4 focus:ring-purple-50 transition-all shadow-sm" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-bold text-red-500 bg-red-50 border border-red-100 px-4 py-3 rounded-xl font-sans flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 shrink-0" /> {error}
                  </motion.p>
                )}

                <div className="pt-2">
                  <button type="submit" disabled={loading}
                    className="w-full py-3.5 bg-purple-500 text-white border border-purple-600 rounded-[1rem_0.5rem_1rem_0.5rem] font-sans font-bold text-base shadow-sm hover:-translate-y-0.5 hover:bg-purple-600 hover:shadow-md active:translate-y-0 transition-all flex justify-center items-center gap-2">
                    {loading ? "Logging in..." : "Login to Dashboard"} <ArrowRight className="w-5 h-5" />
                  </button>
                </div>

                <div className="relative flex items-center justify-center py-2">
                  <span className="font-sans text-xs font-bold text-gray-400 px-4 bg-white z-10 uppercase tracking-widest">or</span>
                  <div className="absolute w-full h-px bg-gray-100"></div>
                </div>

                <button type="button" onClick={handleGoogle}
                  className="w-full py-3.5 bg-white border border-gray-200 rounded-[0.5rem_1rem_0.5rem_1rem] font-sans font-bold text-gray-700 shadow-sm hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md active:translate-y-0 transition-all flex justify-center items-center gap-3">
                  <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                  Continue with Google
                </button>

                <p className="text-center font-sans text-sm text-gray-500 pt-2">
                  Don't have an account? <Link href="/signup" className="text-purple-600 font-bold hover:underline">Sign up here</Link>
                </p>
              </form>
            </div>
          </div>

          {/* RIGHT SIDE: Illustration & Feature highlights */}
          <div className="hidden lg:flex flex-1 flex-col relative items-center justify-center bg-gray-50/50 rounded-3xl border border-dashed border-gray-200 p-10 z-0">

            {/* Feature Card 1 */}
            <div className="w-full max-w-sm bg-white border border-gray-100 rounded-2xl p-5 shadow-sm transform -rotate-2 hover:rotate-0 transition-transform mb-6 relative z-10">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mb-3">
                <Star className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-balsamiq font-bold text-gray-900 mb-1">AI-Powered Forms</h3>
              <p className="font-sans text-sm text-gray-500">Generate complex forms instantly using our AI builder.</p>
              
              {/* Arrow 1 (Right side, down to card 2, wrinkled/looping) */}
              <svg className="absolute -bottom-16 -right-12 w-24 h-32 text-[#a3e635] z-20 pointer-events-none" viewBox="0 0 100 150" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M 60 10 C 100 40 100 80 70 100 C 40 120 10 90 30 70 C 50 50 80 100 10 130" />
                <path d="M 10 130 L 30 120 M 10 130 L 20 145" />
              </svg>
            </div>

            {/* Feature Card 2 */}
            <div className="w-full max-w-sm bg-white border border-gray-100 rounded-[1rem_2rem_1rem_0.5rem] p-5 shadow-sm transform rotate-1 hover:rotate-0 transition-transform mb-6 ml-8 relative z-10">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="font-balsamiq font-bold text-gray-900 mb-1">Bank-Grade Security</h3>
              <p className="font-sans text-sm text-gray-500">Your data is locked down with industry-standard encryption.</p>
              
              {/* Arrow 2 (Left side, down to card 3, wrinkled/looping) */}
              <svg className="absolute -bottom-16 -left-12 w-24 h-32 text-[#a3e635] z-20 pointer-events-none" viewBox="0 0 100 150" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M 40 10 C 0 40 0 80 30 100 C 60 120 90 90 70 70 C 50 50 20 100 90 130" />
                <path d="M 90 130 L 70 120 M 90 130 L 80 145" />
              </svg>
            </div>

            {/* Feature Card 3 */}
            <div className="w-full max-w-sm bg-white border border-gray-100 rounded-[2rem_0.5rem_2rem_1rem] p-5 shadow-sm transform -rotate-1 hover:rotate-0 transition-transform -ml-4 relative z-10">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center mb-3">
                <User className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="font-balsamiq font-bold text-gray-900 mb-1">Deep Analytics</h3>
              <p className="font-sans text-sm text-gray-500">Understand your audience with powerful, real-time insights.</p>
            </div>

            {/* Graphic Elements */}
            <motion.div animate={{ rotate: [0, 10, 0], scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 3 }} className="absolute top-10 right-10 opacity-50 z-0">
              <Sparkles className="w-12 h-12 text-amber-400" />
            </motion.div>
          </div>
        </div>

      </div>
    </div>
    </AuthGuard>
  );
}
