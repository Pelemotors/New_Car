-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- CARS TABLE - טבלת רכבים
-- ========================================
CREATE TABLE cars (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    
    -- פרטים בסיסיים
    manufacturer TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER NOT NULL CHECK (year >= 1900 AND year <= 2030),
    hand TEXT NOT NULL, -- יד (1, 2, 3...)
    km INTEGER NOT NULL DEFAULT 0 CHECK (km >= 0),
    ownership TEXT NOT NULL, -- בעלות (פרטית, ליסינג...)
    
    -- פרטים טכניים
    transmission TEXT NOT NULL CHECK (transmission IN ('automatic', 'manual')),
    fuel TEXT NOT NULL CHECK (fuel IN ('gasoline', 'diesel', 'hybrid', 'electric')),
    engine TEXT NOT NULL, -- נפח מנוע
    color TEXT NOT NULL,
    
    -- מחיר ומצב
    price DECIMAL(12,2) NOT NULL CHECK (price > 0),
    condition TEXT, -- מצב (שמור/טוב/מצוין)
    
    -- תיאור
    description TEXT NOT NULL,
    features TEXT[], -- אבזור ותוספות
    
    -- מדיה (עד 5 תמונות + 1 סרטון)
    images TEXT[] DEFAULT '{}',
    video TEXT,
    
    -- היסטוריה
    service_history BOOLEAN DEFAULT false,
    has_warranty BOOLEAN DEFAULT false,
    warranty_months INTEGER,
    
    -- סטטוס
    is_published BOOLEAN DEFAULT false,
    is_sold BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    
    -- SEO
    seo_title TEXT,
    seo_description TEXT,
    seo_keywords TEXT[],
    
    -- תאריכים
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- LEADS TABLE - טבלת לידים
-- ========================================
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- פרטים אישיים
    first_name TEXT NOT NULL,
    last_name TEXT,
    phone TEXT NOT NULL,
    email TEXT,
    whatsapp TEXT,
    
    -- מקור ליד
    source TEXT NOT NULL DEFAULT 'website' CHECK (source IN ('website', 'whatsapp', 'phone', 'email', 'social', 'referral')),
    
    -- סטטוס
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed', 'lost')),
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    
    -- עניין
    interest_in_car UUID REFERENCES cars(id),
    budget DECIMAL(12,2),
    timeline TEXT CHECK (timeline IN ('immediate', '1-3_months', '3-6_months', '6+_months')),
    
    -- הערות
    notes TEXT,
    tags TEXT[],
    
    -- ניהול
    assigned_to UUID, -- יתווסף כשתהיה טבלת משתמשים
    last_contact_date TIMESTAMP WITH TIME ZONE,
    next_follow_up_date TIMESTAMP WITH TIME ZONE,
    
    -- תאריכים
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- LEAD_COMMUNICATIONS TABLE - תקשורת עם לידים
-- ========================================
CREATE TABLE lead_communications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    
    -- סוג תקשורת
    type TEXT NOT NULL CHECK (type IN ('email', 'whatsapp', 'phone', 'note')),
    direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
    
    -- תוכן
    content TEXT NOT NULL,
    subject TEXT,
    
    -- סטטוס
    status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'read', 'failed')),
    
    -- מטא-דאטה
    metadata JSONB,
    
    -- תאריך
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- WHATSAPP_TEMPLATES TABLE - תבניות וואטסאפ
-- ========================================
CREATE TABLE whatsapp_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('greeting', 'follow_up', 'offer', 'reminder', 'thank_you')),
    content TEXT NOT NULL,
    variables TEXT[], -- משתנים בתבנית
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- INDEXES - אינדקסים לביצועים
-- ========================================

-- Cars Indexes
CREATE INDEX idx_cars_manufacturer ON cars(manufacturer);
CREATE INDEX idx_cars_year ON cars(year);
CREATE INDEX idx_cars_price ON cars(price);
CREATE INDEX idx_cars_is_published ON cars(is_published);
CREATE INDEX idx_cars_is_sold ON cars(is_sold);
CREATE INDEX idx_cars_slug ON cars(slug);
CREATE INDEX idx_cars_created_at ON cars(created_at DESC);

-- Leads Indexes
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_priority ON leads(priority);
CREATE INDEX idx_leads_source ON leads(source);
CREATE INDEX idx_leads_phone ON leads(phone);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_leads_next_follow_up ON leads(next_follow_up_date);

-- Lead Communications Indexes
CREATE INDEX idx_lead_comm_lead_id ON lead_communications(lead_id);
CREATE INDEX idx_lead_comm_type ON lead_communications(type);
CREATE INDEX idx_lead_comm_created_at ON lead_communications(created_at DESC);

-- ========================================
-- ROW LEVEL SECURITY (RLS)
-- ========================================

-- Enable RLS
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_templates ENABLE ROW LEVEL SECURITY;

-- Public can read published cars
CREATE POLICY "Public can view published cars"
    ON cars FOR SELECT
    USING (is_published = true AND is_sold = false);

-- Authenticated users can do everything
CREATE POLICY "Authenticated users can manage cars"
    ON cars FOR ALL
    USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage leads"
    ON leads FOR ALL
    USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage communications"
    ON lead_communications FOR ALL
    USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage templates"
    ON whatsapp_templates FOR ALL
    USING (auth.role() = 'authenticated');

-- ========================================
-- FUNCTIONS - פונקציות עזר
-- ========================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_cars_updated_at BEFORE UPDATE ON cars
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_whatsapp_templates_updated_at BEFORE UPDATE ON whatsapp_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- VIEWS - תצוגות
-- ========================================

-- Lead Summary View
CREATE OR REPLACE VIEW lead_summary AS
SELECT 
    l.id,
    l.first_name,
    l.last_name,
    l.phone,
    l.email,
    l.source,
    l.status,
    l.priority,
    l.created_at,
    l.last_contact_date,
    l.next_follow_up_date,
    COUNT(lc.id) as communications_count,
    c.manufacturer,
    c.model
FROM leads l
LEFT JOIN lead_communications lc ON l.id = lc.lead_id
LEFT JOIN cars c ON l.interest_in_car = c.id
GROUP BY l.id, c.manufacturer, c.model;

-- ========================================
-- SAMPLE DATA - נתוני דוגמה (אופציונלי)
-- ========================================

-- Insert sample WhatsApp templates
INSERT INTO whatsapp_templates (name, category, content, variables) VALUES
('ברוך הבא', 'greeting', 'שלום {name}, תודה שפנית לניו קאר חדרה! נשמח לעזור לך למצוא את הרכב המושלם. איך נוכל לסייע?', ARRAY['name']),
('מעקב ראשוני', 'follow_up', 'היי {name}, רציתי לוודא שקיבלת את כל המידע על {car_name}. יש לך שאלות נוספות?', ARRAY['name', 'car_name']),
('הצעת מחיר', 'offer', 'שלום {name}, בעקבות השיחה שלנו, הנה הצעת המחיר המיוחדת עבור {car_name}: ₪{price}. ההצעה בתוקף עד {date}.', ARRAY['name', 'car_name', 'price', 'date']),
('תזכורת למבחן נסיעה', 'reminder', 'שלום {name}, מזכירים לך שמבחן הנסיעה ל-{car_name} מחר ב-{time}. מחכים לך!', ARRAY['name', 'car_name', 'time']),
('תודה', 'thank_you', 'תודה {name} שבחרת בניו קאר חדרה! נשמח לעמוד לרשותך בכל עת. 🚗', ARRAY['name']);

