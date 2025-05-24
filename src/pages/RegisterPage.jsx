import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { register } from '../services/authService';
import { useTheme, withPageTransition } from '../context/ThemeContext';
import { HomeIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { newTheme, enhancedAnimations, lottieConfig } from '../utils/newTheme';
import LottieAnimation from '../components/LottieAnimation';
import ParticlesBackground from '../components/ParticlesBackground';
import AnimatedButton from '../components/AnimatedButton';
import AnimatedInput from '../components/AnimatedInput';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const navigate = useNavigate();
  const { theme, isMobile } = useTheme();
  
  // Environment variables
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
    
    // Clear general error
    if (generalError) {
      setGeneralError('');
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Nama wajib diisi';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Nama minimal 2 karakter';
    }
    
    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    
    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password wajib diisi';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }
    
    // Validate confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password wajib diisi';
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Password tidak cocok';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setGeneralError('');
    
    try {
      const response = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      
      console.log('Register response:', response);
      
      // Registrasi berhasil
      setIsRegistered(true);
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.response && error.response.data && error.response.data.message) {
        if (error.response.data.message.includes('email')) {
          setErrors((prev) => ({
            ...prev,
            email: 'Email sudah terdaftar',
          }));
        } else {
          setGeneralError(error.response.data.message);
        }
      } else {
        setGeneralError('Terjadi kesalahan saat pendaftaran. Silakan coba lagi.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Jika berhasil registrasi, tampilkan pesan sukses
  if (isRegistered) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-20 pt-36"
           style={{ 
             background: newTheme.gradients.purple
           }}>
        {/* Animated background particles */}
        <ParticlesBackground 
          color="rgba(139, 92, 246, 0.6)"
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
          <div className="h-40 mb-6 mx-auto">
            <LottieAnimation 
              animationData={lottieConfig.animations.success}
              loop={false}
            />
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-center mb-2" style={{ color: newTheme.text.primary }}>
              Pendaftaran Berhasil!
            </h2>
            <p className="text-center mb-8" style={{ color: newTheme.text.secondary }}>
              Silakan periksa email Anda untuk verifikasi akun.
            </p>
          </motion.div>
          
          <div className="space-y-4">
            <AnimatedButton
              variant="primary"
              fullWidth
              onClick={() => navigate('/login')}
            >
              <ArrowRightIcon className="w-5 h-5 mr-2" />
              Lanjut ke Login
            </AnimatedButton>
            
            <AnimatedButton
              variant="outline"
              fullWidth
              onClick={() => navigate('/')}
            >
              <HomeIcon className="w-5 h-5 mr-2" />
              Kembali ke Beranda
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
        style={{ background: newTheme.gradients.purple }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <ParticlesBackground 
          color="rgba(139, 92, 246, 0.6)"
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
              Mulai Perjalanan Anda
            </h1>
            <p className="text-lg opacity-90" style={{ color: newTheme.text.light }}>
              Buat akun untuk mengakses layanan RetinaScan
            </p>
          </motion.div>
          
          <motion.div 
            className="w-full h-64 md:h-80 mx-auto"
            initial={enhancedAnimations.scaleIn.hidden}
            animate={enhancedAnimations.scaleIn.visible(0.4)}
          >
            <LottieAnimation 
              animationData={lottieConfig.animations.register}
              loop={true}
            />
          </motion.div>
          
          <motion.div 
            className="mt-8 text-center"
            initial={enhancedAnimations.fadeInUp.hidden}
            animate={enhancedAnimations.fadeInUp.visible(0.6)}
          >
            <p className="text-white text-opacity-90">
              Sudah memiliki akun?
            </p>
            <Link 
              to="/login" 
              className="inline-block mt-2 text-white font-medium underline hover:text-purple-200 transition-colors"
            >
              Login Sekarang
            </Link>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Right Column - Register Form */}
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
              Daftar
            </h2>
            <p style={{ color: newTheme.text.secondary }}>
              Buat akun baru untuk menggunakan RetinaScan
            </p>
          </motion.div>
          
          {generalError && (
            <motion.div 
              className="mb-6 p-4 rounded-lg"
              style={{ 
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderLeft: `4px solid ${newTheme.danger}` 
              }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p style={{ color: newTheme.danger }}>{generalError}</p>
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
                type="text"
                name="name"
                id="name"
                label="Nama Lengkap"
                value={formData.name}
                onChange={handleChange}
                required
                error={errors.name}
              />
            </motion.div>
            
            <motion.div variants={enhancedAnimations.item}>
              <AnimatedInput
                type="email"
                name="email"
                id="email"
                label="Email"
                value={formData.email}
                onChange={handleChange}
                required
                error={errors.email}
              />
            </motion.div>
            
            <motion.div variants={enhancedAnimations.item}>
              <AnimatedInput
                type="password"
                name="password"
                id="password"
                label="Password"
                value={formData.password}
                onChange={handleChange}
                required
                error={errors.password}
              />
            </motion.div>
            
            <motion.div variants={enhancedAnimations.item}>
              <AnimatedInput
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                label="Konfirmasi Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                error={errors.confirmPassword}
              />
            </motion.div>
            
            <motion.div variants={enhancedAnimations.item}>
              <AnimatedButton
                type="submit"
                variant="accent"
                fullWidth
                disabled={isLoading}
              >
                {isLoading ? 'Memproses...' : (
                  <>
                    Daftar
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

export default withPageTransition(RegisterPage);