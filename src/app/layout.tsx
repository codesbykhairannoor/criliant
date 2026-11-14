import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Criliant — Social Education Hub: CPNS • SNBT • Kedinasan 2026',
  description: 'Platform Social Education Pertama di Indonesia. Simulasi Resmi CAT BKN 110 Soal, Kuis Mikro Interaktif, Flexing Rapor, dan Cashtag $TWK $TIU $TKP.',
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/criliant-app-icon-192.png',
  },
  openGraph: {
    title: 'Criliant — Social Education Hub',
    description: 'Latihan soal CAT BKN, kuis mikro interaktif, dan komunitas pejuang kompetisi nasional 2026.',
    url: 'https://criliant.com',
    siteName: 'Criliant',
    locale: 'id_ID',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={plusJakartaSans.variable} suppressHydrationWarning>
      <body className={`${plusJakartaSans.className} font-sans min-h-screen bg-[#F8FAFC] dark:bg-[#090D16] text-[#0F1419] dark:text-[#F8FAFC] antialiased selection:bg-blue-600 selection:text-white transition-colors duration-200`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
