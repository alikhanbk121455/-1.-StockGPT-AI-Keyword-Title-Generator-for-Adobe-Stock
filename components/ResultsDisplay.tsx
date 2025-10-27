
import React from 'react';
import type { AnalysisResult } from '../types';
import { KeywordChip } from './KeywordChip';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import { ClipboardIcon } from './icons/ClipboardIcon';

interface ResultsDisplayProps {
  result: AnalysisResult;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result }) => {
  const [copiedText, copy] = useCopyToClipboard();

  const handleCopy = (text: string) => {
    copy(text);
  };

  const allKeywords = result.keywords.join(', ');

  return (
    <div className="w-full space-y-6 animate-fade-in">
      {/* Title Section */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-blue-300">Generated Title</h3>
          <button
            onClick={() => handleCopy(result.title)}
            className="flex items-center text-xs text-gray-400 hover:text-white transition-colors"
            title="Copy title"
          >
            <ClipboardIcon className="w-4 h-4 mr-1" />
            {copiedText === result.title ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <p className="p-3 bg-gray-900 rounded-md text-gray-200">{result.title}</p>
      </div>

      {/* Keywords Section */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-blue-300">Keywords ({result.keywords.length})</h3>
           <button
            onClick={() => handleCopy(allKeywords)}
            className="flex items-center text-xs text-gray-400 hover:text-white transition-colors"
            title="Copy all keywords"
          >
            <ClipboardIcon className="w-4 h-4 mr-1" />
            {copiedText === allKeywords ? 'Copied!' : 'Copy All'}
          </button>
        </div>
        <div className="flex flex-wrap gap-2 p-3 bg-gray-900 rounded-md">
          {result.keywords.map((keyword, index) => (
            <KeywordChip key={index} keyword={keyword} onCopy={handleCopy} isCopied={copiedText === keyword} />
          ))}
        </div>
      </div>

      {/* Categories Section */}
      <div>
        <h3 className="text-lg font-semibold text-blue-300 mb-2">Suggested Categories</h3>
        <ul className="list-disc list-inside space-y-1 p-3 bg-gray-900 rounded-md text-gray-200">
          {result.categories.map((category, index) => (
            <li key={index}>{category}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
