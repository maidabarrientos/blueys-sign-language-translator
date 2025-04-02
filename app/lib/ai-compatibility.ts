/**
 * This file provides compatibility for using OpenAIStream and StreamingTextResponse
 * from the 'ai' package. It allows existing code to continue working without 
 * changing the import paths.
 */

import { createParser, EventSourceMessage } from 'eventsource-parser';
import * as ai from 'ai';

export class StreamingTextResponse extends Response {
  constructor(stream: ReadableStream, init?: ResponseInit) {
    super(stream, {
      ...init,
      headers: {
        ...init?.headers,
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  }
}

// Helper to convert a string to a stream
function stringToStream(text: string): ReadableStream {
  return new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(text));
      controller.close();
    },
  });
}

export async function OpenAIStream(response: Response): Promise<ReadableStream> {
  // For simplicity, if it's not a streaming response, just return the text as a stream
  if (!response.ok) {
    const result = await response.text();
    return stringToStream(result);
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  return new ReadableStream({
    async start(controller) {
      const parser = createParser({
        onEvent: (event: EventSourceMessage) => {
          if (event.data === '[DONE]') {
            controller.close();
            return;
          }
          
          try {
            const json = JSON.parse(event.data);
            
            // Extract text content from OpenAI response
            if (json.choices && json.choices[0]?.delta?.content) {
              controller.enqueue(encoder.encode(json.choices[0].delta.content));
            }
          } catch (e) {
            console.error('Error parsing JSON:', e);
          }
        },
        onError: (err) => {
          controller.error(err);
        }
      });

      // Feed the response body to the parser
      const reader = response.body?.getReader();
      if (!reader) {
        controller.close();
        return;
      }

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            controller.close();
            break;
          }
          parser.feed(decoder.decode(value));
        }
      } catch (e) {
        controller.error(e);
      }
    }
  });
}

// Re-export everything from 'ai' to maintain compatibility
export * from 'ai'; 