import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import { loadModels } from "../utils/loadModel";
import type { MobileNet } from '@tensorflow-models/mobilenet';
import type { HandPose } from '@tensorflow-models/handpose';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';

interface Prediction {
    sign: string;
    confidence: number;
    timestamp: number;
}

const CONFIDENCE_THRESHOLD = 0.70; // 70% confidence threshold
const MAX_HISTORY = 10; // Keep last 10 predictions

export function SignTranslator({ onPrediction }: { onPrediction?: (text: string) => void }) {
    const webcamRef = useRef<Webcam>(null);
    const [model, setModel] = useState<MobileNet | null>(null);
    const [handModel, setHandModel] = useState<HandPose | null>(null);
    const [prediction, setPrediction] = useState("");
    const [predictions, setPredictions] = useState<Prediction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCapturing, setIsCapturing] = useState(false);
    const requestRef = useRef<number>();
    const lastPredictionRef = useRef<string>("");
    const [debugInfo, setDebugInfo] = useState<string>("");
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const load = async () => {
            try {
                await tf.setBackend('webgl');
                await tf.ready();
                const { model, handModel } = await loadModels();
                setModel(model);
                setHandModel(handModel);
                setIsLoading(false);
            } catch (error) {
                console.error('Error initializing:', error);
            }
        };
        load();

        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, []);

    const addPrediction = (sign: string, confidence: number) => {
        setPredictions(prev => {
            const newPredictions = [
                { sign, confidence, timestamp: Date.now() },
                ...prev
            ].slice(0, MAX_HISTORY);
            
            // Notify parent component if provided
            if (onPrediction) {
                onPrediction(newPredictions.map(p => p.sign).join(' '));
            }
            
            return newPredictions;
        });
    };

    const drawHand = (landmarks: number[][]) => {
        const canvas = canvasRef.current;
        const video = webcamRef.current?.video;
        if (!canvas || !video) return;

        // Match canvas size to video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Scale landmarks to match canvas size
        const scaledLandmarks = landmarks.map(point => [
            point[0] * (canvas.width / video.videoWidth),
            point[1] * (canvas.height / video.videoHeight)
        ]);

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw hand guide when no hand detected
        if (landmarks.length === 0) {
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.lineWidth = 2;
            ctx.rect(
                canvas.width * 0.25,
                canvas.height * 0.25,
                canvas.width * 0.5,
                canvas.height * 0.5
            );
            ctx.stroke();
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.fill();
            return;
        }

        // Draw landmarks
        scaledLandmarks.forEach((point) => {
            ctx.beginPath();
            ctx.arc(point[0], point[1], 8, 0, 2 * Math.PI);
            ctx.fillStyle = 'rgba(255, 0, 0, 0.7)';
            ctx.fill();
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.stroke();
        });

        // Draw connections
        ctx.beginPath();
        ctx.moveTo(scaledLandmarks[0][0], scaledLandmarks[0][1]);
        scaledLandmarks.forEach((point) => {
            ctx.lineTo(point[0], point[1]);
        });
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 3;
        ctx.stroke();
    };

    const detectSign = async () => {
        if (!model || !handModel || !webcamRef.current?.video) return;

        try {
            setDebugInfo("Detecting hands...");
            const hands = await handModel.estimateHands(webcamRef.current.video);
            setDebugInfo(`Found ${hands.length} hands`);

            // Always draw - either hand landmarks or guide
            drawHand(hands.length > 0 ? hands[0].landmarks : []);

            if (hands.length > 0) {
                const predictions = await model.classify(webcamRef.current.video);
                const topPrediction = predictions[0];

                if (topPrediction.probability > CONFIDENCE_THRESHOLD) {
                    const signText = topPrediction.className.split(',')[0];
                    setPrediction(`Detected: ${signText} (${(topPrediction.probability * 100).toFixed(1)}%)`);
                    addPrediction(signText, topPrediction.probability);
                }
            } else {
                setPrediction("Position your hand in the guide box");
            }
        } catch (error: unknown) {
            console.error('Detection error:', error);
            setDebugInfo(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }

        if (isCapturing) {
            requestRef.current = requestAnimationFrame(detectSign);
        }
    };

    const toggleCapture = () => {
        setIsCapturing(prev => !prev);
        if (!isCapturing) {
            detectSign();
        }
    };

    return (
        <div className="relative rounded-xl overflow-hidden bg-black border-4 border-zinc-800 shadow-[0_0_0_4px_rgba(255,255,255,0.1)]">
            <Webcam
                ref={webcamRef}
                className="w-full aspect-[4/3] object-cover"
                mirrored
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={{
                    width: 640,  // Reduced for better performance
                    height: 480,
                    facingMode: "user",
                }}
            />
            
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
            />

            {/* Debug info */}
            <div className="absolute top-12 left-4 text-xs text-white/60 font-mono bg-black/50 px-2 py-1 rounded">
                {debugInfo}
            </div>

            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="text-white font-medium animate-pulse">
                        Loading models...
                    </div>
                </div>
            )}

            {/* Camera UI Overlay */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isCapturing ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
                <span className="text-xs text-white/80 font-mono">
                    {isCapturing ? 'CAPTURING' : 'READY'}
                </span>
            </div>

            {/* Prediction Display */}
            <div className="absolute top-4 right-4">
                <div className="text-sm text-white/80 font-mono bg-black/50 px-3 py-1.5 rounded-full">
                    {prediction || "Waiting..."}
                </div>
            </div>

            {/* Prediction History */}
            <div className="absolute bottom-20 left-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-2 max-h-32 overflow-y-auto">
                {predictions.map((pred, index) => (
                    <div key={pred.timestamp} className="text-sm text-white/80 font-mono flex justify-between items-center">
                        <span>{pred.sign}</span>
                        <span className="text-xs opacity-50">
                            {(pred.confidence * 100).toFixed(0)}%
                        </span>
                    </div>
                ))}
            </div>

            {/* Controls */}
            <div className="absolute bottom-4 left-4 right-4">
                <button 
                    onClick={toggleCapture}
                    className={`w-full ${
                        isCapturing 
                            ? 'bg-red-500/50 hover:bg-red-500/70' 
                            : 'bg-white/10 hover:bg-white/20'
                    } text-white font-medium py-2 rounded-lg backdrop-blur-sm`}
                >
                    {isCapturing ? 'Stop Capture' : 'Start Capture'}
                </button>
            </div>
        </div>
    );
}