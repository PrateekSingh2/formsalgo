// ============================================================================
// ADMIN USERS — User management table with search, role editing
// ============================================================================

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MoreVertical,
  Shield,
  ShieldCheck,
  Trash2,
  UserCog,
  ChevronLeft,
  ChevronRight,
  Users,
} from "lucide-react";

// Mock data — will be replaced with tRPC admin.getAllUsers
const mockUsers = [
  { id: "1", name: "Sarah Chen", email: "sarah@example.com", role: "creator", forms: 12, xp: 2400, level: 5, createdAt: "2025-11-14", avatar: "🧑‍💻" },
  { id: "2", name: "Alex Rivera", email: "alex@example.com", role: "user", forms: 8, xp: 800, level: 2, createdAt: "2025-12-02", avatar: "👩‍🎨" },
  { id: "3", name: "Kira Tanaka", email: "kira@example.com", role: "creator", forms: 23, xp: 5200, level: 8, createdAt: "2025-09-21", avatar: "🧑‍🏫" },
  { id: "4", name: "Marco Polo", email: "marco@example.com", role: "user", forms: 5, xp: 300, level: 1, createdAt: "2026-01-15", avatar: "👨‍💼" },
  { id: "5", name: "Luna Park", email: "luna@example.com", role: "admin", forms: 17, xp: 4100, level: 7, createdAt: "2025-08-03", avatar: "👩‍🔬" },
  { id: "6", name: "Dev Patel", email: "dev@example.com", role: "user", forms: 3, xp: 150, level: 1, createdAt: "2026-03-22", avatar: "🧑‍🎓" },
  { id: "7", name: "Yuki Aoi", email: "yuki@example.com", role: "creator", forms: 31, xp: 7800, level: 11, createdAt: "2025-06-11", avatar: "👩‍💻" },
  { id: "8", name: "Carlos Ruiz", email: "carlos@example.com", role: "user", forms: 1, xp: 50, level: 1, createdAt: "2026-05-30", avatar: "👨‍🎤" },
];

const roleBadge: Record<string, { bg: string; text: string }> = {
  user: { bg: "bg-dark-card", text: "text-dark-text-secondary" },
  creator: { bg: "bg-violet/15", text: "text-violet-light" },
  admin: { bg: "bg-amber/15", text: "text-amber-light" },
  superadmin: { bg: "bg-pink/15", text: "text-pink-light" },
};

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);

  const filtered = mockUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">User Management</h1>
          <p className="text-sm text-dark-text-secondary">
            {mockUsers.length} total users
          </p>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-text-secondary" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-dark-card border border-dark-border rounded-xl text-sm text-white placeholder-dark-text-secondary focus:border-violet/50 focus:outline-none focus:ring-1 focus:ring-violet/20 transition-all"
          />
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-dark rounded-2xl border border-dark-border overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="text-left px-5 py-3 text-[10px] font-bold text-dark-text-secondary uppercase tracking-wider">
                  User
                </th>
                <th className="text-left px-5 py-3 text-[10px] font-bold text-dark-text-secondary uppercase tracking-wider">
                  Role
                </th>
                <th className="text-left px-5 py-3 text-[10px] font-bold text-dark-text-secondary uppercase tracking-wider">
                  Forms
                </th>
                <th className="text-left px-5 py-3 text-[10px] font-bold text-dark-text-secondary uppercase tracking-wider">
                  Level
                </th>
                <th className="text-left px-5 py-3 text-[10px] font-bold text-dark-text-secondary uppercase tracking-wider">
                  Joined
                </th>
                <th className="text-right px-5 py-3 text-[10px] font-bold text-dark-text-secondary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {filtered.map((user, i) => {
                const badge = roleBadge[user.role] || roleBadge.user;
                return (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.25 + i * 0.03 }}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-dark-card flex items-center justify-center text-sm border border-dark-border">
                          {user.avatar}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">
                            {user.name}
                          </div>
                          <div className="text-xs text-dark-text-secondary">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${badge.bg} ${badge.text}`}
                      >
                        {user.role === "admin" ? (
                          <ShieldCheck className="w-3 h-3" />
                        ) : user.role === "creator" ? (
                          <Shield className="w-3 h-3" />
                        ) : null}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-dark-text-secondary">
                      {user.forms}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-white font-medium">
                          Lv.{user.level}
                        </span>
                        <div className="w-16 h-1.5 bg-dark-card rounded-full overflow-hidden">
                          <div
                            className="h-full bg-violet rounded-full"
                            style={{
                              width: `${Math.min((user.xp % 1000) / 10, 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-dark-text-secondary">
                      {user.createdAt}
                    </td>
                    <td className="px-5 py-3 text-right relative">
                      <button
                        onClick={() =>
                          setActionMenuId(
                            actionMenuId === user.id ? null : user.id
                          )
                        }
                        className="p-1.5 rounded-lg hover:bg-white/5 text-dark-text-secondary hover:text-white transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      <AnimatePresence>
                        {actionMenuId === user.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: -5 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="absolute right-5 top-12 w-40 glass-dark border border-dark-border rounded-xl shadow-xl z-10 py-1 overflow-hidden"
                          >
                            <button className="w-full text-left px-4 py-2 text-sm text-dark-text-secondary hover:text-white hover:bg-white/5 flex items-center gap-2">
                              <UserCog className="w-3.5 h-3.5" /> Change Role
                            </button>
                            <button className="w-full text-left px-4 py-2 text-sm text-pink-light hover:bg-pink/10 flex items-center gap-2">
                              <Trash2 className="w-3.5 h-3.5" /> Delete User
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-5 py-3 border-t border-dark-border flex items-center justify-between">
          <span className="text-xs text-dark-text-secondary">
            Showing {filtered.length} of {mockUsers.length}
          </span>
          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded-lg hover:bg-white/5 text-dark-text-secondary transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 rounded-lg bg-violet/15 text-violet-light text-xs font-medium">
              1
            </span>
            <button className="p-1.5 rounded-lg hover:bg-white/5 text-dark-text-secondary transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
