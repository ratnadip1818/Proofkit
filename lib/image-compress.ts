/**
 * Compresses and resizes an avatar image client-side using a canvas element.
 * - Dimensions: 150x150 pixels (center-cropped)
 * - Output format: WebP
 * - Quality: 0.75 (highly optimized, keeping file size well under 15KB)
 */
export async function compressAvatar(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      if (!ctx) {
        reject(new Error("Could not get 2d context for image compression"));
        return;
      }

      const targetSize = 150;
      canvas.width = targetSize;
      canvas.height = targetSize;

      // Calculate scale and positions for center-cropping
      const scale = Math.max(targetSize / img.width, targetSize / img.height);
      const drawWidth = img.width * scale;
      const drawHeight = img.height * scale;
      const dx = (targetSize - drawWidth) / 2;
      const dy = (targetSize - drawHeight) / 2;

      // Draw image onto canvas with high quality smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, dx, dy, drawWidth, drawHeight);

      // Export canvas to WebP blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Canvas export returned empty blob"));
          }
        },
        "image/webp",
        0.75 // 0.75 quality ensures standard 150x150 avatars are ~3KB to 10KB (well below 15KB)
      );
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(img.src);
      reject(err);
    };
  });
}
