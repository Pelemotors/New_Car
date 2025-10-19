import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, MessageCircle } from 'lucide-react';

const SITE_NAME = import.meta.env.VITE_SITE_NAME || 'ניו קאר חדרה';
const PHONE_NUMBER = import.meta.env.VITE_CONTACT_PHONE || '04-994-9994';
const WHATSAPP_NUMBER = import.meta.env.VITE_CONTACT_WHATSAPP || '972543034759';
const EMAIL = import.meta.env.VITE_CONTACT_EMAIL || 'info@newcar-hadera.co.il';
const ADDRESS = import.meta.env.VITE_BUSINESS_ADDRESS || "רח' השלום, חדרה";
const HOURS = import.meta.env.VITE_BUSINESS_HOURS || 'א׳-ה׳ 09:00-18:00, ו׳ 09:00-13:00';
const FACEBOOK_URL = import.meta.env.VITE_FACEBOOK_URL;
const INSTAGRAM_URL = import.meta.env.VITE_INSTAGRAM_URL;

const navigation = {
  main: [
    { name: 'בית', href: '/' },
    { name: 'רכבים', href: '/cars' },
    { name: 'אודות', href: '/about' },
    { name: 'צור קשר', href: '/contact' },
  ],
  legal: [
    { name: 'מדיניות פרטיות', href: '/privacy' },
    { name: 'תנאי שימוש', href: '/terms' },
  ],
};

const socialLinks = [
  ...(FACEBOOK_URL
    ? [
        {
          name: 'Facebook',
          icon: Facebook,
          href: FACEBOOK_URL,
          color: 'hover:text-blue-600',
        },
      ]
    : []),
  ...(INSTAGRAM_URL
    ? [
        {
          name: 'Instagram',
          icon: Instagram,
          href: INSTAGRAM_URL,
          color: 'hover:text-pink-600',
        },
      ]
    : []),
  {
    name: 'WhatsApp',
    icon: MessageCircle,
    href: `https://wa.me/${WHATSAPP_NUMBER}`,
    color: 'hover:text-green-600',
  },
];

export const Footer = () => {
  return (
    <footer className="bg-dark text-white">
      <div className="container-max section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* לוגו וסלוגן */}
          <div>
            <div className="text-2xl font-bold mb-4">
              <span className="text-primary">NEW</span>
              <span className="text-white">CAR</span>
            </div>
            <p className="text-gray-400 mb-4">
              {SITE_NAME}
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              רכב בראש שקט – מהמשפחה שלנו אל שלכם. 15 שנים של אמינות, שקיפות ושירות אישי.
            </p>
          </div>

          {/* ניווט מהיר */}
          <div>
            <h4 className="text-lg font-semibold mb-4">ניווט מהיר</h4>
            <ul className="space-y-2">
              {navigation.main.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* יצירת קשר */}
          <div>
            <h4 className="text-lg font-semibold mb-4">יצירת קשר</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <a
                  href={`tel:${PHONE_NUMBER}`}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {PHONE_NUMBER}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <a
                  href={`mailto:${EMAIL}`}
                  className="text-gray-400 hover:text-white transition-colors break-all"
                >
                  {EMAIL}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-gray-400">{ADDRESS}</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-gray-400">{HOURS}</span>
              </li>
            </ul>
          </div>

          {/* רשתות חברתיות */}
          <div>
            <h4 className="text-lg font-semibold mb-4">עקבו אחרינו</h4>
            <div className="flex gap-4">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`text-gray-400 ${item.color} transition-colors`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.name}
                >
                  <item.icon className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* זכויות יוצרים */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} כל הזכויות שמורות – {SITE_NAME}
            </p>
            <div className="flex gap-4 text-sm">
              {navigation.legal.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

