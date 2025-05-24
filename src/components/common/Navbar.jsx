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
  ChartBarSquareIcon,
  SunIcon,
  MoonIcon,
  ChevronDownIcon,
  ShieldCheckIcon,
  InformationCircleIcon
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
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, isMobile, toggleTheme } = useTheme();
  
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
      if (offset > 10) {
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

  useEffect(() => {
    setIsOpen(false);
    setUserMenuOpen(false);
  }, [location]);
  
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

  // Animasi untuk menu mobile
  const menuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
        staggerChildren: 0.05,
        staggerDirection: -1,
        when: 'afterChildren'
      }
    },
    open: {
      opacity: 1,
      height: 'auto',
      transition: {
        duration: 0.4,
        ease: 'easeOut',
        staggerChildren: 0.1,
        delayChildren: 0.1,
        when: 'beforeChildren'
      }
    }
  };
  
  // Animasi untuk user menu dropdown
  const dropdownVariants = {
    closed: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: 'easeInOut'
      }
    },
    open: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: 'easeOut'
      }
    }
  };
  
  // Toggle menu mobile
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  // Toggle user menu dropdown
  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };
  
  // Tutup user menu dropdown jika klik di luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuOpen && !event.target.closest('.user-menu-container')) {
        setUserMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuOpen]);
  
  // Ambil info user dari localStorage jika ada
  const getUserInfo = () => {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        return JSON.parse(userString);
      } catch (e) {
        return null;
      }
    }
    return null;
  };
  
  const user = getUserInfo();
  
  // Tentukan class untuk navbar berdasarkan scroll
  const navbarClass = scrolled
    ? 'bg-white/80 dark:bg-gray-900/90 backdrop-blur-lg shadow-md'
    : 'bg-white/50 dark:bg-gray-900/50 backdrop-blur-md';
  
  // Animasi untuk navbar saat scroll
  const navbarAnimation = {
    initial: { height: 80 },
    scrolled: { height: 70 }
  };

  return (
    <>
      {notification.show && (
        <LogoutNotification 
          message={notification.message} 
          type={notification.type} 
          onClose={() => setNotification({ show: false, message: '', type: 'success' })} 
        />
      )}
      
      <motion.nav 
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled 
            ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg shadow-md py-2' 
            : 'bg-transparent py-4'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center"
              >
                <EyeIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                <span className="ml-2 text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  RetinaScan
                </span>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              <NavLink to="/" label="Beranda" icon={<HomeIcon className="h-5 w-5" />} />
              <NavLink to="/about" label="Tentang" icon={<InformationCircleIcon className="h-5 w-5" />} />
              <NavLink to="/privacy" label="Privasi" icon={<ShieldCheckIcon className="h-5 w-5" />} />
              
              {/* Tombol tema */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="px-3 py-2 rounded-lg flex items-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <SunIcon className="h-5 w-5 text-amber-400" />
                ) : (
                  <MoonIcon className="h-5 w-5 text-indigo-600" />
                )}
              </motion.button>
              
              {/* User Menu atau Login/Register */}
              {isAuthenticated ? (
                <div className="relative user-menu-container">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleUserMenu}
                    className="flex items-center px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <UserCircleIcon className="h-6 w-6 mr-2 text-indigo-600 dark:text-indigo-400" />
                    <span className="mr-1">{userName}</span>
                    <ChevronDownIcon className="h-4 w-4" />
                  </motion.button>
                  
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-56 rounded-xl shadow-xl py-2 bg-white dark:bg-gray-800 ring-1 ring-gray-200 dark:ring-gray-700 border border-gray-100 dark:border-gray-700"
                      >
                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{userName}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                            {user?.email || 'user@example.com'}
                          </p>
                        </div>
                        <Link 
                          to={`${DASHBOARD_URL}/#/?token=${token}`} 
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <div className="flex items-center">
                            <ChartBarSquareIcon className="h-4 w-4 mr-2" />
                            Dashboard
                          </div>
                        </Link>
                        <button 
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <div className="flex items-center">
                            <ArrowLeftOnRectangleIcon className="h-4 w-4 mr-2" />
                            Logout
                          </div>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/login">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      Login
                    </motion.button>
                  </Link>
                  <Link to="/register">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md hover:shadow-lg transition-all"
                    >
                      Register
                    </motion.button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Navigation Button */}
            <div className="md:hidden flex items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="p-2 mr-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <SunIcon className="h-5 w-5 text-amber-400" />
                ) : (
                  <MoonIcon className="h-5 w-5 text-indigo-600" />
                )}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleMenu}
                className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle menu"
              >
                {isOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white dark:bg-gray-900 shadow-lg rounded-b-2xl mx-4 mt-2 overflow-hidden"
            >
              <div className="container mx-auto px-4 py-3 space-y-1">
                <Link 
                  to="/"
                  onClick={toggleMenu}
                  className="flex items-center p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <HomeIcon className="h-5 w-5 mr-3" />
                  <span>Beranda</span>
                </Link>
                
                <Link 
                  to="/about"
                  onClick={toggleMenu}
                  className="flex items-center p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <InformationCircleIcon className="h-5 w-5 mr-3" />
                  <span>Tentang</span>
                </Link>
                
                <Link 
                  to="/privacy"
                  onClick={toggleMenu}
                  className="flex items-center p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <ShieldCheckIcon className="h-5 w-5 mr-3" />
                  <span>Privasi</span>
                </Link>
                
                {isAuthenticated ? (
                  <>
                    <a 
                      href={`${DASHBOARD_URL}/#/?token=${token}`}
                      className="flex items-center p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <ChartBarSquareIcon className="h-5 w-5 mr-3" />
                      <span>Dashboard</span>
                    </a>
                    <button 
                      onClick={() => {
                        handleLogout();
                        toggleMenu();
                      }}
                      className="flex items-center w-full p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/login"
                      onClick={toggleMenu}
                      className="flex items-center p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <UserIcon className="h-5 w-5 mr-3" />
                      <span>Login</span>
                    </Link>
                    <Link 
                      to="/register"
                      onClick={toggleMenu}
                      className="flex items-center p-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                    >
                      <LockClosedIcon className="h-5 w-5 mr-3" />
                      <span>Register</span>
                    </Link>
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

// NavLink component for desktop navigation
const NavLink = ({ to, label, icon }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link to={to}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`px-3 py-2 rounded-lg flex items-center transition-colors ${
          isActive 
            ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' 
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
      >
        {icon && <span className="mr-1">{icon}</span>}
        <span>{label}</span>
      </motion.div>
    </Link>
  );
};

export default Navbar;