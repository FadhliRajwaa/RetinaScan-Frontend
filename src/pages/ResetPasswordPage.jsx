import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { resetPassword } from '../services/authService';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99], delay: 0.2 },
  },
};

const formElementVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: 'easeInOut', delay: 0.3 + i * 0.1 },
  }),
};

const messageVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: 'easeOut', type: 'spring', stiffness: 200 },
  },
};

const buttonVariants = {
  hover: {
    scale: 1.06,
    boxShadow: '0 6px 16px rgba(29, 78, 216, 0.4)',
    backgroundImage: 'linear-gradient(to right, #1D4ED8, #2563EB)',
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  tap: { scale: 0.94, transition: { duration: 0.2 } },
};

function ResetPasswordPage() {
  const [resetCode, setResetCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState(''); // State untuk validasi password
  const [confirmPasswordError, setConfirmPasswordError] = useState(''); // State untuk validasi konfirmasi password
  const [showPassword, setShowPassword] = useState(false); // State untuk toggle show/hide password
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Set default resetCode from query parameter if available
  useEffect(() => {
    const code = searchParams.get('code');
    if (code && !resetCode) {
      setResetCode(code);
    }
  }, [searchParams, resetCode]);

  // Validasi password saat diubah
  const validatePassword = (value) => {
    if (value.length < 8) {
      return 'Kata sandi harus minimal 8 karakter';
    }
    return '';
  };

  // Validasi konfirmasi password
  const validateConfirmPassword = (password, confirmValue) => {
    if (password !== confirmValue) {
      return 'Konfirmasi kata sandi tidak sesuai';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi input
    if (!resetCode || !password) {
      setError('Kode verifikasi dan kata sandi baru wajib diisi.');
      return;
    }
    
    // Validasi password
    const passwordValidationError = validatePassword(password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return;
    }

    // Validasi konfirmasi password
    const confirmPasswordValidationError = validateConfirmPassword(password, confirmPassword);
    if (confirmPasswordValidationError) {
      setConfirmPasswordError(confirmPasswordValidationError);
      return;
    }

    setError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setIsSubmitting(true);
    
    try {
      await resetPassword(resetCode, password);
      setMessage('Kata sandi telah diatur ulang. Silakan masuk dengan kata sandi baru Anda.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan. Silakan coba lagi.');
      setMessage('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-blue-50 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div variants={cardVariants} initial="hidden" animate="visible" className="max-w-md w-full bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 space-y-8 border border-gray-100/50">
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
            className="text-3xl font-extrabold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600"
          >
            Atur Ulang Kata Sandi
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
            className="mt-2 text-sm text-gray-600"
          >
            Masukkan kode verifikasi dan kata sandi baru Anda.
          </motion.p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {message && (
            <motion.p variants={messageVariants} initial="hidden" animate="visible" className="text-center text-sm text-green-600 bg-green-100/80 p-3 rounded-md">
              {message}
            </motion.p>
          )}
          {error && (
            <motion.p variants={messageVariants} initial="hidden" animate="visible" className="text-center text-sm text-red-600 bg-red-100/80 p-3 rounded-md">
              {error}
            </motion.p>
          )}
          <motion.div variants={formElementVariants} custom={0} initial="hidden" animate="visible">
            <label htmlFor="resetCode" className="block text-sm font-medium text-gray-700">
              Kode Verifikasi
            </label>
            <motion.input
              whileFocus={{ scale: 1.02, boxShadow: '0 0 8px rgba(29, 78, 216, 0.3)', transition: { duration: 0.3 } }}
              id="resetCode"
              type="text"
              value={resetCode}
              onChange={(e) => setResetCode(e.target.value)}
              className="mt-1 block w-full px-4 py-3 bg-gray-50/50 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
              placeholder="Masukkan kode 6 digit"
              required
              disabled={isSubmitting}
            />
          </motion.div>
          <motion.div variants={formElementVariants} custom={1} initial="hidden" animate="visible">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Kata Sandi Baru
            </label>
            <div className="relative">
              <motion.input
                whileFocus={{ scale: 1.02, boxShadow: '0 0 8px rgba(29, 78, 216, 0.3)', transition: { duration: 0.3 } }}
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError(validatePassword(e.target.value));
                  if (confirmPassword) {
                    setConfirmPasswordError(validateConfirmPassword(e.target.value, confirmPassword));
                  }
                }}
                className={`mt-1 block w-full px-4 py-3 bg-gray-50/50 border rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 pr-10 ${
                  passwordError ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Masukkan Kata Sandi Baru"
                required
                disabled={isSubmitting}
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
          
          <motion.div variants={formElementVariants} custom={2} initial="hidden" animate="visible">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Konfirmasi Kata Sandi
            </label>
            <div className="relative">
              <motion.input
                whileFocus={{ scale: 1.02, boxShadow: '0 0 8px rgba(29, 78, 216, 0.3)', transition: { duration: 0.3 } }}
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setConfirmPasswordError(validateConfirmPassword(password, e.target.value));
                }}
                className={`mt-1 block w-full px-4 py-3 bg-gray-50/50 border rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 pr-10 ${
                  confirmPasswordError ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Konfirmasi Kata Sandi Baru"
                required
                disabled={isSubmitting}
              />
            </div>
            {confirmPasswordError && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-sm text-red-500"
              >
                {confirmPasswordError}
              </motion.p>
            )}
          </motion.div>
          
          <motion.button
            variants={buttonVariants}
            whileHover={!isSubmitting ? "hover" : undefined}
            whileTap={!isSubmitting ? "tap" : undefined}
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-gradient-to-r from-primary to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Memproses...
              </>
            ) : (
              'Atur Ulang Kata Sandi'
            )}
          </motion.button>
        </form>
        <motion.p variants={formElementVariants} custom={3} initial="hidden" animate="visible" className="mt-4 text-center text-sm text-gray-600">
          Kembali ke{' '}
          <Link to="/login" className="font-medium text-primary relative overflow-hidden group">
            Masuk
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}

export default ResetPasswordPage;