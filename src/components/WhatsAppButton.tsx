import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const WHATSAPP_NUMBER = import.meta.env.VITE_CONTACT_WHATSAPP || '972543034759';
const WHATSAPP_ENABLED = import.meta.env.VITE_ENABLE_WHATSAPP_INTEGRATION === 'true';

export const WhatsAppButton = () => {
  if (!WHATSAPP_ENABLED) return null;

  const handleClick = () => {
    const message = encodeURIComponent(
      'שלום! הגעתי מהאתר של ניו קאר חדרה. אשמח לקבל מידע על רכבים זמינים. תודה!'
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.button
      onClick={handleClick}
      className="fixed bottom-6 left-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 group"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.3, delay: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label="שלח הודעה בWhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
      
      {/* טקסט */}
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-dark text-white px-4 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
        שלחו לנו הודעה
      </span>

      {/* אנימציה של עיגולים */}
      <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75" />
    </motion.button>
  );
};

