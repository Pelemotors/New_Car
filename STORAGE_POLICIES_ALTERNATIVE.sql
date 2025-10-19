-- פתרון חלופי: השבתת RLS זמנית
-- השתמש בזה רק אם ה-policies לא עובדים

-- השבתת RLS על storage.objects (זמנית)
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- הערה: זה יאפשר לכל אחד להעלות קבצים
-- השתמש בזה רק לבדיקה, ואז החזר את ה-RLS עם policies נכונים
