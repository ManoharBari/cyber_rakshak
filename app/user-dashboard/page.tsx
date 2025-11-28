"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import {
  ChevronDown,
  LogOut,
  Settings,
  User,
  Menu,
  X,
  AlertCircle,
  Clock,
  CheckCircle,
  Archive,
  Search,
  Eye,
  Zap,
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

// Mock data
const mockIncidents = [
  {
    id: "INC-001",
    title: "Suspicious Login Attempt",
    type: "phishing",
    priority: "high",
    status: "in-progress",
    date: "2024-01-15",
    description: "Multiple login attempts from unknown IP addresses.",
    aiSummary: "This incident shows signs of a coordinated phishing attack targeting company email accounts.",
    timeline: [
      { step: "Submitted", date: "2024-01-15", completed: true },
      { step: "Under Review", date: "2024-01-15", completed: true },
      { step: "Assigned", date: "2024-01-16", completed: true },
      { step: "Resolved", date: "", completed: false },
      { step: "Closed", date: "", completed: false },
    ],
  },
  {
    id: "INC-002",
    title: "Data Breach Notification",
    type: "data-breach",
    priority: "high",
    status: "submitted",
    date: "2024-01-14",
    description: "Potential unauthorized access to customer database.",
    aiSummary: "Critical data exposure detected. Immediate action required.",
    timeline: [
      { step: "Submitted", date: "2024-01-14", completed: true },
      { step: "Under Review", date: "", completed: false },
      { step: "Assigned", date: "", completed: false },
      { step: "Resolved", date: "", completed: false },
      { step: "Closed", date: "", completed: false },
    ],
  },
  {
    id: "INC-003",
    title: "Malware Detection",
    type: "malware",
    priority: "medium",
    status: "resolved",
    date: "2024-01-10",
    description: "Malicious file detected in system folders.",
    aiSummary: "Known malware signature identified. Quarantine recommended.",
    timeline: [
      { step: "Submitted", date: "2024-01-10", completed: true },
      { step: "Under Review", date: "2024-01-10", completed: true },
      { step: "Assigned", date: "2024-01-11", completed: true },
      { step: "Resolved", date: "2024-01-12", completed: true },
      { step: "Closed", date: "", completed: false },
    ],
  },
]

const chartData = [
  { date: "Jan 1", incidents: 2 },
  { date: "Jan 3", incidents: 3 },
  { date: "Jan 5", incidents: 2 },
  { date: "Jan 7", incidents: 1 },
  { date: "Jan 9", incidents: 1 },
  { date: "Jan 11", incidents: 2 },
  { date: "Jan 15", incidents: 1 },
]

const priorityChartData = [
  { name: "High", value: 2 },
  { name: "Medium", value: 1 },
  { name: "Low", value: 0 },
]

const COLORS = {
  high: "#ef4444",
  medium: "#eab308",
  low: "#22c55e",
}

const PRIORITY_COLORS = ["#ef4444", "#eab308", "#22c55e"]

