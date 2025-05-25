import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import RetinaScanPage from './pages/RetinaScanPage';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import VantaBackground from './components/VantaBackground';
import { useTheme } from './context/ThemeContext';

function App() {
  const { theme } = useTheme();
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Background options based on theme
  const bgOptions = {
    color: theme === 'dark' ? 0x3b82f6 : 0x4f46e5, // blue-500 or indigo-600
    color2: theme === 'dark' ? 0x1e40af : 0x3730a3, // blue-800 or indigo-800
    backgroundColor: theme === 'dark' ? 0x030712 : 0xf8fafc, // gray-950 or slate-50
    spacing: 30.00,
    size: windowSize.width < 768 ? 1.0 : 1.5,
    speed: 1.0,
    points: windowSize.width < 768 ? 15 : 20,
    maxDistance: 25.00
  };

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      {/* Global background */}
      <VantaBackground options={bgOptions} />
      
      <Navbar />
      <main className="flex-grow pt-16 relative z-10">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/retina-scan" element={<ProtectedRoute><RetinaScanPage /></ProtectedRoute>} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

export default App;