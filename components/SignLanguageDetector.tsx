'use client';

import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { SignLanguageModel } from '@/utils/modelLoader';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface Detection {
  gesture: string;
  confidence: number;
  handLandmarks?: number[][];
}

type Language = 'ASL' | 'FSL';

export function SignLanguageDetector() {
  const webcamRef = useRef<Webcam>(null);
  const [detector, setDetector] = useState<SignLanguageModel | null>(null);
  const [detection, setDetection] = useState<Detection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState<Language>('ASL');
  const requestRef = useRef<number>();
  const [isTraining, setIsTraining] = useState(false);
  const [currentLabel, setCurrentLabel] = useState<string>('');
  const [showTraining, setShowTraining] = useState(false);
  const [initStatus, setInitStatus] = useState<string>('');
  const [handDetected, setHandDetected] = useState(false);
  const [isWebcamReady, setIsWebcamReady] = useState(false);
  const [enableVoice, setEnableVoice] = useState(true);
  const [casualMode, setCasualMode] = useState(true);
  const { speak, speakCasually, speaking, supported: speechSupported, getEnglishVoice } = useSpeechSynthesis();
  const lastSpokenText = useRef<string>('');

  useEffect(() => {
    const initializeDetector = async () => {
      const model = new SignLanguageModel();
      setDetector(model);
      
      try {
        await model.load();
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to initialize:', error);
        toast({
          title: "Initialization Error",
          description: String(error),
        });
      }
    };

    setIsLoading(true);
    initializeDetector();

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  // Handle webcam readiness
  const handleWebcamReady = () => {
    setIsWebcamReady(true);
  };

  const detectSigns = async () => {
    if (!detector || !webcamRef.current?.video) return;
    
    // Skip detection if webcam isn't ready
    if (!isWebcamReady || webcamRef.current.video.readyState !== 4) {
      requestRef.current = requestAnimationFrame(detectSigns);
      return;
    }

    try {
      console.log("Detecting signs...");
      const result = await detector.detectSign(webcamRef.current.video);
      const isHandDetected = detector.isHandCurrentlyDetected();
      console.log("Hand detected:", isHandDetected, "Result:", result);
      setHandDetected(isHandDetected);
      
      if (result) {
        console.log("Setting detection result:", result.gesture, result.confidence);
        setDetection({
          gesture: result.gesture,
          confidence: result.confidence,
          handLandmarks: result.handLandmarks
        });
      } else if (isHandDetected) {
        // Hand detected but no gesture recognized
        console.log("Hand detected but no gesture recognized");
        setDetection(null);
      } else {
        // No hand detected
        console.log("No hand detected");
        setDetection(null);
      }
    } catch (error) {
      console.error('Detection error:', error);
    }

    requestRef.current = requestAnimationFrame(detectSigns);
  };

  useEffect(() => {
    if (!isLoading && isWebcamReady) {
      // Add a small delay to ensure webcam is fully initialized
      const timer = setTimeout(() => {
        detectSigns();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, isWebcamReady]);

  const handleLanguageChange = (newLanguage: Language) => {
    setIsLoading(true);
    setLanguage(newLanguage);
  };

  const handleTraining = async (label: string) => {
    if (!detector || !webcamRef.current?.video) return;

    setIsTraining(true);
    setCurrentLabel(label);
    try {
      const hands = await detector.estimateHands(webcamRef.current.video);
      if (hands.length > 0) {
        await detector.trainModel(hands[0].landmarks, label);
        await detector.saveModel();
        toast({
          title: "Training Success",
          description: `Trained for sign: ${label}`,
        });
      }
    } catch (error) {
      console.error('Training error:', error);
    }
    setIsTraining(false);
  };

  useEffect(() => {
    return () => {
      // Cleanup when component unmounts
      detector?.dispose();
    };
  }, [detector]);

  useEffect(() => {
    // Speak the detected gesture when it changes and voice is enabled
    if (detection && enableVoice && speechSupported && detection.gesture !== lastSpokenText.current) {
      lastSpokenText.current = detection.gesture;
      
      // Use casual speaking style if enabled, otherwise use normal speech
      if (casualMode) {
        speakCasually(detection.gesture, { voice: getEnglishVoice() });
      } else {
        speak(detection.gesture, { voice: getEnglishVoice() });
      }
    }
  }, [detection, enableVoice, casualMode, speechSupported, speak, speakCasually, getEnglishVoice]);

  return (
    <div className="relative">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        {/* Left Side: Camera + Training Controls */}
        <div className="w-full space-y-4">
          {/* Camera View */}
          <div className="relative rounded-xl overflow-hidden bg-black border-4 border-zinc-800 shadow-[0_0_0_4px_rgba(255,255,255,0.1)]">
            <Webcam
              ref={webcamRef}
              className="w-full aspect-[4/3] object-cover"
              mirrored
              audio={false}
              screenshotFormat="image/jpeg"
              videoConstraints={{
                width: 1280,
                height: 960,
                facingMode: "user",
              }}
              onUserMedia={handleWebcamReady}
            />
            
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="text-white font-medium">
                  <div className="animate-pulse mb-2">Loading {language} model...</div>
                  <div className="text-sm text-white/70">{detector?.getInitializationStatus()}</div>
                </div>
              </div>
            )}

            {!isWebcamReady && !isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="text-white font-medium">
                  <div className="animate-pulse mb-2">Initializing camera...</div>
                  <div className="text-sm text-white/70">Please allow camera access</div>
                </div>
              </div>
            )}

            {/* Camera UI Overlay */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs text-white/80 font-mono">REC</span>
            </div>
          </div>

          {/* Language Selector and Voice Toggle */}
          <div className="flex justify-between items-center">
            <Select
              value={language}
              onValueChange={(value: Language) => handleLanguageChange(value)}
            >
              <SelectTrigger className="w-[180px] border-2 border-zinc-800">
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ASL">American Sign Language</SelectItem>
                <SelectItem value="FSL">Filipino Sign Language</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="voice-mode"
                  checked={enableVoice}
                  onCheckedChange={setEnableVoice}
                  disabled={!speechSupported}
                />
                <Label htmlFor="voice-mode" className="text-sm text-zinc-300">
                  Voice Output
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="casual-mode"
                  checked={casualMode}
                  onCheckedChange={setCasualMode}
                  disabled={!enableVoice || !speechSupported}
                />
                <Label htmlFor="casual-mode" className="text-sm text-zinc-300">
                  Friendly Voice
                </Label>
              </div>
            </div>

            {/* Training Button - Only show when needed */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTraining(!showTraining)}
              className="border-2 border-zinc-800"
            >
              {showTraining ? 'Hide Training' : 'Show Training'}
            </Button>
          </div>

          {/* Training Controls - Hidden by default */}
          {showTraining && (
            <div className="p-4 rounded-xl bg-zinc-900 border-2 border-zinc-800">
              <h3 className="text-sm font-mono text-white/80 mb-3">Training Mode</h3>
              <div className="grid grid-cols-6 gap-2">
                {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter) => (
                  <Button
                    key={letter}
                    size="sm"
                    variant={currentLabel === letter ? "default" : "outline"}
                    onClick={() => handleTraining(letter)}
                    disabled={isTraining}
                  >
                    {letter}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Translation Display */}
        <div className="w-full h-full">
          <div className="h-full rounded-xl bg-zinc-900 border-4 border-zinc-800 shadow-[0_0_0_4px_rgba(255,255,255,0.1)] p-6">
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-2 h-2 rounded-full ${handDetected ? 'bg-green-500' : 'bg-yellow-500'}`} />
                <span className="text-sm text-white/80 font-mono">TRANSLATION</span>
              </div>

              {detection ? (
                <div className="flex-1 flex flex-col justify-center items-center">
                  <div className="text-6xl font-bold text-white mb-4">
                    {detection.gesture}
                  </div>
                  <div className="text-sm bg-white/10 px-3 py-1.5 rounded-full text-white/80">
                    {(detection.confidence * 100).toFixed(1)}% confident
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-white/50 font-mono">
                  {handDetected 
                    ? "Processing sign..." 
                    : "No hand detected. Please show your hand to the camera."}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 