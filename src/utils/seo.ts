// SEO Metadata לכל דפי האתר
// מבוסס על קובץ SEO

export interface PageMeta {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
}

// פרטי האתר
const SITE_NAME = 'ניו קאר חדרה';
const SITE_URL = 'https://newcar-hadera.co.il';

// Metadata לכל דף
export const pageMeta: Record<string, PageMeta> = {
  home: {
    title: 'ניו קאר חדרה – קנייה, מכירה, טרייד-אין ומימון רכב | 15 שנות אמינות',
    description: 'סוכנות רכב משפחתית בחדרה. קנייה, מכירה, טרייד-אין ומימון מהיר, בדיקה ואחריות. יחס אישי ושקיפות מלאה. לתיאום מבחן נסיעה: 04-994-9994.',
    keywords: [
      'רכבים בחדרה',
      'סוכנות רכב חדרה',
      'קנייה רכב יד שנייה חדרה',
      'מכירת רכב חדרה',
      'טרייד אין חדרה',
      'מימון רכב חדרה',
      'ניו קאר חדרה',
      'רכב משפחתי',
      'רכב חסכוני',
    ],
  },

  about: {
    title: 'אודות ניו קאר חדרה – סוכנות רכב משפחתית עם 15 שנות ניסיון',
    description: 'מי אנחנו, הערכים והשירות: אמינות, שקיפות ושירות אישי. ניו קאר – סוכנות רכב משפחתית בחדרה, קנייה/מכירה/טרייד-אין/מימון.',
    keywords: ['אודות ניו קאר', 'סוכנות משפחתית', '15 שנות ניסיון', 'חדרה'],
  },

  cars: {
    title: 'מלאי רכבים יד שנייה – NEWCAR חדרה',
    description: 'דפדפו במבחר הרכבים המעודכן שלנו. כל רכב עבר בדיקה מלאה ומגיע עם אפשרות אחריות. טרייד-אין ומימון זמינים.',
    keywords: [
      'רכבים יד שנייה בחדרה',
      'מלאי רכבים',
      'גלריית רכבים',
      'רכבים למכירה',
      'רכב משומש חדרה',
    ],
  },

  contact: {
    title: 'צור קשר – ניו קאר חדרה | טלפון 04-994-9994 | וואטסאפ ‎+972-54-303-4759',
    description: 'שאלות על רכב? רוצים הערכת טרייד-אין או מימון? השאירו פרטים או התקשרו. כתובת בוויז: "ניו קאר חדרה", רח׳ השלום.',
    keywords: ['צור קשר', 'טלפון', 'WhatsApp', 'כתובת', 'שעות פעילות'],
  },

  services: {
    title: 'שירותים – קנייה, מכירה, טרייד-אין ומימון רכב בחדרה | ניו קאר',
    description: 'התאמת רכב לצרכים ותקציב, טרייד-אין הוגן ומסלולי מימון נוחים. תיאום מבחן נסיעה מהיר. ניו קאר חדרה.',
    keywords: ['שירותי רכב', 'קנייה', 'מכירה', 'טרייד-אין', 'מימון'],
  },
};

/**
 * יצירת Meta tags לדף
 */
export const generateMetaTags = (page: keyof typeof pageMeta) => {
  const meta = pageMeta[page] || pageMeta.home;
  
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords?.join(', '),
    'og:title': meta.title,
    'og:description': meta.description,
    'og:type': 'website',
    'og:url': `${SITE_URL}`,
    'og:site_name': SITE_NAME,
    'og:locale': 'he_IL',
  };
};

/**
 * יצירת Structured Data (Schema.org) לעסק מקומי
 */
export const getLocalBusinessSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'AutomotiveBusiness',
    name: SITE_NAME,
    image: `${SITE_URL}/logo.png`,
    '@id': SITE_URL,
    url: SITE_URL,
    telephone: '04-994-9994',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'רח׳ השלום',
      addressLocality: 'חדרה',
      addressCountry: 'IL',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 32.4344, // לעדכן לפי המיקום האמיתי
      longitude: 34.9182,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
        opens: '09:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Friday',
        opens: '09:00',
        closes: '13:00',
      },
    ],
    sameAs: [
      import.meta.env.VITE_FACEBOOK_URL,
      import.meta.env.VITE_INSTAGRAM_URL,
    ].filter(Boolean),
  };
};

/**
 * יצירת Structured Data לרכב בודד
 */
export const getCarSchema = (car: {
  name: string;
  manufacturer: string;
  model: string;
  year: number;
  price: number;
  km: number;
  fuel: string;
  transmission: string;
  description?: string;
  images: string[];
}) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Car',
    name: `${car.manufacturer} ${car.model} ${car.year}`,
    brand: {
      '@type': 'Brand',
      name: car.manufacturer,
    },
    model: car.model,
    vehicleModelDate: car.year,
    mileageFromOdometer: {
      '@type': 'QuantitativeValue',
      value: car.km,
      unitCode: 'KMT',
    },
    fuelType: car.fuel,
    vehicleTransmission: car.transmission,
    offers: {
      '@type': 'Offer',
      price: car.price,
      priceCurrency: 'ILS',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: SITE_NAME,
      },
    },
    description: car.description,
    image: car.images,
  };
};

