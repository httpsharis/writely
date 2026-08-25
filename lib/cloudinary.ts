/**
 * Cloudinary On-The-Fly Image Optimization Utility
 * Automatically transforms raw Cloudinary URLs to serve AVIF/WebP,
 * applies smart perceptual compression (q_auto), and dynamic resizing.
 */

export interface CloudinaryTransformOptions {
  width?: number;
  height?: number;
  crop?: "fill" | "limit" | "fit" | "thumb" | "crop" | "scale";
  quality?: "auto" | "auto:good" | "auto:best" | "auto:eco" | "auto:low" | number;
  format?: "auto" | "webp" | "avif" | "png" | "jpg";
  gravity?: "auto" | "face" | "center" | "faces";
  blur?: number;
}

export function getOptimizedImageUrl(
  url?: string | null,
  options: CloudinaryTransformOptions = {}
): string {
  if (!url) return "";

  // Only transform Cloudinary URLs
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) {
    return url;
  }

  // Prevent double-applying transformations
  if (url.includes("/upload/f_auto") || url.includes("/upload/q_auto")) {
    return url;
  }

  const {
    width,
    height,
    crop = width && height ? "fill" : "limit",
    quality = "auto",
    format = "auto",
    gravity,
    blur,
  } = options;

  const transforms: string[] = [
    `f_${format}`,
    `q_${quality}`,
    `c_${crop}`,
  ];

  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  if (gravity) transforms.push(`g_${gravity}`);
  if (blur) transforms.push(`e_blur:${blur}`);

  const transformString = transforms.join(",");

  return url.replace("/upload/", `/upload/${transformString}/`);
}

/**
 * Optimized Preset for 2:3 Portrait Book Covers (Library cards, hero preview)
 */
export function getBookCoverUrl(url?: string | null, width = 400): string {
  return getOptimizedImageUrl(url, {
    width,
    height: Math.round((width * 3) / 2),
    crop: "fill",
    quality: "auto",
    format: "auto",
  });
}

/**
 * Optimized Preset for Character / Author Avatars (Square thumbnail with face detection)
 */
export function getAvatarUrl(url?: string | null, size = 160): string {
  return getOptimizedImageUrl(url, {
    width: size,
    height: size,
    crop: "thumb",
    gravity: "face",
    quality: "auto",
    format: "auto",
  });
}

/**
 * Optimized Preset for Landscape Hero Banners / Project headers
 */
export function getBannerUrl(url?: string | null, width = 1200): string {
  return getOptimizedImageUrl(url, {
    width,
    quality: "auto:good",
    format: "auto",
    crop: "limit",
  });
}

