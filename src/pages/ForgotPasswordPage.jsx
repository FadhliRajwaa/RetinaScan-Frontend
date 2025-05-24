import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { withPageTransition, useTheme } from '../context/ThemeContext';
import { newTheme, enhancedAnimations, lottieConfig } from '../utils/newTheme';
import LottieAnimation from '../components/LottieAnimation';
import ParticlesBackground from '../components/ParticlesBackground';
import AnimatedButton from '../components/AnimatedButton';
import AnimatedInput from '../components/AnimatedInput';
import { HomeIcon, ArrowLeftIcon, EnvelopeIcon, ExclamationCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { sendResetPasswordEmail, generateResetToken, createResetPasswordLink } from '../utils/emailService';
import ScrollReveal from '../components/ScrollReveal';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [animationState, setAnimationState] = useState('initial');
  const [formFocused, setFormFocused] = useState(false);
  const formRef = useRef(null);
  
  const { theme, isMobile } = useTheme();
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  useEffect(() => {
    if (error) {
      controls.start({
        x: [0, -10, 10, -10, 0],
        transition: { duration: 0.5 }
      });
    }
  }, [error, controls]);

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  const validateEmail = () => {
    if (!email) {
      setError('Email tidak boleh kosong');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Format email tidak valid');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail()) return;

    setIsLoading(true);
    setError('');
    setAnimationState('sending');

    try {
      // Generate token untuk reset password
      const resetToken = generateResetToken();
      
      // Buat link reset password
      const resetLink = createResetPasswordLink(resetToken);
      
      // Kirim email reset password menggunakan EmailJS
      const result = await sendResetPasswordEmail({
        email,
        resetLink,
        resetToken
      });
      
      if (result.success) {
        setAnimationState('success');
        setTimeout(() => {
          setSuccess(result.message);
        }, 1000);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setError('Terjadi kesalahan saat mengirim email reset password. Silakan coba lagi.');
      setAnimationState('error');
    } finally {
      setIsLoading(false);
    }
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

  // Animasi untuk form
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };
  
  // Animasi untuk card
  const cardVariants = {
    initial: { 
      scale: 0.95, 
      opacity: 0,
      y: 20,
      boxShadow: '0px 0px 0px rgba(0,0,0,0.1)'
    },
    visible: { 
      scale: 1, 
      opacity: 1,
      y: 0,
      boxShadow: '0px 15px 35px rgba(0,0,0,0.1)',
      transition: { 
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };
  
  // Animasi untuk status
  const statusAnimations = {
    sending: {
      scale: [1, 0.9, 1.1, 0.9, 1],
      transition: { duration: 0.5 }
    },
    success: {
      scale: [1, 1.2, 1],
      transition: { duration: 0.5 }
    },
    error: {
      x: [0, -10, 10, -10, 0],
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center w-full relative overflow-hidden">
      {/* Background animasi partikel yang ditingkatkan */}
      <ParticlesBackground 
        color={theme === 'dark' ? 'rgba(139, 92, 246, 0.5)' : 'rgba(79, 70, 229, 0.5)'} 
        count={isMobile ? 40 : 80}
        speed={0.8}
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
              Lupa Password
            </motion.p>
          </div>
          
          {/* Form forgot password dengan efek glass yang ditingkatkan */}
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
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Reset Password</h2>
              <Link 
                to="/" 
                className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-200 flex items-center gap-1 text-sm"
              >
                <HomeIcon className="w-4 h-4" />
                <span>Beranda</span>
              </Link>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
              Masukkan email yang terdaftar. Kami akan mengirimkan instruksi untuk reset password.
            </p>
            
            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="bg-red-100 dark:bg-red-900/40 border border-red-200 dark:border-red-800/50 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg mb-6 flex items-start"
                >
                  <ExclamationCircleIcon className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Success message */}
            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="bg-green-100 dark:bg-green-900/40 border border-green-200 dark:border-green-800/50 text-green-800 dark:text-green-200 px-4 py-3 rounded-lg mb-6 flex items-start"
                >
                  <CheckCircleIcon className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{success}</span>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Form */}
            <form onSubmit={handleSubmit} ref={formRef} onFocus={handleFormFocus} onBlur={handleFormBlur}>
              <div className="space-y-5">
                {/* Email field */}
                <motion.div variants={enhancedAnimations.item}>
                  <AnimatedInput
                    id="email"
                    type="email"
                    label="Email"
                    value={email}
                    onChange={handleChange}
                    icon={<EnvelopeIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />}
                    placeholder="nama@email.com"
                    autoComplete="email"
                    required
                  />
                </motion.div>
                
                {/* Submit button */}
                <motion.div variants={enhancedAnimations.item} className="mt-6">
                  <AnimatedButton
                    type="submit"
                    fullWidth
                    isLoading={isLoading}
                    disabled={isLoading || success !== ''}
                    animate={controls}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  >
                    <span className="mr-2">Kirim Instruksi Reset</span>
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
                <Link
                  to="/login"
                  className="font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <ArrowLeftIcon className="w-4 h-4" />
                  <span>Kembali ke halaman login</span>
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

export default withPageTransition(ForgotPasswordPage);