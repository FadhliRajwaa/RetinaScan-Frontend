import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme, AnimatedElement } from '../../context/ThemeContext';
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
  SunIcon,
  MoonIcon,
  HomeIcon,
  UserIcon,
  EyeIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

// Komponen notifikasi untuk logout dengan animasi yang lebih modern
const LogoutNotification = ({ message, type = 'success', onClose }) => {
  const { animations } = useTheme();
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
      initial={animations.slideDown.initial}
      animate={animations.slideDown.animate}
      exit={animations.slideDown.exit}
      transition={animations.slideDown.transition}
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center`}
    >
      <Icon className="h-5 w-5 mr-2" />
      {message}
      <button 
        onClick={onClose} 
        className="ml-4 hover:bg-white/20 rounded-full p-1 transition-colors duration-200"
      >
        <XMarkIcon className="h-4 w-4" />
      </button>
    </motion.div>
  );
};

// Komponen tombol toggle tema yang lebih menarik
const ThemeToggle = ({ isDarkMode, toggleTheme }) => {
  const { animations, theme } = useTheme();
  
  return (
    <motion.button
      onClick={toggleTheme}
      className={`relative h-10 w-10 rounded-full flex items-center justify-center overflow-hidden`}
      style={{
        backgroundColor: isDarkMode ? theme.background.dark2 : theme.background.light2,
        boxShadow: theme.shadow.sm
      }}
      whileTap={animations.tap}
      whileHover={animations.hover}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDarkMode ? (
          <motion.div
            key="sun"
            initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <SunIcon className="h-6 w-6 text-yellow-300" />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <MoonIcon className="h-5 w-5 text-indigo-700" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
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
  const { theme, viewport, isDarkMode, toggleTheme, animations } = useTheme();
  
  // Environment variables
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const DASHBOARD_URL = import.meta.env.VITE_DASHBOARD_URL || 'http://localhost:3000';

  const checkAuth = async (forceLogout = false) => {
    if (forceLogout) {
      console.log('Forcing logout due to query parameter');
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
    
    // Proses parameter logout menggunakan utility function
    const logoutParams = processLogoutParams(query);
    
    // Jika parameter logout=true, paksa logout
    if (logoutParams.isLogout) {
      // Bersihkan data setelah logout
      cleanupAfterLogout();
      
      // Reset state
      setIsAuthenticated(false);
      setUserName('');
      setToken('');
      
      // Dapatkan pesan logout yang sesuai
      const message = getLogoutMessage(logoutParams);
      if (message) {
        setNotification({
          show: true,
          message,
          type: logoutParams.hasError ? 'error' : 'success'
        });
      }
      
      // Hapus parameter logout dari URL (sesuai dengan HashRouter)
      cleanHashParams();
    } else if (query.get('auth') === 'failed' && query.get('from') === 'dashboard') {
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
  }, [location.pathname]);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
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
    handleFrontendLogout();
    setIsAuthenticated(false);
    setUserName('');
    setToken('');
    setIsOpen(false);
    navigate('/');
    
    setNotification({
      show: true,
      message: 'Anda berhasil logout',
      type: 'success'
    });
  };
  
  // Menu items dengan ikon untuk navigasi yang lebih visual
  const menuItems = [
    { name: 'Beranda', path: '/', icon: HomeIcon },
    { name: 'Retina Scan', path: '/retina-scan', icon: EyeIcon, auth: true },
  ];

  // Dynamically compute nav styles based on scroll and theme
  const navStyle = {
    backgroundColor: scrolled 
      ? theme.current.background 
      : 'transparent',
    boxShadow: scrolled 
      ? theme.current.shadow
      : 'none',
    borderBottom: scrolled 
      ? `1px solid ${theme.current.border}` 
      : 'none',
    transition: 'all 0.3s ease'
  };

  // Pilih warna teks dan latar belakang berdasarkan tema dan scroll
  const textColorClass = scrolled 
    ? isDarkMode ? 'text-white' : 'text-gray-800'
    : isDarkMode ? 'text-white' : 'text-gray-800';

  const buttonColorClass = scrolled || isDarkMode
    ? 'bg-primary-500 hover:bg-primary-600 text-white'
    : 'bg-white hover:bg-gray-100 text-primary-600';

  // Styles for mobile menu
  const mobileMenuStyles = {
    background: theme.current.background,
    boxShadow: theme.current.shadow
  };

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 w-full z-40 py-3 px-4 md:px-6 transition-all duration-300`}
        style={navStyle}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo dan Brand */}
          <Link to="/">
            <AnimatedElement animation="fadeIn" className="flex items-center">
              <img 
                src="/logo.svg" 
                alt="RetinaScan Logo" 
                className="h-8 md:h-10 w-auto" 
              />
              <span className={`ml-2 text-xl font-bold ${textColorClass}`}>
                RetinaScan
              </span>
            </AnimatedElement>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Menu Items */}
            <div className="flex items-center space-x-1">
              {menuItems.map((item) => {
                // Jika memerlukan auth dan user belum login, jangan tampilkan
                if (item.auth && !isAuthenticated) return null;
                
                return (
                  <Link 
                    key={item.name}
                    to={item.path}
                    className={`px-3 py-2 rounded-lg flex items-center transition-all duration-200 ${
                      location.pathname === item.path
                        ? `font-medium ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-primary-600'}`
                        : `${textColorClass} hover:bg-gray-100 dark:hover:bg-gray-800`
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-1" />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* Auth Buttons or User Menu */}
            <div className="flex items-center space-x-2 ml-4">
              <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
              
              {isAuthenticated ? (
                <div className="relative group">
                  <button 
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg ${
                      isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                    } transition-colors duration-200`}
                  >
                    <UserCircleIcon className="h-5 w-5" />
                    <span className={textColorClass}>{userName}</span>
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                    <a 
                      href={`${DASHBOARD_URL}?token=${token}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                    >
                      <ChartBarIcon className="h-4 w-4 mr-2" />
                      Dashboard
                    </a>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                    >
                      <ArrowLeftOnRectangleIcon className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className={`px-4 py-2 rounded-lg transition-colors duration-200 border ${
                      isDarkMode 
                        ? 'border-gray-700 hover:bg-gray-800 text-white' 
                        : 'border-gray-300 hover:bg-gray-100 text-gray-800'
                    }`}
                  >
                    Masuk
                  </Link>
                  <Link
                    to="/register"
                    className={`px-4 py-2 rounded-lg transition-colors duration-200 ${buttonColorClass}`}
                  >
                    Daftar
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden space-x-3">
            <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
            
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              whileTap={animations.tap}
              className={`p-2 rounded-lg ${
                isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
              }`}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <XMarkIcon className={`h-6 w-6 ${textColorClass}`} />
              ) : (
                <Bars3Icon className={`h-6 w-6 ${textColorClass}`} />
              )}
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-[60px] left-0 right-0 z-30 border-t overflow-hidden"
            style={mobileMenuStyles}
          >
            <div className="px-4 py-2 space-y-1">
              {menuItems.map((item) => {
                if (item.auth && !isAuthenticated) return null;
                
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`block px-3 py-3 rounded-lg flex items-center ${
                      location.pathname === item.path
                        ? `font-medium ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-primary-600'}`
                        : `${textColorClass} hover:bg-gray-100 dark:hover:bg-gray-800`
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
              
              {isAuthenticated ? (
                <>
                  <div className={`px-3 py-3 ${textColorClass} flex items-center`}>
                    <UserCircleIcon className="h-5 w-5 mr-2" />
                    <span>{userName}</span>
                  </div>
                  
                  <a
                    href={`${DASHBOARD_URL}?token=${token}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block px-3 py-3 rounded-lg ${textColorClass} hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center`}
                  >
                    <ChartBarIcon className="h-5 w-5 mr-2" />
                    Dashboard
                  </a>
                  
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className={`w-full text-left block px-3 py-3 rounded-lg ${textColorClass} hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center`}
                  >
                    <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <div className="pt-2 pb-3 space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className={`block w-full px-3 py-3 rounded-lg text-center transition-colors duration-200 border ${
                      isDarkMode 
                        ? 'border-gray-700 bg-gray-800 text-white' 
                        : 'border-gray-300 bg-white text-gray-800'
                    }`}
                  >
                    Masuk
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className={`block w-full px-3 py-3 rounded-lg text-center transition-colors duration-200 ${buttonColorClass}`}
                  >
                    Daftar
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
    </>
  );
}

export default Navbar;