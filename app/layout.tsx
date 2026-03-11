import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Fruit Ninja — Slice & Score',
  description:
    'A neon-themed Fruit Ninja browser game built with Next.js, TypeScript, and Tailwind CSS. Slice fruits, avoid bombs, beat your high score!',
  keywords: ['fruit ninja', 'browser game', 'nextjs', 'typescript', 'canvas game'],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#04040f',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="overflow-hidden">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="antialiased overflow-hidden">
        {children}
      </body>
    </html>
  );
}
