import React, { useState, useCallback, useRef } from 'react';
import { generateImageFromText, editImageWithText } from '../services/geminiService';
import { fileToBase64 } from '../utils/fileUtils';
import Spinner from './Spinner';
import { SparklesIcon, UploadIcon, WandIcon } from './IconComponents';
import ImageHistory from './ImageHistory';

type Mode = 'generate' | 'edit';

const ImageGenerator: React.FC = () => {
  const [mode, setMode] = useState<Mode>('generate');
  const [prompt, setPrompt] = useState<string>('');
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<string>('1:1');
  const [history, setHistory] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setGeneratedImage(null);
      setError(null);
    }
  };
  
  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    setError(null);
    setGeneratedImage(null);
    setPrompt('');
    setUploadedImage(null);
    setUploadedImagePreview(null);
  }

  const handleSubmit = useCallback(async () => {
    if (!prompt || isLoading) return;
    if (mode === 'edit' && !uploadedImage) {
      setError('Please upload an image to edit.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    const finalPrompt = prompt;

    try {
      let result: string | null = null;
      if (mode === 'generate') {
        result = await generateImageFromText(finalPrompt, aspectRatio);
      } else if (mode === 'edit' && uploadedImage) {
        const { base64, mimeType } = await fileToBase64(uploadedImage);
        result = await editImageWithText(finalPrompt, base64, mimeType);
      }
      if (result) {
        setGeneratedImage(result);
        setHistory(prevHistory => [result, ...prevHistory].slice(0, 18)); // Keep history to a reasonable size
      }
    } catch (e: any) {
      console.error(e);
      setError(`An error occurred: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [prompt, mode, uploadedImage, isLoading, aspectRatio]);

  const handleHistorySelect = (imageUrl: string) => {
    setGeneratedImage(imageUrl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Control Panel */}
            <div className="bg-dark-card border border-dark-border rounded-xl p-6 shadow-2xl flex flex-col h-full transform transition-transform duration-500 hover:scale-[1.02] hover:shadow-brand-secondary/20">
                <div className="flex border-b border-dark-border mb-6">
                <button
                    onClick={() => handleModeChange('generate')}
                    className={`flex items-center justify-center gap-2 px-4 py-3 text-lg font-semibold transition-colors duration-300 w-1/2 rounded-t-lg ${mode === 'generate' ? 'text-brand-accent border-b-2 border-brand-accent' : 'text-medium-text hover:text-light-text'}`}
                >
                    <SparklesIcon /> Create
                </button>
                <button
                    onClick={() => handleModeChange('edit')}
                    className={`flex items-center justify-center gap-2 px-4 py-3 text-lg font-semibold transition-colors duration-300 w-1/2 rounded-t-lg ${mode === 'edit' ? 'text-brand-accent border-b-2 border-brand-accent' : 'text-medium-text hover:text-light-text'}`}
                >
                    <WandIcon /> Transform
                </button>
                </div>

                {mode === 'generate' && (
                    <div className="mb-6 text-center text-medium-text text-sm p-3 bg-dark-bg/50 rounded-lg border border-dark-border">
                        <p>Craft entirely new visuals from your imagination. Describe any scene, character, or concept, and watch it come to life.</p>
                    </div>
                )}
                {mode === 'edit' && (
                    <div className="mb-6 text-center text-medium-text text-sm p-3 bg-dark-bg/50 rounded-lg border border-dark-border">
                        <p>Transform existing images with precision. Upload a photo, then describe your desired changes—from outfits and backgrounds to specific features.</p>
                    </div>
                )}

                {mode === 'edit' && (
                <div className="mb-6">
                    <label className="block text-medium-text mb-2 font-semibold">1. Upload Image</label>
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="cursor-pointer border-2 border-dashed border-dark-border hover:border-brand-accent rounded-lg p-6 text-center transition-colors duration-300 aspect-video flex items-center justify-center"
                    >
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/png, image/jpeg"
                        className="hidden"
                    />
                    {uploadedImagePreview ? (
                        <img src={uploadedImagePreview} alt="Upload preview" className="max-h-full max-w-full object-contain rounded-md" />
                    ) : (
                        <div className="text-medium-text">
                        <UploadIcon className="mx-auto h-12 w-12" />
                        <p className="mt-2">Click to upload or drag & drop</p>
                        <p className="text-sm">PNG or JPG</p>
                        </div>
                    )}
                    </div>
                </div>
                )}
                
                {mode === 'generate' && (
                    <div className="mb-4">
                        <label htmlFor="aspectRatio" className="block text-medium-text mb-2 font-semibold">Aspect Ratio</label>
                        <select 
                            id="aspectRatio"
                            value={aspectRatio}
                            onChange={(e) => setAspectRatio(e.target.value)}
                            className="w-full bg-dark-bg border border-dark-border rounded-lg p-3 focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary outline-none transition-colors"
                        >
                            <option value="1:1">Square (1:1) - Instagram Post, Passport</option>
                            <option value="16:9">Landscape (16:9) - YouTube, Facebook Cover</option>
                            <option value="9:16">Portrait (9:16) - Instagram Story, TikTok</option>
                            <option value="4:3">Standard Photo (4:3)</option>
                            <option value="3:4">Tall Photo (3:4) - Pinterest</option>
                        </select>
                    </div>
                )}

                <div className="flex-grow flex flex-col">
                <label htmlFor="prompt" className="block text-medium-text mb-2 font-semibold">
                    {mode === 'edit' ? '2. Describe Your Transformation' : 'Describe Your Vision'}
                </label>
                <textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={
                    mode === 'generate' 
                        ? 'e.g., A cinematic photo of a futuristic royal guardian in white armor with glowing lines, city-at-night background...' 
                        : 'e.g., Change outfit to a futuristic white armor. Keep my face exactly the same.'
                    }
                    className="w-full flex-grow bg-dark-bg border border-dark-border rounded-lg p-3 text-light-text placeholder-gray-500 focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary outline-none transition-colors resize-none"
                    rows={mode === 'generate' ? 10 : 8}
                />
                </div>

                <button
                onClick={handleSubmit}
                disabled={isLoading || !prompt || (mode === 'edit' && !uploadedImage)}
                className="mt-6 w-full bg-brand-secondary hover:bg-brand-primary text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center text-lg shadow-lg disabled:shadow-none animate-pulse-glow disabled:animate-none"
                >
                {isLoading ? <Spinner /> : 'Generate'}
                </button>
            </div>

            {/* Output Panel */}
            <div className="bg-dark-card border border-dark-border rounded-xl p-6 shadow-2xl flex items-center justify-center aspect-square relative overflow-hidden transform transition-transform duration-500 hover:scale-[1.02] hover:shadow-brand-secondary/20">
                {isLoading && (
                <div className="z-20 text-center">
                    <Spinner large={true} />
                    <p className="mt-4 text-lg font-semibold text-medium-text">AIVerse is creating your vision...</p>
                </div>
                )}
                {error && !isLoading && (
                <div className="z-20 text-center text-red-400 bg-red-900/20 p-4 rounded-lg">
                    <h3 className="font-bold mb-2">Error</h3>
                    <p>{error}</p>
                </div>
                )}
                {!isLoading && !generatedImage && !error && (
                    <>
                    {mode === 'generate' ? (
                        <div className="text-center text-medium-text p-4 animate-[fadeIn_1s]">
                            <SparklesIcon className="w-16 h-16 mx-auto mb-4 text-brand-accent opacity-50" />
                            <h2 className="text-2xl font-bold text-light-text">Create From Imagination</h2>
                            <p className="mt-2 max-w-sm mx-auto">Use the panel on the left to describe a new image.</p>
                            <div className="text-sm mt-4 italic p-3 bg-dark-bg rounded-lg border border-dark-border max-w-sm mx-auto">
                                <strong className="not-italic">Example:</strong> "A knight in shimmering silver armor standing on a cliff overlooking a stormy sea, cinematic lighting."
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-medium-text p-4 animate-[fadeIn_1s]">
                            <WandIcon className="w-16 h-16 mx-auto mb-4 text-brand-accent opacity-50" />
                            <h2 className="text-2xl font-bold text-light-text">Transform Your Image</h2>
                            <p className="mt-2 max-w-sm mx-auto">Upload a photo and describe the changes you want to see.</p>
                            <div className="text-sm mt-4 italic p-3 bg-dark-bg rounded-lg border border-dark-border max-w-sm mx-auto">
                                <strong className="not-italic">Example:</strong> "Change the background to a futuristic cityscape at night. Make the jacket black leather."
                            </div>
                        </div>
                    )}
                    </>
                )}
                {generatedImage && (
                <img src={generatedImage} alt="Generated by AI" className="z-10 object-contain w-full h-full rounded-md transition-opacity duration-500 animate-[fadeIn_1s]" />
                )}
                <div className="absolute inset-0 bg-dark-bg [mask-image:radial-gradient(ellipse_at_center,transparent_40%,black)]"></div>
            </div>
        </div>
        <ImageHistory history={history} onSelect={handleHistorySelect} />
    </div>
  );
};

export default ImageGenerator;