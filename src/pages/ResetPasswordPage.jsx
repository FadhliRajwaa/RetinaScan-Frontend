import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { resetPassword } from '../services/authService';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../context/ThemeContext';

// Import komponen animasi
import AnimatedBackground from '../components/animations/AnimatedBackground';
import ParticlesBackground from '../components/animations/ParticlesBackground';
import AnimatedText from '../components/animations/AnimatedText';
import AnimatedButton from '../components/animations/AnimatedButton';

const formVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.2,
      delayChildren: 0.3,
      duration: 0.5
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 24 }
  }
};

function ResetPasswordPage() {
  const [resetCode, setResetCode] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const { theme } = useTheme();

  // Set default resetCode from query parameter if available
  useEffect(() => {
    const code = searchParams.get('code');
    if (code && !resetCode) {
      setResetCode(code);
    }
  }, [searchParams, resetCode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi input
    if (!resetCode || !password) {
      setError('Kode verifikasi dan kata sandi baru wajib diisi.');
      return;
    }
    
    // Validasi password minimal 8 karakter
    if (password.length < 8) {
      setPasswordError('Kata sandi harus minimal 8 karakter');
      return;
    }

    setError('');
    setPasswordError('');
    setIsLoading(true);
    
    try {
      await resetPassword(resetCode, password);
      setMessage('Kata sandi telah diatur ulang. Silakan masuk dengan kata sandi baru Anda.');
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan. Silakan coba lagi.');
      setMessage('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <AnimatedBackground
        effectType="GLOBE"
        customConfig={{
          color: 0x3b82f6,
          backgroundColor: 0x111827,
          size: 0.8,
          spacing: 1.2
        }}
        className="min-h-screen"
      >
        <div className="w-full max-w-md p-8 rounded-2xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-center mb-6"
          >
            <AnimatedText
              text="Atur Ulang Kata Sandi"
              type="letters"
              className="text-3xl font-bold text-white mb-2"
              delay={0.3}
            />
            
            <AnimatedText
              text="Masukkan kode verifikasi dan kata sandi baru Anda"
              className="text-blue-100"
              delay={0.6}
            />
          </motion.div>
          
          <motion.div
            className="bg-white/10 backdrop-blur-xl rounded-xl p-6 shadow-2xl border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
          >
            {(message || error) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`p-3 mb-4 rounded-lg ${
                  error 
                    ? 'bg-red-500/20 border border-red-500/50 text-white' 
                    : 'bg-green-500/20 border border-green-500/50 text-white'
                } text-sm`}
              >
                {error || message}
              </motion.div>
            )}
            
            <motion.form 
              onSubmit={handleSubmit}
              variants={formVariants}
              initial="hidden"
              animate="visible"
              className="space-y-5"
            >
              <motion.div variants={itemVariants}>
                <label htmlFor="resetCode" className="block text-sm font-medium text-blue-100 mb-1">
                  Kode Verifikasi
                </label>
                <input
                  id="resetCode"
                  type="text"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Masukkan kode verifikasi"
                  style={{ backdropFilter: 'blur(4px)' }}
                />
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <label htmlFor="password" className="block text-sm font-medium text-blue-100 mb-1">
                  Kata Sandi Baru
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (e.target.value.length >= 8) {
                        setPasswordError('');
                      }
                    }}
                    required
                    className={`w-full px-4 py-3 rounded-lg bg-white/10 border text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                      passwordError ? 'border-red-500' : 'border-white/20'
                    }`}
                    placeholder="Masukkan kata sandi baru (min. 8 karakter)"
                    style={{ backdropFilter: 'blur(4px)' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-200 hover:text-white transition-colors"
                  >
                    {showPassword ? 
                      <EyeSlashIcon className="h-5 w-5" /> : 
                      <EyeIcon className="h-5 w-5" />
                    }
                  </button>
                </div>
                {passwordError && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-300"
                  >
                    {passwordError}
                  </motion.p>
                )}
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <AnimatedButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  withGlow
                  withGradient
                  gradientColors={['#3b82f6', '#8b5cf6']}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Memproses...</span>
                    </div>
                  ) : (
                    "Atur Ulang Kata Sandi"
                  )}
                </AnimatedButton>
              </motion.div>
            </motion.form>
          </motion.div>
          
          <motion.div 
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <Link to="/login" className="text-blue-300 hover:text-blue-100 text-sm flex items-center justify-center mt-4 transition-colors">
              <span>Kembali ke halaman Login</span>
            </Link>
          </motion.div>
        </div>
      </AnimatedBackground>
    </div>
  );
}

export default ResetPasswordPage;