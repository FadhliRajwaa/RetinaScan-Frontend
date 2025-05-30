import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { forgotPassword } from '../services/authService';
import { useTheme } from '../context/ThemeContext';
import { withPageTransition } from '../context/ThemeContext';
import { ParallaxBanner, Parallax } from 'react-scroll-parallax';
import { AtSymbolIcon, KeyIcon, ArrowRightIcon, ExclamationCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [emailSent, setEmailSent] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [showResetCode, setShowResetCode] = useState(false);
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const MAX_RETRY_ATTEMPTS = 2;

  // Animation variants
  const formVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.3,
        duration: 0.5
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.03, 
      boxShadow: isDarkMode 
        ? '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.15)' 
        : '0 10px 15px -3px rgba(59, 130, 246, 0.3), 0 4px 6px -2px rgba(59, 130, 246, 0.15)'
    },
    tap: { scale: 0.97 },
    loading: {
      scale: [1, 1.02, 1],
      transition: {
        repeat: Infinity,
        duration: 1
      }
    }
  };

  const inputVariants = {
    focus: { 
      scale: 1.02, 
      boxShadow: `0 0 0 3px ${isDarkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'}`, 
      borderColor: '#3B82F6',
      transition: { duration: 0.3 } 
    },
    blur: { 
      scale: 1, 
      boxShadow: 'none', 
      borderColor: isDarkMode ? '#374151' : '#D1D5DB',
      transition: { duration: 0.2 } 
    }
  };

  const shapeVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { 
      opacity: 0.2, 
      scale: 1,
      transition: { 
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  // Fungsi untuk mengirim email reset password melalui API backend
  const sendResetEmail = async (emailAddress, code) => {
    try {
      console.log('Mengirim permintaan reset password ke backend untuk:', emailAddress);
      
      // Gunakan URL backend yang benar berdasarkan environment
      const apiBaseUrl = import.meta.env.MODE === 'production'
        ? 'https://retinascan-backend-eszo.onrender.com'
        : API_URL;
      
      // Panggil API backend untuk mengirim email - perbaiki URL dengan menambahkan /api
      const response = await axios.post(`${apiBaseUrl}/api/email/send-reset-password`, {
        email: emailAddress,
        resetCode: code
      });
      
      if (response.data.success) {
        setEmailSent(true);
        setMessage('Instruksi reset password telah dikirim ke email Anda.');
        return true;
      } else {
        console.error('Respons error dari server:', response.data);
        
        // Jika ada fallback resetCode, tampilkan
        if (response.data.fallback && response.data.resetCode) {
          setEmailSent(true);
          setShowResetCode(true);
          setMessage('Sistem email tidak tersedia. Gunakan kode reset berikut:');
          return true;
        }
        
        return false;
      }
    } catch (err) {
      console.error('Error saat mengirim email:', err);
      
      // Jika ada fallback resetCode dari backend, tampilkan
      if (err.response?.data?.fallback && err.response?.data?.resetCode) {
        setEmailSent(true);
        setShowResetCode(true);
        setMessage('Sistem email tidak tersedia. Gunakan kode reset berikut:');
        return true;
      }
      
      // Jika server error, masih tampilkan kode reset yang sudah didapatkan
      if (err.response?.status === 500 && code) {
        setEmailSent(true);
        setShowResetCode(true);
        setMessage('Tidak dapat mengirim email reset password. Gunakan kode reset berikut:');
        return true;
      }
      
      return false;
    }
  };

  // Fungsi untuk mencoba ulang pengiriman email
  const retryEmailSending = async () => {
    if (retryCount >= MAX_RETRY_ATTEMPTS || !resetCode) {
      return false;
    }
    
    setIsRetrying(true);
    const success = await sendResetEmail(email, resetCode);
    setIsRetrying(false);
    setRetryCount(prev => prev + 1);
    
    // Jika masih gagal setelah percobaan terakhir, tampilkan kode
    if (!success && retryCount === MAX_RETRY_ATTEMPTS - 1) {
      setShowResetCode(true);
      setMessage('Setelah beberapa percobaan, sistem email masih tidak tersedia. Gunakan kode reset berikut:');
      setEmailSent(true);
      return true;
    }
    
    return success;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setEmailSent(false);
    setError('');
    setRetryCount(0);
    setShowResetCode(false);
    
    try {
      // Dapatkan kode reset dari API
      const response = await forgotPassword(email);
      setResetCode(response.resetCode);
      
      // Jika kode reset berhasil dibuat, kirim email
      if (response.resetCode) {
        const emailSuccess = await sendResetEmail(email, response.resetCode);
        
        if (!emailSuccess) {
          // Jika gagal mengirim email, tampilkan kode sebagai fallback
          setEmailSent(true);
          setShowResetCode(true);
          setMessage('Sistem email tidak tersedia. Gunakan kode reset berikut:');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan. Silakan coba lagi.');
      setResetCode('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    if (resetCode) {
      navigate(`/reset-password?code=${resetCode}`);
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Parallax background */}
      <ParallaxBanner
        layers={[
          { 
            image: isDarkMode 
              ? 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=2069&ixlib=rb-4.0.3' 
              : 'https://images.unsplash.com/photo-1579547945413-497e1b99dac0?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3',
            speed: -20,
            opacity: isDarkMode ? 0.3 : 0.7,
            scale: [1, 1.15, 'easeOutCubic']
          }
        ]}
        className="absolute inset-0"
      >
        {/* Overlay gradient */}
        <div className={`absolute inset-0 ${
          isDarkMode 
            ? 'bg-gradient-to-br from-gray-900/90 via-gray-900/80 to-gray-900/90'
            : 'bg-gradient-to-br from-blue-500/20 via-indigo-500/20 to-white/80'
        }`} />
      </ParallaxBanner>

      {/* Decorative shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          variants={shapeVariants}
          initial="hidden"
          animate="visible"
          className={`absolute top-[20%] left-[10%] w-64 h-64 rounded-full ${
            isDarkMode ? 'bg-blue-500/10' : 'bg-blue-300/20'
          } blur-3xl`}
        />
        <motion.div 
          variants={shapeVariants}
          initial="hidden"
          animate="visible"
          custom={0.2}
          className={`absolute bottom-[20%] right-[10%] w-80 h-80 rounded-full ${
            isDarkMode ? 'bg-purple-500/10' : 'bg-purple-300/20'
          } blur-3xl`}
        />
      </div>

      <div className="min-h-screen flex items-center justify-center px-4 py-16 relative z-10">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <Link to="/" className="inline-flex items-center justify-center">
              <KeyIcon className={`h-8 w-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              <span className={`ml-2 text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                RetinaScan
              </span>
            </Link>
          </motion.div>

          <motion.div
            variants={formVariants}
            initial="hidden"
            animate="visible"
            className={`p-8 rounded-2xl shadow-2xl ${
              isDarkMode 
                ? 'bg-gray-800/90 backdrop-blur-lg border border-gray-700' 
                : 'bg-white/90 backdrop-blur-lg border border-gray-100'
            }`}
          >
            <motion.div className="text-center mb-8">
              <motion.h2 
                variants={itemVariants}
                className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
              >
                Pulihkan Kata Sandi
              </motion.h2>
              
              <motion.p
                variants={itemVariants}
                className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
              >
                Masukkan email Anda untuk menerima instruksi reset password
              </motion.p>
            </motion.div>

            {emailSent && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg mb-6 ${
                  isDarkMode 
                    ? 'bg-green-900/30 border border-green-800/30' 
                    : 'bg-green-50 border border-green-100'
                }`}
              >
                <div className="flex items-start">
                  <CheckCircleIcon className={`h-5 w-5 mr-2 mt-0.5 flex-shrink-0 ${
                    isDarkMode ? 'text-green-400' : 'text-green-500'
                  }`} />
                  <div>
                    <p className={`text-sm font-medium ${
                      isDarkMode ? 'text-green-300' : 'text-green-800'
                    }`}>
                      {message}
                    </p>
                    
                    {!showResetCode && (
                      <p className={`text-sm mt-1 ${
                        isDarkMode ? 'text-green-300' : 'text-green-700'
                      }`}>
                        Silakan cek email Anda untuk instruksi reset password.
                      </p>
                    )}
                    
                    {showResetCode && resetCode && (
                      <div className="mt-2">
                        <p className={`text-sm ${
                          isDarkMode ? 'text-green-300' : 'text-green-700'
                        }`}>
                          Kode reset Anda:
                        </p>
                        <div className={`mt-1 p-2 rounded-md font-mono text-center ${
                          isDarkMode ? 'bg-gray-700 text-green-400' : 'bg-green-50 text-green-800 border border-green-200'
                        }`}>
                          {resetCode}
                        </div>
                        <p className={`text-xs mt-2 ${
                          isDarkMode ? 'text-green-400/70' : 'text-green-600/70'
                        }`}>
                          Simpan kode ini untuk digunakan pada halaman reset password.
                        </p>
                      </div>
                    )}
                    
                    <motion.button
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      onClick={handleContinue}
                      className={`mt-4 w-full py-2.5 px-4 rounded-lg flex items-center justify-center text-white font-medium ${
                        isDarkMode ? 'bg-green-600 hover:bg-green-500' : 'bg-green-600 hover:bg-green-700'
                      } transition-colors duration-200`}
                    >
                      <span>Lanjut ke Atur Ulang Kata Sandi</span>
                      <ArrowRightIcon className="ml-2 h-4 w-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg mb-6 flex flex-col ${
                  isDarkMode 
                    ? 'bg-red-900/30 border border-red-800/30' 
                    : 'bg-red-50 border border-red-100'
                }`}
              >
                <div className="flex items-start">
                  <ExclamationCircleIcon className={`h-5 w-5 mr-2 mt-0.5 flex-shrink-0 ${
                    isDarkMode ? 'text-red-400' : 'text-red-500'
                  }`} />
                  <p className={`text-sm ${
                    isDarkMode ? 'text-red-300' : 'text-red-800'
                  }`}>
                    {error}
                  </p>
                </div>
                
                {resetCode && retryCount < MAX_RETRY_ATTEMPTS && (
                  <motion.button
                    variants={buttonVariants}
                    whileHover={!isRetrying ? "hover" : undefined}
                    whileTap={!isRetrying ? "tap" : undefined}
                    onClick={retryEmailSending}
                    disabled={isRetrying}
                    className={`mt-4 py-2 px-4 rounded-lg flex items-center justify-center text-white font-medium ${
                      isDarkMode ? 'bg-red-600 hover:bg-red-500' : 'bg-red-600 hover:bg-red-700'
                    } transition-colors duration-200`}
                  >
                    {isRetrying ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Mencoba ulang...
                      </>
                    ) : (
                      <>
                        <span>Coba Kirim Email Lagi</span>
                      </>
                    )}
                  </motion.button>
                )}
                
                {resetCode && retryCount >= MAX_RETRY_ATTEMPTS && (
                  <div className="mt-4">
                    <p className={`text-sm mb-2 ${
                      isDarkMode ? 'text-red-300' : 'text-red-700'
                    }`}>
                      Jika Anda tidak dapat menerima email, gunakan kode berikut:
                    </p>
                    <div className={`mt-1 p-2 rounded-md font-mono text-center ${
                      isDarkMode ? 'bg-gray-700 text-red-400' : 'bg-red-50 text-red-800 border border-red-200'
                    }`}>
                      {resetCode}
                    </div>
                    <motion.button
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      onClick={handleContinue}
                      className={`mt-4 w-full py-2.5 px-4 rounded-lg flex items-center justify-center text-white font-medium ${
                        isDarkMode ? 'bg-red-600 hover:bg-red-500' : 'bg-red-600 hover:bg-red-700'
                      } transition-colors duration-200`}
                    >
                      <span>Lanjut ke Atur Ulang Kata Sandi</span>
                      <ArrowRightIcon className="ml-2 h-4 w-4" />
                    </motion.button>
                  </div>
                )}
              </motion.div>
            )}

            {!emailSent && !error && (
              <motion.form 
                onSubmit={handleSubmit} 
                className="space-y-6"
                variants={formVariants}
              >
                <motion.div variants={itemVariants}>
                  <label htmlFor="email" className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Email
                  </label>
                  <div className="relative">
                    <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
                      isDarkMode ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                      <AtSymbolIcon className="h-5 w-5" />
                    </div>
                    <motion.input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      variants={inputVariants}
                      animate={focusedInput === 'email' ? 'focus' : 'blur'}
                      onFocus={() => setFocusedInput('email')}
                      onBlur={() => setFocusedInput(null)}
                      className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none ${
                        isDarkMode 
                          ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                      }`}
                      placeholder="email@example.com"
                      required
                    />
                  </div>
                </motion.div>
                
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  variants={buttonVariants}
                  whileHover={!isLoading ? "hover" : undefined}
                  whileTap={!isLoading ? "tap" : undefined}
                  animate={isLoading ? "loading" : "initial"}
                  className={`w-full py-3 px-4 flex justify-center items-center rounded-lg text-white font-medium ${
                    isLoading 
                      ? isDarkMode ? 'bg-gray-600' : 'bg-blue-400'
                      : isDarkMode ? 'bg-blue-600 hover:bg-blue-500' : 'bg-blue-600 hover:bg-blue-700'
                  } transition-colors duration-200`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Memproses...
                    </>
                  ) : (
                    "Kirim Instruksi Reset Password"
                  )}
                </motion.button>
              </motion.form>
            )}

            <motion.div
              variants={itemVariants}
              className="mt-6 text-center"
            >
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                Kembali ke{' '}
                <Link to="/login" className={`font-medium hover:underline ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} relative group`}>
                  <span>Masuk</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-current transform origin-left transition-all duration-200 group-hover:w-full"></span>
                </Link>
              </p>
            </motion.div>
          </motion.div>
          
          <motion.div
            variants={itemVariants}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 text-center"
          >
            <Link to="/" className={`text-sm ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'}`}>
              &larr; Kembali ke beranda
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default withPageTransition(ForgotPasswordPage);