import { useState, useEffect } from 'react';
import { Calculator, TrendingUp } from 'lucide-react';
import { Card } from '../ui/Card';
// import { Input } from '../ui/Input'; // לא בשימוש
import { calculateFinance, formatCurrency } from '../../utils/finance';

interface FinanceCalculatorProps {
  carPrice: number;
}

export const FinanceCalculator = ({ carPrice }: FinanceCalculatorProps) => {
  const [downPayment, setDownPayment] = useState(Math.round(carPrice * 0.25));
  const [loanTerm, setLoanTerm] = useState(60); // 5 שנים
  const [interestRate, setInterestRate] = useState(5.5);
  const [result, setResult] = useState(calculateFinance(carPrice, downPayment, loanTerm, interestRate));

  useEffect(() => {
    setResult(calculateFinance(carPrice, downPayment, loanTerm, interestRate));
  }, [carPrice, downPayment, loanTerm, interestRate]);

  return (
    <Card padding="lg" className="bg-gradient-to-br from-secondary/5 to-accent/5">
      <div className="flex items-center gap-3 mb-6">
        <Calculator className="h-6 w-6 text-primary" />
        <h3 className="text-2xl font-bold text-dark">מחשבון מימון</h3>
      </div>

      <div className="space-y-6">
        {/* מחיר רכב */}
        <div>
          <label className="block text-sm font-medium text-dark mb-2">מחיר הרכב</label>
          <div className="text-2xl font-bold text-primary">{formatCurrency(carPrice)}</div>
        </div>

        {/* מקדמה */}
        <div>
          <label className="block text-sm font-medium text-dark mb-2">
            מקדמה ({Math.round((downPayment / carPrice) * 100)}%)
          </label>
          <input
            type="range"
            min={0}
            max={carPrice}
            step={1000}
            value={downPayment}
            onChange={(e) => setDownPayment(Number(e.target.value))}
            className="w-full"
          />
          <div className="mt-2">
            <input
              type="number"
              value={downPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* תקופת מימון */}
        <div>
          <label className="block text-sm font-medium text-dark mb-2">
            תקופת מימון ({loanTerm} חודשים / {Math.round(loanTerm / 12)} שנים)
          </label>
          <input
            type="range"
            min={12}
            max={84}
            step={12}
            value={loanTerm}
            onChange={(e) => setLoanTerm(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex gap-2 mt-2">
            {[36, 48, 60, 72].map((months) => (
              <button
                key={months}
                onClick={() => setLoanTerm(months)}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  loanTerm === months
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-darkGray hover:bg-gray-200'
                }`}
              >
                {months / 12} שנים
              </button>
            ))}
          </div>
        </div>

        {/* ריבית */}
        <div>
          <label className="block text-sm font-medium text-dark mb-2">ריבית שנתית ({interestRate}%)</label>
          <input
            type="range"
            min={2}
            max={15}
            step={0.5}
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full"
          />
          <div className="mt-2">
            <input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              step={0.1}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* תוצאות */}
        <div className="pt-6 border-t-2 border-primary/20">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-accent" />
            <h4 className="text-lg font-bold text-dark">תוצאות</h4>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-darkGray">תשלום חודשי משוער:</span>
              <span className="text-2xl font-bold text-primary">
                {formatCurrency(result.monthlyPayment)}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">סה"כ לתשלום:</span>
              <span className="font-semibold text-darkGray">{formatCurrency(result.totalPayment)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">סה"כ ריבית:</span>
              <span className="font-semibold text-darkGray">{formatCurrency(result.totalInterest)}</span>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>שימו לב:</strong> החישוב הוא משוער בלבד. התנאים הסופיים יקבעו על ידי חברת המימון 
              בהתאם לפרופיל האשראי שלכם.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

