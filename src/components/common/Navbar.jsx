import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { 
  processLogoutParams, 
  cleanupAfterLogout, 
  getLogoutMessage,
  handleFrontendLogout,
  getHashParams,
  cleanHashParams
} from '../../utils/authUtils';
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  HomeIcon,
  UserIcon,
  LockClosedIcon,
  EyeIcon,
  ChartBarSquareIcon
} from '@heroicons/react/24/outline';
import { newTheme } from '../../utils/newTheme';

// Komponen notifikasi untuk logout
const LogoutNotification = ({ message, type = 'success', onClose }) => {
  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  const Icon = type === 'success' ? CheckCircleIcon : ExclamationCircleIcon;
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 text-white px-6 py-3 rounded-lg shadow-lg flex items-center"
      style={{ 
        background: type === 'success' ? newTheme.gradients.success : newTheme.gradients.danger,
        boxShadow: newTheme.shadows.xl
      }}
    >
      <Icon className="h-5 w-5 mr-2" />
      {message}
      <button 
        onClick={onClose} 
        className="ml-4 hover:bg-white/20 rounded-full p-1"
      >
        <XMarkIcon className="h-4 w-4" />
      </button>
    </motion.div>
  );
};

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [token, setToken] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, isMobile } = useTheme();
  
  // Environment variables
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const DASHBOARD_URL = import.meta.env.VITE_DASHBOARD_URL || 'http://localhost:3000';

  const checkAuth = async (forceLogout = false) => {
    if (forceLogout) {
      console.log('Forcing logout due to query parameter'); // Debugging
      cleanupAfterLogout();
      setIsAuthenticated(false);
      setUserName('');
      setToken('');
      return;
    }

    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const response = await axios.get(`${API_URL}/api/user/profile`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        setIsAuthenticated(true);
        setUserName(response.data.name || 'User');
        setToken(storedToken);
      } catch (error) {
        console.error('Auth check failed:', error);
        cleanupAfterLogout();
        setIsAuthenticated(false);
        setUserName('');
        setToken('');
      }
    } else {
      setIsAuthenticated(false);
      setUserName('');
      setToken('');
    }
  };

  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success'
  });

  useEffect(() => {
    // Dengan HashRouter, kita perlu mengambil query parameter dari hash
    // Format URL: /#/?logout=true&from=dashboard
    const query = getHashParams();
    
    console.log('Current URL:', window.location.href);
    console.log('Hash params:', query.toString());
    
    // Proses parameter logout menggunakan utility function
    const logoutParams = processLogoutParams(query);
    
    // Jika parameter logout=true, paksa logout
    if (logoutParams.isLogout) {
      console.log('Forcing logout due to query parameter');
      
      // Bersihkan data setelah logout
      cleanupAfterLogout();
      
      // Reset state
      setIsAuthenticated(false);
      setUserName('');
      setToken('');
      
      // Dapatkan pesan logout yang sesuai
      const message = getLogoutMessage(logoutParams);
      if (message) {
        console.log('Logout message:', message);
        setNotification({
          show: true,
          message,
          type: logoutParams.hasError ? 'error' : 'success'
        });
      }
      
      // Hapus parameter logout dari URL (sesuai dengan HashRouter)
      cleanHashParams();
    } else if (query.get('auth') === 'failed' && query.get('from') === 'dashboard') {
      console.log('Authentication failed from dashboard');
      // Hapus parameter dari URL (sesuai dengan HashRouter)
      cleanHashParams();
      
      // Tambahkan notifikasi error login
      const message = 'Sesi login Anda telah berakhir. Silakan login kembali.';
      setNotification({
        show: true,
        message,
        type: 'error'
      });
    } else {
      // Hanya periksa autentikasi jika tidak sedang logout
      checkAuth(false);
    }
  }, [location]);
  
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    console.log('Logging out from frontend'); // Debugging
    
    // Gunakan fungsi utility untuk logout
    handleFrontendLogout(setIsAuthenticated, setUserName, setToken, navigate);
  };

  const navbarVariants = {
    hidden: { opacity: 0, y: -25 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: -5 },
    visible: i => ({
      opacity: 1,
      y: 0,
      transition: { 
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };
  
  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0, overflow: 'hidden' },
    visible: { 
      opacity: 1, 
      height: 'auto',
      transition: { 
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: { 
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  // Animasi untuk logo
  const logoVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2 }
    }
  };
  
  // Animasi untuk button
  const buttonVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  };
  
  // Animasi untuk link
  const linkVariants = {
    initial: { 
      color: scrolled ? newTheme.text.light : newTheme.text.light,
      borderBottom: '2px solid transparent'
    },
    hover: { 
      color: '#ffffff',
      borderBottom: `2px solid ${newTheme.secondary}`,
      transition: { duration: 0.2 }
    }
  };

  return (
    <>
      {/* Logout Notification */}
      <AnimatePresence>
        {notification.show && (
          <LogoutNotification 
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification({ ...notification, show: false })}
          />
        )}
      </AnimatePresence>
      
      <motion.nav 
        initial="hidden"
        animate="visible"
        variants={navbarVariants}
        className="fixed top-0 left-0 right-0 z-40 transition-all duration-300"
        style={{
          background: scrolled ? 
            'rgba(79, 70, 229, 0.9)' : 
            'linear-gradient(to bottom, rgba(79, 70, 229, 0.9), rgba(79, 70, 229, 0))',
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
          color: 'white',
          boxShadow: scrolled ? newTheme.shadows.md : 'none',
          padding: scrolled ? '0.5rem 0' : '1rem 0',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div 
              className="flex-shrink-0 flex items-center"
              variants={logoVariants}
              initial="initial"
              whileHover="hover"
            >
              <Link to="/" className="flex items-center">
                <EyeIcon className="h-8 w-8 text-white mr-2" />
                <span className="font-bold text-xl text-white">RetinaScan</span>
              </Link>
            </motion.div>
            
            {/* Desktop Navigation */}
            <div className="hidden sm:block">
              <div className="ml-10 flex items-center space-x-4">
                <motion.div
                  custom={0}
                  variants={itemVariants}
                >
                  <motion.div
                    variants={linkVariants}
                    initial="initial"
                    whileHover="hover"
                    className="px-3 py-2 text-sm font-medium rounded-md"
                  >
                    <Link to="/" className="flex items-center">
                      <HomeIcon className="h-5 w-5 mr-1" />
                      <span>Beranda</span>
                    </Link>
                  </motion.div>
                </motion.div>
                
                {isAuthenticated ? (
                  <>
                    <motion.div
                      custom={1}
                      variants={itemVariants}
                    >
                      <motion.a
                        href={`${DASHBOARD_URL}?token=${token}`}
                        variants={linkVariants}
                        initial="initial"
                        whileHover="hover"
                        className="px-3 py-2 text-sm font-medium rounded-md flex items-center"
                      >
                        <ChartBarSquareIcon className="h-5 w-5 mr-1" />
                        <span>Dashboard</span>
                      </motion.a>
                    </motion.div>
                    
                    <motion.div
                      custom={2}
                      variants={itemVariants}
                      className="ml-3 relative"
                    >
                      <div className="flex items-center space-x-3">
                        <motion.div
                          className="px-3 py-2 text-sm font-medium rounded-md flex items-center"
                        >
                          <UserCircleIcon className="h-5 w-5 mr-1" />
                          <span>{userName}</span>
                        </motion.div>
                        
                        <motion.button
                          onClick={handleLogout}
                          variants={buttonVariants}
                          initial="initial"
                          whileHover="hover"
                          whileTap="tap"
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-1" />
                          Logout
                        </motion.button>
                      </div>
                    </motion.div>
                  </>
                ) : (
                  <>
                    <motion.div
                      custom={1}
                      variants={itemVariants}
                    >
                      <motion.div
                        variants={linkVariants}
                        initial="initial"
                        whileHover="hover"
                        className="px-3 py-2 text-sm font-medium rounded-md"
                      >
                        <Link to="/login" className="flex items-center">
                          <LockClosedIcon className="h-5 w-5 mr-1" />
                          <span>Login</span>
                        </Link>
                      </motion.div>
                    </motion.div>
                    
                    <motion.div
                      custom={2}
                      variants={itemVariants}
                    >
                      <Link to="/register">
                        <motion.button
                          variants={buttonVariants}
                          initial="initial"
                          whileHover="hover"
                          whileTap="tap"
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <UserIcon className="h-5 w-5 mr-1" />
                          Register
                        </motion.button>
                      </Link>
                    </motion.div>
                  </>
                )}
              </div>
            </div>
            
            {/* Mobile menu button */}
            <div className="flex sm:hidden">
              <motion.button
                onClick={() => setIsOpen(!isOpen)}
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {isOpen ? (
                  <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              className="sm:hidden shadow-2xl"
              style={{ 
                background: 'rgba(79, 70, 229, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '0 0 1rem 1rem' 
              }}
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="pt-2 pb-3 space-y-1 px-4">
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="block w-full text-left px-4 py-3 text-base font-medium rounded-lg"
                  style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                >
                  <Link to="/" className="flex items-center" onClick={() => setIsOpen(false)}>
                    <HomeIcon className="h-5 w-5 mr-2" />
                    <span>Beranda</span>
                  </Link>
                </motion.div>
                
                {isAuthenticated ? (
                  <>
                    <motion.a
                      href={`${DASHBOARD_URL}?token=${token}`}
                      onClick={() => setIsOpen(false)}
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      className="block w-full text-left px-4 py-3 text-base font-medium rounded-lg flex items-center"
                      style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                    >
                      <ChartBarSquareIcon className="h-5 w-5 mr-2" />
                      <span>Dashboard</span>
                    </motion.a>
                    
                    <motion.div 
                      className="flex items-center px-4 py-3 text-base font-medium"
                    >
                      <UserCircleIcon className="h-6 w-6 mr-2" />
                      <span>{userName}</span>
                    </motion.div>
                    
                    <motion.button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      className="flex items-center w-full text-left px-4 py-3 text-base font-medium rounded-lg"
                      style={{ background: 'rgba(239, 68, 68, 0.3)' }}
                    >
                      <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2" />
                      Logout
                    </motion.button>
                  </>
                ) : (
                  <>
                    <motion.div
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      className="block w-full text-left px-4 py-3 text-base font-medium rounded-lg"
                      style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                    >
                      <Link to="/login" className="flex items-center" onClick={() => setIsOpen(false)}>
                        <LockClosedIcon className="h-5 w-5 mr-2" />
                        <span>Login</span>
                      </Link>
                    </motion.div>
                    
                    <motion.div
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      className="block w-full text-left px-4 py-3 text-base font-medium rounded-lg"
                      style={{ background: 'rgba(255, 255, 255, 0.2)' }}
                    >
                      <Link to="/register" className="flex items-center" onClick={() => setIsOpen(false)}>
                        <UserIcon className="h-5 w-5 mr-2" />
                        <span>Register</span>
                      </Link>
                    </motion.div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}

export default Navbar;