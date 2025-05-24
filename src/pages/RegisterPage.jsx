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
    <div className="min-h-screen flex flex-col items-center justify-center w-full relative overflow-hidden">
      {/* Background animasi partikel yang ditingkatkan */}
      <ParticlesBackground 
        color={theme === 'dark' ? 'rgba(139, 92, 246, 0.5)' : 'rgba(79, 70, 229, 0.5)'} 
        count={isMobile ? 40 : 80}
        speed={0.8}
        type="magnetic"
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
              Buat akun baru
            </motion.p>
          </div>
          
          {/* Form register dengan efek glass yang ditingkatkan */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={enhancedAnimations.container}
            className={`bg-white/20 dark:bg-gray-900/30 backdrop-blur-lg rounded-2xl shadow-xl p-6 md:p-8 border border-white/20 dark:border-gray-700/30 transition-all duration-300 ${formFocused ? 'shadow-2xl scale-[1.01]' : ''}`}
            style={{
              boxShadow: formFocused 
                ? '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 15px rgba(79, 70, 229, 0.2)' 
                : '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
            }}
          >
            {/* Form header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Daftar</h2>
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
              {generalError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="bg-red-100 dark:bg-red-900/40 border border-red-200 dark:border-red-800/50 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg mb-6 flex items-start"
                >
                  <ExclamationCircleIcon className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{generalError}</span>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Form */}
            <form onSubmit={handleSubmit} ref={formRef} onFocus={handleFormFocus} onBlur={handleFormBlur}>
              <div className="space-y-5">
                {/* Name field */}
                <motion.div variants={enhancedAnimations.item}>
                  <AnimatedInput
                    id="name"
                    type="text"
                    label="Nama Lengkap"
                    value={formData.name}
                    onChange={handleChange}
                    icon={<UserIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />}
                    placeholder="Masukkan nama lengkap"
                    autoComplete="name"
                    required
                  />
                </motion.div>
                
                {/* Email field */}
                <motion.div variants={enhancedAnimations.item}>
                  <AnimatedInput
                    id="email"
                    type="email"
                    label="Email"
                    value={formData.email}
                    onChange={handleChange}
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
                    value={formData.password}
                    onChange={handleChange}
                    icon={<LockClosedIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />}
                    placeholder="Minimal 8 karakter"
                    autoComplete="new-password"
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
                
                {/* Confirm Password field */}
                <motion.div variants={enhancedAnimations.item}>
                  <AnimatedInput
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    label="Konfirmasi Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    icon={<LockClosedIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />}
                    placeholder="Ulangi password"
                    autoComplete="new-password"
                    required
                    endAdornment={
                      <button
                        type="button"
                        onClick={toggleConfirmPasswordVisibility}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
                      >
                        {showConfirmPassword ? (
                          <EyeSlashIcon className="w-5 h-5" />
                        ) : (
                          <EyeIcon className="w-5 h-5" />
                        )}
                      </button>
                    }
                  />
                </motion.div>
                
                {/* Password strength indicator */}
                {formData.password && (
                  <motion.div 
                    variants={enhancedAnimations.item}
                    className="mt-2"
                  >
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Kekuatan password:</div>
                    <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div 
                        className={`h-full ${
                          formData.password.length < 6 ? 'bg-red-500' : 
                          formData.password.length < 8 ? 'bg-yellow-500' : 
                          evaluatePasswordStrength(formData.password) ? 'bg-green-500' : 'bg-yellow-500'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ 
                          width: formData.password.length < 6 ? '30%' : 
                                 formData.password.length < 8 ? '60%' : 
                                 evaluatePasswordStrength(formData.password) ? '100%' : '75%' 
                        }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span className={`${formData.password.length >= 8 ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                        8+ karakter
                      </span>
                      <span className={`${/[A-Za-z]/.test(formData.password) ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                        Huruf
                      </span>
                      <span className={`${/[0-9]/.test(formData.password) ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                        Angka
                      </span>
                    </div>
                  </motion.div>
                )}
                
                {/* Submit button */}
                <motion.div variants={enhancedAnimations.item} className="mt-6">
                  <AnimatedButton
                    type="submit"
                    fullWidth
                    isLoading={isLoading}
                    disabled={isLoading}
                    animate={controls}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  >
                    <span className="mr-2">Daftar</span>
                    <ArrowRightIcon className="w-5 h-5" />
                  </AnimatedButton>
                </motion.div>
              </div>
            </form>
            
            {/* Login link */}
            <motion.div 
              variants={enhancedAnimations.item}
              className="mt-6 text-center"
            >
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Sudah punya akun?{' '}
                <Link
                  to="/login"
                  className="font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-200"
                >
                  Masuk sekarang
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

export default withPageTransition(RegisterPage);