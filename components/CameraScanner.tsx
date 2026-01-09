
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { scanPokemonCard } from '../services/geminiService';
import { PokemonCard } from '../types';

interface CameraScannerProps {
  onCardScanned: (card: PokemonCard) => void;
}

const CameraScanner: React.FC<CameraScannerProps> = ({ onCardScanned }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
        setError(null);
      }
    } catch (err) {
      setError('Could not access camera. Please check permissions.');
      console.error(err);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setCameraActive(false);
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  const captureAndScan = async () => {
    if (!videoRef.current || !canvasRef.current || isScanning) return;

    setIsScanning(true);
    setError(null);

    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const base64Data = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
      const imageUrl = canvas.toDataURL('image/jpeg', 0.8);

      try {
        const cardData = await scanPokemonCard(base64Data);
        if (cardData.name) {
          onCardScanned({ ...cardData as PokemonCard, imageUrl });
        } else {
          setError("Couldn't identify card clearly. Try again with better lighting.");
        }
      } catch (err) {
        setError('Scanning failed. Please try again.');
        console.error(err);
      } finally {
        setIsScanning(false);
      }
    }
  };

  return (
    <div className="flex flex-col items-center p-4 max-w-lg mx-auto w-full">
      <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl bg-black mb-6">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className="w-full h-full object-cover"
        />
        
        {/* Card Overlay Guide */}
        <div className="absolute inset-0 border-2 border-white/30 pointer-events-none flex items-center justify-center">
            <div className="w-[85%] h-[85%] border-2 border-dashed border-yellow-400 rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.5)] flex items-center justify-center">
                <div className="text-white/50 text-xs font-bold uppercase tracking-widest text-center">
                  Position Card within Frame
                </div>
            </div>
        </div>

        {isScanning && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-10">
            <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-yellow-400 font-bold font-exo animate-pulse">ANALYZING CARD DATA...</p>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg text-sm font-medium w-full text-center">
          {error}
        </div>
      )}

      <button
        onClick={captureAndScan}
        disabled={isScanning || !cameraActive}
        className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-lg ${
          isScanning ? 'bg-gray-400 cursor-not-allowed scale-90' : 'bg-red-600 hover:bg-red-700 active:scale-95'
        }`}
      >
        <div className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white opacity-80" />
        </div>
      </button>
      
      <p className="mt-4 text-gray-500 text-sm font-medium">Tap to Scan Pokemon Card</p>
    </div>
  );
};

export default CameraScanner;
