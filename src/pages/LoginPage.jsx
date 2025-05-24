import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { login } from '../services/authService';
import { useTheme } from '../context/ThemeContext';
import { handleFrontendLogout, getHashParams, cleanHashParams } from '../utils/authUtils';
import { HomeIcon, ArrowLeftOnRectangleIcon, EyeIcon, EyeSlashIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

// Import komponen animasi
import AnimatedBackground from '../components/animations/AnimatedBackground';
import ParticlesBackground from '../components/animations/ParticlesBackground';
import AnimatedText from '../components/animations/AnimatedText';
import AnimatedButton from '../components/animations/AnimatedButton';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { theme, isMobile } = useTheme();
  
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

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AnimatedBackground
          effectType="DOTS"
          customConfig={{
            color: 0x3b82f6,
            backgroundColor: 0x111827,
            size: 2.5,
            spacing: 40
          }}
          className="min-h-screen"
        >
          <div className="w-full max-w-md p-8 rounded-2xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-center"
            >
              <AnimatedText
                text="Anda Sudah Login"
                type="letters"
                className="text-3xl font-bold text-white mb-2"
                delay={0.3}
              />
              
              <AnimatedText
                text="Silakan kembali ke beranda atau logout untuk masuk dengan akun lain."
                className="text-blue-100 mb-8"
                delay={0.6}
              />
            </motion.div>
            
            <div className="space-y-4">
              <Link to="/">
                <AnimatedButton
                  variant="light"
                  size="lg"
                  fullWidth
                  withGlow="rgba(255, 255, 255, 0.5)"
                  className="flex items-center justify-center"
                >
                  <HomeIcon className="h-5 w-5 mr-2" />
                  <span>Kembali ke Beranda</span>
                </AnimatedButton>
              </Link>
              
              <AnimatedButton
                onClick={handleLogout}
                variant="danger"
                size="lg"
                fullWidth
                withGlow="rgba(239, 68, 68, 0.5)"
                className="flex items-center justify-center"
              >
                <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2" />
                <span>Logout</span>
              </AnimatedButton>
            </div>
          </div>
        </AnimatedBackground>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <ParticlesBackground
        preset="stars"
        customOptions={{
          particles: {
            color: {
              value: "#ffffff"
            },
            number: {
              value: 80
            },
            opacity: {
              value: 0.5
            }
          },
          background: {
            color: {
              value: "#111827"
            }
          }
        }}
      />
      
      <div className="w-full max-w-md p-8 rounded-2xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center mb-6"
        >
          <AnimatedText
            text="Masuk ke RetinaScan"
            type="letters"
            className="text-3xl font-bold text-white mb-2"
            delay={0.3}
          />
          
          <AnimatedText
            text="Platform deteksi retinopati diabetik berbasis AI"
            className="text-blue-100"
            delay={0.6}
          />
        </motion.div>
        
        <motion.div
          className="bg-white/10 backdrop-blur-xl rounded-xl p-6 shadow-2xl border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
        >
          <motion.form 
            onSubmit={handleSubmit}
            variants={formVariants}
            initial="hidden"
            animate="visible"
            className="space-y-5"
          >
            {error && (
              <motion.div 
                className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-white text-sm"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                {error}
              </motion.div>
            )}
            
            <motion.div variants={itemVariants}>
              <label htmlFor="email" className="block text-sm font-medium text-blue-100 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                placeholder="nama@email.com"
                style={{ backdropFilter: 'blur(4px)' }}
              />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <label htmlFor="password" className="block text-sm font-medium text-blue-100 mb-1">
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Masukkan kata sandi"
                  style={{ backdropFilter: 'blur(4px)' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-200 hover:text-white transition-colors"
                >
                  {showPassword ? 
                    <EyeSlashIcon className="h-5 w-5" /> : 
                    <EyeIcon className="h-5 w-5" />
                  }
                </button>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Link to="/forgot-password" className="text-sm text-blue-300 hover:text-blue-100 transition-colors">
                Lupa kata sandi?
              </Link>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <AnimatedButton
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                withGlow
                withGradient
                gradientColors={['#3b82f6', '#8b5cf6']}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Memproses...</span>
                  </div>
                ) : (
                  <span className="flex items-center justify-center">
                    Masuk
                    <ArrowRightIcon className="h-5 w-5 ml-2" />
                  </span>
                )}
              </AnimatedButton>
            </motion.div>
          </motion.form>
        </motion.div>
        
        <motion.div 
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <p className="text-blue-100">
            Belum memiliki akun?{' '}
            <Link to="/register" className="text-blue-300 hover:text-blue-100 font-medium transition-colors">
              Daftar sekarang
            </Link>
          </p>
          
          <Link to="/" className="text-blue-300 hover:text-blue-100 text-sm flex items-center justify-center mt-4 transition-colors">
            <HomeIcon className="h-4 w-4 mr-1" />
            <span>Kembali ke beranda</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default LoginPage;