# הגדרת משתמש Admin ב-Supabase

## המשתמש שנוצר

```json
{
  "email": "admin@admin.com",
  "id": "2e6425d2-dc8b-4369-ab45-954e4d0d472b",
  "role": "admin"
}
```

---

## עדכון User Metadata (אופציונלי אבל מומלץ)

כדי שהמשתמש יהיה Admin עם הרשאות מלאות, עדכן את ה-metadata שלו:

### דרך SQL Editor:

```sql
-- עדכון metadata של המשתמש
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
    raw_user_meta_data,
    '{role}',
    '"admin"'
)
WHERE email = 'admin@admin.com';

-- הוספת permissions
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
    raw_user_meta_data,
    '{permissions}',
    '["all"]'::jsonb
)
WHERE email = 'admin@admin.com';
```

### או דרך Dashboard:

1. לך ל-**Authentication** → **Users**
2. לחץ על המשתמש `admin@admin.com`
3. גלול ל-**User Metadata**
4. לחץ **"Edit"**
5. הוסף:
```json
{
  "email_verified": true,
  "role": "admin",
  "permissions": ["all"]
}
```
6. לחץ **"Save"**

---

## התחברות למערכת

### במצב Production (Supabase Auth):

1. עדכן `.env.local`:
```env
VITE_DEV_MODE=false
```

2. התחבר עם:
   - **Email:** admin@admin.com
   - **Password:** הסיסמה שהגדרת

### במצב Development (Local Auth):

1. השאר `.env.local`:
```env
VITE_DEV_MODE=true
```

2. התחבר עם:
   - **Email:** admin@newcar.co.il
   - **Password:** admin123

---

## בדיקה שהאימות עובד

### דרך הקוד:

```typescript
import { supabase } from './utils/supabase';

// התחברות
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'admin@admin.com',
  password: 'YOUR_PASSWORD'
});

console.log('User:', data.user);
console.log('Session:', data.session);
```

### דרך המערכת:

1. גש ל-`http://localhost:5173/admin`
2. הזן את פרטי ההתחברות
3. אם הצלחת, תועבר לדשבורד

---

## הוספת משתמשים נוספים (בעתיד)

אם תרצה להוסיף מוכרים או מנהלים נוספים:

```sql
-- יצירת משתמש חדש
INSERT INTO auth.users (
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data
)
VALUES (
  'seller@newcar.co.il',
  crypt('password123', gen_salt('bf')),
  NOW(),
  '{"role": "sales", "permissions": ["read", "create_lead"]}'::jsonb
);
```

או דרך Dashboard → Authentication → Users → Add user

---

## תפקידים והרשאות

| תפקיד | הרשאות | תיאור |
|------|---------|--------|
| **admin** | all | גישה מלאה לכל המערכת |
| **manager** | read, write, delete | ניהול רכבים ולידים |
| **sales** | read, create_lead, update_lead | איש מכירות - גישה ללידים |
| **viewer** | read | צפייה בלבד |

---

בהצלחה! 🎯

