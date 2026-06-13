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
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-balsamiq text-[#333333]">Settings</h1>
        <p className="text-gray-500 font-comic mt-1">Manage your account and preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 shrink-0 space-y-2">
          <button 
            onClick={() => setActiveTab("profile")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold font-balsamiq transition-all border-2 ${activeTab === "profile" ? "bg-white border-[#333333] text-[#8B5CF6] shadow-[4px_4px_0px_#333333]" : "bg-transparent border-transparent text-gray-500 hover:bg-gray-100"}`}
          >
            <User className="w-5 h-5" /> Profile
          </button>
          <button 
            onClick={() => setActiveTab("appearance")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold font-balsamiq transition-all border-2 ${activeTab === "appearance" ? "bg-white border-[#333333] text-[#8B5CF6] shadow-[4px_4px_0px_#333333]" : "bg-transparent border-transparent text-gray-500 hover:bg-gray-100"}`}
          >
            <Palette className="w-5 h-5" /> Defaults
          </button>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === "profile" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="bg-white rounded-2xl border-2 border-[#333333] shadow-[4px_4px_0px_#333333] p-8">
                <h2 className="text-xl font-bold font-balsamiq mb-6 flex items-center gap-2"><User className="text-[#8B5CF6]" /> Account Details</h2>
                
                <div className="space-y-4 font-comic">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                    <input type="email" value={user?.email || ""} disabled className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-500 cursor-not-allowed" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Display Name</label>
                    <input type="text" placeholder="Your Name" className="w-full px-4 py-3 bg-white border-2 border-[#333333] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/50 shadow-[2px_2px_0px_#333333]" />
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-3 bg-[#8B5CF6] text-white font-bold font-balsamiq rounded-xl border-2 border-[#333333] shadow-[4px_4px_0px_#333333] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#333333] transition-all">
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Save Changes
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl border-2 border-red-200 shadow-sm p-8 mt-6">
                <h2 className="text-xl font-bold font-balsamiq text-red-600 mb-2">Danger Zone</h2>
                <p className="text-gray-500 text-sm font-comic mb-6">Once you delete your account, there is no going back. All your forms, submissions, and settings will be permanently destroyed.</p>
                <button 
                  onClick={() => {
                    const conf = window.confirm("Are you ABSOLUTELY sure you want to delete your account? This action cannot be undone.");
                    if (conf) {
                      toast.error("Account deletion requires admin approval in this demo environment.");
                    }
                  }}
                  className="px-6 py-3 bg-red-50 text-red-600 border-2 border-red-200 rounded-xl font-bold font-balsamiq hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors shadow-sm"
                >
                  Delete Account Permanently
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === "appearance" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="bg-white rounded-2xl border-2 border-[#333333] shadow-[4px_4px_0px_#333333] p-8">
                <h2 className="text-xl font-bold font-balsamiq mb-6 flex items-center gap-2"><Sparkles className="text-[#8B5CF6]" /> Global Form Defaults</h2>
                
                <div className="space-y-6 font-comic">
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
                          className={`p-3 rounded-xl border-2 text-left flex items-center justify-between ${defaults.fontFamily === font.id ? "border-[#8B5CF6] bg-[#F5F3FF]" : "border-gray-200 hover:border-[#8B5CF6]"}`}
                        >
                          <span className={`${font.fontClass} font-bold`}>{font.label}</span>
                          {defaults.fontFamily === font.id && <CheckCircle2 className="w-4 h-4 text-[#8B5CF6]" />}
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
                          className={`w-10 h-10 rounded-full border-4 flex items-center justify-center ${defaults.textColor === color ? "border-[#8B5CF6]" : "border-transparent hover:border-gray-300"}`}
                          style={{ backgroundColor: color }}
                        >
                          {defaults.textColor === color && <CheckCircle2 className="w-5 h-5 text-white" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Default Success Message</label>
                    <textarea 
                      value={defaults.successMessage}
                      onChange={(e) => setDefaults({ ...defaults, successMessage: e.target.value })}
                      className="w-full px-4 py-3 bg-white border-2 border-[#333333] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/50 shadow-[2px_2px_0px_#333333] resize-y"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-3 bg-[#8B5CF6] text-white font-bold font-balsamiq rounded-xl border-2 border-[#333333] shadow-[4px_4px_0px_#333333] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#333333] transition-all">
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
