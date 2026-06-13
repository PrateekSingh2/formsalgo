// ============================================================================
// SIGNUP PAGE — Notebook Aesthetic Authentication
// ============================================================================

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Star, ShieldCheck, User, Sparkles } from "lucide-react";

export default function SignupPage() {
  const { signUp, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      await signUp(email, password, name);
      router.push("/builder");
    } catch (err: unknown) {
      setError("Could not create account. Email may already be in use.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    try {
      await signInWithGoogle();
      router.push("/builder");
    } catch (err: unknown) {
      setError("Google sign-in failed.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFBF8] flex items-center justify-center p-4 sm:p-8">
      
      {/* Main Notebook Container */}
      <div className="max-w-[1200px] w-full min-h-[800px] bg-[#FFFDFC] shadow-2xl relative flex rounded-r-3xl overflow-hidden border border-gray-100">
        
        {/* Notebook Spiral Left Edge */}
        <div className="w-12 shrink-0 border-r-2 border-[#E5E7EB] bg-white relative notebook-spiral shadow-[2px_0_4px_rgba(0,0,0,0.02)] z-20">
          <div className="absolute top-10 left-12 right-[-1152px] h-px bg-[#E5E7EB] pointer-events-none z-0"></div>
          <div className="absolute top-11 left-12 right-[-1152px] h-px bg-[#E5E7EB] pointer-events-none z-0"></div>
        </div>

        {/* Notebook Content Area */}
        <div className="flex-1 p-10 md:p-16 flex flex-col lg:flex-row gap-16 relative z-10">
          
          {/* LEFT SIDE: Header & Form */}
          <div className="flex-1 max-w-lg">
            
            {/* Header */}
            <div className="mb-12">
              <Link href="/" className="inline-flex items-center gap-2 mb-4 text-[#F472B6]">
                <Star className="w-5 h-5 fill-current" />
                <span className="font-balsamiq font-bold text-lg">FormForge</span>
              </Link>
              <h1 className="font-balsamiq text-5xl font-bold text-[#333333] mb-3">Join the club! ✨</h1>
              <p className="font-comic text-gray-500 font-bold text-lg inline-block relative">
                Create an account to start building.
                <svg className="absolute -bottom-2 left-0 w-full h-2" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 12.5 0, 25 5 T 50 5 T 75 5 T 100 5" fill="none" stroke="#F472B6" strokeWidth="2" />
                </svg>
              </p>
            </div>

            {/* Form Container (Taped Grid Paper) */}
            <div className="relative">
              <div className="washi-tape -top-3 -right-4" style={{ backgroundColor: "rgba(244, 114, 182, 0.4)", transform: "rotate(3deg)" }}></div>
              <div className="washi-tape -bottom-3 -left-4" style={{ backgroundColor: "rgba(52, 211, 153, 0.3)", transform: "rotate(-5deg)" }}></div>
              
              <div className="bg-white border-2 border-gray-300 rounded-sm p-8 shadow-sm bg-dot-grid relative">
                <form onSubmit={handleSubmit} className="space-y-5">
                  
                  <div>
                    <label className="font-balsamiq text-sm font-bold text-[#333333] block mb-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Jane Doe"
                        className="w-full pl-10 pr-4 py-3 bg-white border-2 border-[#333333] rounded-xl font-comic font-bold text-[#333333] placeholder-gray-400 focus:outline-none focus:border-[#F472B6] transition-colors" />
                    </div>
                  </div>

                  <div>
                    <label className="font-balsamiq text-sm font-bold text-[#333333] block mb-2">Email address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com"
                        className="w-full pl-10 pr-4 py-3 bg-white border-2 border-[#333333] rounded-xl font-comic font-bold text-[#333333] placeholder-gray-400 focus:outline-none focus:border-[#F472B6] transition-colors" />
                    </div>
                  </div>

                  <div>
                    <label className="font-balsamiq text-sm font-bold text-[#333333] block mb-2">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-3 bg-white border-2 border-[#333333] rounded-xl font-comic font-bold text-[#333333] placeholder-gray-400 focus:outline-none focus:border-[#F472B6] transition-colors" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#F472B6] hover:text-[#DB2777]">
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-bold text-red-500 bg-red-50 border border-red-200 px-4 py-2 rounded-lg font-comic">{error}</motion.p>
                  )}

                  <div className="pt-2">
                    <button type="submit" disabled={loading}
                      className="w-full py-4 bg-[#34D399] border-2 border-[#333333] rounded-xl font-balsamiq font-bold text-[#333333] shadow-[2px_2px_0px_#333333] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#333333] active:translate-y-[2px] active:shadow-none transition-all flex justify-center items-center gap-2">
                      {loading ? "Creating..." : "Create Account"} <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="relative flex items-center justify-center py-2">
                    <span className="font-comic text-xs text-gray-400 px-2 bg-white z-10">or</span>
                    <div className="absolute w-full h-px border-t border-dashed border-gray-300"></div>
                  </div>

                  <button type="button" onClick={handleGoogle}
                    className="w-full py-3.5 bg-white border-2 border-[#333333] rounded-xl font-balsamiq font-bold text-[#333333] shadow-[2px_2px_0px_#333333] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#333333] active:translate-y-[2px] active:shadow-none transition-all flex justify-center items-center gap-2">
                    <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                    Continue with Google
                  </button>

                  <p className="text-center font-comic font-bold text-sm text-gray-500 pt-2">
                    Already have an account? <Link href="/login" className="text-[#F472B6] hover:underline">Log in</Link>
                  </p>
                </form>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Illustration & Sticky Notes */}
          <div className="hidden lg:flex flex-1 flex-col relative items-center justify-center">
            
            {/* Speech Bubble */}
            <div className="absolute top-20 right-10 bg-white border-2 border-[#333333] rounded-[2rem] p-6 shadow-sm z-10 font-comic font-bold text-lg text-[#333333] max-w-[280px]">
              <p>Ready to build forms that people actually want to fill out?</p>
              <div className="absolute bottom-4 -left-3 w-6 h-6 bg-white border-b-2 border-l-2 border-[#333333] transform rotate-45"></div>
            </div>

            {/* Character Illustration Placeholder */}
            <div className="w-64 h-[400px] mt-20 relative flex items-center justify-center">
              <div className="text-[12rem]">👧🏻</div>
              <motion.div animate={{ rotate: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute top-20 -right-10 text-4xl">🌟</motion.div>
            </div>

            {/* Sticky Note */}
            <div className="absolute bottom-20 left-10 w-64 bg-[#FEF3C7] sticky-note transform -rotate-3 z-20">
              <div className="washi-tape -top-2 left-1/2 -translate-x-1/2 bg-pink-300" style={{ transform: "rotate(2deg)" }}></div>
              <h3 className="font-balsamiq font-bold text-[#333333] flex items-center gap-2 mb-3">
                Quick Perks <Sparkles className="w-4 h-4 text-orange-500" />
              </h3>
              <ul className="font-comic text-sm font-bold text-[#333333] space-y-2">
                <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Free forever plan</li>
                <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Instant sharing</li>
                <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Real-time analytics</li>
              </ul>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
