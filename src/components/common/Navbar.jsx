import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { 
  processLogoutParams, 
  cleanupAfterLogout, 
  getLogoutMessage,
  handleFrontendLogout,
  getHashParams,
  cleanHashParams,
  isLoggedIn
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
  ChartBarSquareIcon,
  SunIcon,
  MoonIcon,
  ChevronDownIcon,
  EyeIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import VantaBackground from '../VantaBackground';
import { TextAnimate } from '../TextAnimate';
import { FlipText } from '../FlipText';

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
      className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center"
      style={{ 
        background: type === 'success' ? 'linear-gradient(to right, rgba(16, 185, 129, 0.9), rgba(5, 150, 105, 0.9))' : 'linear-gradient(to right, rgba(239, 68, 68, 0.9), rgba(220, 38, 38, 0.9))',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
      }}
    >
      <Icon className="h-5 w-5 mr-2 text-white" />
      <span className="text-white font-medium">{message}</span>
      <button 
        onClick={onClose} 
        className="ml-4 hover:bg-white/20 rounded-full p-1 transition-colors duration-200"
      >
        <XMarkIcon className="h-4 w-4 text-white" />
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
  const { theme, toggleTheme } = useTheme();
  const navbarRef = useRef(null);
  
  // Environment variables
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const DASHBOARD_URL = import.meta.env.VITE_DASHBOARD_URL || 'http://localhost:3000';

  // Scroll animation
  const { scrollY } = useScroll();
  const navbarBackground = useTransform(
    scrollY,
    [0, 100],
    ["rgba(3, 7, 18, 0)", "rgba(3, 7, 18, 0.8)"]
  );
  const navbarBlur = useTransform(
    scrollY,
    [0, 100],
    ["blur(0px)", "blur(12px)"]
  );
  const navbarBorder = useTransform(
    scrollY,
    [0, 100],
    ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.1)"]
  );

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
    try {
      // Dengan HashRouter, kita perlu mengambil query parameter dari hash dengan defensive programming
      const query = getHashParams();
      
      console.log('Current URL:', window.location?.href || 'URL tidak tersedia');
      console.log('Hash params:', query?.toString() || 'Tidak ada parameter');
      
      // Proses parameter logout menggunakan utility function dengan defensive programming
      const logoutParams = processLogoutParams(query || new URLSearchParams(''));
    
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
    } catch (error) {
      console.error('Error saat memproses URL:', error);
      // Coba periksa autentikasi meskipun ada error saat memproses URL
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
    console.log('Logging out from frontend'); 
    
    // Gunakan fungsi utility untuk logout
    handleFrontendLogout(setIsAuthenticated, setUserName, setToken, navigate);
    
    // Reset state
    setIsAuthenticated(false);
    setUserName('');
    setToken('');
    setUserMenuOpen(false);
    
    // Tampilkan notifikasi
    setNotification({
      show: true,
      message: 'Anda berhasil logout.',
      type: 'success'
    });
    
    // Redirect ke home
    navigate('/');
  };
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuOpen && event.target.closest('[data-user-menu]') === null) {
        setUserMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuOpen]);
  
  const getUserInfo = () => {
    if (isAuthenticated && userName) {
      return {
        name: userName,
        avatar: userName.charAt(0).toUpperCase(),
        isAuthenticated: true
      };
    }
    
    return {
      name: 'Guest',
      avatar: 'G',
      isAuthenticated: false
    };
  };
  
  const userInfo = getUserInfo();
  const isCurrentPage = (path) => location.pathname === path;

  // Navbar link items
  const navLinks = [
    {
      to: '/',
      label: 'Beranda',
      icon: <HomeIcon className="h-5 w-5" />
    },
    {
      to: '/scan',
      label: 'Scan Retina',
      icon: <EyeIcon className="h-5 w-5" />
    }
  ];

  // Framer motion variants
  const navbarVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const navItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: 'auto',
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      height: 0,
      transition: { duration: 0.3 }
    }
  };

  const NavLink = ({ to, label, icon }) => {
    const isActive = isCurrentPage(to);
    
    return (
      <motion.li 
        variants={navItemVariants}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link
          to={to}
          className={`flex items-center px-4 py-2 rounded-xl transition-all duration-300 group ${
            isActive 
              ? 'bg-blue-500/10 text-blue-500' 
              : 'text-gray-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <span className={`mr-2 ${isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-blue-400'} transition-colors duration-300`}>
            {icon}
          </span>
          <span className="font-medium">
            <TextAnimate by="letter" animation="slideIn" delay={0.1}>
              {label}
            </TextAnimate>
          </span>
          {isActive && (
            <motion.span
              layoutId="navIndicator" 
              className="ml-2 h-1.5 w-1.5 rounded-full bg-blue-500"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </Link>
      </motion.li>
    );
  };

  return (
    <>
      <AnimatePresence>
        {notification.show && (
          <LogoutNotification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification({ ...notification, show: false })}
          />
        )}
      </AnimatePresence>
      
      {/* Navbar */}
      <motion.header
        ref={navbarRef}
        variants={navbarVariants}
        initial="hidden"
        animate="visible"
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: navbarBackground,
          backdropFilter: navbarBlur,
          borderBottom: `1px solid ${navbarBorder}`
        }}
      >
        <div className="relative overflow-hidden">
          {/* VantaJS Background untuk Navbar */}
          <div className="absolute inset-0 pointer-events-none" style={{ height: '100%', zIndex: -1 }}>
            <VantaBackground options={{
              color: 0x3b82f6, // blue-500
              color2: 0x1e40af, // blue-800
              backgroundColor: 0x030712, // gray-950
              spacing: 30.00,
              size: 1.2,
              showLines: false
            }} />
          </div>
          
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            {/* Logo dan Brand */}
            <Link to="/" className="flex items-center space-x-3 group">
              <motion.div
                initial={{ scale: 0.8, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.5, type: 'spring' }}
                className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg shadow-lg"
                whileHover={{ rotate: [0, -5, 5, -5, 0], transition: { duration: 0.5 } }}
              >
                <EyeIcon className="h-6 w-6 text-white" />
              </motion.div>
              
              <div className="flex flex-col">
                <motion.span 
                  className="text-xl font-bold text-white tracking-tight"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <FlipText>RetinaScan</FlipText>
                </motion.span>
                <motion.span 
                  className="text-xs text-blue-400/80 font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  Analisis Retina AI
                </motion.span>
              </div>
            </Link>
            
            {/* Navigation Links - Desktop */}
            <motion.nav 
              className="hidden md:flex"
              variants={navbarVariants}
            >
              <motion.ul className="flex space-x-2" variants={navbarVariants}>
                {navLinks.map((link) => (
                  <NavLink 
                    key={link.to} 
                    to={link.to} 
                    label={link.label} 
                    icon={link.icon} 
                  />
                ))}
              </motion.ul>
            </motion.nav>
            
            {/* Right side - User menu or Login/Register */}
            <div className="flex items-center">
              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                className="relative p-2 rounded-full mr-2 text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200"
              >
                <span className="sr-only">Toggle theme</span>
                <AnimatePresence mode="wait">
                  {theme === 'dark' ? (
                    <motion.span
                      key="darkMode"
                      initial={{ opacity: 0, rotate: -90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 90 }}
                      transition={{ duration: 0.3 }}
                    >
                      <SunIcon className="h-5 w-5" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="lightMode"
                      initial={{ opacity: 0, rotate: 90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: -90 }}
                      transition={{ duration: 0.3 }}
                    >
                      <MoonIcon className="h-5 w-5" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
              
              {isAuthenticated ? (
                // User Menu
                <div className="relative" data-user-menu>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleUserMenu}
                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl focus:outline-none ${
                      userMenuOpen 
                        ? 'bg-blue-500/10 text-blue-500' 
                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    } transition-colors duration-200`}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium">
                      {userInfo.avatar}
                    </div>
                    <span className="font-medium hidden sm:block">{userInfo.name}</span>
                    <ChevronDownIcon className={`h-4 w-4 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </motion.button>
                  
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-48 rounded-xl overflow-hidden bg-gray-900/90 backdrop-blur-lg border border-white/10 shadow-xl z-50"
                      >
                        <div className="py-1">
                          <Link
                            to={`${DASHBOARD_URL}/#/?token=${token}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-blue-500/10 hover:text-blue-500 transition-colors duration-200"
                          >
                            <ChartBarSquareIcon className="h-5 w-5 mr-2" />
                            Dashboard
                          </Link>
                          <Link
                            to="/account"
                            className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-blue-500/10 hover:text-blue-500 transition-colors duration-200"
                          >
                            <UserIcon className="h-5 w-5 mr-2" />
                            Profil Saya
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-500 transition-colors duration-200"
                          >
                            <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2" />
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                // Login & Register Buttons
                <div className="flex items-center space-x-2">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <Link
                      to="/login"
                      className="hidden md:flex items-center px-4 py-2 text-gray-300 hover:text-white transition-colors duration-200"
                    >
                      <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                      <span>Login</span>
                    </Link>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/register"
                      className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-md hover:shadow-blue-500/20 transition-all duration-200"
                    >
                      <UserCircleIcon className="h-5 w-5 mr-2" />
                      <span>Register</span>
                    </Link>
                  </motion.div>
                </div>
              )}
              
              {/* Mobile menu button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleMenu}
                className="md:hidden p-2 ml-2 rounded-full text-gray-300 hover:text-white focus:outline-none"
              >
                <span className="sr-only">Open menu</span>
                <AnimatePresence mode="wait">
                  {isOpen ? (
                    <motion.span
                      key="close"
                      initial={{ opacity: 0, rotate: 90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="menu"
                      initial={{ opacity: 0, rotate: -90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: -90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Bars3Icon className="h-6 w-6" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
          
          {/* Mobile menu */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                variants={mobileMenuVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="md:hidden overflow-hidden"
              >
                <div className="container mx-auto px-4 py-3 space-y-1 bg-gray-900/80 backdrop-blur-md border-t border-white/5">
                  {navLinks.map((link) => (
                    <motion.div
                      key={link.to}
                      variants={navItemVariants}
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        to={link.to}
                        className={`flex items-center px-4 py-3 rounded-xl ${
                          isCurrentPage(link.to) 
                            ? 'bg-blue-500/10 text-blue-500' 
                            : 'text-gray-300 hover:bg-white/5 hover:text-white'
                        } transition-colors duration-200`}
                        onClick={() => setIsOpen(false)}
                      >
                        <span className="mr-3 text-blue-400">{link.icon}</span>
                        <span className="font-medium">{link.label}</span>
                      </Link>
                    </motion.div>
                  ))}
                  
                  {!isAuthenticated && (
                    <motion.div 
                      variants={navItemVariants}
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        to="/login"
                        className="flex items-center px-4 py-3 rounded-xl text-gray-300 hover:bg-white/5 hover:text-white transition-colors duration-200"
                        onClick={() => setIsOpen(false)}
                      >
                        <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3 text-blue-400" />
                        <span className="font-medium">Login</span>
                      </Link>
                    </motion.div>
                  )}
                  
                  {isAuthenticated && (
                    <motion.div 
                      variants={navItemVariants}
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsOpen(false);
                        }}
                        className="w-full flex items-center px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-500 transition-colors duration-200"
                      >
                        <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3" />
                        <span className="font-medium">Logout</span>
                      </button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>
    </>
  );
}

export default Navbar;