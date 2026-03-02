import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Time Loop Architect',
  description: 'Incremental idle game with worker simulation',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
