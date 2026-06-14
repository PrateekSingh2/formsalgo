// ============================================================================
// ADMIN USERS — User management table with search, role editing
// ============================================================================

"use client";

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

// Live data will replace this
const mockUsers: any[] = [];

const roleBadge: Record<string, { bg: string; text: string }> = {
  user: { bg: "bg-gray-200 border-gray-400", text: "text-gray-600" },
  creator: { bg: "bg-[#E9D5FF] border-[#333333]", text: "text-[#333333]" },
  admin: { bg: "bg-[#FDE68A] border-[#333333]", text: "text-[#333333]" },
  superadmin: { bg: "bg-[#FBCFE8] border-[#333333]", text: "text-[#333333]" },
};

import { useState, useEffect } from "react";
import { fetchAllUsersAdmin, changeUserRoleAdmin } from "@/lib/admin-actions";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await fetchAllUsersAdmin(500); // Production safe limit
      setUsers(data);
      setLoading(false);
    }
    load();
  }, []);

  const handleDeleteUserClick = () => {
    toast.error("User deletion disabled in production for safety.");
  }

  const handleChangeRoleClick = async (userId: string, currentRole: string) => {
    // Determine new role (toggle to admin, or back to user)
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    
    // Optimistic UI update can be done, but let's await the DB change
    const toastId = toast.loading(`Changing role to ${newRole}...`);
    const success = await changeUserRoleAdmin(userId, newRole);
    
    if (success) {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      toast.success(`Successfully changed role to ${newRole}`, { id: toastId });
      setActionMenuId(null);
    } else {
      toast.error("Failed to change user role", { id: toastId });
    }
  }

  const filtered = users.filter((u) => {
    const nameStr = u.name || "Anonymous";
    return nameStr.toLowerCase().includes(search.toLowerCase()) || 
           u.email.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-center justify-between font-comic"
      >
        <div>
          <h1 className="text-3xl font-balsamiq font-bold text-[#333333] mb-1">User Management</h1>
          <p className="text-sm font-bold text-gray-600">
            {users.length} total users
          </p>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6 font-comic"
      >
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border-4 border-[#333333] rounded-xl text-sm font-bold text-[#333333] placeholder-gray-400 shadow-[4px_4px_0px_#333333] focus:outline-none focus:shadow-[4px_4px_0px_#8B5CF6] transition-shadow"
          />
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-3xl border-4 border-[#333333] shadow-[8px_8px_0px_#333333] overflow-hidden font-comic"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-4 border-[#333333] bg-[#F9F9F9]">
                {["User", "Role", "Forms", "Level", "Joined"].map((h) => (
                  <th key={h} className="px-5 py-4 text-xs font-balsamiq font-bold text-[#333333] uppercase tracking-wider">
                    {h}
                  </th>
                ))}
                <th className="px-5 py-4 text-xs font-balsamiq font-bold text-[#333333] uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-dashed divide-gray-300">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center font-bold text-gray-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Loading users...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center font-bold text-gray-500">
                    No users found matching your criteria.
                  </td>
                </tr>
              ) : filtered.map((user, i) => {
                const badge = roleBadge[user.role] || roleBadge.user;
                const formCount = user.forms?.[0]?.count || 0;
                const userLvl = Math.max(1, Math.floor(formCount / 3));
                const xpPercent = Math.min(100, (formCount % 3) * 33);
                
                return (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.25 + i * 0.03 }}
                    className="hover:bg-[#F0EBFF] transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#E9D5FF] flex items-center justify-center text-sm border-2 border-[#333333] font-bold uppercase text-[#333333]">
                          {user.name ? user.name.substring(0,2) : user.email.substring(0,2)}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-[#333333]">
                            {user.name || "Anonymous User"}
                          </div>
                          <div className="text-xs font-bold text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border-2 ${badge.bg} ${badge.text}`}
                      >
                        {user.role === "admin" ? (
                          <ShieldCheck className="w-3 h-3 stroke-[3]" />
                        ) : user.role === "creator" ? (
                          <Shield className="w-3 h-3 stroke-[3]" />
                        ) : null}
                        {user.role || 'user'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm font-bold text-gray-600">
                      {formCount}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#333333]">
                          Lv.{userLvl}
                        </span>
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden border-2 border-[#333333]">
                          <div
                            className="h-full bg-[#8B5CF6] rounded-full border-r-2 border-[#333333]"
                            style={{ width: `${xpPercent}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm font-bold text-gray-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 text-right relative">
                      <button
                        onClick={() =>
                          setActionMenuId(
                            actionMenuId === user.id ? null : user.id
                          )
                        }
                        className="p-2 rounded-xl bg-white border-2 border-[#333333] text-[#333333] hover:bg-[#F0EBFF] hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_#333333] transition-all"
                      >
                        <MoreVertical className="w-4 h-4 stroke-[3]" />
                      </button>
                      <AnimatePresence>
                        {actionMenuId === user.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: -5 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="absolute right-5 top-14 w-40 bg-white border-4 border-[#333333] rounded-2xl shadow-[4px_4px_0px_#333333] z-10 py-2 overflow-hidden flex flex-col font-comic text-left"
                          >
                            <button onClick={() => handleChangeRoleClick(user.id, user.role)} className="w-full text-left px-4 py-2 text-sm font-bold text-[#333333] hover:bg-[#F0EBFF] flex items-center gap-2 transition-colors">
                              <UserCog className="w-4 h-4 stroke-[3]" /> Change Role
                            </button>
                            <button onClick={handleDeleteUserClick} className="w-full text-left px-4 py-2 text-sm font-bold text-[#EC4899] hover:bg-[#FDF2F8] flex items-center gap-2 transition-colors">
                              <Trash2 className="w-4 h-4 stroke-[3]" /> Delete User
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
        <div className="px-5 py-4 border-t-4 border-[#333333] bg-[#F9F9F9] flex items-center justify-between font-comic">
          <span className="text-xs font-bold text-gray-500">
            Showing {filtered.length} of {users.length}
          </span>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-xl bg-white border-2 border-transparent text-gray-400 hover:border-[#333333] hover:text-[#333333] hover:shadow-[2px_2px_0px_#333333] transition-all">
              <ChevronLeft className="w-5 h-5 stroke-[3]" />
            </button>
            <span className="px-4 py-1.5 rounded-xl bg-[#8B5CF6] text-white border-2 border-[#333333] text-sm font-bold shadow-[2px_2px_0px_#333333]">
              1
            </span>
            <button className="p-2 rounded-xl bg-white border-2 border-transparent text-gray-400 hover:border-[#333333] hover:text-[#333333] hover:shadow-[2px_2px_0px_#333333] transition-all">
              <ChevronRight className="w-5 h-5 stroke-[3]" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
