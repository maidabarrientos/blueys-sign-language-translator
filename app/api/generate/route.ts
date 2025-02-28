import { Configuration, OpenAIApi } from "openai-edge"

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(config)

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    const response = await openai.createImage({
      prompt,
      n: 1,
      size: "1024x1024",
    })

    const data = await response.json()

    return Response.json({ url: data.data[0].url })
  } catch (error) {
    console.error("Error:", error)
    return Response.json({ error: "Failed to generate image" }, { status: 500 })
  }
}

