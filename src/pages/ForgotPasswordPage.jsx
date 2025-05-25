import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { forgotPassword as requestPasswordReset } from '../services/authService';
import { withPageTransition } from '../context/ThemeContext';
import { 
  HomeIcon, 
  ArrowRightIcon, 
  EnvelopeIcon, 
  ExclamationCircleIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import AnimatedInput from '../components/AnimatedInput';
import VantaBackground from '../components/VantaBackground';
import { TextAnimate } from '../components/TextAnimate';
import { AuroraText } from '../components/AuroraText';
import { FlipText } from '../components/FlipText';
import { SparklesText } from '../components/SparklesText';
import AnimatedButton from '../components/AnimatedButton';
import ParticlesBackground from '../components/ParticlesBackground';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const formRef = useRef(null);
  
  // Environment variables
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Validasi email sederhana
  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi form
    if (!email.trim()) {
      setError('Email tidak boleh kosong');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Format email tidak valid');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setSuccess(false);
    setSuccessMessage('');
    
    try {
      const response = await requestPasswordReset(email);
      
      if (response && response.success) {
        setSuccess(true);
        setSuccessMessage('Link reset password telah dikirim ke email Anda. Silakan periksa kotak masuk atau folder spam Anda.');
      } else {
        throw new Error(response?.message || 'Terjadi kesalahan saat mengirim permintaan reset password');
      }
    } catch (err) {
      console.error('Password reset request error:', err);
      setError(err.response?.data?.message || err.message || 'Terjadi kesalahan saat mengirim permintaan reset password');
    } finally {
      setIsLoading(false);
    }
  };

  // Framer Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    },
    exit: { 
      opacity: 0,
      transition: { 
        when: "afterChildren",
        staggerChildren: 0.1,
        staggerDirection: -1 
      } 
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.3 }
    }
  };

  const formVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden py-10">
      {/* Animated Background with Particles */}
      <ParticlesBackground 
        options={{
          particles: {
            number: {
              value: 70,
              density: {
                enable: true,
                value_area: 900
              }
            },
            color: {
              value: "#4f46e5"
            },
            opacity: {
              value: 0.4,
              random: true
            },
            size: {
              value: 3,
              random: true
            },
            line_linked: {
              enable: true,
              distance: 150,
              color: "#c4b5fd",
              opacity: 0.2,
              width: 1
            },
            move: {
              enable: true,
              speed: 1
            }
          },
          interactivity: {
            events: {
              onhover: {
                enable: true,
                mode: "repulse"
              }
            }
          }
        }}
      />
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="w-full max-w-md relative z-10"
      >
        {/* Logo & Title */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <motion.div
            className="mx-auto"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, rotate: [0, 10, 0] }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2
            }}
          >
            <div className="h-20 w-20 bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl shadow-lg p-4 mx-auto mb-4 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600/80 to-purple-600/80 animate-pulse"></div>
              <EyeIcon className="h-12 w-12 text-white relative z-10" />
            </div>
          </motion.div>
          
          <motion.h1 
            className="text-4xl font-bold mb-2 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <AuroraText
              colors={["#a78bfa", "#8b5cf6", "#7c3aed", "#6d28d9"]}
            >
              Lupa Password
            </AuroraText>
          </motion.h1>
          
          <motion.p 
            className="text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <TextAnimate by="word" animation="fadeIn" delay={0.5}>
              Masukkan email Anda untuk reset password
            </TextAnimate>
          </motion.p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          variants={formVariants}
          className="glass-card bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl"
          style={{
            boxShadow: "0 10px 40px -10px rgba(0, 0, 0, 0.5), 0 0 80px -10px rgba(109, 40, 217, 0.3)"
          }}
        >
          {/* Success Message */}
          <AnimatePresence>
            {success && (
              <motion.div 
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="bg-green-500/10 border border-green-500/30 text-green-600 rounded-lg p-3 mb-6 flex items-center"
              >
                <CheckCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                <p>{successMessage}</p>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="bg-red-500/10 border border-red-500/30 text-red-600 rounded-lg p-3 mb-6 flex items-center"
              >
                <ExclamationCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                <p>{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form 
            ref={formRef}
            onSubmit={handleSubmit} 
            className="space-y-5"
          >
            <AnimatedInput
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="Email"
              required
              placeholder="Masukkan email anda"
              icon={<EnvelopeIcon className="h-5 w-5" />}
              error={error && error.includes('email')}
            />

            <div className="mt-2">
              <AnimatedButton
                type="submit"
                disabled={isLoading}
                isLoading={isLoading}
                loadingText="Memproses..."
                primary={true}
                gradientFrom="from-violet-600"
                gradientTo="to-purple-600"
                className="w-full py-2.5"
                icon={<ArrowRightIcon className="h-5 w-5 ml-1" />}
              >
                Kirim Link Reset
              </AnimatedButton>
            </div>
          </form>
          
          <motion.div 
            variants={itemVariants}
            className="mt-6 flex justify-center"
          >
            <Link 
              to="/login"
              className="inline-flex items-center text-violet-400 hover:text-violet-300 font-medium transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              <SparklesText minSize={4} maxSize={8} sparklesCount={3} className="text-violet-400">
                Kembali ke Login
              </SparklesText>
            </Link>
          </motion.div>
        </motion.div>
        
        <motion.div 
          variants={itemVariants} 
          className="mt-8 text-center"
        >
          <Link 
            to="/" 
            className="inline-flex items-center text-sm text-gray-400 hover:text-violet-400 transition-colors"
          >
            <HomeIcon className="h-4 w-4 mr-1" />
            Kembali ke Beranda
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default withPageTransition(ForgotPasswordPage);