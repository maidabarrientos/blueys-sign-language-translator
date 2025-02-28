import { type NextRequest, NextResponse } from "next/server"
import { processFrame } from "@/lib/video-processor"
import { translateSignLanguage } from "@/lib/translator"

export const runtime = "edge"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const video = formData.get("video") as Blob
    const language = formData.get("language") as string

    if (!video || !(video instanceof Blob)) {
      return NextResponse.json({ error: "No video file provided" }, { status: 400 })
    }

    // Process video frames
    const frames = await processFrame(video)

    // Translate processed frames
    const translation = await translateSignLanguage(frames, language)

    return NextResponse.json({ translation })
  } catch (error) {
    console.error("Video processing error:", error)
    return NextResponse.json({ error: "Video processing failed" }, { status: 500 })
  }
}

