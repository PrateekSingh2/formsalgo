// ============================================================================
// DASHBOARD LAYOUT
// ============================================================================

"use client";

import { useAuth } from "@/providers/auth-provider";
import { redirect } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { LayoutDashboard, Users, Settings, Plus, LogOut, Star, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (loading) return (
    <div className="min-h-screen bg-[#FCFBF8] flex flex-col items-center justify-center font-balsamiq">
      <div className="w-16 h-16 border-4 border-[#333333] rounded-full border-t-[#8B5CF6] animate-spin mb-4"></div>
      <p className="text-xl text-[#333333] font-bold">Drawing dashboard...</p>
    </div>
  );
  if (!user) return redirect("/login");

  const navItems = [
    { name: "My Forms", href: "/dashboard", icon: LayoutDashboard },
    { name: "Templates", href: "/dashboard/templates", icon: Star },
    { name: "Audiences", href: "/dashboard/audiences", icon: Users },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="h-screen flex bg-gradient-to-br from-purple-100 via-pink-50 to-amber-100 relative overflow-hidden">

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-60 bg-white/70 backdrop-blur-xl border-r border-white/50 flex flex-col shrink-0 z-50 shadow-xl transform transition-transform duration-300 md:relative md:translate-x-0 md:shadow-sm md:z-10 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200/50 bg-white/50">
          <Link href="/" className="inline-flex items-center gap-2 text-[#8B5CF6] group">
            <div className="p-1.5 bg-white rounded-lg border border-purple-200 shadow-sm group-hover:-rotate-12 transition-transform">
              <Star className="w-5 h-5 fill-current" />
            </div>
            <span className="font-balsamiq font-black text-xl tracking-tight text-gray-900">FormForge</span>
          </Link>
          <button 
            className="p-1.5 md:hidden text-gray-400 hover:text-gray-600 rounded-lg"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 p-4 space-y-2 font-sans mt-2">
          <p className="px-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Menu</p>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold transition-all relative overflow-hidden group ${
                  isActive 
                    ? "bg-white/80 text-purple-700 shadow-sm border border-purple-200 -translate-y-0.5 backdrop-blur-md" 
                    : "bg-transparent text-gray-600 border border-transparent hover:border-gray-200/50 hover:shadow-sm hover:-translate-y-0.5 hover:bg-white/50"
                }`}>
                <item.icon className={`w-4 h-4 relative z-10 ${isActive ? 'text-purple-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                <span className="relative z-10 text-sm">{item.name}</span>
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-gray-100 bg-[#FEF3C7]">
          <Link href="/builder" className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#34D399] border border-emerald-400 rounded-xl font-balsamiq font-black text-emerald-950 shadow-sm hover:translate-y-px hover:shadow-none active:translate-y-1 transition-all mb-4 text-sm">
            <Plus className="w-4 h-4 stroke-[3]" /> New Form
          </Link>
          
          <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
            <div className="w-8 h-8 shrink-0 rounded-lg bg-purple-100 border border-purple-200 flex items-center justify-center font-balsamiq font-black text-purple-700 text-sm">
              {user.displayName?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-balsamiq font-bold text-xs text-gray-900 truncate">{user.displayName}</p>
              <p className="font-sans text-[10px] text-gray-500 truncate font-semibold">{user.email}</p>
            </div>
            <button onClick={logout} className="p-1.5 shrink-0 text-red-500 bg-red-50 border border-transparent hover:border-red-200 rounded-lg transition-all" title="Log out">
              <LogOut className="w-3.5 h-3.5 stroke-[2]" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative z-10 bg-transparent">
        <div className="h-16 flex items-center px-4 md:px-8 border-b border-white/50 bg-white/50 backdrop-blur-xl sticky top-0 z-20">
          <button 
            className="p-2 mr-3 text-gray-600 hover:text-gray-900 md:hidden bg-white border border-gray-200 rounded-xl shadow-sm"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <h2 className="font-balsamiq font-black text-xl text-gray-900 flex items-center gap-2">
            Dashboard
          </h2>
        </div>
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
