"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
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
  Edit,
  Shield,
  Save,
  XCircle,
  Plus,
  Trash2,
  Bell,
  EyeOff,
  Key,
  Users,
  Lock,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const mockIncidents = [
  {
    id: "INC-001",
    title: "Suspicious Login Attempt",
    reporter: "John Citizen",
    type: "phishing",
    priority: "high",
    status: "in-progress",
    date: "2024-01-15",
    assignedTo: "Jane Officer",
    description: "Multiple login attempts from unknown IP addresses.",
    aiSummary:
      "This incident shows signs of a coordinated phishing attack targeting company email accounts.",
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
    reporter: "Jane Smith",
    type: "data-breach",
    priority: "high",
    status: "submitted",
    date: "2024-01-14",
    assignedTo: null,
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
    reporter: "Bob Wilson",
    type: "malware",
    priority: "medium",
    status: "resolved",
    date: "2024-01-10",
    assignedTo: "John Officer",
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
  {
    id: "INC-004",
    title: "Physical Security Breach",
    reporter: "Alice Johnson",
    type: "physical",
    priority: "low",
    status: "closed",
    date: "2024-01-08",
    assignedTo: "Jane Officer",
    description: "Unauthorized access to server room.",
    aiSummary: "Access logs reviewed. Incident investigated and resolved.",
    timeline: [
      { step: "Submitted", date: "2024-01-08", completed: true },
      { step: "Under Review", date: "2024-01-08", completed: true },
      { step: "Assigned", date: "2024-01-09", completed: true },
      { step: "Resolved", date: "2024-01-09", completed: true },
      { step: "Closed", date: "2024-01-10", completed: true },
    ],
  },
  {
    id: "INC-005",
    title: "Network Anomaly",
    reporter: "Carol Davis",
    type: "other",
    priority: "medium",
    status: "in-progress",
    date: "2024-01-12",
    assignedTo: "Jane Officer",
    description: "Unusual traffic patterns detected on company network.",
    aiSummary: "Potential DDoS attack in progress. Traffic mitigated.",
    timeline: [
      { step: "Submitted", date: "2024-01-12", completed: true },
      { step: "Under Review", date: "2024-01-12", completed: true },
      { step: "Assigned", date: "2024-01-13", completed: true },
      { step: "Resolved", date: "", completed: false },
      { step: "Closed", date: "", completed: false },
    ],
  },
];

const chartData = [
  { date: "Jan 1", incidents: 5 },
  { date: "Jan 3", incidents: 8 },
  { date: "Jan 5", incidents: 6 },
  { date: "Jan 7", incidents: 10 },
  { date: "Jan 9", incidents: 7 },
  { date: "Jan 11", incidents: 9 },
  { date: "Jan 13", incidents: 12 },
  { date: "Jan 15", incidents: 14 },
];

function ControlPanelContent() {
  // This component would contain the summary cards and charts
  const { user } = useAuth();
  const [incidents, setIncidents] = useState<typeof mockIncidents>([]);

  useEffect(() => {
    const storedIncidents = localStorage.getItem("incidents");
    if (storedIncidents) {
      try {
        const parsed = JSON.parse(storedIncidents);
        setIncidents(parsed);
      } catch (e) {
        console.error("Failed to load incidents from localStorage:", e);
        setIncidents(mockIncidents);
      }
    } else {
      setIncidents(mockIncidents);
    }
  }, []);

  const totalIncidents = incidents.length;
  const pendingIncidents = incidents.filter(
    (i) => i.status === "submitted"
  ).length;
  const inProgressIncidents = incidents.filter(
    (i) => i.status === "in-progress"
  ).length;
  const resolvedIncidents = incidents.filter(
    (i) => i.status === "resolved"
  ).length;
  const closedIncidents = incidents.filter((i) => i.status === "closed").length;
  const highPriorityAlerts = incidents.filter(
    (i) => i.priority === "high"
  ).length;

  const statusChartData = [
    { name: "Submitted", value: pendingIncidents },
    { name: "In Progress", value: inProgressIncidents },
    { name: "Resolved", value: resolvedIncidents },
    { name: "Closed", value: closedIncidents },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">
          Welcome, {user?.fullName || "Officer"}
        </h1>
        <p className="text-muted-foreground">
          Overview of security incidents and system status
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-card border border-border rounded-lg p-6 glow-cyan">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Total Incidents</p>
              <p className="text-3xl font-bold text-primary">
                {totalIncidents}
              </p>
            </div>
            <AlertCircle className="w-10 h-10 text-primary/30" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 glow-red">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Pending</p>
              <p className="text-3xl font-bold text-red-400">
                {pendingIncidents}
              </p>
            </div>
            <AlertCircle className="w-10 h-10 text-red-400/30" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 glow-cyan">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">In Progress</p>
              <p className="text-3xl font-bold text-primary">
                {inProgressIncidents}
              </p>
            </div>
            <Clock className="w-10 h-10 text-primary/30" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 glow-cyan">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Resolved</p>
              <p className="text-3xl font-bold text-green-400">
                {resolvedIncidents}
              </p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-400/30" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 glow-violet">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">High Priority</p>
              <p className="text-3xl font-bold text-red-400">
                {highPriorityAlerts}
              </p>
            </div>
            <Zap className="w-10 h-10 text-red-400/30" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
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
              <Tooltip
                contentStyle={{
                  backgroundColor: "#141829",
                  border: "1px solid #2a3544",
                }}
              />
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
          <h3 className="text-lg font-bold mb-4">By Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statusChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a3544" />
              <XAxis dataKey="name" stroke="#a0aec0" />
              <YAxis stroke="#a0aec0" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#141829",
                  border: "1px solid #2a3544",
                }}
              />
              <Bar dataKey="value" fill="#00ffff" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function AllIncidentsContent({
  filteredIncidents,
  onEditIncident,
  searchTerm,
  setSearchTerm,
  priorityFilter,
  setPriorityFilter,
  statusFilter,
  setStatusFilter,
  selectedIncident,
  setSelectedIncident,
}) {
  // Helper functions from the original component
  const getPriorityColor = (priority) => {
    const colors = {
      high: "bg-red-500/20 text-red-400 border border-red-500/30",
      medium: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
      low: "bg-green-500/20 text-green-400 border border-green-500/30",
    };
    return colors[priority] || colors.low;
  };

  const router = useRouter();
  const getStatusColor = (status) => {
    const colors = {
      submitted: "bg-blue-500/20 text-blue-400",
      "in-progress": "bg-cyan-500/20 text-cyan-400",
      resolved: "bg-green-500/20 text-green-400",
      closed: "bg-gray-500/20 text-gray-400",
    };
    return colors[status] || colors.submitted;
  };

  const getStatusIcon = (status) => {
    const icons = {
      submitted: <AlertCircle className="w-4 h-4" />,
      "in-progress": <Clock className="w-4 h-4" />,
      resolved: <CheckCircle className="w-4 h-4" />,
      closed: <Archive className="w-4 h-4" />,
    };
    return icons[status] || icons.submitted;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 pt-6">
        <h3 className="text-lg font-bold">All Incidents</h3>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search incidents or reporters..."
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
      <div className="bg-card border border-border rounded-lg overflow-x-auto mx-6">
        <table className="w-full">
          <thead className="border-b border-border">
            <tr className="text-left text-sm font-semibold text-muted-foreground">
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Reporter</th>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Priority</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Assigned To</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredIncidents.length > 0 ? (
              filteredIncidents.map((incident) => (
                <tr
                  key={incident.id}
                  className="hover:bg-border/50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-mono text-primary">
                    {incident.id}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {incident.reporter || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold">
                    {incident.title}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(
                        incident.priority
                      )}`}
                    >
                      {incident.priority.charAt(0).toUpperCase() +
                        incident.priority.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        incident.status
                      )}`}
                    >
                      {getStatusIcon(incident.status)}
                      {incident.status
                        .replace("-", " ")
                        .charAt(0)
                        .toUpperCase() +
                        incident.status.replace("-", " ").slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {incident.assignedTo || (
                      <span className="text-yellow-400">Unassigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4 flex items-center gap-2">
                    <button
                      onClick={() => router.push(`/incident/${incident.id}`)}
                      className="flex items-center gap-1 px-3 py-2 text-sm bg-primary/10 text-primary hover:bg-primary/20 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button
                      onClick={() => onEditIncident(incident)}
                      className="flex items-center gap-1 px-3 py-2 text-sm bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-muted-foreground"
                >
                  No incidents found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SecurityTeamsContent() {
  const mockTeams = [
    {
      id: "TEAM-001",
      name: "Incident Response Team",
      members: 5,
      lead: "Jane Officer",
      status: "active",
      specialization: "Phishing & Malware",
      description: "Handles phishing attacks and malware incidents",
    },
    {
      id: "TEAM-002",
      name: "Data Security Team",
      members: 3,
      lead: "John Officer",
      status: "active",
      specialization: "Data Breaches",
      description: "Manages data breach investigations and prevention",
    },
    {
      id: "TEAM-003",
      name: "Network Security Team",
      members: 4,
      lead: "Alice Johnson",
      status: "active",
      specialization: "Network Anomalies",
      description: "Monitors and responds to network threats",
    },
    {
      id: "TEAM-004",
      name: "Physical Security Team",
      members: 2,
      lead: "Bob Wilson",
      status: "active",
      specialization: "Physical Security",
      description: "Handles physical security incidents",
    },
  ];

  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [teams, setTeams] = useState(mockTeams);
  const [showModal, setShowModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    lead: "",
    members: "",
    specialization: "",
    description: "",
    status: "active",
  });

  if (loading || !user || user.role !== "officer") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const handleNewTeam = () => {
    setEditingTeam(null);
    setFormData({
      name: "",
      lead: "",
      members: "",
      specialization: "",
      description: "",
      status: "active",
    });
    setShowModal(true);
  };

  const handleEditTeam = (team) => {
    setEditingTeam(team);
    setFormData({
      name: team.name,
      lead: team.lead,
      members: team.members.toString(),
      specialization: team.specialization,
      description: team.description || "",
      status: team.status,
    });
    setShowModal(true);
  };

  const handleSaveTeam = () => {
    if (editingTeam) {
      // Update existing team
      setTeams(
        teams.map((t) =>
          t.id === editingTeam.id
            ? {
                ...t,
                name: formData.name,
                lead: formData.lead,
                members: Number.parseInt(formData.members),
                specialization: formData.specialization,
                description: formData.description,
                status: formData.status,
              }
            : t
        )
      );
    } else {
      // Create new team
      const newTeam = {
        id: `TEAM-${String(teams.length + 1).padStart(3, "0")}`,
        name: formData.name,
        lead: formData.lead,
        members: Number.parseInt(formData.members),
        specialization: formData.specialization,
        description: formData.description,
        status: formData.status,
      };
      setTeams([...teams, newTeam]);
    }
    setShowModal(false);
  };

  const handleDeleteTeam = (teamId) => {
    setTeams(teams.filter((t) => t.id !== teamId));
  };

  return (
    <>
      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Security Teams</h1>
              <p className="text-muted-foreground">
                Manage and organize your security response teams
              </p>
            </div>
            <button
              onClick={handleNewTeam}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
            >
              <Plus className="w-4 h-4" />
              New Team
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-muted-foreground text-sm">Total Teams</p>
              <p className="text-3xl font-bold text-primary">{teams.length}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-muted-foreground text-sm">Active Members</p>
              <p className="text-3xl font-bold text-cyan-400">
                {teams.reduce((acc, team) => acc + team.members, 0)}
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-muted-foreground text-sm">Response Teams</p>
              <p className="text-3xl font-bold text-green-400">
                {teams.filter((t) => t.status === "active").length}
              </p>
            </div>
          </div>

          {/* Teams List */}
          <div className="space-y-4">
            {teams.map((team) => (
              <div
                key={team.id}
                className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold">{team.name}</h3>
                      <span className="px-2 py-1 text-xs font-semibold bg-green-500/20 text-green-400 rounded-full">
                        {team.status.charAt(0).toUpperCase() +
                          team.status.slice(1)}
                      </span>
                    </div>
                    {team.description && (
                      <p className="text-muted-foreground text-sm mb-3">
                        {team.description}
                      </p>
                    )}
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Team Lead</p>
                        <p className="font-semibold">{team.lead}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Members</p>
                        <p className="font-semibold">{team.members} people</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Specialization</p>
                        <p className="font-semibold">{team.specialization}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditTeam(team)}
                      className="flex items-center gap-1 px-3 py-2 text-sm bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTeam(team.id)}
                      className="flex items-center gap-1 px-3 py-2 text-sm bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Modal for Creating/Editing Team */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">
                {editingTeam ? "Edit Team" : "Create New Team"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Team Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-border border border-border/50 rounded-lg focus:outline-none focus:border-primary"
                  placeholder="e.g., Incident Response Team"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Team Lead
                </label>
                <input
                  type="text"
                  value={formData.lead}
                  onChange={(e) =>
                    setFormData({ ...formData, lead: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-border border border-border/50 rounded-lg focus:outline-none focus:border-primary"
                  placeholder="e.g., Jane Officer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Number of Members
                </label>
                <input
                  type="number"
                  value={formData.members}
                  onChange={(e) =>
                    setFormData({ ...formData, members: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-border border border-border/50 rounded-lg focus:outline-none focus:border-primary"
                  placeholder="e.g., 5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Specialization
                </label>
                <input
                  type="text"
                  value={formData.specialization}
                  onChange={(e) =>
                    setFormData({ ...formData, specialization: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-border border border-border/50 rounded-lg focus:outline-none focus:border-primary"
                  placeholder="e.g., Phishing & Malware"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-border border border-border/50 rounded-lg focus:outline-none focus:border-primary"
                  placeholder="Team description..."
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-border border border-border/50 rounded-lg focus:outline-none focus:border-primary"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-border transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTeam}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
              >
                <Save className="w-4 h-4" />
                Save Team
              </button>
            </div>
          </div>
        </div>
      )}

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}

function SettingsContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [criticalAlerts, setCriticalAlerts] = useState(true);
  const [dailySummary, setDailySummary] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!user || user.role !== "officer") {
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
    );
  }

  const handleSaveSettings = () => {
    // Save settings to localStorage or API
    const settings = {
      emailNotifications,
      smsNotifications,
      criticalAlerts,
      dailySummary,
      twoFactorEnabled,
    };
    localStorage.setItem("officer-settings", JSON.stringify(settings));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleChangePassword = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    // Handle password change
    console.log("Password change requested");
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setShowPasswordForm(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <>
      <main className="flex-1 ">
        <div className="p-6 space-y-6 max-w-4xl">
          <div>
            <h1 className="text-3xl font-bold">Officer Settings</h1>
            <p className="text-muted-foreground">
              Manage your preferences and account settings
            </p>
          </div>

          {/* Save Success Message */}
          {saveSuccess && (
            <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 flex items-center gap-3">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <p className="text-green-400">Settings saved successfully</p>
            </div>
          )}

          {/* Notifications */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Bell className="w-5 h-5 text-cyan-400" />
              Alert Preferences
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 hover:bg-border/50 rounded-lg transition-colors">
                <div>
                  <p className="font-medium text-white">Critical Alerts</p>
                  <p className="text-sm text-muted-foreground">
                    Urgent incidents requiring immediate action
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={criticalAlerts}
                    onChange={(e) => setCriticalAlerts(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-border peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-muted after:border-muted after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>

              <div className="flex items-center justify-between p-4 hover:bg-border/50 rounded-lg transition-colors">
                <div>
                  <p className="font-medium text-white">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Daily incident summaries and team updates
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-border peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-muted after:border-muted after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>

              <div className="flex items-center justify-between p-4 hover:bg-border/50 rounded-lg transition-colors">
                <div>
                  <p className="font-medium text-white">SMS Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Critical alerts via SMS
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={smsNotifications}
                    onChange={(e) => setSmsNotifications(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-border peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-muted after:border-muted after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>

              <div className="flex items-center justify-between p-4 hover:bg-border/50 rounded-lg transition-colors">
                <div>
                  <p className="font-medium text-white">Daily Summary</p>
                  <p className="text-sm text-muted-foreground">
                    Daily digest of all incidents
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dailySummary}
                    onChange={(e) => setDailySummary(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-border peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-muted after:border-muted after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Lock className="w-5 h-5 text-green-400" />
              Security
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 hover:bg-border/50 rounded-lg transition-colors">
                <div>
                  <p className="font-medium text-white">
                    Two-Factor Authentication
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={twoFactorEnabled}
                    onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-border peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-muted after:border-muted after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>

              {!showPasswordForm ? (
                <button
                  onClick={() => setShowPasswordForm(true)}
                  className="w-full px-6 py-3 border border-primary/50 text-primary rounded-lg font-semibold hover:bg-primary/10 transition-colors"
                >
                  Change Password
                </button>
              ) : (
                <div className="space-y-4 p-4 bg-border/30 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? "text" : "password"}
                        value={passwordForm.currentPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            currentPassword: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 bg-border border border-border/50 rounded-lg focus:outline-none focus:border-primary pr-10"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPasswords({
                            ...showPasswords,
                            current: !showPasswords.current,
                          })
                        }
                        className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                      >
                        {showPasswords.current ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? "text" : "password"}
                        value={passwordForm.newPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            newPassword: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 bg-border border border-border/50 rounded-lg focus:outline-none focus:border-primary pr-10"
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPasswords({
                            ...showPasswords,
                            new: !showPasswords.new,
                          })
                        }
                        className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                      >
                        {showPasswords.new ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? "text" : "password"}
                        value={passwordForm.confirmPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 bg-border border border-border/50 rounded-lg focus:outline-none focus:border-primary pr-10"
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPasswords({
                            ...showPasswords,
                            confirm: !showPasswords.confirm,
                          })
                        }
                        className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                      >
                        {showPasswords.confirm ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowPasswordForm(false)}
                      className="flex-1 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-border transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleChangePassword}
                      className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
                    >
                      Update Password
                    </button>
                  </div>
                </div>
              )}

              <button className="w-full px-6 py-3 border border-primary/50 text-primary rounded-lg font-semibold hover:bg-primary/10 transition-colors flex items-center justify-center gap-2">
                <Key className="w-4 h-4" />
                Manage API Keys
              </button>
            </div>
          </div>

          {/* Team Management */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" />
              Team Management
            </h2>
            <button className="w-full px-6 py-3 border border-primary/50 text-primary rounded-lg font-semibold hover:bg-primary/10 transition-colors">
              Manage Team Members
            </button>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSaveSettings}
            className="flex items-center justify-center gap-2 px-6 py-3 w-full bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
          >
            <Save className="w-4 h-4" />
            Save All Settings
          </button>
        </div>
      </main>
    </>
  );
}

export default function OfficerDashboardPage() {
  const router = useRouter();
  const { user, logout, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true); // Default to open
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("control-panel");
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [editingIncident, setEditingIncident] = useState(null);
  const [editForm, setEditForm] = useState({}); // Renamed from editFormData for clarity
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [incidents, setIncidents] = useState<typeof mockIncidents>([]); // This state is used by ControlPanelContent

  useEffect(() => {
    if (!loading && (!user || user.role !== "officer")) {
      router.push("/login");
    } else if (user) {
      // Load incidents from local storage or use mock data
      const storedIncidents = localStorage.getItem("incidents");
      if (storedIncidents) {
        try {
          const parsed = JSON.parse(storedIncidents);
          setIncidents(parsed);
        } catch (e) {
          console.error("[v0] Failed to load incidents from localStorage:", e);
          setIncidents(mockIncidents);
        }
      } else {
        setIncidents(mockIncidents);
      }
    }
  }, [user, loading, router]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleEditIncident = (incident) => {
    setEditingIncident(incident);
    setEditForm({
      title: incident.title,
      description: incident.description,
      priority: incident.priority,
      status: incident.status,
      assignedTo: incident.assignedTo,
      aiSummary: incident.aiSummary,
    });
  };

  const handleSaveEdit = () => {
    // Ensure we are updating the correct incident and save to localStorage
    const updatedIncidents = incidents.map((inc) =>
      inc.id === editingIncident.id ? { ...inc, ...editForm } : inc
    );
    setIncidents(updatedIncidents); // Update local state
    localStorage.setItem("incidents", JSON.stringify(updatedIncidents));
    setEditingIncident(null);
    setEditForm({});
  };

  const handleCancelEdit = () => {
    setEditingIncident(null);
    setEditForm({});
  };

  if (loading || !user || user.role !== "officer") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // Filter incidents for the AllIncidentsContent component
  const filteredIncidents = incidents.filter((incident) => {
    const matchesPriority =
      priorityFilter === "all" || incident.priority === priorityFilter;
    const matchesStatus =
      statusFilter === "all" || incident.status === statusFilter;
    const matchesSearch =
      incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.reporter?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesPriority && matchesStatus && matchesSearch;
  });

  const getPriorityColor = (priority) => {
    const colors = {
      high: "bg-red-500/20 text-red-400 border border-red-500/30",
      medium: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
      low: "bg-green-500/20 text-green-400 border border-green-500/30",
    };
    return colors[priority] || colors.low;
  };

  const getStatusColor = (status) => {
    const colors = {
      submitted: "bg-blue-500/20 text-blue-400",
      "in-progress": "bg-cyan-500/20 text-cyan-400",
      resolved: "bg-green-500/20 text-green-400",
      closed: "bg-gray-500/20 text-gray-400",
    };
    return colors[status] || colors.submitted;
  };

  const getStatusIcon = (status) => {
    const icons = {
      submitted: <AlertCircle className="w-4 h-4" />,
      "in-progress": <Clock className="w-4 h-4" />,
      resolved: <CheckCircle className="w-4 h-4" />,
      closed: <Archive className="w-4 h-4" />,
    };
    return icons[status] || icons.submitted;
  };

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
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-sidebar-primary" />
              <h1 className="text-xl font-bold text-sidebar-primary">
                CyberAid
              </h1>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-sidebar-foreground hover:text-sidebar-primary"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Officer Badge */}
          <div className="px-4 py-3 mx-2 mt-3 bg-violet-500/20 border border-violet-500/30 rounded-lg">
            <p className="text-xs text-violet-400 font-semibold">
              SECURITY OFFICER
            </p>
          </div>

          {/* Navigation - Updated to use tabs instead of separate pages */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            <button
              onClick={() => setActiveTab("control-panel")}
              className={`w-full text-left flex items-center gap-3 px-4 py-2 rounded-lg font-semibold transition-colors ${
                activeTab === "control-panel"
                  ? "bg-sidebar-primary/10 text-sidebar-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/10 hover:text-sidebar-accent"
              }`}
            >
              <Zap className="w-5 h-5" />
              Control Panel
            </button>
            <button
              onClick={() => setActiveTab("all-incidents")}
              className={`w-full text-left flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                activeTab === "all-incidents"
                  ? "bg-sidebar-primary/10 text-sidebar-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/10 hover:text-sidebar-accent"
              }`}
            >
              <AlertCircle className="w-5 h-5" />
              All Incidents
            </button>
            <button
              onClick={() => setActiveTab("security-teams")}
              className={`w-full text-left flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                activeTab === "security-teams"
                  ? "bg-sidebar-primary/10 text-sidebar-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/10 hover:text-sidebar-accent"
              }`}
            >
              <Shield className="w-5 h-5" />
              Security Teams
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full text-left flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                activeTab === "settings"
                  ? "bg-sidebar-primary/10 text-sidebar-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/10 hover:text-sidebar-accent"
              }`}
            >
              <Settings className="w-5 h-5" />
              Settings
            </button>
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
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-foreground hover:text-primary"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h2 className="text-xl font-bold">
                Security Officer Control Panel
              </h2>
            </div>

            {/* User Avatar Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-border transition-colors"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-primary rounded-full flex items-center justify-center">
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
                  <a
                    href="#"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-border transition-colors"
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-border transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </a>
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

        {/* Page Content - Render content based on activeTab */}
        <main className="flex-1 overflow-auto">
          {activeTab === "control-panel" && <ControlPanelContent />}
          {activeTab === "all-incidents" && (
            <AllIncidentsContent
              filteredIncidents={filteredIncidents}
              onEditIncident={handleEditIncident}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              priorityFilter={priorityFilter}
              setPriorityFilter={setPriorityFilter}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              selectedIncident={selectedIncident}
              setSelectedIncident={setSelectedIncident}
            />
          )}
          {activeTab === "security-teams" && <SecurityTeamsContent />}
          {activeTab === "settings" && <SettingsContent />}
        </main>
      </div>

      {/* Edit Modal - Add edit incident modal */}
      {editingIncident && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-xl font-bold">Edit Incident</h3>
              <button
                onClick={handleCancelEdit}
                className="text-muted-foreground hover:text-foreground"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Description
                </label>
                <textarea
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary h-24"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Priority
                  </label>
                  <select
                    value={editForm.priority}
                    onChange={(e) =>
                      setEditForm({ ...editForm, priority: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Status
                  </label>
                  <select
                    value={editForm.status}
                    onChange={(e) =>
                      setEditForm({ ...editForm, status: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                  >
                    <option value="submitted">Submitted</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Assigned To
                </label>
                <input
                  type="text"
                  value={editForm.assignedTo || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, assignedTo: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  AI Summary
                </label>
                <textarea
                  value={editForm.aiSummary}
                  onChange={(e) =>
                    setEditForm({ ...editForm, aiSummary: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary h-20"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg font-semibold transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="flex-1 px-4 py-2 bg-border text-foreground hover:bg-border/80 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                Incident Details - Management View
              </h2>
              <button
                onClick={() => setSelectedIncident(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Incident Info */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground text-sm">Incident ID</p>
                    <p className="text-lg font-mono text-primary">
                      {selectedIncident.id}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Reporter</p>
                    <p className="text-sm font-semibold">
                      {selectedIncident.reporter || "N/A"}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-muted-foreground text-sm">Title</p>
                  <p className="text-lg font-semibold">
                    {selectedIncident.title}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-muted-foreground text-sm">Type</p>
                    <p className="text-sm font-semibold capitalize">
                      {selectedIncident.type?.replace("-", " ") || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Priority</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(
                        selectedIncident.priority
                      )}`}
                    >
                      {selectedIncident.priority.charAt(0).toUpperCase() +
                        selectedIncident.priority.slice(1)}
                    </span>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Assigned To</p>
                    <p className="text-sm font-semibold">
                      {selectedIncident.assignedTo || "Unassigned"}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-muted-foreground text-sm">Description</p>
                  <p className="text-sm">{selectedIncident.description}</p>
                </div>

                <div>
                  <p className="text-muted-foreground text-sm">
                    AI Analysis Summary
                  </p>
                  <p className="text-sm bg-primary/10 text-primary border border-primary/20 rounded-lg p-3">
                    {selectedIncident.aiSummary}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground text-sm">
                      Submitted Date
                    </p>
                    <p className="text-sm">{selectedIncident.date}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Status</p>
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        selectedIncident.status
                      )}`}
                    >
                      {getStatusIcon(selectedIncident.status)}
                      {selectedIncident.status
                        .replace("-", " ")
                        .charAt(0)
                        .toUpperCase() +
                        selectedIncident.status.replace("-", " ").slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="border-t border-border pt-6">
                <h3 className="text-lg font-bold mb-4">Progress Timeline</h3>
                <div className="space-y-4">
                  {selectedIncident.timeline?.map((step, idx) => (
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
                        {idx < (selectedIncident.timeline?.length || 0) - 1 && (
                          <div
                            className={`w-1 h-12 mt-2 ${
                              step.completed ? "bg-primary/30" : "bg-muted"
                            }`}
                          />
                        )}
                      </div>
                      <div className="pt-1">
                        <p className="font-semibold">{step.step}</p>
                        {step.date && (
                          <p className="text-sm text-muted-foreground">
                            {step.date}
                          </p>
                        )}
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
              <button className="px-6 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-colors font-semibold flex items-center gap-2">
                <Edit className="w-4 h-4" />
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
