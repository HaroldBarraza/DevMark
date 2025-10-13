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

/**
 * Navigation sidebar component with expandable/collapsible functionality
 * Displays bookmarks, collections, tags, and user menu
 */
const Navbar: React.FC<NavbarProps> = ({ isExpanded, onToggle }) => {
  const { userId } = useUser();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [activeSubmenu, setActiveSubmenu] = useState<'collections' | 'tags' | null>(null);

  // Fetch user collections and tags when userId changes
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

  // Navigation items configuration
  const navItems: NavItem[] = [
    { id: 'all', icon: '📁', text: 'All Bookmarks', url: '/bookmark' },
    { id: 'collections', icon: '🗂️', text: 'Collections' },
    { id: 'tags', icon: '🏷️', text: 'Tags' },
    { id: 'unclassified', icon: '📋', text: 'Unclassified', url: '/unclassified' },
  ];

  /**
   * Toggles submenu visibility for collections and tags
   * @param menu - The submenu to toggle ('collections' or 'tags')
   */
  const toggleSubmenu = (menu: 'collections' | 'tags') => {
    setActiveSubmenu(prev => (prev === menu ? null : menu));
  };

  return (
    <nav
      className={`fixed left-0 top-0 h-screen bg-gray-800 text-white z-50 transition-all duration-300 ease-in-out ${
        isExpanded ? 'w-64' : 'w-16'
      } shadow-xl`}>
      
      {/* Header with Toggle Button */}
      <div className="flex items-center p-4 border-b border-gray-700 h-16">
        <button
          onClick={onToggle}
          className={`text-xl rounded-md hover:bg-gray-700 transition-colors ${
            isExpanded ? 'p-2' : 'p-1'
          }`}
          aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {isExpanded ? '☰' : '≡'}
        </button>
      </div>

      {/* Navigation Items */}
      <ul className="py-2">
        {navItems.map(item => (
          <li key={item.id} className="relative">
            {/* Regular Navigation Items with URLs */}
            {item.url ? (
              <Link href={item.url}>
                {isExpanded ? (
                  // Expanded view with icon and text
                  <button className="w-full flex items-center p-3 hover:bg-gray-700 transition-colors text-left whitespace-nowrap">
                    <span className="text-lg min-w-[20px] mr-4">{item.icon}</span>
                    <span className="transition-opacity duration-200 opacity-100">
                      {item.text}
                    </span>
                  </button>
                ) : (
                  // Collapsed view with tooltip
                  <div className="relative group">
                    <button className="w-12 h-12 mx-2 rounded-md flex items-center justify-center hover:bg-gray-700 transition-colors">
                      <span className="text-xl">{item.icon}</span>
                    </button>
                    <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none">
                      {item.text}
                    </div>
                  </div>
                )}
              </Link>
            ) : (
              /* Submenu Items (Collections and Tags) */
              <div>
                {isExpanded ? (
                  // Expanded submenu trigger
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
                    <span className="transition-opacity duration-200 opacity-100">
                      {item.text}
                    </span>
                  </button>
                ) : (
                  // Collapsed submenu trigger with tooltip
                  <div className="relative group">
                    <button
                      onClick={() =>
                        item.id === 'collections'
                          ? toggleSubmenu('collections')
                          : item.id === 'tags'
                          ? toggleSubmenu('tags')
                          : null
                      }
                      className="w-12 h-12 mx-2 rounded-md flex items-center justify-center hover:bg-gray-700 transition-colors"
                    >
                      <span className="text-xl">{item.icon}</span>
                    </button>
                    <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none">
                      {item.text}
                    </div>
                  </div>
                )}

                {/* Collections Submenu */}
                {item.id === 'collections' &&
                  isExpanded &&
                  activeSubmenu === 'collections' && (
                    <ul className="pl-8 mt-1 space-y-1 border-l border-gray-600">
                      {collections.map(collection => (
                        <li key={collection.id}>
                          <Link href={`/collections/${collection.id}/bookmarks`}>
                            <span className="hover:underline cursor-pointer text-sm block py-1">
                              {collection.name}
                            </span>
                          </Link>
                        </li>
                      ))}
                      <li>
                        <Link href="/collections/collectionForm">
                          <span className="text-indigo-400 hover:underline cursor-pointer text-sm block py-1">
                            + New Collection
                          </span>
                        </Link>
                      </li>
                    </ul>
                  )}

                {/* Tags Submenu */}
                {item.id === 'tags' &&
                  isExpanded &&
                  activeSubmenu === 'tags' && (
                    <ul className="pl-8 mt-1 space-y-1 border-l border-gray-600">
                      {tags.length > 0 ? (
                        tags.map(tag => (
                          <li key={tag.id}>
                            <Link href={`/tag/${tag.id}/bookmarks`}>
                              <span className="hover:underline cursor-pointer text-sm block py-1">
                                {tag.name}
                              </span>
                            </Link>
                          </li>
                        ))
                      ) : (
                        <li className="text-gray-400 text-sm italic py-1">
                          No tags available
                        </li>
                      )}
                    </ul>
                  )}
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* User Menu at Bottom */}
      <div className={`absolute bottom-0 w-full ${isExpanded ? 'p-4' : 'p-2'}`}>
        <UserMenu isExpanded={isExpanded} />
      </div>
    </nav>
  );
};

export default Navbar;