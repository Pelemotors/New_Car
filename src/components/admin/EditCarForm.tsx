import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import type { Car, Manufacturer, Model } from '../../types';
import { supabase } from '../../utils/supabase';
import { Plus, X, ArrowLeft } from 'lucide-react';
import { FileUpload } from '../ui/FileUpload';

export const EditCarForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<Partial<Car>>({});
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [allModels, setAllModels] = useState<Model[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newFeature, setNewFeature] = useState('');

  // טעינת נתוני הרכב
  useEffect(() => {
    const loadCarData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // טעינת רכב מ-Supabase
        const { data: carData, error: carError } = await supabase
          .from('cars')
          .select('*')
          .eq('id', id)
          .single();

        if (carError) {
          throw carError;
        }

        if (carData) {
          setFormData(carData);
        } else {
          throw new Error('רכב לא נמצא');
        }
      } catch (err: any) {
        setError(err.message || 'שגיאה בטעינת נתוני הרכב');
      } finally {
        setLoading(false);
      }
    };

    loadCarData();
  }, [id]);

  // טעינת יצרנים ודגמים
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/data/manufacturers_models.json');
        if (!response.ok) {
          throw new Error('Failed to load manufacturers data');
        }
        const data = await response.json();
        
        if (!data || !data.manufacturers || !data.models) {
          throw new Error('Invalid data structure');
        }
        
        setManufacturers(data.manufacturers || []);
        setAllModels(data.models || []);
      } catch (err) {
        console.error('Error loading manufacturers:', err);
        setError('שגיאה בטעינת נתוני יצרנים. אנא רענן את הדף.');
        setManufacturers([]);
        setAllModels([]);
      }
    };
    loadData();
  }, []);

  // טעינת דגמים לפי יצרן
  useEffect(() => {
    if (formData.manufacturer && allModels.length > 0) {
      const filteredModels = allModels.filter(m => m.manufacturer === formData.manufacturer);
      setModels(filteredModels);
    } else {
      setModels([]);
    }
  }, [formData.manufacturer, allModels]);

  const handleInputChange = (field: keyof Car, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addFeature = () => {
    if (newFeature.trim() && !formData.features?.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...(prev.features || []), newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features?.filter(f => f !== feature) || []
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // ולידציה
      if (!formData.manufacturer || !formData.model || !formData.year || !formData.price) {
        throw new Error('יש למלא את כל השדות החובה');
      }

      // הכנת נתונים
      const carData = {
        ...formData,
        price: Number(formData.price),
        year: Number(formData.year),
        km: Number(formData.km),
        warranty_months: formData.warranty_months ? Number(formData.warranty_months) : null,
        seo_title: `${formData.manufacturer} ${formData.model} ${formData.year} - ניו קאר חדרה`,
        seo_description: `${formData.manufacturer} ${formData.model} ${formData.year}, ${formData.hand} יד, ${formData.km?.toLocaleString()} ק״מ. מחיר: ₪${formData.price?.toLocaleString()}`,
        seo_keywords: [formData.manufacturer, formData.model, formData.year.toString(), 'רכב', 'מכונית', 'חדרה']
      };

      // עדכון ב-Supabase
      const { error } = await supabase
        .from('cars')
        .update(carData)
        .eq('id', id);

      if (error) {
        throw error;
      }

      navigate('/admin/cars');
    } catch (err: any) {
      setError(err.message || 'שגיאה בשמירת הרכב');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק את הרכב?')) {
      return;
    }

    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('cars')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      navigate('/admin/cars');
    } catch (err: any) {
      setError(err.message || 'שגיאה במחיקת הרכב');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-darkGray">טוען נתוני רכב...</p>
        </div>
      </div>
    );
  }

  if (!formData.id) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">רכב לא נמצא</h2>
          <p className="text-gray-600 mb-6">הרכב המבוקש לא נמצא במערכת.</p>
          <Button onClick={() => navigate('/admin/cars')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            חזור לרשימת רכבים
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/admin/cars')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              חזור
            </Button>
            <h2 className="text-2xl font-bold text-gray-900">עריכת רכב</h2>
          </div>
          <Button variant="destructive" onClick={handleDelete} disabled={saving}>
            מחק רכב
          </Button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* פרטים בסיסיים */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                יצרן *
              </label>
              <select
                value={formData.manufacturer || ''}
                onChange={(e) => handleInputChange('manufacturer', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              >
                <option value="">בחר יצרן</option>
                {manufacturers.map((manufacturer) => (
                  <option key={manufacturer.name} value={manufacturer.name}>
                    {manufacturer.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                דגם *
              </label>
              <select
                value={formData.model || ''}
                onChange={(e) => handleInputChange('model', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
                disabled={!formData.manufacturer}
              >
                <option value="">בחר דגם</option>
                {models.map((model) => (
                  <option key={model.id} value={model.model}>
                    {model.model}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                שנת ייצור *
              </label>
              <Input
                type="number"
                value={formData.year || ''}
                onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                min="1990"
                max="2025"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                יד
              </label>
              <select
                value={formData.hand || '1'}
                onChange={(e) => handleInputChange('hand', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5+</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                קילומטראז׳
              </label>
              <Input
                type="number"
                value={formData.km || ''}
                onChange={(e) => handleInputChange('km', parseInt(e.target.value))}
                min="0"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                בעלות
              </label>
              <select
                value={formData.ownership || 'פרטית'}
                onChange={(e) => handleInputChange('ownership', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="פרטית">פרטית</option>
                <option value="ליסינג">ליסינג</option>
                <option value="חברה">חברה</option>
                <option value="מונית">מונית</option>
              </select>
            </div>
          </div>

          {/* פרטים טכניים */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                תיבת הילוכים
              </label>
              <select
                value={formData.transmission || 'automatic'}
                onChange={(e) => handleInputChange('transmission', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="automatic">אוטומט</option>
                <option value="manual">ידני</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                סוג דלק
              </label>
              <select
                value={formData.fuel || 'gasoline'}
                onChange={(e) => handleInputChange('fuel', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="gasoline">בנזין</option>
                <option value="diesel">דיזל</option>
                <option value="hybrid">היברידי</option>
                <option value="electric">חשמלי</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                נפח מנוע
              </label>
              <Input
                value={formData.engine || ''}
                onChange={(e) => handleInputChange('engine', e.target.value)}
                placeholder="1.6 ליטר"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                צבע
              </label>
              <Input
                value={formData.color || ''}
                onChange={(e) => handleInputChange('color', e.target.value)}
                placeholder="לבן"
              />
            </div>
          </div>

          {/* מחיר ומצב */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                מחיר (₪) *
              </label>
              <Input
                type="number"
                value={formData.price || ''}
                onChange={(e) => handleInputChange('price', parseInt(e.target.value))}
                min="0"
                required
                placeholder="150000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                מצב הרכב
              </label>
              <select
                value={formData.condition || 'טוב'}
                onChange={(e) => handleInputChange('condition', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="מצוין">מצוין</option>
                <option value="טוב">טוב</option>
                <option value="שמור">שמור</option>
                <option value="בינוני">בינוני</option>
              </select>
            </div>
          </div>

          {/* תיאור */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              תיאור הרכב
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="תיאור מפורט של הרכב..."
            />
          </div>

          {/* אבזור ותוספות */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              אבזור ותוספות
            </label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="הוסף אבזור..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
              />
              <Button type="button" onClick={addFeature} variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.features?.map((feature, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {feature}
                  <button
                    type="button"
                    onClick={() => removeFeature(feature)}
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* העלאת מדיה */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              תמונות וסרטונים (עד 5 קבצים)
            </label>
            <FileUpload
              onFilesChange={(files) => handleInputChange('images', files)}
              existingFiles={formData.images || []}
              maxFiles={5}
              acceptedTypes={['image/*', 'video/*']}
              bucket="car-images"
              folder="cars"
            />
          </div>

          {/* היסטוריה ואחריות */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="service_history"
                checked={formData.service_history || false}
                onChange={(e) => handleInputChange('service_history', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="service_history" className="text-sm font-medium text-gray-700">
                היסטוריית שירות
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="has_warranty"
                checked={formData.has_warranty || false}
                onChange={(e) => handleInputChange('has_warranty', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="has_warranty" className="text-sm font-medium text-gray-700">
                יש אחריות
              </label>
            </div>

            {formData.has_warranty && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  חודשי אחריות
                </label>
                <Input
                  type="number"
                  value={formData.warranty_months || ''}
                  onChange={(e) => handleInputChange('warranty_months', parseInt(e.target.value))}
                  min="1"
                  placeholder="12"
                />
              </div>
            )}
          </div>

          {/* סטטוס */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_published"
                checked={formData.is_published || false}
                onChange={(e) => handleInputChange('is_published', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="is_published" className="text-sm font-medium text-gray-700">
                פורסם באתר
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_sold"
                checked={formData.is_sold || false}
                onChange={(e) => handleInputChange('is_sold', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="is_sold" className="text-sm font-medium text-gray-700">
                נמכר
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active !== false}
                onChange={(e) => handleInputChange('is_active', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                פעיל
              </label>
            </div>
          </div>

          {/* כפתורי פעולה */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button type="button" variant="outline" onClick={() => navigate('/admin/cars')}>
              ביטול
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'שומר...' : 'שמור שינויים'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
