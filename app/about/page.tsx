import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AboutPage() {
  return (
    <main className="container mx-auto p-4 lg:p-8">
      <Card className="border-zinc-800 bg-zinc-950/50 shadow-lg">
        <CardHeader className="border-b border-zinc-800 pb-6">
          <CardTitle className="text-2xl font-bold">About Bluey's Sign Language Translator</CardTitle>
          <CardDescription className="text-zinc-400 mt-2">
            Bridging communication gaps through technology
          </CardDescription>
        </CardHeader>
        
        <Tabs defaultValue="mission" className="w-full">
          <div className="px-6 pt-6">
            <TabsList className="grid grid-cols-4 w-full bg-zinc-900 border border-zinc-800">
              <TabsTrigger value="mission">Mission</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="tech">Technology</TabsTrigger>
              <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="mission" className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Our Mission</h3>
              <p className="text-zinc-300">
                Bluey's Sign Language Translator was created with a singular vision: to make communication accessible to everyone. 
                We believe that language should never be a barrier to understanding one another.
              </p>
              
              <h3 className="text-lg font-semibold text-white mt-6">The Problem We're Solving</h3>
              <p className="text-zinc-300">
                Over 70 million people worldwide use sign language as their primary means of communication. However, only a small 
                percentage of hearing people understand sign language, creating significant communication barriers in everyday interactions.
              </p>
              
              <div className="mt-6 p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
                <h4 className="font-medium text-blue-400">Our Commitment</h4>
                <p className="mt-2 text-zinc-300">
                  We are committed to continuous improvement of our translation technology, expanding language support, 
                  and working directly with deaf and hard of hearing communities to ensure our tool meets real-world needs.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="features" className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Key Features</h3>
              
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-green-900/30 border border-green-800 mr-3">
                    <span className="text-green-500">✓</span>
                  </div>
                  <div>
                    <span className="font-medium text-white">Real-time Translation</span>
                    <p className="text-zinc-400 text-sm mt-1">Instantly translate sign language to text with our advanced camera detection system</p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-green-900/30 border border-green-800 mr-3">
                    <span className="text-green-500">✓</span>
                  </div>
                  <div>
                    <span className="font-medium text-white">Multiple Language Support</span>
                    <p className="text-zinc-400 text-sm mt-1">Support for both American Sign Language (ASL) and Filipino Sign Language (FSL)</p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-green-900/30 border border-green-800 mr-3">
                    <span className="text-green-500">✓</span>
                  </div>
                  <div>
                    <span className="font-medium text-white">High Accuracy Detection</span>
                    <p className="text-zinc-400 text-sm mt-1">Advanced machine learning models trained on diverse datasets for reliable translations</p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-green-900/30 border border-green-800 mr-3">
                    <span className="text-green-500">✓</span>
                  </div>
                  <div>
                    <span className="font-medium text-white">Privacy-Focused</span>
                    <p className="text-zinc-400 text-sm mt-1">All processing happens locally on your device - no video is uploaded to external servers</p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-green-900/30 border border-green-800 mr-3">
                    <span className="text-green-500">✓</span>
                  </div>
                  <div>
                    <span className="font-medium text-white">Accessible Interface</span>
                    <p className="text-zinc-400 text-sm mt-1">Designed with accessibility best practices to ensure everyone can use the translator</p>
                  </div>
                </li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="tech" className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Our Technology</h3>
              <p className="text-zinc-300">
                Bluey's Sign Language Translator utilizes cutting-edge technologies to deliver accurate, real-time sign language translation.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                  <h4 className="font-medium text-white">TensorFlow.js</h4>
                  <p className="text-zinc-400 text-sm mt-1">
                    We use TensorFlow.js to run machine learning models directly in your browser, enabling fast performance without requiring server calls.
                  </p>
                </div>
                
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                  <h4 className="font-medium text-white">Handpose Detection</h4>
                  <p className="text-zinc-400 text-sm mt-1">
                    Google's MediaPipe Handpose model helps us accurately track hand landmarks in real-time, the foundation of our sign detection.
                  </p>
                </div>
                
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                  <h4 className="font-medium text-white">Custom Trained Models</h4>
                  <p className="text-zinc-400 text-sm mt-1">
                    Our sign language models are trained on the WLASL dataset for ASL and custom-collected data for FSL.
                  </p>
                </div>
                
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                  <h4 className="font-medium text-white">Next.js Framework</h4>
                  <p className="text-zinc-400 text-sm mt-1">
                    Built on Next.js for optimal performance, accessibility, and a smooth user experience across all devices.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="accessibility" className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Accessibility Commitment</h3>
              <p className="text-zinc-300">
                We believe that technology should be accessible to everyone. Our application is designed with the following accessibility features:
              </p>
              
              <ul className="list-disc pl-5 text-zinc-300 space-y-2 mt-4">
                <li>WCAG 2.1 AA compliant design</li>
                <li>Keyboard navigation support</li>
                <li>Screen reader compatibility</li>
                <li>High contrast mode</li>
                <li>Adjustable text sizes</li>
                <li>Minimal UI with clear visual cues</li>
              </ul>
              
              <div className="mt-6 p-4 bg-purple-900/20 border border-purple-800 rounded-lg">
                <h4 className="font-medium text-purple-400">Community Involvement</h4>
                <p className="mt-2 text-zinc-300">
                  Our application has been developed with direct input from deaf and hard of hearing communities. 
                  We continue to work closely with these communities to improve our translator.
                </p>
                
                <div className="mt-4">
                  <p className="text-zinc-400 text-sm">
                    If you have feedback or suggestions for improving our accessibility, please contact us at:
                    <a href="mailto:accessibility@blueystranslator.com" className="text-blue-400 ml-1 hover:underline">
                      accessibility@blueystranslator.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </main>
  )
} 