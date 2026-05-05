

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Theme } from '../App';
import { GoogleGenAI, Modality } from '@google/genai';
import { UploadIcon, CameraIcon, SparklesIcon, DownloadIcon, CloseIcon, ArrowPathIcon, PlusIcon, EraserIcon } from './icons/IconComponents';

interface HomeCanvasProps {
  theme: Theme;
}

type Step = 'selectScene' | 'selectTool' | 'selectObject' | 'placeObject' | 'maskObject' | 'viewResult';

// --- Helper Functions ---
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
};

const getEventPosition = (
  event: MouseEvent | TouchEvent,
  canvas: HTMLCanvasElement,
): { x: number; y: number } | null => {
  const rect = canvas.getBoundingClientRect();
  if (event instanceof MouseEvent) {
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }
  if (event instanceof TouchEvent && event.touches.length > 0) {
    return {
      x: event.touches[0].clientX - rect.left,
      y: event.touches[0].clientY - rect.top,
    };
  }
  return null;
};


// --- Child Components ---

const CameraModal: React.FC<{
  onClose: () => void;
  onCapture: (imageDataUrl: string) => void;
}> = ({ onClose, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        alert("Could not access the camera. Please ensure permissions are granted.");
        onClose();
      }
    };
    startCamera();

    return () => {
      streamRef.current?.getTracks().forEach(track => track.stop());
    };
  }, [onClose]);

  const handleCapture = () => {
    const video = videoRef.current;
    if (video) {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUrl = canvas.toDataURL('image/jpeg');
        onCapture(dataUrl);
        onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center animate-fade-in" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 max-w-2xl w-full" onClick={e => e.stopPropagation()}>
        <video ref={videoRef} autoPlay playsInline className="w-full rounded-md aspect-video object-cover"></video>
        <div className="flex justify-center mt-4">
          <button onClick={handleCapture} className="px-6 py-2 bg-eco-green-dark text-white font-bold rounded-full hover:bg-green-600 transition-colors flex items-center gap-2">
            <CameraIcon className="w-5 h-5"/> Capture
          </button>
        </div>
      </div>
    </div>
  );
};

const LoadingOverlay: React.FC<{ message: string }> = ({ message }) => (
    <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 flex flex-col items-center justify-center z-20 animate-fade-in">
        <svg className="animate-spin h-8 w-8 text-eco-green-dark mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">{message}</p>
    </div>
);


