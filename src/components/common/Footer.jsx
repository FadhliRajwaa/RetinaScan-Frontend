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
  HeartIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  QuestionMarkCircleIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';
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

  return (
    <footer className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 pt-16 pb-10 overflow-hidden border-t border-gray-200 dark:border-gray-800">
      {/* Efek dekoratif */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-80"></div>
      <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-indigo-100 dark:bg-indigo-900/20 blur-3xl opacity-30"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-purple-100 dark:bg-purple-900/20 blur-3xl opacity-30"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
          {/* Kolom 1: Tentang RetinaScan - Lebih lebar */}
          <div className="md:col-span-5">
          <ScrollReveal>
              <div className="space-y-6">
                <div className="flex items-center mb-4">
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg shadow-lg">
                    <EyeIcon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold ml-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  RetinaScan
                </h3>
                </div>
              
                <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                  RetinaScan menghadirkan teknologi AI terdepan untuk deteksi dini retinopati diabetik, 
                  membantu mencegah kebutaan akibat diabetes dengan diagnosis yang cepat, akurat, dan terjangkau.
                </p>
                
                <div className="flex space-x-4 mt-6">
                  <SocialButton icon="facebook" />
                  <SocialButton icon="twitter" />
                  <SocialButton icon="instagram" />
                  <SocialButton icon="linkedin" />
                </div>
              </div>
          </ScrollReveal>
          </div>
          
          {/* Kolom 2: Link Cepat */}
          <div className="md:col-span-2">
            <ScrollReveal delay={0.1}>
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 relative">
                  <span className="relative z-10">Link Cepat</span>
                  <span className="absolute bottom-0 left-0 h-1 w-10 bg-indigo-500 rounded-full"></span>
                </h3>
                
                <ul className="space-y-3">
                  <FooterLink to="/" label="Beranda" />
                  <FooterLink to="/about" label="Tentang" />
                  <FooterLink to="/privacy" label="Privasi" />
                  {isAuthenticated ? (
                    <>
                      <FooterLink to={`${DASHBOARD_URL}/#/?token=${token}`} label="Dashboard" external />
                      <FooterLink to="/login" label="Logout" onClick={() => localStorage.removeItem('token')} />
                    </>
                  ) : (
                    <>
                      <FooterLink to="/login" label="Login" />
                      <FooterLink to="/register" label="Register" />
                    </>
                  )}
                </ul>
              </div>
          </ScrollReveal>
          </div>
          
          {/* Kolom 3: Layanan */}
          <div className="md:col-span-2">
            <ScrollReveal delay={0.2}>
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 relative">
                  <span className="relative z-10">Layanan</span>
                  <span className="absolute bottom-0 left-0 h-1 w-10 bg-purple-500 rounded-full"></span>
                </h3>
                
                <ul className="space-y-3">
                  <FooterLink to="#" label="Deteksi Retinopati" />
                  <FooterLink to="#" label="Analisis Kesehatan" />
                  <FooterLink to="#" label="Konsultasi Online" />
                  <FooterLink to="#" label="Riwayat Medis" />
                  <FooterLink to="#" label="Laporan Kesehatan" />
                </ul>
              </div>
          </ScrollReveal>
          </div>
          
          {/* Kolom 4: Kontak */}
          <div className="md:col-span-3">
            <ScrollReveal delay={0.3}>
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 relative">
                  <span className="relative z-10">Kontak</span>
                  <span className="absolute bottom-0 left-0 h-1 w-10 bg-pink-500 rounded-full"></span>
                </h3>
                
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg mr-3 flex-shrink-0">
                      <MapPinIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <span className="text-gray-600 dark:text-gray-300 text-sm">
                      Jl. Kesehatan No. 123, Jakarta Selatan, Indonesia
                  </span>
                  </li>
                  <li className="flex items-center">
                    <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg mr-3 flex-shrink-0">
                      <PhoneIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <span className="text-gray-600 dark:text-gray-300 text-sm">
                      +62 21 1234 5678
                    </span>
                  </li>
                  <li className="flex items-center">
                    <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg mr-3 flex-shrink-0">
                      <EnvelopeIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <span className="text-gray-600 dark:text-gray-300 text-sm">
                      info@retinascan.id
                    </span>
                  </li>
                  <li className="flex items-center">
                    <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg mr-3 flex-shrink-0">
                      <GlobeAltIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <span className="text-gray-600 dark:text-gray-300 text-sm">
                      www.retinascan.id
                    </span>
                  </li>
                </ul>
              </div>
            </ScrollReveal>
          </div>
                </div>
                
        {/* Newsletter */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-10 pb-8 mb-8">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <div className="bg-gradient-to-r from-indigo-600/10 to-purple-600/10 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-2xl p-8 shadow-lg">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Dapatkan Berita Terbaru
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Berlangganan newsletter kami untuk mendapatkan informasi terbaru tentang kesehatan retina
                  </p>
                </div>
                
                <form className="flex flex-col sm:flex-row gap-3">
                  <input 
                    type="email" 
                    placeholder="Masukkan email Anda" 
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all"
                  >
                    Berlangganan
                  </motion.button>
                </form>
                </div>
          </ScrollReveal>
        </div>
      </div>
      
        {/* Copyright & Links */}
        <div className="flex flex-col md:flex-row justify-between items-center border-t border-gray-200 dark:border-gray-800 pt-8">
          <div className="flex items-center mb-4 md:mb-0">
            <HeartIcon className="h-4 w-4 text-red-500 mr-2" />
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              © {currentYear} RetinaScan. Dibuat dengan <span className="text-red-500">♥</span> di Indonesia.
            </p>
          </div>
            
          <div className="flex flex-wrap gap-6">
            <Link to="/privacy" className="text-gray-600 dark:text-gray-400 text-sm hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center">
              <ShieldCheckIcon className="h-4 w-4 mr-1" />
              <span>Kebijakan Privasi</span>
            </Link>
            <Link to="/terms" className="text-gray-600 dark:text-gray-400 text-sm hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center">
              <DocumentTextIcon className="h-4 w-4 mr-1" />
              <span>Syarat & Ketentuan</span>
            </Link>
            <Link to="/faq" className="text-gray-600 dark:text-gray-400 text-sm hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center">
              <QuestionMarkCircleIcon className="h-4 w-4 mr-1" />
              <span>FAQ</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Komponen untuk link footer
const FooterLink = ({ to, label, external = false, onClick }) => {
  if (external) {
    return (
      <li>
        <a 
          href={to}
          onClick={onClick}
          className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-sm flex items-center group"
          target="_blank"
          rel="noopener noreferrer"
        >
          <motion.span
            initial={{ x: 0 }}
            whileHover={{ x: 3 }}
            transition={{ duration: 0.2 }}
            className="flex items-center"
          >
            {label}
            <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.span>
        </a>
      </li>
    );
  }
  
  return (
    <li>
      <Link 
        to={to}
        onClick={onClick}
        className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-sm flex items-center"
      >
        <motion.span
          initial={{ x: 0 }}
          whileHover={{ x: 3 }}
          transition={{ duration: 0.2 }}
        >
          {label}
        </motion.span>
      </Link>
    </li>
  );
};

// Komponen untuk tombol sosial media
const SocialButton = ({ icon }) => {
  const getIcon = () => {
    switch (icon) {
      case 'facebook':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.77,7.46H14.5v-1.9c0-0.9,0.6-1.1,1-1.1h3V0.5h-4.33c-4.19,0-5.14,3.13-5.14,5.1v1.86H6V12h3.02v12h5.48V12h3.69L18.77,7.46z" />
          </svg>
        );
      case 'twitter':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.44,4.83c-0.8,0.37-1.66,0.61-2.55,0.73c0.91-0.57,1.61-1.48,1.94-2.57c-0.87,0.53-1.81,0.9-2.83,1.13c-0.82-0.88-1.98-1.43-3.26-1.43c-2.47,0-4.47,2.11-4.47,4.7c0,0.37,0.04,0.73,0.12,1.07C8.29,8.24,4.61,6.36,2.36,3.57c-0.4,0.71-0.63,1.53-0.63,2.4c0,1.65,0.81,3.1,2.03,3.96c-0.74-0.02-1.45-0.23-2.06-0.58v0.06c0,2.3,1.56,4.22,3.63,4.65c-0.38,0.11-0.78,0.16-1.19,0.16c-0.29,0-0.58-0.03-0.85-0.08c0.58,1.88,2.26,3.25,4.25,3.29c-1.56,1.27-3.53,2.03-5.66,2.03c-0.37,0-0.73-0.02-1.08-0.07c2.02,1.35,4.42,2.14,7,2.14c8.4,0,13-7.25,13-13.54c0-0.21,0-0.41-0.01-0.61C22.1,6.57,22.85,5.76,23.44,4.83z" />
          </svg>
        );
      case 'instagram':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12,2.16c3.2,0,3.58,0.01,4.85,0.07c1.17,0.05,1.8,0.24,2.22,0.41c0.56,0.22,0.96,0.48,1.38,0.9c0.42,0.42,0.68,0.82,0.9,1.38c0.17,0.42,0.35,1.05,0.41,2.22c0.06,1.27,0.07,1.65,0.07,4.85s-0.01,3.58-0.07,4.85c-0.05,1.17-0.24,1.8-0.41,2.22c-0.22,0.56-0.48,0.96-0.9,1.38c-0.42,0.42-0.82,0.68-1.38,0.9c-0.42,0.17-1.05,0.35-2.22,0.41c-1.27,0.06-1.65,0.07-4.85,0.07s-3.58-0.01-4.85-0.07c-1.17-0.05-1.8-0.24-2.22-0.41c-0.56-0.22-0.96-0.48-1.38-0.9c-0.42-0.42-0.68-0.82-0.9-1.38c-0.17-0.42-0.35-1.05-0.41-2.22c-0.06-1.27-0.07-1.65-0.07-4.85s0.01-3.58,0.07-4.85c0.05-1.17,0.24-1.8,0.41-2.22c0.22-0.56,0.48-0.96,0.9-1.38c0.42-0.42,0.82-0.68,1.38-0.9c0.42-0.17,1.05-0.35,2.22-0.41C8.42,2.17,8.8,2.16,12,2.16 M12,0C8.74,0,8.33,0.01,7.05,0.07c-1.27,0.06-2.14,0.26-2.91,0.55C3.36,0.91,2.69,1.3,2.03,1.97C1.3,2.69,0.91,3.36,0.62,4.14c-0.29,0.77-0.49,1.64-0.55,2.91C0.01,8.33,0,8.74,0,12s0.01,3.67,0.07,4.95c0.06,1.27,0.26,2.14,0.55,2.91c0.29,0.78,0.68,1.45,1.35,2.12c0.72,0.72,1.39,1.12,2.17,1.41c0.77,0.29,1.64,0.49,2.91,0.55C8.33,23.99,8.74,24,12,24s3.67-0.01,4.95-0.07c1.27-0.06,2.14-0.26,2.91-0.55c0.78-0.29,1.45-0.69,2.12-1.35c0.72-0.72,1.12-1.39,1.41-2.17c0.29-0.77,0.49-1.64,0.55-2.91c0.06-1.28,0.07-1.69,0.07-4.95s-0.01-3.67-0.07-4.95c-0.06-1.27-0.26-2.14-0.55-2.91c-0.29-0.78-0.69-1.45-1.35-2.12c-0.72-0.72-1.39-1.12-2.17-1.41c-0.77-0.29-1.64-0.49-2.91-0.55C15.67,0.01,15.26,0,12,0L12,0z M12,5.84c-3.4,0-6.16,2.76-6.16,6.16c0,3.4,2.76,6.16,6.16,6.16c3.4,0,6.16-2.76,6.16-6.16C18.16,8.6,15.4,5.84,12,5.84z M12,16c-2.21,0-4-1.79-4-4s1.79-4,4-4s4,1.79,4,4S14.21,16,12,16z M19.84,5.6c0,0.8-0.64,1.44-1.44,1.44c-0.8,0-1.44-0.64-1.44-1.44c0-0.8,0.64-1.44,1.44-1.44C19.2,4.16,19.84,4.8,19.84,5.6z" />
          </svg>
        );
      case 'linkedin':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.45,20.45h-3.56v-5.57c0-1.33-0.02-3.04-1.85-3.04s-2.14,1.45-2.14,2.94v5.67H9.35V9h3.42v1.56h0.05c0.47-0.9,1.63-1.85,3.36-1.85c3.6,0,4.27,2.37,4.27,5.46V20.45z M5.34,7.43c-1.14,0-2.07-0.93-2.07-2.07s0.93-2.07,2.07-2.07c1.14,0,2.07,0.93,2.07,2.07S6.48,7.43,5.34,7.43z M7.12,20.45H3.56V9h3.56V20.45z" />
          </svg>
        );
      default:
        return null;
    }
  };
  
  return (
    <motion.a
      href="#"
      whileHover={{ scale: 1.1, y: -3 }}
      whileTap={{ scale: 0.95 }}
      className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-md hover:shadow-lg text-white transition-all"
    >
      {getIcon()}
    </motion.a>
  );
};

export default Footer;