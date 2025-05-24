import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { requestPasswordReset } from '../services/authService';
import { withPageTransition } from '../context/ThemeContext';
import { 
  HomeIcon, 
  ArrowRightIcon, 
  EnvelopeIcon, 
  ExclamationCircleIcon,
  CheckCircleIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import AnimatedInput from '../components/AnimatedInput';
import VantaBackground from '../components/VantaBackground';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
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
    
    try {
      const response = await requestPasswordReset(email);
      
      if (response && response.success) {
        setSuccess(true);
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
      {/* Background animasi Vanta.js */}
      {isMounted && <VantaBackground color={0x0} waveHeight={15} waveSpeed={0.3} />}
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 z-0"></div>
      
      <div className="container mx-auto max-w-md relative z-10">
        {/* Decorative elements */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
        
        <div className="w-full max-w-md px-4 relative z-10">
          {/* Logo dan judul */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="mb-6 inline-block"
            >
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-cyan-600 to-blue-600 rounded-2xl shadow-lg p-5">
                <EnvelopeIcon className="w-full h-full text-white" />
              </div>
            </motion.div>
            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold text-white"
            >
              Lupa Password
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-2 text-gray-300"
            >
              Masukkan email Anda untuk mereset password
            </motion.p>
          </div>
          
          {/* Form lupa password dengan efek glass */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="bg-black/50 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden border border-white/10"
          >
            <div className="p-8">
              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                    <CheckCircleIcon className="h-10 w-10 text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Email Terkirim!</h3>
                  <p className="text-gray-300 mb-6">
                    Instruksi untuk mereset password telah dikirim ke email Anda. Silakan periksa kotak masuk atau folder spam.
                  </p>
                  <Link to="/login">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-medium"
                    >
                      Kembali ke Login
                    </motion.button>
                  </Link>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email input */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                      Email
                    </label>
                    <AnimatedInput 
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Masukkan email Anda"
                      icon={<EnvelopeIcon className="h-5 w-5 text-gray-400" />}
                      error={error && error.includes('email')}
                      className="w-full bg-white/5 border-white/10 text-white placeholder-gray-500"
                    />
                  </div>
                  
                  {/* Error message */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center bg-red-500/20 text-red-400 text-sm p-3 rounded-lg"
                      >
                        <ExclamationCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                        <span>{error}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Submit button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg shadow-md hover:shadow-cyan-500/20 transition-all flex items-center justify-center"
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
                        <span className="flex items-center justify-center">
                          Kirim Instruksi Reset
                          <ArrowRightIcon className="h-5 w-5 ml-2" />
                        </span>
                      )}
                    </button>
                  </div>
                  
                  {/* Login link */}
                  <div className="mt-8 text-center">
                    <Link 
                      to="/login" 
                      className="inline-flex items-center text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      <ArrowLeftIcon className="h-4 w-4 mr-1" />
                      Kembali ke Login
                    </Link>
                  </div>
                  
                  {/* Kembali ke beranda */}
                  <div className="mt-4 text-center">
                    <Link to="/" className="inline-flex items-center text-sm text-gray-400 hover:text-cyan-400 transition-colors">
                      <HomeIcon className="h-4 w-4 mr-1" />
                      Kembali ke Beranda
                    </Link>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default withPageTransition(ForgotPasswordPage);