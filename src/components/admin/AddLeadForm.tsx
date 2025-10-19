import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import type { Lead } from '../../types';
import { supabase } from '../../utils/supabase';
import { Plus, X, User, Phone, Mail, MessageSquare } from 'lucide-react';

interface AddLeadFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  initialCarId?: string;
}

export const AddLeadForm: React.FC<AddLeadFormProps> = ({ 
  onSuccess, 
  onCancel, 
  initialCarId 
}) => {
  const [formData, setFormData] = useState<Partial<Lead>>({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    whatsapp: '',
    source: 'website',
    status: 'new',
    priority: 'medium',
    interest_in_car: initialCarId || undefined,
    budget: undefined,
    timeline: undefined,
    notes: '',
    tags: [],
    assigned_to: undefined,
    last_contact_date: undefined,
    next_follow_up_date: undefined
  });

  // const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newTag, setNewTag] = useState('');

  // טעינת רכבים
  useEffect(() => {
    const loadCars = async () => {
      try {
        const { error } = await supabase
          .from('cars')
          .select('id, manufacturer, model, year, price')
          .eq('is_published', true)
          .eq('is_sold', false)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error loading cars:', error);
        } else {
          // setCars(data || []);
        }
      } catch (err) {
        console.error('Error loading cars:', err);
      }
    };

    loadCars();
  }, []);

  const handleInputChange = (field: keyof Lead, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(t => t !== tag) || []
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // ולידציה
      if (!formData.first_name || !formData.phone) {
        throw new Error('שם פרטי וטלפון הם שדות חובה');
      }

      // הכנת נתונים
      const leadData = {
        ...formData,
        budget: formData.budget ? Number(formData.budget) : null,
        last_contact_date: formData.last_contact_date ? new Date(formData.last_contact_date).toISOString() : null,
        next_follow_up_date: formData.next_follow_up_date ? new Date(formData.next_follow_up_date).toISOString() : null
      };

      // שמירה ב-Supabase
      const { error } = await supabase
        .from('leads')
        .insert([leadData])
        .select();

      if (error) {
        throw error;
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'שגיאה בשמירת הליד');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">הוספת ליד חדש</h2>
          <Button variant="outline" onClick={onCancel}>
            <X className="w-4 h-4 mr-2" />
            ביטול
          </Button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* פרטים אישיים */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <User className="w-5 h-5 mr-2" />
              פרטים אישיים
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  שם פרטי *
                </label>
                <Input
                  value={formData.first_name || ''}
                  onChange={(e) => handleInputChange('first_name', e.target.value)}
                  required
                  placeholder="יוסי"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  שם משפחה
                </label>
                <Input
                  value={formData.last_name || ''}
                  onChange={(e) => handleInputChange('last_name', e.target.value)}
                  placeholder="כהן"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  טלפון *
                </label>
                <div className="relative">
                  <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    value={formData.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    required
                    placeholder="050-1234567"
                    className="pr-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  אימייל
                </label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="yossi@example.com"
                    className="pr-10"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                WhatsApp
              </label>
              <Input
                value={formData.whatsapp || ''}
                onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                placeholder="050-1234567"
              />
            </div>
          </div>

          {/* מקור וסטטוס */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">מידע עסקי</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  מקור הליד
                </label>
                <select
                  value={formData.source || 'website'}
                  onChange={(e) => handleInputChange('source', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="website">אתר</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="phone">טלפון</option>
                  <option value="email">אימייל</option>
                  <option value="social">רשתות חברתיות</option>
                  <option value="referral">המלצה</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  סטטוס
                </label>
                <select
                  value={formData.status || 'new'}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="new">חדש</option>
                  <option value="contacted">יצרתי קשר</option>
                  <option value="qualified">מוכשר</option>
                  <option value="proposal">הצעת מחיר</option>
                  <option value="negotiation">משא ומתן</option>
                  <option value="closed">נסגר</option>
                  <option value="lost">אבוד</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  עדיפות
                </label>
                <select
                  value={formData.priority || 'medium'}
                  onChange={(e) => handleInputChange('priority', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="low">נמוכה</option>
                  <option value="medium">בינונית</option>
                  <option value="high">גבוהה</option>
                  <option value="urgent">דחוף</option>
                </select>
              </div>
            </div>
          </div>

          {/* עניין ברכב */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">עניין ברכב</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                רכב מעניין
              </label>
              <select
                value={formData.interest_in_car || ''}
                onChange={(e) => handleInputChange('interest_in_car', e.target.value || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">בחר רכב (אופציונלי)</option>
                {/* {cars.map((car) => (
                  <option key={car.id} value={car.id}>
                    {car.manufacturer} {car.model} {car.year} - ₪{car.price?.toLocaleString()}
                  </option>
                ))} */}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  תקציב (₪)
                </label>
                <Input
                  type="number"
                  value={formData.budget || ''}
                  onChange={(e) => handleInputChange('budget', e.target.value ? parseInt(e.target.value) : null)}
                  placeholder="150000"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  לוח זמנים
                </label>
                <select
                  value={formData.timeline || ''}
                  onChange={(e) => handleInputChange('timeline', e.target.value || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">בחר לוח זמנים</option>
                  <option value="immediate">מיידי</option>
                  <option value="1-3_months">1-3 חודשים</option>
                  <option value="3-6_months">3-6 חודשים</option>
                  <option value="6+_months">6+ חודשים</option>
                </select>
              </div>
            </div>
          </div>

          {/* הערות ותגיות */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <MessageSquare className="w-5 h-5 mr-2" />
              הערות ותגיות
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                הערות
              </label>
              <textarea
                value={formData.notes || ''}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="הערות נוספות על הליד..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                תגיות
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="הוסף תגית..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags?.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* מעקב */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">מעקב</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  תאריך קשר אחרון
                </label>
                <Input
                  type="datetime-local"
                  value={formData.last_contact_date ? new Date(formData.last_contact_date).toISOString().slice(0, 16) : ''}
                  onChange={(e) => handleInputChange('last_contact_date', e.target.value ? new Date(e.target.value).toISOString() : null)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  תאריך מעקב הבא
                </label>
                <Input
                  type="datetime-local"
                  value={formData.next_follow_up_date ? new Date(formData.next_follow_up_date).toISOString().slice(0, 16) : ''}
                  onChange={(e) => handleInputChange('next_follow_up_date', e.target.value ? new Date(e.target.value).toISOString() : null)}
                />
              </div>
            </div>
          </div>

          {/* כפתורי פעולה */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              ביטול
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'שומר...' : 'שמור ליד'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
