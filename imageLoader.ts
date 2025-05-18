const normalizeSrc = (src: string) => {
  return src.startsWith("/") ? src.slice(1) : src;
};

// Check if the URL is external (not relative path)
const isExternalUrl = (src: string) => {
  return src.startsWith('http://') || src.startsWith('https://');
};

// Check if URL is from GitHub avatars
const isGitHubAvatarUrl = (src: string) => {
  try {
    const url = new URL(src);
    return url.host === 'avatars.githubusercontent.com';
  } catch {
    return false; // Return false if the URL is invalid
  }
};

export default function cloudflareLoader({
 src,
 width,
 quality,
}: { src: string; width: number; quality?: number }) {
  // Return external URLs (especially GitHub avatars) directly without processing
  if (isExternalUrl(src) && isGitHubAvatarUrl(src)) {
    return src;
  }
  
  if (process.env.NODE_ENV === "development") {
    return src;
  }
  
  // Only process non-external URLs with Cloudflare
  const params = [`width=${width}`];
  if (quality) {
    params.push(`quality=${quality}`);
  }
  const paramsString = params.join(",");
  return `/cdn-cgi/image/${paramsString}/${normalizeSrc(src)}`;
}