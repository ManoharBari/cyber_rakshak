"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ArrowLeft, Upload, Check } from "lucide-react"

export default function EditProfilePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    bio: "Cybersecurity professional",
  })
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    setSaveSuccess(true)
    setIsSaving(false)
    setTimeout(() => setSaveSuccess(false), 2000)
  }

  return (
    <main className="min-h-screen pt-24 px-4 sm:px-6 pb-16 bg-background">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => router.back()} className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
            <ArrowLeft className="w-6 h-6 text-cyan-400" />
          </button>
          <h1 className="text-3xl font-bold text-white">Edit Profile</h1>
        </div>

        <div className="bg-card border border-border rounded-xl p-8 space-y-8">
          {/* Avatar Section */}
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center text-white font-bold text-3xl flex-shrink-0">
              {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Profile Photo</p>
              <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-border transition-colors">
                <Upload className="w-4 h-4" />
                Upload New Photo
              </button>
            </div>
          </div>

          <div className="border-t border-border pt-6" />

          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-slate-900 border border-border rounded-lg focus:outline-none focus:border-primary transition-colors text-white"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-slate-900 border border-border rounded-lg focus:outline-none focus:border-primary transition-colors text-white"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-slate-900 border border-border rounded-lg focus:outline-none focus:border-primary transition-colors text-white"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 bg-slate-900 border border-border rounded-lg focus:outline-none focus:border-primary transition-colors text-white resize-none"
            />
            <p className="text-xs text-muted-foreground mt-1">Max 160 characters</p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 px-6 py-3 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSaving ? "Saving..." : saveSuccess ? "Saved!" : "Save Changes"}
              {saveSuccess && <Check className="w-4 h-4" />}
            </button>
            <button
              onClick={() => router.back()}
              className="flex-1 px-6 py-3 border border-border text-foreground font-semibold rounded-lg hover:bg-border transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
