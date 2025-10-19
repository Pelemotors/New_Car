# ניו קאר חדרה - מערכת ניהול רכבים

מערכת ניהול רכבים מתקדמת עם ממשק אדמין, גלריית רכבים, ועוד.

## תכונות

- 🚗 **ניהול רכבים** - הוספה, עריכה, מחיקה
- 📸 **העלאת מדיה** - תמונות וסרטונים
- 🎯 **דף בית חכם** - מציג את הרכבים הכי אטרקטיביים
- ⚡ **עריכה מהירה** - שינוי סטטוס inline
- 🔒 **אבטחה** - RLS policies עם Supabase
- 📱 **רספונסיבי** - עובד על כל המכשירים

## טכנולוגיות

- **Frontend:** React + TypeScript + Vite
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Storage:** Supabase Storage
- **Deployment:** Vercel

## התקנה

1. **Clone הפרויקט:**
```bash
git clone https://github.com/Pelemotors/New_Car.git
cd New_Car
```

2. **התקן dependencies:**
```bash
npm install
```

3. **הגדר משתני סביבה:**
צור קובץ `.env.local`:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_CONTACT_WHATSAPP=972543034759
```

4. **הרץ את הפרויקט:**
```bash
npm run dev
```

## הגדרת Supabase

1. **יצירת פרויקט** ב-Supabase
2. **הרצת Schema** - העתק את `database/schema.sql`
3. **הגדרת Storage** - צור bucket `car-images`
4. **הגדרת RLS Policies** - הרץ את `STORAGE_POLICIES.sql`

## פרסום

הפרויקט מוכן לפרסום ב-Vercel:

1. **חבר את ה-GitHub repository** ל-Vercel
2. **הגדר משתני סביבה** ב-Vercel
3. **Deploy** - Vercel יבנה ויפרסם אוטומטית

## מבנה הפרויקט

```
src/
├── components/          # רכיבי React
│   ├── admin/          # ממשק אדמין
│   ├── cars/           # רכיבי רכבים
│   ├── layout/         # רכיבי פריסה
│   └── ui/             # רכיבי UI בסיסיים
├── pages/              # דפי האתר
├── utils/              # פונקציות עזר
└── types/              # הגדרות TypeScript
```

## רישיון

© 2025 ניו קאר חדרה. כל הזכויות שמורות.