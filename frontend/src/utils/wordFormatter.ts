export function formatTimeRemaining(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function formatWordHint(word: string): string {
  if (!word) return '';
  
  const words = word.split(' ');
  
  if (words.length === 1) {
    const wordLength = word.length;
    return `${word.split('').map(() => '_').join(' ')} ${toSuperscript(wordLength)}`;
  } else {
    return words.map(w => {
      const length = w.length;
      return `${'-'.repeat(length)} ${toSuperscript(length)}`;
    }).join(' ');
  }
}

function toSuperscript(num: number): string {
  const superscripts: { [key: string]: string } = {
    '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
    '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹'
  };
  return num.toString().split('').map(d => superscripts[d]).join('');
}
