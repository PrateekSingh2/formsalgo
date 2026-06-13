// ============================================================================
// ADMIN SETTINGS — Platform configuration
// ============================================================================

"use client";

import { motion } from "framer-motion";
import { Settings, Bell, Shield, Globe, Palette, Database } from "lucide-react";

function SettingToggle({ label, description, defaultOn = false }: { label: string; description: string; defaultOn?: boolean }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-dark-border last:border-none">
      <div>
        <div className="text-sm font-medium text-white">{label}</div>
        <div className="text-xs text-dark-text-secondary mt-0.5">{description}</div>
      </div>
      <button className={`w-10 h-5 rounded-full transition-colors relative ${defaultOn ? "bg-violet" : "bg-dark-card border border-dark-border"}`}>
        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${defaultOn ? "translate-x-5" : "translate-x-0.5"}`} />
      </button>
    </div>
  );
}

function SettingSection({ title, icon: Icon, children }: { title: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-dark rounded-2xl border border-dark-border overflow-hidden mb-6">
      <div className="px-5 py-4 border-b border-dark-border flex items-center gap-2">
        <Icon className="w-4 h-4 text-violet-light" />
        <h3 className="text-sm font-semibold text-white">{title}</h3>
      </div>
      <div className="px-5">{children}</div>
    </motion.div>
  );
}

export default function AdminSettingsPage() {
  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Settings</h1>
        <p className="text-sm text-dark-text-secondary">Platform configuration and preferences</p>
      </motion.div>

      <div className="max-w-2xl">
        <SettingSection title="General" icon={Settings}>
          <SettingToggle label="Maintenance Mode" description="Disable public access to the platform" />
          <SettingToggle label="New User Registration" description="Allow new users to sign up" defaultOn />
          <SettingToggle label="Public API Access" description="Enable the public REST API endpoints" defaultOn />
        </SettingSection>

        <SettingSection title="Notifications" icon={Bell}>
          <SettingToggle label="Email Notifications" description="Send email alerts for new submissions" defaultOn />
          <SettingToggle label="Admin Alerts" description="Get notified about critical platform events" defaultOn />
          <SettingToggle label="Weekly Digest" description="Send weekly analytics summary to admins" />
        </SettingSection>

        <SettingSection title="Security" icon={Shield}>
          <SettingToggle label="Two-Factor Authentication" description="Require 2FA for admin accounts" />
          <SettingToggle label="Rate Limiting" description="Limit API requests per user" defaultOn />
          <SettingToggle label="CORS Restrictions" description="Restrict cross-origin API requests" defaultOn />
        </SettingSection>

        <SettingSection title="Marketplace" icon={Palette}>
          <SettingToggle label="Theme Submissions" description="Allow users to submit themes to the marketplace" defaultOn />
          <SettingToggle label="Auto-Approve Free Themes" description="Skip review for free theme submissions" />
          <SettingToggle label="Paid Themes" description="Enable paid theme marketplace" defaultOn />
        </SettingSection>
      </div>
    </div>
  );
}
