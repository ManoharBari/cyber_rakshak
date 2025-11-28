"use client"

import { useState } from "react"
import { Search, BookOpen, Shield, AlertTriangle } from "lucide-react"

interface Article {
  id: string
  title: string
  description: string
  category: string
  readTime: string
}

const articles: Article[] = [
  {
    id: 1,
    title: "Understanding Phishing Attacks",
    description: "Learn how to identify and protect yourself from phishing emails and social engineering attempts.",
    category: "Security",
    readTime: "5 min",
  },
  {
    id: 2,
    title: "Data Breach Response Guide",
    description: "Step-by-step guide on what to do if you suspect a data breach has occurred.",
    category: "Incident Response",
    readTime: "8 min",
  },
  {
    id: 3,
    title: "Best Practices for Password Security",
    description: "Essential tips for creating strong passwords and managing them securely.",
    category: "Security",
    readTime: "6 min",
  },
  {
    id: 4,
    title: "Malware Types and Detection",
    description: "Comprehensive overview of different malware types and how to detect them.",
    category: "Threats",
    readTime: "10 min",
  },
  {
    id: 5,
    title: "Incident Report Best Practices",
    description: "Guidelines for providing detailed and accurate incident reports.",
    category: "Reporting",
    readTime: "4 min",
  },
  {
    id: 6,
    title: "Two-Factor Authentication Setup",
    description: "How to enable and use two-factor authentication for enhanced security.",
    category: "Security",
    readTime: "5 min",
  },
]

const categories = [
  { name: "All", count: 6 },
  { name: "Security", count: 3, icon: Shield },
  { name: "Incident Response", count: 1, icon: AlertTriangle },
  { name: "Threats", count: 1, icon: AlertTriangle },
  { name: "Reporting", count: 1, icon: BookOpen },
]

export default function KnowledgeBasePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <main className="min-h-screen pt-24 px-4 sm:px-6 pb-16 bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent mb-4">
            Knowledge Base
          </h1>
          <p className="text-slate-400 text-lg">Learn more about security, incident reporting, and best practices</p>
        </div>

        {/* Search */}
        <div className="relative mb-12">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-cyan-500/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
                    selectedCategory === category.name
                      ? "bg-cyan-400 text-slate-950 font-semibold"
                      : "text-slate-300 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{category.name}</span>
                    <span className="text-xs bg-slate-700/50 px-2 py-1 rounded">{category.count}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Articles */}
          <div className="lg:col-span-3 space-y-4">
            {filteredArticles.length > 0 ? (
              filteredArticles.map((article) => (
                <a
                  key={article.id}
                  href={`#article-${article.id}`}
                  className="block p-6 bg-gradient-to-br from-slate-900 to-slate-950 border border-cyan-500/20 rounded-lg hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/10 transition-all group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors">
                      {article.title}
                    </h3>
                    <span className="text-xs text-slate-400">{article.readTime}</span>
                  </div>
                  <p className="text-slate-400 mb-4">{article.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-cyan-400">{article.category}</span>
                    <span className="text-cyan-400 group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </a>
              ))
            ) : (
              <div className="text-center py-12 bg-gradient-to-br from-slate-900 to-slate-950 border border-cyan-500/10 rounded-lg">
                <BookOpen className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                <p className="text-slate-400">No articles found. Try different search terms or categories.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
