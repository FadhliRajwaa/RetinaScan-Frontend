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
<<<<<<< HEAD
      setError('Email atau kata sandi salah. Silakan periksa kembali informasi login Anda.');
      setLoginAttempts(prev => prev + 1);
      
      // Animasi error
      controls.start({
        x: [0, -10, 10, -10, 0],
        transition: { duration: 0.5 }
      });
=======
      
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
>>>>>>> 34aacf9 (fix)
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

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-20 pt-36 relative overflow-hidden">
        {/* Background tidak perlu lagi karena sudah ada di App.jsx */}
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md p-8 rounded-2xl relative z-10 bg-black/50 backdrop-blur-xl border border-white/10"
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center mb-6"
          >
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-cyan-600 to-blue-600 rounded-2xl shadow-lg p-5 mb-4">
              <EyeIcon className="w-full h-full text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Anda Sudah Login
            </h2>
            <p className="text-gray-300 mb-8">
              Silakan kembali ke beranda atau logout untuk masuk dengan akun lain.
            </p>
          </motion.div>
          
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm text-white transition-colors hover:bg-white/20"
                >
                  <HomeIcon className="h-5 w-5 mr-2" />
                  Kembali ke Beranda
                </motion.button>
              </Link>
              <button 
                onClick={handleLogout}
                className="flex items-center px-4 py-2 rounded-lg bg-red-500/20 text-red-400 transition-colors hover:bg-red-500/30"
              >
                <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 pt-36 relative overflow-hidden">
      {/* Background tidak perlu lagi karena sudah ada di App.jsx */}
      
      {/* Login Form */}
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
          <AnimatedText className="text-3xl font-bold mb-2">Login</AnimatedText>
          <p className="opacity-70">Silahkan masuk untuk melanjutkan</p>
        </div>

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

        {/* Login Form */}
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
            error={emailError}
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
          />

          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor="remember" className="ml-2 block">
                Ingat saya
              </label>
            </div>
            <Link 
              to="/forgot-password" 
              className="text-blue-500 hover:text-blue-600 font-medium"
            >
              Lupa password?
            </Link>
          </div>

          <AnimatedButton
            type="submit"
            primary
            isLoading={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Memproses...' : 'Login'}
            {!isSubmitting && <ArrowRightIcon className="h-5 w-5 ml-1" />}
          </AnimatedButton>
        </form>

        {/* Links */}
        <div className="mt-8 text-center space-y-4">
          <p>
            Belum memiliki akun?{' '}
            <Link to="/register" className="text-blue-500 hover:text-blue-600 font-medium">
              Daftar sekarang
            </Link>
          </p>
          
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

export default withPageTransition(LoginPage);