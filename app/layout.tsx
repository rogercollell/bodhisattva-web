import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'bodhisattva — the pause before a regrettable send',
  description:
    'Paste a draft. See what the wisdom-frame would say before your AI agent sends it.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-paper text-ink antialiased`}>
        {children}
      </body>
    </html>
  );
}
