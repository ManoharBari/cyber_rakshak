"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, AlertCircle, CheckCircle, Info } from "lucide-react"

export interface Notification {
  id: string
  type: "success" | "error" | "info" | "warning"
  title: string
  message: string
  timestamp: Date
}

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    const mockNotification: Notification = {
      id: "1",
      type: "info",
      title: "New incident assigned",
      message: "You have been assigned to incident INC-001",
      timestamp: new Date(),
    }

    setTimeout(() => {
      setNotifications([mockNotification])
    }, 1000)

    const timer = setTimeout(() => {
      setNotifications([])
    }, 8000)

    return () => clearTimeout(timer)
  }, [])

  const getIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      success: <CheckCircle className="w-5 h-5 text-green-400" />,
      error: <AlertCircle className="w-5 h-5 text-red-400" />,
      warning: <AlertCircle className="w-5 h-5 text-yellow-400" />,
      info: <Info className="w-5 h-5 text-cyan-400" />,
    }
    return icons[type] || icons.info
  }

  const getStyles = (type: string) => {
    const styles: Record<string, string> = {
      success: "bg-green-500/20 border-green-500/50",
      error: "bg-red-500/20 border-red-500/50",
      warning: "bg-yellow-500/20 border-yellow-500/50",
      info: "bg-cyan-500/20 border-cyan-500/50",
    }
    return styles[type] || styles.info
  }

  return (
    <div className="fixed top-20 right-4 z-40 space-y-2 max-w-md">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className={`flex items-start gap-3 p-4 rounded-lg border ${getStyles(notif.type)} backdrop-blur animate-in slide-in-from-top-2 duration-200`}
        >
          {getIcon(notif.type)}
          <div className="flex-1">
            <p className="font-semibold text-white">{notif.title}</p>
            <p className="text-sm text-slate-300">{notif.message}</p>
          </div>
          <button
            onClick={() => setNotifications((prev) => prev.filter((n) => n.id !== notif.id))}
            className="text-slate-400 hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
