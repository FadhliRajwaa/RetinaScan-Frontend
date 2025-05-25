import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { register } from '../services/authService';
import { withPageTransition } from '../context/ThemeContext';
import { useTheme } from '../context/ThemeContext';
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
import AnimatedCard from '../components/AnimatedCard';
import ShimmerButton from '../components/ShimmerButton';

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
  const { theme } = useTheme();
  
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

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4 relative overflow-hidden">      
      <AnimatedCard
        className={`w-full max-w-md p-8 shadow-xl backdrop-blur-sm 
        ${theme === 'dark' 
          ? 'bg-gray-900/60 border border-gray-800/50' 
          : 'bg-white/80 border border-gray-200/50'}`}
      >
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mx-auto"
          >
            <div className="h-16 w-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg p-3 mx-auto mb-2">
              <EyeIcon className="h-full w-full text-white" />
            </div>
          </motion.div>
          <motion.h1 
            className="text-3xl font-bold mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Daftar Akun
          </motion.h1>
          <motion.p 
            className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Buat akun untuk menggunakan RetinaScan
          </motion.p>
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
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
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-green-500/10 border border-green-500/30 text-green-600 rounded-lg p-3 mb-6 flex items-center"
            >
              <CheckCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
              <p>{successMessage}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Registration Form */}
        <motion.form 
          onSubmit={handleSubmit} 
          className="space-y-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
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

          <ShimmerButton
            type="submit"
            disabled={isLoading}
            fullWidth={true}
            className="mt-6"
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
              <div className="flex items-center justify-center">
                <span>Daftar Sekarang</span>
                <ArrowRightIcon className="h-5 w-5 ml-1" />
              </div>
            )}
          </ShimmerButton>
        </motion.form>

        {/* Login link */}
        <motion.div 
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
            Sudah punya akun?{' '}
            <Link to="/login" className="text-blue-500 hover:text-blue-600 font-medium transition-colors">
              Login Sekarang
            </Link>
          </p>
          
          <Link 
            to="/" 
            className={`inline-flex items-center mt-4 text-sm transition-colors ${
              theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <HomeIcon className="h-4 w-4 mr-1" />
            Kembali ke Beranda
          </Link>
        </motion.div>
      </AnimatedCard>
    </div>
  );
};

export default withPageTransition(RegisterPage);