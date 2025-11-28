"use client";

import React from "react";

import type { ReactElement } from "react";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import AiAssessmentResult from "@/components/AiAssessmentResult";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

interface IncidentFormData {
  fullName: string;
  email: string;
  contactNumber: string;
  address: string;
  incidentTitle: string;
  incidentType: string;
  incidentDate: string;
  description: string;
  files: File[];
  confirmAccuracy: boolean;
}

export default function ReportIncidentPage(): ReactElement {
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [files, setFiles] = useState<File[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedIncident, setSubmittedIncident] = useState<{
    id: string;
    email: string;
  } | null>(null);
  const [showAiAssessment, setShowAiAssessment] = useState(false);
  const [aiAssessmentData, setAiAssessmentData] = useState<{
    priority: "low" | "medium" | "high";
    impactScore: number;
    summary: string;
    actions: string[];
    incidentId: string;
  } | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
    reset,
  } = useForm<IncidentFormData>({
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      contactNumber: "",
      address: "",
      incidentTitle: "",
      incidentType: "phishing",
      incidentDate: "",
      description: "",
      files: [],
      confirmAccuracy: false,
    },
  });

  if (!user) {
    router.push("/login");
  }
  const confirmAccuracy = watch("confirmAccuracy");

  React.useEffect(() => {
    const savedData = localStorage.getItem("cyberaid-form-draft");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        const { files: _, ...formData } = parsed;
        Object.entries(formData).forEach(([key, value]) => {
          control._reset({ [key]: value }, { keepDefaultValues: true });
        });
      } catch (e) {
        console.error("Failed to load saved form", e);
      }
    }
  }, []);

  const formData = watch();
  React.useEffect(() => {
    const toSave = {
      ...formData,
      files: [],
    };
    localStorage.setItem("cyberaid-form-draft", JSON.stringify(toSave));
  }, [formData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.currentTarget.files;
    if (newFiles) {
      const addedFiles = Array.from(newFiles);
      setFiles((prev) => [...prev, ...addedFiles]);
    }
    e.currentTarget.value = "";
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNextStep = async () => {
    let isValid = false;

    if (step === 1) {
      isValid = await trigger(["fullName", "email", "address"]);
    } else if (step === 2) {
      isValid = await trigger([
        "incidentTitle",
        "incidentType",
        "incidentDate",
        "description",
      ]);
    }

    if (isValid || step === 3) {
      setStep(Math.min(step + 1, 4));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevStep = () => {
    setStep(Math.max(step - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmitForm = (data: IncidentFormData) => {
    if (step === 4 && data.confirmAccuracy) {
      setShowConfirmModal(true);
    }
  };

  const confirmSubmission = () => {
    const formValues = watch();
    const incident = {
      id: `INC-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)
        .toUpperCase()}`,
      created_at: new Date().toISOString(),
      ...formValues,
      fileCount: files.length,
    };

    const incidents = JSON.parse(localStorage.getItem("incidents") || "[]");
    incidents.push(incident);
    localStorage.setItem("incidents", JSON.stringify(incidents));

    localStorage.removeItem("cyberaid-form-draft");

    const incidentType = formValues.incidentType;
    let priority: "low" | "medium" | "high" = "medium";
    let impactScore = 65;
    let summary = "";
    let actions: string[] = [];

    if (incidentType === "phishing") {
      priority = "high";
      impactScore = 78;
      summary =
        "Our analysis indicates this is a sophisticated phishing attempt with potential credential exposure. The incident shows signs of social engineering targeting email accounts. Immediate action is recommended to prevent unauthorized access.";
      actions = [
        "Change all affected passwords immediately, prioritizing email and financial accounts",
        "Run a full antivirus/malware scan on your device",
        "Check account activity logs for unauthorized access attempts",
        "Contact your IT department and report the phishing attempt",
        "Enable two-factor authentication on all critical accounts",
      ];
    } else if (incidentType === "malware") {
      priority = "high";
      impactScore = 82;
      summary =
        "Malware detection indicates a potential system compromise. The detected malware could allow unauthorized access to your personal data. Immediate isolation and professional remediation is strongly recommended.";
      actions = [
        "Immediately disconnect the affected device from the network",
        "Run updated antivirus/anti-malware software in safe mode",
        "Consider professional IT support for complete system cleanup",
        "Change passwords from a secure device",
        "Monitor your accounts for suspicious activity",
      ];
    } else if (incidentType === "data-breach") {
      priority = "high";
      impactScore = 85;
      summary =
        "Analysis suggests potential exposure of sensitive personal data. Your information may have been accessed during this breach. We recommend immediate protective measures.";
      actions = [
        "Contact the affected service and request security audit",
        "Change passwords for all accounts using the breached service",
        "Monitor credit reports and bank statements for fraud",
        "Consider placing a fraud alert with credit agencies",
        "Document all communications about the breach",
      ];
    } else if (incidentType === "ransomware") {
      priority = "high";
      impactScore = 95;
      summary =
        "Critical ransomware infection detected. This represents the highest level of threat to your system and data. Professional IT support is essential.";
      actions = [
        "Disconnect infected device from network immediately",
        "Contact IT support and cybersecurity professionals urgently",
        "Do not pay ransom - contact law enforcement",
        "Restore from clean backups if available",
        "Preserve evidence for law enforcement investigation",
      ];
    } else {
      priority = "medium";
      impactScore = 55;
      summary =
        "We've analyzed your incident report and classified it as a moderate-priority security concern. While not immediately critical, it warrants attention to prevent escalation.";
      actions = [
        "Document all details of the incident for your records",
        "Monitor relevant systems for any unusual activity",
        "Review your security practices to prevent similar incidents",
        "Keep your software and systems updated",
        "Report to relevant authorities if applicable",
      ];
    }

    setAiAssessmentData({
      priority,
      impactScore,
      summary,
      actions,
      incidentId: incident.id,
    });
    setShowConfirmModal(false);
    setShowAiAssessment(true);
  };

  if (showAiAssessment && aiAssessmentData) {
    return (
      <AiAssessmentResult
        priority={aiAssessmentData.priority}
        impactScore={aiAssessmentData.impactScore}
        summary={aiAssessmentData.summary}
        actions={aiAssessmentData.actions}
        incidentId={aiAssessmentData.incidentId}
      />
    );
  }

  if (showSuccessModal && submittedIncident) {
    return (
      <main className="min-h-screen pt-24 pb-12 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-6 text-center">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-500 flex items-center justify-center animate-pulse">
              <svg
                className="w-10 h-10 text-slate-950"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-bold text-white">
              Report Submitted Successfully
            </h2>
            <p className="text-slate-300">
              Your incident report has been received and is being processed by
              our AI system.
            </p>
            <div className="bg-slate-800/50 border border-cyan-500/30 rounded-lg p-4">
              <p className="text-xs text-slate-400 uppercase tracking-wide">
                Incident Reference
              </p>
              <p className="text-lg font-mono font-bold text-cyan-400 mt-2">
                {submittedIncident.id}
              </p>
            </div>
            <p className="text-sm text-slate-500">
              A confirmation email will be sent to{" "}
              <span className="text-cyan-400">{submittedIncident.email}</span>
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-12 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-4xl mx-auto px-4">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent">
              Report an Incident
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Follow our guided 4-step process to securely report cybersecurity
              incidents. Our AI will automatically assess and prioritize your
              report.
            </p>
          </div>

          <div className="bg-slate-800/40 backdrop-blur border border-slate-700/50 rounded-xl p-6 space-y-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-cyan-400">
                Step {step} of 4
              </span>
              <span className="text-sm font-semibold text-slate-400">
                {Math.round((step / 4) * 100)}% Complete
              </span>
            </div>
            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-violet-500 transition-all duration-500 ease-out"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>

            <div className="flex justify-between mt-8 gap-2">
              {[1, 2, 3, 4].map((stepNum) => (
                <div
                  key={stepNum}
                  className="flex flex-col items-center flex-1"
                >
                  <button
                    onClick={() => stepNum < step && setStep(stepNum)}
                    disabled={stepNum > step}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all mb-2 ${
                      stepNum < step
                        ? "bg-cyan-400 text-slate-950 cursor-pointer hover:shadow-lg hover:shadow-cyan-500/50"
                        : stepNum === step
                        ? "bg-gradient-to-r from-cyan-400 to-violet-500 text-white shadow-lg shadow-cyan-500/50"
                        : "bg-slate-700 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    {stepNum < step ? (
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      stepNum
                    )}
                  </button>
                  <p
                    className={`text-xs font-medium text-center transition-all ${
                      stepNum === step ? "text-cyan-400" : "text-slate-500"
                    }`}
                  >
                    {["Info", "Details", "Evidence", "Review"][stepNum - 1]}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <form
            onSubmit={handleSubmit(handleSubmitForm)}
            className="bg-slate-800/40 backdrop-blur border border-slate-700/50 rounded-2xl p-8 sm:p-12 space-y-8 animate-in fade-in-50 duration-300"
          >
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Personal Information
                  </h2>
                  <p className="text-slate-400">
                    Help us contact you about your incident report.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-white">
                      Full Name *
                    </label>
                    <Controller
                      name="fullName"
                      control={control}
                      rules={{ required: "Full name is required" }}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          placeholder="John Doe"
                          className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                        />
                      )}
                    />
                    {errors.fullName && (
                      <p className="text-red-400 text-sm">
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-white">
                      Email Address *
                    </label>
                    <Controller
                      name="email"
                      control={control}
                      rules={{
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      }}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="email"
                          placeholder="john@example.com"
                          className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                        />
                      )}
                    />
                    {errors.email && (
                      <p className="text-red-400 text-sm">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-white">
                    Contact Number (Optional)
                  </label>
                  <Controller
                    name="contactNumber"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                      />
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-white">
                    Address / Location *
                  </label>
                  <Controller
                    name="address"
                    control={control}
                    rules={{ required: "Address is required" }}
                    render={({ field }) => (
                      <textarea
                        {...field}
                        placeholder="Building/Office location or geographic location where the incident occurred"
                        rows={3}
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all resize-none"
                      />
                    )}
                  />
                  {errors.address && (
                    <p className="text-red-400 text-sm">
                      {errors.address.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Incident Details
                  </h2>
                  <p className="text-slate-400">
                    Provide specific information about the incident.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-white">
                    Incident Title *
                  </label>
                  <Controller
                    name="incidentTitle"
                    control={control}
                    rules={{ required: "Incident title is required" }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        placeholder="e.g., Suspicious phishing email received"
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                      />
                    )}
                  />
                  {errors.incidentTitle && (
                    <p className="text-red-400 text-sm">
                      {errors.incidentTitle.message}
                    </p>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-white">
                      Type of Incident *
                    </label>
                    <Controller
                      name="incidentType"
                      control={control}
                      rules={{ required: "Incident type is required" }}
                      render={({ field }) => (
                        <select
                          {...field}
                          className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all appearance-none"
                        >
                          <option value="phishing">Phishing Attack</option>
                          <option value="malware">Malware Infection</option>
                          <option value="data-breach">Data Breach</option>
                          <option value="ransomware">Ransomware</option>
                          <option value="other">Other</option>
                        </select>
                      )}
                    />
                    {errors.incidentType && (
                      <p className="text-red-400 text-sm">
                        {errors.incidentType.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-white">
                      Date of Incident *
                    </label>
                    <Controller
                      name="incidentDate"
                      control={control}
                      rules={{ required: "Date is required" }}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="datetime-local"
                          className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                        />
                      )}
                    />
                    {errors.incidentDate && (
                      <p className="text-red-400 text-sm">
                        {errors.incidentDate.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-white">
                    Detailed Description *
                  </label>
                  <Controller
                    name="description"
                    control={control}
                    rules={{ required: "Description is required" }}
                    render={({ field }) => (
                      <textarea
                        {...field}
                        placeholder="Provide comprehensive details about what happened, when, and how it was discovered..."
                        rows={6}
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all resize-none"
                      />
                    )}
                  />
                  {errors.description && (
                    <p className="text-red-400 text-sm">
                      {errors.description.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Attach Evidence
                  </h2>
                  <p className="text-slate-400">
                    Upload supporting files like screenshots, logs, or documents
                    (optional).
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="border-2 border-dashed border-slate-600 hover:border-cyan-400/50 rounded-xl p-8 text-center transition-colors cursor-pointer group">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-input"
                      accept="image/*,.pdf,.txt,.log,.json,.csv"
                    />
                    <label
                      htmlFor="file-input"
                      className="cursor-pointer space-y-3"
                    >
                      <div className="flex justify-center">
                        <svg
                          className="w-12 h-12 text-slate-500 group-hover:text-cyan-400 transition-colors"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3v-7"
                          />
                        </svg>
                      </div>
                      <div className="space-y-1">
                        <p className="text-white font-semibold group-hover:text-cyan-400 transition-colors">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-slate-400 text-sm">
                          PNG, JPG, PDF, TXT, LOG, JSON, CSV up to 25MB
                        </p>
                      </div>
                    </label>
                  </div>

                  {files.length > 0 && (
                    <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-6 space-y-3">
                      <h3 className="text-sm font-semibold text-white mb-4">
                        Uploaded Files ({files.length})
                      </h3>
                      <div className="space-y-2">
                        {files.map((file, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between bg-slate-700/50 hover:bg-slate-700 p-3 rounded-lg transition-colors group"
                          >
                            <div className="flex items-center gap-3 text-slate-300 flex-1 min-w-0">
                              <svg
                                className="w-4 h-4 flex-shrink-0 text-cyan-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M8 16.5a1 1 0 11-2 0 1 1 0 012 0zM15 7a2 2 0 11-4 0 2 2 0 014 0zM3 20h18a1 1 0 001-1V5a1 1 0 00-1-1H3a1 1 0 00-1 1v14a1 1 0 001 1z" />
                              </svg>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm truncate font-medium">
                                  {file.name}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {(file.size / 1024).toFixed(1)} KB
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFile(idx)}
                              className="text-red-400 hover:text-red-300 ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-slate-700/30 border border-violet-500/30 rounded-lg p-4">
                  <p className="text-sm text-slate-300">
                    Evidence files help our security team assess the incident
                    faster. You can attach screenshots, log files, email
                    headers, or any other relevant documents.
                  </p>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Review & Submit
                  </h2>
                  <p className="text-slate-400">
                    Please review your information before submitting.
                  </p>
                </div>

                <div className="space-y-4 bg-slate-700/30 border border-slate-600 rounded-xl p-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wide">
                        Full Name
                      </p>
                      <p className="text-white font-medium mt-1">
                        {watch("fullName")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wide">
                        Email
                      </p>
                      <p className="text-white font-medium mt-1">
                        {watch("email")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wide">
                        Contact
                      </p>
                      <p className="text-white font-medium mt-1">
                        {watch("contactNumber") || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wide">
                        Location
                      </p>
                      <p className="text-white font-medium mt-1">
                        {watch("address")}
                      </p>
                    </div>
                  </div>

                  <div className="h-px bg-slate-600" />

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wide">
                        Incident Title
                      </p>
                      <p className="text-white font-medium mt-1">
                        {watch("incidentTitle")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wide">
                        Type
                      </p>
                      <p className="text-white font-medium mt-1 capitalize">
                        {watch("incidentType")}
                      </p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wide">
                        Date
                      </p>
                      <p className="text-white font-medium mt-1">
                        {watch("incidentDate")
                          ? new Date(watch("incidentDate")).toLocaleString()
                          : "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="h-px bg-slate-600" />

                  <div>
                    <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wide">
                      Description
                    </p>
                    <p className="text-white font-medium mt-2 text-sm whitespace-pre-wrap leading-relaxed">
                      {watch("description")}
                    </p>
                  </div>

                  {files.length > 0 && (
                    <>
                      <div className="h-px bg-slate-600" />
                      <div>
                        <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wide">
                          Evidence Files
                        </p>
                        <p className="text-white font-medium mt-1">
                          {files.length} file{files.length > 1 ? "s" : ""}{" "}
                          attached
                        </p>
                      </div>
                    </>
                  )}
                </div>

                <div className="bg-gradient-to-r from-cyan-500/10 to-violet-500/10 border border-cyan-400/30 rounded-lg p-4 space-y-3">
                  <p className="text-sm font-semibold text-cyan-300">
                    AI-Powered Assessment
                  </p>
                  <p className="text-sm text-slate-300">
                    Upon submission, our advanced AI system will automatically
                    assess your incident for severity level, recommended
                    actions, and route it to the appropriate security team.
                  </p>
                </div>

                <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-4 space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <Controller
                      name="confirmAccuracy"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="checkbox"
                          checked={field.value}
                          className="mt-1 w-5 h-5 rounded border-slate-500 bg-slate-600 text-cyan-400 focus:ring-cyan-400 cursor-pointer"
                        />
                      )}
                    />
                    <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                      I confirm that the above details are accurate and complete
                      to the best of my knowledge.
                    </span>
                  </label>
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-6 border-t border-slate-600">
              <Button
                type="button"
                onClick={handlePrevStep}
                disabled={step === 1}
                variant="outline"
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white border-slate-600"
              >
                Back
              </Button>

              {step < 4 ? (
                <Button
                  type="button"
                  onClick={handleNextStep}
                  className="flex-1 bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-300 hover:to-cyan-400 text-slate-950 font-semibold glow-cyan"
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={!confirmAccuracy}
                  className="flex-1 bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-300 hover:to-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-semibold"
                >
                  Assess with AI
                </Button>
              )}
            </div>
          </form>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                icon: "🔍",
                title: "AI Assessment",
                description:
                  "Your incident is instantly analyzed by our AI engine for severity and impact.",
              },
              {
                icon: "⚡",
                title: "Priority Routing",
                description:
                  "Automatically routed to the right team based on incident type and severity.",
              },
              {
                icon: "🔔",
                title: "Live Tracking",
                description:
                  "Receive real-time notifications as your incident moves through resolution.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-slate-800/40 border border-slate-700/50 hover:border-cyan-400/30 rounded-lg p-4 space-y-3 transition-all hover:shadow-lg hover:shadow-cyan-500/10"
              >
                <p className="text-2xl">{feature.icon}</p>
                <h3 className="font-semibold text-white text-sm">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AlertDialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <AlertDialogContent className="bg-slate-900 border-slate-700 max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white text-xl">
              Ready to Submit?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-300 text-base">
              Your incident report will be submitted and immediately analyzed by
              our AI system. You'll receive a confirmation email with your
              incident reference number.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 my-4">
            <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold mb-2">
              You will receive a confirmation at:
            </p>
            <p className="text-cyan-400 font-mono text-sm">{watch("email")}</p>
          </div>
          <div className="flex gap-3">
            <AlertDialogCancel className="bg-slate-700 hover:bg-slate-600 text-white border-slate-600">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmSubmission}
              className="bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-300 hover:to-emerald-400 text-slate-950 font-semibold"
            >
              Submit Report
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
