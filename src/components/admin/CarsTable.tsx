import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Eye, Search, Plus } from 'lucide-react';
import type { Car } from '../../types';
import { Card } from '../ui/Card';
// import { Badge } from '../ui/Badge'; // לא בשימוש
import { Button } from '../ui/Button';
import { supabase } from '../../utils/supabase';

export const CarsTable = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // טעינת רכבים מ-Supabase
  useEffect(() => {
    const loadCars = async () => {
      try {
        setLoading(true);
        
        const { data: supabaseCars, error } = await supabase
          .from('cars')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Supabase error:', error);
          setError('שגיאה בטעינת נתונים מ-Supabase');
          setCars([]);
        } else {
          setCars(supabaseCars || []);
        }
      } catch (error) {
        console.error('Error loading cars:', error);
        setError('שגיאה בטעינת נתונים');
        setCars([]);
      } finally {
        setLoading(false);
      }
    };

    loadCars();
  }, []);

  const filteredCars = cars.filter((car) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      car.manufacturer.toLowerCase().includes(search) ||
      car.model.toLowerCase().includes(search) ||
      car.year.toString().includes(search)
    );
  });

  const formatPrice = (price: number) => `₪${price.toLocaleString('he-IL')}`;

  const handleDelete = async (carId: string) => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק את הרכב?')) {
      return;
    }

    try {
      setDeletingId(carId);
      
      const { error: supabaseError } = await supabase
        .from('cars')
        .delete()
        .eq('id', carId);

      if (supabaseError) {
        console.error('Supabase delete error:', supabaseError);
        alert('שגיאה במחיקת הרכב מ-Supabase');
        return;
      }
      
      // עדכן את המצב
      setCars(prev => prev.filter(car => car.id !== carId));
      alert('הרכב נמחק בהצלחה');
      
    } catch (error) {
      console.error('Error deleting car:', error);
      alert('שגיאה במחיקת הרכב');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-darkGray">טוען רכבים...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">שגיאה בטעינת נתונים</h3>
            <p className="mb-4">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              variant="primary"
            >
              נסה שוב
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* כותרת וחיפוש */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-dark mb-2">ניהול רכבים</h1>
          <p className="text-darkGray">סה"כ {filteredCars.length} רכבים</p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-initial">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="חיפוש..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64 pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
                 <Link to="/admin/cars/new">
                   <Button variant="primary">
                     <Plus className="w-4 h-4 mr-2" />
                     הוסף רכב חדש
                   </Button>
                 </Link>
        </div>
      </div>

      {/* טבלה */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-right py-4 px-6 text-sm font-semibold text-darkGray">רכב</th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-darkGray">שנה</th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-darkGray">ק"מ</th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-darkGray">מחיר</th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-darkGray">סטטוס</th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-darkGray">צפיות</th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-darkGray">פעולות</th>
              </tr>
            </thead>
            <tbody>
              {filteredCars.map((car) => (
                <tr key={car.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      {car.images && car.images.length > 0 && (
                        <img
                          src={car.images[0]}
                          alt={car.model}
                          className="w-16 h-12 object-cover rounded"
                        />
                      )}
                      <div>
                        <div className="font-medium text-dark">
                          {car.manufacturer} {car.model}
                        </div>
                        <div className="text-sm text-gray-600">{car.hand}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-darkGray">{car.year}</td>
                  <td className="py-4 px-6 text-darkGray">{car.km.toLocaleString('he-IL')}</td>
                  <td className="py-4 px-6">
                    <div className="font-semibold text-dark">{formatPrice(car.price)}</div>
                  </td>
                  <td className="py-4 px-6">
                    <select
                      value={car.is_sold ? 'sold' : car.is_published ? 'published' : 'draft'}
                      onChange={async (e) => {
                        const newStatus = e.target.value;
                        const updates: any = {};
                        
                        if (newStatus === 'sold') {
                          updates.is_sold = true;
                          updates.is_published = false;
                        } else if (newStatus === 'published') {
                          updates.is_sold = false;
                          updates.is_published = true;
                        } else {
                          updates.is_sold = false;
                          updates.is_published = false;
                        }
                        
                        try {
                          const { error } = await supabase
                            .from('cars')
                            .update(updates)
                            .eq('id', car.id);
                          
                          if (!error) {
                            // עדכון מקומי
                            setCars(prev => prev.map(c => 
                              c.id === car.id ? { ...c, ...updates } : c
                            ));
                          }
                        } catch (err) {
                          console.error('Error updating car status:', err);
                        }
                      }}
                      className="px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="draft">טיוטה</option>
                      <option value="published">פורסם</option>
                      <option value="sold">נמכר</option>
                    </select>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-1 text-darkGray">
                      <Eye className="h-4 w-4" />
                      <span>{car.views || 0}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Link to={`/car/${car.slug}`} target="_blank">
                        <button
                          className="p-2 text-secondary hover:bg-secondary/10 rounded transition-colors"
                          title="צפה ברכב"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </Link>
                      <Link to={`/admin/cars/edit/${car.id}`}>
                        <button
                          className="p-2 text-primary hover:bg-primary/10 rounded transition-colors"
                          title="ערוך"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(car.id)}
                        disabled={deletingId === car.id}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                        title="מחק"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCars.length === 0 && (
          <div className="text-center py-16 text-darkGray">
            <p className="text-lg mb-4">לא נמצאו רכבים</p>
            <Button variant="primary" onClick={() => setSearchTerm('')}>
              נקה חיפוש
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

