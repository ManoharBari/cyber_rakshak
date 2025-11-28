import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "Image file missing" },
        { status: 400 }
      );
    }

    // Convert image to raw bytes
    const imageBuffer = Buffer.from(await file.arrayBuffer());

    // Call HF inference API
    const response = await fetch(
      "https://api-inference.huggingface.co/models/allenai/olmOCR-2-7B-1025-FP8",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/octet-stream",
        },
        body: imageBuffer,
      }
    );

    const result = await response.json();

    // result may contain `generated_text` or `text`
    const extractedText =
      result.generated_text ||
      result.text ||
      result[0]?.generated_text ||
      "No text detected";

    return NextResponse.json({
      success: true,
      text: extractedText,
      raw: result, // helpful for debugging
    });
  } catch (error: any) {
    console.error("OCR Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error processing OCR",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
