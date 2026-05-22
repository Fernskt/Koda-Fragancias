import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/features/cart/CartDrawer';
import { AdminRoute } from './components/features/admin/AdminRoute';
import { Home } from './pages/Home';
import { useStoreConfig } from './hooks/useStoreConfig';

const About = lazy(() => import('./pages/About').then((m) => ({ default: m.About })));
const Dashboard = lazy(() =>
  import('./pages/admin/Dashboard').then((m) => ({ default: m.Dashboard }))
);
const Login = lazy(() =>
  import('./pages/admin/Login').then((m) => ({ default: m.Login }))
);

const queryClient = new QueryClient();

const WA_MESSAGE = encodeURIComponent(
  'Hola Koda Fragancias! No encuentro el perfume que busco. ¿Me podés ayudar?'
);
const WA_FALLBACK = '5491156009539';

function FloatingWhatsApp() {
  const { data: config } = useStoreConfig();
  const number = config?.whatsapp_number ?? WA_FALLBACK;

  return (
    <a
      href={`https://wa.me/${number}?text=${WA_MESSAGE}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribir por WhatsApp a Koda Fragancias si no encontrás el perfume"
      style={{
        position: 'fixed',
        right: 22,
        bottom: 22,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '13px 18px',
        borderRadius: 999,
        background: 'linear-gradient(135deg, #25D366, #128C7E)',
        color: 'white',
        fontWeight: 800,
        fontSize: 14,
        textDecoration: 'none',
        boxShadow: '0 14px 35px rgba(0,0,0,.38)',
        border: '1px solid rgba(255,255,255,.25)',
      }}
    >
      <svg width="22" height="22" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
        <path d="M16.04 3C8.87 3 3.05 8.8 3.05 15.95c0 2.3.61 4.54 1.77 6.5L3 29l6.72-1.76a12.9 12.9 0 0 0 6.32 1.61h.01C23.2 28.85 29 23.05 29 15.9 29 8.78 23.2 3 16.04 3Zm0 23.65h-.01a10.72 10.72 0 0 1-5.46-1.49l-.39-.23-3.99 1.05 1.07-3.88-.25-.4a10.7 10.7 0 0 1-1.64-5.75c0-5.93 4.83-10.75 10.78-10.75 2.88 0 5.58 1.12 7.62 3.15a10.65 10.65 0 0 1 3.16 7.58c0 5.9-4.83 10.72-10.78 10.72Zm5.9-8.04c-.32-.16-1.9-.94-2.2-1.05-.3-.11-.52-.16-.74.16-.22.32-.85 1.05-1.04 1.27-.19.22-.38.24-.7.08-.32-.16-1.36-.5-2.6-1.6-.96-.86-1.6-1.92-1.79-2.24-.19-.32-.02-.5.14-.66.14-.14.32-.38.48-.57.16-.19.22-.32.32-.54.11-.22.05-.41-.03-.57-.08-.16-.74-1.78-1.01-2.44-.27-.64-.54-.55-.74-.56h-.63c-.22 0-.57.08-.87.41-.3.32-1.14 1.11-1.14 2.72s1.17 3.15 1.33 3.37c.16.22 2.3 3.51 5.57 4.92.78.34 1.39.54 1.86.69.78.25 1.49.21 2.05.13.63-.09 1.9-.78 2.17-1.53.27-.75.27-1.4.19-1.53-.08-.14-.3-.22-.62-.38Z" />
      </svg>
      <span>¿No encontrás el perfume que buscás? Escribinos</span>
    </a>
  );
}

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <CartDrawer />
      <FloatingWhatsApp />
    </>
  );
}

function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Rutas públicas */}
        <Route
          path="/"
          element={
            <PublicLayout>
              <Home />
            </PublicLayout>
          }
        />
        <Route
          path="/about"
          element={
            <PublicLayout>
              <Suspense fallback={null}>
                <About />
              </Suspense>
            </PublicLayout>
          }
        />

        {/* Rutas admin — sin navbar/footer público */}
        <Route
          path="/admin/login"
          element={
            <Suspense fallback={null}>
              <Login />
            </Suspense>
          }
        />
        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <Suspense fallback={null}>
                <Dashboard />
              </Suspense>
            </AdminRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
