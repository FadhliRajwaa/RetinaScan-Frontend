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
import AnimatedButton from '../components/AnimatedButton';
import AnimatedInput from '../components/AnimatedInput';
import AnimatedText from '../components/AnimatedText';
import VantaBackground from '../components/VantaBackground';
import { TextAnimate } from '../components/TextAnimate';
import { AuroraText } from '../components/AuroraText';
import { FlipText } from '../components/FlipText';
import { SparklesText } from '../components/SparklesText';
import ParticlesBackground from '../components/ParticlesBackground';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formFocused, setFormFocused] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [remember, setRemember] = useState(false);
  
  const formRef = useRef(null);
  
  const navigate = useNavigate();
  const { theme } = useTheme();
  const controls = useAnimation();
  
  // Environment variables
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const DASHBOARD_URL = import.meta.env.VITE_DASHBOARD_URL || 'http://localhost:3000';

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

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

  // Validasi form
  const validateForm = () => {
    let valid = true;
    
    // Reset error
    setEmailError('');
    setPasswordError('');
    setError('');
    
    if (!email.trim()) {
      setEmailError('Email tidak boleh kosong');
      valid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Format email tidak valid');
      valid = false;
    }
    
    if (!password) {
      setPasswordError('Password tidak boleh kosong');
      valid = false;
    }
    
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi form
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setIsLoading(true);
    
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
      
      // Memberikan pesan error yang lebih spesifik
      if (err.message && err.message.includes('Network Error')) {
        setError('Tidak dapat terhubung ke server. Periksa koneksi internet Anda atau coba lagi nanti.');
      } else if (err.response) {
        // Error dari server dengan respon
        if (err.response.status === 401) {
          setError('Email atau kata sandi salah. Silakan periksa kembali informasi login Anda.');
        } else if (err.response.status === 403) {
          setError('Akun Anda tidak memiliki izin untuk mengakses halaman ini.');
        } else if (err.response.status >= 500) {
          setError('Terjadi kesalahan pada server. Silakan coba lagi nanti.');
        } else {
          setError(err.response.data?.message || 'Terjadi kesalahan saat login. Silakan coba lagi.');
        }
      } else {
        // Error lainnya
        setError('Terjadi kesalahan saat login. Silakan coba lagi.');
      }
      
      setLoginAttempts(prev => prev + 1);
      
      // Animasi error
      controls.start({
        x: [0, -10, 10, -10, 0],
        transition: { duration: 0.5 }
      });
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    handleFrontendLogout(setIsAuthenticated, null, null, navigate);
  };
  
  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const handleFormFocus = () => {
    setFormFocused(true);
  };
  
  const handleFormBlur = (e) => {
    if (!formRef.current?.contains(e.relatedTarget)) {
      setFormFocused(false);
    }
  };

  // Framer Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    },
    exit: { 
      opacity: 0,
      transition: { 
        when: "afterChildren",
        staggerChildren: 0.1,
        staggerDirection: -1 
      } 
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.3 }
    }
  };
  
  // Render halaman jika sudah login
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mx-auto bg-green-500 rounded-full p-3 w-16 h-16 mb-4 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </motion.div>
          <h1 className="text-2xl font-bold mb-2">Anda Sudah Login</h1>
          <p className="text-gray-500 mb-6">Silakan pergi ke dashboard atau logout untuk masuk dengan akun lain.</p>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 justify-center">
            <Link
              to={`${DASHBOARD_URL}/#/?token=${localStorage.getItem('token')}`}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden py-10">
      {/* Particles Background */}
      <ParticlesBackground 
        options={{
          particles: {
            number: {
              value: 100,
              density: {
                enable: true,
                value_area: 800
              }
            },
            color: {
              value: "#3b82f6"
            },
            opacity: {
              value: 0.5,
              random: true
            },
            size: {
              value: 3,
              random: true
            },
            line_linked: {
              enable: true,
              distance: 150,
              color: "#8db2fe",
              opacity: 0.3,
              width: 1
            },
            move: {
              enable: true,
              speed: 1.5
            }
          },
          interactivity: {
            events: {
              onhover: {
                enable: true,
                mode: "grab"
              },
              onclick: {
                enable: true,
                mode: "push"
              }
            }
          }
        }}
      />
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="w-full max-w-md relative z-10"
      >
        {/* Logo & Title */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <motion.div
            className="mx-auto"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, rotate: [0, 10, 0] }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2
            }}
          >
            <div className="h-20 w-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-4 mx-auto mb-4 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-indigo-600/80 animate-pulse"></div>
              <EyeIcon className="h-12 w-12 text-white relative z-10" />
            </div>
          </motion.div>
          
          <motion.h1 
            className="text-4xl font-bold mb-2 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <FlipText className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
              Selamat Datang
            </FlipText>
          </motion.h1>
          
          <motion.p 
            className="text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <TextAnimate by="word" animation="fadeIn" delay={0.5}>
              Masuk ke akun RetinaScan Anda
            </TextAnimate>
          </motion.p>
        </motion.div>
        
        {/* Login Form */}
        <motion.div
          variants={itemVariants}
          className="glass-card bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl"
          style={{
            boxShadow: "0 10px 40px -10px rgba(0, 0, 0, 0.5), 0 0 80px -10px rgba(59, 130, 246, 0.3)"
          }}
          animate={controls}
        >
          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="bg-red-500/10 border border-red-500/30 text-red-600 rounded-lg p-3 mb-6 flex items-center"
              >
                <ExclamationCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                <p>{error}</p>
              </motion.div>
            )}
          </AnimatePresence>
          
          <form 
            ref={formRef} 
            onSubmit={handleSubmit} 
            onFocus={handleFormFocus} 
            onBlur={handleFormBlur}
            className="space-y-6"
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
              error={emailError}
              errorMessage={emailError}
            />
            
            <AnimatedInput
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="Password"
              required
              placeholder="Masukkan password anda"
              icon={<LockClosedIcon className="h-5 w-5" />}
              endIcon={
                <button 
                  type="button" 
                  onClick={togglePasswordVisibility}
                  className="focus:outline-none"
                >
                  {showPassword ? 
                    <EyeSlashIcon className="h-5 w-5" /> : 
                    <EyeIcon className="h-5 w-5" />
                  }
                </button>
              }
              error={passwordError}
              errorMessage={passwordError}
            />
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-700 bg-gray-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900"
                />
                <label htmlFor="remember-me" className="ml-2 block text-gray-400">
                  Ingat saya
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="font-medium text-blue-500 hover:text-blue-400 transition-colors"
              >
                Lupa password?
              </Link>
            </div>
            
            <div>
              <AnimatedButton
                type="submit"
                disabled={isLoading}
                isLoading={isLoading}
                loadingText="Memproses..."
                primary={true}
                gradientFrom="from-blue-600"
                gradientTo="to-indigo-600"
                className="w-full py-2.5"
                icon={<ArrowRightIcon className="h-5 w-5 ml-1" />}
              >
                Login
              </AnimatedButton>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Belum memiliki akun?{' '}
              <Link
                to="/register"
                className="font-medium text-blue-500 hover:text-blue-400 transition-colors"
              >
                <SparklesText minSize={5} maxSize={10} sparklesCount={5}>
                  Daftar sekarang
                </SparklesText>
              </Link>
            </p>
          </div>
        </motion.div>
        
        <motion.div 
          variants={itemVariants} 
          className="mt-8 text-center"
        >
          <Link 
            to="/" 
            className="inline-flex items-center text-sm text-gray-400 hover:text-blue-500 transition-colors"
          >
            <HomeIcon className="h-4 w-4 mr-1" />
            Kembali ke Beranda
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default withPageTransition(LoginPage);