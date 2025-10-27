
import React, { useCallback, useState } from 'react';
import { PhotoIcon } from './icons/PhotoIcon';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  imageDataUrl: string | null;
  onReset: () => void;
  isLoading: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, imageDataUrl, onReset, isLoading }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onImageUpload(event.target.files[0]);
    }
  };

  const handleDragEvents = useCallback((e: React.DragEvent<HTMLDivElement>, dragging: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(dragging);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    handleDragEvents(e, false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageUpload(e.dataTransfer.files[0]);
    }
  }, [handleDragEvents, onImageUpload]);

  const dropzoneClasses = `
    relative flex flex-col items-center justify-center w-full h-full p-6 border-2 border-dashed rounded-xl cursor-pointer 
    transition-colors duration-300 ease-in-out
    ${isDragging ? 'border-blue-400 bg-gray-700/50' : 'border-gray-600 hover:border-gray-500 bg-gray-800'}
  `;

  return (
    <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg h-full">
      {imageDataUrl ? (
        <div className="flex flex-col items-center space-y-4">
          <img src={imageDataUrl} alt="Preview" className="max-h-80 w-auto rounded-lg shadow-md" />
          <button
            onClick={onReset}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-red-500 disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : 'Upload Another Image'}
          </button>
        </div>
      ) : (
        <div 
          className={dropzoneClasses}
          onDragEnter={(e) => handleDragEvents(e, true)}
          onDragLeave={(e) => handleDragEvents(e, false)}
          onDragOver={(e) => handleDragEvents(e, true)}
          onDrop={handleDrop}
        >
          <input
            id="file-upload"
            type="file"
            className="sr-only"
            accept="image/png, image/jpeg, image/webp"
            onChange={handleFileChange}
            disabled={isLoading}
          />
          <label htmlFor="file-upload" className="flex flex-col items-center justify-center text-center cursor-pointer">
            <PhotoIcon className="w-12 h-12 text-gray-500 mb-3" />
            <p className="font-semibold text-gray-300">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-500">PNG, JPG or WEBP</p>
          </label>
        </div>
      )}
    </div>
  );
};
