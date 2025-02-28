"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import {
  Camera,
  Type,
  Loader2,
  AlertCircle,
  Info,
  HelpCircle,
  Users,
  MessageSquare,
  HelpCircleIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"

export default function Home() {
  const [mode, setMode] = useState<"camera" | "text">("camera")
  const [isRecording, setIsRecording] = useState(false)
  const [translation, setTranslation] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState<"asl" | "fsl">("asl")
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [translationError, setTranslationError] = useState<string | null>(null)
  const [feedbackMessage, setFeedbackMessage] = useState("")
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)

  useEffect(() => {
    if (mode === "camera") {
      startCamera()
    } else {
      stopCamera()
    }
  }, [mode])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setCameraError(null)
    } catch (err) {
      console.error("Error accessing camera:", err)
      setCameraError(
        "Unable to access the camera. Please check your permissions and ensure no other application is using the camera.",
      )
      toast({
        title: "Camera Error",
        description: "Failed to access the camera. Please check your settings.",
        variant: "destructive",
      })
    }
  }

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
    }
    setCameraError(null)
  }

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  const startRecording = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      const mediaRecorder = new MediaRecorder(stream)
      const chunks: Blob[] = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: "video/webm" })
        await translateSignLanguage(blob)
      }

      mediaRecorder.start()
      mediaRecorderRef.current = mediaRecorder
      setIsRecording(true)
    } else {
      toast({
        title: "Recording Error",
        description: "Camera stream is not available. Please ensure camera access is granted.",
        variant: "destructive",
      })
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const translateSignLanguage = async (videoBlob: Blob) => {
    setIsLoading(true)
    setTranslationError(null)
    try {
      const formData = new FormData()
      formData.append("video", videoBlob)
      formData.append("language", selectedLanguage)

      const response = await fetch("/api/translate", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Translation failed")
      }

      const data = await response.json()
      setTranslation(data.translation)
    } catch (error) {
      console.error("Translation error:", error)
      setTranslationError(error instanceof Error ? error.message : "An unknown error occurred")
      toast({
        title: "Translation Error",
        description: "An error occurred during translation. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleTextTranslate = async () => {
    const textInput = document.getElementById("text-input") as HTMLTextAreaElement
    if (textInput.value) {
      setIsLoading(true)
      setTranslationError(null)
      try {
        const response = await fetch("/api/translate-text", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: textInput.value, language: selectedLanguage }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Text translation failed")
        }

        const data = await response.json()
        setTranslation(data.translation)
      } catch (error) {
        console.error("Text translation error:", error)
        setTranslationError(error instanceof Error ? error.message : "An unknown error occurred")
        toast({
          title: "Translation Error",
          description: "An error occurred during text translation. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (feedbackMessage.trim()) {
      // In a real application, you would send this to your backend
      console.log("Feedback submitted:", feedbackMessage)
      toast({
        title: "Feedback Received",
        description: "Thank you for your feedback!",
      })
      setFeedbackMessage("")
    }
  }

  const handleHelpFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const message = formData.get("message") as string

    const mailtoLink = `mailto:jasonbluebarrientos@gmail.com?subject=Feedback for ASL/FSL Translator&body=Name: ${encodeURIComponent(name)}%0D%0AEmail: ${encodeURIComponent(email)}%0D%0AMessage: ${encodeURIComponent(message)}`

    window.location.href = mailtoLink
    toast({
      title: "Feedback Ready to Send",
      description: "Your default email client has been opened with your feedback. Please review and send the email.",
    })
    e.currentTarget.reset()
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="bg-gradient-to-br from-blue-100 to-purple-100">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold text-blue-600">
            Bluey&apos;s ASL/FSL Translator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="translator" className="space-y-4">
            <TabsList className="grid w-full grid-cols-5 mb-4">
              <TabsTrigger value="translator">Translator</TabsTrigger>
              <TabsTrigger value="how-to-use">
                <HelpCircle className="w-4 h-4 mr-2" />
                How to Use
              </TabsTrigger>
              <TabsTrigger value="what-is-it">
                <Info className="w-4 h-4 mr-2" />
                What is it?
              </TabsTrigger>
              <TabsTrigger value="how-you-can-help">
                <Users className="w-4 h-4 mr-2" />
                How You Can Help
              </TabsTrigger>
              <TabsTrigger value="faq">
                <HelpCircleIcon className="w-4 h-4 mr-2" />
                FAQ
              </TabsTrigger>
            </TabsList>

            <TabsContent value="translator">
              <div className="space-y-4">
                <div className="mb-4">
                  <Select value={selectedLanguage} onValueChange={(value: "asl" | "fsl") => setSelectedLanguage(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asl">American Sign Language (ASL)</SelectItem>
                      <SelectItem value="fsl">Filipino Sign Language (FSL)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Tabs value={mode} onValueChange={(value: "camera" | "text") => setMode(value as "camera" | "text")}>
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="camera">
                      <Camera className="w-4 h-4 mr-2" />
                      Camera
                    </TabsTrigger>
                    <TabsTrigger value="text">
                      <Type className="w-4 h-4 mr-2" />
                      Text
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="camera" className="space-y-4">
                    {cameraError ? (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Camera Error</AlertTitle>
                        <AlertDescription>{cameraError}</AlertDescription>
                      </Alert>
                    ) : (
                      <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
                        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                      </div>
                    )}
                    <Button
                      className="w-full"
                      variant={isRecording ? "destructive" : "default"}
                      onClick={toggleRecording}
                      disabled={!!cameraError}
                    >
                      {isRecording ? "Stop Recording" : "Start Recording"}
                    </Button>
                  </TabsContent>

                  <TabsContent value="text" className="space-y-4">
                    <textarea
                      id="text-input"
                      className="w-full min-h-[150px] p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={`Enter text to translate to ${selectedLanguage.toUpperCase()}...`}
                    />
                    <Button className="w-full" onClick={handleTextTranslate}>
                      Translate to {selectedLanguage.toUpperCase()}
                    </Button>
                  </TabsContent>
                </Tabs>

                {isLoading && (
                  <div className="flex justify-center items-center mt-4">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                  </div>
                )}

                {translationError && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Translation Error</AlertTitle>
                    <AlertDescription>{translationError}</AlertDescription>
                  </Alert>
                )}

                {translation && !isLoading && !translationError && (
                  <div className="mt-4 p-4 rounded-lg bg-blue-50 border border-blue-200">
                    <h3 className="font-semibold mb-2 text-blue-700">Translation:</h3>
                    <p className="text-blue-800">{translation}</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="how-to-use">
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-blue-700">How to Use Bluey&apos;s ASL/FSL Translator</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-blue-600">Camera Mode</h4>
                    <ol className="list-decimal list-inside space-y-2">
                      <li>Select your preferred sign language (ASL or FSL).</li>
                      <li>Switch to camera mode.</li>
                      <li>Ensure your camera is enabled and you&apos;re visible.</li>
                      <li>Click &apos;Start Recording&apos; and perform your signs.</li>
                      <li>Click &apos;Stop Recording&apos; to see the translation.</li>
                    </ol>
                    <div className="rounded-lg overflow-hidden shadow-lg">
                      <img src="/camera-mode-tutorial.gif" alt="Camera mode tutorial" className="w-full" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-blue-600">Text Mode</h4>
                    <ol className="list-decimal list-inside space-y-2">
                      <li>Select your preferred sign language (ASL or FSL).</li>
                      <li>Switch to text mode.</li>
                      <li>Type or paste the text you want to translate.</li>
                      <li>Click the &apos;Translate&apos; button.</li>
                      <li>View the sign language translation result.</li>
                    </ol>
                    <div className="rounded-lg overflow-hidden shadow-lg">
                      <img src="/text-mode-tutorial.gif" alt="Text mode tutorial" className="w-full" />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="what-is-it">
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-blue-700">What is Bluey&apos;s ASL/FSL Translator?</h3>
                <p className="text-lg">
                  Bluey&apos;s ASL/FSL Translator is an innovative application designed to bridge communication gaps
                  between sign language users and non-signers. It supports both American Sign Language (ASL) and
                  Filipino Sign Language (FSL), making it a versatile tool for diverse communities.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-xl font-semibold text-blue-600 mb-4">Key Features</h4>
                    <ul className="list-disc list-inside space-y-2">
                      <li>Real-time sign language translation</li>
                      <li>Text-to-sign language translation</li>
                      <li>Support for both ASL and FSL</li>
                      <li>User-friendly mobile interface</li>
                      <li>Powered by advanced AI</li>
                    </ul>
                  </div>
                  <div className="rounded-lg overflow-hidden shadow-lg">
                    <video src="/app-demo.mp4" controls className="w-full">
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
                <div className="mt-8">
                  <h4 className="text-xl font-semibold text-blue-600 mb-4">Technical Stack</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow">
                      <h5 className="font-semibold mb-2">Frontend</h5>
                      <ul className="list-disc list-inside">
                        <li>Next.js</li>
                        <li>React</li>
                        <li>TypeScript</li>
                      </ul>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                      <h5 className="font-semibold mb-2">UI Components</h5>
                      <ul className="list-disc list-inside">
                        <li>shadcn/ui</li>
                        <li>Tailwind CSS</li>
                      </ul>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                      <h5 className="font-semibold mb-2">Authentication</h5>
                      <ul className="list-disc list-inside">
                        <li>JSON Web Tokens (JWT)</li>
                      </ul>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                      <h5 className="font-semibold mb-2">API</h5>
                      <ul className="list-disc list-inside">
                        <li>Next.js API Routes</li>
                      </ul>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                      <h5 className="font-semibold mb-2">AI Integration</h5>
                      <ul className="list-disc list-inside">
                        <li>TensorFlow.js</li>
                        <li>OpenAI GPT-3.5 Turbo</li>
                      </ul>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                      <h5 className="font-semibold mb-2">Deployment</h5>
                      <ul className="list-disc list-inside">
                        <li>Vercel</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="how-you-can-help">
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-blue-700">
                  How You Can Help Improve Bluey&apos;s ASL/FSL Translator
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <ul className="list-disc list-inside space-y-2">
                      <li>Facilitates communication between deaf and hearing individuals</li>
                      <li>Assists in learning and practicing sign language</li>
                      <li>Enables quick translations in various settings</li>
                      <li>Promotes inclusivity and accessibility</li>
                      <li>Supports both ASL and FSL users</li>
                      <li>Provides a portable solution for on-the-go communication</li>
                      <li>Raises awareness about sign languages and deaf culture</li>
                    </ul>
                    <div className="mt-4 rounded-lg overflow-hidden shadow-lg">
                      <img src="/helping-community.jpg" alt="Helping the community" className="w-full" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-blue-600 mb-4">How You Can Help</h4>
                    <p className="mb-4">
                      Your feedback and suggestions are invaluable in improving our app. Please share your thoughts with
                      us:
                    </p>
                    <form onSubmit={handleHelpFormSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" name="name" required />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" required />
                      </div>
                      <div>
                        <Label htmlFor="message">Message</Label>
                        <Textarea id="message" name="message" required />
                      </div>
                      <Button type="submit">Send Feedback</Button>
                    </form>
                  </div>
                </div>
                <p className="text-lg">
                  By breaking down language barriers, Bluey&apos;s ASL/FSL Translator contributes to a more inclusive
                  and connected world, empowering both deaf and hearing individuals to communicate more effectively.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="faq">
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-blue-700">Frequently Asked Questions</h3>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>How accurate is the translation?</AccordionTrigger>
                    <AccordionContent>
                      Our AI-powered translation system is highly accurate, but like any AI system, it may occasionally
                      make mistakes. We continuously work on improving its accuracy through machine learning and user
                      feedback.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Can I use this app offline?</AccordionTrigger>
                    <AccordionContent>
                      Currently, an internet connection is required for the app to function as it relies on our
                      cloud-based AI for translations. We're exploring options for offline functionality in future
                      updates.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>Is my data secure?</AccordionTrigger>
                    <AccordionContent>
                      We take data privacy very seriously. All video and text inputs are processed in real-time and are
                      not stored on our servers. We adhere to strict data protection guidelines to ensure your
                      information remains secure.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4">
                    <AccordionTrigger>How can I improve the app&apos;s performance?</AccordionTrigger>
                    <AccordionContent>
                      For best results, ensure good lighting when using the camera mode, and try to sign clearly and at
                      a moderate pace. If you&apos;re experiencing issues, try updating your browser or app to the
                      latest version.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </TabsContent>
          </Tabs>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="mt-6">
                <MessageSquare className="w-4 h-4 mr-2" />
                Provide Feedback
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Feedback</DialogTitle>
                <DialogDescription>
                  We value your input! Please share your thoughts, suggestions, or report any issues you&apos;ve
                  encountered.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleFeedbackSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="feedback" className="text-right">
                      Your feedback
                    </Label>
                    <Textarea
                      id="feedback"
                      value={feedbackMessage}
                      onChange={(e) => setFeedbackMessage(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <Button type="submit">Submit Feedback</Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </main>
  )
}

