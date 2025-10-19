import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Phone, MessageCircle } from 'lucide-react';

const navigation = [
  { name: 'בית', href: '/' },
  { name: 'רכבים', href: '/cars' },
  { name: 'אודות', href: '/about' },
  { name: 'צור קשר', href: '/contact' },
];

const WHATSAPP_NUMBER = import.meta.env.VITE_CONTACT_WHATSAPP || '972543034759';
const PHONE_NUMBER = import.meta.env.VITE_CONTACT_PHONE || '04-994-9994';

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container-max">
        <div className="flex items-center justify-between py-4">
          {/* לוגו */}
          <Link to="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold">
              <span className="text-primary">NEW</span>
              <span className="text-dark">CAR</span>
            </div>
            <div className="text-sm text-darkGray">ניו קאר חדרה</div>
          </Link>

          {/* ניווט דסקטופ */}
          <div className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-darkGray hover:text-primary transition-colors font-medium"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* כפתורים */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href={`tel:${PHONE_NUMBER}`}
              className="flex items-center gap-2 text-darkGray hover:text-primary transition-colors"
            >
              <Phone className="h-5 w-5" />
              <span className="font-medium">{PHONE_NUMBER}</span>
            </a>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <MessageCircle className="h-5 w-5" />
              <span>WhatsApp</span>
            </a>
          </div>

          {/* כפתור מובייל */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="תפריט"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-dark" />
            ) : (
              <Menu className="h-6 w-6 text-dark" />
            )}
          </button>
        </div>

        {/* תפריט מובייל */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 pb-4">
            <div className="flex flex-col space-y-2 pt-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block px-4 py-3 text-darkGray hover:bg-gray-50 hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="px-4 pt-4 space-y-3 border-t border-gray-200">
                <a
                  href={`tel:${PHONE_NUMBER}`}
                  className="flex items-center gap-2 justify-center bg-gray-100 hover:bg-gray-200 text-dark px-4 py-3 rounded-lg transition-colors"
                >
                  <Phone className="h-5 w-5" />
                  <span className="font-medium">{PHONE_NUMBER}</span>
                </a>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 justify-center bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg transition-colors"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

