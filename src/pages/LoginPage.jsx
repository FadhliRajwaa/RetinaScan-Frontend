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
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Column - Animation */}
      <motion.div 
        className="md:w-1/2 bg-gradient-to-br flex items-center justify-center p-8 relative overflow-hidden"
        style={{ background: newTheme.gradients.ocean }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <ParticlesBackground 
          color="rgba(6, 182, 212, 0.6)"
          count={isMobile ? 30 : 50}
          speed={0.6}
          type="wave"
          connected={true}
          interactive={true}
        />
        
        <div className="relative z-10 max-w-md w-full">
          <ScrollReveal animation="fade-down" delay={0.2}>
            <div className="mb-8 text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: newTheme.text.light }}>
                Selamat Datang Kembali
              </h1>
              <p className="text-lg opacity-90" style={{ color: newTheme.text.light }}>
                Masuk ke akun Anda untuk mengakses layanan RetinaScan
              </p>
            </div>
          </ScrollReveal>
          
          <ScrollReveal animation="zoom-in" delay={0.4}>
            <div className="w-full h-64 md:h-80 mx-auto">
              <LottieAnimation 
                animationData={lottieConfig.animations.login}
                loop={true}
              />
            </div>
          </ScrollReveal>
          
          <ScrollReveal animation="fade-up" delay={0.6}>
            <div className="mt-8 text-center">
              <p className="text-white text-opacity-90">
                Belum memiliki akun?
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  to="/register" 
                  className="inline-block mt-2 px-6 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white font-medium hover:bg-white/30 transition-all"
                >
                  Daftar Sekarang
                </Link>
              </motion.div>
            </div>
          </ScrollReveal>
      </div>
      </motion.div>
      
      {/* Right Column - Login Form */}
      <motion.div
        className="md:w-1/2 flex items-center justify-center p-6 md:p-12"
        style={{ background: newTheme.background.light }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="w-full max-w-md">
          <ScrollReveal animation="fade-down" delay={0.3}>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2" style={{ color: newTheme.text.primary }}>
                Login
              </h2>
              <p style={{ color: newTheme.text.secondary }}>
                Masukkan email dan kata sandi Anda
              </p>
            </div>
          </ScrollReveal>
          
          <AnimatePresence>
            {error && (
              <motion.div 
                className="mb-6 p-4 rounded-lg flex items-start"
                style={{ 
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  borderLeft: `4px solid ${newTheme.danger}` 
                }}
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ExclamationCircleIcon className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" style={{ color: newTheme.danger }} />
                <p style={{ color: newTheme.danger }}>{error}</p>
              </motion.div>
            )}
          </AnimatePresence>
          
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 backdrop-blur-sm"
            style={{
              boxShadow: newTheme.shadows.xl,
              background: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
        <motion.form 
              ref={formRef}
          onSubmit={handleSubmit}
              className="space-y-6"
              variants={getFormAnimation()}
          initial="hidden"
              animate={controls}
              onFocus={handleFormFocus}
              onBlur={handleFormBlur}
            >
              <motion.div variants={enhancedAnimations.item}>
                <AnimatedInput
                type="email"
                  name="email"
                id="email"
                  label="Email"
                value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                required
                  icon={<EnvelopeIcon className="w-5 h-5" />}
                  error={error && error.includes('Email') ? ' ' : undefined}
              />
          </motion.div>
          
              <motion.div variants={enhancedAnimations.item}>
                <AnimatedInput
                  type={showPassword ? "text" : "password"}
                  name="password"
                id="password"
                  label="Kata Sandi"
                value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                required
                  icon={<LockClosedIcon className="w-5 h-5" />}
                  error={error && error.includes('sandi') ? ' ' : undefined}
                  rightIcon={
                    <motion.button
                type="button"
                      onClick={togglePasswordVisibility}
                      className="focus:outline-none"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
              >
                {showPassword ? (
                        <EyeSlashIcon className="w-5 h-5 text-gray-500" />
                      ) : (
                        <EyeIcon className="w-5 h-5 text-gray-500" />
                      )}
                    </motion.button>
                  }
                />
              </motion.div>
              
              <motion.div 
                className="flex justify-between items-center text-sm"
                variants={enhancedAnimations.item}
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    className="mr-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="remember" style={{ color: newTheme.text.secondary }}>
                    Ingat saya
                  </label>
            </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    to="/forgot-password" 
                    className="font-medium hover:underline transition-all"
                    style={{ color: newTheme.primary }}
                  >
                    Lupa kata sandi?
                  </Link>
                </motion.div>
          </motion.div>
          
              <motion.div variants={enhancedAnimations.item}>
                <AnimatedButton
              type="submit"
                  variant="primary"
                  fullWidth
              disabled={isLoading}
            >
              {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Memproses...
                    </div>
              ) : (
                    <>
                  Masuk
                      <ArrowRightIcon className="w-5 h-5 ml-2" />
                    </>
              )}
                </AnimatedButton>
          </motion.div>
        
        <motion.div 
                className="text-center mt-8"
                variants={enhancedAnimations.item}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    to="/" 
                    className="inline-flex items-center text-sm font-medium hover:underline"
                    style={{ color: newTheme.text.secondary }}
                  >
                    <HomeIcon className="w-4 h-4 mr-2" />
                    Kembali ke Beranda
            </Link>
                </motion.div>
              </motion.div>
            </motion.form>
        </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default withPageTransition(LoginPage);