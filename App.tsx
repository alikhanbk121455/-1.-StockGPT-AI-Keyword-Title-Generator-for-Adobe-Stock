
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ResultsDisplay } from './components/ResultsDisplay';
import { Loader } from './components/Loader';
import { generateTagsForImage } from './services/geminiService';
import type { AnalysisResult } from './types';
import { fileToBase64 } from './utils/fileUtils';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = useCallback(async (file: File) => {
    if (!file) return;

    // Reset state for new upload
    setImageFile(file);
    setAnalysisResult(null);
    setError(null);
    setIsLoading(true);

    try {
      const { base64, mimeType } = await fileToBase64(file);
      setImageDataUrl(`data:${mimeType};base64,${base64}`);

      const result = await generateTagsForImage(base64, mimeType);
      setAnalysisResult(result);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
      console.error('Analysis failed:', errorMessage);
      setError(`Failed to analyze the image. ${errorMessage}`);
      // Clear image preview on error to allow re-upload
      setImageDataUrl(null);
      setImageFile(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleReset = () => {
    setImageFile(null);
    setImageDataUrl(null);
    setAnalysisResult(null);
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold mb-4 text-blue-400">1. Upload Your Image</h2>
            <ImageUploader 
              onImageUpload={handleImageUpload} 
              imageDataUrl={imageDataUrl}
              onReset={handleReset}
              isLoading={isLoading} 
            />
          </div>

          <div className="flex flex-col">
            <h2 className="text-2xl font-bold mb-4 text-blue-400">2. Get Your Results</h2>
            <div className="bg-gray-800 rounded-xl shadow-lg p-6 min-h-[300px] flex flex-col justify-center items-center h-full">
              {isLoading && <Loader />}
              {!isLoading && error && (
                <div className="text-center text-red-400">
                  <p className="font-bold">Error</p>
                  <p>{error}</p>
                </div>
              )}
              {!isLoading && !error && analysisResult && (
                <ResultsDisplay result={analysisResult} />
              )}
              {!isLoading && !error && !analysisResult && (
                <div className="text-center text-gray-500">
                  <p>Your generated title, keywords, and categories will appear here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <footer className="text-center p-4 text-gray-500 text-sm">
        <p>Powered by Gemini API. Designed for Adobe Stock contributors.</p>
      </footer>
    </div>
  );
};

export default App;
