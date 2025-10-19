import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Car, Shield, DollarSign, CheckCircle, Phone, MessageCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { supabase } from '../utils/supabase';
import type { Car as CarType } from '../types';

const WHATSAPP_NUMBER = import.meta.env.VITE_CONTACT_WHATSAPP || '972543034759';

const HomePageNew = () => {
  const [featuredCars, setFeaturedCars] = useState<CarType[]>([]);
  const [loading, setLoading] = useState(true);

  // טעינת 3 רכבים מומלצים
  useEffect(() => {
    const loadFeaturedCars = async () => {
      try {
        setLoading(true);
        
        // טעינת כל הרכבים הזמינים
        const { data: allCars, error } = await supabase
          .from('cars')
          .select('*')
          .eq('is_published', true)
          .eq('is_active', true)
          .eq('is_sold', false)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error loading cars:', error);
          return;
        }

        if (!allCars || allCars.length === 0) {
          return;
        }

        // מציאת 3 הרכבים המומלצים
        const cars = allCars;
        
        // 1. הקמ הכי נמוך
        const lowestKmCar = cars.reduce((min, car) => 
          car.km < min.km ? car : min
        );
        
        // 2. המחיר הכי נמוך
        const lowestPriceCar = cars.reduce((min, car) => 
          car.price < min.price ? car : min
        );
        
        // 3. השילוב הטוב ביותר (קמ נמוך + מחיר נמוך + יד נמוכה)
        const bestValueCar = cars.reduce((best, car) => {
          const bestScore = (best.km / 1000) + (best.price / 10000) + (parseInt(best.hand) * 10);
          const carScore = (car.km / 1000) + (car.price / 10000) + (parseInt(car.hand) * 10);
          return carScore < bestScore ? car : best;
        });

        // יצירת רשימה ייחודית
        const featured = [];
        if (lowestKmCar) featured.push({ ...lowestKmCar, reason: 'הקמ הנמוך ביותר' });
        if (lowestPriceCar && lowestPriceCar.id !== lowestKmCar?.id) {
          featured.push({ ...lowestPriceCar, reason: 'המחיר הנמוך ביותר' });
        }
        if (bestValueCar && bestValueCar.id !== lowestKmCar?.id && bestValueCar.id !== lowestPriceCar?.id) {
          featured.push({ ...bestValueCar, reason: 'השילוב הטוב ביותר' });
        }

        setFeaturedCars(featured.slice(0, 3));
      } catch (err) {
        console.error('Error in loadFeaturedCars:', err);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedCars();
  }, []);

  return (
    <div>
      {/* Hero Section - עיצוב חדש */}
      <section className="bg-gradient-to-br from-gray-50 via-white to-gray-100 section-padding">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* כרטיס ויזואלי - צד שמאל */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="order-2 lg:order-1"
            >
              <div className="relative">
                <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 rounded-3xl p-12 h-96 flex flex-col items-center justify-center shadow-xl">
                  <div className="text-6xl mb-6">🚗</div>
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-dark mb-2">15 שנות ניסיון</h2>
                    <p className="text-lg text-darkGray">אלפי לקוחות מרוצים</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* תוכן ראשי - צד ימין */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="order-1 lg:order-2 space-y-8"
            >
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-dark mb-4">
                  רכב בראש שקט
                </h1>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6">
                  מהמשפחה שלנו אל שלכם
                </h1>
              </div>
              
              <p className="text-xl text-darkGray leading-relaxed">
                15 שנים של אמינות, שקיפות ושירות אישי בחדרה. ניו קאר מציעה קנייה, מכירה, טרייד־אין ומימון מהיר — כדי שתצאו לדרך בטוחה ובמחיר הוגן.
              </p>
              
              <div className="space-y-4">
                <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto text-lg px-8 py-4">
                    <MessageCircle className="h-5 w-5 ml-2" />
                    תאמו מבחן נסיעה להיום
                  </Button>
                </a>
                <a href="/contact">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-4 border-primary text-primary hover:bg-primary hover:text-white">
                    בואו לקפה והצעת טרייד־אין הוגנת
                  </Button>
                </a>
              </div>
              
              <div className="pt-4">
                <p className="text-sm text-darkGray">
                  קנייה • מכירה • טרייד־אין • מימון מהיר • בדיקה ואחריות
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* יתרונות */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
              למה לבחור בנו?
            </h2>
            <p className="text-xl text-darkGray max-w-2xl mx-auto">
              אמינות, שקיפות ושירות אישי - זה מה שמבדיל אותנו מהשאר
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: "אמינות מוכחת",
                description: "15 שנות ניסיון עם אלפי לקוחות מרוצים"
              },
              {
                icon: DollarSign,
                title: "מחירים הוגנים",
                description: "שקיפות מלאה ללא הפתעות או עמלות נסתרות"
              },
              {
                icon: CheckCircle,
                title: "בדיקה מקיפה",
                description: "כל רכב עובר בדיקה מקצועית ואחריות מלאה"
              },
              {
                icon: Phone,
                title: "שירות אישי",
                description: "ליווי צמוד מהרגע הראשון ועד למסירת המפתחות"
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="p-6 text-center h-full hover:shadow-lg transition-shadow">
                  <benefit.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-dark mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-darkGray">
                    {benefit.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* רכבים מובילים */}
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
              הרכבים המובילים שלנו
            </h2>
            <p className="text-xl text-darkGray max-w-2xl mx-auto">
              מבחר רכבים איכותיים ומתוחזקים היטב
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              // טעינה
              [1, 2, 3].map((index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden">
                    <div className="h-48 bg-gray-200 animate-pulse"></div>
                    <div className="p-6">
                      <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse mb-4"></div>
                      <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </Card>
                </motion.div>
              ))
            ) : featuredCars.length > 0 ? (
              // רכבים אמיתיים
              featuredCars.map((car, index) => (
                <motion.div
                  key={car.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-48 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center relative">
                      {car.images && car.images.length > 0 ? (
                        <img
                          src={car.images[0]}
                          alt={`${car.manufacturer} ${car.model}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDIwMCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTI4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04MCA0OEgxMjBWODBIODBWNDhaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik05MCA1OEgxMTBWNzBIOTBWNThaIiBmaWxsPSIjRjNGNEY2Ii8+Cjwvc3ZnPgo=';
                          }}
                        />
                      ) : (
                        <span className="text-6xl">🚗</span>
                      )}
                      {/* תגית סיבה */}
                      <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded-full text-xs font-medium">
                        {(car as any).reason}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-dark mb-2">
                        {car.manufacturer} {car.model} {car.year}
                      </h3>
                      <div className="space-y-2 text-darkGray mb-4">
                        <p>קילומטראז׳: {car.km?.toLocaleString()} ק״מ</p>
                        <p>יד: {car.hand}</p>
                        <p className="text-lg font-semibold text-primary">
                          ₪{car.price?.toLocaleString()}
                        </p>
                      </div>
                      <a href={`/cars/${car.slug}`}>
                        <Button className="w-full">
                          צפה ברכב
                        </Button>
                      </a>
                    </div>
                  </Card>
                </motion.div>
              ))
            ) : (
              // אין רכבים
              <div className="col-span-full text-center py-12">
                <p className="text-xl text-darkGray">אין רכבים זמינים כרגע</p>
                <a href="/cars" className="mt-4 inline-block">
                  <Button variant="outline">צפה בכל הרכבים</Button>
                </a>
              </div>
            )}
          </div>

          <div className="text-center mt-12">
            <a href="/cars">
              <Button size="lg" variant="outline">
                צפה בכל הרכבים
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-primary text-white">
        <div className="container-max text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            מוכנים למצוא את הרכב המושלם?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            בואו נפגש לקפה ונמצא יחד את הרכב שמתאים בדיוק לכם
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="secondary" className="text-primary">
                <MessageCircle className="h-5 w-5 ml-2" />
                תאמו פגישה
              </Button>
            </a>
            <a href="tel:04-994-9994">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                <Phone className="h-5 w-5 ml-2" />
                04-994-9994
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePageNew;
