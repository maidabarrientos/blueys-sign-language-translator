import * as tf from "@tensorflow/tfjs-node"
import { trainModel, saveModel } from "../lib/sign-language-model"
import path from "path"
import fs from "fs/promises"

async function loadImages(dir: string): Promise<[tf.Tensor3D[], number[]]> {
  const images: tf.Tensor3D[] = []
  const labels: number[] = []
  const signs = ["hello", "thank you", "yes", "no", "please"]

  for (let i = 0; i < signs.length; i++) {
    const signDir = path.join(dir, signs[i])
    const files = await fs.readdir(signDir)
    for (const file of files) {
      const imgPath = path.join(signDir, file)
      const img = (await tf.node.decodeImage(await fs.readFile(imgPath), 3)) as tf.Tensor3D
      images.push(img)
      labels.push(i)
    }
  }

  return [images, labels]
}

async function main() {
  // Train ASL model
  const [aslImages, aslLabels] = await loadImages("./data/asl")
  const aslModel = await trainModel(aslImages, aslLabels)
  await saveModel(aslModel, "./public/models/asl_model")

  // Train FSL model
  const [fslImages, fslLabels] = await loadImages("./data/fsl")
  const fslModel = await trainModel(fslImages, fslLabels)
  await saveModel(fslModel, "./public/models/fsl_model")

  console.log("Models trained and saved successfully!")
}

main().catch(console.error)

