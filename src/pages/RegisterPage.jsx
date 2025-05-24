import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { register } from '../services/authService';
import { HomeIcon, ArrowLeftOnRectangleIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
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

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          await axios.get('http://localhost:5000/api/user/profile', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setIsAuthenticated(true);
        } catch (error) {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        }
      }
    };
    checkAuth();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi password minimal 8 karakter
    if (password.length < 8) {
      setPasswordError('Kata sandi harus minimal 8 karakter');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');
    setPasswordError('');
    
    try {
      console.log('Mengirim data registrasi:', { name, email, password: '***' });
      
      const result = await register({ name, email, password });
      console.log('Hasil registrasi:', result);
      
      setSuccess('Registrasi berhasil! Anda akan dialihkan ke halaman login.');
      
      // Tunggu 2 detik sebelum redirect ke halaman login
      setTimeout(() => {
        console.log('Redirecting to login page...');
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error('Registration error:', err);
      // Tampilkan pesan error yang lebih detail
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Registrasi gagal. Coba lagi nanti.');
      } else {
        setError('Terjadi kesalahan dalam proses registrasi. Periksa koneksi internet Anda.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/register');
  };

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AnimatedBackground
          effectType="NET"
          customConfig={{
            color: 0x3b82f6,
            backgroundColor: 0x111827,
            points: 8,
            maxDistance: 25
          }}
          className="min-h-screen"
        >
          <div className="w-full max-w-md p-8 rounded-2xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-center"
            >
              <AnimatedText
                text="Anda Sudah Login"
                type="letters"
                className="text-3xl font-bold text-white mb-2"
                delay={0.3}
              />
              
              <AnimatedText
                text="Silakan kembali ke beranda atau logout untuk mendaftar akun baru."
                className="text-blue-100 mb-8"
                delay={0.6}
              />
            </motion.div>
            
            <div className="space-y-4">
              <Link to="/">
                <AnimatedButton
                  variant="light"
                  size="lg"
                  fullWidth
                  withGlow="rgba(255, 255, 255, 0.5)"
                  className="flex items-center justify-center"
                >
                  <HomeIcon className="h-5 w-5 mr-2" />
                  <span>Kembali ke Beranda</span>
                </AnimatedButton>
              </Link>
              
              <AnimatedButton
                onClick={handleLogout}
                variant="danger"
                size="lg"
                fullWidth
                withGlow="rgba(239, 68, 68, 0.5)"
                className="flex items-center justify-center"
              >
                <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2" />
                <span>Logout</span>
              </AnimatedButton>
            </div>
          </div>
        </AnimatedBackground>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <ParticlesBackground
        preset="fireflies"
        customOptions={{
          particles: {
            color: {
              value: ["#3b82f6", "#8b5cf6", "#10B981"]
            },
            number: {
              value: 30
            }
          },
          background: {
            color: {
              value: "#111827"
            }
          }
        }}
      />
      
      <div className="w-full max-w-md p-8 rounded-2xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center mb-6"
        >
          <AnimatedText
            text="Daftar ke RetinaScan"
            type="letters"
            className="text-3xl font-bold text-white mb-2"
            delay={0.3}
          />
          
          <AnimatedText
            text="Platform deteksi retinopati diabetik berbasis AI"
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
          {(error || success) && (
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
              {error || success}
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
              <label htmlFor="name" className="block text-sm font-medium text-blue-100 mb-1">
                Nama
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                placeholder="Masukkan nama Anda"
                style={{ backdropFilter: 'blur(4px)' }}
              />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <label htmlFor="email" className="block text-sm font-medium text-blue-100 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                placeholder="Masukkan email Anda"
                style={{ backdropFilter: 'blur(4px)' }}
              />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <label htmlFor="password" className="block text-sm font-medium text-blue-100 mb-1">
                Kata Sandi
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
                  placeholder="Masukkan kata sandi (min. 8 karakter)"
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
                  "Daftar Sekarang"
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
          <p className="text-blue-100">
            Sudah memiliki akun?{' '}
            <Link to="/login" className="text-blue-300 hover:text-blue-100 font-medium transition-colors">
              Login sekarang
            </Link>
          </p>
          
          <Link to="/" className="text-blue-300 hover:text-blue-100 text-sm flex items-center justify-center mt-4 transition-colors">
            <HomeIcon className="h-4 w-4 mr-1" />
            <span>Kembali ke beranda</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default RegisterPage;