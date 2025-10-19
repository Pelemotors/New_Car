// מערכת אימות היברידית - תומכת ב-Supabase וב-Local Auth
import { supabase, isSupabaseConfigured } from './supabase';
import { localLogin, localLogout, localGetCurrentUser, localIsAuthenticated } from './localAuth';
import type { User } from '../types';

// בדיקה אם אנחנו במצב DEV
const isDevMode = import.meta.env.VITE_DEV_MODE === 'true';

// התחברות
export const login = async (
  email: string,
  password: string
): Promise<{ user: User | null; error: string | null }> => {
  // במצב DEV או אם Supabase לא מוגדר - משתמשים באימות מקומי
  if (isDevMode || !isSupabaseConfigured()) {
    return localLogin(email, password);
  }

  // אימות עם Supabase
  try {
    console.log('Attempting Supabase login with:', { email, supabaseUrl: import.meta.env.VITE_SUPABASE_URL });
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    console.log('Supabase login result:', { data, error });

    if (error) {
      return {
        user: null,
        error: error.message === 'Invalid login credentials'
          ? 'אימייל או סיסמה שגויים'
          : error.message,
      };
    }

    if (!data.user) {
      return {
        user: null,
        error: 'שגיאה בהתחברות',
      };
    }

    // המרת משתמש Supabase למשתמש שלנו
    const user: User = {
      id: data.user.id,
      username: data.user.email?.split('@')[0] || 'user',
      email: data.user.email || '',
      role: (data.user.user_metadata?.role as User['role']) || 'viewer',
      permissions: data.user.user_metadata?.permissions || [],
      is_active: true,
      last_login: new Date().toISOString(),
      created_at: data.user.created_at,
    };

    return {
      user,
      error: null,
    };
  } catch (err) {
    return {
      user: null,
      error: 'שגיאה בהתחברות',
    };
  }
};

// התנתקות
export const logout = async (): Promise<void> => {
  if (isDevMode || !isSupabaseConfigured()) {
    localLogout();
    return;
  }

  await supabase.auth.signOut();
};

// קבלת משתמש נוכחי
export const getCurrentUser = async (): Promise<User | null> => {
  if (isDevMode || !isSupabaseConfigured()) {
    return localGetCurrentUser();
  }

  try {
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      return null;
    }

    const user: User = {
      id: data.user.id,
      username: data.user.email?.split('@')[0] || 'user',
      email: data.user.email || '',
      role: (data.user.user_metadata?.role as User['role']) || 'viewer',
      permissions: data.user.user_metadata?.permissions || [],
      is_active: true,
      last_login: new Date().toISOString(),
      created_at: data.user.created_at,
    };

    return user;
  } catch {
    return null;
  }
};

// בדיקה אם משתמש מחובר
export const isAuthenticated = async (): Promise<boolean> => {
  if (isDevMode || !isSupabaseConfigured()) {
    return localIsAuthenticated();
  }

  const { data } = await supabase.auth.getSession();
  return !!data.session;
};

// בדיקת הרשאות
export const hasPermission = (user: User | null, permission: string): boolean => {
  if (!user) return false;
  if (user.role === 'admin') return true;
  return user.permissions?.includes(permission) || false;
};

