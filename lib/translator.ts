import type * as tf from "@tensorflow/tfjs"
import "@tensorflow/tfjs-backend-webgl"
import { loadModel, predictSign } from "./sign-language-model"

let aslModel: tf.LayersModel
let fslModel: tf.LayersModel

async function loadModels() {
  aslModel = await loadModel("/models/asl_model/model.json")
  fslModel = await loadModel("/models/fsl_model/model.json")
}

loadModels()

export async function translateSignLanguage(frames: tf.Tensor3D[], language: string): Promise<string> {
  const model = language === "asl" ? aslModel : fslModel

  if (!model) {
    throw new Error("Model not loaded")
  }

  const predictions = await Promise.all(frames.map((frame) => predictSign(model, frame)))

  // Simple post-processing: return the most common prediction
  const counts = predictions.reduce(
    (acc, pred) => {
      acc[pred] = (acc[pred] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const mostCommonSign = Object.entries(counts).reduce((a, b) => (a[1] > b[1] ? a : b))[0]

  return `Recognized sign: ${mostCommonSign}`
}

export async function translateTextToSigns(text: string, language: string): Promise<string> {
  // This is still a placeholder. In a real implementation, you'd use a text-to-sign model or API.
  return `[${language.toUpperCase()} signs for: ${text}]`
}

