"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useState } from "react"
import {
  ArrowLeft,
  FileText,
  Clock,
  User,
  AlertTriangle,
  CheckCircle,
  MessageCircle,
  Download,
  Flag,
} from "lucide-react"

interface IncidentDetail {
  id: string
  title: string
  type: string
  status: string
  priority: string
  description: string
  reportedBy: string
  reportedAt: string
  location: string
  aiAnalysis: {
    riskLevel: string
    impact: number
    recommendations: string[]
  }
  files: { name: string; size: string }[]
  timeline: { event: string; time: string; status: string }[]
  assignedOfficer?: string
}

export default function IncidentDetailPage({ params }: { params: { id: string } }) {
  const { user } = useAuth()
  const router = useRouter()
  const [showComment, setShowComment] = useState(false)
  const [comment, setComment] = useState("")

  if (!user) {
    router.push("/login")
    return null
  }

  const mockIncident: IncidentDetail = {
    id: params.id,
    title: "Suspicious Phishing Email Campaign",
    type: "phishing",
    status: "investigating",
    priority: "high",
    description:
      "Received multiple phishing emails targeting corporate credentials. Emails spoofed company domain and included malicious links.",
    reportedBy: "John Citizen",
    reportedAt: "2024-01-15T10:30:00Z",
    location: "Remote",
    aiAnalysis: {
      riskLevel: "High",
      impact: 85,
      recommendations: [
        "Reset all potentially compromised passwords immediately",
        "Enable MFA on all accounts",
        "Block sender domains at email gateway",
        "Conduct security awareness training",
      ],
    },
    files: [
      { name: "phishing_email.eml", size: "245 KB" },
      { name: "email_headers.txt", size: "12 KB" },
      { name: "screenshot.png", size: "156 KB" },
    ],
    timeline: [
      { event: "Incident reported", time: "10:30 AM", status: "completed" },
      { event: "AI assessment completed", time: "10:35 AM", status: "completed" },
      { event: "Assigned to Officer Jane Smith", time: "10:40 AM", status: "completed" },
      { event: "Investigation in progress", time: "11:00 AM", status: "in-progress" },
    ],
    assignedOfficer: "Jane Officer",
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      open: "bg-yellow-500/20 text-yellow-400 border-yellow-500/20",
      investigating: "bg-blue-500/20 text-blue-400 border-blue-500/20",
      resolved: "bg-green-500/20 text-green-400 border-green-500/20",
      closed: "bg-slate-500/20 text-slate-400 border-slate-500/20",
    }
    return colors[status] || colors.open
  }

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: "text-green-400",
      medium: "text-yellow-400",
      high: "text-red-400",
      critical: "text-red-600",
    }
    return colors[priority] || colors.medium
  }

  return (
    <main className="min-h-screen pt-24 px-4 sm:px-6 pb-16 bg-slate-950">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Incidents
        </button>

        {/* Header */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-cyan-500/20 rounded-xl p-8 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{mockIncident.title}</h1>
              <p className="text-slate-400">Incident ID: {mockIncident.id}</p>
            </div>
            <div className="flex gap-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(mockIncident.status)}`}
              >
                {mockIncident.status.charAt(0).toUpperCase() + mockIncident.status.slice(1)}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold border border-current ${getPriorityColor(mockIncident.priority)}`}
              >
                {mockIncident.priority.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-slate-400 text-sm">Type</p>
              <p className="text-white font-semibold capitalize">{mockIncident.type}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Reported By</p>
              <p className="text-white font-semibold">{mockIncident.reportedBy}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Location</p>
              <p className="text-white font-semibold">{mockIncident.location}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Assigned To</p>
              <p className="text-white font-semibold">{mockIncident.assignedOfficer || "Unassigned"}</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-cyan-500/20 rounded-xl p-6">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                Description
              </h2>
              <p className="text-slate-300 leading-relaxed">{mockIncident.description}</p>
            </div>

            {/* AI Analysis */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-violet-500/20 rounded-xl p-6">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-violet-400" />
                AI Assessment
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-950/50 p-4 rounded-lg">
                    <p className="text-slate-400 text-sm">Risk Level</p>
                    <p className="text-red-400 font-bold text-lg">{mockIncident.aiAnalysis.riskLevel}</p>
                  </div>
                  <div className="bg-slate-950/50 p-4 rounded-lg">
                    <p className="text-slate-400 text-sm">Impact Score</p>
                    <p className="text-cyan-400 font-bold text-lg">{mockIncident.aiAnalysis.impact}%</p>
                  </div>
                </div>
                <div>
                  <p className="text-slate-300 font-semibold mb-3">Recommendations:</p>
                  <ul className="space-y-2">
                    {mockIncident.aiAnalysis.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex gap-2 text-slate-300">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-cyan-500/20 rounded-xl p-6">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-cyan-400" />
                Timeline
              </h2>
              <div className="space-y-4">
                {mockIncident.timeline.map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-3 h-3 rounded-full ${item.status === "completed" ? "bg-green-400" : "bg-cyan-400"}`}
                      />
                      {idx < mockIncident.timeline.length - 1 && <div className="w-0.5 h-12 bg-slate-700 my-1" />}
                    </div>
                    <div>
                      <p className="text-white font-semibold">{item.event}</p>
                      <p className="text-slate-400 text-sm">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Comments */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-cyan-500/20 rounded-xl p-6">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-cyan-400" />
                Comments & Updates
              </h2>
              <div className="space-y-4 mb-4">
                <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-cyan-400" />
                    <p className="font-semibold text-white">Jane Officer</p>
                    <p className="text-slate-400 text-sm">2 hours ago</p>
                  </div>
                  <p className="text-slate-300">
                    Investigation in progress. Confirmed phishing campaign targeting multiple departments.
                  </p>
                </div>
              </div>
              {showComment ? (
                <div className="space-y-2">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full bg-slate-950/50 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    rows={3}
                  />
                  <button className="px-4 py-2 bg-cyan-400 text-slate-950 rounded-lg font-semibold hover:bg-cyan-300 transition-colors">
                    Post Comment
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowComment(true)}
                  className="w-full px-4 py-2 border border-cyan-400/50 text-cyan-400 rounded-lg font-semibold hover:bg-cyan-400/10 transition-colors"
                >
                  Add Comment
                </button>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Files */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-cyan-500/20 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Attached Files</h3>
              <div className="space-y-2">
                {mockIncident.files.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-slate-950/50 rounded-lg border border-slate-800 hover:border-cyan-400/50 transition-colors"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <FileText className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-white text-sm font-medium truncate">{file.name}</p>
                        <p className="text-slate-400 text-xs">{file.size}</p>
                      </div>
                    </div>
                    <Download className="w-4 h-4 text-slate-400 hover:text-cyan-400 cursor-pointer" />
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-cyan-500/20 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Actions</h3>
              <div className="space-y-2">
                {user.role === "officer" && (
                  <>
                    <button className="w-full px-4 py-2 bg-cyan-400 text-slate-950 rounded-lg font-semibold hover:bg-cyan-300 transition-colors">
                      Update Status
                    </button>
                    <button className="w-full px-4 py-2 border border-cyan-400/50 text-cyan-400 rounded-lg font-semibold hover:bg-cyan-400/10 transition-colors">
                      Reassign
                    </button>
                  </>
                )}
                <button className="w-full px-4 py-2 border border-cyan-400/50 text-cyan-400 rounded-lg font-semibold hover:bg-cyan-400/10 transition-colors flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Export Report
                </button>
                <button className="w-full px-4 py-2 border border-red-500/50 text-red-400 rounded-lg font-semibold hover:bg-red-400/10 transition-colors flex items-center justify-center gap-2">
                  <Flag className="w-4 h-4" />
                  Report Abuse
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
