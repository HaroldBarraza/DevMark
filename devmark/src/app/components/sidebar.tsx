'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { UserMenu } from './UserMenu';
import { useUser } from '@/app/context/UserContext';

interface NavItem {
  id: string;
  icon: string;
  text: string;
  url?: string;
}

interface Collection {
  id: string;
  name: string;
}

interface Tag {
  id: string;
  name: string;
}

interface NavbarProps {
  isExpanded: boolean;
  onToggle: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isExpanded, onToggle }) => {
  const { userId } = useUser();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [activeSubmenu, setActiveSubmenu] = useState<'collections' | 'tags' | null>(null);

  useEffect(() => {
    if (!userId) return;

    // Fetch collections
    fetch(`/api/collections?userId=${userId}`)
      .then(res => res.json())
      .then((data: Collection[]) => setCollections(data))
      .catch(err => console.error('Error fetching collections:', err));

    // Fetch tags
    fetch(`/api/tag?userId=${userId}`)
      .then(res => res.json())
      .then((data: Tag[]) => setTags(data))
      .catch(err => console.error('Error fetching tags:', err));
  }, [userId]);

  const navItems: NavItem[] = [
    { id: 'all', icon: '📁', text: 'Todos los marcadores', url: '/bookmark' },
    { id: 'collections', icon: '🗂️', text: 'Colecciones' },
    { id: 'tags', icon: '🏷️', text: 'Etiquetas' },
    { id: 'unclassified', icon: '📋', text: 'Sin clasificar', url: '/unclassified' },
  ];

  const toggleSubmenu = (menu: 'collections' | 'tags') => {
    setActiveSubmenu(prev => (prev === menu ? null : menu));
  };

  return (
    <nav
      className={`fixed left-0 top-0 h-screen bg-gray-800 text-white z-50 transition-all duration-300 ease-in-out ${
        isExpanded ? 'w-64' : 'w-16'
      } shadow-xl`}
    >
      {/* Header */}
      <div className="flex items-center p-4 border-b border-gray-700 h-16">
        <button
          onClick={onToggle}
          className={`text-xl rounded-md hover:bg-gray-700 transition-colors ${
            isExpanded ? 'p-2' : 'p-1'
          }`}
        >
          {isExpanded ? '☰' : '≡'}
        </button>
      </div>

      {/* Nav Items */}
      <ul className="py-2">
        {navItems.map(item => (
          <li key={item.id} className="relative">
            {item.url ? (
              <Link href={item.url}>
                <button
                  className="w-full flex items-center p-3 hover:bg-gray-700 transition-colors text-left whitespace-nowrap"
                >
                  <span className="text-lg min-w-[20px] mr-4">{item.icon}</span>
                  <span
                    className={`transition-opacity duration-200 ${
                      isExpanded ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    {item.text}
                  </span>
                </button>
              </Link>
            ) : (
              <div>
                <button
                  onClick={() =>
                    item.id === 'collections'
                      ? toggleSubmenu('collections')
                      : item.id === 'tags'
                      ? toggleSubmenu('tags')
                      : null
                  }
                  className="w-full flex items-center p-3 hover:bg-gray-700 transition-colors text-left whitespace-nowrap"
                >
                  <span className="text-lg min-w-[20px] mr-4">{item.icon}</span>
                  <span
                    className={`transition-opacity duration-200 ${
                      isExpanded ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    {item.text}
                  </span>
                </button>

                {/* Submenu Collections */}
                {item.id === 'collections' &&
                  isExpanded &&
                  activeSubmenu === 'collections' && (
                    <ul className="pl-8 mt-1 space-y-1 border-l border-gray-600">
                      {collections.map(c => (
                        <li key={c.id}>
                          <Link href={`/collections/${c.id}/bookmarks`}>
                            <span className="hover:underline cursor-pointer text-sm">{c.name}</span>
                          </Link>
                        </li>
                      ))}
                      <li>
                        <Link href="/collections/collectionForm">
                          <span className="text-indigo-400 hover:underline cursor-pointer text-sm">
                            + Nueva colección
                          </span>
                        </Link>
                      </li>
                    </ul>
                  )}

                {/* Submenu Tags */}
                {item.id === 'tags' &&
                  isExpanded &&
                  activeSubmenu === 'tags' && (
                    <ul className="pl-8 mt-1 space-y-1 border-l border-gray-600">
                      {tags.length > 0 ? (
                        tags.map(tag => (
                          <li key={tag.id}>
                            <Link href={`/tag/${tag.id}/bookmarks`}>
                              <span className="hover:underline cursor-pointer text-sm">{tag.name}</span>
                            </Link>
                          </li>
                        ))
                      ) : (
                        <li className="text-gray-400 text-sm italic">No hay etiquetas</li>
                      )}
                    </ul>
                  )}
              </div>
            )}
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
