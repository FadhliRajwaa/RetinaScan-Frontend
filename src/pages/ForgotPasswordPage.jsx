import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { forgotPassword as requestPasswordReset } from '../services/authService';
import { withPageTransition } from '../context/ThemeContext';
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

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  
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

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 pt-36 relative overflow-hidden">
      {/* Background tidak perlu lagi karena sudah ada di App.jsx */}
      
      {/* Forgot Password Form */}
      <div className="glass-effect w-full max-w-md p-8 rounded-2xl shadow-xl z-10">
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
          <h1 className="text-3xl font-bold mb-2">Lupa Password</h1>
          <p className="opacity-70">Masukkan email Anda untuk reset password</p>
        </div>

        {/* Success Message */}
        {success && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-500/10 border border-green-500/30 text-green-600 rounded-lg p-3 mb-6 flex items-center"
          >
            <CheckCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
            <p>{successMessage}</p>
          </motion.div>
        )}
        
        {/* Error Message */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/30 text-red-600 rounded-lg p-3 mb-6 flex items-center"
          >
            <ExclamationCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
            <p>{error}</p>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-blue-500/25 flex items-center justify-center transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Memproses...</span>
              </>
            ) : (
              <>
                Kirim Link Reset
                <ArrowRightIcon className="h-5 w-5 ml-1" />
              </>
            )}
          </button>
        </form>

        {/* Links */}
        <div className="mt-8 text-center space-y-4">
          <div className="flex justify-center space-x-4">
            <Link to="/login" className="text-blue-500 hover:text-blue-600 font-medium flex items-center">
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Kembali ke Login
            </Link>
          </div>
          
          <Link 
            to="/" 
            className="inline-flex items-center text-sm hover:text-blue-500"
          >
            <HomeIcon className="h-4 w-4 mr-1" />
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
};

export default withPageTransition(ForgotPasswordPage);