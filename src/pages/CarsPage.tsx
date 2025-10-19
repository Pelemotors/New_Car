import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal } from 'lucide-react';
import { CarCard } from '../components/cars/CarCard';
// import { Input } from '../components/ui/Input'; // לא בשימוש
import { Button } from '../components/ui/Button';
import { supabase } from '../utils/supabase';
import type { Car } from '../types';

const CarsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // טעינת רכבים מ-Supabase
  useEffect(() => {
    const loadCars = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('cars')
          .select('*')
          .eq('is_published', true)
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error loading cars:', error);
          throw new Error(`שגיאה בטעינת הרכבים: ${error.message}`);
        }

        setCars(data || []);
      } catch (err: any) {
        console.error('Error in loadCars:', err);
        setError(err.message || 'שגיאה בטעינת הרכבים');
        setCars([]);
      } finally {
        setLoading(false);
      }
    };

    loadCars();
  }, []);

  // סינון פשוט לפי חיפוש
  const filteredCars = cars.filter((car) => {
    if (!searchTerm) return true;
    
    const search = searchTerm.toLowerCase();
    return (
      car.manufacturer.toLowerCase().includes(search) ||
      car.model.toLowerCase().includes(search) ||
      car.year.toString().includes(search)
    );
  });

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/5 to-secondary/5 section-padding">
        <div className="container-max">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-dark mb-6">
              רכבים יד שנייה בחדרה – גלריית מלאי
            </h1>
            <p className="text-xl text-darkGray max-w-3xl mx-auto">
              דפדפו במבחר הרכבים המעודכן שלנו. כל רכב עבר בדיקה מלאה ומגיע עם אפשרות אחריות. 
              ניתן לתאם מבחן נסיעה ולשלב טרייד-אין ומימון.
            </p>
          </motion.div>

          {/* חיפוש */}
          <motion.div
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="חיפוש לפי יצרן, דגם או שנה..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-12 pl-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-lg"
                />
              </div>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowFilters(!showFilters)}
                className="hidden md:flex"
              >
                <SlidersHorizontal className="h-5 w-5 ml-2" />
                סינונים
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* רשימת רכבים */}
      <section className="section-padding bg-white">
        <div className="container-max">
          {/* הודעות טעינה ושגיאה */}
          {loading && (
            <div className="text-center py-16">
              <p className="text-xl text-darkGray">טוען רכבים...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-16">
              <p className="text-xl text-red-600 mb-4">{error}</p>
              <Button variant="primary" onClick={() => window.location.reload()}>
                נסה שוב
              </Button>
            </div>
          )}

          {/* מספר תוצאות */}
          {!loading && !error && (
            <div className="mb-8">
              <p className="text-lg text-darkGray">
                נמצאו <span className="font-bold text-dark">{filteredCars.length}</span> רכבים
                {searchTerm && (
                  <span>
                    {' '}
                    עבור "<span className="font-semibold">{searchTerm}</span>"
                  </span>
                )}
              </p>
            </div>
          )}

          {/* Grid של רכבים */}
          {!loading && !error && filteredCars.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCars.map((car, index) => (
                <CarCard key={car.id} car={car} index={index} />
              ))}
            </div>
          )}

          {/* אין תוצאות */}
          {!loading && !error && filteredCars.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl text-darkGray mb-4">
                {searchTerm ? 'לא נמצאו רכבים התואמים את החיפוש' : 'אין רכבים זמינים כרגע'}
              </p>
              {searchTerm && (
                <Button variant="primary" onClick={() => setSearchTerm('')}>
                  נקה חיפוש
                </Button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-50 section-padding">
        <div className="container-max text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-dark mb-4">לא מצאתם את מה שחיפשתם?</h2>
            <p className="text-xl text-darkGray mb-6">
              דברו איתנו ונמצא לכם את הרכב המושלם לצרכים שלכם
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://wa.me/972543034759" target="_blank" rel="noopener noreferrer">
                <Button variant="primary" size="lg">
                  שיחה בWhatsApp
                </Button>
              </a>
              <a href="tel:04-994-9994">
                <Button variant="secondary" size="lg">
                  התקשרו: 04-994-9994
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default CarsPage;

