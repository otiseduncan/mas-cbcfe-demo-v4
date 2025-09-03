export async function readAndCompressImage(file: File, maxDim = 1600, quality = 0.8): Promise<{ dataUrl: string; type: string; name: string; }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;
        const scale = Math.min(1, maxDim / Math.max(width, height));
        width = Math.floor(width * scale);
        height = Math.floor(height * scale);
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) { resolve({ dataUrl: reader.result as string, type: file.type || "image/jpeg", name: file.name }); return; }
        ctx.drawImage(img, 0, 0, width, height);
        const mime = (file.type && file.type.startsWith("image/")) ? file.type : "image/jpeg";
        const dataUrl = canvas.toDataURL(mime, quality);
        resolve({ dataUrl, type: mime, name: file.name });
      };
      img.onerror = () => { resolve({ dataUrl: reader.result as string, type: file.type || "image/jpeg", name: file.name }); };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
