import { motion } from 'framer-motion';
import { Car, Shield, DollarSign, CheckCircle, Phone, MessageCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

const WHATSAPP_NUMBER = import.meta.env.VITE_CONTACT_WHATSAPP || '972543034759';

const HomePage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-secondary/5 section-padding">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* טקסט */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-dark mb-6 leading-tight">
                רכב בראש שקט –<br />
                <span className="text-gradient">מהמשפחה שלנו אל שלכם</span>
              </h1>
              <p className="text-xl text-darkGray mb-8 leading-relaxed">
                15 שנים של אמינות, שקיפות ושירות אישי בחדרה. ניו קאר מציעה קנייה, מכירה, טרייד־אין ומימון מהיר — כדי שתצאו לדרך בטוחה ובמחיר הוגן.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">
                  <Button variant="primary" size="lg" fullWidth className="sm:w-auto">
                    <MessageCircle className="h-5 w-5 ml-2" />
                    תאמו מבחן נסיעה להיום
                  </Button>
                </a>
                <a href="/contact">
                  <Button variant="secondary" size="lg" fullWidth className="sm:w-auto">
                    בואו לקפה והצעת טרייד־אין הוגנת
                  </Button>
                </a>
              </div>
            </motion.div>

            {/* תמונה/איור */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative h-96 hidden lg:block"
            >
              <div className="w-full h-full bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 rounded-2xl flex items-center justify-center">
                <Car className="h-48 w-48 text-primary opacity-20" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* סקציית יתרונות */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
              למה לבחור בנו?
            </h2>
            <p className="text-xl text-darkGray max-w-3xl mx-auto">
              אותו מקום, אותו מספר ואותם אנשים כבר 15 שנה. יחס אישי, שקיפות מלאה ונסיעה בראש שקט.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: 'אמינות משפחתית',
                description: 'אותו מקום, אותו מספר ואותם אנשים כבר 15 שנה',
                color: 'text-primary',
              },
              {
                icon: CheckCircle,
                title: 'בדיקה ואחריות',
                description: 'כל רכב עובר בדיקה מלאה, עם אפשרויות אחריות',
                color: 'text-secondary',
              },
              {
                icon: Car,
                title: 'טרייד־אין הוגן',
                description: 'מקבלים את הרכב הישן ומורידים לכם כאב ראש',
                color: 'text-accent',
              },
              {
                icon: DollarSign,
                title: 'מימון נוח ומהיר',
                description: 'התאמת מסלולי מימון בשיתוף חברות מובילות',
                color: 'text-primary',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card hoverable padding="lg" className="text-center h-full">
                  <item.icon className={`h-12 w-12 ${item.color} mx-auto mb-4`} />
                  <h3 className="text-xl font-bold text-dark mb-3">{item.title}</h3>
                  <p className="text-darkGray leading-relaxed">{item.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* סקציית שירותים */}
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
              השירותים שלנו
            </h2>
            <p className="text-xl text-darkGray max-w-3xl mx-auto">
              מכירה • קנייה • טרייד־אין • מימון מהיר – במקום אחד
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: 'קנייה של רכב',
                description:
                  'מתאימים רכב לפי שימוש, תקציב ועלויות אחזקה. כל רכב עובר בדיקה מלאה ומתועדים יד, ק"מ והיסטוריה.',
                points: ['רכבים למשפחות', 'רכב ראשון', 'רכבי עבודה חסכוניים'],
              },
              {
                title: 'מכירת רכב',
                description:
                  'רוצים למכור בלי כאב ראש? נבצע הערכה מקצועית, נבדוק ביקוש, ונוכל לעזור בשיווק או לקנות מכם ישירות.',
                points: ['הערכה מקצועית', 'ביקוש שוק', 'קנייה ישירה'],
              },
              {
                title: 'טרייד-אין הוגן',
                description:
                  'מביאים את הרכב הישן, מקבלים הצעה במקום וממשיכים לרכב הבא. חוסכים זמן, פרסום ושיחות.',
                points: ['הצעה במקום', 'חיסכון בזמן', 'מחירים הוגנים'],
              },
              {
                title: 'מימון רכב',
                description:
                  'עובדים עם חברות מימון מובילות להתאמת מסלול שמתאים לכם. תהליך קצר, תשובה מהירה.',
                points: ['אישור מהיר', 'תנאים נוחים', 'שילוב מקדמה'],
              },
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card padding="lg" className="h-full">
                  <h3 className="text-2xl font-bold text-dark mb-4">{service.title}</h3>
                  <p className="text-darkGray mb-6 leading-relaxed">{service.description}</p>
                  <ul className="space-y-2">
                    {service.points.map((point, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                        <span className="text-darkGray">{point}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA סופי */}
      <section className="bg-primary text-white section-padding">
        <div className="container-max text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              מחפשים רכב מתאים למשפחה?
            </h2>
            <p className="text-xl mb-8 text-blue-100 max-w-3xl mx-auto">
              נשמח לארח אתכם, להסביר בשפה פשוטה ולבנות יחד את העסקה הנכונה לכם. קפה טוב, חיוך טוב, והצעה הוגנת.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-gray-100">
                  <MessageCircle className="h-5 w-5 ml-2" />
                  דברו איתנו בWhatsApp
                </Button>
              </a>
              <a href="tel:04-994-9994">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
                  <Phone className="h-5 w-5 ml-2" />
                  04-994-9994
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

