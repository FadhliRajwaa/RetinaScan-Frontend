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
    try {
      const user = localStorage.getItem('user');
      if (user) {
        const userData = JSON.parse(user);
        return userData;
      }
      return null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  };

  const navbarBgClass = scrolled 
    ? (theme === 'dark' 
      ? 'bg-gray-900/80 backdrop-blur-md shadow-lg' 
      : 'bg-white/80 backdrop-blur-md shadow-md')
    : (theme === 'dark' 
      ? 'bg-transparent' 
      : 'bg-transparent');

  const navbarTextClass = theme === 'dark' ? 'text-white' : 'text-gray-800';
  
  const LogoComponent = () => (
    <Link to="/" className="flex items-center">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center"
      >
        <motion.div
          className={`w-8 h-8 rounded-lg overflow-hidden mr-2 bg-gradient-to-r ${
            theme === 'dark'
              ? 'from-blue-600 to-indigo-600'
              : 'from-blue-500 to-indigo-500'
          } flex items-center justify-center`}
          animate={{
            rotate: [0, 2, 0, -2, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
        >
          <EyeIcon className="h-5 w-5 text-white" />
        </motion.div>
        <span className={`font-bold text-xl ${navbarTextClass}`}>RetinaScan</span>
      </motion.div>
    </Link>
  );

  const NavLink = ({ to, label, icon }) => {
    const isActive = location.pathname === to;
    
    return (
      <Link to={to}>
        <motion.div
          className={`relative px-3 py-2 rounded-md transition-all flex items-center ${
            isActive 
              ? (theme === 'dark' ? 'text-blue-400' : 'text-blue-600') 
              : (theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black')
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {icon && <span className="mr-1.5">{icon}</span>}
          {label}
          
          {isActive && (
            <motion.div
              className={`absolute inset-0 rounded-md ${
                theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-500/10'
              }`}
              layoutId="nav-highlight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </motion.div>
      </Link>
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
      
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navbarBgClass}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {/* Logo */}
              <LogoComponent />
              
              {/* Desktop menu */}
              <nav className="hidden md:ml-8 md:flex md:space-x-2">
                <NavLink to="/" label="Beranda" icon={<HomeIcon className="h-4 w-4" />} />
                {isAuthenticated ? (
                  <NavLink to="/retina-scan" label="Scan Retina" icon={<EyeIcon className="h-4 w-4" />} />
                ) : (
                  <>
                    <NavLink to="/login" label="Login" icon={<ArrowRightOnRectangleIcon className="h-4 w-4" />} />
                    <NavLink to="/register" label="Register" icon={<UserIcon className="h-4 w-4" />} />
                  </>
                )}
              </nav>
            </div>
            
            {/* Right side controls */}
            <div className="flex items-center">
              {/* Theme switcher */}
              <motion.button
                onClick={toggleTheme}
                className={`hidden md:flex items-center justify-center h-8 w-8 rounded-full mr-4 ${
                  theme === 'dark' ? 'bg-gray-800 text-yellow-400' : 'bg-gray-200 text-gray-700'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ rotate: 0 }}
                animate={{ rotate: [0, 15, 0] }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {theme === 'dark' ? (
                  <SunIcon className="h-5 w-5" />
                ) : (
                  <MoonIcon className="h-5 w-5" />
                )}
              </motion.button>
              
              {/* User menu (desktop) */}
              {isAuthenticated && (
                <div className="hidden md:ml-3 md:relative md:flex md:items-center" data-user-menu>
                  <motion.button
                    onClick={toggleUserMenu}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
                      theme === 'dark' 
                        ? 'hover:bg-gray-800 border border-gray-700' 
                        : 'hover:bg-gray-100 border border-gray-200'
                    }`}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <UserCircleIcon className="h-5 w-5" />
                    <span className="text-sm font-medium">{userName}</span>
                    <motion.div
                      animate={{ rotate: userMenuOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDownIcon className="h-4 w-4" />
                    </motion.div>
                  </motion.button>
                  
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        className={`absolute right-0 mt-2 w-48 py-1 rounded-md shadow-lg origin-top-right z-50 ${
                          theme === 'dark' ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'
                        }`}
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-4 py-2 text-sm">
                          <p className="font-medium truncate">{userName}</p>
                          <p className={`text-xs truncate ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            {getUserInfo()?.email || ''}
                          </p>
                        </div>
                        <div className={`border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}></div>
                        
                        <Link to="/retina-scan">
                          <motion.div
                            className={`block px-4 py-2 text-sm ${
                              theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                            } flex items-center`}
                            whileHover={{ x: 5 }}
                          >
                            <EyeIcon className="h-4 w-4 mr-2" />
                            Scan Retina
                          </motion.div>
                        </Link>
                        
                        <a href={`${DASHBOARD_URL}/#/?token=${token}`} target="_blank" rel="noopener noreferrer">
                          <motion.div
                            className={`block px-4 py-2 text-sm ${
                              theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                            } flex items-center`}
                            whileHover={{ x: 5 }}
                          >
                            <ChartBarSquareIcon className="h-4 w-4 mr-2" />
                            Dashboard
                          </motion.div>
                        </a>
                        
                        <div className={`border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}></div>
                        
                        <button
                          onClick={handleLogout}
                          className={`block w-full text-left px-4 py-2 text-sm ${
                            theme === 'dark' ? 'text-red-400 hover:bg-gray-800' : 'text-red-500 hover:bg-gray-100'
                          } flex items-center`}
                        >
                          <motion.div
                            className="flex items-center w-full"
                            whileHover={{ x: 5 }}
                          >
                            <ArrowLeftOnRectangleIcon className="h-4 w-4 mr-2" />
                            Logout
                          </motion.div>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
              
              {/* Mobile menu button */}
              <motion.button
                onClick={toggleMenu}
                className="md:hidden flex items-center justify-center p-2 rounded-md focus:outline-none"
                whileTap={{ scale: 0.9 }}
              >
                {isOpen ? (
                  <XMarkIcon className={`h-6 w-6 ${navbarTextClass}`} />
                ) : (
                  <Bars3Icon className={`h-6 w-6 ${navbarTextClass}`} />
                )}
              </motion.button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className={`md:hidden ${
                theme === 'dark' ? 'bg-gray-900' : 'bg-white'
              } shadow-lg`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="px-4 pt-2 pb-3 space-y-1">
                <NavLink to="/" label="Beranda" icon={<HomeIcon className="h-4 w-4" />} />
                
                {isAuthenticated ? (
                  <>
                    <NavLink to="/retina-scan" label="Scan Retina" icon={<EyeIcon className="h-4 w-4" />} />
                    <a href={`${DASHBOARD_URL}/#/?token=${token}`} target="_blank" rel="noopener noreferrer">
                      <motion.div
                        className={`px-3 py-2 rounded-md transition-all flex items-center ${
                          theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ChartBarSquareIcon className="h-4 w-4 mr-1.5" />
                        Dashboard
                      </motion.div>
                    </a>
                    <button
                      onClick={handleLogout}
                      className={`px-3 py-2 rounded-md transition-all flex items-center w-full text-left ${
                        theme === 'dark' ? 'text-red-400' : 'text-red-500'
                      }`}
                    >
                      <ArrowLeftOnRectangleIcon className="h-4 w-4 mr-1.5" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <NavLink to="/login" label="Login" icon={<ArrowRightOnRectangleIcon className="h-4 w-4" />} />
                    <NavLink to="/register" label="Register" icon={<UserIcon className="h-4 w-4" />} />
                  </>
                )}
                
                {/* Theme toggle for mobile */}
                <div className="pt-2">
                  <button
                    onClick={toggleTheme}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    {theme === 'dark' ? (
                      <>
                        <SunIcon className="h-4 w-4 text-yellow-400" />
                        <span>Light Mode</span>
                      </>
                    ) : (
                      <>
                        <MoonIcon className="h-4 w-4" />
                        <span>Dark Mode</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}

export default Navbar;