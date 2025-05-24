import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import axios from 'axios';
import { register } from '../services/authService';
import { useTheme, withPageTransition } from '../context/ThemeContext';
import { 
  HomeIcon, 
  ArrowRightIcon, 
  UserIcon, 
  EnvelopeIcon, 
  LockClosedIcon,
  ExclamationCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { newTheme, enhancedAnimations, lottieConfig } from '../utils/newTheme';
import LottieAnimation from '../components/LottieAnimation';
import ParticlesBackground from '../components/ParticlesBackground';
import AnimatedButton from '../components/AnimatedButton';
import AnimatedInput from '../components/AnimatedInput';
import ScrollReveal from '../components/ScrollReveal';

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formFocused, setFormFocused] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState('');
  
  const formRef = useRef(null);
  const navigate = useNavigate();
  const { theme, isMobile } = useTheme();
  const controls = useAnimation();
  
  // Intersection Observer untuk animasi scroll
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  
  // Environment variables
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Effect untuk animasi saat inView
  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  // Effect untuk animasi saat error
  useEffect(() => {
    if (generalError) {
      controls.start({
        x: [0, -10, 10, -10, 0],
        transition: { duration: 0.5 }
      });
    }
  }, [generalError, controls]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Evaluasi kekuatan password jika field yang diubah adalah password
    if (name === 'password') {
      evaluatePasswordStrength(value);
    }
    
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

  // Fungsi untuk mengevaluasi kekuatan password
  const evaluatePasswordStrength = (password) => {
    // Reset feedback
    let strength = 0;
    let feedback = '';

    // Jika kosong, tidak perlu evaluasi
    if (!password) {
      setPasswordStrength(0);
      setPasswordFeedback('');
      return;
    }

    // Cek panjang
    if (password.length >= 8) {
      strength += 1;
    } else {
      feedback = 'Password terlalu pendek';
    }

    // Cek kombinasi huruf kecil dan besar
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
      strength += 1;
    } else if (!feedback) {
      feedback = 'Tambahkan kombinasi huruf besar dan kecil';
    }

    // Cek angka
    if (/\d/.test(password)) {
      strength += 1;
    } else if (!feedback) {
      feedback = 'Tambahkan angka';
    }

    // Cek karakter khusus
    if (/[^A-Za-z0-9]/.test(password)) {
      strength += 1;
    } else if (!feedback) {
      feedback = 'Tambahkan karakter khusus';
    }

    // Set feedback berdasarkan kekuatan
    if (strength === 4 && !feedback) {
      feedback = 'Password sangat kuat!';
    } else if (strength === 3 && !feedback) {
      feedback = 'Password cukup kuat';
    } else if (strength === 2 && !feedback) {
      feedback = 'Password sedang';
    } else if (strength === 1 && !feedback) {
      feedback = 'Password lemah';
    }

    setPasswordStrength(strength);
    setPasswordFeedback(feedback);
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

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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

  // Warna untuk indikator kekuatan password
  const getStrengthColor = (strength) => {
    switch (strength) {
      case 1: return newTheme.danger;
      case 2: return newTheme.warning;
      case 3: return newTheme.info;
      case 4: return newTheme.success;
      default: return '#E5E7EB';
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Animasi error
      controls.start({
        x: [0, -10, 10, -10, 0],
        transition: { duration: 0.5 }
      });
      return;
    }

    setIsLoading(true);
    setGeneralError('');
    
    try {
      // Animasi loading
      controls.start({
        scale: [1, 0.98, 1],
        transition: { duration: 0.5, repeat: Infinity }
      });
      
      const response = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      
      console.log('Register response:', response);
      
      // Animasi sukses
      controls.start({
        scale: [1, 1.05, 1],
        transition: { duration: 0.5 }
      });
      
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
      
      // Animasi error
      controls.start({
        x: [0, -10, 10, -10, 0],
        transition: { duration: 0.5 }
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Jika berhasil registrasi, tampilkan pesan sukses
  if (isRegistered) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-20 pt-36 bg-gradient-to-br from-violet-500/20 to-purple-600/20 dark:from-gray-900 dark:to-purple-900">
        {/* Animated background particles */}
        <ParticlesBackground 
          color="rgba(139, 92, 246, 0.6)"
          count={60}
          speed={0.8}
          type="pulse"
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
              Pendaftaran Berhasil!
            </h2>
            <p className="text-center mb-8" style={{ color: newTheme.text.secondary }}>
              Silakan periksa email Anda untuk verifikasi akun.
            </p>
          </motion.div>
          
          <div className="space-y-4">
            <AnimatedButton
              variant="accent"
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
          count={isMobile ? 30 : 50}
          speed={0.6}
          type="pulse"
          connected={true}
          interactive={true}
        />
        
        <div className="relative z-10 max-w-md w-full">
          <ScrollReveal animation="fade-down" delay={0.2}>
            <div className="mb-8 text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: newTheme.text.light }}>
                Mulai Perjalanan Anda
              </h1>
              <p className="text-lg opacity-90" style={{ color: newTheme.text.light }}>
                Buat akun untuk mengakses layanan RetinaScan
              </p>
            </div>
          </ScrollReveal>
          
          <ScrollReveal animation="zoom-in" delay={0.4}>
            <div className="w-full h-64 md:h-80 mx-auto">
              <LottieAnimation 
                animationData={lottieConfig.animations.register}
                loop={true}
              />
            </div>
          </ScrollReveal>
          
          <ScrollReveal animation="fade-up" delay={0.6}>
            <div className="mt-8 text-center">
              <p className="text-white text-opacity-90">
                Sudah memiliki akun?
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  to="/login" 
                  className="inline-block mt-2 px-6 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white font-medium hover:bg-white/30 transition-all"
                >
                  Login Sekarang
                </Link>
              </motion.div>
            </div>
          </ScrollReveal>
        </div>
      </motion.div>
      
      {/* Right Column - Register Form */}
      <motion.div
        className="md:w-1/2 flex items-center justify-center p-6 md:p-12"
        style={{ background: newTheme.background.light }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        ref={ref}
      >
        <div className="w-full max-w-md">
          <ScrollReveal animation="fade-down" delay={0.3}>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2" style={{ color: newTheme.text.primary }}>
                Daftar
              </h2>
              <p style={{ color: newTheme.text.secondary }}>
                Buat akun baru untuk menggunakan RetinaScan
              </p>
            </div>
          </ScrollReveal>
          
          <AnimatePresence>
            {generalError && (
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
                <p style={{ color: newTheme.danger }}>{generalError}</p>
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
              variants={enhancedAnimations.container}
              initial="hidden"
              animate={controls}
              onFocus={handleFormFocus}
              onBlur={handleFormBlur}
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
                  icon={<UserIcon className="w-5 h-5" />}
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
                  icon={<EnvelopeIcon className="w-5 h-5" />}
            />
          </motion.div>
              
              <motion.div variants={enhancedAnimations.item}>
                <AnimatedInput
                  type={showPassword ? "text" : "password"}
                  name="password"
                id="password"
                  label="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  error={errors.password}
                  icon={<LockClosedIcon className="w-5 h-5" />}
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
                
                {/* Password strength indicator */}
                {formData.password && (
                  <motion.div 
                    className="mt-2"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4].map((level) => (
                        <motion.div
                          key={level}
                          className="h-1 flex-1 rounded-full"
                          style={{ 
                            backgroundColor: level <= passwordStrength 
                              ? getStrengthColor(passwordStrength) 
                              : '#E5E7EB' 
                          }}
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 0.3, delay: level * 0.1 }}
                        />
                      ))}
                    </div>
                    <p 
                      className="text-xs"
                      style={{ 
                        color: passwordStrength > 0 
                          ? getStrengthColor(passwordStrength) 
                          : newTheme.text.muted 
                      }}
                    >
                      {passwordFeedback || 'Masukkan password'}
                    </p>
                  </motion.div>
                )}
              </motion.div>
              
              <motion.div variants={enhancedAnimations.item}>
                <AnimatedInput
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  id="confirmPassword"
                  label="Konfirmasi Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  error={errors.confirmPassword}
                  icon={<LockClosedIcon className="w-5 h-5" />}
                  rightIcon={
                    <motion.button
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      className="focus:outline-none"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {showConfirmPassword ? (
                        <EyeSlashIcon className="w-5 h-5 text-gray-500" />
                      ) : (
                        <EyeIcon className="w-5 h-5 text-gray-500" />
                      )}
                    </motion.button>
                  }
                />
                
                {/* Password match indicator */}
                {formData.password && formData.confirmPassword && (
                  <motion.div 
                    className="mt-2 flex items-center"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                  >
                    {formData.password === formData.confirmPassword ? (
                      <>
                        <CheckCircleIcon className="w-4 h-4 mr-1" style={{ color: newTheme.success }} />
                        <p className="text-xs" style={{ color: newTheme.success }}>
                          Password cocok
                        </p>
                      </>
                    ) : (
                      <>
                        <ExclamationCircleIcon className="w-4 h-4 mr-1" style={{ color: newTheme.danger }} />
                        <p className="text-xs" style={{ color: newTheme.danger }}>
                          Password tidak cocok
                        </p>
                      </>
                    )}
                  </motion.div>
            )}
          </motion.div>
              
              <motion.div variants={enhancedAnimations.item}>
                <AnimatedButton
              type="submit"
                  variant="accent"
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

export default withPageTransition(RegisterPage);