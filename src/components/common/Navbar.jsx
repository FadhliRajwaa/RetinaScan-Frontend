import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [token, setToken] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { theme, isMobile } = useTheme();
  
  // Environment variables
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const DASHBOARD_URL = import.meta.env.VITE_DASHBOARD_URL || 'http://localhost:3000';

  const checkAuth = async (forceLogout = false) => {
    if (forceLogout) {
      console.log('Forcing logout due to query parameter'); // Debugging
      localStorage.removeItem('token');
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
        localStorage.removeItem('token');
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

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const logoutParam = query.get('logout');
    const fromParam = query.get('from');
    console.log('Query logout param:', logoutParam, 'From:', fromParam); // Debugging
    
    // Jika parameter logout=true, paksa logout
    if (logoutParam === 'true') {
      console.log('Forcing logout due to query parameter');
      localStorage.removeItem('token');
      sessionStorage.clear();
      setIsAuthenticated(false);
      setUserName('');
      setToken('');
      
      // Tampilkan pesan jika dari dashboard
      if (fromParam === 'dashboard') {
        // Bisa ditambahkan notifikasi sukses logout jika perlu
        console.log('Berhasil logout dari dashboard');
      }
      
      // Hapus parameter logout dari URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
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
    
    // Hapus token dari localStorage
    localStorage.removeItem('token');
    
    // Hapus semua data session lainnya jika ada
    sessionStorage.clear();
    
    // Reset state
    setIsAuthenticated(false);
    setUserName('');
    setToken('');
    
    // Redirect ke landing page dengan paksa refresh
    window.location.href = '/?logout=true&from=frontend';
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

  const bgGradient = scrolled 
    ? `linear-gradient(90deg, ${theme.primary}, ${theme.accent})`
    : `linear-gradient(90deg, ${theme.primary}, ${theme.accent})`;

  return (
    <motion.nav 
      initial="hidden"
      animate="visible"
      variants={navbarVariants}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: bgGradient,
        color: 'white',
        boxShadow: scrolled ? theme.mediumShadow : 'none',
        padding: scrolled ? '0.5rem 0' : '1rem 0',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <motion.div 
            className="flex items-center"
            variants={itemVariants}
            custom={0}
          >
            <Link to="/" className="flex-shrink-0 flex items-center">
              <motion.span 
                className="text-2xl font-extrabold tracking-tight"
                style={{
                  background: 'linear-gradient(90deg, white, rgba(255,255,255,0.8))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                RetinaScan
              </motion.span>
            </Link>
          </motion.div>
          <div className="hidden sm:flex sm:items-center sm:space-x-6">
            {isAuthenticated ? (
              <>
                <motion.a
                  href={`${DASHBOARD_URL}?token=${token}`}
                  className="px-4 py-2 text-sm font-bold rounded-lg transition-all duration-200"
                  style={{ ...theme.glassEffect }}
                  variants={itemVariants}
                  custom={1}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Dashboard
                </motion.a>
                <motion.div 
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg"
                  style={{ ...theme.glassEffect }}
                  variants={itemVariants}
                  custom={2}
                >
                  <UserCircleIcon className="h-6 w-6" />
                  <span className="text-sm font-medium">{userName}</span>
                </motion.div>
                <motion.button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
                  style={{ background: 'rgba(239, 68, 68, 0.2)', backdropFilter: 'blur(8px)' }}
                  variants={itemVariants}
                  custom={3}
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(220, 38, 38, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2" />
                  Logout
                </motion.button>
              </>
            ) : (
              <>
                <motion.div
                  variants={itemVariants}
                  custom={1}
                >
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
                    style={{ ...theme.glassEffect }}
                  >
                    Login
                  </Link>
                </motion.div>
                <motion.div
                  variants={itemVariants}
                  custom={2}
                >
                  <Link
                    to="/register"
                    className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ripple"
                    style={{ 
                      background: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: theme.smallShadow 
                    }}
                  >
                    Register
                  </Link>
                </motion.div>
              </>
            )}
          </div>
          {isMobile && (
            <motion.div 
              className="flex items-center sm:hidden"
              variants={itemVariants}
              custom={5}
            >
              <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-lg text-white transition-all duration-200"
                style={{ ...theme.glassEffect }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
      
      {isOpen && (
        <motion.div 
          className="sm:hidden shadow-2xl"
          style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`, borderRadius: '0 0 1rem 1rem' }}
          variants={mobileMenuVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="pt-2 pb-3 space-y-1">
            {isAuthenticated ? (
              <>
                <motion.a
                  href={`${DASHBOARD_URL}?token=${token}`}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 text-base font-medium rounded-lg m-2"
                  style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                  whileHover={{ scale: 1.03, x: 5, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                >
                  Dashboard
                </motion.a>
                <motion.div 
                  className="flex items-center px-4 py-2 text-base font-medium m-2"
                  whileHover={{ scale: 1.03, x: 5 }}
                >
                  <UserCircleIcon className="h-6 w-6 mr-2" />
                  <span>{userName}</span>
                </motion.div>
                <motion.button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="flex items-center w-full text-left px-4 py-2 text-base font-medium rounded-lg m-2"
                  style={{ background: 'rgba(239, 68, 68, 0.2)' }}
                  whileHover={{ scale: 1.03, x: 5, backgroundColor: 'rgba(220, 38, 38, 0.3)' }}
                >
                  <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2" />
                  Logout
                </motion.button>
              </>
            ) : (
              <>
                <motion.div whileHover={{ scale: 1.03, x: 5 }}>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2 text-base font-medium rounded-lg m-2"
                    style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                  >
                    Login
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.03, x: 5 }}>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2 text-base font-medium rounded-lg m-2"
                    style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                  >
                    Register
                  </Link>
                </motion.div>
              </>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}

export default Navbar;