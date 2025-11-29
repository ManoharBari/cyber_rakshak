import { Bot, Headset, Lock, Satellite } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-[#0a0f1f] overflow-hidden pt-20">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500 rounded-full filter blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-violet-600 rounded-full filter blur-3xl opacity-15"></div>
          <div className="absolute top-1/3 left-0 w-72 h-72 bg-cyan-400 rounded-full filter blur-3xl opacity-10"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-24 sm:py-32 min-h-screen flex items-center">
          <div className="grid md:grid-cols-2 gap-12 items-center w-full">
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-cyan-400 font-semibold text-sm tracking-widest uppercase">
                  Cybersecurity Incident Response
                </p>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight">
                  Report Cyber Incidents.{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500">
                    Get Help Instantly.
                  </span>
                </h1>
              </div>
              <p className="text-lg text-gray-300 leading-relaxed max-w-xl">
                A secure platform connecting victims and cybersecurity experts.
                AI-powered priority detection for faster response to security
                incidents.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/report">
                  <button className="btn-primary">Report an Incident</button>
                </Link>
                <Link href="/teams">
                  <button className="btn-secondary">For Security Teams</button>
                </Link>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-violet-600/20 rounded-2xl blur"></div>
                <div className="relative bg-slate-800/40 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-8 space-y-4">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                    <div
                      className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-3 h-3 rounded-full bg-green-500 animate-pulse"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                  <div className="space-y-4">
                    <div className="border-l-2 border-cyan-400 pl-4 py-2">
                      <p className="text-cyan-400 font-mono text-sm">
                        Incident Status: Active
                      </p>
                      <p className="text-gray-400 font-mono text-xs mt-1">
                        Priority: HIGH
                      </p>
                    </div>
                    <div className="border-l-2 border-violet-400 pl-4 py-2">
                      <p className="text-violet-400 font-mono text-sm">
                        AI Assessment: In Progress
                      </p>
                      <p className="text-gray-400 font-mono text-xs mt-1">
                        Confidence: 94%
                      </p>
                    </div>
                    <div className="border-l-2 border-green-400 pl-4 py-2">
                      <p className="text-green-400 font-mono text-sm">
                        Team Assigned: Security Ops
                      </p>
                      <p className="text-gray-400 font-mono text-xs mt-1">
                        ETA: 2 min
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 bg-slate-950 border-t border-slate-800/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold text-white">
              Why Choose CyberRakshak?
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Everything you need to report and manage cybersecurity incidents
              with confidence
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "AI-Powered Assessment",
                description:
                  "Get instant priority scoring and threat analysis for every incident.",
                icon: <Bot />,
              },
              {
                title: "Secure & Anonymous",
                description:
                  "Report safely with end-to-end encryption and optional anonymity.",
                icon: <Lock />,
              },
              {
                title: "Real-Time Tracking",
                description:
                  "Monitor incident status and response progress in real-time.",
                icon: <Satellite />,
              },
              {
                title: "Expert Support",
                description:
                  "Connect with certified cybersecurity professionals immediately.",
                icon: <Headset />,
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 hover:border-cyan-500/50 rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity"></div>
                <div className="relative space-y-3">
                  <p className="text-4xl">{feature.icon}</p>
                  <h3 className="text-lg font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-slate-950 to-[#0a0f1f]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold text-white">
              How It Works
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Three simple steps to get professional help with your
              cybersecurity incident
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Submit Report",
                description:
                  "Provide incident details through our secure form or our mobile app.",
              },
              {
                step: "2",
                title: "AI Analyzes",
                description:
                  "Our AI engine prioritizes your incident and assigns severity level.",
              },
              {
                step: "3",
                title: "Team Responds",
                description:
                  "Certified security professionals are assigned to help you.",
              },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-6 relative">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">
                        {item.step}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-r from-cyan-600/20 via-slate-950 to-violet-600/20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-cyan-500 rounded-full filter blur-3xl opacity-20"></div>
          <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-violet-600 rounded-full filter blur-3xl opacity-20"></div>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center space-y-8">
          <h2 className="text-4xl sm:text-5xl font-bold text-white">
            Ready to secure your digital world?
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Join thousands of organizations protecting themselves with
            CyberRakshak. Report incidents, get expert help, and respond faster
            than ever before.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/report">
              <button className="btn-primary">Start Reporting Now</button>
            </Link>
            <Link href="/teams">
              <button className="btn-secondary">Learn More</button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
