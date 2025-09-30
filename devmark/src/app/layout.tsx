// app/layout.tsx
'use client'; 

import { Inter } from 'next/font/google';
import './globals.css';
import Layout from '@/app/components/layout';
import { ClientUserProvider } from '@/app/components/ClientUserProvider';

const inter = Inter({ subsets: ['latin'] });


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>

        <ClientUserProvider>
          <Layout>{children}</Layout>
        </ClientUserProvider>
      </body>
    </html>
  );
}
