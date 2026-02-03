import React from 'react';
import { Modal } from '../Common/Modal';
import { Button } from '../Common/Button';

interface WordSelectionProps {
  words: string[];
  onSelectWord: (word: string) => void;
}

export function WordSelection({ words, onSelectWord }: WordSelectionProps) {
  return (
    <Modal isOpen={true} onClose={() => {}} title="Choose a word to draw">
      <div className="space-y-3">
        {words.map((word, idx) => (
          <Button
            key={idx}
            onClick={() => onSelectWord(word)}
            className="w-full text-xl py-4"
          >
            {word}
          </Button>
        ))}
      </div>
    </Modal>
  );
}
