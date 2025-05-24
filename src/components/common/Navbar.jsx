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
    if (!isAuthenticated) return null;
    
    return (
      <div className="relative" data-user-menu>
        <button
          onClick={toggleUserMenu}
          className="flex items-center space-x-2 rounded-full px-3 py-1.5 transition-all hover:bg-white/10"
        >
          <div className="h-8 w-8 overflow-hidden rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-[2px]">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-900 text-white">
              <UserIcon className="h-5 w-5" />
            </div>
          </div>
          <span className="text-sm font-medium text-white">{userName}</span>
          <ChevronDownIcon
            className={`h-4 w-4 text-gray-300 transition-transform ${
              userMenuOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
        
        <AnimatePresence>
          {userMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 w-48 origin-top-right rounded-xl bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
            >
              <div className="p-1">
                <Link
                  to={`${DASHBOARD_URL}/#/?token=${token}`}
                  className="flex w-full items-center rounded-lg px-4 py-2 text-left text-sm text-white hover:bg-gray-700"
                >
                  <ChartBarSquareIcon className="mr-2 h-5 w-5 text-indigo-400" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center rounded-lg px-4 py-2 text-left text-sm text-white hover:bg-gray-700"
                >
                  <ArrowLeftOnRectangleIcon className="mr-2 h-5 w-5 text-red-400" />
                  Logout
                </button>
                <div className="my-1 h-px bg-gray-700"></div>
                <button
                  onClick={toggleTheme}
                  className="flex w-full items-center rounded-lg px-4 py-2 text-left text-sm text-white hover:bg-gray-700"
                >
                  {theme === 'dark' ? (
                    <>
                      <SunIcon className="mr-2 h-5 w-5 text-yellow-400" />
                      Light Mode
                    </>
                  ) : (
                    <>
                      <MoonIcon className="mr-2 h-5 w-5 text-blue-400" />
                      Dark Mode
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
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
      
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-black/80 backdrop-blur-lg border-b border-white/10'
            : 'bg-transparent'
        }`}
      >
        <div className="relative">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex h-16 items-center justify-between">
              {/* Logo */}
              <div className="flex-shrink-0">
                <Link to="/" className="flex items-center space-x-2">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg shadow-lg">
                    <EyeIcon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xl font-bold text-white">RetinaScan</span>
                </Link>
              </div>
              
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-4">
                <NavLink to="/" label="Beranda" icon={<HomeIcon className="h-5 w-5" />} />
                {isAuthenticated ? (
                  <>
                    <NavLink to={`${DASHBOARD_URL}/#/?token=${token}`} label="Dashboard" icon={<ChartBarSquareIcon className="h-5 w-5" />} />
                    {getUserInfo()}
                  </>
                ) : (
                  <>
                    <NavLink to="/login" label="Login" icon={<UserCircleIcon className="h-5 w-5" />} />
                    <Link
                      to="/register"
                      className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-md hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300"
                    >
                      <UserIcon className="h-5 w-5" />
                      <span>Register</span>
                    </Link>
                    <button
                      onClick={toggleTheme}
                      className="rounded-full p-2 text-white hover:bg-white/10 transition-colors"
                      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                    >
                      {theme === 'dark' ? (
                        <SunIcon className="h-5 w-5" />
                      ) : (
                        <MoonIcon className="h-5 w-5" />
                      )}
                    </button>
                  </>
                )}
              </nav>
              
              {/* Mobile menu button */}
              <div className="flex md:hidden">
                <button
                  onClick={toggleMenu}
                  className="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-white/10 focus:outline-none"
                >
                  <span className="sr-only">Open main menu</span>
                  {isOpen ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
          </div>
          
          {/* Mobile menu, show/hide based on menu state */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden bg-gray-900/90 backdrop-blur-lg border-b border-white/10"
              >
                <div className="space-y-1 px-4 py-4">
                  <Link
                    to="/"
                    className="block rounded-lg px-3 py-2 text-base font-medium text-white hover:bg-white/10"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="flex items-center space-x-3">
                      <HomeIcon className="h-5 w-5 text-indigo-400" />
                      <span>Beranda</span>
                    </div>
                  </Link>
                  
                  {isAuthenticated ? (
                    <>
                      <Link
                        to={`${DASHBOARD_URL}/#/?token=${token}`}
                        className="block rounded-lg px-3 py-2 text-base font-medium text-white hover:bg-white/10"
                        onClick={() => setIsOpen(false)}
                      >
                        <div className="flex items-center space-x-3">
                          <ChartBarSquareIcon className="h-5 w-5 text-indigo-400" />
                          <span>Dashboard</span>
                        </div>
                      </Link>
                      <div className="flex items-center space-x-3 rounded-lg px-3 py-2 text-base font-medium text-white">
                        <UserCircleIcon className="h-5 w-5 text-indigo-400" />
                        <span>{userName}</span>
                      </div>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsOpen(false);
                        }}
                        className="flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-base font-medium text-white hover:bg-white/10"
                      >
                        <ArrowLeftOnRectangleIcon className="h-5 w-5 text-red-400" />
                        <span>Logout</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="block rounded-lg px-3 py-2 text-base font-medium text-white hover:bg-white/10"
                        onClick={() => setIsOpen(false)}
                      >
                        <div className="flex items-center space-x-3">
                          <UserCircleIcon className="h-5 w-5 text-indigo-400" />
                          <span>Login</span>
                        </div>
                      </Link>
                      <Link
                        to="/register"
                        className="block rounded-lg px-3 py-2 text-base font-medium text-white hover:bg-white/10"
                        onClick={() => setIsOpen(false)}
                      >
                        <div className="flex items-center space-x-3">
                          <UserIcon className="h-5 w-5 text-indigo-400" />
                          <span>Register</span>
                        </div>
                      </Link>
                    </>
                  )}
                  
                  <button
                    onClick={() => {
                      toggleTheme();
                      setIsOpen(false);
                    }}
                    className="flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-base font-medium text-white hover:bg-white/10"
                  >
                    {theme === 'dark' ? (
                      <>
                        <SunIcon className="h-5 w-5 text-yellow-400" />
                        <span>Light Mode</span>
                      </>
                    ) : (
                      <>
                        <MoonIcon className="h-5 w-5 text-blue-400" />
                        <span>Dark Mode</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>
    </>
  );
}

const NavLink = ({ to, label, icon }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={`flex items-center space-x-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
        isActive
          ? 'text-white bg-white/10'
          : 'text-gray-300 hover:text-white hover:bg-white/5'
      }`}
    >
      {icon}
      <span>{label}</span>
      {isActive && (
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-blue-500 to-indigo-600"
          layoutId="navbar-indicator"
          transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
        />
      )}
    </Link>
  );
};

export default Navbar;