import { NextResponse } from "next/server"
import { verify } from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  console.error("JWT_SECRET environment variable is not set")
  throw new Error("JWT_SECRET environment variable is not set")
}

// Add type definition for our resources
type Resource = {
  id: string
  type: string
  language: string
  url: string
  name: string
  description: string
  dateAdded: string
  tags: string[]
}

// Initialize with the WLASL dataset
const resources: Resource[] = [
  {
    id: "wlasl-1",
    type: "dataset",
    language: "asl",
    url: "https://www.kaggle.com/datasets/risangbaskoro/wlasl-processed",
    name: "WLASL (World Level American Sign Language) Video Dataset",
    description: "12k processed videos of Word-Level American Sign Language glossary performance. Academic use only.",
    dateAdded: new Date().toISOString(),
    tags: ["dataset", "video", "academic", "ASL", "computer-vision"],
  },
]

export async function POST(req: Request) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1]

    if (!token) {
      return NextResponse.json({ message: "No token provided" }, { status: 401 })
    }

    try {
      const decoded = verify(token, JWT_SECRET)
      if (!(decoded as any).admin) {
        return NextResponse.json({ message: "Not authorized" }, { status: 403 })
      }

      const { type, language, url, name, description, tags } = await req.json()

      if (!type || !language || !url || !name) {
        return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
      }

      const newResource: Resource = {
        id: `resource-${Date.now()}`,
        type,
        language,
        url,
        name,
        description: description || "",
        dateAdded: new Date().toISOString(),
        tags: tags || [],
      }

      resources.push(newResource)
      return NextResponse.json({ message: "Resource added successfully", resource: newResource })
    } catch (error) {
      console.error("Token verification error:", error)
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }
  } catch (error) {
    console.error("Add resource error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  return NextResponse.json(resources)
}

