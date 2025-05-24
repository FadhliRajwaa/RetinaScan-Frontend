import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { login } from '../services/authService';
import { useTheme, withPageTransition } from '../context/ThemeContext';
import { handleFrontendLogout, getHashParams, cleanHashParams } from '../utils/authUtils';
import { HomeIcon, ArrowLeftOnRectangleIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { newTheme, enhancedAnimations, lottieConfig } from '../utils/newTheme';
import LottieAnimation from '../components/LottieAnimation';
import ParticlesBackground from '../components/ParticlesBackground';
import AnimatedButton from '../components/AnimatedButton';
import AnimatedInput from '../components/AnimatedInput';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-20 pt-36"
           style={{ 
             background: newTheme.gradients.ocean
           }}>
        {/* Animated background particles */}
        <ParticlesBackground 
          color="rgba(6, 182, 212, 0.6)"
          count={60}
          speed={0.8}
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
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
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
          count={40}
          speed={0.6}
        />
        
        <div className="relative z-10 max-w-md w-full">
          <motion.div 
            className="mb-8 text-center"
            initial={enhancedAnimations.fadeInDown.hidden}
            animate={enhancedAnimations.fadeInDown.visible(0.2)}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: newTheme.text.light }}>
              Selamat Datang Kembali
            </h1>
            <p className="text-lg opacity-90" style={{ color: newTheme.text.light }}>
              Masuk ke akun Anda untuk mengakses layanan RetinaScan
            </p>
          </motion.div>
          
          <motion.div 
            className="w-full h-64 md:h-80 mx-auto"
            initial={enhancedAnimations.scaleIn.hidden}
            animate={enhancedAnimations.scaleIn.visible(0.4)}
          >
            <LottieAnimation 
              animationData={lottieConfig.animations.login}
              loop={true}
            />
          </motion.div>
          
          <motion.div 
            className="mt-8 text-center"
            initial={enhancedAnimations.fadeInUp.hidden}
            animate={enhancedAnimations.fadeInUp.visible(0.6)}
          >
            <p className="text-white text-opacity-90">
              Belum memiliki akun?
            </p>
            <Link 
              to="/register" 
              className="inline-block mt-2 text-white font-medium underline hover:text-cyan-200 transition-colors"
            >
              Daftar Sekarang
            </Link>
          </motion.div>
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
          <motion.div 
            className="text-center mb-8"
            initial={enhancedAnimations.fadeInDown.hidden}
            animate={enhancedAnimations.fadeInDown.visible(0.3)}
          >
            <h2 className="text-3xl font-bold mb-2" style={{ color: newTheme.text.primary }}>
              Login
            </h2>
            <p style={{ color: newTheme.text.secondary }}>
              Masukkan email dan kata sandi Anda
            </p>
          </motion.div>
          
          {error && (
            <motion.div 
              className="mb-6 p-4 rounded-lg"
              style={{ 
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderLeft: `4px solid ${newTheme.danger}` 
              }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p style={{ color: newTheme.danger }}>{error}</p>
            </motion.div>
          )}
          
          <motion.form 
            onSubmit={handleSubmit}
            className="space-y-6"
            variants={enhancedAnimations.container}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={enhancedAnimations.item}>
              <AnimatedInput
                type="email"
                name="email"
                id="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </motion.div>
            
            <motion.div variants={enhancedAnimations.item}>
              <AnimatedInput
                type="password"
                name="password"
                id="password"
                label="Kata Sandi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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
              <Link 
                to="/forgot-password" 
                className="font-medium hover:underline transition-all"
                style={{ color: newTheme.primary }}
              >
                Lupa kata sandi?
              </Link>
            </motion.div>
            
            <motion.div variants={enhancedAnimations.item}>
              <AnimatedButton
                type="submit"
                variant="primary"
                fullWidth
                disabled={isLoading}
              >
                {isLoading ? 'Memproses...' : (
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
              <Link 
                to="/" 
                className="inline-flex items-center text-sm font-medium hover:underline"
                style={{ color: newTheme.text.secondary }}
              >
                <HomeIcon className="w-4 h-4 mr-2" />
                Kembali ke Beranda
              </Link>
            </motion.div>
          </motion.form>
        </div>
      </motion.div>
    </div>
  );
};

export default withPageTransition(LoginPage);