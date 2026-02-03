import React, { useState } from 'react';
import { validatePlayerName } from '../../utils/validation';

interface NameInputProps {
  onNameSet: (name: string) => void;
}

export function NameInput({ onNameSet }: NameInputProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validatePlayerName(name);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    onNameSet(name.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="mb-4">
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError(null);
          }}
          placeholder="Enter your name"
          className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          maxLength={20}
        />
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </div>
    </form>
  );
}
