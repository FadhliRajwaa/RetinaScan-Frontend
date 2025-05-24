import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useState, useEffect } from 'react';
import { 
  ArrowRightIcon, 
  ShieldCheckIcon, 
  CogIcon, 
  ChartBarIcon, 
  UserGroupIcon,
  BoltIcon,
  ArrowDownIcon,
  EyeIcon,
  DocumentTextIcon,
  ClockIcon,
  BeakerIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';

function LandingPage() {
  const { theme, animations } = useTheme();
  const [animateParticles, setAnimateParticles] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
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
  
  // Efek untuk animasi slide otomatis
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: { 
        type: 'spring',
        damping: 15,
        stiffness: 100,
        delay: custom * 0.2,
        duration: 0.8
      }
    })
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };
  
  // Animasi partikel
  const particleVariants = {
    animate: {
      y: [0, -10, 0],
      opacity: [0.3, 1, 0.3],
      scale: [1, 1.2, 1],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  };
  
  // Animasi untuk floating elements
  const floatVariants = {
    animate: (custom) => ({
      y: [0, -10, 0],
      transition: {
        duration: 4,
        delay: custom * 0.5,
        repeat: Infinity,
        repeatType: "reverse"
      }
    })
  };
  
  // Animasi untuk slide
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    },
    exit: (direction) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      transition: {
        duration: 0.5
      }
    })
  };

  return (
    <div className="pt-16">
      {/* Hero Section dengan Animasi Medis */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        {/* Background gradient dengan animasi partikel retina */}
        <div className="absolute inset-0 opacity-90 z-0" style={{
          background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent}, ${theme.secondary})`,
          backgroundSize: '400% 400%',
          animation: 'gradientAnimation 15s ease infinite'
        }}>
          {/* Animasi partikel yang menyerupai sel retina */}
          <div className="absolute inset-0 overflow-hidden">
            {animateParticles && Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  width: Math.random() * 10 + 5,
                  height: Math.random() * 10 + 5,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                variants={particleVariants}
                animate="animate"
                custom={i}
              />
            ))}
            
            {/* Animasi aliran darah (garis bergerak) */}
            <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
              <motion.path
                d="M0,100 Q300,150 600,100 T1200,100"
                fill="none"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="2"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: 1, 
                  opacity: 0.5,
                  transition: { duration: 3, repeat: Infinity, repeatType: "loop" }
                }}
              />
              <motion.path
                d="M0,200 Q300,250 600,200 T1200,200"
                fill="none"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="2"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: 1, 
                  opacity: 0.3,
                  transition: { duration: 4, repeat: Infinity, repeatType: "loop", delay: 1 }
                }}
              />
            </svg>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10">
          <div className="text-center">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6 text-white text-shadow"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Deteksi Dini 
              </motion.span>
              <motion.span 
                className="block md:inline md:ml-2" 
                style={{
                  background: 'linear-gradient(90deg, white, rgba(255,255,255,0.8))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Retinopati Diabetik
              </motion.span>
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl mb-6 text-blue-100 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Solusi berbasis AI untuk tim medis dalam mendeteksi dan mengklasifikasikan tingkat keparahan 
              retinopati diabetik melalui analisis citra fundus retina secara cepat dan akurat.
            </motion.p>
            
            {/* Medical Info Card */}
            <motion.div
              className="mb-10 p-6 rounded-xl mx-auto max-w-3xl"
              style={{ ...theme.glassEffect }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <h3 className="text-xl font-semibold mb-3 text-white">Untuk Tim Medis</h3>
              <p className="text-blue-50 mb-4">
                RetinaScan membantu skrining pasien diabetes dengan cepat dan akurat, mengklasifikasikan 
                tingkat keparahan retinopati diabetik sesuai standar ICDR (0-4) dengan akurasi 98%.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-white">
                <div className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  <span>Hasil dalam 3 detik</span>
                </div>
                <div className="flex items-center">
                  <BeakerIcon className="h-4 w-4 mr-1" />
                  <span>Sensitivitas 96%</span>
                </div>
                <div className="flex items-center">
                  <DocumentTextIcon className="h-4 w-4 mr-1" />
                  <span>Laporan terstruktur</span>
                </div>
                <div className="flex items-center">
                  <AcademicCapIcon className="h-4 w-4 mr-1" />
                  <span>Berbasis riset</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              className="flex flex-col sm:flex-row justify-center gap-4 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              {isAuthenticated ? (
                <a href={`${DASHBOARD_URL}?token=${token}`}>
                  <motion.button
                    className="px-8 py-4 rounded-full text-white font-bold shadow-lg hover:shadow-xl transition duration-300 flex items-center justify-center w-full sm:w-auto"
                    style={{
                      background: `linear-gradient(to right, ${theme.accent}, ${theme.primary})`,
                      boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.5)'
                    }}
                    whileHover={{ scale: 1.05, boxShadow: "0 15px 30px -5px rgba(59, 130, 246, 0.7)" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Mulai Sekarang
                    <ArrowRightIcon className="w-5 h-5 ml-2" />
                  </motion.button>
                </a>
              ) : (
                <>
                  <Link to="/register">
                    <motion.button
                      className="px-8 py-4 rounded-full text-white font-bold shadow-lg hover:shadow-xl transition duration-300 flex items-center justify-center w-full sm:w-auto"
                      style={{
                        background: `linear-gradient(to right, ${theme.accent}, ${theme.primary})`,
                        boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.5)'
                      }}
                      whileHover={{ scale: 1.05, boxShadow: "0 15px 30px -5px rgba(59, 130, 246, 0.7)" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Mulai Sekarang
                      <ArrowRightIcon className="w-5 h-5 ml-2" />
                    </motion.button>
                  </Link>
                  <Link to="/login">
                    <motion.button
                      className="px-8 py-4 rounded-full text-white font-bold transition duration-300 flex items-center justify-center w-full sm:w-auto"
                      style={{ ...theme.glassEffect }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Login
                    </motion.button>
                  </Link>
                </>
              )}
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="flex justify-center"
            >
              <motion.div 
                className="animate-bounce cursor-pointer"
                whileHover={{ scale: 1.2 }}
              >
                <ArrowDownIcon className="h-8 w-8 text-white opacity-80" />
              </motion.div>
            </motion.div>
          </div>
        </div>
        
        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
            <path fill="#ffffff" fillOpacity="1" d="M0,256L48,234.7C96,213,192,171,288,154.7C384,139,480,149,576,165.3C672,181,768,203,864,197.3C960,192,1056,160,1152,154.7C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* Features Section dengan Animasi dan Informasi Medis */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
            custom={0}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Fitur Utama untuk Tim Medis</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              RetinaScan menyediakan solusi komprehensif untuk deteksi retinopati diabetik
              dengan fitur-fitur canggih yang dirancang khusus untuk tenaga medis.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            <motion.div 
              className="bg-white p-8 rounded-2xl hover-scale relative overflow-hidden"
              style={{ boxShadow: theme.mediumShadow }}
              variants={fadeInUp}
              whileHover={{ y: -10, boxShadow: theme.largeShadow }}
            >
              {/* Animasi background subtle */}
              <motion.div 
                className="absolute top-0 right-0 w-40 h-40 rounded-full"
                style={{ background: `${theme.primary}10`, filter: 'blur(40px)' }}
                animate={{ 
                  scale: [1, 1.2, 1], 
                  opacity: [0.3, 0.5, 0.3] 
                }}
                transition={{ 
                  duration: 5, 
                  repeat: Infinity,
                  repeatType: "reverse" 
                }}
              />
              
              <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 relative"
                   style={{ background: `${theme.primary}20`, color: theme.primary }}>
                <EyeIcon className="w-8 h-8" />
                <motion.div 
                  className="absolute inset-0 rounded-xl"
                  style={{ border: `2px solid ${theme.primary}30` }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Unggah & Analisis Citra</h3>
              <p className="text-gray-600 mb-4">Unggah citra fundus retina dengan mudah dan dapatkan hasil analisis dalam hitungan detik.</p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5 h-4 w-4 rounded-full bg-green-100 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  </div>
                  <span>Mendukung format JPEG, PNG, dan DICOM</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5 h-4 w-4 rounded-full bg-green-100 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  </div>
                  <span>Enkripsi data sesuai standar HIPAA</span>
                </li>
              </ul>
            </motion.div>

            <motion.div 
              className="bg-white p-8 rounded-2xl hover-scale relative overflow-hidden"
              style={{ boxShadow: theme.mediumShadow }}
              variants={fadeInUp}
              whileHover={{ y: -10, boxShadow: theme.largeShadow }}
            >
              {/* Animasi background subtle */}
              <motion.div 
                className="absolute top-0 right-0 w-40 h-40 rounded-full"
                style={{ background: `${theme.accent}10`, filter: 'blur(40px)' }}
                animate={{ 
                  scale: [1, 1.2, 1], 
                  opacity: [0.3, 0.5, 0.3] 
                }}
                transition={{ 
                  duration: 5, 
                  delay: 1,
                  repeat: Infinity,
                  repeatType: "reverse" 
                }}
              />
              
              <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-6"
                   style={{ background: `${theme.accent}20`, color: theme.accent }}>
                <CogIcon className="w-8 h-8" />
                <motion.div 
                  className="absolute inset-0 rounded-xl"
                  style={{ border: `2px solid ${theme.accent}30` }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, delay: 0.5, repeat: Infinity }}
                />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Klasifikasi Tingkat Keparahan</h3>
              <p className="text-gray-600 mb-4">Klasifikasi otomatis tingkat keparahan retinopati diabetik sesuai standar ICDR (0-4).</p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5 h-4 w-4 rounded-full bg-green-100 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  </div>
                  <span>Deteksi microaneurysm dan hemorrhage</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5 h-4 w-4 rounded-full bg-green-100 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  </div>
                  <span>Identifikasi neovaskularisasi</span>
                </li>
              </ul>
            </motion.div>

            <motion.div 
              className="bg-white p-8 rounded-2xl hover-scale relative overflow-hidden"
              style={{ boxShadow: theme.mediumShadow }}
              variants={fadeInUp}
              whileHover={{ y: -10, boxShadow: theme.largeShadow }}
            >
              {/* Animasi background subtle */}
              <motion.div 
                className="absolute top-0 right-0 w-40 h-40 rounded-full"
                style={{ background: `${theme.secondary}10`, filter: 'blur(40px)' }}
                animate={{ 
                  scale: [1, 1.2, 1], 
                  opacity: [0.3, 0.5, 0.3] 
                }}
                transition={{ 
                  duration: 5, 
                  delay: 2,
                  repeat: Infinity,
                  repeatType: "reverse" 
                }}
              />
              
              <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-6"
                   style={{ background: `${theme.secondary}20`, color: theme.secondary }}>
                <DocumentTextIcon className="w-8 h-8" />
                <motion.div 
                  className="absolute inset-0 rounded-xl"
                  style={{ border: `2px solid ${theme.secondary}30` }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, delay: 1, repeat: Infinity }}
                />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Laporan Medis Terstruktur</h3>
              <p className="text-gray-600 mb-4">Laporan terstruktur dengan visualisasi area yang terdeteksi untuk membantu diagnosis.</p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5 h-4 w-4 rounded-full bg-green-100 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  </div>
                  <span>Ekspor ke PDF dan integrasi EMR</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5 h-4 w-4 rounded-full bg-green-100 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  </div>
                  <span>Rekomendasi tindak lanjut</span>
                </li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            custom={0}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Keunggulan RetinaScan</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Platform kami telah membantu ribuan pasien untuk mendeteksi retinopati diabetik lebih awal
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div 
              className="text-center p-6 bg-white rounded-2xl shadow-sm"
              variants={fadeInUp}
              whileHover={{ y: -5 }}
            >
              <div className="text-4xl font-bold mb-2" style={{ color: theme.primary }}>98%</div>
              <p className="text-gray-600">Akurasi Deteksi</p>
            </motion.div>
            
            <motion.div 
              className="text-center p-6 bg-white rounded-2xl shadow-sm"
              variants={fadeInUp}
              whileHover={{ y: -5 }}
            >
              <div className="text-4xl font-bold mb-2" style={{ color: theme.primary }}>3 detik</div>
              <p className="text-gray-600">Waktu Analisis</p>
            </motion.div>
            
            <motion.div 
              className="text-center p-6 bg-white rounded-2xl shadow-sm"
              variants={fadeInUp}
              whileHover={{ y: -5 }}
            >
              <div className="text-4xl font-bold mb-2" style={{ color: theme.primary }}>10K+</div>
              <p className="text-gray-600">Pengguna Aktif</p>
            </motion.div>
            
            <motion.div 
              className="text-center p-6 bg-white rounded-2xl shadow-sm"
              variants={fadeInUp}
              whileHover={{ y: -5 }}
            >
              <div className="text-4xl font-bold mb-2" style={{ color: theme.primary }}>5</div>
              <p className="text-gray-600">Tingkat Klasifikasi</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="rounded-3xl overflow-hidden shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            style={{ 
              background: `linear-gradient(to right, ${theme.primary}, ${theme.accent})`,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}
          >
            <div className="relative px-6 py-16 md:p-16 text-center">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMiIgZD0iTTAgMGw2MDAgNjAwTTYwMCAwTDAgNjAwIiBmaWxsPSJub25lIiBvcGFjaXR5PSIuMSIvPjwvc3ZnPg==')] opacity-10" />
              
              <motion.h2 
                className="text-3xl md:text-4xl font-bold text-white mb-4"
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                viewport={{ once: true }}
              >
                Mulai Deteksi Retinopati Diabetik Sekarang
              </motion.h2>
              
              <motion.p 
                className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                viewport={{ once: true }}
              >
                {isAuthenticated 
                  ? "Akses dashboard untuk menggunakan platform deteksi retinopati diabetik berbasis AI" 
                  : "Daftar sekarang dan dapatkan akses ke platform deteksi retinopati diabetik berbasis AI"}
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                viewport={{ once: true }}
              >
                {isAuthenticated ? (
                  <a href={`${DASHBOARD_URL}?token=${token}`}>
                    <motion.button
                      className="px-8 py-4 bg-white text-blue-600 rounded-full font-bold shadow-lg hover:shadow-xl transition duration-300 text-lg"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Buka Dashboard
                    </motion.button>
                  </a>
                ) : (
                  <Link to="/register">
                    <motion.button
                      className="px-8 py-4 bg-white text-blue-600 rounded-full font-bold shadow-lg hover:shadow-xl transition duration-300 text-lg"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Daftar Gratis
                    </motion.button>
                  </Link>
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            custom={0}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Apa Kata Pengguna Kami</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              RetinaScan telah membantu banyak dokter dan pasien dalam mendeteksi retinopati diabetik
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            <motion.div 
              className="bg-white p-8 rounded-2xl"
              style={{ boxShadow: theme.mediumShadow }}
              variants={fadeInUp}
              whileHover={{ 
                scale: 1.03, 
                boxShadow: theme.largeShadow
              }}
            >
              <div className="flex items-center mb-6">
                <div className="h-12 w-12 rounded-full flex items-center justify-center text-xl font-bold"
                     style={{ background: `${theme.primary}20`, color: theme.primary }}>
                  DR
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Dr. Rini Pratiwi</h4>
                  <p className="text-gray-500 text-sm">Dokter Spesialis Mata</p>
                </div>
              </div>
              <p className="text-gray-600">
                "RetinaScan membantu saya mengidentifikasi kasus retinopati diabetik dengan cepat dan akurat. 
                Sangat membantu untuk screening pasien diabetes."
              </p>
            </motion.div>

            <motion.div 
              className="bg-white p-8 rounded-2xl"
              style={{ boxShadow: theme.mediumShadow }}
              variants={fadeInUp}
              whileHover={{ 
                scale: 1.03, 
                boxShadow: theme.largeShadow
              }}
            >
              <div className="flex items-center mb-6">
                <div className="h-12 w-12 rounded-full flex items-center justify-center text-xl font-bold"
                     style={{ background: `${theme.accent}20`, color: theme.accent }}>
                  BS
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Budi Santoso</h4>
                  <p className="text-gray-500 text-sm">Pasien Diabetes</p>
                </div>
              </div>
              <p className="text-gray-600">
                "Berkat pemeriksaan rutin dengan RetinaScan, saya bisa mendeteksi masalah retina 
                sejak dini dan mendapatkan perawatan tepat waktu."
              </p>
            </motion.div>

            <motion.div 
              className="bg-white p-8 rounded-2xl"
              style={{ boxShadow: theme.mediumShadow }}
              variants={fadeInUp}
              whileHover={{ 
                scale: 1.03, 
                boxShadow: theme.largeShadow
              }}
            >
              <div className="flex items-center mb-6">
                <div className="h-12 w-12 rounded-full flex items-center justify-center text-xl font-bold"
                     style={{ background: `${theme.secondary}20`, color: theme.secondary }}>
                  SK
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Siti Kurniawati</h4>
                  <p className="text-gray-500 text-sm">Perawat RS Medika</p>
                </div>
              </div>
              <p className="text-gray-600">
                "Sangat mudah digunakan dan memberikan hasil yang akurat. Kami menggunakan 
                RetinaScan untuk screening pasien diabetes di rumah sakit kami."
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;