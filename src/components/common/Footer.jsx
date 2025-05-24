import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import axios from 'axios';
import { 
  EyeIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  GlobeAltIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { newTheme } from '../../utils/newTheme';
import ScrollReveal from '../ScrollReveal';

function Footer() {
  const currentYear = new Date().getFullYear();
  const { theme } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState('');
  
  // Environment variables
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const DASHBOARD_URL = import.meta.env.VITE_DASHBOARD_URL || 'http://localhost:3000';
  
  // Animasi untuk elemen yang masuk ke viewport
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  
  // Memeriksa status autentikasi
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          await axios.get(`${API_URL}/api/user/profile`, {
            headers: { Authorization: `Bearer ${storedToken}` },
          });
          setIsAuthenticated(true);
          setToken(storedToken);
        } catch (error) {
          console.error('Auth check failed:', error);
          setIsAuthenticated(false);
          setToken('');
        }
      }
    };
    
    checkAuth();
  }, [API_URL]);
  
  const footerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.8, 
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };
  
  const linkHoverVariants = {
    initial: { x: 0 },
    hover: { 
      x: 5,
      transition: { duration: 0.2 } 
    }
  };

  // Animasi untuk link
  const linkAnimation = {
    whileHover: { scale: 1.05, x: 5 },
    whileTap: { scale: 0.95 }
  };
  
  // Animasi untuk icon sosial media
  const socialAnimation = {
    whileHover: { scale: 1.2, rotate: 5 },
    whileTap: { scale: 0.9 }
  };
  
  // Animasi untuk container
  const containerAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  // Animasi untuk item
  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <footer className="relative bg-gradient-to-b from-transparent to-indigo-50 dark:to-gray-900/30 pt-16 overflow-hidden">
      {/* Efek glass di bagian atas footer */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-300 dark:via-indigo-700 to-transparent opacity-50"></div>
      
      {/* Lingkaran dekoratif */}
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gradient-to-br from-indigo-300/20 to-purple-300/20 dark:from-indigo-900/20 dark:to-purple-900/20 blur-3xl"></div>
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-tr from-purple-300/20 to-indigo-300/20 dark:from-purple-900/20 dark:to-indigo-900/20 blur-3xl"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <ScrollReveal>
            <motion.div
              variants={containerAnimation}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="space-y-4"
            >
              <motion.div variants={itemAnimation} className="flex items-center mb-4">
                <img src="/logo.png" alt="RetinaScan Logo" className="h-8 w-auto mr-2" />
                <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  RetinaScan
                </h3>
              </motion.div>
              
              <motion.p variants={itemAnimation} className="text-gray-600 dark:text-gray-300 text-sm">
                Sistem deteksi dini Diabetic Retinopathy menggunakan teknologi AI untuk membantu pencegahan kebutaan akibat diabetes.
              </motion.p>
              
              <motion.div variants={itemAnimation} className="flex space-x-4 mt-6">
                <motion.a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300"
                  {...socialAnimation}
                >
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.77,7.46H14.5v-1.9c0-0.9,0.6-1.1,1-1.1h3V0.5h-4.33c-4.19,0-5.14,3.13-5.14,5.1v1.86H6V12h3.02v12h5.48V12h3.69L18.77,7.46z" />
                  </svg>
                </motion.a>
                
                <motion.a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300"
                  {...socialAnimation}
                >
                  <svg className="w-5 h-5 text-blue-400 dark:text-blue-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.44,4.83c-0.8,0.37-1.66,0.61-2.55,0.73c0.91-0.57,1.61-1.48,1.94-2.57c-0.87,0.53-1.81,0.9-2.83,1.13c-0.82-0.88-1.98-1.43-3.26-1.43c-2.47,0-4.47,2.11-4.47,4.7c0,0.37,0.04,0.73,0.12,1.07C8.29,8.24,4.61,6.36,2.36,3.57c-0.4,0.71-0.63,1.53-0.63,2.4c0,1.65,0.81,3.1,2.03,3.96c-0.74-0.02-1.45-0.23-2.06-0.58v0.06c0,2.3,1.56,4.22,3.63,4.65c-0.38,0.11-0.78,0.16-1.19,0.16c-0.29,0-0.58-0.03-0.85-0.08c0.58,1.88,2.26,3.25,4.25,3.29c-1.56,1.27-3.53,2.03-5.66,2.03c-0.37,0-0.73-0.02-1.08-0.07c2.02,1.35,4.42,2.14,7,2.14c8.4,0,13-7.25,13-13.54c0-0.21,0-0.41-0.01-0.61C22.1,6.57,22.85,5.76,23.44,4.83z" />
                  </svg>
                </motion.a>
                
                <motion.a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300"
                  {...socialAnimation}
                >
                  <svg className="w-5 h-5 text-pink-600 dark:text-pink-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12,2.16c3.2,0,3.58,0.01,4.85,0.07c1.17,0.05,1.8,0.24,2.22,0.41c0.56,0.22,0.96,0.48,1.38,0.9c0.42,0.42,0.68,0.82,0.9,1.38c0.17,0.42,0.35,1.05,0.41,2.22c0.06,1.27,0.07,1.65,0.07,4.85s-0.01,3.58-0.07,4.85c-0.05,1.17-0.24,1.8-0.41,2.22c-0.22,0.56-0.48,0.96-0.9,1.38c-0.42,0.42-0.82,0.68-1.38,0.9c-0.42,0.17-1.05,0.35-2.22,0.41c-1.27,0.06-1.65,0.07-4.85,0.07s-3.58-0.01-4.85-0.07c-1.17-0.05-1.8-0.24-2.22-0.41c-0.56-0.22-0.96-0.48-1.38-0.9c-0.42-0.42-0.68-0.82-0.9-1.38c-0.17-0.42-0.35-1.05-0.41-2.22c-0.06-1.27-0.07-1.65-0.07-4.85s0.01-3.58,0.07-4.85c0.05-1.17,0.24-1.8,0.41-2.22c0.22-0.56,0.48-0.96,0.9-1.38c0.42-0.42,0.82-0.68,1.38-0.9c0.42-0.17,1.05-0.35,2.22-0.41C8.42,2.17,8.8,2.16,12,2.16 M12,0C8.74,0,8.33,0.01,7.05,0.07c-1.27,0.06-2.14,0.26-2.91,0.55C3.36,0.91,2.69,1.3,2.03,1.97C1.3,2.69,0.91,3.36,0.62,4.14c-0.29,0.77-0.49,1.64-0.55,2.91C0.01,8.33,0,8.74,0,12s0.01,3.67,0.07,4.95c0.06,1.27,0.26,2.14,0.55,2.91c0.29,0.78,0.68,1.45,1.35,2.12c0.72,0.72,1.39,1.12,2.17,1.41c0.77,0.29,1.64,0.49,2.91,0.55C8.33,23.99,8.74,24,12,24s3.67-0.01,4.95-0.07c1.27-0.06,2.14-0.26,2.91-0.55c0.78-0.29,1.45-0.69,2.12-1.35c0.72-0.72,1.12-1.39,1.41-2.17c0.29-0.77,0.49-1.64,0.55-2.91c0.06-1.28,0.07-1.69,0.07-4.95s-0.01-3.67-0.07-4.95c-0.06-1.27-0.26-2.14-0.55-2.91c-0.29-0.78-0.69-1.45-1.35-2.12c-0.72-0.72-1.39-1.12-2.17-1.41c-0.77-0.29-1.64-0.49-2.91-0.55C15.67,0.01,15.26,0,12,0L12,0z M12,5.84c-3.4,0-6.16,2.76-6.16,6.16c0,3.4,2.76,6.16,6.16,6.16c3.4,0,6.16-2.76,6.16-6.16C18.16,8.6,15.4,5.84,12,5.84z M12,16c-2.21,0-4-1.79-4-4s1.79-4,4-4s4,1.79,4,4S14.21,16,12,16z M19.84,5.6c0,0.8-0.64,1.44-1.44,1.44c-0.8,0-1.44-0.64-1.44-1.44c0-0.8,0.64-1.44,1.44-1.44C19.2,4.16,19.84,4.8,19.84,5.6z" />
                  </svg>
                </motion.a>
                
                <motion.a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300"
                  {...socialAnimation}
                >
                  <svg className="w-5 h-5 text-blue-700 dark:text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.45,20.45h-3.56v-5.57c0-1.33-0.02-3.04-1.85-3.04s-2.14,1.45-2.14,2.94v5.67H9.35V9h3.42v1.56h0.05c0.47-0.9,1.63-1.85,3.36-1.85c3.6,0,4.27,2.37,4.27,5.46V20.45z M5.34,7.43c-1.14,0-2.07-0.93-2.07-2.07s0.93-2.07,2.07-2.07c1.14,0,2.07,0.93,2.07,2.07S6.48,7.43,5.34,7.43z M7.12,20.45H3.56V9h3.56V20.45z" />
                  </svg>
                </motion.a>
              </motion.div>
            </motion.div>
          </ScrollReveal>
          
          <ScrollReveal>
            <motion.div
              variants={containerAnimation}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="space-y-4"
            >
              <motion.h3 variants={itemAnimation} className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Tautan Cepat
              </motion.h3>
              
              <motion.div variants={itemAnimation} className="space-y-3">
                <motion.div {...linkAnimation}>
                  <Link to="/" className="flex items-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">
                    <span className="mr-2">•</span>
                    <span>Beranda</span>
                  </Link>
                </motion.div>
                
                <motion.div {...linkAnimation}>
                  <Link to="/about" className="flex items-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">
                    <span className="mr-2">•</span>
                    <span>Tentang Kami</span>
                  </Link>
                </motion.div>
                
                <motion.div {...linkAnimation}>
                  <Link to="/services" className="flex items-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">
                    <span className="mr-2">•</span>
                    <span>Layanan</span>
                  </Link>
                </motion.div>
                
                <motion.div {...linkAnimation}>
                  <Link to="/contact" className="flex items-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">
                    <span className="mr-2">•</span>
                    <span>Kontak</span>
                  </Link>
                </motion.div>
                
                <motion.div {...linkAnimation}>
                  <Link to="/faq" className="flex items-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">
                    <span className="mr-2">•</span>
                    <span>FAQ</span>
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </ScrollReveal>
          
          <ScrollReveal>
            <motion.div
              variants={containerAnimation}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="space-y-4"
            >
              <motion.h3 variants={itemAnimation} className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Informasi Legal
              </motion.h3>
              
              <motion.div variants={itemAnimation} className="space-y-3">
                <motion.div {...linkAnimation}>
                  <Link to="/privacy-policy" className="flex items-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">
                    <span className="mr-2">•</span>
                    <span>Kebijakan Privasi</span>
                  </Link>
                </motion.div>
                
                <motion.div {...linkAnimation}>
                  <Link to="/terms-of-service" className="flex items-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">
                    <span className="mr-2">•</span>
                    <span>Syarat Layanan</span>
                  </Link>
                </motion.div>
                
                <motion.div {...linkAnimation}>
                  <Link to="/disclaimer" className="flex items-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">
                    <span className="mr-2">•</span>
                    <span>Disclaimer</span>
                  </Link>
                </motion.div>
                
                <motion.div {...linkAnimation}>
                  <Link to="/cookies" className="flex items-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">
                    <span className="mr-2">•</span>
                    <span>Kebijakan Cookie</span>
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </ScrollReveal>
          
          <ScrollReveal>
            <motion.div
              variants={containerAnimation}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="space-y-4"
            >
              <motion.h3 variants={itemAnimation} className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Kontak Kami
              </motion.h3>
              
              <motion.div variants={itemAnimation} className="space-y-4">
                <div className="flex items-start">
                  <MapPinIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-300">
                    Jl. Teknologi No. 123, Jakarta Selatan, Indonesia
                  </span>
                </div>
                
                <div className="flex items-center">
                  <PhoneIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-3 flex-shrink-0" />
                  <a 
                    href="tel:+6281234567890" 
                    className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300"
                  >
                    +62 812 3456 7890
                  </a>
                </div>
                
                <div className="flex items-center">
                  <EnvelopeIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-3 flex-shrink-0" />
                  <a 
                    href="mailto:info@retinascan.com" 
                    className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300"
                  >
                    info@retinascan.com
                  </a>
                </div>
                
                <div className="flex items-center">
                  <GlobeAltIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-3 flex-shrink-0" />
                  <a 
                    href="https://www.retinascan.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300"
                  >
                    www.retinascan.com
                  </a>
                </div>
              </motion.div>
            </motion.div>
          </ScrollReveal>
        </div>
      </div>
      
      {/* Bottom bar dengan efek glass */}
      <div className="relative bg-white/30 dark:bg-gray-900/30 backdrop-blur-md border-t border-gray-200 dark:border-gray-800/30 py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center md:text-left mb-4 md:mb-0">
              © {currentYear} RetinaScan. All rights reserved.
            </p>
            
            <div className="flex items-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                Made with 
                <HeartIcon className="w-4 h-4 text-red-500 mx-1 animate-pulse" /> 
                in Indonesia
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;