"use client"

import { useState } from "react"
import {
  Camera,
  Type,
  Heart,
  Info,
  History,
  Menu,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { SignLanguageDetector } from '@/components/SignLanguageDetector'

export default function Home() {
  const [mode, setMode] = useState<"camera" | "text">("camera")

  return (
    <main className="container mx-auto p-4 lg:p-8">
      <Card className="shadow-lg bg-zinc-950/50 border-zinc-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Sign Language Detection</CardTitle>
            <Tabs defaultValue="camera" className="w-32">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="camera">
                  <Camera className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="text">
                  <Type className="h-4 w-4" />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <SignLanguageDetector />
        </CardContent>
      </Card>
    </main>
  )
}

