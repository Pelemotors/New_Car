# הגדרת Supabase Storage

## שלב 1: יצירת Storage Bucket

1. לך ל-Supabase Dashboard
2. בחר בפרויקט שלך
3. לך ל-Storage (בתפריט השמאלי)
4. לחץ על "New bucket"
5. מלא את הפרטים:
   - **Name**: `car-images`
   - **Public**: ✅ (סמן כ-public)
   - **File size limit**: 100MB
   - **Allowed MIME types**: `image/*,video/*`

## שלב 2: הגדרת RLS (Row Level Security)

### אופציה 1: הגדרת Policies נכונים (מומלץ)

1. לך ל-SQL Editor
2. העתק והרץ את התוכן מהקובץ `STORAGE_POLICIES.sql`
3. זה ייצור policies נכונים עם מחיקה של policies קיימים

### אופציה 2: השבתת RLS זמנית (לבדיקה)

אם ה-policies לא עובדים:

1. לך ל-SQL Editor
2. הרץ את השאילתה:
```sql
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;
```
3. זה יאפשר העלאה ללא הגבלות (זמנית)
4. אחרי הבדיקה, החזר את ה-RLS עם policies נכונים

## שלב 3: בדיקה

1. נסה להעלות תמונה בטופס הוספת רכב
2. ודא שהתמונה מוצגת כראוי
3. בדוק שהתמונה נשמרת במסד הנתונים

## פתרון בעיות

### שגיאה: "Bucket not found"
- ודא שיצרת את ה-bucket בשם `car-images`
- ודא שה-bucket מסומן כ-public

### שגיאה: "new row violates row-level security policy"
- הרץ את ה-SQL מהקובץ `STORAGE_POLICIES.sql`
- או השבת RLS זמנית עם: `ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;`

### שגיאה: "Permission denied"
- ודא שהרצת את ה-RLS policies
- ודא שאתה מחובר כמשתמש מאומת

### שגיאה: "File too large"
- ודא שהגדרת file size limit ל-100MB
- ודא שהקובץ קטן מ-100MB

## מבנה הקבצים

הקבצים יישמרו במבנה הבא:
```
car-images/
  cars/
    1703123456789-abc123.jpg
    1703123456790-def456.mp4
    ...
```

כל קובץ מקבל שם ייחודי עם timestamp ו-ID אקראי.
