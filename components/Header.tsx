
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm p-4 text-center border-b border-gray-700 sticky top-0 z-10">
      <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
        StockGPT
      </h1>
      <p className="text-gray-400 mt-1">AI Keyword & Title Generator for Adobe Stock</p>
    </header>
  );
};
