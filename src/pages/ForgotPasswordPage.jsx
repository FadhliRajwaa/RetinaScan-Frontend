import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { forgotPassword as requestPasswordReset } from '../services/authService';
import { withPageTransition } from '../context/ThemeContext';
import { useTheme } from '../context/ThemeContext';
import { 
  HomeIcon, 
  ArrowRightIcon, 
  EnvelopeIcon, 
  ExclamationCircleIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import AnimatedInput from '../components/AnimatedInput';
import AnimatedCard from '../components/AnimatedCard';
import ShimmerButton from '../components/ShimmerButton';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  
  const { theme } = useTheme();
  
  // Environment variables
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Validasi email sederhana
  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi form
    if (!email.trim()) {
      setError('Email tidak boleh kosong');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Format email tidak valid');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setSuccess(false);
    setSuccessMessage('');
    
    try {
      const response = await requestPasswordReset(email);
      
      if (response && response.success) {
        setSuccess(true);
        setSuccessMessage('Link reset password telah dikirim ke email Anda. Silakan periksa kotak masuk atau folder spam Anda.');
      } else {
        throw new Error(response?.message || 'Terjadi kesalahan saat mengirim permintaan reset password');
      }
    } catch (err) {
      console.error('Password reset request error:', err);
      setError(err.response?.data?.message || err.message || 'Terjadi kesalahan saat mengirim permintaan reset password');
    } finally {
      setIsLoading(false);
    }
  };

  // Efek partikel saat reset password berhasil
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (success) {
      // Generate random particles
      const newParticles = Array.from({ length: 20 }, () => ({
        x: Math.random() * window.innerWidth,
        y: window.innerHeight,
        color: ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7'][Math.floor(Math.random() * 4)]
      }));
      setParticles(newParticles);
    }
  }, [success]);

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4 relative overflow-hidden">
      {/* Particles effect */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {particles.map((particle, index) => (
          <motion.div
            key={index}
            className="absolute w-2 h-2 rounded-full"
            style={{ backgroundColor: particle.color }}
            initial={{ x: particle.x, y: particle.y, opacity: 1 }}
            animate={{ y: particle.y - 300, opacity: 0 }}
            transition={{ duration: 1.5, delay: index * 0.05 }}
            onAnimationComplete={() => {
              setParticles(prev => prev.filter((_, i) => i !== index));
            }}
          />
        ))}
      </motion.div>

      <AnimatedCard
        className={`w-full max-w-md p-8 shadow-xl backdrop-blur-sm 
        ${theme === 'dark' 
          ? 'bg-gray-900/60 border border-gray-800/50' 
          : 'bg-white/80 border border-gray-200/50'}`}
      >
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mx-auto"
          >
            <div className="h-16 w-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg p-3 mx-auto mb-2">
              <EyeIcon className="h-full w-full text-white" />
            </div>
          </motion.div>
          <motion.h1 
            className="text-3xl font-bold mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Lupa Password
          </motion.h1>
          <motion.p 
            className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Masukkan email Anda untuk reset password
          </motion.p>
        </div>

        {/* Success Message */}
        <AnimatePresence>
          {success && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-green-500/10 border border-green-500/30 text-green-600 rounded-lg p-3 mb-6 flex items-center"
            >
              <CheckCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
              <p>{successMessage}</p>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-500/10 border border-red-500/30 text-red-600 rounded-lg p-3 mb-6 flex items-center"
            >
              <ExclamationCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
              <p>{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <motion.form 
          onSubmit={handleSubmit} 
          className="space-y-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <AnimatedInput
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="Email"
            required
            placeholder="Masukkan email anda"
            icon={<EnvelopeIcon className="h-5 w-5" />}
            error={error && error.includes('email')}
          />

          <ShimmerButton
            type="submit"
            disabled={isLoading}
            fullWidth={true}
            className="mt-6"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Memproses...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <span>Kirim Link Reset</span>
                <ArrowRightIcon className="h-5 w-5 ml-1" />
              </div>
            )}
          </ShimmerButton>
        </motion.form>

        {/* Links */}
        <motion.div 
          className="mt-8 text-center space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Link 
            to="/login" 
            className="text-blue-500 hover:text-blue-600 font-medium flex items-center justify-center transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Kembali ke Login
          </Link>
          
          <Link 
            to="/" 
            className={`inline-flex items-center justify-center mt-4 text-sm transition-colors ${
              theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <HomeIcon className="h-4 w-4 mr-1" />
            Kembali ke Beranda
          </Link>
        </motion.div>
      </AnimatedCard>
    </div>
  );
};

export default withPageTransition(ForgotPasswordPage);