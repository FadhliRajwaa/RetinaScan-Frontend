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

// Komponen ScrollReveal untuk animasi ketika elemen masuk viewport
const ScrollReveal = ({ children, delay = 0 }) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: delay }}
    >
      {children}
    </motion.div>
  );
};

// Komponen untuk footer link
const FooterLink = ({ to, label, external = false, onClick }) => {
  return (
    <li>
      {external ? (
        <a
          href={to}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center transition-colors hover:text-indigo-400"
          onClick={onClick}
        >
          <span>{label}</span>
          <ArrowTopRightOnSquareIcon className="ml-1 h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
        </a>
      ) : (
        <Link
          to={to}
          className="group flex items-center transition-colors hover:text-indigo-400"
          onClick={onClick}
        >
          {label}
          <motion.div
            className="ml-0.5 h-[1px] w-0 bg-indigo-400 transition-all group-hover:w-full"
            transition={{ duration: 0.2 }}
          />
        </Link>
      )}
    </li>
  );
};

// Komponen untuk social media button
const SocialButton = ({ icon }) => {
  const getIcon = () => {
    switch (icon) {
      case 'facebook':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02z" />
          </svg>
        );
      case 'twitter':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
          </svg>
        );
      case 'instagram':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2c-2.716 0-3.056.012-4.123.06-1.064.049-1.791.218-2.427.465a4.88 4.88 0 0 0-1.77 1.153A4.897 4.897 0 0 0 2.525 5.45c-.247.636-.416 1.363-.465 2.427C2.012 8.944 2 9.284 2 12s.012 3.056.06 4.123c.049 1.064.218 1.791.465 2.427a4.915 4.915 0 0 0 1.153 1.77 4.868 4.868 0 0 0 1.77 1.154c.636.247 1.363.416 2.427.465 1.067.048 1.407.06 4.123.06s3.056-.012 4.123-.06c1.064-.049 1.791-.218 2.427-.465a4.902 4.902 0 0 0 1.77-1.154 4.868 4.868 0 0 0 1.154-1.77c.247-.636.416-1.363.465-2.427.048-1.067.06-1.407.06-4.123s-.012-3.056-.06-4.123c-.049-1.064-.218-1.791-.465-2.427a4.88 4.88 0 0 0-1.153-1.77 4.897 4.897 0 0 0-1.77-1.154c-.636-.247-1.363-.416-2.427-.465C15.056 2.012 14.716 2 12 2m0 1.802c2.67 0 2.986.01 4.04.058.976.045 1.505.208 1.858.344.466.181.8.399 1.15.748.35.35.566.684.748 1.15.137.353.3.882.344 1.857.048 1.055.058 1.37.058 4.041 0 2.67-.01 2.986-.058 4.04-.045.976-.207 1.505-.344 1.858a3.088 3.088 0 0 1-.748 1.15c-.35.35-.684.566-1.15.748-.353.137-.882.3-1.857.344-1.054.048-1.37.058-4.041.058-2.67 0-2.987-.01-4.04-.058-.976-.045-1.505-.207-1.858-.344a3.088 3.088 0 0 1-1.15-.748 3.098 3.098 0 0 1-.748-1.15c-.137-.353-.3-.882-.344-1.857-.048-1.055-.058-1.37-.058-4.041 0-2.67.01-2.986.058-4.04.045-.976.207-1.505.344-1.858.181-.466.399-.8.748-1.15.35-.35.684-.567 1.15-.748.353-.137.882-.3 1.857-.344 1.055-.048 1.37-.058 4.041-.058m0 11.531a3.333 3.333 0 1 1 0-6.666 3.333 3.333 0 0 1 0 6.666m0-8.468a5.135 5.135 0 1 0 0 10.27 5.135 5.135 0 0 0 0-10.27m6.538-.203a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z" />
          </svg>
        );
      case 'linkedin':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h-.003z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <motion.a
      href="#"
      className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-gray-400 transition-colors hover:bg-indigo-600 hover:text-white"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      {getIcon()}
    </motion.a>
  );
};

