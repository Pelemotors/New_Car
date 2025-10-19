// אינטגרציית WhatsApp
const WHATSAPP_NUMBER = import.meta.env.VITE_CONTACT_WHATSAPP || '972543034759';

/**
 * פתיחת שיחת WhatsApp עם הודעה מוכנה
 * @param message - הודעה לשליחה
 */
export const openWhatsApp = (message: string = '') => {
  const encodedMessage = encodeURIComponent(message);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
  window.open(url, '_blank', 'noopener,noreferrer');
};

/**
 * יצירת הודעה כללית
 */
export const createGeneralMessage = (): string => {
  return 'שלום, אני מעוניין לקבל מידע על רכבים זמינים במלאי. תודה!';
};

/**
 * יצירת הודעה עבור רכב ספציפי
 * @param carName - שם הרכב
 * @param carId - מזהה הרכב
 */
export const createCarInquiryMessage = (carName: string, carId?: string): string => {
  const id = carId ? ` (מק"ט: ${carId})` : '';
  return `שלום, אני מעוניין לקבל מידע נוסף על ${carName}${id}. אשמח לתיאום מבחן נסיעה. תודה!`;
};

/**
 * יצירת הודעה לבקשת טרייד-אין
 * @param currentCar - פרטי הרכב הנוכחי
 */
export const createTradeInMessage = (currentCar?: {
  manufacturer: string;
  model: string;
  year: number;
  km: number;
}): string => {
  if (currentCar) {
    return `שלום, אני מעוניין לקבל הערכה לטרייד-אין של הרכב שלי:
${currentCar.manufacturer} ${currentCar.model}
שנה: ${currentCar.year}
ק"מ: ${currentCar.km.toLocaleString('he-IL')}
תודה!`;
  }
  return 'שלום, אני מעוניין לקבל הערכה לטרייד-אין של הרכב שלי. אשמח לפרטים. תודה!';
};

/**
 * יצירת הודעה לשאילתת מימון
 * @param carPrice - מחיר הרכב
 */
export const createFinancingMessage = (carPrice?: number): string => {
  if (carPrice) {
    return `שלום, אני מעוניין לקבל פרטים על אפשרויות מימון לרכב בסכום של ₪${carPrice.toLocaleString('he-IL')}. תודה!`;
  }
  return 'שלום, אני מעוניין לקבל מידע על אפשרויות מימון. תודה!';
};

/**
 * יצירת הודעת follow-up
 */
export const createFollowUpMessage = (): string => {
  return 'שלום, דיברנו לאחרונה ואשמח לקבל עדכון. תודה!';
};

/**
 * כפתור WhatsApp צף (שימוש בקומפוננטה)
 */
export const getWhatsAppButtonConfig = () => {
  return {
    number: WHATSAPP_NUMBER,
    message: createGeneralMessage(),
    position: 'bottom-left' as const, // או 'bottom-right'
  };
};

