import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'リアルタイム投票アプリ',
  description: 'イベントやミーティングで使えるリアルタイム投票・アンケートアプリ',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h1 className="text-2xl font-bold text-blue-600">
              リアルタイム投票アプリ
            </h1>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="bg-white border-t border-gray-200 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <p className="text-center text-sm text-gray-500">
              © 2024 リアルタイム投票アプリ - Firebase無料プランで動作
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
