export function calculateScore(
  timeRemaining: number,
  totalTime: number,
  position: number,
  penaltiesEnabled: boolean,
  wrongGuesses: number
): number {
  const basePoints = 200 * (timeRemaining / totalTime);
  
  let positionBonus = 0;
  if (position === 1) positionBonus = 40;
  else if (position === 2) positionBonus = 20;
  else if (position === 3) positionBonus = 10;
  
  let penalty = 0;
  if (penaltiesEnabled) {
    penalty = wrongGuesses * 5;
  }
  
  return Math.max(0, Math.round(basePoints + positionBonus - penalty));
}

export function calculateDrawerScore(guessersPoints: number): number {
  return Math.round(guessersPoints * 0.25);
}
