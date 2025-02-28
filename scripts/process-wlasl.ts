import fs from "fs/promises"
import path from "path"
import fetch from "node-fetch"

async function downloadWLASLDataset() {
  console.log("Starting WLASL dataset download and processing...")

  try {
    // Create directories if they don't exist
    await fs.mkdir(path.join(process.cwd(), "data", "asl"), { recursive: true })

    // Download the dataset JSON file
    console.log("Downloading WLASL dataset metadata...")
    const response = await fetch("https://raw.githubusercontent.com/dxli94/WLASL/main/start_kit/WLASL_v0.3.json")
    const data = await response.json()

    // Process and save metadata
    console.log("Processing metadata...")
    const processedData = data.map((entry: any) => ({
      gloss: entry.gloss,
      instances: entry.instances.map((instance: any) => ({
        video_id: instance.video_id,
        url: instance.url,
        signer_id: instance.signer_id,
        start_time: instance.start_time,
        end_time: instance.end_time,
      })),
    }))

    // Save processed metadata
    await fs.writeFile(
      path.join(process.cwd(), "data", "asl", "wlasl_metadata.json"),
      JSON.stringify(processedData, null, 2),
    )

    console.log("WLASL dataset processing completed successfully!")
    console.log(`Total signs processed: ${processedData.length}`)
    console.log(`Metadata saved to: ${path.join(process.cwd(), "data", "asl", "wlasl_metadata.json")}`)
  } catch (error) {
    console.error("Error processing WLASL dataset:", error)
    throw error
  }
}

// Run the processing
downloadWLASLDataset().catch(console.error)

