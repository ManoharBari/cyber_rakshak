"use client"

export default function TeamsPage() {
  return (
    <main className="min-h-screen pt-24 pb-12 bg-gradient-to-br from-slate-950 to-slate-900">
      <div className="max-w-6xl mx-auto px-4">
        <div className="space-y-16">
          {/* Hero */}
          <div className="text-center space-y-6">
            <h1 className="text-5xl sm:text-6xl font-bold text-white leading-tight">
              Enterprise Incident{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                Management
              </span>
            </h1>
            <p className="text-lg text-slate-400 max-w-3xl mx-auto">
              Empower your team to manage security incidents at scale. Designed for enterprise security operations with
              advanced collaboration and analytics.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Centralized Dashboard",
                description: "Monitor all incidents in one place with customizable views and real-time updates.",
                features: ["Live incident tracking", "Custom dashboards", "Team performance metrics"],
              },
              {
                title: "Advanced Workflows",
                description: "Define automated workflows to standardize incident response across your organization.",
                features: ["Auto escalation", "Custom automation", "SLA management"],
              },
              {
                title: "Team Collaboration",
                description: "Keep your security team aligned with built-in communication and handoff features.",
                features: ["Real-time chat", "Task assignment", "Status updates"],
              },
              {
                title: "Compliance & Audit",
                description: "Meet regulatory requirements with comprehensive audit logs and compliance reporting.",
                features: ["Full audit trail", "Compliance reports", "Data retention policies"],
              },
            ].map((benefit, i) => (
              <div
                key={i}
                className="group bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-blue-500/50 rounded-2xl p-8 transition-all hover:shadow-xl hover:shadow-blue-500/10 space-y-6"
              >
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
                    {benefit.title}
                  </h3>
                  <p className="text-slate-400">{benefit.description}</p>
                </div>
                <ul className="space-y-3">
                  {benefit.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3 text-slate-300">
                      <svg className="w-5 h-5 text-blue-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Pricing Plans */}
          <div className="space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-white">Simple, Transparent Pricing</h2>
              <p className="text-lg text-slate-400">Choose the plan that fits your team's needs</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Starter",
                  price: "$299",
                  period: "/month",
                  description: "Perfect for small teams",
                  features: [
                    "Up to 10 team members",
                    "Basic incident tracking",
                    "Email notifications",
                    "Community support",
                    "5 integrations",
                  ],
                  highlighted: false,
                },
                {
                  name: "Professional",
                  price: "$899",
                  period: "/month",
                  description: "For growing security teams",
                  features: [
                    "Up to 50 team members",
                    "Advanced analytics",
                    "Slack integration",
                    "Priority support",
                    "20 integrations",
                    "Custom workflows",
                    "SLA management",
                  ],
                  highlighted: true,
                },
                {
                  name: "Enterprise",
                  price: "Custom",
                  period: "pricing",
                  description: "For large organizations",
                  features: [
                    "Unlimited team members",
                    "Full customization",
                    "Dedicated support",
                    "SSO & SAML",
                    "Unlimited integrations",
                    "On-premise option",
                    "Advanced compliance",
                  ],
                  highlighted: false,
                },
              ].map((plan, i) => (
                <div
                  key={i}
                  className={`rounded-2xl p-8 transition-all ${
                    plan.highlighted
                      ? "bg-gradient-to-br from-blue-600 to-blue-700 ring-2 ring-blue-400 transform scale-105"
                      : "bg-slate-800/50 border border-slate-700 hover:border-blue-500/50"
                  }`}
                >
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <h3 className={`text-2xl font-bold ${plan.highlighted ? "text-white" : "text-white"}`}>
                        {plan.name}
                      </h3>
                      <div className="flex items-baseline gap-1">
                        <span className={`text-4xl font-bold ${plan.highlighted ? "text-white" : "text-blue-400"}`}>
                          {plan.price}
                        </span>
                        <span className={`text-sm ${plan.highlighted ? "text-blue-100" : "text-slate-400"}`}>
                          {plan.period}
                        </span>
                      </div>
                      <p className={`text-sm ${plan.highlighted ? "text-blue-100" : "text-slate-400"}`}>
                        {plan.description}
                      </p>
                    </div>

                    <ul className="space-y-3">
                      {plan.features.map((feature, j) => (
                        <li
                          key={j}
                          className={`flex items-center gap-3 text-sm ${
                            plan.highlighted ? "text-white" : "text-slate-300"
                          }`}
                        >
                          <svg
                            className={`w-5 h-5 flex-shrink-0 ${plan.highlighted ? "text-white" : "text-blue-400"}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <button
                      className={`w-full py-3 font-semibold rounded-lg transition-colors ${
                        plan.highlighted
                          ? "bg-white text-blue-600 hover:bg-slate-100"
                          : "border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-slate-950"
                      }`}
                    >
                      Get Started
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className="space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-white">Frequently Asked Questions</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  q: "How long does deployment take?",
                  a: "Our platform can be deployed and operational in less than 24 hours with full onboarding support included.",
                },
                {
                  q: "What integrations do you support?",
                  a: "We support 100+ integrations including Slack, PagerDuty, Jira, Splunk, and many others. Custom integrations available.",
                },
                {
                  q: "Is there a trial period?",
                  a: "Yes, we offer a 14-day free trial with full access to all features. No credit card required to get started.",
                },
                {
                  q: "What about data security?",
                  a: "We maintain SOC 2 Type II compliance and offer end-to-end encryption with optional on-premise deployment.",
                },
              ].map((item, i) => (
                <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-3">
                  <h3 className="font-semibold text-white">{item.q}</h3>
                  <p className="text-slate-400 text-sm">{item.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center space-y-6 bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-12">
            <h2 className="text-3xl font-bold text-white">Ready to strengthen your incident response?</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Contact our team for a personalized demo and see how Incident Guard can transform your security
              operations.
            </p>
            <button className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full transition-colors">
              Schedule a Demo
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
