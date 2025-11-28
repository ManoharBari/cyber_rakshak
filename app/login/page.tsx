"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { ShieldAlert } from "lucide-react"
import { motion } from "framer-motion"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [role, setRole] = useState<"user" | "officer">("user")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [show2FA, setShow2FA] = useState(false)
  const [otpCode, setOtpCode] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await login(email, password, role)

      if (role === "officer") {
        setShow2FA(true)
      } else {
        router.push("/user-dashboard")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setLoading(false)
    }
  }

  const handleOTPSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (otpCode.length === 6) {
      router.push("/officer-dashboard")
    } else {
      setError("Please enter a valid 6-digit code")
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {!show2FA ? (
          <div className="bg-gradient-to-b from-slate-800/50 to-slate-900/50 backdrop-blur border border-slate-700/50 rounded-2xl p-8 space-y-8">
            {/* Header */}
            <div className="text-center space-y-3">
              <div className="flex justify-center">
                <div className="bg-gradient-to-br from-cyan-500/20 to-violet-500/20 p-3 rounded-xl">
                  <ShieldAlert className="w-6 h-6 text-cyan-400" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-white">Welcome to CyberAid</h1>
              <p className="text-slate-400">Sign in to your account</p>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role Selection */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-white">Login As</label>
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    type="button"
                    onClick={() => setRole("user")}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-3 rounded-lg font-medium transition-all ${
                      role === "user"
                        ? "bg-cyan-500/20 border border-cyan-500/50 text-cyan-400"
                        : "bg-slate-700/30 border border-slate-600/30 text-slate-400"
                    }`}
                  >
                    Citizen
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => setRole("officer")}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-3 rounded-lg font-medium transition-all ${
                      role === "officer"
                        ? "bg-violet-500/20 border border-violet-500/50 text-violet-400"
                        : "bg-slate-700/30 border border-slate-600/30 text-slate-400"
                    }`}
                  >
                    Officer
                  </motion.button>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={role === "user" ? "user@cyberaid.com" : "officer@cyberaid.com"}
                  required
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold text-white">Password</label>
                  <Link href="/forgot-password" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                />
              </div>

              {/* Remember Me */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-700/50 border border-slate-600/50 cursor-pointer"
                />
                <span className="text-sm text-slate-400">Remember me</span>
              </label>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-all duration-300"
              >
                {loading ? "Signing in..." : "Sign In"}
              </motion.button>
            </form>

            {/* Signup Link */}
            {role === "user" && (
              <div className="text-center text-sm text-slate-400">
                Don't have an account?{" "}
                <Link href="/signup" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
                  Create one
                </Link>
              </div>
            )}

            {/* Demo Credentials */}
            <div className="border-t border-slate-700/50 pt-4 space-y-2">
              <p className="text-xs text-slate-500 text-center">Demo Credentials:</p>
              <p className="text-xs text-slate-500 text-center">
                {role === "user" ? "user@cyberaid.com / password123" : "officer@cyberaid.com / officer123"}
              </p>
            </div>
          </div>
        ) : (
          // 2FA Modal
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-b from-slate-800/50 to-slate-900/50 backdrop-blur border border-slate-700/50 rounded-2xl p-8 space-y-6"
          >
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-white">Two-Factor Authentication</h2>
              <p className="text-slate-400">Enter the 6-digit code from your authenticator</p>
            </div>

            <form onSubmit={handleOTPSubmit} className="space-y-6">
              <input
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                required
                className="w-full text-center text-3xl font-bold tracking-widest bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              />

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm text-center"
                >
                  {error}
                </motion.div>
              )}

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-300"
              >
                Verify Code
              </motion.button>
            </form>
          </motion.div>
        )}
      </motion.div>
    </main>
  )
}
