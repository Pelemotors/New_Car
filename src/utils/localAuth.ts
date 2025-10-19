// מערכת אימות מקומית לפיתוח (DEV_MODE)
import type { User } from '../types';

// משתמשים מוגדרים מראש לפיתוח
const DEV_USERS = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@admin.com',
    password: 'admin123',
    role: 'admin' as const,
    permissions: ['all'],
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    username: 'manager',
    email: 'manager@newcar.co.il',
    password: 'manager123',
    role: 'manager' as const,
    permissions: ['read', 'write'],
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

// התחברות מקומית
export const localLogin = (email: string, password: string): { user: User | null; error: string | null } => {
  const user = DEV_USERS.find((u) => u.email === email && u.password === password);

  if (!user) {
    return {
      user: null,
      error: 'אימייל או סיסמה שגויים',
    };
  }

  // שמירת המשתמש ב-localStorage
  const { password: _, ...userWithoutPassword } = user;
  localStorage.setItem('auth_user', JSON.stringify(userWithoutPassword));
  localStorage.setItem('auth_token', `dev_token_${user.id}`);

  return {
    user: userWithoutPassword,
    error: null,
  };
};

// התנתקות מקומית
export const localLogout = () => {
  localStorage.removeItem('auth_user');
  localStorage.removeItem('auth_token');
};

// קבלת משתמש נוכחי
export const localGetCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('auth_user');
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

// בדיקה אם משתמש מחובר
export const localIsAuthenticated = (): boolean => {
  return !!localStorage.getItem('auth_token');
};

