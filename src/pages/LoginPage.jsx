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
      {/* Background animasi partikel yang ditingkatkan */}
      <ParticlesBackground 
        color={theme === 'dark' ? 'rgba(139, 92, 246, 0.5)' : 'rgba(79, 70, 229, 0.5)'} 
        count={isMobile ? 40 : 80}
        speed={0.8}
        type="vortex"
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
              className="text-gray-600 dark:text-gray-300 mt-2 text-lg drop-shadow-sm"
            >
              Masuk ke akun Anda
            </motion.p>
          </div>
          
          {/* Form login dengan efek glass yang ditingkatkan */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={getFormAnimation()}
            className={`bg-white/20 dark:bg-gray-900/30 backdrop-blur-lg rounded-2xl shadow-xl p-6 md:p-8 border border-white/20 dark:border-gray-700/30 transition-all duration-300 ${formFocused ? 'shadow-2xl scale-[1.01]' : ''}`}
            style={{
              boxShadow: formFocused 
                ? '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 15px rgba(79, 70, 229, 0.2)' 
                : '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
            }}
          >
            {/* Form header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Login</h2>
              <Link 
                to="/" 
                className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-200 flex items-center gap-1 text-sm"
              >
                <HomeIcon className="w-4 h-4" />
                <span>Beranda</span>
              </Link>
            </div>
            
            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="bg-red-100 dark:bg-red-900/40 border border-red-200 dark:border-red-800/50 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg mb-6 flex items-start"
                >
                  <ExclamationCircleIcon className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Form */}
            <form onSubmit={handleSubmit} ref={formRef} onFocus={handleFormFocus} onBlur={handleFormBlur}>
              <div className="space-y-5">
                {/* Email field */}
                <motion.div variants={enhancedAnimations.item}>
                  <AnimatedInput
                    id="email"
                    type="email"
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon={<EnvelopeIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />}
                    placeholder="nama@email.com"
                    autoComplete="email"
                    required
                  />
                </motion.div>
                
                {/* Password field */}
                <motion.div variants={enhancedAnimations.item}>
                  <AnimatedInput
                    id="password"
                    type={showPassword ? "text" : "password"}
                    label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    icon={<LockClosedIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                    endAdornment={
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="w-5 h-5" />
                        ) : (
                          <EyeIcon className="w-5 h-5" />
                        )}
                      </button>
                    }
                  />
                </motion.div>
                
                {/* Forgot password link */}
                <motion.div variants={enhancedAnimations.item} className="text-right">
                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-200"
                  >
                    Lupa password?
                  </Link>
                </motion.div>
                
                {/* Submit button */}
                <motion.div variants={enhancedAnimations.item}>
                  <AnimatedButton
                    type="submit"
                    fullWidth
                    isLoading={isLoading}
                    disabled={isLoading}
                    animate={controls}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  >
                    <span className="mr-2">Masuk</span>
                    <ArrowRightIcon className="w-5 h-5" />
                  </AnimatedButton>
                </motion.div>
              </div>
            </form>
            
            {/* Register link */}
            <motion.div 
              variants={enhancedAnimations.item}
              className="mt-6 text-center"
            >
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Belum punya akun?{' '}
                <Link
                  to="/register"
                  className="font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-200"
                >
                  Daftar sekarang
                </Link>
              </p>
            </motion.div>
          </motion.div>
          
          {/* Footer text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-center mt-8 text-xs text-gray-500 dark:text-gray-400"
          >
            <p>© {new Date().getFullYear()} RetinaScan. All rights reserved.</p>
            <p className="mt-1">Sistem Deteksi Diabetic Retinopathy</p>
          </motion.div>
        </div>
      </ScrollReveal>
    </div>
  );
};

export default withPageTransition(LoginPage);