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
    <div className="min-h-screen flex flex-col items-center justify-center w-full relative overflow-hidden py-10">
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
                style={{ width: 100, height: 100 }}
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
              Buat akun baru
            </motion.p>
          </div>
          
          {/* Form register */}
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
                {/* Nama input */}
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nama Lengkap
                  </label>
                  <AnimatedInput 
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Masukkan nama lengkap Anda"
                    icon={<UserIcon className="h-5 w-5 text-gray-400" />}
                    error={!!errors.name}
                    className="w-full"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                  )}
                </div>
                
                {/* Email input */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email
                  </label>
                  <AnimatedInput 
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Masukkan email Anda"
                    icon={<EnvelopeIcon className="h-5 w-5 text-gray-400" />}
                    error={!!errors.email}
                    className="w-full"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                  )}
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
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Masukkan password Anda"
                      icon={<LockClosedIcon className="h-5 w-5 text-gray-400" />}
                      error={!!errors.password}
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
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
                  )}
                  
                  {/* Password strength indicator */}
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-600 dark:text-gray-400">Kekuatan Password</span>
                        <span className="text-xs" style={{ color: getStrengthColor(passwordStrength) }}>
                          {passwordStrength === 0 ? 'Sangat Lemah' : 
                           passwordStrength === 1 ? 'Lemah' : 
                           passwordStrength === 2 ? 'Sedang' : 
                           passwordStrength === 3 ? 'Kuat' : 'Sangat Kuat'}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-300"
                          style={{ 
                            width: `${passwordStrength * 25}%`,
                            backgroundColor: getStrengthColor(passwordStrength)
                          }}
                        ></div>
                      </div>
                      {passwordFeedback && (
                        <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">{passwordFeedback}</p>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Confirm Password input */}
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Konfirmasi Password
                  </label>
                  <div className="relative">
                    <AnimatedInput 
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Konfirmasi password Anda"
                      icon={<LockClosedIcon className="h-5 w-5 text-gray-400" />}
                      error={!!errors.confirmPassword}
                      className="w-full pr-10"
                    />
                    <button
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>
                  )}
                </div>
                
                {/* General error message */}
                <AnimatePresence>
                  {generalError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center text-red-600 dark:text-red-400 text-sm"
                    >
                      <ExclamationCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                      <span>{generalError}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Register button */}
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
                        Daftar
                        <ArrowRightIcon className="h-5 w-5 ml-2" />
                      </span>
                    )}
                  </AnimatedButton>
                </div>
              </form>
              
              {/* Login link */}
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Sudah memiliki akun?{' '}
                  <Link 
                    to="/login" 
                    className="font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                  >
                    Login sekarang
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
          
          {/* Registration Success Modal */}
          <AnimatePresence>
            {isRegistered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md mx-4 text-center"
                >
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <CheckCircleIcon className="h-10 w-10 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Registrasi Berhasil!</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Akun Anda telah berhasil dibuat. Silakan login untuk melanjutkan.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/login">
                      <AnimatedButton className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all">
                        Login Sekarang
                      </AnimatedButton>
                    </Link>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ScrollReveal>
    </div>
  );
};

export default withPageTransition(RegisterPage);