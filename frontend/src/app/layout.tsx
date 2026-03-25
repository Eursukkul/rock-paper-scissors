import type { Metadata } from 'next';
import './globals.scss';

export const metadata: Metadata = {
  title: 'Rock Paper Scissors',
  description: 'Play Rock Paper Scissors against the bot!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
