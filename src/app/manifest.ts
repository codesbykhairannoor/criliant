import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Criliant — Social Education Hub',
    short_name: 'Criliant',
    description: 'Platform Social Education Pertama di Indonesia: Simulasi CAT BKN, Latihan Soal & Komunitas Pejuang Seleksi 2026',
    start_url: '/',
    display: 'standalone',
    background_color: '#090D16',
    theme_color: '#2563EB',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/criliant-app-icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/criliant-app-icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/criliant-square-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
