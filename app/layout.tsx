import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import './globals.css'; // Global styles

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI启发式数学辅导（未来版）',
  description: '电影级视觉交互体验的AI启发式数学辅导',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="zh">
      <body className={inter.className} suppressHydrationWarning>{children}</body>
    </html>
  );
}
