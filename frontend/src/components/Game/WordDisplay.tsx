import React from 'react';

interface WordDisplayProps {
  wordHint: string | null;
  isDrawing: boolean;
  currentWord?: string;
}

export function WordDisplay({ wordHint, isDrawing, currentWord }: WordDisplayProps) {
  if (isDrawing && currentWord) {
    return (
      <div className="bg-green-600 text-white rounded-lg p-4 text-center shadow-lg">
        <p className="text-sm font-semibold mb-1">You are drawing:</p>
        <p className="text-3xl font-bold">{currentWord}</p>
      </div>
    );
  }

  if (wordHint) {
    return (
      <div className="bg-blue-600 text-white rounded-lg p-4 text-center shadow-lg">
        <p className="text-sm font-semibold mb-1">Guess the word:</p>
        <p className="text-3xl font-bold font-mono tracking-wider">{wordHint}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-600 text-white rounded-lg p-4 text-center shadow-lg">
      <p className="text-lg">Waiting for word selection...</p>
    </div>
  );
}
