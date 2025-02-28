import * as tf from "@tensorflow/tfjs"
import "@tensorflow/tfjs-backend-webgl"

export async function processFrame(videoBlob: Blob): Promise<tf.Tensor3D[]> {
  await tf.ready()
  tf.setBackend("webgl")

  const video = await createVideoElement(videoBlob)
  const frames: tf.Tensor3D[] = []

  const fps = 30
  const duration = video.duration
  const totalFrames = Math.floor(duration * fps)

  for (let i = 0; i < totalFrames; i++) {
    video.currentTime = i / fps
    await new Promise((resolve) => (video.oncanplay = resolve))
    const frame = tf.browser.fromPixels(video)
    frames.push(frame)
  }

  return frames
}

function createVideoElement(blob: Blob): Promise<HTMLVideoElement> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video")
    video.src = URL.createObjectURL(blob)
    video.onloadedmetadata = () => resolve(video)
    video.onerror = reject
  })
}

