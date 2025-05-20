import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { login } from '../services/authService';
import { useTheme } from '../context/ThemeContext';
import { HomeIcon, ArrowLeftOnRectangleIcon, EyeIcon, EyeSlashIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { theme, isMobile } = useTheme();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          await axios.get('http://localhost:5000/api/user/profile', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setIsAuthenticated(true);
        } catch (error) {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        }
      }
    };
    checkAuth();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const { token } = await login({ email, password });
      localStorage.setItem('token', token);
      window.location.href = `http://localhost:3000/dashboard?token=${token}`;
    } catch (err) {
      setError('Email atau kata sandi salah.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
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
      <div className="min-h-screen flex items-center justify-center px-4 py-20 pt-36"
           style={{ 
             background: `linear-gradient(to bottom right, ${theme.background}, #e6e9f0)` 
           }}>
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute h-96 w-96 -top-24 -left-24 rounded-full blur-3xl"
               style={{ backgroundColor: `${theme.primary}20` }}></div>
          <div className="absolute h-96 w-96 -bottom-24 -right-24 rounded-full blur-3xl"
               style={{ backgroundColor: `${theme.accent}30` }}></div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md p-8 rounded-2xl relative z-10"
          style={{ 
            ...theme.glassEffect,
            boxShadow: theme.mediumShadow
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Anda Sudah Login</h2>
            <p className="text-center text-gray-600 mb-6">Silakan kembali ke beranda atau logout untuk masuk dengan akun lain.</p>
          </motion.div>
          
          <div className="space-y-4">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Link
                to="/"
                className="flex items-center justify-center w-full py-3 text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg group"
                style={{ 
                  background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})` 
                }}
              >
                <HomeIcon className="h-5 w-5 mr-2 group-hover:animate-pulse" />
                <span>Kembali ke Beranda</span>
              </Link>
            </motion.div>
            
            <motion.button
              onClick={handleLogout}
              className="flex items-center justify-center w-full py-3 text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg group"
              style={{ background: 'linear-gradient(135deg, #ef4444, #f87171)' }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2 group-hover:translate-x-1 transition-transform" />
              <span>Logout</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 pt-36"
         style={{ 
           background: `linear-gradient(to bottom right, #f0f9ff, #e1effe)` 
         }}>
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute h-96 w-96 top-0 -left-48 bg-blue-400 opacity-10 rounded-full blur-3xl floating"></div>
        <div className="absolute h-96 w-96 bottom-0 -right-48 bg-indigo-400 opacity-10 rounded-full blur-3xl floating" style={{ animationDelay: '1s' }}></div>
        <div className="absolute h-64 w-64 top-1/4 right-1/4 bg-purple-400 opacity-10 rounded-full blur-3xl floating" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md p-8 rounded-2xl shadow-2xl relative z-10"
        style={{ 
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)'
        }}
      >
        <motion.h2 
          className="text-3xl font-bold text-center mb-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          style={{ color: theme.primary }}
        >
          Masuk ke <span style={{ 
            background: `linear-gradient(90deg, ${theme.primary}, ${theme.accent})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>RetinaScan</span>
        </motion.h2>
        
        <motion.p
          className="text-center text-gray-600 text-sm mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Masukkan kredensial Anda untuk mengakses dashboard
        </motion.p>
        
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-red-600/20 backdrop-blur-md border border-red-700/30 text-white p-3 rounded-lg mb-6 flex items-center"
          >
            <svg className="w-5 h-5 mr-2 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </motion.div>
        )}
        
        <motion.form 
          onSubmit={handleSubmit}
          variants={formVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <motion.div variants={itemVariants}>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full p-3 pl-4 rounded-lg border-gray-200 border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-gray-700 placeholder-gray-400 transition-all duration-200"
                required
                placeholder="nama@email.com"
              />
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Kata Sandi
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full p-3 pl-4 pr-10 rounded-lg border-gray-200 border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-gray-700 placeholder-gray-400 transition-all duration-200"
                required
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 transition"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-3 px-4 rounded-lg text-white font-semibold transition-all duration-300 flex items-center justify-center"
              style={{
                background: isLoading 
                  ? 'rgba(59, 130, 246, 0.5)'
                  : `linear-gradient(90deg, ${theme.primary}, ${theme.accent})`,
                boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.3)',
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Memproses...
                </span>
              ) : (
                <span className="flex items-center">
                  Masuk
                  <ArrowRightIcon className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </motion.button>
          </motion.div>
        </motion.form>
        
        <motion.div 
          className="mt-8 text-center space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <motion.p 
            className="text-blue-200"
            whileHover={{ scale: 1.03 }}
          >
            Lupa kata sandi?{' '}
            <Link to="/forgot-password" className="text-blue-300 hover:text-white font-medium transition-colors duration-200 underline decoration-2 decoration-blue-400/30 hover:decoration-blue-400">
              Pulihkan
            </Link>
          </motion.p>
          
          <motion.p 
            className="text-blue-200"
            whileHover={{ scale: 1.03 }}
          >
            Belum punya akun?{' '}
            <Link to="/register" className="text-blue-300 hover:text-white font-medium transition-colors duration-200 underline decoration-2 decoration-blue-400/30 hover:decoration-blue-400">
              Daftar
            </Link>
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default LoginPage;