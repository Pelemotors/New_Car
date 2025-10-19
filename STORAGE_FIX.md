# פתרון בעיית RLS ב-Storage

## הבעיה
אין לך הרשאות לשלוט ב-RLS policies על טבלת `storage.objects` כי אתה משתמש ב-Anon Key.

## פתרון 1: שימוש ב-Service Role Key (מומלץ)

### שלב 1: קבלת Service Role Key
1. לך ל-Supabase Dashboard
2. לך ל-Settings → API
3. העתק את ה-Service Role Key (לא ה-Anon Key!)

### שלב 2: יצירת Supabase client נפרד להעלאה
צור קובץ חדש: `src/utils/supabaseAdmin.ts`

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY || '';

// Supabase client עם Service Role Key (להעלאות)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
```

### שלב 3: הוספת Service Key ל-.env
הוסף לקובץ `.env.local`:
```
VITE_SUPABASE_SERVICE_KEY=your_service_role_key_here
```

### שלב 4: עדכון FileUpload
החלף את השימוש ב-`supabase` ב-`supabaseAdmin` בפונקציות ההעלאה.

## פתרון 2: השבתת RLS דרך Dashboard

### שלב 1: לך ל-Storage → Settings
1. לך ל-Supabase Dashboard
2. לך ל-Storage → Settings
3. חפש "Row Level Security"
4. השבת RLS עבור storage.objects

### שלב 2: בדיקה
נסה להעלות תמונה - זה אמור לעבוד.

## פתרון 3: יצירת Bucket חדש ללא RLS

### שלב 1: יצירת bucket חדש
1. לך ל-Storage → Buckets
2. צור bucket חדש בשם `car-uploads`
3. סמן כ-Public
4. אל תגדיר RLS policies

### שלב 2: עדכון הקוד
החלף `car-images` ב-`car-uploads` בכל הקבצים.

## איזה פתרון לנסות?

1. **פתרון 1** - הכי בטוח ומקצועי
2. **פתרון 2** - הכי מהיר
3. **פתרון 3** - הכי פשוט

איזה פתרון תרצה לנסות?
