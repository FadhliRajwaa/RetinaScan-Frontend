import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ParallaxProvider } from 'react-scroll-parallax';
import { ThemeProvider, useTheme, AnimatedElement } from './context/ThemeContext';
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
  const { theme, animations } = useTheme();
  
  // Determine if the current route should show Navbar and Footer
  const showNavbarFooter = !['/login', '/register', '/forgot-password', '/reset-password'].includes(location.pathname);
  
  return (
    <ParallaxProvider>
      <div 
        className={`min-h-screen flex flex-col`}
        style={{ 
          backgroundColor: theme.current.background,
          color: theme.current.text,
          transition: 'background-color 0.3s ease, color 0.3s ease'
        }}
      >
        {showNavbarFooter && <Navbar />}
        <main className="flex-grow">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={animations.page.initial}
              animate={animations.page.animate}
              exit={animations.page.exit}
              transition={animations.page.transition}
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