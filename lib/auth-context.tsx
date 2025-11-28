"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback, useEffect } from "react"

export interface User {
  id: string
  email: string
  fullName: string
  role: "user" | "officer"
  createdAt: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string, role: "user" | "officer") => Promise<void>
  signup: (fullName: string, email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock user database
const MOCK_USERS: Record<string, { password: string; user: User }> = {
  "user@CyberRakshak.com": {
    password: "password123",
    user: {
      id: "user-1",
      email: "user@CyberRakshak.com",
      fullName: "John Citizen",
      role: "user",
      createdAt: new Date().toISOString(),
    },
  },
  "officer@CyberRakshak.com": {
    password: "officer123",
    user: {
      id: "officer-1",
      email: "officer@CyberRakshak.com",
      fullName: "Jane Officer",
      role: "officer",
      createdAt: new Date().toISOString(),
    },
  },
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Initialize from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("CyberRakshak_user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("[v0] Failed to parse stored user:", error)
      }
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string, role: "user" | "officer") => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const userEntry = MOCK_USERS[email]
    if (!userEntry || userEntry.password !== password || userEntry.user.role !== role) {
      throw new Error("Invalid email, password, or role")
    }

    setUser(userEntry.user)
    localStorage.setItem("CyberRakshak_user", JSON.stringify(userEntry.user))
  }, [])

  const signup = useCallback(async (fullName: string, email: string, password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (MOCK_USERS[email]) {
      throw new Error("Email already registered")
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      fullName,
      role: "user",
      createdAt: new Date().toISOString(),
    }

    MOCK_USERS[email] = { password, user: newUser }
    // Don't auto-login after signup, redirect to login
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem("CyberRakshak_user")
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: user !== null,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
