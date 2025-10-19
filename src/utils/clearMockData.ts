// פונקציה לניקוי כל נתוני הדמה
export const clearAllMockData = (): void => {
  try {
    // מחיקת רכבים מ-localStorage
    localStorage.removeItem('cars');
    
    // מחיקת לידים מ-localStorage
    localStorage.removeItem('leads');
    
    // מחיקת נתונים אחרים
    localStorage.removeItem('admin-session');
    localStorage.removeItem('user-preferences');
    
    console.log('All mock data cleared from localStorage');
  } catch (error) {
    console.error('Error clearing mock data:', error);
  }
};

// פונקציה לניקוי רק רכבים
export const clearCarsData = (): void => {
  try {
    localStorage.removeItem('cars');
    console.log('Cars data cleared from localStorage');
  } catch (error) {
    console.error('Error clearing cars data:', error);
  }
};

// פונקציה לניקוי רק לידים
export const clearLeadsData = (): void => {
  try {
    localStorage.removeItem('leads');
    console.log('Leads data cleared from localStorage');
  } catch (error) {
    console.error('Error clearing leads data:', error);
  }
};
