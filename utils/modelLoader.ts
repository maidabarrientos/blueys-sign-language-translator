import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import * as handpose from "@tensorflow-models/handpose";
import { loadModel, saveModel, predictSign, trainModel } from "@/lib/sign-language-model";
import { setupAbortSignalPolyfill } from "./polyfills";

// Initialize polyfills
if (typeof window !== 'undefined') {
  setupAbortSignalPolyfill();
}

export class SignLanguageModel {
  private model: tf.LayersModel | null = null;
  private handposeModel: handpose.HandPose | null = null;
  private initStatus: string = "Not started";
  private isHandDetected: boolean = false;
  private lastApiCallTime: number = 0;
  private lastResult: { gesture: string; confidence: number; handLandmarks?: number[][] } | null = null;
  
  constructor() {
    this.initStatus = "Initialized";
  }

  async load(): Promise<void> {
    this.initStatus = "Loading TensorFlow...";
    await tf.ready();
    
    this.initStatus = "Loading Handpose model...";
    this.handposeModel = await handpose.load();
    
    try {
      this.initStatus = "Loading sign language model...";
      // In a real app, you would load from a persistent storage
      // Here we'll just initialize a new model
      this.model = tf.sequential();
      this.initStatus = "Models loaded successfully";
    } catch (error) {
      this.initStatus = `Failed to load model: ${error}`;
      throw new Error(`Failed to load model: ${error}`);
    }
  }

  getInitializationStatus(): string {
    return this.initStatus;
  }

  isHandCurrentlyDetected(): boolean {
    return this.isHandDetected;
  }

  // Check if video is ready for processing
  private isVideoReady(video: HTMLVideoElement): boolean {
    return video &&
           video.readyState === 4 &&
           video.videoWidth > 0 &&
           video.videoHeight > 0 &&
           !video.paused &&
           !video.ended;
  }

  // Capture frame from video as base64 image
  private captureFrame(video: HTMLVideoElement): string {
    try {
      const canvas = document.createElement('canvas');
      // Use higher resolution for better sign recognition
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Flip horizontally if video is mirrored
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        // Draw with high quality
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        // Higher quality JPEG for better recognition
        return canvas.toDataURL('image/jpeg', 0.95);
      }
    } catch (err) {
      console.error("Error capturing frame:", err);
    }
    return '';
  }

  async estimateHands(video: HTMLVideoElement): Promise<handpose.AnnotatedPrediction[]> {
    if (!this.handposeModel) {
      throw new Error("Handpose model not loaded");
    }

    // Make sure video is ready before processing
    if (!this.isVideoReady(video)) {
      console.log("Video not ready yet, skipping hand detection");
      return [];
    }

    try {
      const hands = await this.handposeModel.estimateHands(video);
      this.isHandDetected = hands.length > 0;
      return hands;
    } catch (error) {
      console.error("Hand estimation error:", error);
      return [];
    }
  }

  // Use a safe version of AbortSignal.timeout in the fetch call
  private safeCreateTimeout = () => {
    if (typeof AbortSignal !== 'undefined' && 'timeout' in AbortSignal) {
      return AbortSignal.timeout(10000);
    } else {
      // Fallback for browsers without AbortSignal.timeout
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 10000);
      return controller.signal;
    }
  };

  async detectSign(video: HTMLVideoElement): Promise<{ gesture: string; confidence: number; handLandmarks?: number[][] } | null> {
    if (!this.handposeModel) {
      return null;
    }

    // Make sure video is ready before processing
    if (!this.isVideoReady(video)) {
      console.log("Video not ready yet, skipping sign detection");
      return null;
    }

    try {
      const hands = await this.estimateHands(video);
      
      // No translation if no hand is detected
      if (hands.length === 0) {
        this.isHandDetected = false;
        return null;
      }

      this.isHandDetected = true;
      
      // Get hand landmarks
      const handLandmarks = hands[0].landmarks;
      
      // Only call the API every 2 seconds to avoid excessive API usage
      const now = Date.now();
      if (now - this.lastApiCallTime > 2000) {
        this.lastApiCallTime = now;
        
        // Capture the current frame as base64
        const frameBase64 = this.captureFrame(video);
        
        if (frameBase64) {
          try {
            // Call OpenAI API to interpret the sign language
            console.log("Calling OpenAI API for sign language interpretation");
            
            const response = await fetch('/api/interpret-sign', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ 
                image: frameBase64
              }),
              // Add timeout to prevent hanging requests
              signal: this.safeCreateTimeout()
            });
            
            if (response.ok) {
              const data = await response.json();
              
              if (data.gesture) {
                // Don't update if the response is "No sign detected" or "Processing"
                const lowerGesture = data.gesture.toLowerCase();
                if (lowerGesture !== "no sign detected" && 
                    lowerGesture !== "processing" && 
                    lowerGesture !== "no clear sign") {
                  
                  this.lastResult = {
                    gesture: data.gesture,
                    confidence: data.confidence || 0.9,
                    handLandmarks: handLandmarks
                  };
                  
                  console.log("OpenAI interpretation:", data.gesture);
                } else {
                  console.log("OpenAI couldn't detect a clear sign");
                }
              }
            } else {
              let errorDetails = "";
              try {
                const errorData = await response.json();
                errorDetails = JSON.stringify(errorData);
              } catch {
                errorDetails = await response.text();
              }
              
              console.error(`Error calling OpenAI API (${response.status}):`, errorDetails);
              
              // If there's no previous result, provide a fallback
              if (!this.lastResult) {
                console.log("Using fallback for first-time error");
                this.lastResult = {
                  gesture: "Processing...",
                  confidence: 0.5,
                  handLandmarks: handLandmarks
                };
              }
            }
          } catch (apiError) {
            console.error("Error calling API:", apiError);
          }
        }
      }
      
      // Return the last result if available
      return this.lastResult;
    } catch (error) {
      console.error("Sign detection error:", error);
      return null;
    }
  }
  
  // Helper method to determine if a hand is clearly visible
  private isHandClearlyVisible(landmarks: number[][]): boolean {
    // Calculate the average confidence or check for minimum visibility
    // This is a simple placeholder implementation
    
    if (!landmarks || landmarks.length === 0) {
      return false;
    }
    
    // For example, check if the landmarks are within the frame
    for (const point of landmarks) {
      // Assuming points are normalized to [0, 1]
      if (point[0] < 0 || point[0] > 1 || point[1] < 0 || point[1] > 1) {
        return false;
      }
    }
    
    return true;
  }

  async trainModel(landmarks: number[][], label: string): Promise<void> {
    // Placeholder for training implementation
    console.log(`Training for label: ${label} with landmarks:`, landmarks);
    // In a real implementation, you would use the trainModel function
  }

  async saveModel(): Promise<void> {
    // Placeholder for model saving
    console.log("Model saved");
    // In a real implementation, you would use the saveModel function
  }

  dispose(): void {
    if (this.model) {
      this.model.dispose();
    }
    // Handpose model doesn't have a dispose method in the public API
  }
} 