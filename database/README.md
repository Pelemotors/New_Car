# מדריך הגדרת מסד הנתונים - Supabase

## שלב 1: יצירת פרויקט Supabase

1. כנס ל-[Supabase](https://supabase.com/)
2. לחץ על "New Project"
3. בחר ארגון (או צור אחד חדש)
4. מלא פרטים:
   - **שם הפרויקט:** new-car-hadera
   - **Database Password:** בחר סיסמה חזקה (שמור אותה!)
   - **Region:** Frankfurt (הכי קרוב לישראל)
5. לחץ "Create new project"
6. המתן 1-2 דקות ליצירת הפרויקט

---

## שלב 2: הרצת Schema

1. בלוח הבקרה של Supabase, לך ל-**SQL Editor** (בתפריט צד)
2. לחץ על **"New query"**
3. העתק את כל התוכן מקובץ `schema.sql`
4. הדבק בעורך
5. לחץ **"Run"** (או Ctrl+Enter)
6. וודא שהכל רץ בהצלחה (✅ Success)

---

## שלב 3: יצירת Storage Buckets (לתמונות ווידאו)

### Bucket 1: car-images

1. בתפריט צד, לך ל-**Storage**
2. לחץ **"Create bucket"**
3. הגדרות:
   - **Name:** car-images
   - **Public bucket:** ✅ Yes
   - **File size limit:** 5 MB
   - **Allowed MIME types:** image/jpeg, image/png, image/webp
4. לחץ **"Create bucket"**

### Bucket 2: car-videos

1. לחץ **"Create bucket"** שוב
2. הגדרות:
   - **Name:** car-videos
   - **Public bucket:** ✅ Yes
   - **File size limit:** 50 MB
   - **Allowed MIME types:** video/mp4, video/quicktime
3. לחץ **"Create bucket"**

---

## שלב 4: העתקת API Keys

1. בלוח הבקרה, לך ל-**Settings** → **API**
2. העתק:
   - **Project URL** (משהו כמו: `https://xxxxx.supabase.co`)
   - **anon public** key (המפתח הארוך)

3. עדכן את קובץ `.env.local`:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## שלב 5: בדיקה שהכל עובד

### בדיקה דרך SQL Editor:

```sql
-- בדוק שהטבלאות נוצרו
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- צפה בתבניות WhatsApp שנוספו
SELECT * FROM whatsapp_templates;
```

### בדיקה דרך הקוד:

1. וודא ש-`.env.local` מעודכן
2. הרץ את האתר: `npm run dev`
3. נסה להוסיף רכב במערכת Admin

---

## שלב 6: הגדרת Authentication (אופציונלי)

אם תרצה להשתמש ב-Supabase Auth במקום הסיסמה הפשוטה:

1. לך ל-**Authentication** → **Providers**
2. ודא ש-**Email** פעיל
3. לך ל-**Authentication** → **Users**
4. לחץ **"Add user"** → **"Create new user"**
5. הזן:
   - **Email:** admin@newcar.co.il
   - **Password:** בחר סיסמה חזקה
   - **User metadata (JSON):**
   ```json
   {
     "role": "admin",
     "permissions": ["all"]
   }
   ```
6. לחץ **"Create user"**

7. עדכן את `.env.local`:
```env
VITE_DEV_MODE=false
```

---

## טבלאות שנוצרו

| טבלה | תיאור | רשומות |
|------|--------|---------|
| `cars` | רכבים למכירה | 0 |
| `leads` | לידים ופניות | 0 |
| `lead_communications` | היסטוריית תקשורת | 0 |
| `whatsapp_templates` | תבניות הודעות | 5 ✅ |

---

## פתרון בעיות נפוצות

### שגיאה: "relation does not exist"

**פתרון:** וודא שהרצת את `schema.sql` בהצלחה. נסה שוב.

### שגיאה: "RLS policy violation"

**פתרון:** 
- וודא שהמשתמש מאומת (במצב DEV_MODE=false)
- או השתמש ב-Service Role Key (לא מומלץ בצד לקוח!)

### לא מצליח להעלות תמונות

**פתרון:**
1. וודא שה-buckets נוצרו (**car-images**, **car-videos**)
2. וודא שהם public
3. בדוק policies ב-Storage

---

## Backup והעתקת נתונים

### יצוא נתונים:

```sql
-- יצוא כל הרכבים
COPY (SELECT * FROM cars) TO '/tmp/cars_backup.csv' WITH CSV HEADER;
```

### ייבוא נתונים:

דרך Supabase Dashboard → Table Editor → Import data

---

## סטטיסטיקות שימושיות

```sql
-- כמה רכבים פעילים
SELECT COUNT(*) FROM cars WHERE is_published = true AND is_sold = false;

-- לידים לפי סטטוס
SELECT status, COUNT(*) 
FROM leads 
GROUP BY status;

-- רכבים הכי נצפים
SELECT manufacturer, model, year, price 
FROM cars 
WHERE is_published = true 
ORDER BY created_at DESC 
LIMIT 10;
```

---

בהצלחה! 🚀

