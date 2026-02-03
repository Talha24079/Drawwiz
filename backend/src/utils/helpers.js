export function generateRoomCode(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function formatWordHint(word) {
  if (!word) return '';
  
  // Split by spaces to handle multi-word phrases
  const words = word.split(' ');
  
  if (words.length === 1) {
    // Single word - show as underscores with letter count
    const wordLength = word.length;
    return `${word.split('').map(() => '_').join(' ')} ${toSuperscript(wordLength)}`;
  } else {
    // Multiple words - show dashes with counts for each word
    return words.map(w => {
      const length = w.length;
      return `${'-'.repeat(length)} ${toSuperscript(length)}`;
    }).join(' ');
  }
}

export function formatWordHintWithHyphen(word) {
  // Handle compound words with hyphens like "minar-e-pakistan"
  if (word.includes('-')) {
    const parts = word.split('-');
    return parts.map(part => {
      const length = part.length;
      if (length === 1) {
        return `_ ${toSuperscript(length)} -`;
      }
      return `${part.split('').map(() => '_').join(' ')} ${toSuperscript(length)}`;
    }).join(' - ').replace(/- $/, '');
  }
  return formatWordHint(word);
}

function toSuperscript(num) {
  const superscripts = {
    '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
    '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹'
  };
  return num.toString().split('').map(d => superscripts[d]).join('');
}

export function calculateScore(timeRemaining, totalTime, position, penaltiesEnabled, wrongGuesses) {
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

export function calculateDrawerScore(guessersPoints) {
  return Math.round(guessersPoints * 0.25);
}
