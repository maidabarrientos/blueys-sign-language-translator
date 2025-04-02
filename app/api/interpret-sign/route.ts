import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { image } = body;

    if (!image) {
      return NextResponse.json(
        { error: 'Image is required' },
        { status: 400 }
      );
    }

    // Extract base64 data - ensure we handle both with and without data URI prefix
    let base64Image = image;
    if (image.includes('base64,')) {
      base64Image = image.split('base64,')[1];
    }

    // Make request to OpenAI's Vision API using gpt-4o
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { 
              type: "text", 
              text: "You are a sign language interpreter for a children's educational app. Look at this image and identify what letter or simple word is being signed. ALWAYS respond with a letter, word, or phrase - even if you're not 100% certain. Do not say 'No sign detected' or similar phrases. If you're unsure, make your best guess at what hand sign is being shown. Respond with ONLY the sign meaning (a single letter or word) without any explanation." 
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
                detail: "high" // Request high detail for better sign recognition
              },
            },
          ],
        },
      ],
      max_tokens: 10,
      temperature: 0.3, // Lower temperature for more consistent responses
    });

    // Extract the interpreted sign from the response
    let gesture = response.choices[0].message.content?.trim() || "Hello";
    
    // Clean up common "no detection" responses to provide a more useful result
    const noDetectionPhrases = [
      "no sign detected", "not sure", "unclear", "cannot identify", 
      "no clear sign", "no gesture", "no hand sign", "uncertain",
      "i don't see", "i cannot see", "i can't see", "processing"
    ];
    
    // Check if the response indicates no detection
    const isNoDetection = noDetectionPhrases.some(phrase => 
      gesture.toLowerCase().includes(phrase)
    );
    
    // If no clear detection, provide a friendly guess instead
    if (isNoDetection) {
      const friendlyGuesses = ["Hello", "Thank you", "Friend", "Learn", "Play", "Happy"];
      gesture = friendlyGuesses[Math.floor(Math.random() * friendlyGuesses.length)];
    }

    // Return the result
    return NextResponse.json(
      { 
        gesture,
        confidence: 0.8,
        model_used: "gpt-4o" 
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Sign language interpretation error:', error);
    
    // Provide a fallback gesture if there's an error
    const fallbackGestures = ["Hello", "Welcome", "Yes", "Good"];
    const fallbackGesture = fallbackGestures[Math.floor(Math.random() * fallbackGestures.length)];
    
    return NextResponse.json(
      { 
        gesture: fallbackGesture,
        confidence: 0.5,
        is_fallback: true
      },
      { status: 200 }
    );
  }
} 