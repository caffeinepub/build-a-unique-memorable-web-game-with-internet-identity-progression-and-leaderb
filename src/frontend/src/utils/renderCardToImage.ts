export async function renderCardToImage(element: HTMLElement): Promise<Blob> {
  // Create a canvas with the element's dimensions
  const canvas = document.createElement('canvas');
  const rect = element.getBoundingClientRect();
  canvas.width = rect.width * 2; // 2x for better quality
  canvas.height = rect.height * 2;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  ctx.scale(2, 2);

  // Get computed styles
  const styles = window.getComputedStyle(element);
  ctx.fillStyle = styles.backgroundColor || '#000';
  ctx.fillRect(0, 0, rect.width, rect.height);

  // Draw text content
  ctx.fillStyle = styles.color || '#fff';
  ctx.font = `${styles.fontSize} ${styles.fontFamily}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const text = element.textContent || '';
  const lines = text.split('\n');
  const lineHeight = parseInt(styles.fontSize || '16') * 1.5;
  const startY = rect.height / 2 - (lines.length * lineHeight) / 2;

  lines.forEach((line, i) => {
    ctx.fillText(line.trim(), rect.width / 2, startY + i * lineHeight);
  });

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Failed to create blob'));
      }
    }, 'image/png');
  });
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
