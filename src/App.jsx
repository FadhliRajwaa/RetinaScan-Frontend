import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ParallaxProvider } from 'react-scroll-parallax';
import { ThemeProvider } from './context/ThemeContext';
import { useTheme } from './context/ThemeContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import RetinaScanPage from './pages/RetinaScanPage';
import ProtectedRoute from './components/common/ProtectedRoute';

function AppContent() {
  const location = useLocation();
  const { theme } = useTheme();
  
  // Determine if the current route should show Navbar and Footer
  const showNavbarFooter = !['/login', '/register', '/forgot-password', '/reset-password'].includes(location.pathname);
  
  // Konfigurasi untuk ParallaxProvider dengan sensitivitas mouse yang lebih rendah
  const parallaxConfig = {
    scrollAxis: 'vertical',
    limitX: 0.1, // Mengurangi lebih jauh dari 0.2 ke 0.1 (90% pengurangan dari default)
    limitY: 0.1, // Mengurangi lebih jauh dari 0.2 ke 0.1 (90% pengurangan dari default)
    // Disable mouse input completely if using custom MouseProvider
    shouldDisableMouseInput: true, // Nonaktifkan mouse input bawaan dari parallax
    shouldDisableKeyboardInput: true, // Nonaktifkan keyboard control
    // Additional options for smoother performance
    thresholdX: 0.1, // Add threshold to reduce jitter (only 10% movement needed)
    thresholdY: 0.1, // Add threshold to reduce jitter (only 10% movement needed)
  };
  
  return (
    <ParallaxProvider {...parallaxConfig}>
      <div className="flex flex-col min-h-screen">
        {showNavbarFooter && <Navbar />}
        <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            <Routes location={location}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/retina-scan" element={<ProtectedRoute><RetinaScanPage /></ProtectedRoute>} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
        {showNavbarFooter && <Footer />}
    </div>
    </ParallaxProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;