import * as tf from "@tensorflow/tfjs"
import "@tensorflow/tfjs-backend-webgl"

// Define the signs we want to recognize
const SIGNS = ["hello", "thank you", "yes", "no", "please"]

// Create a simple CNN model
function createModel(): tf.LayersModel {
  const model = tf.sequential()

  model.add(
    tf.layers.conv2d({
      inputShape: [64, 64, 3],
      kernelSize: 3,
      filters: 32,
      activation: "relu",
    }),
  )
  model.add(tf.layers.maxPooling2d({ poolSize: 2 }))

  model.add(tf.layers.conv2d({ kernelSize: 3, filters: 64, activation: "relu" }))
  model.add(tf.layers.maxPooling2d({ poolSize: 2 }))

  model.add(tf.layers.flatten())
  model.add(tf.layers.dense({ units: 128, activation: "relu" }))
  model.add(tf.layers.dense({ units: SIGNS.length, activation: "softmax" }))

  model.compile({
    optimizer: "adam",
    loss: "categoricalCrossentropy",
    metrics: ["accuracy"],
  })

  return model
}

// Function to preprocess images
async function preprocessImage(imageTensor: tf.Tensor3D): Promise<tf.Tensor4D> {
  const resized = tf.image.resizeBilinear(imageTensor, [64, 64])
  const expanded = resized.expandDims(0)
  return expanded.toFloat().div(255) as tf.Tensor4D
}

// Function to train the model
export async function trainModel(images: tf.Tensor3D[], labels: number[]): Promise<tf.LayersModel> {
  await tf.ready()

  const model = createModel()

  const xs = tf.concat(await Promise.all(images.map(preprocessImage)))
  const ys = tf.oneHot(tf.tensor1d(labels, "int32"), SIGNS.length)

  await model.fit(xs, ys, {
    epochs: 50,
    batchSize: 32,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        console.log(`Epoch ${epoch}: loss = ${logs?.loss.toFixed(4)}, accuracy = ${logs?.acc.toFixed(4)}`)
      },
    },
  })

  return model
}

// Function to make predictions
export async function predictSign(model: tf.LayersModel, image: tf.Tensor3D): Promise<string> {
  const processedImage = await preprocessImage(image)
  const prediction = model.predict(processedImage) as tf.Tensor
  const index = prediction.argMax(1).dataSync()[0]
  return SIGNS[index]
}

// Function to save the model
export async function saveModel(model: tf.LayersModel, path: string): Promise<void> {
  await model.save(`file://${path}`)
}

// Function to load the model
export async function loadModel(path: string): Promise<tf.LayersModel> {
  return await tf.loadLayersModel(`file://${path}`)
}

