const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5001';

export function resolveImageUrl(imgPath) {
  if (!imgPath) return `${process.env.PUBLIC_URL}/fallback.png`;

  // Handle imported ES6 modules (webpack-processed images)
  if (typeof imgPath === 'object' && imgPath.default) {
    return imgPath.default;
  }

  // If it's already a processed image URL (contains /static/media/ or similar)
  if (typeof imgPath === 'string' && (imgPath.includes('/static/media/') || imgPath.includes('blob:'))) {
    return imgPath;
  }

  // Absolute web URL
  if (typeof imgPath === 'string' && imgPath.startsWith('http')) return imgPath;

  // Public assets served from /assets/... (moved to public/assets)
  if (typeof imgPath === 'string' && (imgPath.startsWith('assets/') || imgPath.startsWith('/assets/'))) {
    // ensure leading slash removed for PUBLIC_URL concat
    const clean = imgPath.startsWith('/') ? imgPath.slice(1) : imgPath;
    return `${process.env.PUBLIC_URL}/${clean}`;
  }

  // Backend-uploaded path (e.g. "/uploads/...")
  // If path already starts with /uploads or similar, prefix backend host
  if (typeof imgPath === 'string' && imgPath.startsWith('/')) {
    return `${API_BASE}${imgPath}`;
  }

  // fallback: assume backend relative path
  return `${API_BASE}/${imgPath}`;
}

export default resolveImageUrl;