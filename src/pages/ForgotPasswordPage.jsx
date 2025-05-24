import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { withPageTransition } from '../context/ThemeContext';
import { newTheme, enhancedAnimations, lottieConfig } from '../utils/newTheme';
import LottieAnimation from '../components/LottieAnimation';
import ParticlesBackground from '../components/ParticlesBackground';
import AnimatedButton from '../components/AnimatedButton';
import AnimatedInput from '../components/AnimatedInput';
import axios from 'axios';
import { HomeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Environment variables
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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

    try {
      await axios.post(`${API_URL}/api/auth/forgot-password`, { email });
      setSuccess(true);
    } catch (error) {
      console.error('Forgot password error:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Terjadi kesalahan saat mengirim permintaan reset password. Silakan coba lagi.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      {/* Background */}
      <ParticlesBackground 
        color="rgba(59, 130, 246, 0.5)"
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
            style={{ background: newTheme.gradients.cool }}
          ></div>
          
          <div className="p-8">
            {/* Logo and heading */}
            <div className="text-center mb-8">
              <div className="h-40 mb-6">
                <LottieAnimation
                  animationData={lottieConfig.animations.forgotPassword}
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
                Lupa Password?
              </motion.h2>
              
              <motion.p
                className="text-base"
                style={{ color: newTheme.text.secondary }}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Masukkan email Anda untuk menerima tautan reset password
              </motion.p>
            </div>
            
            {/* Error message */}
            {error && (
              <motion.div 
                className="mb-6 p-4 rounded-lg"
                style={{ 
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  borderLeft: `4px solid ${newTheme.danger}` 
                }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p style={{ color: newTheme.danger }}>{error}</p>
              </motion.div>
            )}
            
            {/* Success message */}
            {success ? (
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
                  Email Terkirim!
                </h3>
                
                <p className="mb-6" style={{ color: newTheme.text.secondary }}>
                  Silakan periksa email Anda untuk tautan reset password. Jika tidak menemukannya, periksa folder spam.
                </p>
                
                <div className="space-y-4">
                  <Link to="/login">
                    <AnimatedButton variant="primary" fullWidth>
                      Kembali ke Login
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
                    type="email"
                    name="email"
                    id="email"
                    label="Email"
                    value={email}
                    onChange={handleChange}
                    required
                    error={error ? ' ' : undefined}
                  />
                </motion.div>
                
                <motion.div variants={enhancedAnimations.item}>
                  <AnimatedButton
                    type="submit"
                    variant="info"
                    fullWidth
                    disabled={isLoading}
                  >
                    {isLoading ? 'Memproses...' : 'Kirim Tautan Reset'}
                  </AnimatedButton>
                </motion.div>
                
                <motion.div 
                  className="text-center"
                  variants={enhancedAnimations.item}
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