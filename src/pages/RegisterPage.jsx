import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { register } from '../services/authService';
import { HomeIcon, ArrowLeftOnRectangleIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 30 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.7, ease: [0.34, 1.56, 0.64, 1], delay: 0.2 } },
};

const formElementVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1], delay: 0.3 + i * 0.1 } }),
};

const messageVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'easeOut', type: 'spring', stiffness: 200 } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.3, ease: 'easeIn' } },
};

const buttonVariants = {
  initial: { backgroundColor: '#2563EB' },
  hover: { scale: 1.05, boxShadow: '0 6px 16px rgba(37, 99, 235, 0.4)', backgroundColor: '#1D4ED8', transition: { duration: 0.3 } },
  tap: { scale: 0.95, transition: { duration: 0.15 } },
  loading: { scale: 1, backgroundColor: '#9CA3AF', transition: { duration: 0.2 } },
};

const inputVariants = {
  focus: { scale: 1.01, boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.3)', borderColor: '#3B82F6', transition: { duration: 0.3 } },
  blur: { scale: 1, boxShadow: 'none', borderColor: '#D1D5DB', transition: { duration: 0.2 } },
};

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State untuk toggle show/hide password
  const navigate = useNavigate();

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-blue-50 to-gray-200 px-4 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md p-8 bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-100/50"
        >
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Anda Sudah Login</h2>
          <p className="text-center text-gray-600 mb-6">Silakan kembali ke beranda atau logout untuk mendaftar akun baru.</p>
          <div className="space-y-4">
            <Link
              to="/"
              className="flex items-center justify-center w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
            >
              <HomeIcon className="h-5 w-5 mr-2" />
              Kembali ke Beranda
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200"
            >
              <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2" />
              Logout
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-blue-50 to-gray-200 px-4 py-8">
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md p-8 bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-100/50"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Daftar ke RetinaScan</h2>
        {(error || success) && (
          <motion.p
            key={error || success}
            variants={messageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`text-center mb-6 p-3 rounded-lg border ${
              error ? 'text-red-500 bg-red-50 border-red-100/50' : 'text-green-600 bg-green-50 border-green-100/50'
            }`}
          >
            {error || success}
          </motion.p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div variants={formElementVariants} custom={0} initial="hidden" animate="visible">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nama
            </label>
            <motion.input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              variants={inputVariants}
              animate={focusedInput === 'name' ? 'focus' : 'blur'}
              onFocus={() => setFocusedInput('name')}
              onBlur={() => setFocusedInput(null)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none bg-gray-50/50 transition duration-200"
              placeholder="Masukkan nama Anda"
              required
            />
          </motion.div>
          <motion.div variants={formElementVariants} custom={1} initial="hidden" animate="visible">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <motion.input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variants={inputVariants}
              animate={focusedInput === 'email' ? 'focus' : 'blur'}
              onFocus={() => setFocusedInput('email')}
              onBlur={() => setFocusedInput(null)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none bg-gray-50/50 transition duration-200"
              placeholder="Masukkan email Anda"
              required
            />
          </motion.div>
          <motion.div variants={formElementVariants} custom={2} initial="hidden" animate="visible">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Kata Sandi
            </label>
            <div className="relative">
              <motion.input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (e.target.value.length >= 8) {
                    setPasswordError('');
                  }
                }}
                variants={inputVariants}
                animate={focusedInput === 'password' ? 'focus' : 'blur'}
                onFocus={() => setFocusedInput('password')}
                onBlur={() => setFocusedInput(null)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none bg-gray-50/50 transition duration-200 pr-10 ${
                  passwordError ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Masukkan kata sandi"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            {passwordError && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-sm text-red-500"
              >
                {passwordError}
              </motion.p>
            )}
          </motion.div>
          <motion.div variants={formElementVariants} custom={3} initial="hidden" animate="visible">
            <motion.button
              type="submit"
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              animate={isLoading ? 'loading' : undefined}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium transition duration-200"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Memproses...
                </span>
              ) : (
                'Daftar'
              )}
            </motion.button>
          </motion.div>
        </form>
        <motion.p
          variants={formElementVariants}
          custom={4}
          initial="hidden"
          animate="visible"
          className="mt-6 text-center text-gray-600"
        >
          Sudah punya akun?{' '}
          <Link to="/login" className="text-blue-600 font-medium hover:underline">
            Masuk
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}

export default RegisterPage;