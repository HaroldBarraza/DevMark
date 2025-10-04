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
  const [showCollections, setShowCollections] = useState(false);
  const [showTags, setShowTags] = useState(false);

  useEffect(() => {
    if (!userId) return;

    // Fetch collections
    fetch(`/api/collections?userId=${userId}`)
      .then(res => res.json())
      .then((data: Collection[]) => setCollections(data))
      .catch(err => console.error('Error fetching collections:', err));

    // Fetch tags (nota: tu endpoint es /api/tag, no /api/tags)
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

  return (
    <nav className={`
      fixed left-0 top-0 h-screen bg-gray-800 text-white z-50 transition-all duration-300 ease-in-out
      ${isExpanded ? 'w-64' : 'w-16'}
      shadow-xl
    `}>
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

      <ul className="py-2">
        {navItems.map((item) => (
          <li key={item.id}>
            {item.url ? (
              <Link href={item.url}>
                <button className="w-full flex items-center p-3 hover:bg-gray-700 transition-colors duration-200 text-left whitespace-nowrap">
                  <span className="text-lg min-w-[20px] mr-4">{item.icon}</span>
                  <span className={`transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
                    {item.text}
                  </span>
                </button>
              </Link>
            ) : (
              <div>
                <button
                  onClick={() => {
                    if (item.id === 'collections') {
                      setShowCollections(!showCollections);
                    } else if (item.id === 'tags') {
                      setShowTags(!showTags);
                    }
                  }}
                  className="w-full flex items-center p-3 hover:bg-gray-700 transition-colors duration-200 text-left whitespace-nowrap"
                >
                  <span className="text-lg min-w-[20px] mr-4">{item.icon}</span>
                  <span className={`transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
                    {item.text}
                  </span>
                </button>

                {/* Collections submenu */}
                {item.id === 'collections' && isExpanded && showCollections && (
                  <ul className="pl-10 mt-2 space-y-1">
                    <div className="border-l border-gray-600 pl-4">
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
                    </div>
                  </ul>
                )}

                {/* Tags submenu */}
                {item.id === 'tags' && isExpanded && showTags && (
                  <ul className="pl-10 mt-2 space-y-1">
                    <div className="border-l border-gray-600 pl-4">
                      {tags.map(tag => (
                        <li key={tag.id}>
                          <Link href={`/tag/${tag.id}/bookmarks`}>
                            <span className="hover:underline cursor-pointer text-sm">{tag.name}</span>
                          </Link>
                        </li>
                      ))}

                      {tags.length === 0 && (
                        <li className="text-gray-400 text-sm italic">
                          No hay etiquetas
                        </li>
                      )}
                    </div>
                  </ul>
                )}

              </div>
            )}
          </li>
        ))}
      </ul>

      <div className="absolute bottom-0 w-full p-4">
        <UserMenu isExpanded={isExpanded} />
      </div>
    </nav>
  );
};

export default Navbar;