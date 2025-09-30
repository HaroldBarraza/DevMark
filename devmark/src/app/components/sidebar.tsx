'use client';

interface NavItem {
  id: string;
  icon: string;
  text: string;
}

interface NavbarProps {
  isExpanded: boolean;
  onToggle: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isExpanded, onToggle }) => {
  const navItems: NavItem[] = [
    { id: 'all', icon: '📁', text: 'Todos los marcadores' },
    { id: 'unclassified', icon: '🏷️', text: 'Sin clasificar' },
    { id: 'filters', icon: '🔍', text: 'Filtros' },
    { id: 'videos', icon: '📹', text: 'Videos' },
    { id: 'untagged', icon: '📌', text: 'Sin etiquetas' },
  ];

  return (
    <nav className={`
      fixed left-0 top-0 h-screen bg-gray-800 text-white z-50 transition-all duration-300 ease-in-out
      ${isExpanded ? 'w-64' : 'w-16'}
      shadow-xl
    `}>
      {/* Header del navbar */}
      <div className={`
        flex items-center border-b border-gray-700 h-16 transition-all duration-300
        ${isExpanded ? 'p-4' : 'p-2 justify-center'}
      `}>
        <button
          onClick={onToggle}
          className={`
            text-xl rounded-md hover:bg-gray-700 transition-colors
            ${isExpanded ? 'p-2' : 'p-1'}
          `}
        >
          {isExpanded ? '☰' : '≡'}
        </button>
        <span className={`
          font-semibold whitespace-nowrap transition-all duration-200 overflow-hidden
          ${isExpanded ? 'opacity-100 ml-4 w-auto' : 'opacity-0 ml-0 w-0'}
        `}>
          Todos los marcadores
        </span>
      </div>

      {/* Menú de navegación */}
      <ul className="py-2">
        {navItems.map((item) => (
          <li key={item.id}>
            <button className={`
              flex items-center hover:bg-gray-700 transition-all duration-200
              text-left whitespace-nowrap group
              ${isExpanded ? 'w-full p-3' : 'w-12 h-12 mx-2 rounded-md justify-center'}
            `}>
              <span className={`
                text-lg transition-transform duration-200
                ${isExpanded ? '' : 'group-hover:scale-110'}
              `}>
                {item.icon}
              </span>
              <span className={`
                transition-all duration-200 overflow-hidden
                ${isExpanded ? 'opacity-100 ml-4 w-auto' : 'opacity-0 ml-0 w-0'}
              `}>
                {item.text}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;