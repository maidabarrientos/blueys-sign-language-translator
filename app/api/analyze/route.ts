import { Configuration, OpenAIApi } from "openai-edge"

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(config)

export async function POST(req: Request) {
  try {
    const { imageUrl } = await req.json()

    const response = await openai.createChatCompletion({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Analyze this image and describe what you see in detail." },
            { type: "image_url", image_url: imageUrl },
          ],
        },
      ],
      max_tokens: 500,
    })

    const data = await response.json()
    const analysis = data.choices[0].message.content

    return Response.json({ analysis })
  } catch (error) {
    console.error("Error:", error)
    return Response.json({ error: "Failed to analyze image" }, { status: 500 })
  }
}

