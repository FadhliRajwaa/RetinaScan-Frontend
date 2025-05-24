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
  HeartIcon
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
      {/* Background Particles */}
      <ParticlesBackground 
        color="rgba(79, 70, 229, 0.2)" 
        count={50} 
        speed={0.3} 
        type="wave" 
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
        {/* Enhanced Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute top-1/4 left-0 w-72 h-72 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
            animate={{ 
              scale: [1, 1.2, 1],
              x: [0, 20, 0],
              y: [0, -20, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 15,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute top-1/3 right-0 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
            animate={{ 
              scale: [1, 1.1, 1],
              x: [0, -30, 0],
              y: [0, 30, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 18,
              ease: "easeInOut",
              delay: 1
            }}
          />
          <motion.div 
            className="absolute bottom-0 left-1/4 w-80 h-80 bg-gradient-to-r from-red-400 to-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
            animate={{ 
              scale: [1, 1.3, 1],
              x: [0, 40, 0],
              y: [0, -10, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 20,
              ease: "easeInOut",
              delay: 2
            }}
          />
          
          {/* Additional decorative elements */}
          <motion.div 
            className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-r from-green-400 to-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 25,
              ease: "linear"
            }}
          />
        </div>
        
        {/* Floating particles */}
        <ParticlesBackground 
          color="rgba(79, 70, 229, 0.3)"
          count={60}
          speed={0.4}
          type="pulse"
          interactive={true}
        />
        
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
              {/* Decorative ring around animation */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.div 
                  className="w-[110%] h-[110%] rounded-full border-2 border-indigo-200 dark:border-indigo-900 opacity-50"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                />
                <motion.div 
                  className="absolute w-[105%] h-[105%] rounded-full border-2 border-dashed border-purple-300 dark:border-purple-800 opacity-40"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
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
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <svg className="absolute right-0 top-0 h-full w-1/2 translate-x-1/3 transform text-indigo-100 dark:text-indigo-950 opacity-20" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <polygon points="50,0 100,0 50,100 0,100" />
          </svg>
          
          <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-indigo-100/30 to-transparent dark:from-indigo-900/30"></div>
        </div>
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-16">
              <div className="inline-block mb-4">
                <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-indigo-100 dark:bg-indigo-900/50">
                  <SparklesIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                Fitur <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Unggulan</span>
              </h2>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                Teknologi terdepan untuk deteksi dini dan pencegahan penyakit retina
              </p>
            </div>
          </ScrollReveal>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {features.map((feature, index) => (
              <ScrollReveal 
                key={index} 
                animation={feature.animation}
                delay={index * 0.1}
              >
                <motion.div 
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg h-full border border-gray-100 dark:border-gray-700"
                  whileHover={{ 
                    y: -5,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    transition: { duration: 0.2 }
                  }}
                >
                  <div className={`h-2 bg-gradient-to-r ${feature.color}`}></div>
                  <div className="p-8">
                    <div className="relative mb-6">
                      <div className={`w-16 h-16 rounded-xl mb-4 flex items-center justify-center bg-gradient-to-br ${feature.color} text-white shadow-lg`}>
                        {feature.icon}
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center shadow-md">
                        <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${feature.color} opacity-30`}></div>
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>
                    
                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                    
                    <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                      <Link to="/register" className="inline-flex items-center text-indigo-600 dark:text-indigo-400 font-medium">
                        Pelajari lebih lanjut
                        <ArrowRightIcon className="ml-2 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-b from-white to-indigo-50/50 dark:from-gray-900 dark:to-indigo-950/50">
        {/* Enhanced background particles */}
        <ParticlesBackground 
          color="rgba(79, 70, 229, 0.15)" 
          count={40} 
          speed={0.3} 
          type="wave" 
          interactive={true}
        />
        
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute left-0 top-0 w-full h-32 bg-gradient-to-b from-white to-transparent dark:from-gray-900 dark:to-transparent"></div>
          <div className="absolute right-0 bottom-0 w-64 h-64 bg-gradient-to-br from-indigo-300 to-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-5"></div>
        </div>
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-16">
              <div className="inline-block mb-4">
                <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 shadow-lg">
                  <LightBulbIcon className="w-8 h-8 text-white" />
                </div>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                Bagaimana <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">RetinaScan</span> Bekerja
              </h2>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                Proses sederhana dengan hasil yang akurat dan cepat
              </p>
            </div>
          </ScrollReveal>
          
          {/* Process steps with connecting lines */}
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute top-24 left-0 w-full h-1 bg-gradient-to-r from-indigo-200 via-purple-300 to-indigo-200 dark:from-indigo-900 dark:via-purple-800 dark:to-indigo-900 hidden md:block"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 relative z-10">
              {/* Step 1 */}
              <ScrollReveal animation="fade-right" delay={0.1}>
                <motion.div 
                  className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90 border border-gray-100 dark:border-gray-700"
                  whileHover={{ 
                    y: -5,
                    boxShadow: "0 25px 50px -12px rgba(79, 70, 229, 0.25)",
                    transition: { duration: 0.2 }
                  }}
                >
                  <div className="relative mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg">
                      <span className="text-2xl font-bold text-white">1</span>
                    </div>
                    <motion.div 
                      className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                    Unggah Gambar Retina
                  </h3>
                  
                  <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                    Unggah gambar fundus retina dari perangkat pencitraan Anda ke platform kami yang aman dengan enkripsi end-to-end.
                  </p>
                  
                  <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center text-indigo-600 dark:text-indigo-400">
                      <EyeIcon className="h-5 w-5 mr-2" />
                      <span className="font-medium">Mendukung semua format gambar</span>
                    </div>
                  </div>
                </motion.div>
              </ScrollReveal>
              
              {/* Step 2 */}
              <ScrollReveal animation="fade-up" delay={0.2}>
                <motion.div 
                  className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90 border border-gray-100 dark:border-gray-700 md:mt-12"
                  whileHover={{ 
                    y: -5,
                    boxShadow: "0 25px 50px -12px rgba(79, 70, 229, 0.25)",
                    transition: { duration: 0.2 }
                  }}
                >
                  <div className="relative mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                      <span className="text-2xl font-bold text-white">2</span>
                    </div>
                    <motion.div 
                      className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                    Analisis AI Otomatis
                  </h3>
                  
                  <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                    Algoritma AI canggih kami menganalisis gambar, mendeteksi kelainan dan tanda-tanda penyakit retina dengan akurasi tinggi.
                  </p>
                  
                  <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center text-indigo-600 dark:text-indigo-400">
                      <BoltIcon className="h-5 w-5 mr-2" />
                      <span className="font-medium">Hasil dalam 2.5 detik</span>
                    </div>
                  </div>
                </motion.div>
              </ScrollReveal>
              
              {/* Step 3 */}
              <ScrollReveal animation="fade-left" delay={0.3}>
                <motion.div 
                  className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90 border border-gray-100 dark:border-gray-700"
                  whileHover={{ 
                    y: -5,
                    boxShadow: "0 25px 50px -12px rgba(79, 70, 229, 0.25)",
                    transition: { duration: 0.2 }
                  }}
                >
                  <div className="relative mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
                      <span className="text-2xl font-bold text-white">3</span>
                    </div>
                    <motion.div 
                      className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                    />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                    Laporan Hasil Lengkap
                  </h3>
                  
                  <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                    Dapatkan laporan terperinci dengan visualisasi, tingkat keparahan, dan rekomendasi tindak lanjut yang personal.
                  </p>
                  
                  <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center text-indigo-600 dark:text-indigo-400">
                      <DocumentTextIcon className="h-5 w-5 mr-2" />
                      <span className="font-medium">Laporan dapat diunduh</span>
                    </div>
                  </div>
                </motion.div>
              </ScrollReveal>
            </div>
          </div>
          
          <ScrollReveal animation="fade-up" delay={0.4}>
            <div className="mt-20 text-center">
              <Link to={isAuthenticated ? `${DASHBOARD_URL}?token=${token}` : "/register"}>
                <AnimatedButton variant="primary" size="lg">
                  <span className="flex items-center">
                    {isAuthenticated ? 'Buka Dashboard' : 'Coba Sekarang'}
                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                  </span>
                </AnimatedButton>
              </Link>
              
              <p className="mt-4 text-gray-500 dark:text-gray-400">
                Tidak perlu kartu kredit. Mulai dalam hitungan menit.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Stats Section */}
      <section 
        ref={statsRef}
        className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-700 to-purple-700 dark:from-indigo-900 dark:to-purple-900 text-white relative overflow-hidden"
      >
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-indigo-500 opacity-10 mix-blend-overlay"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-purple-500 opacity-10 mix-blend-overlay"></div>
          <svg className="absolute left-0 top-0 h-full w-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <defs>
              <pattern id="dot-pattern" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="rgba(255, 255, 255, 0.1)" />
              </pattern>
            </defs>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#dot-pattern)" />
          </svg>
        </div>
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
            {stats.map((stat, index) => (
              <ScrollReveal 
                key={index} 
                animation={stat.animation}
                delay={stat.delay}
              >
                <motion.div 
                  className="text-center backdrop-blur-sm bg-white/5 rounded-2xl p-6 border border-white/10"
                  whileHover={{ 
                    y: -5,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)",
                    transition: { duration: 0.2 }
                  }}
                >
                  <motion.div 
                    className="text-5xl md:text-6xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200"
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    {stat.value}
                  </motion.div>
                  
                  <div className="text-lg text-indigo-100">{stat.label}</div>
                  
                  <div className="mt-4 w-16 h-1 bg-indigo-400/30 mx-auto rounded-full"></div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <ScrollReveal animation="fade-up" delay={0.4}>
              <h3 className="text-2xl md:text-3xl font-bold mb-6">
                Dipercaya oleh dokter dan klinik di seluruh Indonesia
              </h3>
              
              <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-70">
                <div className="text-xl font-bold">RS Premier</div>
                <div className="text-xl font-bold">RSCM</div>
                <div className="text-xl font-bold">Siloam Hospitals</div>
                <div className="text-xl font-bold">Klinik Mata Nusantara</div>
                <div className="text-xl font-bold">RS Mata Indonesia</div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-indigo-50 to-transparent dark:from-gray-950 dark:to-transparent"></div>
          <div className="absolute right-0 top-1/4 transform translate-x-1/2 -translate-y-1/2">
            <svg width="404" height="404" fill="none" viewBox="0 0 404 404">
              <defs>
                <pattern id="85737c0e-0916-41d7-917f-596dc7edfa27" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <rect x="0" y="0" width="4" height="4" className="text-indigo-100 dark:text-indigo-900" fill="currentColor" />
                </pattern>
              </defs>
              <rect width="404" height="404" fill="url(#85737c0e-0916-41d7-917f-596dc7edfa27)" />
            </svg>
          </div>
          <div className="absolute left-0 bottom-1/4 transform -translate-x-1/2 translate-y-1/2">
            <svg width="404" height="404" fill="none" viewBox="0 0 404 404">
              <defs>
                <pattern id="85737c0e-0916-41d7-917f-596dc7edfa28" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <rect x="0" y="0" width="4" height="4" className="text-indigo-100 dark:text-indigo-900" fill="currentColor" />
                </pattern>
              </defs>
              <rect width="404" height="404" fill="url(#85737c0e-0916-41d7-917f-596dc7edfa28)" />
            </svg>
          </div>
        </div>
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-16">
              <div className="inline-block mb-4">
                <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-indigo-100 dark:bg-indigo-900/50">
                  <HeartIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                Dipercaya oleh <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Profesional Medis</span>
              </h2>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                Lihat apa kata para dokter dan tenaga medis tentang RetinaScan
              </p>
            </div>
          </ScrollReveal>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Testimonial 1 */}
            <ScrollReveal animation="fade-up" delay={0.1}>
              <motion.div 
                className="bg-gradient-to-br from-white to-indigo-50 dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 h-full"
                whileHover={{ 
                  y: -5,
                  boxShadow: "0 25px 50px -12px rgba(79, 70, 229, 0.25)",
                  transition: { duration: 0.2 }
                }}
              >
                <div className="flex items-center mb-6">
                  <div className="relative mr-5">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                      <span className="text-2xl font-bold text-white">SW</span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white">dr. Surya Wijaya</h4>
                    <p className="text-indigo-600 dark:text-indigo-400 font-medium">Spesialis Mata, RS Premier</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="flex text-amber-400 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                
                <blockquote className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                  "RetinaScan telah membantu kami mendeteksi kasus retinopati diabetik lebih awal, sehingga pasien bisa mendapatkan penanganan sebelum kondisi memburuk. Teknologi yang sangat inovatif."
                </blockquote>
                
                <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Menggunakan RetinaScan sejak 2022
                  </p>
                </div>
              </motion.div>
            </ScrollReveal>
            
            {/* Testimonial 2 */}
            <ScrollReveal animation="fade-up" delay={0.2}>
              <motion.div 
                className="bg-gradient-to-br from-white to-indigo-50 dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 h-full"
                whileHover={{ 
                  y: -5,
                  boxShadow: "0 25px 50px -12px rgba(79, 70, 229, 0.25)",
                  transition: { duration: 0.2 }
                }}
              >
                <div className="flex items-center mb-6">
                  <div className="relative mr-5">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                      <span className="text-2xl font-bold text-white">AP</span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white">dr. Anita Pratiwi</h4>
                    <p className="text-indigo-600 dark:text-indigo-400 font-medium">Dokter Umum, Klinik Sehat</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="flex text-amber-400 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                
                <blockquote className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                  "Akurasi yang tinggi dan kemudahan penggunaan membuat RetinaScan menjadi alat yang sangat berharga dalam praktik sehari-hari kami. Laporan yang dihasilkan sangat komprehensif."
                </blockquote>
                
                <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Menggunakan RetinaScan sejak 2021
                  </p>
                </div>
              </motion.div>
            </ScrollReveal>
            
            {/* Testimonial 3 */}
            <ScrollReveal animation="fade-up" delay={0.3}>
              <motion.div 
                className="bg-gradient-to-br from-white to-indigo-50 dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 h-full"
                whileHover={{ 
                  y: -5,
                  boxShadow: "0 25px 50px -12px rgba(79, 70, 229, 0.25)",
                  transition: { duration: 0.2 }
                }}
              >
                <div className="flex items-center mb-6">
                  <div className="relative mr-5">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
                      <span className="text-2xl font-bold text-white">BS</span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white">Prof. Dr. Budi Santoso</h4>
                    <p className="text-indigo-600 dark:text-indigo-400 font-medium">Direktur RS Mata Indonesia</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="flex text-amber-400 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                
                <blockquote className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                  "Teknologi AI RetinaScan telah membantu kami meningkatkan efisiensi dan mengurangi waktu tunggu pasien, sementara tetap mempertahankan standar diagnosis yang tinggi. Sangat direkomendasikan."
                </blockquote>
                
                <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Menggunakan RetinaScan sejak 2020
                  </p>
                </div>
              </motion.div>
            </ScrollReveal>
          </div>
          
          {/* Testimonial CTA */}
          <ScrollReveal animation="fade-up" delay={0.4}>
            <div className="mt-16 text-center">
              <Link to="/register" className="inline-flex items-center text-indigo-600 dark:text-indigo-400 font-medium text-lg">
                Lihat semua testimoni
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        ref={ctaRef}
        className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 dark:from-indigo-800 dark:via-purple-800 dark:to-indigo-900 text-white relative overflow-hidden"
      >
        {/* Enhanced Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-10"
            animate={{ 
              scale: [1, 1.2, 1],
              x: [0, 30, 0],
              y: [0, 30, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 20,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-10"
            animate={{ 
              scale: [1, 1.3, 1],
              x: [0, -30, 0],
              y: [0, -30, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 25,
              ease: "easeInOut",
              delay: 2
            }}
          />
          
          {/* Particle effect */}
          <ParticlesBackground 
            color="rgba(255, 255, 255, 0.2)" 
            count={30} 
            speed={0.3} 
            type="pulse" 
          />
          
          {/* Animated shapes */}
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <motion.div 
              className="w-[800px] h-[800px] border-2 border-white/20 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            />
            <motion.div 
              className="absolute w-[600px] h-[600px] border-2 border-white/20 rounded-full"
              animate={{ rotate: -360 }}
              transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
            />
            <motion.div 
              className="absolute w-[400px] h-[400px] border-2 border-white/20 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </div>
        
        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl">
            <ScrollReveal animation="fade-up">
              <div className="text-center">
                <div className="inline-block mb-6">
                  <div className="flex items-center justify-center w-20 h-20 mx-auto rounded-full bg-white/20 backdrop-blur-sm">
                    <SparklesIcon className="w-10 h-10 text-white" />
                  </div>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                  Mulai Deteksi Dini <span className="text-indigo-200">Sekarang</span>
                </h2>
                
                <p className="text-xl md:text-2xl text-indigo-100 mb-10 max-w-3xl mx-auto leading-relaxed">
                  Lindungi penglihatan Anda dan pasien Anda dengan teknologi AI canggih untuk deteksi dini penyakit retina.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6 justify-center mb-10">
                  {isAuthenticated ? (
                    <Link to={`${DASHBOARD_URL}?token=${token}`}>
                      <AnimatedButton variant="light" size="lg">
                        <span className="flex items-center">
                          Buka Dashboard
                          <ArrowRightIcon className="ml-2 h-5 w-5" />
                        </span>
                      </AnimatedButton>
                    </Link>
                  ) : (
                    <>
                      <Link to="/register">
                        <AnimatedButton variant="light" size="lg">
                          <span className="flex items-center">
                            Daftar Sekarang
                            <ArrowRightIcon className="ml-2 h-5 w-5" />
                          </span>
                        </AnimatedButton>
                      </Link>
                      <Link to="/login">
                        <AnimatedButton variant="outline-light" size="lg">
                          Login
                        </AnimatedButton>
                      </Link>
                    </>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                  <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <CheckCircleIcon className="h-6 w-6 text-green-400 mr-3 flex-shrink-0" />
                    <span className="text-indigo-100 text-lg">Mulai dalam 5 menit</span>
                  </div>
                  
                  <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <CheckCircleIcon className="h-6 w-6 text-green-400 mr-3 flex-shrink-0" />
                    <span className="text-indigo-100 text-lg">Tanpa kontrak jangka panjang</span>
                  </div>
                  
                  <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <CheckCircleIcon className="h-6 w-6 text-green-400 mr-3 flex-shrink-0" />
                    <span className="text-indigo-100 text-lg">Dukungan 24/7</span>
                  </div>
                </div>
                
                <div className="mt-10 text-indigo-200 text-sm">
                  Sudah digunakan oleh lebih dari 10,000+ pasien dan 50+ rumah sakit di Indonesia
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
};

export default withPageTransition(LandingPage);