import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LoginForm } from '../../components/admin/LoginForm';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Dashboard } from '../../components/admin/Dashboard';
import { CarsTable } from '../../components/admin/CarsTable';
import { LeadsManager } from '../../components/admin/LeadsManager';
import { AddCarForm } from '../../components/admin/AddCarForm';
import { EditCarForm } from '../../components/admin/EditCarForm';

const AdminApp = () => {
  const { user, loading } = useAuth();
  const [authChecked, setAuthChecked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      setAuthChecked(true);
    }
  }, [loading]);

  // טוען...
  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-darkGray">טוען...</p>
        </div>
      </div>
    );
  }

  // לא מחובר - הצג התחברות
  if (!user) {
    return <LoginForm onSuccess={() => navigate('/admin')} />;
  }

  // מחובר - הצג Admin
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        
        {/* ניהול רכבים */}
        <Route path="/cars" element={<CarsTable />} />
        <Route path="/cars/new" element={<AddCarForm onSuccess={() => navigate('/admin/cars')} onCancel={() => navigate('/admin/cars')} />} />
        <Route path="/cars/edit/:id" element={<EditCarForm />} />
        
        {/* ניהול לידים */}
        <Route path="/leads" element={<LeadsManager />} />
        
        <Route
          path="/whatsapp"
          element={
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-dark mb-4">WhatsApp</h2>
              <p className="text-darkGray">בקרוב...</p>
            </div>
          }
        />
        
        <Route
          path="/settings"
          element={
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-dark mb-4">הגדרות</h2>
              <p className="text-darkGray">בקרוב...</p>
            </div>
          }
        />

        {/* Redirect */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminApp;

