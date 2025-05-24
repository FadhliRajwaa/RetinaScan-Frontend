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
              Lupa Password
            </motion.p>
          </div>
          
          {/* Form lupa password */}
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
              {success ? (
                <div className="text-center">
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <CheckCircleIcon className="h-10 w-10 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Email Terkirim!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Instruksi untuk reset password telah dikirim ke email Anda. Silakan periksa kotak masuk Anda.
                  </p>
                  <Link to="/login">
                    <AnimatedButton className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all">
                      Kembali ke Login
                    </AnimatedButton>
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email
                    </label>
                    <AnimatedInput 
                      id="email"
                      type="email"
                      value={email}
                      onChange={handleChange}
                      placeholder="Masukkan email Anda"
                      icon={<EnvelopeIcon className="h-5 w-5 text-gray-400" />}
                      error={!!error}
                      className="w-full"
                    />
                  </div>
                  
                  {/* Error message */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center text-red-600 dark:text-red-400 text-sm"
                      >
                        <ExclamationCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                        <span>{error}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Masukkan alamat email yang terdaftar. Kami akan mengirimkan instruksi untuk reset password Anda.
                  </p>
                  
                  {/* Submit button */}
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
                        <span>Kirim Link Reset</span>
                      )}
                    </AnimatedButton>
                  </div>
                  
                  {/* Back to login */}
                  <div className="text-center mt-6">
                    <Link 
                      to="/login" 
                      className="inline-flex items-center text-sm text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
                    >
                      <ArrowLeftIcon className="h-4 w-4 mr-1" />
                      <span>Kembali ke Login</span>
                    </Link>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </ScrollReveal>
    </div>
  );
};

export default withPageTransition(ForgotPasswordPage);