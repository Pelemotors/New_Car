import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Home,
  Calendar,
  Gauge,
  Cog,
  Fuel,
  Palette,
  Shield,
  MessageCircle,
  Phone,
  CheckCircle,
  // ArrowRight, // לא בשימוש
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { FinanceCalculator } from '../components/cars/FinanceCalculator';
import { CarCard } from '../components/cars/CarCard';
import type { Car } from '../types';
import { supabase } from '../utils/supabase';
import { createCarInquiryMessage, openWhatsApp } from '../utils/whatsapp';

const CarDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [car, setCar] = useState<Car | null>(null);
  const [similarCars, setSimilarCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // טעינת רכב מ-Supabase
  useEffect(() => {
    const loadCar = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('cars')
          .select('*')
          .eq('slug', slug)
          .eq('is_published', true)
          .single();

        if (error) {
          console.error('Supabase error:', error);
          setError('שגיאה בטעינת פרטי הרכב');
          setCar(null);
        } else {
          setCar(data);
          
          // טעינת רכבים דומים
          if (data) {
            const { data: similar } = await supabase
              .from('cars')
              .select('*')
              .eq('manufacturer', data.manufacturer)
              .eq('is_published', true)
              .eq('is_sold', false)
              .neq('id', data.id)
              .limit(3);
            
            setSimilarCars(similar || []);
          }
        }
      } catch (err) {
        console.error('Error loading car:', err);
        setError('שגיאה בטעינת פרטי הרכב');
        setCar(null);
      } finally {
        setLoading(false);
      }
    };

    loadCar();
  }, [slug]);

  if (loading) {
    return (
      <div className="section-padding container-max text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-darkGray">טוען פרטי רכב...</p>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="section-padding container-max text-center">
        <h1 className="text-4xl font-bold text-dark mb-4">רכב לא נמצא</h1>
        <p className="text-xl text-darkGray mb-8">מצטערים, הרכב שחיפשתם אינו זמין</p>
        <Link to="/cars">
          <Button variant="primary">חזרה לגלריה</Button>
        </Link>
      </div>
    );
  }

  const formatPrice = (price: number) => `₪${price.toLocaleString('he-IL')}`;
  const formatKm = (km: number) => `${km.toLocaleString('he-IL')} ק"מ`;

  const handleWhatsAppClick = () => {
    const message = createCarInquiryMessage(`${car.manufacturer} ${car.model} ${car.year}`, car.id);
    openWhatsApp(message);
  };

  return (
    <div>
      {/* Breadcrumb */}
      <section className="bg-gray-50 py-4">
        <div className="container-max">
          <div className="flex items-center gap-2 text-sm text-darkGray">
            <Link to="/" className="hover:text-primary flex items-center gap-1">
              <Home className="h-4 w-4" />
              בית
            </Link>
            <span>/</span>
            <Link to="/cars" className="hover:text-primary">
              רכבים
            </Link>
            <span>/</span>
            <span className="text-dark font-medium">
              {car.manufacturer} {car.model} {car.year}
            </span>
          </div>
        </div>
      </section>

      {/* פרטי הרכב */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* עמודה ראשית - תמונות ופרטים */}
            <div className="lg:col-span-2 space-y-8">
              {/* כותרת ומחיר */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-dark mb-2">
                      {car.manufacturer} {car.model} {car.year}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge variant="default">יד {car.hand}</Badge>
                      {car.has_warranty && <Badge variant="success">אחריות {car.warranty_months} חודשים</Badge>}
                      {car.inventory_status === 'reserved' && <Badge variant="warning">שמור</Badge>}
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="text-4xl font-bold text-primary">{formatPrice(car.price)}</div>
                    {car.previous_price && car.previous_price > car.price && (
                      <div className="text-lg text-gray-500 line-through">{formatPrice(car.previous_price)}</div>
                    )}
                  </div>
                </div>

                {/* גלריית תמונות */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {car.images.map((image, index) => (
                    <div key={index} className="aspect-video bg-gray-200 rounded-xl overflow-hidden">
                      <img src={image} alt={`${car.manufacturer} ${car.model} - תמונה ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* פרטים טכניים */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Card padding="lg">
                  <h2 className="text-2xl font-bold text-dark mb-6">פרטים טכניים</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-secondary mt-0.5" />
                      <div>
                        <div className="text-sm text-gray-600">שנה</div>
                        <div className="font-bold text-dark">{car.year}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Gauge className="h-5 w-5 text-secondary mt-0.5" />
                      <div>
                        <div className="text-sm text-gray-600">קילומטראז'</div>
                        <div className="font-bold text-dark">{formatKm(car.km)}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Cog className="h-5 w-5 text-secondary mt-0.5" />
                      <div>
                        <div className="text-sm text-gray-600">תיבת הילוכים</div>
                        <div className="font-bold text-dark">{car.transmission === 'automatic' ? 'אוטומטית' : 'ידנית'}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Fuel className="h-5 w-5 text-secondary mt-0.5" />
                      <div>
                        <div className="text-sm text-gray-600">סוג דלק</div>
                        <div className="font-bold text-dark">
                          {car.fuel === 'gasoline'
                            ? 'בנזין'
                            : car.fuel === 'diesel'
                            ? 'דיזל'
                            : car.fuel === 'hybrid'
                            ? 'היברידי'
                            : 'חשמלי'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Palette className="h-5 w-5 text-secondary mt-0.5" />
                      <div>
                        <div className="text-sm text-gray-600">צבע</div>
                        <div className="font-bold text-dark">{car.color}</div>
                      </div>
                    </div>
                    {car.engine_size && (
                      <div className="flex items-start gap-3">
                        <Cog className="h-5 w-5 text-secondary mt-0.5" />
                        <div>
                          <div className="text-sm text-gray-600">נפח מנוע</div>
                          <div className="font-bold text-dark">{car.engine_size} סמ"ק</div>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>

              {/* תיאור */}
              {car.description && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <Card padding="lg">
                    <h2 className="text-2xl font-bold text-dark mb-4">תיאור</h2>
                    <p className="text-lg text-darkGray leading-relaxed">{car.description}</p>
                  </Card>
                </motion.div>
              )}

              {/* תכונות */}
              {car.features && car.features.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <Card padding="lg">
                    <h2 className="text-2xl font-bold text-dark mb-4">תכונות ואבזור</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {car.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                          <span className="text-darkGray">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              )}
            </div>

            {/* Sidebar - CTA ומחשבון */}
            <div className="space-y-6">
              {/* CTA קשר */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card padding="lg" className="bg-primary text-white sticky top-24">
                  <h3 className="text-2xl font-bold mb-4">מעוניינים ברכב?</h3>
                  <p className="mb-6 text-blue-100">
                    צרו קשר עכשיו לתיאום מבחן נסיעה או לקבלת פרטים נוספים
                  </p>
                  <div className="space-y-3">
                    <Button
                      variant="secondary"
                      size="lg"
                      fullWidth
                      onClick={handleWhatsAppClick}
                      className="bg-white text-primary hover:bg-gray-100"
                    >
                      <MessageCircle className="h-5 w-5 ml-2" />
                      שלח הודעה בWhatsApp
                    </Button>
                    <a href="tel:04-994-9994" className="block">
                      <Button variant="outline" size="lg" fullWidth className="border-white text-white hover:bg-white hover:text-primary">
                        <Phone className="h-5 w-5 ml-2" />
                        התקשרו: 04-994-9994
                      </Button>
                    </a>
                  </div>
                  
                  {car.has_warranty && (
                    <div className="mt-6 pt-6 border-t border-blue-400">
                      <div className="flex items-center gap-2 text-blue-100">
                        <Shield className="h-5 w-5" />
                        <span className="text-sm">כולל אחריות {car.warranty_months} חודשים</span>
                      </div>
                    </div>
                  )}
                </Card>
              </motion.div>

              {/* מחשבון מימון */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <FinanceCalculator carPrice={car.price} />
              </motion.div>
            </div>
          </div>

          {/* רכבים דומים */}
          {similarCars.length > 0 && (
            <motion.div
              className="mt-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-dark mb-8">רכבים דומים</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {similarCars.map((similarCar, index) => (
                  <CarCard key={similarCar.id} car={similarCar} index={index} />
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CarDetailPage;

