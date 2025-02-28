import { type NextRequest, NextResponse } from "next/server"
import { translateTextToSigns } from "@/lib/translator"

export const runtime = "edge"

export async function POST(req: NextRequest) {
  try {
    const { text, language } = await req.json()

    if (!text || !language) {
      return NextResponse.json({ error: "Missing text or language" }, { status: 400 })
    }

    const translation = await translateTextToSigns(text, language)

    return NextResponse.json({ translation })
  } catch (error) {
    console.error("Text translation error:", error)
    return NextResponse.json({ error: "Text translation failed" }, { status: 500 })
  }
}

