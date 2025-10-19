// מחשבון מימון רכבים
import type { FinanceCalculation } from '../types';

/**
 * חישוב תשלום חודשי למימון רכב
 * @param carPrice - מחיר הרכב
 * @param downPayment - מקדמה
 * @param loanTerm - תקופת המימון (בחודשים)
 * @param interestRate - ריבית שנתית (באחוזים)
 * @returns אובייקט עם כל הנתונים הפיננסיים
 */
export const calculateFinance = (
  carPrice: number,
  downPayment: number,
  loanTerm: number,
  interestRate: number
): FinanceCalculation => {
  // סכום ההלוואה
  const loanAmount = carPrice - downPayment;

  // ריבית חודשית
  const monthlyInterestRate = interestRate / 100 / 12;

  // חישוב תשלום חודשי לפי נוסחת PMT
  // PMT = P * (r * (1 + r)^n) / ((1 + r)^n - 1)
  const monthlyPayment =
    (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTerm)) /
    (Math.pow(1 + monthlyInterestRate, loanTerm) - 1);

  // סה"כ תשלום
  const totalPayment = monthlyPayment * loanTerm + downPayment;

  // סה"כ ריבית
  const totalInterest = totalPayment - carPrice;

  return {
    carPrice,
    downPayment,
    loanTerm,
    interestRate,
    monthlyPayment: Math.round(monthlyPayment),
    totalPayment: Math.round(totalPayment),
    totalInterest: Math.round(totalInterest),
  };
};

/**
 * פורמט מספר למטבע (שקלים)
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS',
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * חישוב אחוז מקדמה מומלץ
 */
export const getRecommendedDownPayment = (carPrice: number): number => {
  // בדרך כלל ממליצים על 20-30% מקדמה
  return Math.round(carPrice * 0.25);
};

/**
 * קבלת טווח ריביות טיפוסי (לפי סוג אשראי)
 */
export const getTypicalInterestRange = (creditType: 'excellent' | 'good' | 'fair' | 'poor') => {
  const ranges = {
    excellent: { min: 3, max: 5 },
    good: { min: 5, max: 7 },
    fair: { min: 7, max: 10 },
    poor: { min: 10, max: 15 },
  };

  return ranges[creditType] || ranges.good;
};

