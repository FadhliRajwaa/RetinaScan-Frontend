import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { forgotPassword } from '../services/authService';

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

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [resetCode, setResetCode] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await forgotPassword(email);
      setMessage(response.message);
      setResetCode(response.resetCode);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan. Silakan coba lagi.');
      setMessage('');
      setResetCode('');
    }
  };

  const handleContinue = () => {
    if (resetCode) {
      navigate(`/reset-password?code=${resetCode}`);
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
            className="text-3xl font-extrabold text-blue-600 "
          >
            Pulihkan Kata Sandi
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
            className="mt-2 text-sm text-gray-800"
          >
            Masukkan email Anda untuk mendapatkan kode verifikasi.
          </motion.p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {message && (
            <motion.div variants={messageVariants} initial="hidden" animate="visible" className="text-center text-sm text-secondary bg-green-100/80 p-3 rounded-md">
              <p>{message}</p>
              {resetCode && (
                <p className="mt-2">
                  Kode verifikasi Anda: <strong>{resetCode}</strong>
                </p>
              )}
              {resetCode && (
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={handleContinue}
                  className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-gradient-to-r from-primary to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300"
                >
                  Lanjut ke Atur Ulang Kata Sandi
                </motion.button>
              )}
            </motion.div>
          )}
          {error && (
            <motion.p variants={messageVariants} initial="hidden" animate="visible" className="text-center text-sm text-red-600 bg-red-100/80 p-3 rounded-md">
              {error}
            </motion.p>
          )}
          <motion.div variants={formElementVariants} custom={0} initial="hidden" animate="visible">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <motion.input
              whileFocus={{ scale: 1.02, boxShadow: '0 0 8px rgba(29, 78, 216, 0.3)', transition: { duration: 0.3 } }}
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-3 bg-gray-50/50 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
              placeholder="retinascan@gmail.com"
              required
            />
          </motion.div>
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-gradient-to-r from-primary to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300"
          >
            Dapatkan Kode Verifikasi
          </motion.button>
        </form>
        <motion.p variants={formElementVariants} custom={1} initial="hidden" animate="visible" className="mt-4 text-center text-sm text-gray-600">
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

export default ForgotPasswordPage;