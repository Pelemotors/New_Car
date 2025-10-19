import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Gauge, Cog, Fuel, Eye, MapPin } from 'lucide-react';
import type { Car } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface CarCardProps {
  car: Car;
  index?: number;
}

export const CarCard = ({ car, index = 0 }: CarCardProps) => {
  const formatPrice = (price: number) => {
    return `₪${price.toLocaleString('he-IL')}`;
  };

  const formatKm = (km: number) => {
    return `${km.toLocaleString('he-IL')} ק"מ`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Link to={`/car/${car.slug}`}>
        <Card hoverable padding="none" className="h-full">
          {/* תמונה */}
          <div className="relative h-48 bg-gray-200 overflow-hidden">
            {car.images && car.images.length > 0 ? (
              <img
                src={car.images[0]}
                alt={`${car.manufacturer} ${car.model} ${car.year}`}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                <MapPin className="h-16 w-16 text-gray-400" />
              </div>
            )}

            {/* תגיות */}
            <div className="absolute top-3 right-3 flex gap-2">
              {car.inventory_status === 'reserved' && (
                <Badge variant="warning" size="sm">
                  שמור
                </Badge>
              )}
              {car.has_warranty && (
                <Badge variant="success" size="sm">
                  אחריות
                </Badge>
              )}
              {car.previous_price && car.previous_price > car.price && (
                <Badge variant="error" size="sm">
                  מבצע!
                </Badge>
              )}
            </div>

            {/* צפיות */}
            {car.views && (
              <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/50 text-white px-2 py-1 rounded text-xs">
                <Eye className="h-3 w-3" />
                <span>{car.views}</span>
              </div>
            )}
          </div>

          {/* תוכן */}
          <div className="p-4">
            {/* כותרת */}
            <h3 className="text-xl font-bold text-dark mb-2 line-clamp-1">
              {car.manufacturer} {car.model}
            </h3>

            {/* מחיר */}
            <div className="mb-4">
              <div className="text-2xl font-bold text-primary">{formatPrice(car.price)}</div>
              {car.previous_price && car.previous_price > car.price && (
                <div className="text-sm text-gray-500 line-through">
                  {formatPrice(car.previous_price)}
                </div>
              )}
            </div>

            {/* פרטים */}
            <div className="grid grid-cols-2 gap-3 text-sm text-darkGray mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-secondary" />
                <span>{car.year}</span>
              </div>
              <div className="flex items-center gap-2">
                <Gauge className="h-4 w-4 text-secondary" />
                <span>{formatKm(car.km)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Cog className="h-4 w-4 text-secondary" />
                <span>{car.transmission === 'automatic' ? 'אוטומט' : 'ידני'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Fuel className="h-4 w-4 text-secondary" />
                <span>
                  {car.fuel === 'gasoline'
                    ? 'בנזין'
                    : car.fuel === 'diesel'
                    ? 'דיזל'
                    : car.fuel === 'hybrid'
                    ? 'היברידי'
                    : 'חשמלי'}
                </span>
              </div>
            </div>

            {/* יד */}
            <div className="text-sm text-gray-600 mb-4">
              יד <span className="font-semibold">{car.hand}</span>
            </div>

            {/* כפתור */}
            <div className="pt-4 border-t border-gray-200">
              <span className="text-primary font-semibold hover:text-primary-600 transition-colors">
                לפרטים נוספים ←
              </span>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
};

