# הגדרת EmailJS לטופס יצירת קשר

## שלב 1: הרשמה ל-EmailJS

1. גש ל-[EmailJS](https://www.emailjs.com/)
2. צור חשבון חינם (עד 200 מיילים בחודש)
3. אשר את כתובת המייל שלך

## שלב 2: יצירת Email Service

1. לחץ על **Add New Service**
2. בחר **Gmail** (או כל ספק מייל אחר)
3. חבר את החשבון Gmail שלך (easydevil227@gmail.com)
4. שמור את ה-**Service ID** (לדוגמה: `service_xxx123`)

## שלב 3: יצירת Email Template

1. לחץ על **Email Templates** → **Create New Template**
2. שם התבנית: "New Car Contact Form"
3. תוכן התבנית:

### Subject (נושא):
```
פנייה חדשה מאתר ניו קאר חדרה - {{from_name}}
```

### Content (תוכן):
```html
<div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #E53935;">פנייה חדשה מאתר ניו קאר חדרה</h2>
  
  <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h3>פרטי הלקוח:</h3>
    <p><strong>שם:</strong> {{from_name}}</p>
    <p><strong>אימייל:</strong> {{from_email}}</p>
    <p><strong>טלפון:</strong> {{from_phone}}</p>
    <p><strong>רכב מעניין:</strong> {{car_id}}</p>
  </div>
  
  <div style="background-color: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
    <h3>תוכן ההודעה:</h3>
    <p style="white-space: pre-wrap;">{{message}}</p>
  </div>
  
  <div style="margin-top: 20px; padding: 15px; background-color: #E3F2FD; border-radius: 8px;">
    <p style="margin: 0; color: #1565C0;">
      <strong>שים לב:</strong> יש להגיב ללקוח בהקדם - בדרך כלל באותו יום בשעות הפעילות.
    </p>
  </div>
  
  <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />
  
  <p style="color: #666; font-size: 12px; text-align: center;">
    הודעה זו נשלחה מטופס יצירת הקשר באתר ניו קאר חדרה
  </p>
</div>
```

4. שמור את התבנית וקח את ה-**Template ID** (לדוגמה: `template_xxx456`)

## שלב 4: קבלת Public Key

1. לחץ על **Account** → **General**
2. העתק את ה-**Public Key** (לדוגמה: `xxx789ABC`)

## שלב 5: הוספת המשתנים ל-.env.local

הוסף את השורות הבאות לקובץ `.env.local` בשורש הפרויקט:

```env
# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=service_xxx123
VITE_EMAILJS_TEMPLATE_ID=template_xxx456
VITE_EMAILJS_PUBLIC_KEY=xxx789ABC
```

**החלף** את הערכים עם הנתונים שקיבלת מ-EmailJS!

## שלב 6: בדיקה

1. הפעל מחדש את שרת הפיתוח:
   ```bash
   npm run dev
   ```

2. גש לדף יצירת קשר: `http://localhost:5173/contact`

3. מלא את הטופס ושלח

4. בדוק את המייל ב-easydevil227@gmail.com

## הערות חשובות

- **ללא הגדרת EmailJS** - הטופס יעבוד בסימולציה (לא ישלח מייל אמיתי)
- **מכסת חינם**: 200 מיילים בחודש
- **אבטחה**: ה-Public Key בטוח לחשיפה (כבר בשימוש בצד הלקוח)
- **ספאם**: EmailJS כולל מנגנון נגד ספאם מובנה

## פתרון בעיות

### המייל לא מגיע?
1. בדוק ב-Spam/Junk
2. וודא שה-Service מחובר נכון ל-Gmail
3. בדוק את ה-IDs בקונסול

### שגיאה "Invalid template"?
- וודא שה-Template ID נכון
- בדוק שהשמות של המשתנים בתבנית תואמים ({{from_name}}, {{message}} וכו')

### שגיאה "Invalid user"?
- וודא שה-Public Key נכון
- נסה לאתחל מחדש את EmailJS

---

**אם הכל עובד** - תראה הודעת "תודה!" בטופס, והמייל יגיע תוך דקות ל-easydevil227@gmail.com! 🎉

