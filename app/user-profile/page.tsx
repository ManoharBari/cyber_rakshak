"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Mail, Phone, MapPin, Calendar, Shield, Activity } from "lucide-react"

export default function UserProfilePage() {
  const { user } = useAuth()
  const router = useRouter()

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

  return (
    <main className="min-h-screen pt-24 px-4 sm:px-6 pb-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">My Profile</h1>

        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-cyan-500/20 rounded-xl p-8 space-y-8">
          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center text-white font-bold text-3xl">
              {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-2">{user.fullName}</h2>
              <p className="text-cyan-400 font-medium">Citizen</p>
            </div>
          </div>

          <div className="border-t border-slate-800/50 pt-8">
            <h3 className="text-lg font-semibold text-white mb-6">Account Information</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-slate-400">Email Address</p>
                  <p className="text-white font-medium">{user.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-slate-400">Phone</p>
                  <p className="text-white font-medium">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-slate-400">Location</p>
                  <p className="text-white font-medium">San Francisco, CA</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-slate-400">Member Since</p>
                  <p className="text-white font-medium">January 15, 2024</p>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Stats */}
          <div className="border-t border-slate-800/50 pt-8">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              Account Activity
            </h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="bg-slate-950/50 border border-cyan-500/10 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-cyan-400">5</p>
                <p className="text-sm text-slate-400 mt-1">Incidents Reported</p>
              </div>
              <div className="bg-slate-950/50 border border-cyan-500/10 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-violet-400">3</p>
                <p className="text-sm text-slate-400 mt-1">Resolved</p>
              </div>
              <div className="bg-slate-950/50 border border-cyan-500/10 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-green-400">2</p>
                <p className="text-sm text-slate-400 mt-1">In Progress</p>
              </div>
            </div>
          </div>

          {/* Security Info */}
          <div className="border-t border-slate-800/50 pt-8">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-400" />
              Security
            </h3>
            <div className="flex items-center justify-between p-4 bg-slate-950/50 border border-green-500/20 rounded-lg">
              <div>
                <p className="font-medium text-white">Two-Factor Authentication</p>
                <p className="text-sm text-slate-400">Enabled</p>
              </div>
              <div className="w-3 h-3 bg-green-400 rounded-full" />
            </div>
          </div>

          <button className="w-full px-6 py-3 bg-gradient-to-r from-cyan-400 to-violet-500 text-slate-950 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-400/50 transition-all">
            Edit Profile
          </button>
        </div>
      </div>
    </main>
  )
}
