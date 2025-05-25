import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { register } from '../services/authService';
import { withPageTransition } from '../context/ThemeContext';
import { 
  HomeIcon, 
  ArrowRightIcon, 
  EnvelopeIcon, 
  LockClosedIcon,
  ExclamationCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  UserIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import AnimatedInput from '../components/AnimatedInput';
import VantaBackground from '../components/VantaBackground';
import { TextAnimate } from '../components/TextAnimate';
import { AuroraText } from '../components/AuroraText';
import { FlipText } from '../components/FlipText';
import { SparklesText } from '../components/SparklesText';
import AnimatedButton from '../components/AnimatedButton';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const formRef = useRef(null);
  
  const navigate = useNavigate();
  
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

  // Validasi form
  const validateForm = () => {
    if (!name.trim()) {
      setError('Nama tidak boleh kosong');
      return false;
    }
    
    if (!email.trim()) {
      setError('Email tidak boleh kosong');
      return false;
    }
    
    if (!validateEmail(email)) {
      setError('Format email tidak valid');
      return false;
    }
    
    if (!password) {
      setError('Password tidak boleh kosong');
      return false;
    }
    
    if (password.length < 6) {
      setError('Password minimal 6 karakter');
      return false;
    }
    
    if (password !== confirmPassword) {
      setError('Konfirmasi password tidak sesuai');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setError('');
    setSuccess(false);
    setSuccessMessage('');
    
    try {
      const response = await register({ name, email, password });
      
      if (response && response.success) {
        setSuccess(true);
        setSuccessMessage('Registrasi berhasil! Silahkan login dengan akun baru Anda.');
        
        // Reset form
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        
        // Redirect ke login setelah 3 detik
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        throw new Error(response?.message || 'Terjadi kesalahan saat mendaftar');
      }
    } catch (err) {
      console.error('Register error:', err);
      setError(err.response?.data?.message || err.message || 'Terjadi kesalahan saat mendaftar');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden py-10">
      {/* VantaJS Background */}
      <div className="absolute inset-0 z-0">
        <VantaBackground options={{
          color: 0x3b82f6, // blue-500
          color2: 0x818cf8, // indigo-400
          backgroundColor: 0x030712, // gray-950
          spacing: 25.00,
          size: 1.50,
          showLines: false
        }} />
      </div>
      
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
            <div className="h-20 w-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg p-4 mx-auto mb-4 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/80 to-purple-600/80 animate-pulse"></div>
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
              colors={["#818cf8", "#c084fc", "#a78bfa", "#e879f9"]}
            >
              Buat Akun Baru
            </AuroraText>
          </motion.h1>
          
          <motion.p 
            className="text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <TextAnimate by="word" animation="fadeIn" delay={0.5}>
              Daftar untuk menggunakan RetinaScan
            </TextAnimate>
          </motion.p>
        </motion.div>
        
        {/* Registration Form */}
        <motion.div
          variants={itemVariants}
          className="glass-card bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl"
          style={{
            boxShadow: "0 10px 40px -10px rgba(0, 0, 0, 0.5), 0 0 80px -10px rgba(129, 140, 248, 0.3)"
          }}
        >
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

          {/* Registration Form */}
          <form 
            ref={formRef}
            onSubmit={handleSubmit} 
            className="space-y-5"
          >
            <AnimatedInput
              id="name"
              name="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              label="Nama Lengkap"
              required
              placeholder="Masukkan nama lengkap anda"
              icon={<UserIcon className="h-5 w-5" />}
              error={error && error.includes('Nama')}
            />

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

            <AnimatedInput
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="Password"
              required
              placeholder="Masukkan password anda"
              icon={<LockClosedIcon className="h-5 w-5" />}
              endIcon={
                <button 
                  type="button" 
                  onClick={togglePasswordVisibility}
                  className="focus:outline-none"
                >
                  {showPassword ? 
                    <EyeSlashIcon className="h-5 w-5" /> : 
                    <EyeIcon className="h-5 w-5" />
                  }
                </button>
              }
              error={error && (error.includes('Password') || error.includes('password'))}
            />

            <AnimatedInput
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              label="Konfirmasi Password"
              required
              placeholder="Konfirmasi password anda"
              icon={<LockClosedIcon className="h-5 w-5" />}
              endIcon={
                <button 
                  type="button" 
                  onClick={toggleConfirmPasswordVisibility}
                  className="focus:outline-none"
                >
                  {showConfirmPassword ? 
                    <EyeSlashIcon className="h-5 w-5" /> : 
                    <EyeIcon className="h-5 w-5" />
                  }
                </button>
              }
              error={error && error.includes('Konfirmasi password')}
            />

            <div className="mt-2">
              <AnimatedButton
                type="submit"
                disabled={isLoading}
                isLoading={isLoading}
                loadingText="Memproses..."
                primary={true}
                gradientFrom="from-indigo-600"
                gradientTo="to-purple-600"
                className="w-full py-2.5"
                icon={<ArrowRightIcon className="h-5 w-5 ml-1" />}
              >
                Daftar
              </AnimatedButton>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Sudah memiliki akun?{' '}
              <Link
                to="/login"
                className="font-medium text-indigo-500 hover:text-indigo-400 transition-colors"
              >
                <SparklesText minSize={5} maxSize={10} sparklesCount={5} className="text-indigo-400">
                  Login
                </SparklesText>
              </Link>
            </p>
          </div>
        </motion.div>
        
        <motion.div 
          variants={itemVariants} 
          className="mt-8 text-center"
        >
          <Link 
            to="/" 
            className="inline-flex items-center text-sm text-gray-400 hover:text-indigo-500 transition-colors"
          >
            <HomeIcon className="h-4 w-4 mr-1" />
            Kembali ke Beranda
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default withPageTransition(RegisterPage);