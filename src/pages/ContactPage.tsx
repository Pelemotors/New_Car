import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, CheckCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

const PHONE_NUMBER = import.meta.env.VITE_CONTACT_PHONE || '04-994-9994';
const EMAIL = import.meta.env.VITE_CONTACT_EMAIL || 'info@newcar-hadera.co.il';
const ADDRESS = import.meta.env.VITE_BUSINESS_ADDRESS || "רח' השלום, חדרה";
const HOURS = import.meta.env.VITE_BUSINESS_HOURS || 'א׳-ה׳ 09:00-18:00, ו׳ 09:00-13:00';
const WHATSAPP = import.meta.env.VITE_CONTACT_WHATSAPP || '972543034759';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    carId: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // ולידציה בסיסית
    if (!formData.name.trim()) {
      setError('נא למלא שם מלא');
      setLoading(false);
      return;
    }

    if (!formData.message.trim()) {
      setError('נא למלא תוכן הפנייה');
      setLoading(false);
      return;
    }

    try {
      // שליחת מייל דרך EmailJS
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (serviceId && templateId && publicKey) {
        // אתחול EmailJS
        emailjs.init(publicKey);

        // הכנת פרמטרים לשליחה
        const templateParams = {
          from_name: formData.name,
          from_email: formData.email || 'לא סופק',
          from_phone: formData.phone || 'לא סופק',
          message: formData.message,
          car_id: formData.carId || 'לא צוין',
          to_email: 'easydevil227@gmail.com', // המייל שמקבל את ההודעות
        };

        // שליחת המייל
        await emailjs.send(serviceId, templateId, templateParams);
        console.log('מייל נשלח בהצלחה');
      } else {
        // אם אין הגדרות EmailJS, סימולציה בלבד
        console.log('EmailJS לא מוגדר - סימולציה של שליחה');
        console.log('טופס נשלח:', formData);
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }

      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', message: '', carId: '' });
    } catch (err: any) {
      console.error('שגיאה בשליחת מייל:', err);
      setError('שגיאה בשליחת הטופס. אנא נסו שוב או התקשרו אלינו.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/5 to-secondary/5 section-padding">
        <div className="container-max text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-dark mb-6">צור קשר – נשמח לעזור</h1>
            <p className="text-xl text-darkGray max-w-3xl mx-auto">
              שאלות על דגם מסוים? רוצים הערכת טרייד-אין? מחפשים מסלול מימון מתאים? השאירו פרטים ונדבר עוד היום.
            </p>
          </motion.div>
        </div>
      </section>

      {/* טופס ופרטי קשר */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* טופס */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card padding="lg">
                {!submitted ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                      label="שם מלא"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="הכניסו את שמכם המלא"
                    />

                    <Input
                      label="אימייל"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com (לא חובה)"
                    />

                    <Input
                      label="טלפון"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="05X-XXX-XXXX (לא חובה)"
                    />

                    <Input
                      label="תוכן הפנייה"
                      name="message"
                      type="textarea"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      placeholder="ספרו לנו במה אתם מעוניינים..."
                    />

                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                      </div>
                    )}

                    <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
                      <Send className="h-5 w-5 ml-2" />
                      שלח הודעה
                    </Button>
                  </form>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
                    <div className="text-green-600 mb-4">
                      <CheckCircle className="h-16 w-16 mx-auto" />
                    </div>
                    <h3 className="text-2xl font-bold text-green-900 mb-3">תודה!</h3>
                    <p className="text-lg text-green-700 mb-4">
                      קיבלנו את הפניה ונחזור אליך בהקדם (בדרך כלל באותו היום בשעות הפעילות).
                    </p>
                    <p className="text-green-700">
                      אם דחוף — אפשר להתקשר עכשיו ל-
                      <a href={`tel:${PHONE_NUMBER}`} className="font-bold underline">
                        {PHONE_NUMBER}
                      </a>
                    </p>
                  </div>
                )}
              </Card>
            </motion.div>

            {/* פרטי קשר */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-dark mb-6">פרטי התקשרות</h2>

              <Card padding="md" hoverable>
                <div className="flex items-start gap-4">
                  <Phone className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-dark mb-1">טלפון</h3>
                    <a href={`tel:${PHONE_NUMBER}`} className="text-darkGray hover:text-primary text-lg">
                      {PHONE_NUMBER}
                    </a>
                  </div>
                </div>
              </Card>

              <Card padding="md" hoverable>
                <div className="flex items-start gap-4">
                  <MessageCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-dark mb-1">WhatsApp - שלמה (מכירות)</h3>
                    <a
                      href={`https://wa.me/${WHATSAPP}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-darkGray hover:text-green-600 text-lg"
                    >
                      +972-54-303-4759
                    </a>
                  </div>
                </div>
              </Card>

              <Card padding="md" hoverable>
                <div className="flex items-start gap-4">
                  <Mail className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-dark mb-1">אימייל</h3>
                    <a
                      href={`mailto:${EMAIL}`}
                      className="text-darkGray hover:text-primary text-lg break-all"
                    >
                      {EMAIL}
                    </a>
                  </div>
                </div>
              </Card>

              <Card padding="md" hoverable>
                <div className="flex items-start gap-4">
                  <MapPin className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-dark mb-1">כתובת</h3>
                    <p className="text-darkGray text-lg">{ADDRESS}</p>
                    <p className="text-sm text-gray-500 mt-1">ניווט בוויז: "ניו קאר חדרה"</p>
                  </div>
                </div>
              </Card>

              <Card padding="md" hoverable>
                <div className="flex items-start gap-4">
                  <Clock className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-dark mb-1">שעות פעילות</h3>
                    <p className="text-darkGray text-lg">{HOURS}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;

