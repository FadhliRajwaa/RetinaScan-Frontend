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
  AcademicCapIcon,
  HeartIcon,
  PresentationChartLineIcon
} from '@heroicons/react/24/outline';

function LandingPage() {
  const { theme, animations } = useTheme();
  const [animateParticles, setAnimateParticles] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  
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

  // Enhanced animations
  const pulseAnimation = {
    scale: [1, 1.05, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    }
  };

  return (
    <div className="pt-16">
      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        {/* Dynamic medical-themed background */}
        <div className="absolute inset-0 opacity-90 z-0">
          <div className="absolute inset-0" style={{
            background: `radial-gradient(circle at 30% 30%, ${theme.primary}, transparent),
                        radial-gradient(circle at 70% 70%, ${theme.accent}, transparent),
                        linear-gradient(135deg, ${theme.secondary}, ${theme.primary})`,
            backgroundSize: '400% 400%',
            animation: 'gradientAnimation 15s ease infinite'
          }} />
          
          {/* Medical-themed animated particles */}
          <div className="absolute inset-0 overflow-hidden">
            {animateParticles && Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  width: Math.random() * 15 + 5,
                  height: Math.random() * 15 + 5,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  background: `rgba(255,255,255,${Math.random() * 0.3 + 0.1})`,
                  borderRadius: Math.random() > 0.5 ? '50%' : '30%',
                  filter: 'blur(1px)'
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                  rotate: [0, 180, 360],
                  y: [0, -30, 0]
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                  delay: Math.random() * 2
                }}
              />
            ))}
          </div>

          {/* Animated medical symbols */}
          <div className="absolute inset-0">
            <motion.div
              className="absolute top-1/4 left-1/4 text-white opacity-20"
              animate={floatingAnimation}
            >
              <HeartIcon className="w-16 h-16" />
            </motion.div>
            <motion.div
              className="absolute top-1/3 right-1/4 text-white opacity-20"
              animate={floatingAnimation}
              transition={{ delay: 1 }}
            >
              <EyeIcon className="w-20 h-20" />
            </motion.div>
            <motion.div
              className="absolute bottom-1/4 left-1/3 text-white opacity-20"
              animate={floatingAnimation}
              transition={{ delay: 1.5 }}
            >
              <PresentationChartLineIcon className="w-16 h-16" />
            </motion.div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10">
          <div className="text-center">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6 text-white text-shadow-lg"
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
              className="text-lg md:text-xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Platform berbasis AI yang dirancang khusus untuk tim medis dalam mendeteksi dan 
              mengklasifikasikan tingkat keparahan retinopati diabetik. Dengan akurasi mencapai 98% 
              dan waktu analisis kurang dari 3 detik, RetinaScan membantu Anda memberikan diagnosis 
              yang lebih cepat dan akurat.
            </motion.p>

            {/* Enhanced Medical Info Card */}
            <motion.div
              className="mb-10 p-8 rounded-xl mx-auto max-w-4xl backdrop-blur-md"
              style={{ 
                background: 'rgba(255,255,255,0.1)',
                boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <motion.h3 
                className="text-2xl font-semibold mb-4 text-white"
                animate={pulseAnimation}
              >
                Dirancang untuk Tim Medis
              </motion.h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-blue-50">
                <div className="space-y-4">
                  <motion.div 
                    className="flex items-start space-x-3"
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <ClockIcon className="w-5 h-5 text-blue-300" />
                    </div>
                    <div>
                      <h4 className="font-medium">Analisis Cepat</h4>
                      <p className="text-sm text-blue-200">Hasil dalam 3 detik dengan akurasi tinggi</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-start space-x-3"
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <BeakerIcon className="w-5 h-5 text-blue-300" />
                    </div>
                    <div>
                      <h4 className="font-medium">Klasifikasi ICDR</h4>
                      <p className="text-sm text-blue-200">Mengikuti standar International Clinical Diabetic Retinopathy</p>
                    </div>
                  </motion.div>
                </div>
                
                <div className="space-y-4">
                  <motion.div 
                    className="flex items-start space-x-3"
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <DocumentTextIcon className="w-5 h-5 text-blue-300" />
                    </div>
                    <div>
                      <h4 className="font-medium">Laporan Terstruktur</h4>
                      <p className="text-sm text-blue-200">Dokumentasi lengkap dengan visualisasi area terdeteksi</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-start space-x-3"
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <AcademicCapIcon className="w-5 h-5 text-blue-300" />
                    </div>
                    <div>
                      <h4 className="font-medium">Berbasis Penelitian</h4>
                      <p className="text-sm text-blue-200">Dikembangkan berdasarkan dataset medis tervalidasi</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Enhanced CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row justify-center gap-4 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              <Link to="/register">
                <motion.button
                  className="px-8 py-4 rounded-full text-white font-bold shadow-lg hover:shadow-xl transition duration-300 flex items-center justify-center w-full sm:w-auto"
                  style={{
                    background: `linear-gradient(to right, ${theme.accent}, ${theme.primary})`,
                    boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.5)'
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 15px 30px -5px rgba(59, 130, 246, 0.7)"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Mulai Sekarang</span>
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </motion.button>
              </Link>
              <Link to="/login">
                <motion.button
                  className="px-8 py-4 rounded-full text-white font-bold transition duration-300 flex items-center justify-center w-full sm:w-auto backdrop-blur-md"
                  style={{ 
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    background: 'rgba(255,255,255,0.2)'
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  Login
                </motion.button>
              </Link>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="flex justify-center"
            >
              <motion.div 
                className="cursor-pointer"
                animate={{
                  y: [0, 10, 0],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <ArrowDownIcon className="h-8 w-8 text-white opacity-80" />
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Enhanced wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
            <motion.path 
              fill="#ffffff"
              fillOpacity="1" 
              initial={{ d: "M0,320L1440,320" }}
              animate={{ 
                d: "M0,256L48,234.7C96,213,192,171,288,154.7C384,139,480,149,576,165.3C672,181,768,203,864,197.3C960,192,1056,160,1152,154.7C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              }}
              transition={{
                duration: 1,
                ease: "easeInOut"
              }}
            />
          </svg>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Subtle background patterns */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '30px 30px'
          }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
            custom={0}
          >
            <motion.div
              className="inline-block mb-4"
              animate={{
                rotate: [0, 5, -5, 0],
                transition: {
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }
              }}
            >
              <EyeIcon className="w-16 h-16 text-blue-600" />
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Fitur Unggulan untuk Tim Medis
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              RetinaScan menyediakan solusi komprehensif untuk deteksi dan klasifikasi 
              retinopati diabetik dengan fitur-fitur yang dirancang khusus untuk tenaga medis.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {/* Feature Card 1: Unggah & Analisis */}
            <motion.div 
              className="bg-white p-8 rounded-2xl hover-scale relative overflow-hidden"
              style={{ boxShadow: theme.mediumShadow }}
              variants={fadeInUp}
              whileHover={{ 
                y: -10,
                boxShadow: theme.largeShadow,
                transition: { duration: 0.3 }
              }}
            >
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full" style={{
                background: `radial-gradient(circle at center, ${theme.primary}20, transparent)`,
                filter: 'blur(40px)'
              }} />
              
              <motion.div 
                className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 relative"
                style={{ background: `${theme.primary}20` }}
                whileHover={{ scale: 1.1 }}
              >
                <EyeIcon className="w-8 h-8 text-blue-600" />
                <motion.div 
                  className="absolute inset-0 rounded-xl"
                  style={{ border: `2px solid ${theme.primary}30` }}
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.5, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>

              <h3 className="text-xl font-semibold mb-4 text-gray-900">
                Unggah & Analisis Citra
              </h3>
              <p className="text-gray-600 mb-6">
                Unggah citra fundus retina dan dapatkan hasil analisis dalam hitungan detik. 
                Mendukung berbagai format gambar medis.
              </p>

              <ul className="space-y-3">
                <motion.li 
                  className="flex items-center space-x-3"
                  whileHover={{ x: 5 }}
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                  </div>
                  <span className="text-gray-600">Format JPEG, PNG, DICOM</span>
                </motion.li>
                <motion.li 
                  className="flex items-center space-x-3"
                  whileHover={{ x: 5 }}
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                  </div>
                  <span className="text-gray-600">Enkripsi data HIPAA</span>
                </motion.li>
                <motion.li 
                  className="flex items-center space-x-3"
                  whileHover={{ x: 5 }}
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                  </div>
                  <span className="text-gray-600">Hasil dalam 3 detik</span>
                </motion.li>
              </ul>
            </motion.div>

            {/* Feature Card 2: Klasifikasi */}
            <motion.div 
              className="bg-white p-8 rounded-2xl hover-scale relative overflow-hidden"
              style={{ boxShadow: theme.mediumShadow }}
              variants={fadeInUp}
              whileHover={{ 
                y: -10,
                boxShadow: theme.largeShadow,
                transition: { duration: 0.3 }
              }}
            >
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full" style={{
                background: `radial-gradient(circle at center, ${theme.accent}20, transparent)`,
                filter: 'blur(40px)'
              }} />
              
              <motion.div 
                className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 relative"
                style={{ background: `${theme.accent}20` }}
                whileHover={{ scale: 1.1 }}
              >
                <ChartBarIcon className="w-8 h-8 text-blue-600" />
                <motion.div 
                  className="absolute inset-0 rounded-xl"
                  style={{ border: `2px solid ${theme.accent}30` }}
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.5, 1]
                  }}
                  transition={{ duration: 2, delay: 0.5, repeat: Infinity }}
                />
              </motion.div>

              <h3 className="text-xl font-semibold mb-4 text-gray-900">
                Klasifikasi Tingkat Keparahan
              </h3>
              <p className="text-gray-600 mb-6">
                Klasifikasi otomatis tingkat keparahan retinopati diabetik sesuai standar ICDR 
                dengan akurasi tinggi.
              </p>

              <ul className="space-y-3">
                <motion.li 
                  className="flex items-center space-x-3"
                  whileHover={{ x: 5 }}
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                  </div>
                  <span className="text-gray-600">5 tingkat klasifikasi ICDR</span>
                </motion.li>
                <motion.li 
                  className="flex items-center space-x-3"
                  whileHover={{ x: 5 }}
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                  </div>
                  <span className="text-gray-600">Akurasi 98%</span>
                </motion.li>
                <motion.li 
                  className="flex items-center space-x-3"
                  whileHover={{ x: 5 }}
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                  </div>
                  <span className="text-gray-600">Validasi oleh ahli</span>
                </motion.li>
              </ul>
            </motion.div>

            {/* Feature Card 3: Laporan */}
            <motion.div 
              className="bg-white p-8 rounded-2xl hover-scale relative overflow-hidden"
              style={{ boxShadow: theme.mediumShadow }}
              variants={fadeInUp}
              whileHover={{ 
                y: -10,
                boxShadow: theme.largeShadow,
                transition: { duration: 0.3 }
              }}
            >
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full" style={{
                background: `radial-gradient(circle at center, ${theme.secondary}20, transparent)`,
                filter: 'blur(40px)'
              }} />
              
              <motion.div 
                className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 relative"
                style={{ background: `${theme.secondary}20` }}
                whileHover={{ scale: 1.1 }}
              >
                <DocumentTextIcon className="w-8 h-8 text-blue-600" />
                <motion.div 
                  className="absolute inset-0 rounded-xl"
                  style={{ border: `2px solid ${theme.secondary}30` }}
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.5, 1]
                  }}
                  transition={{ duration: 2, delay: 1, repeat: Infinity }}
                />
              </motion.div>

              <h3 className="text-xl font-semibold mb-4 text-gray-900">
                Laporan Medis Terstruktur
              </h3>
              <p className="text-gray-600 mb-6">
                Laporan komprehensif dengan visualisasi area yang terdeteksi untuk 
                mendukung diagnosis yang akurat.
              </p>

              <ul className="space-y-3">
                <motion.li 
                  className="flex items-center space-x-3"
                  whileHover={{ x: 5 }}
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                  </div>
                  <span className="text-gray-600">Visualisasi area terdeteksi</span>
                </motion.li>
                <motion.li 
                  className="flex items-center space-x-3"
                  whileHover={{ x: 5 }}
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                  </div>
                  <span className="text-gray-600">Rekomendasi tindak lanjut</span>
                </motion.li>
                <motion.li 
                  className="flex items-center space-x-3"
                  whileHover={{ x: 5 }}
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                  </div>
                  <span className="text-gray-600">Export PDF & DICOM</span>
                </motion.li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Statistics Section */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-gray-100 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute h-40 w-40 rounded-full"
            style={{
              background: `radial-gradient(circle at center, ${theme.primary}10, transparent)`,
              top: '20%',
              left: '10%'
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          <motion.div
            className="absolute h-60 w-60 rounded-full"
            style={{
              background: `radial-gradient(circle at center, ${theme.accent}10, transparent)`,
              bottom: '10%',
              right: '15%'
            }}
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.4, 0.2, 0.4]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            custom={0}
          >
            <motion.div
              className="inline-block mb-4"
              animate={{
                rotate: [0, 10, -10, 0],
                transition: {
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }
              }}
            >
              <ChartBarIcon className="w-16 h-16 text-blue-600" />
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Keunggulan RetinaScan
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Platform kami telah membantu ribuan tenaga medis dalam mendeteksi 
              retinopati diabetik lebih awal dan akurat
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Stat Card 1 */}
            <motion.div 
              className="text-center p-8 bg-white rounded-2xl relative overflow-hidden"
              variants={fadeInUp}
              whileHover={{ 
                y: -5,
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)'
              }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent"
                animate={{
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
              <motion.div 
                className="text-4xl font-bold mb-2 relative"
                style={{ color: theme.primary }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                98%
              </motion.div>
              <p className="text-gray-600 relative">Akurasi Deteksi</p>
            </motion.div>
            
            {/* Stat Card 2 */}
            <motion.div 
              className="text-center p-8 bg-white rounded-2xl relative overflow-hidden"
              variants={fadeInUp}
              whileHover={{ 
                y: -5,
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)'
              }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent"
                animate={{
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                  duration: 3,
                  delay: 0.5,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
              <motion.div 
                className="text-4xl font-bold mb-2 relative"
                style={{ color: theme.primary }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{
                  duration: 2,
                  delay: 0.5,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                3 detik
              </motion.div>
              <p className="text-gray-600 relative">Waktu Analisis</p>
            </motion.div>
            
            {/* Stat Card 3 */}
            <motion.div 
              className="text-center p-8 bg-white rounded-2xl relative overflow-hidden"
              variants={fadeInUp}
              whileHover={{ 
                y: -5,
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)'
              }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent"
                animate={{
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                  duration: 3,
                  delay: 1,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
              <motion.div 
                className="text-4xl font-bold mb-2 relative"
                style={{ color: theme.primary }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{
                  duration: 2,
                  delay: 1,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                10K+
              </motion.div>
              <p className="text-gray-600 relative">Pengguna Aktif</p>
            </motion.div>
            
            {/* Stat Card 4 */}
            <motion.div 
              className="text-center p-8 bg-white rounded-2xl relative overflow-hidden"
              variants={fadeInUp}
              whileHover={{ 
                y: -5,
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)'
              }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent"
                animate={{
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                  duration: 3,
                  delay: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
              <motion.div 
                className="text-4xl font-bold mb-2 relative"
                style={{ color: theme.primary }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{
                  duration: 2,
                  delay: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                5
              </motion.div>
              <p className="text-gray-600 relative">Tingkat Klasifikasi</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="rounded-3xl overflow-hidden shadow-2xl relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Animated gradient background */}
            <motion.div 
              className="absolute inset-0"
              style={{
                background: `linear-gradient(120deg, ${theme.primary}, ${theme.accent})`,
                opacity: 0.9
              }}
              animate={{
                background: [
                  `linear-gradient(120deg, ${theme.primary}, ${theme.accent})`,
                  `linear-gradient(240deg, ${theme.primary}, ${theme.accent})`,
                  `linear-gradient(360deg, ${theme.primary}, ${theme.accent})`
                ]
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />

            {/* Animated particles */}
            <div className="absolute inset-0 overflow-hidden">
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-white"
                  style={{
                    width: Math.random() * 4 + 2,
                    height: Math.random() * 4 + 2,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -30, 0],
                    opacity: [0, 0.5, 0],
                    scale: [1, 1.5, 1]
                  }}
                  transition={{
                    duration: Math.random() * 2 + 3,
                    repeat: Infinity,
                    repeatType: "loop",
                    delay: Math.random() * 2
                  }}
                />
              ))}
            </div>

            <div className="relative px-6 py-16 md:p-16 text-center">
              <motion.h2 
                className="text-3xl md:text-4xl font-bold text-white mb-6"
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
                Bergabung dengan ribuan tenaga medis yang telah menggunakan RetinaScan 
                untuk meningkatkan akurasi diagnosis retinopati diabetik
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                viewport={{ once: true }}
                className="flex flex-col sm:flex-row justify-center gap-4"
              >
                <Link to="/register">
                  <motion.button
                    className="px-8 py-4 bg-white text-blue-600 rounded-full font-bold shadow-lg hover:shadow-xl transition duration-300 text-lg flex items-center justify-center"
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>Daftar Gratis</span>
                    <ArrowRightIcon className="w-5 h-5 ml-2" />
                  </motion.button>
                </Link>
                <Link to="/login">
                  <motion.button
                    className="px-8 py-4 text-white rounded-full font-bold transition duration-300 text-lg flex items-center justify-center backdrop-blur-md"
                    style={{
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.2)'
                    }}
                    whileHover={{ 
                      scale: 1.05,
                      background: 'rgba(255,255,255,0.2)'
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>Login</span>
                  </motion.button>
                </Link>
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