import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { AuthProvider } from './contexts/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';

// Import pages
import HomePageNew from './pages/HomePageNew';
import CarsPage from './pages/CarsPage';
import CarDetailPage from './pages/CarDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AdminApp from './pages/admin/AdminApp';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
          {/* דפים ציבוריים */}
          <Route
            path="/"
            element={
              <Layout>
                <HomePageNew />
              </Layout>
            }
          />

          {/* דפי רכבים */}
          <Route
            path="/cars"
            element={
              <Layout>
                <CarsPage />
              </Layout>
            }
          />

          <Route
            path="/car/:slug"
            element={
              <Layout>
                <CarDetailPage />
              </Layout>
            }
          />

          {/* דפים סטטיים */}
          <Route
            path="/about"
            element={
              <Layout>
                <AboutPage />
              </Layout>
            }
          />

          <Route
            path="/contact"
            element={
              <Layout>
                <ContactPage />
              </Layout>
            }
          />

          {/* דפים משפטיים - placeholder */}
          <Route
            path="/privacy"
            element={
              <Layout>
                <div className="section-padding container-max">
                  <h1 className="text-4xl font-bold text-dark mb-6">מדיניות פרטיות</h1>
                  <p className="text-lg text-darkGray">תוכן בקרוב...</p>
                </div>
              </Layout>
            }
          />

          <Route
            path="/terms"
            element={
              <Layout>
                <div className="section-padding container-max">
                  <h1 className="text-4xl font-bold text-dark mb-6">תנאי שימוש</h1>
                  <p className="text-lg text-darkGray">תוכן בקרוב...</p>
                </div>
              </Layout>
            }
          />

          {/* Admin Routes - ללא Layout */}
          <Route path="/admin/*" element={<AdminApp />} />

          {/* 404 */}
          <Route
            path="*"
            element={
              <Layout>
                <div className="section-padding container-max text-center">
                  <h1 className="text-4xl font-bold text-dark mb-4">404</h1>
                  <p className="text-xl text-darkGray">הדף לא נמצא</p>
                </div>
              </Layout>
            }
          />
        </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
