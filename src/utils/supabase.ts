// Supabase Client Configuration
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// יצירת Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// בדיקה אם Supabase מוגדר כראוי
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://your-project-id.supabase.co');
};

// פונקציות עזר לטיפול בקבצים
export const uploadFile = async (
  bucket: string,
  path: string,
  file: File
): Promise<{ data: { path: string } | null; error: any }> => {
  if (!isSupabaseConfigured()) {
    return {
      data: null,
      error: { message: 'Supabase לא מוגדר' },
    };
  }

  const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });

  return { data, error };
};

export const getPublicUrl = (bucket: string, path: string): string => {
  if (!isSupabaseConfigured()) {
    return '';
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};

export const deleteFile = async (bucket: string, path: string) => {
  if (!isSupabaseConfigured()) {
    return { data: null, error: { message: 'Supabase לא מוגדר' } };
  }

  return await supabase.storage.from(bucket).remove([path]);
};

