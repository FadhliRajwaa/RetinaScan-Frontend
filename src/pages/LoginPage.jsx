import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import axios from 'axios';
import { login } from '../services/authService';
import { useTheme, withPageTransition } from '../context/ThemeContext';
import { handleFrontendLogout, getHashParams, cleanHashParams } from '../utils/authUtils';
import { 
  HomeIcon, 
  ArrowLeftOnRectangleIcon, 
  ArrowRightIcon, 
  EnvelopeIcon, 
  LockClosedIcon,
  ExclamationCircleIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import { newTheme, enhancedAnimations, lottieConfig } from '../utils/newTheme';
import LottieAnimation from '../components/LottieAnimation';
import ParticlesBackground from '../components/ParticlesBackground';
import AnimatedButton from '../components/AnimatedButton';
import AnimatedInput from '../components/AnimatedInput';
import ScrollReveal from '../components/ScrollReveal';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formFocused, setFormFocused] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const formRef = useRef(null);
  
  const navigate = useNavigate();
  const { theme, isMobile } = useTheme();
  const controls = useAnimation();
  
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

  // Efek untuk animasi saat error
  useEffect(() => {
    if (error) {
      controls.start({
        x: [0, -10, 10, -10, 0],
        transition: { duration: 0.5 }
      });
    }
  }, [error, controls]);

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
    
    if (!password) {
      setError('Password tidak boleh kosong');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      console.log('Mencoba login dengan:', { email, password: '***' });
      console.log('API URL:', API_URL);
      console.log('DASHBOARD URL:', DASHBOARD_URL);
      
      // Animasi loading
      controls.start({
        scale: [1, 0.98, 1],
        transition: { duration: 0.5, repeat: Infinity }
      });
      
      const response = await login({ email, password });
      console.log('Login response:', response);
      
      if (response && response.token) {
        // Animasi sukses
        controls.start({
          scale: [1, 1.05, 1],
          transition: { duration: 0.5 }
        });
        
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
      setLoginAttempts(prev => prev + 1);
      
      // Animasi error
      controls.start({
        x: [0, -10, 10, -10, 0],
        transition: { duration: 0.5 }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    handleFrontendLogout(setIsAuthenticated, null, null, navigate);
  };
  
  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Animasi untuk form focus
  const handleFormFocus = () => {
    setFormFocused(true);
  };

  const handleFormBlur = (e) => {
    // Jika klik diluar form, set formFocused ke false
    if (formRef.current && !formRef.current.contains(e.relatedTarget)) {
      setFormFocused(false);
    }
  };
  
  // Variasi animasi berdasarkan jumlah percobaan login
  const getFormAnimation = () => {
    if (loginAttempts === 0) {
      return enhancedAnimations.container;
    } else if (loginAttempts === 1) {
      return {
        hidden: { opacity: 0, y: 20 },
    visible: { 
          opacity: 1,
      y: 0, 
          transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2,
            duration: 0.8
          }
        }
      };
    } else {
      // Animasi lebih intens untuk percobaan login yang lebih banyak
      return {
        hidden: { opacity: 0, y: 20 },
        visible: {
      opacity: 1,
          y: 0,
          transition: {
            type: 'spring',
            stiffness: 400,
            damping: 15,
            staggerChildren: 0.1,
            delayChildren: 0.1
          }
        }
      };
    }
  };

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-20 pt-36 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 dark:from-gray-900 dark:to-blue-900">
        {/* Animated background particles */}
        <ParticlesBackground 
          color="rgba(6, 182, 212, 0.6)"
          count={60}
          speed={0.8}
          type="wave"
          connected={true}
        />
        
        <motion.div
          initial={enhancedAnimations.card.initial}
          animate={enhancedAnimations.card.animate}
          className="w-full max-w-md p-8 rounded-2xl relative z-10"
          style={{ 
            ...newTheme.glass.light,
            boxShadow: newTheme.shadows.xl
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: 'spring', stiffness: 300, damping: 25 }}
            className="h-40 mb-6 mx-auto"
          >
            <LottieAnimation
              animationData={lottieConfig.animations.success}
              loop={false}
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-center mb-2" style={{ color: newTheme.text.primary }}>
              Anda Sudah Login
            </h2>
            <p className="text-center mb-8" style={{ color: newTheme.text.secondary }}>
              Silakan kembali ke beranda atau logout untuk masuk dengan akun lain.
            </p>
          </motion.div>
          
          <div className="space-y-4">
            <AnimatedButton
              variant="primary"
              fullWidth
              onClick={() => navigate('/')}
              >
              <HomeIcon className="w-5 h-5 mr-2" />
              Kembali ke Beranda
            </AnimatedButton>
            
            <AnimatedButton
              variant="outline"
              fullWidth
              onClick={handleLogout}
            >
              <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-2" />
              Logout
            </AnimatedButton>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center w-full relative overflow-hidden">
      {/* Background animasi partikel yang dioptimalkan */}
      <ParticlesBackground 
        color={theme === 'dark' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(79, 70, 229, 0.3)'} 
        count={isMobile ? 30 : 50}
        speed={0.5}
        type="pulse"
        connected={true}
        interactive={true}
      />
      
      {/* Container utama dengan efek glass yang ditingkatkan */}
      <ScrollReveal>
        <div className="w-full max-w-md px-4 py-6 relative z-10">
          {/* Logo dan judul */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="mb-4 inline-block"
            >
              <LottieAnimation 
                animationData={lottieConfig.eyeScan}
                style={{ width: 120, height: 120 }}
              />
            </motion.div>
            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white drop-shadow-md"
            >
              RetinaScan
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-2 text-gray-600 dark:text-gray-300"
            >
              Masuk ke akun Anda
            </motion.p>
          </div>
          
          {/* Form login dengan efek glass */}
          <motion.div
            ref={formRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            onFocus={handleFormFocus}
            onBlur={handleFormBlur}
            className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 ${
              formFocused ? 'shadow-2xl transform scale-[1.01]' : ''
            }`}
          >
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email input */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
                    className="w-full"
                  />
                </div>
                
                {/* Password input */}
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  <div className="relative">
                    <AnimatedInput 
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan password Anda"
                      icon={<LockClosedIcon className="h-5 w-5 text-gray-400" />}
                      error={error && error.includes('password')}
                      className="w-full pr-10"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Error message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center text-red-600 dark:text-red-400 text-sm"
                    >
                      <ExclamationCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                      <span>{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Forgot password link */}
                <div className="flex justify-end">
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                  >
                    Lupa password?
                  </Link>
                </div>
                
                {/* Login button */}
                <div>
                  <AnimatedButton
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all"
                    animate={controls}
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
                        Login
                        <ArrowRightIcon className="h-5 w-5 ml-2" />
                      </span>
                    )}
                  </AnimatedButton>
                </div>
              </form>
              
              {/* Register link */}
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Belum memiliki akun?{' '}
                  <Link 
                    to="/register" 
                    className="font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                  >
                    Daftar sekarang
                  </Link>
                </p>
              </div>
              
              {/* Kembali ke beranda */}
              <div className="mt-6 text-center">
                <Link 
                  to="/" 
                  className="inline-flex items-center text-sm text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
                >
                  <HomeIcon className="h-4 w-4 mr-1" />
                  <span>Kembali ke Beranda</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </ScrollReveal>
    </div>
  );
};

export default withPageTransition(LoginPage);