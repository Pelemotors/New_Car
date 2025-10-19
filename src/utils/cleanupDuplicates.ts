// פונקציה לניקוי רכבים כפולים
import type { Car } from '../types';

/**
 * מסיר רכבים כפולים מ-localStorage
 * רכבים נחשבים כפולים אם יש להם אותו slug או אותו ID
 */
export const cleanupDuplicateCars = (): void => {
  try {
    const cars = JSON.parse(localStorage.getItem('cars') || '[]');
    
    if (!Array.isArray(cars)) {
      console.warn('Invalid cars data in localStorage');
      return;
    }

    // יצירת Map עם slug כ-key כדי למנוע כפילויות
    const uniqueCars = new Map<string, Car>();
    
    cars.forEach((car: Car) => {
      if (car.slug && car.id) {
        // אם כבר קיים רכב עם אותו slug, נשמור את החדש יותר
        if (uniqueCars.has(car.slug)) {
          const existingCar = uniqueCars.get(car.slug)!;
          const existingDate = new Date(existingCar.created_at || 0);
          const newDate = new Date(car.created_at || 0);
          
          if (newDate > existingDate) {
            uniqueCars.set(car.slug, car);
          }
        } else {
          uniqueCars.set(car.slug, car);
        }
      }
    });

    const cleanedCars = Array.from(uniqueCars.values());
    
    if (cleanedCars.length !== cars.length) {
      localStorage.setItem('cars', JSON.stringify(cleanedCars));
      console.log(`Cleaned up ${cars.length - cleanedCars.length} duplicate cars`);
    }
  } catch (error) {
    console.error('Error cleaning up duplicate cars:', error);
  }
};

/**
 * מוצא רכבים כפולים ב-localStorage
 */
export const findDuplicateCars = (): { duplicates: Car[], unique: Car[] } => {
  try {
    const cars = JSON.parse(localStorage.getItem('cars') || '[]');
    
    if (!Array.isArray(cars)) {
      return { duplicates: [], unique: [] };
    }

    const seen = new Set<string>();
    const duplicates: Car[] = [];
    const unique: Car[] = [];
    
    cars.forEach((car: Car) => {
      if (car.slug) {
        if (seen.has(car.slug)) {
          duplicates.push(car);
        } else {
          seen.add(car.slug);
          unique.push(car);
        }
      }
    });

    return { duplicates, unique };
  } catch (error) {
    console.error('Error finding duplicate cars:', error);
    return { duplicates: [], unique: [] };
  }
};
