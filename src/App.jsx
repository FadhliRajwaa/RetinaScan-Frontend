import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ParallaxProvider } from 'react-scroll-parallax';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import RetinaScanPage from './pages/RetinaScanPage';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import { useTheme } from './context/ThemeContext';
import './App.css';

function App() {
  const location = useLocation();
  const { isDarkMode, animations } = useTheme();
  
  return (
    <ParallaxProvider>
      <div className={`flex flex-col min-h-screen ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-white text-gray-900'} transition-colors duration-300`}>
        <Navbar />
        <main className="flex-grow pt-16 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={animations.page.initial}
              animate={animations.page.animate}
              exit={animations.page.exit}
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
        <Footer />
      </div>
    </ParallaxProvider>
  );
}

export default App;