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
  ChartBarSquareIcon,
  SunIcon,
  MoonIcon,
  ChevronDownIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

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
        className="ml-4 hover:bg-white/20 rounded-full p-1"
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
    console.log('Logging out from frontend'); 
    
    // Gunakan fungsi utility untuk logout
    handleFrontendLogout(setIsAuthenticated, setUserName, setToken, navigate);
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
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled 
            ? 'bg-black/80 backdrop-blur-lg shadow-lg py-2' 
            : 'bg-transparent py-4'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 z-10">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center"
              >
                <div className="relative w-10 h-10">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-xl shadow-lg transform rotate-6 opacity-60"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <EyeIcon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="flex flex-col ml-2">
                  <span className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                    RetinaScan
                  </span>
                  <span className="text-xs text-gray-400 -mt-1">AI Vision</span>
                </div>
              </motion.div>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              <NavLink to="/" label="Beranda" icon={<HomeIcon className="h-5 w-5" />} />
              
              {/* Dark Mode Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="p-2 rounded-full transition-colors bg-gray-800/50 text-gray-300"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <SunIcon className="h-5 w-5 text-amber-400" />
                ) : (
                  <MoonIcon className="h-5 w-5 text-blue-400" />
                )}
              </motion.button>
              
              {/* User Menu atau Login/Register */}
              {isAuthenticated ? (
                <div className="relative user-menu-container ml-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleUserMenu}
                    className="flex items-center px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-600/20 to-blue-600/20 text-gray-300 hover:bg-gradient-to-r hover:from-cyan-600/30 hover:to-blue-600/30 transition-all"
                  >
                    <div className="bg-gradient-to-br from-cyan-600 to-blue-600 rounded-full p-1 mr-2 shadow">
                      <UserCircleIcon className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-medium mr-1">{userName}</span>
                    <ChevronDownIcon className="h-4 w-4" />
                  </motion.button>
                  
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute right-0 mt-2 w-60 rounded-2xl shadow-xl py-2 bg-black/80 backdrop-blur-md border border-gray-700/50"
                        style={{
                          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2)'
                        }}
                      >
                        <div className="px-4 py-3 border-b border-gray-700">
                          <p className="text-sm font-medium text-white">{userName}</p>
                          <p className="text-xs text-gray-400 mt-1 truncate">
                            {user?.email || 'user@example.com'}
                          </p>
                        </div>
                        <Link 
                          to={`${DASHBOARD_URL}/#/?token=${token}`} 
                          className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                        >
                          <div className="flex items-center">
                            <ChartBarSquareIcon className="h-4 w-4 mr-2" />
                            Dashboard
                          </div>
                        </Link>
                        <button 
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
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
                <div className="flex items-center space-x-3">
                  <Link to="/login">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 rounded-xl text-gray-300 border border-gray-700 hover:bg-gray-800 transition-all shadow-sm"
                    >
                      Login
                    </motion.button>
                  </Link>
                  <Link to="/register">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all"
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
                className="p-2 mr-2 rounded-full bg-gray-800/50 text-gray-300 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <SunIcon className="h-5 w-5 text-amber-400" />
                ) : (
                  <MoonIcon className="h-5 w-5 text-blue-400" />
                )}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleMenu}
                className="p-2 rounded-full bg-gray-800/50 text-gray-300 transition-colors"
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
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden bg-black/90 backdrop-blur-xl shadow-lg rounded-2xl mx-4 mt-2 overflow-hidden border border-gray-700/50"
            >
              <div className="container mx-auto px-4 py-3 space-y-1">
                <Link 
                  to="/"
                  onClick={toggleMenu}
                  className="flex items-center p-3 rounded-xl text-gray-300 hover:bg-gray-800 transition-colors"
                >
                  <HomeIcon className="h-5 w-5 mr-3" />
                  <span>Beranda</span>
                </Link>
                
                {isAuthenticated ? (
                  <>
                    <a 
                      href={`${DASHBOARD_URL}/#/?token=${token}`}
                      className="flex items-center p-3 rounded-xl text-gray-300 hover:bg-gray-800 transition-colors"
                    >
                      <ChartBarSquareIcon className="h-5 w-5 mr-3" />
                      <span>Dashboard</span>
                    </a>
                    <button 
                      onClick={() => {
                        handleLogout();
                        toggleMenu();
                      }}
                      className="flex items-center w-full p-3 rounded-xl text-gray-300 hover:bg-gray-800 transition-colors"
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
                      className="flex items-center p-3 rounded-xl text-gray-300 hover:bg-gray-800 transition-colors"
                    >
                      <UserIcon className="h-5 w-5 mr-3" />
                      <span>Login</span>
                    </Link>
                    <Link 
                      to="/register"
                      onClick={toggleMenu}
                      className="flex items-center p-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white"
                    >
                      <UserIcon className="h-5 w-5 mr-3" />
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
        className={`px-3 py-2 rounded-xl flex items-center transition-colors ${
          isActive 
            ? 'bg-gradient-to-r from-cyan-600/20 to-blue-600/20 text-cyan-400 font-medium' 
            : 'text-gray-300 hover:bg-gray-800'
        }`}
      >
        {icon && <span className="mr-1.5">{icon}</span>}
        <span>{label}</span>
      </motion.div>
    </Link>
  );
};

export default Navbar;