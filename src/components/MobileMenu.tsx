import { Link, useLocation } from 'react-router-dom';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  links: { href: string; label: string }[];
}

const MobileMenu = ({ isOpen, onClose, links }: MobileMenuProps) => {
  const location = useLocation();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-white z-[1200] flex items-center justify-center animate-fade-in"
      aria-hidden={!isOpen}
    >
      <button
        className="absolute top-8 right-8 text-gray-400 text-2xl bg-transparent border-none cursor-pointer hover:text-gray-600"
        onClick={onClose}
        aria-label="Close menu"
      >
        ✕
      </button>

      <ul className="list-none m-0 p-0 text-center">
        {links.map((link, index) => (
          <li
            key={link.href}
            className="my-8"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <Link
              to={link.href}
              className={`uppercase font-normal text-xl transition-colors hover:text-green ${
                location.pathname === link.href ? 'text-green' : 'text-foreground'
              }`}
              onClick={onClose}
            >
              {link.label.toUpperCase()}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MobileMenu;
