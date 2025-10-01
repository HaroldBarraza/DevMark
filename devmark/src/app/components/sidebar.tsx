'use client';

import React from 'react';
import Link from 'next/link';
import { UserMenu } from './UserMenu';

interface NavItem {
  id: string;
  icon: string;
  text: string;
  url: string;
}

interface NavbarProps {
  isExpanded: boolean;
  onToggle: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isExpanded, onToggle }) => {
  const navItems: NavItem[] = [
    { id: 'all', icon: '📁', text: 'Todos los marcadores', url: '/bookmark' },
    { id: 'collections', icon: '🗂️', text: 'Colecciones', url: '/collections' },
    { id: 'unclassified', icon: '🏷️', text: 'Sin clasificar', url: '/unclassified' },
    { id: 'filters', icon: '🔍', text: 'Filtros', url: '/filters' },
    { id: 'videos', icon: '📹', text: 'Videos', url: '/videos' },
    { id: 'untagged', icon: '📌', text: 'Sin etiquetas', url: '/untagged' },
  ];

  return (
    <nav className={`
      fixed left-0 top-0 h-screen bg-gray-800 text-white z-50 transition-all duration-300 ease-in-out
      ${isExpanded ? 'w-64' : 'w-16'}
      shadow-xl
    `}>
      {/* Header del navbar */}
      <div className="flex items-center p-4 border-b border-gray-700 h-16">
        <button
          onClick={onToggle}
          className="text-xl p-2 rounded-md hover:bg-gray-700 transition-colors"
        >
          ☰
        </button>
        <span className={`ml-4 font-semibold whitespace-nowrap transition-opacity duration-200
          ${isExpanded ? 'opacity-100' : 'opacity-0'}`}
        >
          Todos los marcadores
        </span>
      </div>

      {/* Menú de navegación */}
      <ul className="py-2">
        {navItems.map((item) => (
          <li key={item.id}>
            <Link href={item.url}>
              <button className="w-full flex items-center p-3 hover:bg-gray-700 transition-colors duration-200 text-left whitespace-nowrap">
                <span className="text-lg min-w-[20px] mr-4">{item.icon}</span>
                <span className={`transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
                  {item.text}
                </span>
              </button>
            </Link>
          </li>
        ))}
      </ul>

      {/* User Menu */}
      <div className="absolute bottom-0 w-full p-4">
        <UserMenu isExpanded={isExpanded} />
      </div>
    </nav>
  );
};

export default Navbar;
