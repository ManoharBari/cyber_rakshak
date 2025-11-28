"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ArrowLeft, Bell, Lock, Shield, Check } from "lucide-react"

export default function UserSettingsAdvancedPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"notifications" | "security" | "privacy">("notifications")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [savedChanges, setSavedChanges] = useState("")

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailIncidentUpdates: true,
    emailWeeklySummary: true,
    pushNotifications: true,
    smsAlerts: false,
  })

  // Security settings
  const [security, setSecurity] = useState({
    twoFactorEnabled: false,
    showPassword: false,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  if (!user || user.role !== "user") {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400 mb-4">Access denied</p>
          <button
            onClick={() => router.push("/login")}
            className="px-6 py-2 bg-cyan-400 text-slate-950 rounded-lg font-semibold"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))
    showSavedMessage()
  }

  const handleSecurityToggle = (key: keyof typeof security) => {
    setSecurity((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const showSavedMessage = () => {
    setSavedChanges("Settings saved successfully")
    setTimeout(() => setSavedChanges(""), 2000)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSecurity((prev) => ({ ...prev, [name]: value }))
  }

  const handleSavePassword = () => {
    if (security.newPassword !== security.confirmPassword) {
      alert("Passwords do not match")
      return
    }
    showSavedMessage()
    setSecurity((prev) => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }))
  }

  return (
    <main className="min-h-screen pt-24 px-4 sm:px-6 pb-16 bg-background">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => router.back()} className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
            <ArrowLeft className="w-6 h-6 text-cyan-400" />
          </button>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
        </div>

        {savedChanges && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center gap-2">
            <Check className="w-5 h-5 text-green-400" />
            <p className="text-green-400">{savedChanges}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setActiveTab("notifications")}
                className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                  activeTab === "notifications"
                    ? "bg-primary/20 text-primary border-r-2 border-primary"
                    : "text-foreground hover:bg-border"
                }`}
              >
                <Bell className="w-5 h-5" />
                <span>Notifications</span>
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`w-full flex items-center gap-3 px-4 py-3 transition-colors border-t border-border ${
                  activeTab === "security"
                    ? "bg-primary/20 text-primary border-r-2 border-primary"
                    : "text-foreground hover:bg-border"
                }`}
              >
                <Lock className="w-5 h-5" />
                <span>Security</span>
              </button>
              <button
                onClick={() => setActiveTab("privacy")}
                className={`w-full flex items-center gap-3 px-4 py-3 transition-colors border-t border-border ${
                  activeTab === "privacy"
                    ? "bg-primary/20 text-primary border-r-2 border-primary"
                    : "text-foreground hover:bg-border"
                }`}
              >
                <Shield className="w-5 h-5" />
                <span>Privacy</span>
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className="bg-card border border-border rounded-lg p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Notification Preferences</h2>
                <div className="space-y-4">
                  {[
                    {
                      key: "emailIncidentUpdates",
                      label: "Incident Updates",
                      description: "Receive email notifications about your incident updates",
                    },
                    {
                      key: "emailWeeklySummary",
                      label: "Weekly Summary",
                      description: "Get a weekly summary of your incidents and status",
                    },
                    {
                      key: "pushNotifications",
                      label: "Push Notifications",
                      description: "Receive browser push notifications",
                    },
                    {
                      key: "smsAlerts",
                      label: "SMS Alerts",
                      description: "Get SMS alerts for high-priority incidents",
                    },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between p-4 hover:bg-slate-900 rounded-lg transition-colors"
                    >
                      <div>
                        <p className="font-semibold text-white">{item.label}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications[item.key as keyof typeof notifications]}
                          onChange={() => handleNotificationChange(item.key as keyof typeof notifications)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-400" />
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="space-y-6">
                {/* Two-Factor Authentication */}
                <div className="bg-card border border-border rounded-lg p-8">
                  <h2 className="text-2xl font-bold text-white mb-6">Two-Factor Authentication</h2>
                  <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg mb-4">
                    <div>
                      <p className="font-semibold text-white">Enable 2FA</p>
                      <p className="text-sm text-muted-foreground">
                        {security.twoFactorEnabled ? "Enabled" : "Disabled"}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={security.twoFactorEnabled}
                        onChange={() => handleSecurityToggle("twoFactorEnabled")}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-400" />
                    </label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Two-factor authentication adds an extra layer of security to your account.
                  </p>
                </div>

                {/* Change Password */}
                <div className="bg-card border border-border rounded-lg p-8">
                  <h2 className="text-2xl font-bold text-white mb-6">Change Password</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">Current Password</label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={security.currentPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-3 bg-slate-900 border border-border rounded-lg focus:outline-none focus:border-primary transition-colors text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">New Password</label>
                      <input
                        type={security.showPassword ? "text" : "password"}
                        name="newPassword"
                        value={security.newPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-3 bg-slate-900 border border-border rounded-lg focus:outline-none focus:border-primary transition-colors text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">Confirm Password</label>
                      <input
                        type={security.showPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={security.confirmPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-3 bg-slate-900 border border-border rounded-lg focus:outline-none focus:border-primary transition-colors text-white"
                      />
                    </div>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={security.showPassword}
                        onChange={() => handleSecurityToggle("showPassword")}
                      />
                      <span>Show password</span>
                    </label>
                    <button
                      onClick={handleSavePassword}
                      className="w-full px-6 py-3 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold rounded-lg transition-colors"
                    >
                      Update Password
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === "privacy" && (
              <div className="bg-card border border-border rounded-lg p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Privacy & Data</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-white mb-2">Data Retention</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Your incident data is retained for 12 months after resolution.
                    </p>
                    <button className="px-4 py-2 border border-border rounded-lg hover:bg-border transition-colors">
                      Download My Data
                    </button>
                  </div>
                  <div className="border-t border-border pt-6">
                    <h3 className="font-semibold text-white mb-2">Account Deletion</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Permanently delete your account and all associated data.
                    </p>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="px-4 py-2 bg-red-600/20 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-xl p-8 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">Delete Account?</h3>
            <p className="text-muted-foreground mb-8">
              This action cannot be undone. All your data will be permanently deleted.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-6 py-3 border border-border text-foreground rounded-lg font-semibold hover:bg-border transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
