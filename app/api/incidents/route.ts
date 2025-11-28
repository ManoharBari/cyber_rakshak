import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const incident = {
      id: `INC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...body,
      created_at: new Date().toISOString(),
      status: "open",
      ai_assessment: {
        risk_level: body.type === "phishing" ? "high" : "medium",
        impact: Math.floor(Math.random() * 100),
        recommendations: [
          "Monitor for similar incidents",
          "Update security protocols",
          "Notify relevant teams",
          "Document findings",
        ],
      },
    }

    return NextResponse.json(incident, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create incident" }, { status: 400 })
  }
}

export async function GET() {
  const incidents = [
    {
      id: "INC-1705339200000-abc123",
      title: "Phishing Campaign",
      type: "phishing",
      status: "investigating",
      created_at: new Date().toISOString(),
    },
  ]

  return NextResponse.json(incidents)
}
