import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { withPageTransition } from '../context/ThemeContext';
import { newTheme, enhancedAnimations, lottieConfig } from '../utils/newTheme';
import LottieAnimation from '../components/LottieAnimation';
import ParticlesBackground from '../components/ParticlesBackground';
import AnimatedButton from '../components/AnimatedButton';
import AnimatedInput from '../components/AnimatedInput';
import { HomeIcon, ArrowLeftIcon, ShieldCheckIcon, ExclamationCircleIcon, LockClosedIcon } from '@heroicons/react/24/outline';
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
    switch (strength) {
      case 1: return newTheme.danger;
      case 2: return newTheme.warning;
      case 3: return newTheme.info;
      case 4: return newTheme.success;
      default: return '#E5E7EB';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-900 dark:to-amber-900">
      {/* Background */}
      <ParticlesBackground 
        color="rgba(245, 158, 11, 0.3)"
        count={40}
        speed={0.5}
        type="pulse"
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
            style={{ background: newTheme.gradients.sunset }}
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
                    resetSuccess ? lottieConfig.animations.success :
                    animationState === 'sending' ? lottieConfig.animations.loading :
                    lottieConfig.animations.resetPassword
                  }
                  loop={!resetSuccess}
                />
              </motion.div>
              
              <motion.h2
                className="text-3xl font-bold mb-2"
                style={{ color: newTheme.text.primary }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {resetSuccess ? 'Password Berhasil Diubah!' : 'Reset Password'}
              </motion.h2>
              
              <motion.p
                className="text-base"
                style={{ color: newTheme.text.secondary }}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {resetSuccess 
                  ? 'Password Anda telah berhasil diubah'
                  : 'Buat password baru untuk akun Anda'}
              </motion.p>
            </div>
            
            {/* Error message */}
            {resetError && (
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
                <p style={{ color: newTheme.danger }}>{resetError}</p>
              </motion.div>
            )}
            
            {/* Success message */}
            {resetSuccess ? (
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
                  Password Anda telah berhasil diubah. Anda akan dialihkan ke halaman login dalam beberapa detik.
                </motion.p>
                
                <div className="space-y-4">
                  <motion.div variants={formVariants}>
                    <Link to="/login">
                      <AnimatedButton variant="warning" fullWidth>
                        <ShieldCheckIcon className="w-5 h-5 mr-2" />
                        Login Sekarang
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
                    type="password"
                    name="password"
                    id="password"
                    label="Password Baru"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    error={errors.password}
                    icon={<LockClosedIcon className="w-5 h-5" />}
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
                
                <motion.div variants={formVariants}>
                  <AnimatedInput
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    label="Konfirmasi Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    error={errors.confirmPassword}
                    icon={<LockClosedIcon className="w-5 h-5" />}
                  />
          </motion.div>
                
                <motion.div variants={formVariants}>
                  <AnimatedButton
            type="submit"
                    variant="warning"
                    fullWidth
                    disabled={isLoading || !token || passwordStrength < 2}
                  >
                    {isLoading ? 'Memproses...' : 'Reset Password'}
                  </AnimatedButton>
                </motion.div>
                
                <motion.div 
                  className="text-center"
                  variants={formVariants}
                >
                  <Link 
                    to="/login" 
                    className="inline-flex items-center text-sm font-medium hover:underline"
                    style={{ color: newTheme.warning }}
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

export default withPageTransition(ResetPasswordPage);