export default function UserDashboardPage() {
  const { user, logout, loading } = useAuth()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [selectedIncident, setSelectedIncident] = useState(null)
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [incidents, setIncidents] = useState<typeof mockIncidents>([])

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    } else if (user) {
      const storedIncidents = localStorage.getItem("incidents")
      if (storedIncidents) {
        try {
          const parsed = JSON.parse(storedIncidents)
          setIncidents(parsed)
        } catch (e) {
          console.error("[v0] Failed to load incidents from localStorage:", e)
          setIncidents(mockIncidents)
        }
      } else {
        setIncidents(mockIncidents)
      }
    }
  }, [user, loading, router])

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  const filteredIncidents = incidents.filter((incident) => {
    const matchesPriority = priorityFilter === "all" || incident.priority === priorityFilter
    const matchesStatus = statusFilter === "all" || incident.status === statusFilter
    const matchesSearch =
      incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.id.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesPriority && matchesStatus && matchesSearch
  })

  const totalIncidents = incidents.length
  const activeIncidents = incidents.filter((i) => i.status === "in-progress" || i.status === "submitted").length
  const resolvedIncidents = incidents.filter((i) => i.status === "resolved" || i.status === "closed").length
  const highPriorityAlerts = incidents.filter((i) => i.priority === "high").length

  const getPriorityColor = (priority) => {
    const colors = {
      high: "bg-red-500/20 text-red-400 border border-red-500/30",
      medium: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
      low: "bg-green-500/20 text-green-400 border border-green-500/30",
    }
    return colors[priority] || colors.low
  }

  const getStatusColor = (status) => {
    const colors = {
      submitted: "bg-blue-500/20 text-blue-400",
      "in-progress": "bg-cyan-500/20 text-cyan-400",
      resolved: "bg-green-500/20 text-green-400",
      closed: "bg-gray-500/20 text-gray-400",
    }
    return colors[status] || colors.submitted
  }

  const getStatusIcon = (status) => {
    const icons = {
      submitted: <AlertCircle className="w-4 h-4" />,
      "in-progress": <Clock className="w-4 h-4" />,
      resolved: <CheckCircle className="w-4 h-4" />,
      closed: <Archive className="w-4 h-4" />,
    }
    return icons[status] || icons.submitted
  }

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-sidebar-border">
            <h1 className="text-2xl font-bold text-sidebar-primary">CyberAid</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-sidebar-foreground hover:text-sidebar-primary"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            <div className="px-4 py-2 bg-sidebar-primary/10 text-sidebar-primary rounded-lg font-semibold flex items-center gap-3">
              <Zap className="w-5 h-5" />
              Dashboard
            </div>
            <Link
              href="/report"
              className="flex items-center gap-3 px-4 py-2 text-sidebar-foreground hover:bg-sidebar-accent/10 hover:text-sidebar-accent rounded-lg transition-colors"
            >
              <AlertCircle className="w-5 h-5" />
              Report Incident
            </Link>
            <Link
              href="/user-profile-edit"
              className="flex items-center gap-3 px-4 py-2 text-sidebar-foreground hover:bg-sidebar-accent/10 hover:text-sidebar-accent rounded-lg transition-colors"
            >
              <User className="w-5 h-5" />
              Profile
            </Link>
            <Link
              href="/user-settings-advanced"
              className="flex items-center gap-3 px-4 py-2 text-sidebar-foreground hover:bg-sidebar-accent/10 hover:text-sidebar-accent rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5" />
              Settings
            </Link>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-sidebar-border">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 text-sidebar-foreground hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-foreground hover:text-primary">
                <Menu className="w-6 h-6" />
              </button>
              <h2 className="text-xl font-bold">Dashboard</h2>
            </div>

            {/* User Avatar Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-border transition-colors"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-primary-foreground">
                    {user.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50">
                  <Link
                    href="/user-profile-edit"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-border transition-colors"
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                  <Link
                    href="/user-settings-advanced"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-border transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                  <hr className="border-border" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-red-500/10 text-red-400 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Welcome Section */}
            <div className="space-y-1">
              <h1 className="text-3xl font-bold">Welcome back, {user.fullName}</h1>
              <p className="text-muted-foreground">Here's a summary of your incident reports</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-card border border-border rounded-lg p-6 glow-cyan">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Total Incidents</p>
                    <p className="text-3xl font-bold text-primary">{totalIncidents}</p>
                  </div>
                  <AlertCircle className="w-10 h-10 text-primary/30" />
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6 glow-cyan">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Active Incidents</p>
                    <p className="text-3xl font-bold text-primary">{activeIncidents}</p>
                  </div>
                  <Clock className="w-10 h-10 text-primary/30" />
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6 glow-cyan">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Resolved</p>
                    <p className="text-3xl font-bold text-green-400">{resolvedIncidents}</p>
                  </div>
                  <CheckCircle className="w-10 h-10 text-green-400/30" />
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6 glow-violet">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">High Priority</p>
                    <p className="text-3xl font-bold text-red-400">{highPriorityAlerts}</p>
                  </div>
                  <Zap className="w-10 h-10 text-red-400/30" />
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4">Incidents Over Time</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorIncidents" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00ffff" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#00ffff" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a3544" />
                    <XAxis dataKey="date" stroke="#a0aec0" />
                    <YAxis stroke="#a0aec0" />
                    <Tooltip contentStyle={{ backgroundColor: "#141829", border: "1px solid #2a3544" }} />
                    <Area
                      type="monotone"
                      dataKey="incidents"
                      stroke="#00ffff"
                      fillOpacity={1}
                      fill="url(#colorIncidents)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4">By Priority</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={priorityChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {priorityChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "#141829", border: "1px solid #2a3544" }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {priorityChartData.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PRIORITY_COLORS[idx] }} />
                        {item.name}
                      </span>
                      <span className="font-bold">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Incident Table */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h3 className="text-lg font-bold">My Incidents</h3>
                <Link href="/report" className="btn-primary text-sm">
                  + New Report
                </Link>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search incidents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>

                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-primary"
                >
                  <option value="all">All Priorities</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-primary"
                >
                  <option value="all">All Status</option>
                  <option value="submitted">Submitted</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              {/* Table */}
              <div className="bg-card border border-border rounded-lg overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border">
                    <tr className="text-left text-sm font-semibold text-muted-foreground">
                      <th className="px-6 py-4">ID</th>
                      <th className="px-6 py-4">Title</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4">Priority</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredIncidents.length > 0 ? (
                      filteredIncidents.map((incident) => (
                        <tr key={incident.id} className="hover:bg-border/50 transition-colors">
                          <td className="px-6 py-4 text-sm font-mono text-primary">{incident.id}</td>
                          <td className="px-6 py-4 text-sm font-semibold">{incident.title}</td>
                          <td className="px-6 py-4 text-sm capitalize text-muted-foreground">
                            {incident.type.replace("-", " ")}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(incident.priority)}`}
                            >
                              {incident.priority.charAt(0).toUpperCase() + incident.priority.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(incident.status)}`}
                            >
                              {getStatusIcon(incident.status)}
                              {incident.status.replace("-", " ").charAt(0).toUpperCase() +
                                incident.status.replace("-", " ").slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{incident.date}</td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => setSelectedIncident(incident)}
                              className="flex items-center gap-2 px-3 py-2 text-sm bg-primary/10 text-primary hover:bg-primary/20 rounded-lg transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                          No incidents found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Detail Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Incident Details</h2>
              <button onClick={() => setSelectedIncident(null)} className="text-muted-foreground hover:text-foreground">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Incident Info */}
              <div className="space-y-4">
                <div>
                  <p className="text-muted-foreground text-sm">Incident ID</p>
                  <p className="text-lg font-mono text-primary">{selectedIncident.id}</p>
                </div>

                <div>
                  <p className="text-muted-foreground text-sm">Title</p>
                  <p className="text-lg font-semibold">{selectedIncident.title}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground text-sm">Type</p>
                    <p className="text-sm font-semibold capitalize">{selectedIncident.type.replace("-", " ")}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Priority</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(selectedIncident.priority)}`}
                    >
                      {selectedIncident.priority.charAt(0).toUpperCase() + selectedIncident.priority.slice(1)}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-muted-foreground text-sm">Description</p>
                  <p className="text-sm">{selectedIncident.description}</p>
                </div>

                <div>
                  <p className="text-muted-foreground text-sm">AI Analysis Summary</p>
                  <p className="text-sm bg-primary/10 text-primary border border-primary/20 rounded-lg p-3">
                    {selectedIncident.aiSummary}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground text-sm">Submitted Date</p>
                    <p className="text-sm">{selectedIncident.date}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Status</p>
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedIncident.status)}`}
                    >
                      {getStatusIcon(selectedIncident.status)}
                      {selectedIncident.status.replace("-", " ").charAt(0).toUpperCase() +
                        selectedIncident.status.replace("-", " ").slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="border-t border-border pt-6">
                <h3 className="text-lg font-bold mb-4">Progress Timeline</h3>
                <div className="space-y-4">
                  {selectedIncident.timeline.map((step, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                            step.completed
                              ? "bg-primary/30 text-primary border border-primary/50"
                              : "bg-muted text-muted-foreground border border-muted"
                          }`}
                        >
                          {idx + 1}
                        </div>
                        {idx < selectedIncident.timeline.length - 1 && (
                          <div className={`w-1 h-12 mt-2 ${step.completed ? "bg-primary/30" : "bg-muted"}`} />
                        )}
                      </div>
                      <div className="pt-1">
                        <p className="font-semibold">{step.step}</p>
                        {step.date && <p className="text-sm text-muted-foreground">{step.date}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-border px-6 py-4 flex gap-3 justify-end">
              <button
                onClick={() => setSelectedIncident(null)}
                className="px-6 py-2 border border-border rounded-lg hover:bg-border transition-colors"
              >
                Close
              </button>
              <Link
                href="/report"
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
              >
                Report New Incident
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}
