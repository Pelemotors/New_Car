import { motion } from 'framer-motion';
import { Shield, Heart, Award, Users } from 'lucide-react';
import { Card } from '../components/ui/Card';

const AboutPage = () => {
  const values = [
    {
      icon: Shield,
      title: 'יושרה ושקיפות',
      description: 'אין אותיות קטנות, יש שיחה פתוחה ומחירים הוגנים',
    },
    {
      icon: Heart,
      title: 'שירות אנושי',
      description: 'אנחנו זמינים לדבר, להסביר וללוות',
    },
    {
      icon: Award,
      title: 'מקצועיות',
      description: 'התאמה אישית של הרכב לצרכים, לתקציב ולתחזוקה',
    },
    {
      icon: Users,
      title: 'אחריות',
      description: 'בדיקה לפני מסירה ואפשרויות אחריות',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-secondary/5 section-padding">
        <div className="container-max">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-dark mb-6">
              מי אנחנו – ניו קאר חדרה
            </h1>
          </motion.div>
        </div>
      </section>

      {/* About Content */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="prose prose-lg max-w-none"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <p className="text-xl text-darkGray leading-relaxed mb-6">
                ניו קאר היא סוכנות רכב משפחתית שפועלת בחדרה כבר יותר מ-15 שנים. אב המשפחה ושני בניו מנהלים את העסק מיד-על-הלב: יחס אישי, שקיפות מלאה ומקצועיות שמבוססת על ניסיון של אלפי עסקאות.
              </p>
              <p className="text-xl text-darkGray leading-relaxed mb-6">
                אנחנו מאמינים שרכב קונים בראש שקט — ולכן תמצאו אצלנו תהליך ברור, בדיקות מסודרות, הצעות מימון נוחות והתחייבות לטרייד-אין הוגן.
              </p>
              <p className="text-xl text-darkGray leading-relaxed">
                גדלנו בקהילה המקומית ואנחנו ממשיכים ללוות לקוחות שחוזרים להחליף רכב גם אחרי שנים. זה לא מובן מאליו, וזה הכוח שלנו.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* הערכים שלנו */}
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">הערכים שלנו</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card hoverable padding="lg" className="text-center h-full">
                  <value.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-dark mb-3">{value.title}</h3>
                  <p className="text-darkGray leading-relaxed">{value.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* פרטי העסק */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <motion.div
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card padding="lg" className="bg-gradient-to-br from-primary/5 to-secondary/5">
              <h3 className="text-2xl font-bold text-dark mb-6 text-center">פרטי התקשרות</h3>
              <div className="space-y-4 text-lg">
                <div>
                  <span className="font-semibold text-dark">כתובת:</span>{' '}
                  <span className="text-darkGray">ניו קאר חדרה (בוויז), רח׳ השלום, חדרה</span>
                </div>
                <div>
                  <span className="font-semibold text-dark">טלפון:</span>{' '}
                  <a href="tel:04-994-9994" className="text-primary hover:underline">
                    04-994-9994
                  </a>
                </div>
                <div>
                  <span className="font-semibold text-dark">שעות פעילות:</span>{' '}
                  <span className="text-darkGray">א׳–ה׳ 09:00–18:00 | ו׳ 09:00–13:00</span>
                </div>
                <div>
                  <span className="font-semibold text-dark">וואטסאפ/נייד מכירות – שלמה:</span>{' '}
                  <a
                    href="https://wa.me/972543034759"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    +972-54-303-4759
                  </a>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;

