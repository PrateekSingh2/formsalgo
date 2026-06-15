"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, User, Palette, Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { toast } from "sonner";

export default function SettingsPage() {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "appearance">("profile");
  
  const [defaults, setDefaults] = useState({
    fontFamily: "font-comic",
    backgroundColor: "bg-white",
    textColor: "#333333",
    successMessage: "Thank You! 🎉 Your response has been recorded."
  });

  useEffect(() => {
    const saved = localStorage.getItem("formforge_global_defaults");
    if (saved) {
      setDefaults(JSON.parse(saved));
    }
  }, []);

  const handleSave = () => {
    setSaving(true);
    if (activeTab === "appearance") {
      localStorage.setItem("formforge_global_defaults", JSON.stringify(defaults));
    }
    setTimeout(() => {
      setSaving(false);
      toast.success("Settings saved successfully!");
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto w-full pb-20">
      <div className="mb-8 relative z-10">
        <h1 className="text-3xl font-bold font-balsamiq text-gray-900">Settings</h1>
        <p className="text-gray-500 font-comic mt-1">Manage your account and preferences.</p>
      </div>

      {/* Decorative Visual Elements */}
      <div className="absolute top-20 right-10 w-32 h-32 bg-purple-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
      
      <div className="flex flex-col md:flex-row gap-8 relative z-10">
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 shrink-0 space-y-2">
          <button 
            onClick={() => setActiveTab("profile")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold font-balsamiq transition-all border ${activeTab === "profile" ? "bg-white border-purple-200 text-purple-700 shadow-sm" : "bg-transparent border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-200"}`}
          >
            <User className="w-5 h-5" /> Profile
          </button>
          <button 
            onClick={() => setActiveTab("appearance")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold font-balsamiq transition-all border ${activeTab === "appearance" ? "bg-white border-purple-200 text-purple-700 shadow-sm" : "bg-transparent border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-200"}`}
          >
            <Palette className="w-5 h-5" /> Defaults
          </button>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === "profile" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8 relative overflow-hidden group">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 25, ease: "linear" }} className="absolute -right-8 -top-8 text-gray-100 opacity-50 pointer-events-none group-hover:text-purple-50 transition-colors">
                  <User className="w-48 h-48" />
                </motion.div>
                <h2 className="text-xl font-bold font-balsamiq mb-6 flex items-center gap-2 relative z-10 text-gray-900"><User className="text-purple-500" /> Account Details</h2>
                
                <div className="space-y-4 font-comic relative z-10">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                    <input type="email" value={user?.email || ""} disabled className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-gray-500 cursor-not-allowed shadow-sm" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Display Name</label>
                    <input type="text" placeholder="Your Name" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-50 focus:border-purple-300 shadow-sm transition-all text-gray-900" />
                  </div>
                </div>

                <div className="mt-8 flex justify-end relative z-10">
                  <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-3 bg-purple-500 text-white font-bold font-balsamiq rounded-2xl shadow-sm hover:-translate-y-0.5 hover:shadow-md hover:bg-purple-600 transition-all border border-purple-600">
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Save Changes
                  </button>
                </div>
              </div>

              <div className="bg-red-50/50 rounded-3xl border border-red-200 shadow-sm p-8 mt-6 relative overflow-hidden">
                <h2 className="text-xl font-bold font-balsamiq text-red-600 mb-2 relative z-10">Danger Zone</h2>
                <p className="text-red-900/60 text-sm font-comic mb-6 relative z-10">Once you delete your account, there is no going back. All your forms, submissions, and settings will be permanently destroyed.</p>
                <button 
                  onClick={() => {
                    const conf = window.confirm("Are you ABSOLUTELY sure you want to delete your account? This action cannot be undone.");
                    if (conf) {
                      toast.error("Account deletion requires admin approval in this demo environment.");
                    }
                  }}
                  className="px-6 py-3 bg-white text-red-600 border border-red-200 rounded-2xl font-bold font-balsamiq hover:bg-red-50 hover:border-red-300 transition-colors shadow-sm relative z-10"
                >
                  Delete Account Permanently
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === "appearance" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8 relative overflow-hidden group">
                <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 30, ease: "linear" }} className="absolute -right-8 -top-8 text-gray-100 opacity-50 pointer-events-none group-hover:text-purple-50 transition-colors">
                  <Palette className="w-48 h-48" />
                </motion.div>
                <h2 className="text-xl font-bold font-balsamiq mb-6 flex items-center gap-2 relative z-10 text-gray-900"><Sparkles className="text-purple-500" /> Global Form Defaults</h2>
                
                <div className="space-y-6 font-comic relative z-10">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Default Font Family</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {[
                        { id: "font-comic", label: "Comic Sans", fontClass: "font-comic" },
                        { id: "font-balsamiq", label: "Balsamiq", fontClass: "font-balsamiq" },
                        { id: "font-sans", label: "Modern Sans", fontClass: "font-sans" },
                      ].map((font) => (
                        <button
                          key={font.id}
                          onClick={() => setDefaults({ ...defaults, fontFamily: font.id })}
                          className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${defaults.fontFamily === font.id ? "border-purple-300 bg-purple-50 text-purple-900 shadow-sm" : "border-gray-200 hover:border-purple-200 hover:bg-gray-50 text-gray-700"}`}
                        >
                          <span className={`${font.fontClass} font-bold`}>{font.label}</span>
                          {defaults.fontFamily === font.id && <CheckCircle2 className="w-5 h-5 text-purple-500" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Text Color</label>
                    <div className="flex gap-3">
                      {["#333333", "#111827", "#4B5563", "#8B5CF6", "#F59E0B"].map((color) => (
                        <button
                          key={color}
                          onClick={() => setDefaults({ ...defaults, textColor: color })}
                          className={`w-12 h-12 rounded-full border-4 flex items-center justify-center transition-all shadow-sm ${defaults.textColor === color ? "border-purple-300 scale-110" : "border-white hover:scale-105"}`}
                          style={{ backgroundColor: color }}
                        >
                          {defaults.textColor === color && <CheckCircle2 className="w-6 h-6 text-white drop-shadow-md" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Default Success Message</label>
                    <textarea 
                      value={defaults.successMessage}
                      onChange={(e) => setDefaults({ ...defaults, successMessage: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-50 focus:border-purple-300 shadow-sm resize-y transition-all text-gray-900"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="mt-8 flex justify-end relative z-10">
                  <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-3 bg-purple-500 text-white font-bold font-balsamiq rounded-2xl shadow-sm hover:-translate-y-0.5 hover:shadow-md hover:bg-purple-600 transition-all border border-purple-600">
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Save Defaults
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
