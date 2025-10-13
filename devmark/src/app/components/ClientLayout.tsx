'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Navbar from '@/app/components/sidebar';
import ClientUserProvider from '@/app/components/ClientUserProvider';

/**
 * ClientLayout component that provides consistent layout structure
 * Conditionally shows navbar based on current route and manages sidebar state
 */
export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isNavbarExpanded, setIsNavbarExpanded] = useState(false);

  // Routes where the navbar should be hidden (authentication pages)
  const hideNavbarRoutes = ['/auth/login', '/auth/register'];
  const shouldShowNavbar = !hideNavbarRoutes.includes(pathname);

  /**
   * Toggles the navbar expanded/collapsed state
   */
  const handleToggleNavbar = () => {
    setIsNavbarExpanded(!isNavbarExpanded);
  };

  return (
    <ClientUserProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Conditionally render navbar based on current route */}
        {shouldShowNavbar && (
          <Navbar 
            isExpanded={isNavbarExpanded} 
            onToggle={handleToggleNavbar} 
          />
        )}
        
        {/* Main content area with dynamic margin based on navbar state */}
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