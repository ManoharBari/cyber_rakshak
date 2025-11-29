'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Bell, Archive, Trash2, Search, Filter, X, CheckCircle, AlertCircle, Info, Clock } from 'lucide-react'
import Link from 'next/link'

interface Notification {
  id: string
  type: 'incident_assigned' | 'status_update' | 'comment' | 'alert' | 'info'
  title: string
  message: string
  incidentId?: string
  read: boolean
  archived: boolean
  timestamp: Date
  icon?: string
}

export default function NotificationsPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'archived'>('all')
  const [selectedNotif, setSelectedNotif] = useState<Notification | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    // Load mock notifications
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'incident_assigned',
        title: 'Incident Assigned',
        message: 'You have been assigned to incident INC-1732982400000-abc123',
        incidentId: 'INC-1732982400000-abc123',
        read: false,
        archived: false,
        timestamp: new Date(Date.now() - 5 * 60000), // 5 minutes ago
      },
      {
        id: '2',
        type: 'status_update',
        title: 'Status Update',
        message: 'Your incident report has been reviewed by an officer',
        incidentId: 'INC-1732982400000-abc123',
        read: false,
        archived: false,
        timestamp: new Date(Date.now() - 15 * 60000), // 15 minutes ago
      },
      {
        id: '3',
        type: 'comment',
        title: 'New Comment',
        message: 'Officer Jane commented: "We are investigating this phishing attack"',
        incidentId: 'INC-1732982400000-abc123',
        read: true,
        archived: false,
        timestamp: new Date(Date.now() - 1 * 3600000), // 1 hour ago
      },
      {
        id: '4',
        type: 'alert',
        title: 'Critical Alert',
        message: 'Similar incidents detected in your area',
        read: true,
        archived: false,
        timestamp: new Date(Date.now() - 3 * 3600000), // 3 hours ago
      },
      {
        id: '5',
        type: 'info',
        title: 'System Update',
        message: 'CyberAid platform has been updated with new features',
        read: true,
        archived: true,
        timestamp: new Date(Date.now() - 24 * 3600000), // 1 day ago
      },
    ]

    setNotifications(mockNotifications)
  }, [isAuthenticated, router])

  useEffect(() => {
    let filtered = notifications

    // Apply type filter
    if (filterType === 'unread') {
      filtered = filtered.filter((n) => !n.read)
    } else if (filterType === 'archived') {
      filtered = filtered.filter((n) => n.archived)
    } else {
      filtered = filtered.filter((n) => !n.archived)
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (n) =>
          n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          n.message.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredNotifications(filtered)
  }, [notifications, filterType, searchTerm])

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const handleMarkAsUnread = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: false } : n))
    )
  }

  const handleArchive = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, archived: true } : n))
    )
  }

  const handleUnarchive = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, archived: false } : n))
    )
  }

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const getNotificationIcon = (type: string) => {
    const icons: Record<string, JSX.Element> = {
      incident_assigned: <AlertCircle className="w-5 h-5 text-cyan-400" />,
      status_update: <CheckCircle className="w-5 h-5 text-green-400" />,
      comment: <Info className="w-5 h-5 text-blue-400" />,
      alert: <AlertCircle className="w-5 h-5 text-red-400" />,
      info: <Info className="w-5 h-5 text-cyan-400" />,
    }
    return icons[type] || icons.info
  }

  const getNotificationColor = (type: string) => {
    const colors: Record<string, string> = {
      incident_assigned: 'border-l-4 border-l-cyan-400',
      status_update: 'border-l-4 border-l-green-400',
      comment: 'border-l-4 border-l-blue-400',
      alert: 'border-l-4 border-l-red-400',
      info: 'border-l-4 border-l-cyan-400',
    }
    return colors[type] || colors.info
  }

  const unreadCount = notifications.filter((n) => !n.read && !n.archived).length

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - new Date(date).getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return new Date(date).toLocaleDateString()
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Bell className="w-8 h-8 text-cyan-400" />
              <h1 className="text-3xl font-bold text-white">Notifications</h1>
              {unreadCount > 0 && (
                <span className="ml-4 inline-block px-3 py-1 bg-red-500/20 border border-red-500/50 text-red-300 rounded-full text-sm font-semibold">
                  {unreadCount} unread
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/30 rounded-lg transition-colors text-sm font-medium"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2">
              {(['all', 'unread', 'archived'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setFilterType(filter)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filterType === filter
                      ? 'bg-cyan-500 text-slate-950'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-16">
            <Bell className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">No notifications yet</p>
            <p className="text-slate-500 text-sm mt-2">
              {filterType === 'archived'
                ? 'Your archived notifications will appear here'
                : 'You\'re all caught up!'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`group relative flex items-start gap-4 p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-lg transition-all cursor-pointer ${getNotificationColor(
                  notif.type
                )} ${!notif.read ? 'ring-1 ring-cyan-500/50' : ''}`}
                onClick={() => setSelectedNotif(notif)}
              >
                {/* Unread indicator */}
                {!notif.read && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-cyan-400 rounded-full" />
                )}

                {/* Icon */}
                <div className="mt-1 flex-shrink-0">{getNotificationIcon(notif.type)}</div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className={`font-semibold ${notif.read ? 'text-slate-300' : 'text-white'}`}>
                        {notif.title}
                      </h3>
                      <p className="text-slate-400 text-sm mt-1 line-clamp-2">{notif.message}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <Clock className="w-3 h-3" />
                          {formatTime(notif.timestamp)}
                        </div>
                        {notif.incidentId && (
                          <Link
                            href={`/incident/${notif.incidentId}`}
                            className="text-xs text-cyan-400 hover:text-cyan-300"
                            onClick={(e) => e.stopPropagation()}
                          >
                            View incident →
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!notif.read && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleMarkAsRead(notif.id)
                      }}
                      className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-700 rounded transition-colors"
                      title="Mark as read"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  )}
                  {notif.read && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleMarkAsUnread(notif.id)
                      }}
                      className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-700 rounded transition-colors"
                      title="Mark as unread"
                    >
                      <Circle className="w-4 h-4" />
                    </button>
                  )}
                  {!notif.archived && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleArchive(notif.id)
                      }}
                      className="p-2 text-slate-400 hover:text-violet-400 hover:bg-slate-700 rounded transition-colors"
                      title="Archive"
                    >
                      <Archive className="w-4 h-4" />
                    </button>
                  )}
                  {notif.archived && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleUnarchive(notif.id)
                      }}
                      className="p-2 text-slate-400 hover:text-violet-400 hover:bg-slate-700 rounded transition-colors"
                      title="Unarchive"
                    >
                      <Clock className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(notif.id)
                    }}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedNotif && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedNotif(null)}
        >
          <div
            className="bg-slate-800 border border-slate-700 rounded-lg max-w-md w-full p-6 animate-in fade-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {getNotificationIcon(selectedNotif.type)}
                <h2 className="text-xl font-bold text-white">{selectedNotif.title}</h2>
              </div>
              <button
                onClick={() => setSelectedNotif(null)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-slate-300 mb-4">{selectedNotif.message}</p>

            <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
              <Clock className="w-4 h-4" />
              {formatTime(selectedNotif.timestamp)}
            </div>

            <div className="flex flex-col gap-2">
              {selectedNotif.incidentId && (
                <Link
                  href={`/incident/${selectedNotif.incidentId}`}
                  className="w-full px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-semibold rounded-lg transition-colors text-center"
                >
                  View Incident
                </Link>
              )}
              <button
                onClick={() => {
                  if (selectedNotif.read) {
                    handleMarkAsUnread(selectedNotif.id)
                  } else {
                    handleMarkAsRead(selectedNotif.id)
                  }
                  setSelectedNotif(null)
                }}
                className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors"
              >
                {selectedNotif.read ? 'Mark as Unread' : 'Mark as Read'}
              </button>
              <button
                onClick={() => {
                  handleDelete(selectedNotif.id)
                  setSelectedNotif(null)
                }}
                className="w-full px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-300 font-semibold rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

import { Circle } from 'lucide-react'
