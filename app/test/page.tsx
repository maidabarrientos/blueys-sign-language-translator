"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SignTranslator } from '@/components/SignLanguage'
import { useState } from "react"

export default function TestPage() {
  const [translationText, setTranslationText] = useState("")

  return (
    <main className="container mx-auto p-4 lg:p-8">
      <Card className="shadow-lg bg-zinc-950/50 border-zinc-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Sign Language Testing</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Side: Camera */}
            <div className="w-full">
              <SignTranslator onPrediction={setTranslationText} />
            </div>

            {/* Right Side: Translation Box */}
            <div className="w-full h-full">
              <div className="h-full rounded-xl bg-zinc-900 border-4 border-zinc-800 shadow-[0_0_0_4px_rgba(255,255,255,0.1)] p-6">
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-sm text-white/80 font-mono">TEST RESULTS</span>
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <textarea 
                      value={translationText}
                      className="w-full h-48 bg-zinc-800/50 border-2 border-zinc-700 rounded-lg p-4 text-white/90 font-mono resize-none"
                      placeholder="Translation results will appear here..."
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}