function Footer() {
  const currentYear = new Date().getFullYear();
  const { theme } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState('');
  
  // Environment variables
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const DASHBOARD_URL = import.meta.env.VITE_DASHBOARD_URL || 'http://localhost:3000';
  
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
    <footer className="relative bg-gray-950 pt-16 pb-10 overflow-hidden border-t border-gray-800">
      {/* Background with gradient overlay instead of DotPattern */}
      <div className="absolute inset-0 pointer-events-none bg-gray-950">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#a5b4fc_1px,transparent_1px)] [background-size:20px_20px]"></div>
      </div>
      
      {/* Gradients */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 opacity-80"></div>
      <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-indigo-900/20 blur-3xl opacity-30"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-purple-900/20 blur-3xl opacity-30"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
          {/* Kolom 1: Tentang RetinaScan - Lebih lebar */}
          <div className="md:col-span-5">
            <ScrollReveal>
              <div className="space-y-6">
                <div className="flex items-center mb-4">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg shadow-lg">
                    <EyeIcon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold ml-3 bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                    RetinaScan
                  </h3>
                </div>
              
                <p className="text-gray-400 text-base leading-relaxed">
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
                <h3 className="text-lg font-semibold text-white mb-4 relative">
                  <span className="relative z-10">Link Cepat</span>
                  <span className="absolute bottom-0 left-0 h-1 w-10 bg-blue-500 rounded-full"></span>
                </h3>
                
                <ul className="space-y-3 text-gray-400">
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
                <h3 className="text-lg font-semibold text-white mb-4 relative">
                  <span className="relative z-10">Layanan</span>
                  <span className="absolute bottom-0 left-0 h-1 w-10 bg-indigo-500 rounded-full"></span>
                </h3>
                
                <ul className="space-y-3 text-gray-400">
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
                <h3 className="text-lg font-semibold text-white mb-4 relative">
                  <span className="relative z-10">Kontak</span>
                  <span className="absolute bottom-0 left-0 h-1 w-10 bg-purple-500 rounded-full"></span>
                </h3>
                
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="bg-gray-800 p-2 rounded-lg mr-3 flex-shrink-0">
                      <MapPinIcon className="h-5 w-5 text-indigo-400" />
                    </div>
                    <span className="text-gray-400 text-sm">
                      Jl. Kesehatan No. 123, Jakarta Selatan, Indonesia
                    </span>
                  </li>
                  <li className="flex items-center">
                    <div className="bg-gray-800 p-2 rounded-lg mr-3 flex-shrink-0">
                      <PhoneIcon className="h-5 w-5 text-indigo-400" />
                    </div>
                    <span className="text-gray-400 text-sm">
                      +62 21 1234 5678
                    </span>
                  </li>
                  <li className="flex items-center">
                    <div className="bg-gray-800 p-2 rounded-lg mr-3 flex-shrink-0">
                      <EnvelopeIcon className="h-5 w-5 text-indigo-400" />
                    </div>
                    <span className="text-gray-400 text-sm">
                      info@retinascan.id
                    </span>
                  </li>
                  <li className="flex items-center">
                    <div className="bg-gray-800 p-2 rounded-lg mr-3 flex-shrink-0">
                      <GlobeAltIcon className="h-5 w-5 text-indigo-400" />
                    </div>
                    <span className="text-gray-400 text-sm">
                      www.retinascan.id
                    </span>
                  </li>
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>
                
        {/* Newsletter */}
        <div className="border-t border-gray-800 pt-10 pb-8 mb-8">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 rounded-2xl p-8 shadow-lg border border-indigo-900/50">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-white mb-2">
                    Dapatkan Berita Terbaru
                  </h3>
                  <p className="text-gray-400">
                    Berlangganan newsletter kami untuk mendapatkan update tentang layanan dan teknologi terbaru.
                  </p>
                </div>
                
                <form className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="Masukkan email Anda"
                    className="flex-grow rounded-xl px-4 py-3 bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium shadow-lg"
                  >
                    Berlangganan
                  </motion.button>
                </form>
              </div>
            </ScrollReveal>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 text-center">
          <ScrollReveal>
            <p className="text-gray-500 text-sm">
              &copy; {currentYear} RetinaScan. All rights reserved.
            </p>
            <div className="flex justify-center space-x-6 mt-4">
              <Link to="/terms" className="text-gray-500 hover:text-indigo-400 text-sm">
                Syarat & Ketentuan
              </Link>
              <Link to="/privacy" className="text-gray-500 hover:text-indigo-400 text-sm">
                Kebijakan Privasi
              </Link>
              <Link to="/contact" className="text-gray-500 hover:text-indigo-400 text-sm">
                Hubungi Kami
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </footer>
  );
}

export default Footer;