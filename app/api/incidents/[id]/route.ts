import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const incident = {
    id: params.id,
    title: "Incident Details",
    status: "investigating",
    type: "phishing",
    created_at: new Date().toISOString(),
  }

  return NextResponse.json(incident)
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const updated = {
      id: params.id,
      ...body,
      updated_at: new Date().toISOString(),
    }
    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update incident" }, { status: 400 })
  }
}
