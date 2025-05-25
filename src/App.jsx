import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import RetinaScanPage from './pages/RetinaScanPage';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-16">
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
    </ThemeProvider>
  );
}

export default App;