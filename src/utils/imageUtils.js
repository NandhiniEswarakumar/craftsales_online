const API_BASE = process.env.REACT_APP_API_BASE_URL || 'https://craftsales-online.onrender.com';

export function resolveImageUrl(imgPath) {
  // No image -> use public fallback
  if (!imgPath) return `${process.env.PUBLIC_URL}/fallback.png`;

  // Imported module (webpack) -> use resolved default export
  if (typeof imgPath === 'object' && imgPath.default) return imgPath.default;

  // Already a processed URL (CRA static media, blob, data URI)
  if (typeof imgPath === 'string') {
    if (imgPath.includes('/static/media/') || imgPath.startsWith('blob:') || imgPath.startsWith('data:')) {
      return imgPath;
    }

    // Absolute URL
    if (imgPath.startsWith('http')) return imgPath;

    // Handle relative references to assets like '../assets/...' or './assets/...'
    const relAssets = imgPath.match(/(?:\.\.\/|\.\/)?assets\/(.+)/);
    if (relAssets) {
      return `${process.env.PUBLIC_URL}/assets/${relAssets[1]}`;
    }

    // Public assets with or without leading slash
    if (imgPath.startsWith('/assets/') || imgPath.startsWith('assets/')) {
      const clean = imgPath.replace(/^\/+/, '');
      return `${process.env.PUBLIC_URL}/${clean}`;
    }

    // Backend uploads (uploads/ or /uploads/)
    if (imgPath.startsWith('uploads/') || imgPath.startsWith('/uploads/')) {
      const clean = imgPath.startsWith('/') ? imgPath : `/${imgPath}`;
      return `${API_BASE}${clean}`;
    }

    // Leading slash of any other path -> treat as backend absolute path
    if (imgPath.startsWith('/')) return `${API_BASE}${imgPath}`;

    // Fallback: assume backend-relative filename/path
    return `${API_BASE}/${imgPath}`;
  }

  // Final fallback
  return `${process.env.PUBLIC_URL}/fallback.png`;
}

export default resolveImageUrl;