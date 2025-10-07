'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Navbar from '@/app/components/sidebar';
import ClientUserProvider from '@/app/components/ClientUserProvider';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isNavbarExpanded, setIsNavbarExpanded] = useState(false);

  // Rutas donde NO mostrar el navbar
  const hideNavbarRoutes = ['/auth/login', '/auth/register'];
  const shouldShowNavbar = !hideNavbarRoutes.includes(pathname);

  const handleToggleNavbar = () => {
    setIsNavbarExpanded(!isNavbarExpanded);
  };

  return (
    <ClientUserProvider>
      <div className="min-h-screen bg-gray-50">
        {shouldShowNavbar && (
          <Navbar isExpanded={isNavbarExpanded} onToggle={handleToggleNavbar} />
        )}
        
        <main className={`
          min-h-screen transition-all duration-300 ease-in-out
          ${shouldShowNavbar ? (isNavbarExpanded ? 'ml-64' : 'ml-16') : 'ml-0'}
          p-6
        `}>
          {children}
        </main>
      </div>
    </ClientUserProvider>
  );
}