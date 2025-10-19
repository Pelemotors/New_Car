// TypeScript Types & Interfaces לפרויקט ניו קאר חדרה

// ממשק רכב מלא
export interface Car {
  id: string;
  slug: string;
  
  // פרטים בסיסיים
  manufacturer: string;
  model: string;
  year: number;
  hand: string; // יד ראשונה, שנייה וכו'
  
  // מידע טכני
  km: number;
  transmission: 'automatic' | 'manual';
  fuel: 'gasoline' | 'diesel' | 'hybrid' | 'electric';
  engine_size?: number; // סמ"ק
  color: string;
  
  // מחיר ומצב
  price: number;
  previous_price?: number;
  condition: 'excellent' | 'very_good' | 'good' | 'fair';
  
  // תיאור ותכונות
  description?: string;
  features?: string[]; // מערך תכונות
  
  // מדיה
  images: string[]; // עד 5 תמונות
  video?: string;
  
  // סטטוס וקטגוריה
  category?: 'family' | 'luxury' | 'suv' | 'compact' | 'commercial';
  inventory_status: 'available' | 'reserved' | 'sold';
  
  // אחריות ופרסום
  has_warranty: boolean;
  warranty_months?: number;
  is_published: boolean;
  is_sold: boolean;
  
  // מטא-דאטה
  created_at?: string;
  updated_at?: string;
  views?: number;
  
  // SEO
  meta_title?: string;
  meta_description?: string;
  keywords?: string[];
}

// ממשק ליד
export interface Lead {
  id: string;
  
  // פרטים אישיים
  first_name: string;
  last_name?: string;
  phone: string;
  email?: string;
  whatsapp?: string;
  
  // מקור ופרטים
  source: 'website' | 'whatsapp' | 'phone' | 'facebook' | 'instagram' | 'referral' | 'walk_in';
  status: 'new' | 'contacted' | 'qualified' | 'negotiation' | 'won' | 'lost';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  // עניין ברכב
  interest_in_car?: string; // ID של רכב
  budget?: number;
  timeline?: string; // מתי מתכנן לקנות
  
  // הערות ומעקב
  notes?: string;
  assigned_to?: string; // ID של איש מכירות
  last_contact_date?: string;
  next_follow_up_date?: string;
  
  // תגיות
  tags?: string[];
  
  // מטא-דאטה
  created_at: string;
  updated_at?: string;
}

// תקשורת עם ליד
export interface LeadCommunication {
  id: string;
  lead_id: string;
  
  type: 'call' | 'email' | 'whatsapp' | 'sms' | 'meeting' | 'note';
  direction: 'inbound' | 'outbound';
  
  subject?: string;
  content: string;
  status?: 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
  
  metadata?: Record<string, any>;
  created_at: string;
  created_by?: string;
}

// תבנית WhatsApp
export interface WhatsAppTemplate {
  id: string;
  name: string;
  category: 'general' | 'car_inquiry' | 'trade_in' | 'financing' | 'follow_up';
  content: string;
  variables?: string[]; // משתנים שניתן להחליף
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

// משתמש (Admin)
export interface User {
  id: string;
  username: string;
  email: string;
  password_hash?: string; // רק לשרת
  role: 'admin' | 'manager' | 'sales' | 'viewer';
  permissions?: string[];
  is_active: boolean;
  last_login?: string;
  created_at: string;
}

// יצרן
export interface Manufacturer {
  id: number;
  name: string;
  name_en?: string;
  logo?: string;
}

// דגם
export interface Model {
  id: number;
  manufacturer_id: number;
  manufacturer: string;
  name: string;
  name_en?: string;
}

// נתוני יצרנים ודגמים
export interface ManufacturersModelsData {
  manufacturers: Manufacturer[];
  models: Model[];
}

// סינון רכבים
export interface CarFilters {
  manufacturer?: string;
  model?: string;
  year_min?: number;
  year_max?: number;
  price_min?: number;
  price_max?: number;
  km_max?: number;
  transmission?: 'automatic' | 'manual';
  fuel?: string;
  hand?: string;
  category?: string;
  search?: string;
}

// פרמטרי מיון
export interface SortParams {
  field: 'price' | 'year' | 'km' | 'created_at';
  order: 'asc' | 'desc';
}

// מחשבון מימון
export interface FinanceCalculation {
  carPrice: number;
  downPayment: number;
  loanTerm: number; // בחודשים
  interestRate: number; // אחוז שנתי
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
}

// הגדרות אתר
export interface SiteConfig {
  siteName: string;
  siteUrl: string;
  contactPhone: string;
  contactWhatsApp: string;
  contactEmail: string;
  businessAddress: string;
  businessHours: string;
  socialMedia: {
    facebook?: string;
    instagram?: string;
    whatsapp?: string;
  };
  features: {
    whatsappIntegration: boolean;
    financeCalculator: boolean;
  };
}

// פרופס של קומפוננטות נפוצות
export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export interface InputProps {
  label?: string;
  name: string;
  type?: 'text' | 'email' | 'tel' | 'number' | 'password' | 'textarea';
  placeholder?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  rows?: number; // for textarea
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
}

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

