import { NextResponse } from "next/server"
import { sign } from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  console.error("JWT_SECRET environment variable is not set")
  throw new Error("JWT_SECRET environment variable is not set")
}

export async function POST(req: Request) {
  try {
    const { password } = await req.json()

    if (password === "Bluey3030**") {
      const token = sign({ admin: true }, JWT_SECRET, { expiresIn: "1h" })
      return NextResponse.json({ token })
    } else {
      console.warn("Invalid login attempt")
      return NextResponse.json({ message: "Invalid password" }, { status: 401 })
    }
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