const HomeCanvas: React.FC<HomeCanvasProps> = () => {
    const [step, setStep] = useState<Step>('selectScene');
    const [sceneImage, setSceneImage] = useState<string | null>(null);
    const [objectImage, setObjectImage] = useState<string | null>(null);
    const [isolatedObject, setIsolatedObject] = useState<string | null>(null);
    const [finalImage, setFinalImage] = useState<string | null>(null);
    
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [error, setError] = useState<string | null>(null);

    const [showCamera, setShowCamera] = useState<boolean>(false);
    // FIX: Correctly type useRef to allow for an undefined initial value, which is the default when no argument is passed.
    const cameraCallback = useRef<((dataUrl: string) => void) | undefined>(undefined);
    const fileInputRef = useRef<HTMLInputElement>(null);
    // FIX: Correctly type useRef to allow for an undefined initial value. This resolves the "Expected 1 arguments, but got 0" error.
    const fileInputCallback = useRef<((dataUrl: string) => void) | undefined>(undefined);

    const imageRef = useRef<HTMLImageElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);


    const openCamera = (callback: (dataUrl: string) => void) => {
        cameraCallback.current = callback;
        setShowCamera(true);
    };

    const openFilePicker = (callback: (dataUrl: string) => void) => {
        fileInputCallback.current = callback;
        fileInputRef.current?.click();
    };

    const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && fileInputCallback.current) {
            const dataUrl = await fileToDataUrl(file);
            fileInputCallback.current(dataUrl);
        }
        // Reset file input to allow selecting the same file again
        e.target.value = '';
    };

    const handleReset = () => {
        setStep('selectScene');
        setSceneImage(null);
        setObjectImage(null);
        setIsolatedObject(null);
        setFinalImage(null);
        setError(null);
        setIsLoading(false);
    };

    const handleContinueEditing = () => {
        setSceneImage(finalImage);
        setObjectImage(null);
        setIsolatedObject(null);
        setFinalImage(null);
        setError(null);
        setStep('selectTool');
    }

    const ai = useMemo(() => new GoogleGenAI({ apiKey: process.env.API_KEY }), []);

    const isolateObject = useCallback(async (objectDataUrl: string) => {
        setObjectImage(objectDataUrl);
        setIsLoading(true);
        setLoadingMessage('AI is isolating your object...');
        setError(null);
        try {
            const objectBase64 = objectDataUrl.split(',')[1];
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: {
                    parts: [
                        { inlineData: { data: objectBase64, mimeType: 'image/jpeg' } },
                        { text: 'Isolate the main object from its background. Return the object on a transparent background as a PNG image.' }
                    ]
                },
                config: { responseModalities: [Modality.IMAGE, Modality.TEXT] }
            });

            const imagePart = response.candidates?.[0].content.parts.find(p => p.inlineData);
            if (imagePart?.inlineData) {
                const isolatedBase64 = imagePart.inlineData.data;
                setIsolatedObject(`data:image/png;base64,${isolatedBase64}`);
                setStep('placeObject');
            } else {
                throw new Error("AI could not isolate the object. Please try another image.");
            }
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : "An unknown error occurred during object isolation.");
            setStep('selectObject'); // Go back to allow retry
        } finally {
            setIsLoading(false);
        }
    }, [ai]);

    const generateScene = useCallback(async ({ clientX, clientY }: {clientX: number, clientY: number}, target: HTMLImageElement) => {
        if (!sceneImage || !isolatedObject) return;

        setIsLoading(true);
        setLoadingMessage('Creating composite image...');
        setError(null);

        try {
            const rect = target.getBoundingClientRect();
            const x = clientX - rect.left;
            const y = clientY - rect.top;

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error("Canvas context not available.");

            const sceneImg = new Image();
            sceneImg.src = sceneImage;
            await new Promise((res, rej) => { sceneImg.onload = res; sceneImg.onerror = rej; });
            
            const objectImg = new Image();
            objectImg.src = isolatedObject;
            await new Promise((res, rej) => { objectImg.onload = res; objectImg.onerror = rej; });

            canvas.width = sceneImg.width;
            canvas.height = sceneImg.height;

            const scaleFactor = 0.25;
            const objScaledWidth = canvas.width * scaleFactor;
            const objScaledHeight = (objectImg.height / objectImg.width) * objScaledWidth;
            const drawX = (x / rect.width) * canvas.width - (objScaledWidth / 2);
            const drawY = (y / rect.height) * canvas.height - (objScaledHeight / 2);

            ctx.drawImage(sceneImg, 0, 0);
            ctx.drawImage(objectImg, drawX, drawY, objScaledWidth, objScaledHeight);

            const compositeImageBase64 = canvas.toDataURL('image/png').split(',')[1];
            
            setLoadingMessage('AI is generating your scene...');
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: {
                    parts: [
                        { inlineData: { data: compositeImageBase64, mimeType: 'image/png' } },
                        { text: 'Make this look realistic. An object was just placed into the scene. Blend it seamlessly, correcting its scale, perspective, lighting, and shadows to make it look natural in the room.' }
                    ]
                },
                config: { responseModalities: [Modality.IMAGE, Modality.TEXT] }
            });
            
            const imagePart = response.candidates?.[0].content.parts.find(p => p.inlineData);
            if (imagePart?.inlineData) {
                setFinalImage(`data:image/png;base64,${imagePart.inlineData.data}`);
                setStep('viewResult');
            } else {
                 throw new Error("AI could not generate the scene. Please try again.");
            }

        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : "An unknown error occurred during scene generation.");
        } finally {
            setIsLoading(false);
        }
    }, [sceneImage, isolatedObject, ai]);

    const handleRemoveObject = useCallback(async () => {
        if (!sceneImage || !canvasRef.current) return;

        setIsLoading(true);
        setLoadingMessage('Preparing image for AI...');
        setError(null);

        try {
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            const sceneImg = new Image();
            sceneImg.src = sceneImage;
            await new Promise((res) => { sceneImg.onload = res; });

            tempCanvas.width = sceneImg.width;
            tempCanvas.height = sceneImg.height;

            if (!tempCtx) throw new Error("Could not get canvas context");

            tempCtx.drawImage(sceneImg, 0, 0);
            tempCtx.drawImage(canvasRef.current, 0, 0, sceneImg.width, sceneImg.height);
            
            const maskedImageBase64 = tempCanvas.toDataURL('image/jpeg').split(',')[1];

            setLoadingMessage('AI is removing the object...');

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: {
                    parts: [
                        { inlineData: { data: maskedImageBase64, mimeType: 'image/jpeg' } },
                        { text: `You are an expert photo editor. A user has drawn on an image to indicate an object to remove. Your task is to remove the object under the red drawing and intelligently fill the space with a realistic, context-aware background. Blend the new background seamlessly with the surrounding textures, lighting, and perspective. The final image should not contain any of the red drawing.` }
                    ]
                },
                config: { responseModalities: [Modality.IMAGE, Modality.TEXT] }
            });

            const imagePart = response.candidates?.[0].content.parts.find(p => p.inlineData);
            if (imagePart?.inlineData) {
                setFinalImage(`data:image/png;base64,${imagePart.inlineData.data}`);
                setStep('viewResult');
            } else {
                 throw new Error("AI could not remove the object. Please try again.");
            }
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : "An unknown error occurred during object removal.");
        } finally {
            setIsLoading(false);
        }
    }, [sceneImage, ai]);


    // --- Canvas Drawing Logic ---
    const handleImageLoad = useCallback(() => {
        const img = imageRef.current;
        const canvas = canvasRef.current;
        if (img && canvas) {
            canvas.width = img.clientWidth;
            canvas.height = img.clientHeight;
        }
    }, []);

    const startDrawing = useCallback((event: React.MouseEvent | React.TouchEvent) => {
        if (event.type.startsWith('touch')) {
            event.preventDefault();
        }
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        const pos = getEventPosition(event.nativeEvent, canvas);
        if (!pos) return;

        setIsDrawing(true);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
    }, []);

    const draw = useCallback((event: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        if (event.type.startsWith('touch')) {
            event.preventDefault();
        }
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const pos = getEventPosition(event.nativeEvent, canvas);
        if (!pos) return;

        ctx.lineTo(pos.x, pos.y);
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)';
        ctx.lineWidth = 20;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
    }, [isDrawing]);

    const stopDrawing = useCallback((event: React.MouseEvent | React.TouchEvent) => {
        if (event.type.startsWith('touch')) {
            event.preventDefault();
        }
        setIsDrawing(false);
    }, []);

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
    };

    const renderStep = () => {
        switch (step) {
            case 'selectScene':
                return (
                    <div className="text-center">
                        <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100">Step 1: Provide Your Room</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">Upload or take a picture of the room you want to decorate.</p>
                        <div className="flex justify-center gap-4">
                            <button onClick={() => openFilePicker(dataUrl => { setSceneImage(dataUrl); setStep('selectTool'); })} className="px-6 py-3 bg-eco-green-dark text-white font-bold rounded-full hover:bg-green-600 transition-colors flex items-center gap-2"><UploadIcon className="w-5 h-5"/> Upload Photo</button>
                            <button onClick={() => openCamera(dataUrl => { setSceneImage(dataUrl); setStep('selectTool'); })} className="px-6 py-3 bg-sky-blue-dark text-white font-bold rounded-full hover:bg-sky-blue-dark/80 transition-colors flex items-center gap-2"><CameraIcon className="w-5 h-5"/> Use Camera</button>
                        </div>
                    </div>
                );
            case 'selectTool':
                return (
                    <div className="text-center">
                        <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100">Step 2: What would you like to do?</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">Choose to add a new object to your room or remove an existing one.</p>
                        <img src={sceneImage!} alt="Room Scene" className="w-full max-w-lg mx-auto rounded-lg shadow-md mb-6" />
                        <div className="flex justify-center gap-4">
                            <button onClick={() => setStep('selectObject')} className="px-6 py-3 bg-eco-green-dark text-white font-bold rounded-full hover:bg-green-600 transition-colors flex items-center gap-2"><PlusIcon className="w-5 h-5"/> Add Object</button>
                            <button onClick={() => setStep('maskObject')} className="px-6 py-3 bg-red-500 text-white font-bold rounded-full hover:bg-red-600 transition-colors flex items-center gap-2"><EraserIcon className="w-5 h-5"/> Remove Object</button>
                        </div>
                    </div>
                );
            case 'selectObject':
                return (
                    <div className="text-center">
                        <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100">Step 3: Choose an Object</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">Now, provide a picture of the object you want to place in the scene.</p>
                        <img src={sceneImage!} alt="Room Scene" className="w-full max-w-lg mx-auto rounded-lg shadow-md mb-6" />
                        <div className="flex justify-center gap-4">
                             <button onClick={() => openFilePicker(isolateObject)} className="px-6 py-3 bg-eco-green-dark text-white font-bold rounded-full hover:bg-green-600 transition-colors flex items-center gap-2"><UploadIcon className="w-5 h-5"/> Upload Object</button>
                            <button onClick={() => openCamera(isolateObject)} className="px-6 py-3 bg-sky-blue-dark text-white font-bold rounded-full hover:bg-sky-blue-dark/80 transition-colors flex items-center gap-2"><CameraIcon className="w-5 h-5"/> Capture Object</button>
                        </div>
                         {error && <p className="text-red-500 mt-4">{error}</p>}
                    </div>
                );
            case 'maskObject':
                return (
                    <div className="text-center w-full">
                        <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100">Step 3: Mark for Removal</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">Draw over the object you want to remove. The AI will then erase it and regenerate the background.</p>
                        <div className="relative w-full max-w-lg mx-auto" style={{ touchAction: 'none' }}>
                            <img ref={imageRef} src={sceneImage!} alt="Room Scene" className="w-full rounded-lg shadow-md pointer-events-none" onLoad={handleImageLoad} />
                            <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full cursor-crosshair rounded-lg" 
                                onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing}
                                onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={stopDrawing} />
                        </div>
                        <div className="flex justify-center gap-4 mt-4">
                            <button onClick={handleRemoveObject} className="px-6 py-3 bg-eco-green-dark text-white font-bold rounded-full hover:bg-green-600 transition-colors flex items-center gap-2"><SparklesIcon className="w-5 h-5"/> Remove Object</button>
                            <button onClick={clearCanvas} className="px-6 py-3 bg-gray-500 text-white font-bold rounded-full hover:bg-gray-600 transition-colors flex items-center gap-2"><CloseIcon className="w-5 h-5"/> Clear Mask</button>
                        </div>
                        {error && <p className="text-red-500 mt-4">{error}</p>}
                    </div>
                );
            case 'placeObject':
                return (
                     <div className="text-center">
                        <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100">Step 4: Place Your Object</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">Tap on the image where you'd like to place the object.</p>
                        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                            <img 
                                src={sceneImage!} 
                                alt="Room Scene" 
                                className="w-full max-w-lg rounded-lg shadow-md cursor-pointer"
                                onClick={(e) => generateScene(e, e.currentTarget)}
                            />
                            <div className="flex-shrink-0 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                <p className="text-sm font-semibold mb-2 dark:text-gray-200">Your Object:</p>
                                <img src={isolatedObject!} alt="Isolated Object" className="w-24 h-24 object-contain"/>
                            </div>
                        </div>
                    </div>
                );
            case 'viewResult':
                 return (
                     <div className="text-center">
                        <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100">Here's Your Vision!</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">The AI has generated your scene. You can now download it, continue editing, or start over.</p>
                        <img src={finalImage!} alt="Generated Scene" className="w-full max-w-2xl mx-auto rounded-lg shadow-lg mb-6"/>
                        <div className="flex flex-wrap justify-center gap-4">
                           <a href={finalImage!} download="renova-scene.png" className="px-6 py-3 bg-gray-600 text-white font-bold rounded-full hover:bg-gray-700 transition-colors flex items-center gap-2"><DownloadIcon className="w-5 h-5"/> Download</a>
                           <button onClick={handleContinueEditing} className="px-6 py-3 bg-sky-blue-dark text-white font-bold rounded-full hover:bg-sky-blue-dark/80 transition-colors flex items-center gap-2"><SparklesIcon className="w-5 h-5"/> Continue Editing</button>
                           <button onClick={handleReset} className="px-6 py-3 bg-red-500 text-white font-bold rounded-full hover:bg-red-600 transition-colors flex items-center gap-2"><ArrowPathIcon className="w-5 h-5"/> Start Over</button>
                        </div>
                    </div>
                );
        }
    };

  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold mb-2 text-center dark:text-gray-100">AI Home Visualizer</h2>
      <p className="text-center text-gray-500 dark:text-gray-400 mb-6 max-w-2xl mx-auto">Bring your ideas to life. Use AI to realistically place furniture and decor in your room before you commit.</p>

      <div className="relative bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl min-h-[400px] flex items-center justify-center">
        {isLoading && <LoadingOverlay message={loadingMessage} />}
        {renderStep()}
      </div>

      <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileSelected} className="hidden" />
      {showCamera && <CameraModal onClose={() => setShowCamera(false)} onCapture={(dataUrl) => cameraCallback.current?.(dataUrl)} />}
    </div>
  );
};

export default HomeCanvas;