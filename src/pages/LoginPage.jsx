import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { login } from '../services/authService';
import { useTheme } from '../context/ThemeContext';
import { handleFrontendLogout, getHashParams, cleanHashParams } from '../utils/authUtils';
import { HomeIcon, ArrowLeftOnRectangleIcon, EyeIcon, EyeSlashIcon, ArrowRightIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { withPageTransition } from '../context/ThemeContext';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { theme, isMobile, isDarkMode } = useTheme();
  
  // Environment variables
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const DASHBOARD_URL = import.meta.env.VITE_DASHBOARD_URL || 'http://localhost:3000';

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          console.log('Checking existing token...');
          // Coba dengan endpoint profile terlebih dahulu
          try {
            await axios.get(`${API_URL}/api/user/profile`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            console.log('Token valid via profile endpoint');
            setIsAuthenticated(true);
          } catch (profileError) {
            console.log('Profile endpoint failed, trying verify endpoint');
            // Jika gagal, coba dengan endpoint verify
            try {
              await axios.get(`${API_URL}/api/auth/verify`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              console.log('Token valid via verify endpoint');
              setIsAuthenticated(true);
            } catch (verifyError) {
              console.error('All verification methods failed');
              localStorage.removeItem('token');
              setIsAuthenticated(false);
            }
          }
        } catch (error) {
          console.error('Token verification error:', error);
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        }
      } else {
        console.log('No token found in localStorage');
      }
    };
    
    // Periksa parameter URL untuk error login (dari hash karena HashRouter)
    const query = getHashParams();
    
    const authError = query.get('auth');
    const from = query.get('from');
    
    console.log('Hash params:', query.toString());
    console.log('Auth params:', { auth: authError, from });
    
    if (authError === 'failed' && from === 'dashboard') {
      console.log('Login error detected from URL parameters');
      setError('Sesi login gagal. Silakan login kembali.');
      
      // Hapus parameter dari URL (sesuai dengan HashRouter)
      cleanHashParams();
    }
    
    checkAuth();
  }, [API_URL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      console.log('Mencoba login dengan:', { email, password: '***' });
      console.log('API URL:', API_URL);
      console.log('DASHBOARD URL:', DASHBOARD_URL);
      
      const response = await login({ email, password });
      console.log('Login response:', response);
      
      if (response && response.token) {
        // Simpan token ke localStorage
        localStorage.setItem('token', response.token);
        
        // Simpan informasi user jika ada
        if (response.user) {
          localStorage.setItem('user', JSON.stringify(response.user));
        }
        
        console.log('Login berhasil, redirect ke dashboard');
        
        // Pastikan DASHBOARD_URL tidak kosong
        const dashboardUrl = DASHBOARD_URL || 'http://localhost:3000';
        
        // Karena menggunakan HashRouter, kita perlu menyesuaikan URL redirect
        // Format yang benar: https://dashboard.example.com/#/?token=xxx
        console.log('Redirecting to:', `${dashboardUrl}/#/?token=${response.token}`);
        
        // Redirect ke dashboard dengan token sebagai parameter
        // Gunakan timeout untuk memastikan log selesai tercetak
        setTimeout(() => {
          window.location.href = `${dashboardUrl}/#/?token=${response.token}`;
        }, 500);
      } else {
        throw new Error('Token tidak ditemukan dalam respon');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Email atau kata sandi salah. Silakan periksa kembali informasi login Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    handleFrontendLogout(setIsAuthenticated, null, null, navigate);
  };
  
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

  const floatingIconVariants = {
    initial: { y: 0 },
    animate: {
      y: [-5, 5, -5],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
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

  if (isAuthenticated) {
    return (
      <div className={`min-h-screen flex items-center justify-center px-4 py-20 pt-36 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
          : 'bg-gradient-to-br from-blue-50 to-indigo-50'
      }`}>
        {/* Animated background shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className={`absolute h-96 w-96 -top-24 -left-24 rounded-full blur-3xl ${
              isDarkMode ? 'bg-blue-900/10' : 'bg-blue-500/10'
            }`}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1.5 }}
          ></motion.div>
          <motion.div 
            className={`absolute h-96 w-96 -bottom-24 -right-24 rounded-full blur-3xl ${
              isDarkMode ? 'bg-purple-900/10' : 'bg-purple-500/10'
            }`}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.3 }}
          ></motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className={`w-full max-w-md p-8 rounded-2xl relative z-10 ${
            isDarkMode 
              ? 'bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 text-white' 
              : 'bg-white/70 backdrop-blur-xl border border-white/50 shadow-xl'
          }`}
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h2 className={`text-3xl font-bold text-center mb-2 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>Anda Sudah Login</h2>
            <p className={`text-center mb-6 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>Silakan kembali ke beranda atau logout untuk masuk dengan akun lain.</p>
          </motion.div>
          
          <div className="space-y-4">
            <motion.div
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              <Link
                to="/"
                className="flex items-center justify-center w-full py-3 text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg group"
                style={{ 
                  background: isDarkMode 
                    ? `linear-gradient(135deg, ${theme.primary}, ${theme.accent})` 
                    : `linear-gradient(135deg, ${theme.primary}, ${theme.accent})` 
                }}
              >
                <motion.div
                  variants={floatingIconVariants}
                  initial="initial"
                  animate="animate"
                  className="mr-2"
                >
                  <HomeIcon className="h-5 w-5" />
                </motion.div>
                <span>Kembali ke Beranda</span>
              </Link>
            </motion.div>
            
            <motion.div
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              <button
                onClick={handleLogout}
                className={`flex items-center justify-center w-full py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg group ${
                  isDarkMode 
                    ? 'bg-gray-700 text-white hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <motion.div
                  variants={floatingIconVariants}
                  initial="initial"
                  animate="animate"
                  className="mr-2"
                >
                  <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                </motion.div>
                <span>Logout</span>
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center px-4 py-20 pt-36 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
        : 'bg-gradient-to-br from-blue-50 to-indigo-50'
    }`}>
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className={`absolute h-64 w-64 top-20 left-10 rounded-full blur-3xl ${
            isDarkMode ? 'bg-primary-900/10' : 'bg-primary-500/10'
          }`}
          variants={shapeVariants}
          initial="hidden"
          animate="visible"
        ></motion.div>
        <motion.div 
          className={`absolute h-80 w-80 bottom-20 right-10 rounded-full blur-3xl ${
            isDarkMode ? 'bg-accent-900/10' : 'bg-accent-500/10'
          }`}
          variants={shapeVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
        ></motion.div>
        <motion.div 
          className={`absolute h-72 w-72 top-1/3 -right-20 rounded-full blur-3xl ${
            isDarkMode ? 'bg-secondary-900/10' : 'bg-secondary-500/10'
          }`}
          variants={shapeVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.6 }}
        ></motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
          className="flex justify-center mb-4"
        >
          <img src="/logo.png" alt="RetinaScan Logo" className="h-16 w-auto" />
        </motion.div>
        <motion.h1 
          className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Selamat Datang Kembali
        </motion.h1>
        <motion.p 
          className={`mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Silakan login untuk melanjutkan
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className={`w-full max-w-md p-8 rounded-2xl relative z-10 ${
          isDarkMode 
            ? 'bg-gray-800/50 backdrop-blur-xl border border-gray-700/50' 
            : 'bg-white/70 backdrop-blur-xl border border-white/50 shadow-xl'
        }`}
      >
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.3 }}
              className={`mb-4 p-3 rounded-lg flex items-center ${
                isDarkMode 
                  ? 'bg-red-900/50 text-red-200 border border-red-800/50' 
                  : 'bg-red-100 text-red-800 border border-red-200'
              }`}
            >
              <ExclamationCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.form
          variants={formVariants}
          initial="hidden"
          animate="visible"
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <motion.div variants={itemVariants}>
            <label htmlFor="email" className={`block text-sm font-medium mb-1 ${
              isDarkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg focus:ring-2 focus:outline-none transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-gray-700/50 border border-gray-600 text-white focus:ring-primary-500/50' 
                  : 'bg-white border border-gray-300 text-gray-900 focus:ring-primary-500/50'
              }`}
              placeholder="nama@email.com"
              required
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label htmlFor="password" className={`block text-sm font-medium mb-1 ${
              isDarkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Kata Sandi
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg focus:ring-2 focus:outline-none transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-gray-700/50 border border-gray-600 text-white focus:ring-primary-500/50' 
                    : 'bg-white border border-gray-300 text-gray-900 focus:ring-primary-500/50'
                }`}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute inset-y-0 right-0 pr-3 flex items-center ${
                  isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className={`h-4 w-4 rounded focus:ring-2 focus:ring-offset-2 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-primary-500 focus:ring-primary-500/50' 
                    : 'bg-white border-gray-300 text-primary-600 focus:ring-primary-500/50'
                }`}
              />
              <label htmlFor="remember-me" className={`ml-2 block text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Ingat saya
              </label>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/forgot-password" className={`text-sm font-medium ${
                isDarkMode 
                  ? 'text-primary-400 hover:text-primary-300' 
                  : 'text-primary-600 hover:text-primary-500'
              }`}>
                Lupa kata sandi?
              </Link>
            </motion.div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <motion.button
              type="submit"
              disabled={isLoading}
              variants={buttonVariants}
              initial="initial"
              whileHover={isLoading ? "" : "hover"}
              whileTap={isLoading ? "" : "tap"}
              animate={isLoading ? "loading" : "initial"}
              className={`w-full flex items-center justify-center py-3 px-4 rounded-lg text-white font-medium transition-all duration-300 ${
                isLoading 
                  ? 'opacity-90 cursor-not-allowed' 
                  : 'shadow-md hover:shadow-lg'
              }`}
              style={{ 
                background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})` 
              }}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Memproses...</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <span>Masuk</span>
                  <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </motion.button>
          </motion.div>
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center"
        >
          <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
            Belum punya akun?{' '}
            <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
              <Link to="/register" className={`font-medium ${
                isDarkMode 
                  ? 'text-primary-400 hover:text-primary-300' 
                  : 'text-primary-600 hover:text-primary-500'
              }`}>
                Daftar sekarang
              </Link>
            </motion.span>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default withPageTransition(LoginPage);