// ============================================================================
// DASHBOARD LAYOUT
// ============================================================================

"use client";

import { useAuth } from "@/providers/auth-provider";
import { redirect } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { LayoutDashboard, Users, Settings, Plus, LogOut, Star, Webhook } from "lucide-react";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();

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
    <div className="h-screen flex bg-[#FCFBF8] relative overflow-hidden">
      {/* Notebook Paper Dots Pattern */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#333333 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r-4 border-[#333333] flex flex-col shrink-0 relative z-10 shadow-[8px_0px_0px_rgba(0,0,0,0.05)]">
        <div className="h-20 flex items-center px-6 border-b-4 border-[#333333] bg-[#F5F3FF]">
          <Link href="/" className="inline-flex items-center gap-2 text-[#8B5CF6] group">
            <div className="p-2 bg-white rounded-xl border-2 border-[#333333] shadow-[2px_2px_0px_#333333] group-hover:-rotate-12 transition-transform">
              <Star className="w-5 h-5 fill-current" />
            </div>
            <span className="font-balsamiq font-black text-2xl tracking-tight text-[#333333]">FormForge</span>
          </Link>
        </div>

        <div className="flex-1 p-4 space-y-3 font-comic mt-2">
          <p className="px-4 text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Menu</p>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all relative overflow-hidden group ${
                  isActive 
                    ? "bg-[#8B5CF6] text-white shadow-[4px_4px_0px_#333333] border-2 border-[#333333] -translate-y-1" 
                    : "bg-white text-gray-600 border-2 border-transparent hover:border-[#333333] hover:shadow-[4px_4px_0px_#333333] hover:-translate-y-1"
                }`}>
                {isActive && <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/scribble-light.png')] opacity-20"></div>}
                <item.icon className={`w-5 h-5 relative z-10 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-[#333333]'}`} />
                <span className="relative z-10">{item.name}</span>
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t-2 border-[#333333] bg-[#FEF3C7]">
          <Link href="/builder" className="w-full flex items-center justify-center gap-2 py-3 bg-[#34D399] border-2 border-[#333333] rounded-xl font-balsamiq font-black text-[#333333] shadow-[2px_2px_0px_#333333] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#333333] active:translate-y-[2px] active:shadow-none transition-all mb-4">
            <Plus className="w-5 h-5 stroke-[2]" /> New Form
          </Link>
          
          <div className="flex items-center gap-2 bg-white p-2 rounded-xl border-2 border-[#333333] shadow-[2px_2px_0px_#333333]">
            <div className="w-10 h-10 shrink-0 rounded-lg bg-[#E9D5FF] border-2 border-[#333333] flex items-center justify-center font-balsamiq font-black text-[#333333] text-lg">
              {user.displayName?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-balsamiq font-bold text-sm text-[#333333] truncate">{user.displayName}</p>
              <p className="font-comic text-[10px] text-gray-500 truncate font-bold">{user.email}</p>
            </div>
            <button onClick={logout} className="p-2 shrink-0 text-[#EF4444] bg-red-50 border-2 border-transparent hover:border-[#EF4444] rounded-lg transition-all" title="Log out">
              <LogOut className="w-4 h-4 stroke-[2]" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative z-10">
        <div className="h-20 flex items-center px-8 border-b-4 border-[#333333] bg-white sticky top-0 z-20">
          <h2 className="font-balsamiq font-black text-2xl text-[#333333] flex items-center gap-2">
            Dashboard
          </h2>
        </div>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
