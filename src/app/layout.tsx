import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Craft & Code Club Blog",
  description: "Deep dives into DDD, algorithms, architecture, and software craftsmanship",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-gray-900 antialiased`}>
        <nav className="border-b">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold">
              Craft & Code Club
            </Link>
            <div className="space-x-6">
              <Link href="/topics/ddd" className="hover:text-blue-600">DDD</Link>
              <Link href="/topics/algorithms" className="hover:text-blue-600">Algorithms</Link>
              <Link href="/topics/architecture" className="hover:text-blue-600">Architecture</Link>
              <Link href="/about" className="hover:text-blue-600">About</Link>
            </div>
          </div>
        </nav>
        <div className="min-h-screen">
          {children}
        </div>
        <footer className="border-t">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold mb-3">Craft & Code Club</h3>
                <p className="text-sm text-gray-600">Where coding is our craft and technology is our canvas.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Connect</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="https://discord.gg/V7hQJZSDYu" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                      Discord Community
                    </a>
                  </li>
                  <li>
                    <a href="http://www.youtube.com/@CraftCodeClub" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                      YouTube Channel
                    </a>
                  </li>
                  <li>
                    <a href="https://www.meetup.com/craft-code-club" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                      Meetup Group
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Resources</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="https://github.com/craft-code-club" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                      GitHub Organization
                    </a>
                  </li>
                  <li>
                    <Link href="/topics" className="text-blue-600 hover:text-blue-800">
                      All Topics
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
