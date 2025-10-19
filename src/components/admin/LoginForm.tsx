import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, LogIn } from 'lucide-react';
// import { Input } from '../ui/Input'; // לא בשימוש
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';

interface LoginFormProps {
  onSuccess: () => void;
}

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: loginError } = await login(email, password);

    if (loginError) {
      setError(loginError);
      setLoading(false);
    } else {
      onSuccess();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 px-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* לוגו */}
          <div className="text-center mb-8">
            <div className="text-3xl font-bold mb-2">
              <span className="text-primary">NEW</span>
              <span className="text-dark">CAR</span>
            </div>
            <h1 className="text-2xl font-bold text-dark mb-2">מערכת ניהול</h1>
            <p className="text-darkGray">ניו קאר חדרה</p>
          </div>

          {/* טופס */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                placeholder="אימייל"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div className="relative">
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="password"
                placeholder="סיסמה"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
              <LogIn className="h-5 w-5 ml-2" />
              כניסה למערכת
            </Button>
          </form>

          {/* הערה למפתחים */}
          {import.meta.env.VITE_DEV_MODE === 'true' && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800 mb-2">
                <strong>מצב פיתוח:</strong>
              </p>
              <p className="text-xs text-blue-700">
                admin@newcar.co.il / admin123
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

