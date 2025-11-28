"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Bell, Lock, Eye, Trash2 } from "lucide-react"

export default function UserSettingsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  if (!user || user.role !== "citizen") {
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

  return (
    <main className="min-h-screen pt-24 px-4 sm:px-6 pb-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>

        {/* Notifications Section */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-cyan-500/20 rounded-xl p-8 mb-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Bell className="w-5 h-5 text-cyan-400" />
            Notifications
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 hover:bg-slate-900/50 rounded-lg transition-colors">
              <div>
                <p className="font-medium text-white">Email Notifications</p>
                <p className="text-sm text-slate-400">Receive updates via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-400" />
              </label>
            </div>
            <div className="flex items-center justify-between p-4 hover:bg-slate-900/50 rounded-lg transition-colors">
              <div>
                <p className="font-medium text-white">Push Notifications</p>
                <p className="text-sm text-slate-400">Receive browser notifications</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={pushNotifications}
                  onChange={(e) => setPushNotifications(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-400" />
              </label>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-cyan-500/20 rounded-xl p-8 mb-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Lock className="w-5 h-5 text-green-400" />
            Security
          </h2>
          <div className="space-y-4">
            <button className="w-full px-6 py-3 border border-cyan-400/50 text-cyan-400 rounded-lg font-semibold hover:bg-cyan-400/10 transition-colors">
              Change Password
            </button>
            <button className="w-full px-6 py-3 border border-cyan-400/50 text-cyan-400 rounded-lg font-semibold hover:bg-cyan-400/10 transition-colors flex items-center justify-center gap-2">
              <Eye className="w-4 h-4" />
              View Active Sessions
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-red-500/20 rounded-xl p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-red-400" />
            Danger Zone
          </h2>
          <p className="text-slate-400 mb-6">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-6 py-3 bg-red-600/20 border border-red-500/50 text-red-400 rounded-lg font-semibold hover:bg-red-600/30 transition-colors"
          >
            Delete Account
          </button>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-cyan-500/20 rounded-xl p-8 max-w-md w-full">
              <h3 className="text-xl font-bold text-white mb-4">Delete Account?</h3>
              <p className="text-slate-400 mb-8">
                This action cannot be undone. All your data will be permanently deleted.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-6 py-3 border border-cyan-400/50 text-cyan-400 rounded-lg font-semibold hover:bg-cyan-400/10 transition-colors"
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
      </div>
    </main>
  )
}
