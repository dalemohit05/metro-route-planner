import type { Metadata } from 'next';
import { Inter, Noto_Sans_Devanagari } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  weight: ['400', '600', '700'],
  variable: '--font-devanagari',
});

export const metadata: Metadata = {
  title: 'मेट्रोमित्र — MetroMitra | Smart Pune Metro Companion',
  description: 'आपला स्मार्ट पुणे मेट्रो साथी — Plan routes, calculate fares, and book Pune Metro tickets instantly with MetroMitra.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className + ' ' + notoDevanagari.variable}>
        {children}
      </body>
    </html>
  );
}
