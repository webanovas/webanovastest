
## חיבור טופס "דברו איתנו" לשליחת מייל

הטופס הצף ישלח את ההודעות ישירות למייל **shira.pelleg@gmail.com** באמצעות פונקציית backend.

### מה ייבנה

1. **פונקציית backend חדשה (`send-contact-email`)**
   - תקבל שם, טלפון והודעה מהטופס
   - תשלח מייל ל-shira.pelleg@gmail.com עם כל הפרטים
   - תשתמש ב-Resend API לשליחת המייל (שירות מייל אמין וחינמי עד 100 מיילים ביום)

2. **עדכון הטופס הצף (`FloatingContact.tsx`)**
   - במקום ה-setTimeout המדומה, הטופס יקרא לפונקציית ה-backend
   - טיפול בשגיאות - אם השליחה נכשלת, המשתמש יקבל הודעת שגיאה

3. **הגדרת סוד (Secret)**
   - יידרש מפתח API של Resend (שירות שליחת מיילים) - נבקש ממך להירשם בחינם ולהזין את המפתח

### פרטים טכניים

**קובץ חדש: `supabase/functions/send-contact-email/index.ts`**
- מקבל POST עם `{ name, phone, message }`
- שולח מייל באמצעות Resend API
- כולל CORS headers
- ללא אימות JWT (טופס ציבורי)

**עדכון: `supabase/config.toml`**
- הוספת הגדרת `verify_jwt = false` לפונקציה

**עדכון: `src/components/FloatingContact.tsx`**
- החלפת ה-setTimeout בקריאה ל-`supabase.functions.invoke('send-contact-email', ...)`
- הוספת טיפול בשגיאות

### שלבים
1. בקשת מפתח Resend API ממך (הרשמה חינמית ב-resend.com)
2. יצירת פונקציית ה-backend
3. עדכון הטופס בקוד
