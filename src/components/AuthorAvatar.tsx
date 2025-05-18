import Image from 'next/image';

interface AuthorProps {
  name: string;
  link?: string;
}

interface AuthorAvatarProps {
  author: AuthorProps;
  size?: number;
}

// Extract GitHub username from a GitHub profile URL
function extractGitHubUsername(url: string): string | null {
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname === 'github.com') {
      // The pathname will be like "/username", so we remove the leading slash
      const username = parsedUrl.pathname.split('/')[1];
      return username || null;
    }
  } catch {
    console.error('Failed to parse GitHub URL');
  }
  return null;
}

// Check if a URL is a GitHub profile URL
function isGitHubUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname === 'github.com';
  } catch {
    return false;
  }
}

export default function AuthorAvatar({ author, size = 48 }: AuthorAvatarProps) {
  const initials = author.name.split(' ').map(n => n[0]).join('');

  let avatarUrl: string | null = null;
  // Check if the author link is a GitHub URL
  if (author.link && isGitHubUrl(author.link)) {
    const username = extractGitHubUsername(author.link);
    if (username) {
      // Using size parameter to get the right avatar size from GitHub
      avatarUrl = `https://avatars.githubusercontent.com/${username}?s=${size * 2}`; // 2x for retina displays
    }
  }
  return (
    <div
      className="rounded-full flex items-center justify-center overflow-hidden"
      style={{ width: `${size}px`, height: `${size}px` }}
    >      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt={`Avatar de ${author.name}`}
          width={size}
          height={size}
          className="object-cover"
          unoptimized // Skip Next.js image optimization for external GitHub avatars
        />
      ): (
        <div className="w-full h-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
          <span
            className="text-blue-600 dark:text-blue-400 font-medium"
            style={{ fontSize: `${Math.max(size / 2.5, 12)}px` }}
          >
            {initials}
          </span>
        </div>
      )}
    </div>
  );
}
