
import React from 'react';

interface KeywordChipProps {
  keyword: string;
  onCopy: (text: string) => void;
  isCopied: boolean;
}

export const KeywordChip: React.FC<KeywordChipProps> = ({ keyword, onCopy, isCopied }) => {
  return (
    <button
      onClick={() => onCopy(keyword)}
      title={`Copy "${keyword}"`}
      className={`px-3 py-1 text-sm font-medium rounded-full transition-all duration-200 ease-in-out transform hover:scale-105
      ${isCopied ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}
      `}
    >
      {isCopied ? 'Copied!' : keyword}
    </button>
  );
};
