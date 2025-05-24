import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { withPageTransition } from '../context/ThemeContext';
import WavesBackground from '../components/WavesBackground';
import AnimatedButton from '../components/AnimatedButton';
import AnimatedInput from '../components/AnimatedInput';
import { HomeIcon, ArrowLeftIcon, ShieldCheckIcon, ExclamationCircleIcon, LockClosedIcon, EyeIcon } from '@heroicons/react/24/outline';
import { sendResetPasswordEmail } from '../utils/emailService';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [token, setToken] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [animationState, setAnimationState] = useState('initial');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState('');

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

  useEffect(() => {
    // Extract token from URL query parameters
    const queryParams = new URLSearchParams(location.search);
    const tokenFromUrl = queryParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setResetError('Token reset password tidak ditemukan. Silakan meminta link reset password baru.');
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Evaluasi kekuatan password jika field yang diubah adalah password
    if (name === 'password') {
      evaluatePasswordStrength(value);
    }
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
    // Clear reset error when user types
    if (resetError) {
      setResetError('');
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

  const validateForm = () => {
    const newErrors = {};
    if (!formData.password) {
      newErrors.password = 'Password baru tidak boleh kosong';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password tidak boleh kosong';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Password tidak cocok';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!token) {
      setResetError('Token reset password tidak ditemukan. Silakan meminta link reset password baru.');
      return;
    }
    
    setIsLoading(true);
    setResetError('');
    setAnimationState('sending');
    
    try {
      // Simulasi reset password berhasil (dalam implementasi nyata, ini akan memanggil API)
      // Tunggu 1.5 detik untuk simulasi proses
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setAnimationState('success');
      setTimeout(() => {
        setResetSuccess(true);
        // Redirect ke halaman login setelah 3 detik
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }, 1000);
    } catch (error) {
      console.error('Reset password error:', error);
      setResetError('Terjadi kesalahan saat reset password. Silakan coba lagi.');
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

  // Warna untuk indikator kekuatan password
  const getStrengthColor = (strength) => {
    const strengthColors = {
      danger: '#ef4444',   // red-500
      warning: '#f59e0b',  // amber-500
      info: '#3b82f6',     // blue-500
      success: '#10b981'   // emerald-500
    };
    
    switch (strength) {
      case 1: return strengthColors.danger;
      case 2: return strengthColors.warning;
      case 3: return strengthColors.info;
      case 4: return strengthColors.success;
      default: return '#E5E7EB';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 pt-36 relative overflow-hidden">
      {/* Background tidak perlu lagi karena sudah ada di App.jsx */}
      
      {/* Reset Password Form */}
      <div className="glass-effect w-full max-w-md p-8 rounded-2xl shadow-xl z-10">
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
          <h1 className="text-3xl font-bold mb-2">Reset Password</h1>
          <p className="opacity-70">Buat password baru untuk akun Anda</p>
        </div>

        {/* Success Message */}
        {resetSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-500/10 border border-green-500/30 text-green-600 rounded-lg p-3 mb-6 flex items-center"
          >
            <ShieldCheckIcon className="h-5 w-5 mr-2 flex-shrink-0" />
            <p>Password Anda telah berhasil diubah</p>
          </motion.div>
        )}
        
        {/* Error Message */}
        {resetError && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/30 text-red-600 rounded-lg p-3 mb-6 flex items-center"
          >
            <ExclamationCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
            <p>{resetError}</p>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <AnimatedInput
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            label="Password Baru"
            required
            placeholder="Masukkan password baru anda"
            icon={<LockClosedIcon className="h-5 w-5" />}
            error={errors.password}
          />

          {/* Password strength indicator */}
          {formData.password && (
            <div 
              className="mt-2"
            >
              <div className="flex gap-1 mb-1">
                {[1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className="h-1 flex-1 rounded-full"
                    style={{ 
                      backgroundColor: level <= passwordStrength 
                        ? getStrengthColor(passwordStrength) 
                        : '#E5E7EB' 
                    }}
                  />
                ))}
              </div>
              <p 
                className="text-xs"
              >
                {passwordFeedback || 'Masukkan password'}
              </p>
            </div>
          )}

          <AnimatedInput
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            label="Konfirmasi Password"
            required
            placeholder="Konfirmasi password baru anda"
            icon={<LockClosedIcon className="h-5 w-5" />}
            error={errors.confirmPassword}
          />

          <AnimatedButton
            type="submit"
            primary
            isLoading={isLoading}
            className="w-full mt-2"
          >
            {isLoading ? 'Memproses...' : 'Reset Password'}
          </AnimatedButton>
        </form>

        {/* Links */}
        <div className="mt-8 text-center space-y-4">
          <Link to="/login" className="text-blue-500 hover:text-blue-600 font-medium flex items-center justify-center">
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Kembali ke Login
          </Link>
          
          <Link 
            to="/" 
            className="inline-flex items-center text-sm hover:text-blue-500"
          >
            <HomeIcon className="h-4 w-4 mr-1" />
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
};

export default withPageTransition(ResetPasswordPage);