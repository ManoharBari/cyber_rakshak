import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { supabase } from "@/lib/supabase";
import { encrypt } from "@/lib/crypto";

// Gemini Client Setup
const GEMINI_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_KEY) throw new Error("GEMINI_API_KEY not set in env");

const genAI = new GoogleGenAI({ apiKey: GEMINI_KEY });

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      fullName,
      email,
      address,
      incidentTitle,
      incidentType,
      incidentDate,
      description,
    } = body;

    if (!incidentTitle || !incidentType || !description) {
      return NextResponse.json(
        { success: false, error: "Required fields missing" },
        { status: 400 }
      );
    }

    // --- Build Incident Object ---
    const incident = {
      title: incidentTitle,
      type: incidentType,
      date: incidentDate,
      description,
      reportedBy: fullName,
      email,
      location: address,
    };

    // System-Style Instruction
    const systemPrompt = `
You are a cybersecurity incident analyst.

Analyze the incident and OUTPUT ONLY valid JSON.

JSON Schema:
{
  "summary": string,
  "mitigation_steps": string[],
  "impact_score": number
}

Rules:
1. "summary" must be 2–3 sentences.
2. "mitigation_steps" must contain 5–7 clear and easy actionable steps.
3. "impact_score" must be a number from 0–100.
4. Output ONLY the JSON. No extra text.

Incident Details:
${JSON.stringify(incident, null, 2)}
`;

    // Gemini Call
    const result = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: systemPrompt,
    });

    const raw = result.text;
    if (!raw) {
      return NextResponse.json(
        { success: false, error: "Empty response from Gemini" },
        { status: 500 }
      );
    }

    // Extract JSON Safely
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      const extracted = raw.match(/\{[\s\S]*\}/);
      if (!extracted) {
        return NextResponse.json(
          { success: false, error: "Invalid JSON output", raw },
          { status: 500 }
        );
      }
      parsed = JSON.parse(extracted[0]);
    }

    const { summary, mitigation_steps, impact_score } = parsed;

    if (!summary || !mitigation_steps || typeof impact_score !== "number") {
      return NextResponse.json(
        { success: false, error: "AI Response missing fields", raw },
        { status: 500 }
      );
    }

    // --- Priority Label ---
    let label = "low";
    if (impact_score > 75) label = "high";
    else if (impact_score > 40) label = "medium";

    // Unique Incident ID
    const incidentId = `INC-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()}`;

    // INSERT INTO DB WITH ENCRYPTION
    const { error } = await supabase.from("incidents").insert({
      incident_id: incidentId,

      // plaintext
      title: incidentTitle,
      type: incidentType,
      date: incidentDate,
      impact_score,
      label,

      // encrypted fields
      description: encrypt(description),
      summary: encrypt(summary),
      actions: mitigation_steps.map((step) => encrypt(step)),
      reported_by: encrypt(fullName),
      email: encrypt(email),
      location: encrypt(address),
    });

    if (error) {
      console.error("DB Error:", error);
      return NextResponse.json(
        { success: false, error: "Database insert failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        incidentId,
        assessment: {
          summary,
          actions: mitigation_steps,
          impactScore: impact_score,
          label,
        },
        incident,
      },
      message: "Incident analyzed successfully",
    });
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
        details: String(err),
      },
      { status: 500 }
    );
  }
}
