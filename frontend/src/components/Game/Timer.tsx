import React, { useState, useEffect } from 'react';

interface TimerProps {
  turnEndTime: number | null;
}

export function Timer({ turnEndTime }: TimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    if (!turnEndTime) {
      setTimeRemaining(0);
      return;
    }

    const interval = setInterval(() => {
      const remaining = Math.max(0, turnEndTime - Date.now());
      setTimeRemaining(Math.floor(remaining / 1000));

      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [turnEndTime]);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  const percentage = turnEndTime
    ? Math.max(0, ((turnEndTime - Date.now()) / (turnEndTime - (turnEndTime - (timeRemaining * 1000)))) * 100)
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="text-center mb-2">
        <p className="text-4xl font-bold text-gray-800">
          {minutes}:{seconds.toString().padStart(2, '0')}
        </p>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${
            timeRemaining > 10
              ? 'bg-green-500'
              : timeRemaining > 5
              ? 'bg-yellow-500'
              : 'bg-red-500'
          }`}
          style={{ width: `${(timeRemaining / 120) * 100}%` }}
        />
      </div>
    </div>
  );
}
