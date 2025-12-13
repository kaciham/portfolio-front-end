// utils/imageHelpers.js

/**
 * Generates a fallback image URL based on skill name
 * @param {string} skillName - The name of the skill
 * @returns {string} - Fallback image URL or data URI
 */
export const getSkillFallbackImage = (skillName) => {
  const skillLower = skillName?.toLowerCase() || '';
  
  // Common skill icons mapping
  const skillIcons = {
    'javascript': 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI0YxREMzNSIgZD0iTTMgM2gxOHYxOEgzVjN6bTQuNzMgMTIuMTNjMCAxLjMuNyAyLjMgMi4wNCAyLjMuODQgMCAxLjU3LS4zNiAyLjMtMS4wOHYtMy4zMWgtMi44OFY5Ljc3aDQuNzN2NS45MmMtMS4wOCAxLjItMi42IDEuOTMtNC4zNSAxLjkzLTIuNDcgMC00LjM3LTEuMjYtNC4zNy0zLjczIDAtMi43NCAxLjkzLTQuMyA0LjQzLTQuMyAxLjI2IDAgMi4zNC4zIDMuMTcuOGwuNi0xLjVjLS45LS42LTIuMTYtMS0zLjgtMS0zLjEzIDAtNS42MiAyLjA0LTUuNjIgNS43NHptMTAuNTQtLjQyYzAgMS4zNi43OCAyLjMgMi4yOCAyLjMuOTYgMCAxLjY4LS40MiAyLjM0LTEuMnYtMy4xNGgtMi45OFY5LjU0aDQuOXY2LjI0Yy0xLjE0IDEuMi0yLjc2IDEuOTMtNC42IDEuOTMtMi42OCAwLTQuNzQtMS4zMi00Ljc0LTMuODVWOS43aDEuOHYzLjAxeiIvPjwvc3ZnPg==',
    'react': 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMiIgZmlsbD0iIzYxREFGQiIvPjxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzYxREFGQiIgc3Ryb2tlLXdpZHRoPSIyIiBkPSJNMTIgMmM1LjUyMyAwIDEwIDQuNDc3IDEwIDEwcy00LjQ3NyAxMC0xMCAxMFMyIDEwIDEyIDEwWiIvPjxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzYxREFGQiIgc3Ryb2tlLXdpZHRoPSIyIiBkPSJNMTIgOWMxLjY1NyAwIDMgMS4zNDMgMyAzcy0xLjM0MyAzLTMgM1oiLz48L3N2Zz4=',
    'node': 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iIzMzOTkzMyIgZD0iTTEyIDJsMTAgNS41djExTDEyIDI0bC0xMC02VjYuNUwxMiAyeiIvPjwvc3ZnPg==',
    'python': 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iIzMwNzZCNyIgZD0iTTEyIDJjLTUuNTIgMC0xMCA0LjQ4LTEwIDEwczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bS0yIDEySDh2LTRoMnY0em00IDBoLTJ2LTRoMnY0eiIvPjwvc3ZnPg==',
    'html': 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI0UzNEYyNiIgZD0iTTMgMmgxOGwxLjYzNiAxNy43ODRMMTIgMjQgMi4zNjQgMTkuNzg0TDQgMmgxNXptLTEgM2wxLjUgMTVMMTIgMjIgMy41IDIwTDMgNXptNCA5aDRWMTBoNHYySDl2MnptMCA0aDRWMTVoNHYySDl2MnoiLz48L3N2Zz4=',
    'css': 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iIzE1NzJCNiIgZD0iTTMgMmgxOGwxLjYzNiAxNy43ODRMMTIgMjQgMi4zNjQgMTkuNzg0TDQgMmgxNXptLTEgM2wxLjUgMTVMMTIgMjIgMy41IDIwTDMgNXptNCA5aDRWMTBoNHYySDl2MnptMCA0aDRWMTVoNHYySDl2MnoiLz48L3N2Zz4=',
    'typescript': 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iIzMwNzhCNCIgZD0iTTMgM2gxOHYxOEgzVjN6Ii8+PHBhdGggZmlsbD0iI0ZGRiIgZD0iTTEzLjUgMTJWOWgzdjEwSDEzLjV2LTEuNWgxdjFoLTF2LTFoMVYxMkg5LjV2MTBoLTFWOUg5djEwSDEzLjVWMTJ6Ii8+PC9zdmc+',
  };

  // Check if we have a specific icon for this skill
  for (const [skill, icon] of Object.entries(skillIcons)) {
    if (skillLower.includes(skill)) {
      return icon;
    }
  }

  // Generic code icon as fallback
  return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iIzY2NjY2NiIgZD0iTTEwIDJjLjU1IDAgMSAuNDUgMSAxdjE4YzAgLjU1LS40NSAxLTEgMUg0Yy0uNTUgMC0xLS40NS0xLTFWM2MwLS41NS40NS0xIDEtMWg2em0xMCAwYy41NSAwIDEgLjQ1IDEgMXYxOGMwIC41NS0uNDUgMS0xIDFoLTZjLS41NSAwLTEtLjQ1LTEtMVYzYzAtLjU1LjQ1LTEgMS0xaDZ6bS0xNCAzdjJoNFY1SDZ6bTEwIDBoNHYyaC00VjV6bS0xMCA2djJoNHYtMkg2em0xMCAwdjJoNHYtMmgtNHptLTEwIDR2Mmg0di0ySDZ6bTEwIDBoNHYyaC00di0yeiIvPjwvc3ZnPg==';
};

/**
 * Validates if an image URL is accessible
 * @param {string} imageUrl - The image URL to validate
 * @returns {Promise<boolean>} - Promise resolving to true if image is accessible
 */
export const validateImageUrl = (imageUrl) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = imageUrl;
  });
};

/**
 * Gets optimized image URL with proper sizing and format
 * @param {string} baseUrl - The base API URL
 * @param {string} imagePath - The image path
 * @param {Object} options - Options for image optimization
 * @returns {string} - Optimized image URL
 */
export const getOptimizedImageUrl = (baseUrl, imagePath, options = {}) => {
  if (!imagePath) return null;

  const { width, height, format = 'webp', quality = 80 } = options;

  // If the imagePath is already a full URL, return as is
  if (imagePath.startsWith('http') || imagePath.startsWith('data:')) {
    return imagePath;
  }

  // Ensure baseUrl doesn't end with slash and imagePath starts with slash
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const cleanImagePath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;

  let url = `${cleanBaseUrl}${cleanImagePath}`;

  // Add optimization parameters if supported by your backend
  const params = new URLSearchParams();
  if (width) params.append('w', width);
  if (height) params.append('h', height);
  if (format) params.append('f', format);
  if (quality) params.append('q', quality);

  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  return url;
};

/**
 * Constructs the full image URL, handling both Cloudinary URLs and relative paths
 * @param {string} baseUrl - The base API URL
 * @param {string} imagePath - The image path (can be full URL or relative path)
 * @returns {string} - Full image URL
 */
export const getImageUrl = (baseUrl, imagePath) => {
  if (!imagePath) return null;

  // If the imagePath is already a full URL (Cloudinary, etc.), return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('data:')) {
    return imagePath;
  }

  // For relative paths, combine with baseUrl
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const cleanImagePath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;

  return `${cleanBaseUrl}${cleanImagePath}`;
};

/**
 * Preloads critical images for better performance
 * @param {Array<string>} imageUrls - Array of image URLs to preload
 */
export const preloadImages = (imageUrls) => {
  imageUrls.forEach(url => {
    if (url && !url.startsWith('data:')) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = url;
      document.head.appendChild(link);
    }
  });
};