import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { withPageTransition } from '../context/ThemeContext';
import { newTheme, enhancedAnimations, lottieConfig } from '../utils/newTheme';
import LottieAnimation from '../components/LottieAnimation';
import ParticlesBackground from '../components/ParticlesBackground';
import AnimatedButton from '../components/AnimatedButton';
import AnimatedInput from '../components/AnimatedInput';
import { HomeIcon, ArrowLeftIcon, EnvelopeIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { sendResetPasswordEmail, generateResetToken, createResetPasswordLink } from '../utils/emailService';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [animationState, setAnimationState] = useState('initial');
  
  // Animasi untuk elemen yang masuk ke viewport
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
          setSuccess(true);
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
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-900">
      {/* Background */}
      <ParticlesBackground 
        color="rgba(59, 130, 246, 0.3)"
        count={40}
        speed={0.5}
        type="wave"
      />
      
      <motion.div
        className="w-full max-w-md relative z-10"
        variants={cardVariants}
        initial="initial"
        animate="visible"
        ref={ref}
      >
        <div 
          className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl"
          style={{ 
            boxShadow: newTheme.shadows.xl,
            backdropFilter: 'blur(10px)',
            background: 'rgba(255, 255, 255, 0.9)'
          }}
        >
          {/* Header bar */}
          <div 
            className="h-2 w-full" 
            style={{ background: newTheme.gradients.cool }}
          ></div>
          
          <div className="p-8">
            {/* Logo and heading */}
            <div className="text-center mb-8">
              <motion.div 
                className="h-40 mb-6 mx-auto"
                animate={animationState !== 'initial' ? statusAnimations[animationState] : {}}
              >
                <LottieAnimation
                  animationData={
                    success ? lottieConfig.animations.success :
                    animationState === 'sending' ? lottieConfig.animations.loading :
                    lottieConfig.animations.forgotPassword
                  }
                  loop={!success}
                />
              </motion.div>
              
              <motion.h2
                className="text-3xl font-bold mb-2"
                style={{ color: newTheme.text.primary }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {success ? 'Email Terkirim!' : 'Lupa Password?'}
              </motion.h2>
              
              <motion.p
                className="text-base"
                style={{ color: newTheme.text.secondary }}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {success 
                  ? 'Silakan periksa email Anda untuk tautan reset password'
                  : 'Masukkan email Anda untuk menerima tautan reset password'}
              </motion.p>
            </div>
            
            {/* Error message */}
            {error && (
              <motion.div 
                className="mb-6 p-4 rounded-lg flex items-start"
                style={{ 
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  borderLeft: `4px solid ${newTheme.danger}` 
                }}
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                <ExclamationCircleIcon className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" style={{ color: newTheme.danger }} />
                <p style={{ color: newTheme.danger }}>{error}</p>
              </motion.div>
            )}
            
            {/* Success message */}
            {success ? (
              <motion.div
                className="text-center py-4"
                variants={formVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.p 
                  className="mb-6" 
                  style={{ color: newTheme.text.secondary }}
                  variants={formVariants}
                >
                  Kami telah mengirimkan tautan reset password ke email Anda. 
                  Jika tidak menemukannya, periksa folder spam atau coba lagi.
                </motion.p>
                
                <div className="space-y-4">
                  <motion.div variants={formVariants}>
                    <Link to="/login">
                      <AnimatedButton variant="primary" fullWidth>
                        Kembali ke Login
                      </AnimatedButton>
                    </Link>
                  </motion.div>
                  
                  <motion.div variants={formVariants}>
                    <Link to="/">
                      <AnimatedButton variant="outline" fullWidth>
                        <HomeIcon className="w-5 h-5 mr-2" />
                        Kembali ke Beranda
                      </AnimatedButton>
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              <motion.form 
                onSubmit={handleSubmit}
                className="space-y-6"
                variants={formVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={formVariants}>
                  <AnimatedInput
                    type="email"
                    name="email"
                    id="email"
                    label="Email"
                    value={email}
                    onChange={handleChange}
                    required
                    error={error ? ' ' : undefined}
                    icon={<EnvelopeIcon className="w-5 h-5" />}
                  />
                </motion.div>
                
                <motion.div variants={formVariants}>
                  <AnimatedButton
                    type="submit"
                    variant="info"
                    fullWidth
                    disabled={isLoading}
                  >
                    {isLoading ? 'Mengirim...' : 'Kirim Tautan Reset'}
                  </AnimatedButton>
                </motion.div>
                
                <motion.div 
                  className="text-center"
                  variants={formVariants}
                >
                  <Link 
                    to="/login" 
                    className="inline-flex items-center text-sm font-medium hover:underline"
                    style={{ color: newTheme.info }}
                  >
                    <ArrowLeftIcon className="w-4 h-4 mr-2" />
                    Kembali ke Login
                  </Link>
                </motion.div>
              </motion.form>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default withPageTransition(ForgotPasswordPage);