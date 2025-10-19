import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Car as CarIcon, Users, TrendingUp, DollarSign, Eye, Calendar, Trash2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { clearAllMockData } from '../../utils/clearMockData';
import { useState, useEffect } from 'react';
import type { Car } from '../../types';
import { supabase } from '../../utils/supabase';

export const Dashboard = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // טעינת רכבים מ-Supabase
  useEffect(() => {
    const loadCars = async () => {
      try {
        setLoading(true);
        
        const { data: supabaseCars, error } = await supabase
          .from('cars')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Supabase error:', error);
          setError('שגיאה בטעינת נתונים מ-Supabase');
          setCars([]);
        } else {
          setCars(supabaseCars || []);
        }
      } catch (error) {
        console.error('Error loading cars:', error);
        setError('שגיאה בטעינת נתונים');
        setCars([]);
      } finally {
        setLoading(false);
      }
    };

    loadCars();
  }, []);

  // סטטיסטיקות
  const stats = {
    totalCars: cars.length,
    availableCars: cars.filter((c) => c.inventory_status === 'available' && !c.is_sold).length,
    soldThisMonth: cars.filter((c) => c.is_sold).length,
    totalViews: cars.reduce((sum, car) => sum + (car.views || 0), 0),
  };

  const statsCards = [
    {
      title: 'רכבים במלאי',
      value: stats.availableCars,
      icon: CarIcon,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'לידים פעילים',
      value: 0, // נעדכן כשנוסיף לידים אמיתיים
      icon: Users,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
    {
      title: 'נמכרו החודש',
      value: stats.soldThisMonth,
      icon: TrendingUp,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      title: 'צפיות סה"כ',
      value: stats.totalViews,
      icon: Eye,
      color: 'text-orange-500',
      bgColor: 'bg-orange-100',
    },
  ];

  // רכבים אחרונים
  const recentCars = cars.slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-darkGray">טוען נתונים...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">שגיאה בטעינת נתונים</h3>
            <p className="mb-4">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              variant="primary"
            >
              נסה שוב
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* כותרת */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-dark mb-2">דשבורד</h1>
        <p className="text-darkGray">ברוך הבא למערכת ניהול ניו קאר חדרה</p>
      </motion.div>

      {/* כרטיסי סטטיסטיקות */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card padding="lg" hoverable>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-darkGray mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-dark">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* רכבים אחרונים */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card padding="lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-dark">רכבים אחרונים</h2>
            <Link to="/admin/cars">
              <Button variant="outline" size="sm">
                צפה בכל הרכבים
              </Button>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-right py-3 px-4 text-sm font-semibold text-darkGray">רכב</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-darkGray">שנה</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-darkGray">ק"מ</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-darkGray">מחיר</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-darkGray">סטטוס</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-darkGray">צפיות</th>
                </tr>
              </thead>
              <tbody>
                {recentCars.map((car) => (
                  <tr key={car.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="font-medium text-dark">
                        {car.manufacturer} {car.model}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-darkGray">{car.year}</td>
                    <td className="py-4 px-4 text-darkGray">{car.km.toLocaleString('he-IL')}</td>
                    <td className="py-4 px-4 font-semibold text-dark">
                      ₪{car.price.toLocaleString('he-IL')}
                    </td>
                    <td className="py-4 px-4">
                      <Badge
                        variant={
                          car.inventory_status === 'available'
                            ? 'success'
                            : car.inventory_status === 'reserved'
                            ? 'warning'
                            : 'default'
                        }
                        size="sm"
                      >
                        {car.inventory_status === 'available' ? 'זמין' : car.inventory_status === 'reserved' ? 'שמור' : 'נמכר'}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1 text-darkGray">
                        <Eye className="h-4 w-4" />
                        <span>{car.views || 0}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>

      {/* פעולות מהירות */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Card padding="lg">
          <h2 className="text-2xl font-bold text-dark mb-6">פעולות מהירות</h2>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <Link to="/admin/cars/new">
                     <Button variant="primary" fullWidth>
                       <CarIcon className="h-5 w-5 ml-2" />
                       הוסף רכב חדש
                     </Button>
                   </Link>
            <Link to="/admin/leads">
              <Button variant="secondary" fullWidth>
                <Users className="h-5 w-5 ml-2" />
                צפה בלידים
              </Button>
            </Link>
            <Link to="/" target="_blank">
              <Button variant="outline" fullWidth>
                <Eye className="h-5 w-5 ml-2" />
                צפה באתר
              </Button>
            </Link>
          </div>
          
          {/* כפתור ניקוי נתונים */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-dark mb-3">ניהול נתונים</h3>
            <Button 
              variant="outline" 
              onClick={() => {
                if (window.confirm('האם אתה בטוח שברצונך למחוק את כל נתוני הדמה? פעולה זו לא ניתנת לביטול.')) {
                  clearAllMockData();
                  window.location.reload();
                }
              }}
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 ml-2" />
              מחק כל נתוני הדמה
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

