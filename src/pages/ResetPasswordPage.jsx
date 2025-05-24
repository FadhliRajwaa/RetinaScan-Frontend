import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { withPageTransition } from '../context/ThemeContext';
import { newTheme, enhancedAnimations, lottieConfig } from '../utils/newTheme';
import LottieAnimation from '../components/LottieAnimation';
import ParticlesBackground from '../components/ParticlesBackground';
import AnimatedButton from '../components/AnimatedButton';
import AnimatedInput from '../components/AnimatedInput';
import axios from 'axios';
import { HomeIcon, ArrowLeftIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

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

  // Environment variables
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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

    try {
      await axios.post(`${API_URL}/api/auth/reset-password`, {
        token,
        password: formData.password,
      });
      
      setResetSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      console.error('Reset password error:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setResetError(error.response.data.message);
      } else {
        setResetError('Terjadi kesalahan saat reset password. Silakan coba lagi.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      {/* Background */}
      <ParticlesBackground 
        color="rgba(245, 158, 11, 0.5)"
        count={60}
        speed={0.7}
      />
      
      <motion.div
        className="w-full max-w-md relative z-10"
        initial={enhancedAnimations.card.initial}
        animate={enhancedAnimations.card.animate}
      >
        <div 
          className="bg-white rounded-2xl overflow-hidden shadow-xl"
          style={{ boxShadow: newTheme.shadows.xl }}
        >
          {/* Header bar */}
          <div 
            className="h-2 w-full" 
            style={{ background: newTheme.gradients.sunset }}
          ></div>
          
          <div className="p-8">
            {/* Logo and heading */}
            <div className="text-center mb-8">
              <div className="h-40 mb-6">
                <LottieAnimation
                  animationData={lottieConfig.animations.resetPassword}
                  loop={true}
                />
              </div>
              
              <motion.h2
                className="text-3xl font-bold mb-2"
                style={{ color: newTheme.text.primary }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Reset Password
              </motion.h2>
              
              <motion.p
                className="text-base"
                style={{ color: newTheme.text.secondary }}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Buat password baru untuk akun Anda
              </motion.p>
            </div>
            
            {/* Error message */}
            {resetError && (
              <motion.div 
                className="mb-6 p-4 rounded-lg"
                style={{ 
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  borderLeft: `4px solid ${newTheme.danger}` 
                }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p style={{ color: newTheme.danger }}>{resetError}</p>
              </motion.div>
            )}
            
            {/* Success message */}
            {resetSuccess ? (
              <motion.div
                className="text-center py-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="h-24 mb-4">
                  <LottieAnimation
                    animationData={lottieConfig.animations.success}
                    loop={false}
                  />
                </div>
                
                <h3 className="text-xl font-semibold mb-2" style={{ color: newTheme.success }}>
                  Password Berhasil Diubah!
                </h3>
                
                <p className="mb-6" style={{ color: newTheme.text.secondary }}>
                  Password Anda telah berhasil diubah. Anda akan dialihkan ke halaman login dalam beberapa detik.
                </p>
                
                <div className="space-y-4">
                  <Link to="/login">
                    <AnimatedButton variant="warning" fullWidth>
                      <ShieldCheckIcon className="w-5 h-5 mr-2" />
                      Login Sekarang
                    </AnimatedButton>
                  </Link>
                  
                  <Link to="/">
                    <AnimatedButton variant="outline" fullWidth>
                      <HomeIcon className="w-5 h-5 mr-2" />
                      Kembali ke Beranda
                    </AnimatedButton>
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.form 
                onSubmit={handleSubmit}
                className="space-y-6"
                variants={enhancedAnimations.container}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={enhancedAnimations.item}>
                  <AnimatedInput
                    type="password"
                    name="password"
                    id="password"
                    label="Password Baru"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    error={errors.password}
                  />
                </motion.div>
                
                <motion.div variants={enhancedAnimations.item}>
                  <AnimatedInput
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    label="Konfirmasi Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    error={errors.confirmPassword}
                  />
                </motion.div>
                
                <motion.div variants={enhancedAnimations.item}>
                  <AnimatedButton
                    type="submit"
                    variant="warning"
                    fullWidth
                    disabled={isLoading || !token}
                  >
                    {isLoading ? 'Memproses...' : 'Reset Password'}
                  </AnimatedButton>
                </motion.div>
                
                <motion.div 
                  className="text-center"
                  variants={enhancedAnimations.item}
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