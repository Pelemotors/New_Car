import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Car,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  MessageCircle,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';

interface AdminLayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: 'דשבורד', href: '/admin', icon: LayoutDashboard },
  { name: 'רכבים', href: '/admin/cars', icon: Car },
  { name: 'לידים', href: '/admin/leads', icon: Users },
  { name: 'WhatsApp', href: '/admin/whatsapp', icon: MessageCircle },
  { name: 'הגדרות', href: '/admin/settings', icon: Settings },
];

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Mobile */}
      <div className="lg:hidden bg-white shadow-sm sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <div className="text-xl font-bold">
            <span className="text-primary">NEW</span>
            <span className="text-dark">CAR</span>
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2">
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
            fixed lg:sticky top-0 right-0 h-screen w-64 bg-dark text-white z-50 transition-transform duration-300
            ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
          `}
        >
          <div className="p-6">
            {/* לוגו */}
            <div className="text-2xl font-bold mb-8 hidden lg:block">
              <span className="text-primary">NEW</span>
              <span className="text-white">CAR</span>
              <div className="text-sm text-gray-400 mt-1">מערכת ניהול</div>
            </div>

            {/* ניווט */}
            <nav className="space-y-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                      ${
                        isActive
                          ? 'bg-primary text-white'
                          : 'text-gray-300 hover:bg-darkGray hover:text-white'
                      }
                    `}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* פרופיל ויציאה */}
            <div className="absolute bottom-0 right-0 left-0 p-6 border-t border-gray-700">
              <div className="mb-4">
                <div className="text-sm text-gray-400">מחובר בתור</div>
                <div className="font-medium">{user?.email}</div>
              </div>
              <Button variant="outline" size="sm" fullWidth onClick={handleLogout} className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white">
                <LogOut className="h-4 w-4 ml-2" />
                התנתקות
              </Button>
            </div>
          </div>
        </aside>

        {/* Overlay למובייל */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 lg:mr-64">
          <div className="p-4 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
};

