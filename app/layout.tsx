import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '../components/shared/ThemeProvider';
import OfflineState from '../components/shared/OfflineState';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'OneAtlas — AI-Native Operational App Workspace',
  description: 'Generate, test, and deploy database-backed internal tools, dashboard grids, and forms instantly.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body className={`${inter.variable} font-sans h-full min-h-full flex flex-col antialiased`}>
        <ThemeProvider>
          <OfflineState />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
