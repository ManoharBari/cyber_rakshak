"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { ShieldAlert, CheckCircle, Shield } from "lucide-react"
import { motion } from "framer-motion"

export default function SignupPage() {
  const router = useRouter()
  const { signup } = useAuth()

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const validateForm = () => {
    if (!formData.fullName.trim()) return "Full name is required"
    if (!formData.email.trim()) return "Email is required"
    if (formData.password.length < 8) return "Password must be at least 8 characters"
    if (formData.password !== formData.confirmPassword) return "Passwords do not match"
    if (!agreed) return "You must agree to the terms and privacy policy"
    return ""
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    try {
      await signup(formData.fullName, formData.email, formData.password)
      setSuccess(true)
      setTimeout(() => router.push("/login"), 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-gradient-to-b from-slate-800/50 to-slate-900/50 backdrop-blur border border-slate-700/50 rounded-2xl p-8 text-center space-y-4"
        >
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }}>
            <CheckCircle className="w-12 h-12 text-cyan-400 mx-auto" />
          </motion.div>
          <h2 className="text-2xl font-bold text-white">Account Created!</h2>
          <p className="text-slate-400">Redirecting to login page...</p>
        </motion.div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-gradient-to-b from-slate-800/50 to-slate-900/50 backdrop-blur border border-slate-700/50 rounded-2xl p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <div className="bg-gradient-to-br from-cyan-500/20 to-violet-500/20 p-3 rounded-xl">
                <Shield className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white">Join CyberRakshak</h1>
            <p className="text-slate-400">Create your citizen account</p>
          </div>

          {/* Error */}
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-white">Full Name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="John Doe"
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-white">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-white">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              />
              <p className="text-xs text-slate-500">Minimum 8 characters</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-white">Confirm Password</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="••••••••"
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              />
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-700/50 border border-slate-600/50 cursor-pointer mt-1"
              />
              <span className="text-sm text-slate-400">
                I agree to the{" "}
                <Link href="#" className="text-cyan-400 hover:text-cyan-300">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="#" className="text-cyan-400 hover:text-cyan-300">
                  Privacy Policy
                </Link>
              </span>
            </label>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-all duration-300"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </motion.button>
          </form>

          {/* Login Link */}
          <div className="text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold">
              Sign in
            </Link>
          </div>
        </div>
      </motion.div>
    </main>
  )
}
