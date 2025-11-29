"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Bot } from "lucide-react";

interface AiAssessmentResultProps {
  priority: "low" | "medium" | "high";
  impactScore: number;
  summary: string;
  actions: string[];
  incidentId?: string;
  onSaveAndContinue?: () => void;
  isModal?: boolean;
}

export default function AiAssessmentResult({
  priority,
  impactScore,
  summary,
  actions,
  incidentId = "INC-2024-001234",
  onSaveAndContinue,
  isModal = false,
}: AiAssessmentResultProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const priorityConfig = {
    low: {
      color: "from-emerald-400 to-green-500",
      glow: "shadow-emerald-500/50",
      bgGlow: "bg-emerald-500/10",
      border: "border-emerald-500/30",
      badge: "bg-emerald-500/20 text-emerald-300",
      label: "Low Priority",
    },
    medium: {
      color: "from-amber-400 to-orange-500",
      glow: "shadow-amber-500/50",
      bgGlow: "bg-amber-500/10",
      border: "border-amber-500/30",
      badge: "bg-amber-500/20 text-amber-300",
      label: "Medium Priority",
    },
    high: {
      color: "from-red-400 to-red-600",
      glow: "shadow-red-500/50",
      bgGlow: "bg-red-500/10",
      border: "border-red-500/30",
      badge: "bg-red-500/20 text-red-300",
      label: "High Priority",
    },
  };

  const config = priorityConfig[priority];

  const containerClass = isModal ? "max-w-2xl" : "max-w-4xl";
  const paddingClass = isModal ? "p-8 sm:p-12" : "px-4 py-12 sm:py-16";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`${
        !isModal && "min-h-screen"
      } bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center ${
        !isModal && "pt-24 pb-12"
      }`}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`w-full ${containerClass} ${paddingClass} space-y-8`}
      >
        {/* Header with decorative icons */}
        <motion.div variants={itemVariants} className="text-center space-y-4">
          <div className="flex justify-center gap-4 mb-6">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="text-4xl"
            >
              <Bot />
            </motion.div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            AI Incident Assessment Report
          </h1>
          <p className="text-slate-400 text-lg">
            Based on your report, here's what our AI analysis found.
          </p>
        </motion.div>

        {/* Priority Card with Glow */}
        <motion.div
          variants={itemVariants}
          className={`relative bg-gradient-to-br ${config.color} p-1 rounded-2xl`}
        >
          {/* Glow effect */}
          <div
            className={`absolute inset-0 ${config.bgGlow} rounded-2xl blur-3xl -z-10`}
          />

          <div className={`bg-slate-900 rounded-2xl p-8 text-center space-y-4`}>
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <p
                className={`text-sm font-semibold uppercase tracking-widest ${config.badge}`}
              >
                {config.label}
              </p>
              <h2
                className={`text-6xl sm:text-7xl font-black bg-gradient-to-r ${config.color} bg-clip-text text-transparent mt-2`}
              >
                {priority === "high"
                  ? "🔴"
                  : priority === "medium"
                  ? "🟡"
                  : "🟢"}
              </h2>
            </motion.div>

            <div className="space-y-2 pt-4 border-t border-slate-700">
              <p className="text-slate-400 text-sm uppercase tracking-wider">
                Impact Score
              </p>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1, delay: 0.5 }}
                className="space-y-2"
              >
                <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${impactScore}%` }}
                    transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                    className={`h-full bg-gradient-to-r ${config.color}`}
                  />
                </div>
                <p className="text-3xl font-bold text-white">
                  {impactScore}
                  <span className="text-lg text-slate-400"> / 100</span>
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Summary Section */}
        <motion.div
          variants={itemVariants}
          className="bg-slate-800/40 backdrop-blur border border-slate-700/50 rounded-xl p-6 space-y-3"
        >
          <h3 className="text-lg font-semibold text-cyan-400 flex items-center gap-2">
            <span className="text-2xl">📋</span>
            Analysis Summary
          </h3>
          <p className="text-slate-300 leading-relaxed">{summary}</p>
        </motion.div>

        {/* Recommended Actions */}
        <motion.div variants={itemVariants} className="space-y-4">
          <h3 className="text-lg font-semibold text-cyan-400 flex items-center gap-2">
            <span className="text-2xl">✓</span>
            Recommended Actions
          </h3>

          <div className="grid gap-3">
            {actions.map((action, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group bg-slate-800/40 hover:bg-slate-800/60 backdrop-blur border border-slate-700/50 hover:border-cyan-400/30 rounded-lg p-4 transition-all"
              >
                <div className="flex gap-4 items-start">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: index * 0.2,
                    }}
                    className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-cyan-400 to-violet-500 rounded-full flex items-center justify-center text-slate-950 font-bold text-sm"
                  >
                    {index + 1}
                  </motion.div>
                  <p className="text-slate-300 text-sm leading-relaxed group-hover:text-white transition-colors">
                    {action}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Incident Reference */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-r from-cyan-500/10 to-violet-500/10 border border-cyan-400/30 rounded-lg p-6 space-y-3"
        >
          <p className="text-xs font-semibold text-cyan-300 uppercase tracking-widest">
            Incident Reference ID
          </p>
          <p className="text-2xl font-mono font-bold text-cyan-400">
            {incidentId}
          </p>
          <p className="text-sm text-slate-400">
            Save this reference for tracking and follow-ups.
          </p>
        </motion.div>

        {/* Powered by AI Footer */}
        <motion.div
          variants={itemVariants}
          className="text-center pt-4 border-t border-slate-700"
        >
          <p className="text-xs text-slate-500 flex items-center justify-center gap-2">
            <span className="inline-block w-1 h-1 bg-slate-500 rounded-full" />
            Powered by Advanced AI Analysis
            <span className="inline-block w-1 h-1 bg-slate-500 rounded-full" />
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex gap-4 pt-6 border-t border-slate-700"
        >
          <Link href="/user-dashboard" className="flex-1">
            <Button className="w-full bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-300 hover:to-cyan-400 text-slate-950 font-semibold glow-cyan">
              Save & Continue to Dashboard
            </Button>
          </Link>

          <Link href="/report" className="flex-1">
            <Button
              variant="outline"
              className="w-full bg-slate-700 hover:bg-slate-600 text-white border-slate-600"
            >
              Report Another
            </Button>
          </Link>

          <Button
            variant="outline"
            className="bg-slate-700 hover:bg-slate-600 text-white border-slate-600 px-6"
            onClick={() => {
              const content = `
Incident Assessment Report
Reference: ${incidentId}
Priority: ${config.label}
Impact Score: ${impactScore}/100

Summary:
${summary}

Recommended Actions:
${actions.map((a, i) => `${i + 1}. ${a}`).join("\n")}

Report generated on: ${new Date().toLocaleString()}
              `;
              const blob = new Blob([content], { type: "text/plain" });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `${incidentId}-assessment.txt`;
              a.click();
            }}
          >
            Download
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
