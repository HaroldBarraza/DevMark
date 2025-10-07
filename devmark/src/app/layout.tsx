// src/app/layout.tsx - VERSIÓN CORREGIDA
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ClientLayout from '@/app/components/ClientLayout';

const inter = Inter({ subsets: ['latin'] });

// Metadata en el componente del servidor
export const metadata: Metadata = {
  title: 'Marcadores App',
  description: 'Gestiona tus marcadores favoritos',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}