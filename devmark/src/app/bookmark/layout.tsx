'use client';

import { useState } from 'react';
import Navbar from '@/app/components/sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isNavbarExpanded, setIsNavbarExpanded] = useState(false);

  const handleToggleNavbar = () => {
    setIsNavbarExpanded(!isNavbarExpanded);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isExpanded={isNavbarExpanded} onToggle={handleToggleNavbar} />
      
      <main className={`
        min-h-screen transition-all duration-300 ease-in-out
        ${isNavbarExpanded ? 'ml-64' : 'ml-16'}
        p-6
      `}>
        {children}
      </main>
    </div>
  );
};

export default Layout;