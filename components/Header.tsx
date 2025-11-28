"use client"

import Link from "next/link"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Bell, Settings, LogOut, User, Menu, X, ChevronDown } from 'lucide-react'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, logout } = useAuth()

  return (
    <header className="fixed top-0 w-full z-50 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-950/95 backdrop-blur-xl border-b border-cyan-500/20 shadow-xl shadow-cyan-500/5">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-violet-500 rounded-lg blur opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110" />
            <div className="relative w-10 h-10 bg-gradient-to-br from-cyan-400 to-violet-500 rounded-lg flex items-center justify-center text-slate-950 font-bold text-lg group-hover:shadow-lg group-hover:shadow-cyan-400/50 transition-all duration-300">
              CR
            </div>
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
              CyberRakshak
            </span>
            <span className="text-xs text-cyan-400/60 font-medium">Incident Response</span>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {!user ? (
            <>
              <Link
                href="/report"
                className="px-4 py-2 text-slate-300 hover:text-cyan-400 font-medium transition-all duration-200 hover:bg-cyan-400/10 rounded-lg"
              >
                Report
              </Link>
              <Link
                href="/teams"
                className="px-4 py-2 text-slate-300 hover:text-cyan-400 font-medium transition-all duration-200 hover:bg-cyan-400/10 rounded-lg"
              >
                For Teams
              </Link>
              <a
                href="/resources"
                className="px-4 py-2 text-slate-300 hover:text-cyan-400 font-medium transition-all duration-200 hover:bg-cyan-400/10 rounded-lg"
              >
                Resources
              </a>
            </>
          ) : (
            <>
              <Link
                href={user.role === "officer" ? "/officer-dashboard" : "/user-dashboard"}
                className="px-4 py-2 text-slate-300 hover:text-cyan-400 font-medium transition-all duration-200 hover:bg-cyan-400/10 rounded-lg"
              >
                Dashboard
              </Link>
              <Link
                href="/report"
                className="px-4 py-2 text-slate-300 hover:text-cyan-400 font-medium transition-all duration-200 hover:bg-cyan-400/10 rounded-lg"
              >
                Report
              </Link>
              <Link
                href="/notifications"
                className="px-4 py-2 text-slate-300 hover:text-cyan-400 font-medium transition-all duration-200 hover:bg-cyan-400/10 rounded-lg"
              >
                Notifications
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {user && (
            <>
              <Link 
                href="/notifications"
                className="relative p-2 rounded-lg hover:bg-cyan-400/10 text-slate-300 hover:text-cyan-400 transition-all duration-200 group"
                title="View notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse group-hover:scale-125 transition-transform" />
              </Link>

              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-cyan-400/10 transition-all duration-200 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center text-slate-950 font-semibold text-sm">
                    {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div className="hidden sm:flex flex-col items-start">
                    <span className="text-sm font-semibold text-slate-50">{user?.fullName || "User"}</span>
                    <span className="text-xs text-cyan-400/70">{user?.role === "officer" ? "Officer" : "Citizen"}</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-900/95 backdrop-blur border border-cyan-500/20 rounded-lg shadow-xl shadow-cyan-500/10 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <Link
                      href={user.role === "officer" ? "/officer-profile" : "/user-profile"}
                      className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-cyan-400 hover:bg-cyan-400/10 transition-colors border-b border-slate-800/50"
                    >
                      <User className="w-4 h-4" />
                      <span className="text-sm font-medium">Profile</span>
                    </Link>
                    <Link
                      href={user.role === "officer" ? "/officer-settings" : "/user-settings"}
                      className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-cyan-400 hover:bg-cyan-400/10 transition-colors border-b border-slate-800/50"
                    >
                      <Settings className="w-4 h-4" />
                      <span className="text-sm font-medium">Settings</span>
                    </Link>
                    <button
                      onClick={() => {
                        logout()
                        setUserMenuOpen(false)
                      }}
                      className="flex items-center gap-3 px-4 py-3 w-full text-slate-300 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm font-medium">Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {!user && (
            <Link
              href="/login"
              className="hidden sm:flex px-6 py-2 bg-gradient-to-r from-cyan-400 to-violet-500 text-slate-950 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-400/50 transition-all duration-300 hover:scale-105"
            >
              Sign In
            </Link>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-cyan-400/10 text-slate-300 hover:text-cyan-400 transition-all"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-gradient-to-b from-slate-900 to-slate-950 border-b border-cyan-500/20 px-4 py-4 space-y-3 animate-in fade-in slide-in-from-top-4 duration-300">
          {!user ? (
            <>
              <Link
                href="/report"
                className="block px-4 py-3 text-slate-300 hover:text-cyan-400 font-medium hover:bg-cyan-400/10 rounded-lg transition-colors"
              >
                Report
              </Link>
              <Link
                href="/teams"
                className="block px-4 py-3 text-slate-300 hover:text-cyan-400 font-medium hover:bg-cyan-400/10 rounded-lg transition-colors"
              >
                For Teams
              </Link>
              <a
                href="#resources"
                className="block px-4 py-3 text-slate-300 hover:text-cyan-400 font-medium hover:bg-cyan-400/10 rounded-lg transition-colors"
              >
                Resources
              </a>
              <Link
                href="/login"
                className="block px-4 py-3 bg-gradient-to-r from-cyan-400 to-violet-500 text-slate-950 rounded-lg font-semibold text-center w-full"
              >
                Sign In
              </Link>
            </>
          ) : (
            <>
              <Link
                href={user.role === "officer" ? "/officer-dashboard" : "/user-dashboard"}
                className="block px-4 py-3 text-slate-300 hover:text-cyan-400 font-medium hover:bg-cyan-400/10 rounded-lg transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/report"
                className="block px-4 py-3 text-slate-300 hover:text-cyan-400 font-medium hover:bg-cyan-400/10 rounded-lg transition-colors"
              >
                Report
              </Link>
              <Link
                href="/notifications"
                className="block px-4 py-3 text-slate-300 hover:text-cyan-400 font-medium hover:bg-cyan-400/10 rounded-lg transition-colors"
              >
                Notifications
              </Link>
              <Link
                href={user.role === "officer" ? "/officer-profile" : "/user-profile"}
                className="block px-4 py-3 text-slate-300 hover:text-cyan-400 font-medium hover:bg-cyan-400/10 rounded-lg transition-colors"
              >
                Profile
              </Link>
              <Link
                href={user.role === "officer" ? "/officer-settings" : "/user-settings"}
                className="block px-4 py-3 text-slate-300 hover:text-cyan-400 font-medium hover:bg-cyan-400/10 rounded-lg transition-colors"
              >
                Settings
              </Link>
              <button
                onClick={() => {
                  logout()
                  setMobileMenuOpen(false)
                }}
                className="block px-4 py-3 text-red-400 font-medium hover:bg-red-400/10 rounded-lg transition-colors w-full text-left"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </header>
  )
}
