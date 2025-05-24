import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useState, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
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
  CheckCircleIcon,
  SparklesIcon,
  LightBulbIcon,
  HeartIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import { withPageTransition } from '../context/ThemeContext';
import { newTheme, enhancedAnimations, lottieConfig } from '../utils/newTheme';
import LottieAnimation from '../components/LottieAnimation';
import ParticlesBackground from '../components/ParticlesBackground';
import AnimatedButton from '../components/AnimatedButton';
import ScrollReveal from '../components/ScrollReveal';

const LandingPage = () => {
  const { theme, animations } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState('');
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef(null);
  
  // Environment variables
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const DASHBOARD_URL = import.meta.env.VITE_DASHBOARD_URL || 'http://localhost:3000';
  
  // Scroll animation values
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 50]);
  
  // Intersection Observer untuk animasi scroll
  const [featuresRef, featuresInView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  
  const [statsRef, statsInView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  
  const [ctaRef, ctaInView] = useInView({
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
  
  // Effect untuk mendeteksi scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Scroll ke section
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // Animasi untuk container dengan stagger children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };
  
  // Animasi untuk items dalam container
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 15,
        stiffness: 100
      }
    }
  };
  
  // Data fitur
  const features = [
    {
      title: 'Deteksi Cepat & Akurat',
      description: 'Analisis gambar retina dalam hitungan detik dengan akurasi tinggi menggunakan AI canggih.',
      icon: <BoltIcon className="h-8 w-8" />,
      color: 'from-blue-500 to-indigo-600',
      animation: 'fade-up'
    },
    {
      title: 'Keamanan Data Terjamin',
      description: 'Data medis Anda dienkripsi dan dilindungi dengan standar keamanan tertinggi.',
      icon: <ShieldCheckIcon className="h-8 w-8" />,
      color: 'from-emerald-500 to-teal-600',
      animation: 'fade-up'
    },
    {
      title: 'Laporan Komprehensif',
      description: 'Dapatkan laporan detail dengan visualisasi dan rekomendasi tindak lanjut.',
      icon: <DocumentTextIcon className="h-8 w-8" />,
      color: 'from-amber-500 to-orange-600',
      animation: 'fade-up'
    },
    {
      title: 'Terintegrasi dengan EMR',
      description: 'Mudah diintegrasikan dengan sistem rekam medis elektronik yang sudah ada.',
      icon: <CogIcon className="h-8 w-8" />,
      color: 'from-purple-500 to-pink-600',
      animation: 'fade-up'
    },
    {
      title: 'Analisis Statistik',
      description: 'Pantau tren dan perkembangan kesehatan retina pasien dari waktu ke waktu.',
      icon: <ChartBarIcon className="h-8 w-8" />,
      color: 'from-red-500 to-rose-600',
      animation: 'fade-up'
    },
    {
      title: 'Pembelajaran Berkelanjutan',
      description: 'Sistem AI yang terus belajar dan meningkatkan akurasi dari waktu ke waktu.',
      icon: <AcademicCapIcon className="h-8 w-8" />,
      color: 'from-cyan-500 to-blue-600',
      animation: 'fade-up'
    }
  ];
  
  // Data statistik
  const stats = [
    { value: '98%', label: 'Akurasi Deteksi', animation: 'fade-up', delay: 0 },
    { value: '2.5 detik', label: 'Waktu Analisis', animation: 'fade-up', delay: 0.1 },
    { value: '10,000+', label: 'Pasien Terlayani', animation: 'fade-up', delay: 0.2 },
    { value: '50+', label: 'Rumah Sakit Mitra', animation: 'fade-up', delay: 0.3 }
  ];

  return (
    <div className="overflow-x-hidden">
      {/* Background Particles - Dioptimalkan untuk performa */}
      <ParticlesBackground 
        color="rgba(79, 70, 229, 0.15)" 
        count={25} 
        speed={0.2} 
        type="wave" 
        interactive={false}
      />
      
      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        style={{ 
          opacity: heroOpacity,
          scale: heroScale,
          y: heroY
        }}
        className="relative min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 pt-16 pb-24 overflow-hidden"
      >
        {/* Simplified Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute top-1/4 left-0 w-72 h-72 bg-gradient-to-r from-blue-400/40 to-indigo-500/40 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
            animate={{ 
              scale: [1, 1.1, 1],
              x: [0, 10, 0],
              y: [0, -10, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 20,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute top-1/3 right-0 w-96 h-96 bg-gradient-to-r from-purple-400/40 to-pink-500/40 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
            animate={{ 
              scale: [1, 1.05, 1],
              x: [0, -15, 0],
              y: [0, 15, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 25,
              ease: "easeInOut",
              delay: 1
            }}
          />
        </div>
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Hero Content - Left Side */}
            <motion.div
              className="lg:col-span-6 text-center lg:text-left"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative mb-6">
                <motion.div
                  className="absolute -top-6 -left-6 w-20 h-20 text-indigo-600 dark:text-indigo-400 opacity-20"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 0.2, scale: 1, rotate: 15 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  <SparklesIcon className="w-full h-full" />
                </motion.div>
                
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                    Deteksi Dini
                  </span>
                  <br />
                  <span className="text-gray-900 dark:text-white">
                    Retinopati Diabetik
                  </span>
                  <br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
                    dengan AI
                  </span>
              </h1>
              </div>
              
              <motion.p 
                className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                Teknologi AI canggih untuk mendeteksi penyakit retina dengan cepat dan akurat. 
                <span className="font-semibold text-indigo-600 dark:text-indigo-400"> Lindungi penglihatan Anda</span> dengan diagnosis dini.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
              {isAuthenticated ? (
                  <Link to={`${DASHBOARD_URL}?token=${token}`}>
                    <AnimatedButton variant="primary" size="lg">
                      <span className="flex items-center">
                        Buka Dashboard
                        <ArrowRightIcon className="ml-2 h-5 w-5" />
                      </span>
                    </AnimatedButton>
                  </Link>
              ) : (
                <>
                  <Link to="/register">
                      <AnimatedButton variant="primary" size="lg">
                        <span className="flex items-center">
                      Mulai Sekarang
                          <ArrowRightIcon className="ml-2 h-5 w-5" />
                        </span>
                      </AnimatedButton>
                  </Link>
                  <Link to="/login">
                      <AnimatedButton variant="outline" size="lg">
                      Login
                      </AnimatedButton>
                  </Link>
                </>
              )}
              </motion.div>
              
              {/* Trust badges */}
              <motion.div
                className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <div className="flex items-center bg-white dark:bg-gray-800 px-3 py-1 rounded-full shadow-sm">
                  <CheckCircleIcon className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">98% Akurasi</span>
                </div>
                <div className="flex items-center bg-white dark:bg-gray-800 px-3 py-1 rounded-full shadow-sm">
                  <CheckCircleIcon className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Hasil Instan</span>
                </div>
                <div className="flex items-center bg-white dark:bg-gray-800 px-3 py-1 rounded-full shadow-sm">
                  <CheckCircleIcon className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Direkomendasikan Dokter</span>
              </div>
              </motion.div>
            </motion.div>
            
            {/* Hero Animation - Right Side */}
            <motion.div
              className="lg:col-span-6 relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Simplified decorative ring around animation */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.div 
                  className="w-[110%] h-[110%] rounded-full border-2 border-indigo-200 dark:border-indigo-900 opacity-30"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                />
              </div>
              
              {/* Main animation with glassmorphism effect */}
              <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] backdrop-blur-sm bg-white/10 dark:bg-gray-900/10 rounded-2xl p-1">
                <div className="w-full h-full rounded-xl overflow-hidden backdrop-blur-md bg-white/30 dark:bg-gray-800/30 shadow-xl">
              <LottieAnimation
                    animationData={lottieConfig.animations.eyeScan}
                loop={true}
              />
                </div>
                
                {/* Floating badges */}
                <motion.div 
                  className="absolute -top-4 -right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 flex items-center"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                >
                  <EyeIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2" />
                  <span className="font-medium text-gray-900 dark:text-white">AI Scan</span>
                </motion.div>
                
                <motion.div 
                  className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 flex items-center"
                  animate={{ y: [0, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 1 }}
                >
                  <LightBulbIcon className="h-6 w-6 text-amber-500 mr-2" />
                  <span className="font-medium text-gray-900 dark:text-white">Smart Diagnosis</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Enhanced Scroll Down Indicator */}
          <motion.div 
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            onClick={scrollToFeatures}
          whileHover={{ scale: 1.1 }}
          >
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="flex flex-col items-center"
            >
            <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-2">Jelajahi Fitur</span>
            <div className="bg-white dark:bg-gray-800 rounded-full p-2 shadow-md">
              <ArrowDownIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
          </motion.div>
        </motion.div>
      </motion.section>
      
      {/* Features Section */}
      <section 
        id="features" 
        ref={featuresRef}
        className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-indigo-50 dark:from-gray-900 dark:to-indigo-950 relative overflow-hidden"
      >
        {/* Optimized background particles */}
        <ParticlesBackground 
          color="rgba(79, 70, 229, 0.1)" 
          count={20} 
          speed={0.2} 
          type="default" 
          connected={true}
          interactive={false}
        />
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              Fitur Unggulan
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              RetinaScan menghadirkan teknologi AI terdepan untuk mendeteksi retinopati diabetik dengan cepat, akurat, dan terjangkau.
            </motion.p>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
          >
            {features.map((feature, index) => (
              <ScrollReveal 
                key={index} 
                animation={feature.animation}
                delay={index * 0.1}
              >
                <motion.div
                  whileHover={{ y: -5, boxShadow: newTheme.shadows.xl }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 h-full flex flex-col"
                >
                  <div className={`mb-6 p-4 rounded-xl bg-gradient-to-br ${feature.color} w-16 h-16 flex items-center justify-center text-white`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 flex-grow">
                    {feature.description}
                  </p>
                </motion.div>
              </ScrollReveal>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 relative overflow-hidden">
        {/* Optimized background particles */}
        <ParticlesBackground 
          color="rgba(79, 70, 229, 0.05)" 
          count={15} 
          speed={0.15} 
          type="wave" 
          connected={false}
          interactive={false}
        />
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              Cara Kerja
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              Proses deteksi retinopati diabetik yang cepat, mudah, dan akurat dalam tiga langkah sederhana.
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <ScrollReveal animation="fade-right" delay={0.1}>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 h-full flex flex-col relative">
                <div className="absolute -top-5 -left-5 w-12 h-12 bg-indigo-600 dark:bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  1
                </div>
                <div className="mb-6 p-4 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 w-16 h-16 flex items-center justify-center">
                  <EyeIcon className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                  Unggah Gambar Retina
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Unggah gambar fundus retina dari kamera fundus atau perangkat pencitraan retina lainnya.
                </p>
              </div>
            </ScrollReveal>
            
            {/* Connector Line */}
            <div className="hidden md:block absolute left-1/3 top-1/2 w-1/3 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 transform -translate-y-1/2"></div>
            
            {/* Step 2 */}
            <ScrollReveal animation="fade-up" delay={0.2}>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 h-full flex flex-col relative md:mt-12">
                <div className="absolute -top-5 -left-5 w-12 h-12 bg-purple-600 dark:bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  2
                </div>
                <div className="mb-6 p-4 rounded-xl bg-purple-100 dark:bg-purple-900/30 w-16 h-16 flex items-center justify-center">
                  <BeakerIcon className="h-10 w-10 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                  Analisis AI
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Sistem AI kami menganalisis gambar dan mendeteksi tanda-tanda retinopati diabetik dalam hitungan detik.
                </p>
              </div>
            </ScrollReveal>
            
            {/* Connector Line */}
            <div className="hidden md:block absolute right-1/3 top-1/2 w-1/3 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 transform -translate-y-1/2"></div>
            
            {/* Step 3 */}
            <ScrollReveal animation="fade-left" delay={0.3}>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 h-full flex flex-col relative">
                <div className="absolute -top-5 -left-5 w-12 h-12 bg-pink-600 dark:bg-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  3
                </div>
                <div className="mb-6 p-4 rounded-xl bg-pink-100 dark:bg-pink-900/30 w-16 h-16 flex items-center justify-center">
                  <DocumentTextIcon className="h-10 w-10 text-pink-600 dark:text-pink-400" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                  Hasil & Rekomendasi
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Dapatkan laporan detail dengan visualisasi dan rekomendasi tindak lanjut yang dapat dibagikan dengan dokter Anda.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section 
        ref={statsRef}
        className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-indigo-50 to-white dark:from-indigo-950 dark:to-gray-900 relative overflow-hidden"
      >
        {/* Optimized background particles */}
        <ParticlesBackground 
          color="rgba(79, 70, 229, 0.08)" 
          count={15} 
          speed={0.15} 
          type="pulse" 
          connected={false}
          interactive={false}
        />
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <ScrollReveal 
                key={index} 
                animation={stat.animation}
                delay={stat.delay}
              >
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={statsInView ? { scale: 1 } : {}}
                    transition={{ 
                      type: "spring", 
                      stiffness: 100, 
                      delay: index * 0.1 + 0.2,
                      duration: 0.6
                    }}
                    className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent"
                  >
                    {stat.value}
                  </motion.div>
                  <p className="text-lg text-gray-700 dark:text-gray-300">
                    {stat.label}
                  </p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 relative overflow-hidden">
        {/* Optimized background particles */}
        <ParticlesBackground 
          color="rgba(79, 70, 229, 0.05)" 
          count={10} 
          speed={0.1} 
          type="default" 
          connected={false}
          interactive={false}
        />
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              Testimoni
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              Apa kata para profesional medis tentang RetinaScan
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <ScrollReveal animation="fade-up" delay={0.1}>
              <motion.div
                whileHover={{ y: -5, boxShadow: newTheme.shadows.xl }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 h-full flex flex-col"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                    <UserGroupIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Dr. Siti Rahmah</h3>
                    <p className="text-gray-600 dark:text-gray-400">Dokter Spesialis Mata</p>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 italic">
                  "RetinaScan membantu praktik saya menjadi lebih efisien. Saya dapat mendeteksi kasus retinopati diabetik lebih awal dan memberikan perawatan yang tepat waktu kepada pasien saya."
                </p>
                <div className="flex mt-4">
                  <StarIcon className="h-5 w-5 text-amber-500" />
                  <StarIcon className="h-5 w-5 text-amber-500" />
                  <StarIcon className="h-5 w-5 text-amber-500" />
                  <StarIcon className="h-5 w-5 text-amber-500" />
                  <StarIcon className="h-5 w-5 text-amber-500" />
                </div>
              </motion.div>
            </ScrollReveal>
            
            {/* Testimonial 2 */}
            <ScrollReveal animation="fade-up" delay={0.2}>
              <motion.div
                whileHover={{ y: -5, boxShadow: newTheme.shadows.xl }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 h-full flex flex-col"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <UserGroupIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Dr. Budi Santoso</h3>
                    <p className="text-gray-600 dark:text-gray-400">Endokrinologi</p>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 italic">
                  "Sebagai dokter endokrinologi, saya sangat terkesan dengan integrasi RetinaScan dengan sistem EMR kami. Ini memungkinkan saya untuk memantau komplikasi retina pada pasien diabetes dengan lebih baik."
                </p>
                <div className="flex mt-4">
                  <StarIcon className="h-5 w-5 text-amber-500" />
                  <StarIcon className="h-5 w-5 text-amber-500" />
                  <StarIcon className="h-5 w-5 text-amber-500" />
                  <StarIcon className="h-5 w-5 text-amber-500" />
                  <StarIcon className="h-5 w-5 text-amber-500" />
                </div>
              </motion.div>
            </ScrollReveal>
            
            {/* Testimonial 3 */}
            <ScrollReveal animation="fade-up" delay={0.3}>
              <motion.div
                whileHover={{ y: -5, boxShadow: newTheme.shadows.xl }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 h-full flex flex-col"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                    <UserGroupIcon className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Ani Wijaya</h3>
                    <p className="text-gray-600 dark:text-gray-400">Manajer RS Sehat Sentosa</p>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 italic">
                  "Implementasi RetinaScan di rumah sakit kami telah meningkatkan efisiensi skrining retinopati diabetik hingga 70%. Pasien kami sangat menghargai hasil yang cepat dan akurat."
                </p>
                <div className="flex mt-4">
                  <StarIcon className="h-5 w-5 text-amber-500" />
                  <StarIcon className="h-5 w-5 text-amber-500" />
                  <StarIcon className="h-5 w-5 text-amber-500" />
                  <StarIcon className="h-5 w-5 text-amber-500" />
                  <StarIcon className="h-5 w-5 text-amber-500" />
                </div>
              </motion.div>
            </ScrollReveal>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section 
        ref={ctaRef}
        className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-600 to-purple-700 dark:from-indigo-800 dark:to-purple-900 relative overflow-hidden"
      >
        {/* Optimized background particles */}
        <ParticlesBackground 
          color="rgba(255, 255, 255, 0.1)" 
          count={20} 
          speed={0.2} 
          type="pulse" 
          connected={true}
          interactive={false}
        />
        
        <div className="container mx-auto max-w-5xl relative z-10">
          <motion.div 
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-xl border border-white/20"
            initial={{ opacity: 0, y: 30 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                Mulai Deteksi Retinopati Diabetik Hari Ini
              </h2>
              <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
                Bergabunglah dengan ribuan profesional kesehatan yang telah menggunakan RetinaScan untuk diagnosis yang lebih cepat dan akurat.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link to={`${DASHBOARD_URL}?token=${token}`}>
                  <AnimatedButton variant="white" size="lg">
                    <span className="flex items-center">
                      Buka Dashboard
                      <ArrowRightIcon className="ml-2 h-5 w-5" />
                    </span>
                  </AnimatedButton>
                </Link>
              ) : (
                <>
                  <Link to="/register">
                    <AnimatedButton variant="white" size="lg">
                      <span className="flex items-center">
                        Daftar Sekarang
                        <ArrowRightIcon className="ml-2 h-5 w-5" />
                      </span>
                    </AnimatedButton>
                  </Link>
                  <Link to="/login">
                    <AnimatedButton variant="outline-white" size="lg">
                      Login
                    </AnimatedButton>
                  </Link>
                </>
              )}
            </div>
            
            <div className="mt-8 flex flex-wrap gap-4 justify-center items-center">
              <div className="flex items-center bg-white/20 backdrop-blur-md px-4 py-2 rounded-full">
                <CheckCircleIcon className="h-5 w-5 text-white mr-2" />
                <span className="text-white">Mulai dalam 5 menit</span>
              </div>
              <div className="flex items-center bg-white/20 backdrop-blur-md px-4 py-2 rounded-full">
                <CheckCircleIcon className="h-5 w-5 text-white mr-2" />
                <span className="text-white">Dukungan 24/7</span>
              </div>
              <div className="flex items-center bg-white/20 backdrop-blur-md px-4 py-2 rounded-full">
                <CheckCircleIcon className="h-5 w-5 text-white mr-2" />
                <span className="text-white">Uji coba gratis 14 hari</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default withPageTransition(LandingPage);