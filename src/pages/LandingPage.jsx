import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useRef, useEffect, useState } from 'react';
import { 
  ArrowRightIcon, 
  ShieldCheckIcon, 
  CogIcon, 
  ChartBarIcon, 
  UserGroupIcon,
  BoltIcon,
  ArrowDownIcon,
  CheckCircleIcon,
  EyeIcon,
  DocumentTextIcon,
  LockClosedIcon,
  SparklesIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';
import { withPageTransition } from '../context/ThemeContext';
import { ParallaxBanner, Parallax, useParallax } from 'react-scroll-parallax';

function LandingPage() {
  const { theme, animations, isDarkMode } = useTheme();
  const [isVisible, setIsVisible] = useState({
    features: false,
    about: false,
    testimonials: false,
    cta: false
  });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Refs for scroll animations
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const aboutRef = useRef(null);
  const testimonialsRef = useRef(null);
  const ctaRef = useRef(null);
  
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, -150]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.5]);
  
  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX / window.innerWidth - 0.5,
        y: e.clientY / window.innerHeight - 0.5,
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  // Observer for section visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.target.id === 'features' && entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, features: true }));
          } else if (entry.target.id === 'about' && entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, about: true }));
          } else if (entry.target.id === 'testimonials' && entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, testimonials: true }));
          } else if (entry.target.id === 'cta' && entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, cta: true }));
          }
        });
      },
      { threshold: 0.2 }
    );
    
    if (featuresRef.current) observer.observe(featuresRef.current);
    if (aboutRef.current) observer.observe(aboutRef.current);
    if (testimonialsRef.current) observer.observe(testimonialsRef.current);
    if (ctaRef.current) observer.observe(ctaRef.current);
    
    return () => {
      if (featuresRef.current) observer.unobserve(featuresRef.current);
      if (aboutRef.current) observer.unobserve(aboutRef.current);
      if (testimonialsRef.current) observer.unobserve(testimonialsRef.current);
      if (ctaRef.current) observer.unobserve(ctaRef.current);
    };
  }, []);
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
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
  
  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        type: 'spring',
        damping: 15,
        stiffness: 100,
        delay: custom * 0.15,
        duration: 0.6
      }
    }),
    hover: {
      y: -15,
      scale: 1.03,
      boxShadow: isDarkMode 
        ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' 
        : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      transition: { 
        type: 'spring',
        stiffness: 300,
        damping: 20
      }
    },
    tap: { scale: 0.98 }
  };
  
  const buttonVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.05, 
      boxShadow: isDarkMode 
        ? '0 15px 30px -5px rgba(59, 130, 246, 0.4)' 
        : '0 15px 30px -5px rgba(59, 130, 246, 0.7)'
    },
    tap: { scale: 0.95 }
  };
  
  const floatingAnimation = {
    initial: { y: 0 },
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Hero section animation variants
  const heroImageVariants = {
    animate: {
      x: mousePosition.x * 20,
      y: mousePosition.y * 20,
      rotateX: mousePosition.y * 10,
      rotateY: -mousePosition.x * 10,
      transition: {
        type: "spring",
        damping: 30,
        stiffness: 100
      }
    }
  };

  // Features data
  const features = [
    {
      title: 'Deteksi Dini',
      description: 'Identifikasi tanda-tanda awal retinopati diabetik sebelum gejala terlihat',
      icon: <EyeIcon className="h-8 w-8" />,
      color: 'blue'
    },
    {
      title: 'Akurasi Tinggi',
      description: 'Teknologi AI dengan tingkat akurasi di atas 95% dalam mendeteksi kelainan retina',
      icon: <ChartBarIcon className="h-8 w-8" />,
      color: 'purple'
    },
    {
      title: 'Hasil Cepat',
      description: 'Dapatkan hasil analisis dalam hitungan menit, bukan hari atau minggu',
      icon: <BoltIcon className="h-8 w-8" />,
      color: 'green'
    },
    {
      title: 'Keamanan Data',
      description: 'Keamanan data pasien terjamin dengan enkripsi tingkat tinggi',
      icon: <ShieldCheckIcon className="h-8 w-8" />,
      color: 'red'
    },
    {
      title: 'Integrasi Mudah',
      description: 'Terintegrasi dengan sistem rumah sakit dan klinik yang sudah ada',
      icon: <CogIcon className="h-8 w-8" />,
      color: 'amber'
    },
    {
      title: 'Laporan Terperinci',
      description: 'Laporan hasil analisis yang detail dan mudah dipahami',
      icon: <DocumentTextIcon className="h-8 w-8" />,
      color: 'indigo'
    },
  ];

  // Testimonial data
  const testimonials = [
    {
      quote: "RetinaScan telah membantu kami mendeteksi kasus retinopati diabetik lebih awal, sehingga pasien mendapatkan perawatan yang tepat waktu.",
      name: "dr. Siti Rahmawati",
      title: "Dokter Spesialis Mata, RS Premier Jakarta",
      image: "https://randomuser.me/api/portraits/women/45.jpg"
    },
    {
      quote: "Teknologi AI dari RetinaScan sangat membantu praktik saya. Akurasinya tinggi dan sangat menghemat waktu dalam diagnosis.",
      name: "dr. Budi Santoso",
      title: "Dokter Spesialis Mata, Klinik Mata Sehat",
      image: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      quote: "Sebagai penyandang diabetes, RetinaScan memberikan saya ketenangan karena bisa memantau kondisi retina secara rutin dengan mudah.",
      name: "Ani Wijaya",
      title: "Pasien Diabetes",
      image: "https://randomuser.me/api/portraits/women/68.jpg"
    }
  ];

  return (
    <div className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} transition-colors duration-300`}>
      {/* Hero Section with Enhanced Parallax */}
      <section className="relative min-h-screen flex items-center overflow-hidden" ref={heroRef}>
        {/* Background with parallax effect */}
        <ParallaxBanner
          layers={[
            { 
              image: isDarkMode 
                ? 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3'
                : 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3',
              speed: -20,
              opacity: isDarkMode ? 0.5 : 0.7,
              scale: [1, 1.2, 'easeOutCubic']
            }
          ]}
          className="absolute inset-0"
        >
          {/* Overlay gradient */}
          <div className={`absolute inset-0 ${
            isDarkMode 
              ? 'bg-gradient-to-b from-gray-900/80 via-gray-900/70 to-gray-900'
              : 'bg-gradient-to-b from-blue-500/30 via-indigo-500/20 to-white'
          }`} />
        </ParallaxBanner>

        {/* Animated floating shapes */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Large circle shape */}
          <motion.div 
            className={`absolute top-1/4 left-[10%] w-64 h-64 rounded-full ${
              isDarkMode ? 'bg-blue-500/10' : 'bg-blue-300/20'
            } blur-3xl`}
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Medium circle shape */}
          <motion.div 
            className={`absolute bottom-1/4 right-[10%] w-80 h-80 rounded-full ${
              isDarkMode ? 'bg-purple-500/10' : 'bg-purple-300/20'
            } blur-3xl`}
            animate={{
              y: [0, 30, 0],
              x: [0, -20, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Small decorative elements */}
          <motion.div 
            className={`absolute top-[30%] right-[20%] w-24 h-24 rounded-full ${
              isDarkMode ? 'bg-cyan-500/20' : 'bg-cyan-300/30'
            } blur-xl`}
            animate={{
              y: [0, -15, 0],
              x: [0, 10, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <motion.div 
            className={`absolute bottom-[40%] left-[25%] w-32 h-32 rounded-full ${
              isDarkMode ? 'bg-indigo-500/15' : 'bg-indigo-300/20'
            } blur-xl`}
            animate={{
              y: [0, 20, 0],
              x: [0, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Particles effect */}
          <div className="absolute inset-0">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute rounded-full ${
                  isDarkMode ? 'bg-blue-400/30' : 'bg-blue-500/20'
                } w-2 h-2`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -100, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 10 + Math.random() * 10,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </div>
        
        {/* Hero content - Centered layout */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-6 inline-block"
            >
              <div className="relative">
                <motion.div
                  className={`absolute -inset-1 rounded-full ${
                    isDarkMode ? 'bg-blue-500/30' : 'bg-blue-200'
                  } blur-md`}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <EyeIcon className={`relative z-10 h-16 w-16 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
            </motion.div>
            
            <motion.h1 
              className={`text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 max-w-4xl ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              Deteksi Dini{" "}
              <span className="relative inline-block">
                <span className={isDarkMode ? 'text-blue-400' : 'text-blue-600'}>Retinopati Diabetik</span>
                <motion.span 
                  className={`absolute bottom-0 left-0 h-1 ${isDarkMode ? 'bg-blue-400' : 'bg-blue-600'} rounded-full`}
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1, delay: 1, ease: "easeOut" }}
                />
              </span>{" "}
              dengan AI
            </motion.h1>
            
            <motion.p 
              className={`text-xl mb-10 max-w-2xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            >
              Teknologi AI canggih untuk mendeteksi kelainan retina akibat diabetes dengan akurasi tinggi, membantu dokter dan pasien mencegah kebutaan.
            </motion.p>
            
            <motion.div
              className="flex flex-col sm:flex-row justify-center gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            >
              <motion.div 
                whileHover="hover" 
                whileTap="tap"
                variants={buttonVariants}
              >
                <Link 
                  to="/register" 
                  className={`px-8 py-3 rounded-lg font-medium flex items-center justify-center ${
                    isDarkMode 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white' 
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
                  } transition-all duration-300 shadow-lg`}
                >
                  <span>Mulai Sekarang</span>
                  <motion.span
                    initial={{ x: 0 }}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                  </motion.span>
                </Link>
              </motion.div>
              
              <motion.div 
                whileHover="hover"
                whileTap="tap"
                variants={buttonVariants}
              >
                <Link 
                  to="/#features" 
                  className={`px-8 py-3 rounded-lg font-medium flex items-center justify-center ${
                    isDarkMode 
                      ? 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700' 
                      : 'bg-white hover:bg-gray-100 text-gray-900 border border-gray-200 shadow-md'
                  } transition-colors duration-300`}
                >
                  Pelajari Lebih Lanjut
                </Link>
              </motion.div>
            </motion.div>
            
            {/* Badges */}
            <motion.div
              className="mt-10 flex flex-wrap gap-4 justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className={`flex items-center px-4 py-2 rounded-full ${
                  isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
                }`}
              >
                <SparklesIcon className={`h-5 w-5 mr-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <span className="text-sm font-medium">Akurasi 95%+</span>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                className={`flex items-center px-4 py-2 rounded-full ${
                  isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
                }`}
              >
                <BeakerIcon className={`h-5 w-5 mr-2 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                <span className="text-sm font-medium">Teruji Klinis</span>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                className={`flex items-center px-4 py-2 rounded-full ${
                  isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
                }`}
              >
                <ShieldCheckIcon className={`h-5 w-5 mr-2 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                <span className="text-sm font-medium">Data Terenkripsi</span>
              </motion.div>
            </motion.div>

            {/* Hero image - shown below text on all screen sizes */}
            <motion.div
              className="mt-16 w-full max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
            >
              <motion.div
                className="relative"
                style={{ perspective: 1000 }}
                animate={{
                  x: mousePosition.x * 20,
                  y: mousePosition.y * 20,
                  rotateX: mousePosition.y * 5,
                  rotateY: -mousePosition.x * 5,
                }}
                transition={{
                  type: "spring",
                  damping: 30,
                  stiffness: 100
                }}
              >
                {/* Decorative elements */}
                <motion.div
                  className={`absolute -inset-4 rounded-3xl ${
                    isDarkMode ? 'bg-blue-500/10' : 'bg-blue-100'
                  } transform -rotate-6`}
                  animate={{
                    rotate: [-6, -4, -6],
                    transition: { duration: 8, repeat: Infinity, ease: "easeInOut" }
                  }}
                />
                <motion.div
                  className={`absolute -inset-4 rounded-3xl ${
                    isDarkMode ? 'bg-purple-500/10' : 'bg-purple-100'
                  } transform rotate-3`}
                  animate={{
                    rotate: [3, 5, 3],
                    transition: { duration: 8, repeat: Infinity, ease: "easeInOut" }
                  }}
                />
                
                {/* Main image */}
                <motion.img 
                  src="https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&q=80&w=1974&ixlib=rb-4.0.3"
                  alt="AI analyzing retina scan" 
                  className="relative z-10 rounded-2xl shadow-2xl w-full h-auto object-cover"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
                
                {/* Floating elements */}
                <motion.div
                  className={`absolute -right-10 -bottom-10 p-4 rounded-xl shadow-xl z-20 ${
                    isDarkMode ? 'bg-gray-800' : 'bg-white'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1 }}
                  style={{
                    x: mousePosition.x * -15,
                    y: mousePosition.y * -15,
                  }}
                >
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-blue-900/50' : 'bg-blue-100'}`}>
                      <EyeIcon className={`h-6 w-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                    </div>
                    <div className="ml-3">
                      <p className="text-xs font-semibold">Deteksi Otomatis</p>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Hasil dalam 60 detik</p>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div
                  className={`absolute -left-10 -top-10 p-4 rounded-xl shadow-xl z-20 ${
                    isDarkMode ? 'bg-gray-800' : 'bg-white'
                  }`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                  style={{
                    x: mousePosition.x * 15,
                    y: mousePosition.y * 15,
                  }}
                >
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-green-900/50' : 'bg-green-100'}`}>
                      <ChartBarIcon className={`h-6 w-6 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                    </div>
                    <div className="ml-3">
                      <p className="text-xs font-semibold">Akurasi Tinggi</p>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>95% Presisi</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
          
          {/* Scroll down indicator */}
          <motion.div 
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
              className="flex flex-col items-center"
            >
              <span className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Scroll Down</span>
              <ArrowDownIcon className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section 
        id="features" 
        ref={featuresRef}
        className={`py-20 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible.features ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.span 
              className={`inline-block px-4 py-1 rounded-full text-sm font-medium mb-4 ${
                isDarkMode ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 text-blue-600'
              }`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={isVisible.features ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              Fitur Unggulan
            </motion.span>
            
            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Teknologi AI Terdepan untuk Kesehatan Mata
            </h2>
            
            <motion.div
              initial={{ width: 0 }}
              animate={isVisible.features ? { width: '80px' } : {}}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className={`h-1 ${isDarkMode ? 'bg-blue-500' : 'bg-blue-600'} rounded-full mx-auto mb-6`}
            />
            
            <p className={`max-w-3xl mx-auto text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              RetinaScan menggunakan teknologi AI terdepan untuk mendeteksi dan menganalisis kelainan retina dengan cepat dan akurat.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className={`rounded-xl p-8 ${
                  isDarkMode 
                    ? 'bg-gray-800 hover:bg-gray-700' 
                    : 'bg-white hover:bg-blue-50'
                } shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group`}
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible.features ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                whileHover={{ y: -5 }}
              >
                {/* Decorative background shape */}
                <motion.div 
                  className={`absolute -right-8 -bottom-8 w-32 h-32 rounded-full opacity-10 ${
                    feature.color === 'blue' ? 'bg-blue-500' :
                    feature.color === 'purple' ? 'bg-purple-500' :
                    feature.color === 'green' ? 'bg-green-500' :
                    feature.color === 'red' ? 'bg-red-500' :
                    feature.color === 'amber' ? 'bg-amber-500' :
                    'bg-indigo-500'
                  } transition-all duration-300 group-hover:scale-125`}
                  whileHover={{ scale: 1.2 }}
                />
                
                <div className={`inline-block p-3 rounded-lg mb-4 relative ${
                  feature.color === 'blue' ? isDarkMode ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 text-blue-600' :
                  feature.color === 'purple' ? isDarkMode ? 'bg-purple-900/50 text-purple-400' : 'bg-purple-100 text-purple-600' :
                  feature.color === 'green' ? isDarkMode ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-600' :
                  feature.color === 'red' ? isDarkMode ? 'bg-red-900/50 text-red-400' : 'bg-red-100 text-red-600' :
                  feature.color === 'amber' ? isDarkMode ? 'bg-amber-900/50 text-amber-400' : 'bg-amber-100 text-amber-600' :
                  isDarkMode ? 'bg-indigo-900/50 text-indigo-400' : 'bg-indigo-100 text-indigo-600'
                }`}>
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    {feature.icon}
                  </motion.div>
                </div>
                
                <h3 className={`text-xl font-bold mb-2 relative ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {feature.title}
                </h3>
                
                <p className={`relative ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {feature.description}
                </p>
                
                <motion.div 
                  className={`mt-6 flex items-center text-sm font-medium ${
                    feature.color === 'blue' ? isDarkMode ? 'text-blue-400' : 'text-blue-600' :
                    feature.color === 'purple' ? isDarkMode ? 'text-purple-400' : 'text-purple-600' :
                    feature.color === 'green' ? isDarkMode ? 'text-green-400' : 'text-green-600' :
                    feature.color === 'red' ? isDarkMode ? 'text-red-400' : 'text-red-600' :
                    feature.color === 'amber' ? isDarkMode ? 'text-amber-400' : 'text-amber-600' :
                    isDarkMode ? 'text-indigo-400' : 'text-indigo-600'
                  } relative opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  whileHover={{ x: 5 }}
                >
                  <span>Pelajari lebih lanjut</span>
                  <ArrowRightIcon className="h-4 w-4 ml-1" />
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Stats section */}
          <motion.div 
            className={`mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 rounded-2xl p-8 ${
              isDarkMode 
                ? 'bg-gray-800 bg-opacity-50' 
                : 'bg-white shadow-xl'
            }`}
            initial={{ opacity: 0, y: 50 }}
            animate={isVisible.features ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          >
            {[
              { value: '95%', label: 'Akurasi', color: 'blue' },
              { value: '60s', label: 'Waktu Analisis', color: 'purple' },
              { value: '50+', label: 'Rumah Sakit', color: 'green' }
            ].map((stat, index) => (
              <motion.div 
                key={stat.label}
                className="text-center p-4"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={isVisible.features ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                >
                  <div className={`text-4xl font-bold mb-2 ${
                    stat.color === 'blue' ? isDarkMode ? 'text-blue-400' : 'text-blue-600' :
                    stat.color === 'purple' ? isDarkMode ? 'text-purple-400' : 'text-purple-600' :
                    isDarkMode ? 'text-green-400' : 'text-green-600'
                  }`}>
                    {stat.value}
                  </div>
                  <div className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                    {stat.label}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* About Section with Parallax */}
      <section 
        id="about" 
        ref={aboutRef}
        className={`py-20 relative overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
      >
        <Parallax speed={-10} className="absolute inset-0 z-0">
          <div className={`absolute inset-0 ${
            isDarkMode 
              ? 'bg-gradient-to-br from-blue-900/20 to-purple-900/20' 
              : 'bg-gradient-to-br from-blue-100/50 to-purple-100/50'
          }`} />
        </Parallax>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
              animate={isVisible.about ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h2 className={`text-3xl sm:text-4xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Tentang RetinaScan
              </h2>
              <p className={`text-lg mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                RetinaScan adalah platform berbasis AI yang dirancang untuk membantu dokter mata dan pasien diabetes dalam mendeteksi tanda-tanda awal retinopati diabetik.
              </p>
              <p className={`text-lg mb-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Dengan teknologi machine learning canggih, kami mampu menganalisis gambar retina dan mengidentifikasi kelainan dengan tingkat akurasi di atas 95%, membantu mencegah kebutaan akibat diabetes.
              </p>
              
              <div className="space-y-4">
                {[
                  'Didukung oleh tim dokter spesialis mata terkemuka',
                  'Terintegrasi dengan sistem rumah sakit dan klinik',
                  'Memenuhi standar keamanan data medis internasional',
                  'Digunakan di lebih dari 50 rumah sakit di Indonesia'
                      ].map((item, index) => (
                        <motion.div 
                          key={index}
                          className="flex items-start"
                          initial={{ opacity: 0, x: -20 }}
                    animate={isVisible.about ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                        >
                          <CheckCircleIcon className={`h-6 w-6 mr-2 flex-shrink-0 ${
                      isDarkMode ? 'text-blue-400' : 'text-blue-600'
                          }`} />
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                            {item}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                </motion.div>
                
                <motion.div
                  className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={isVisible.about ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="relative">
                <div className={`absolute -inset-4 rounded-xl ${
                  isDarkMode ? 'bg-blue-500/10' : 'bg-blue-100'
                } transform -rotate-6`} />
                <div className={`absolute -inset-4 rounded-xl ${
                  isDarkMode ? 'bg-purple-500/10' : 'bg-purple-100'
                } transform rotate-3`} />
                <img 
                  src="https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&q=80&w=1974&ixlib=rb-4.0.3"
                  alt="AI analyzing retina scan" 
                  className="relative z-10 rounded-xl shadow-xl w-full h-auto object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section 
        id="testimonials" 
        ref={testimonialsRef}
        className={`py-20 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                  <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible.testimonials ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Apa Kata Mereka
            </h2>
            <p className={`max-w-3xl mx-auto text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Dengarkan pengalaman para dokter dan pasien yang telah menggunakan RetinaScan.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
                  <motion.div 
                key={index}
                className={`rounded-xl p-8 ${
                  isDarkMode 
                    ? 'bg-gray-800 hover:bg-gray-700' 
                    : 'bg-white hover:bg-blue-50'
                } shadow-lg hover:shadow-xl transition-all duration-300`}
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible.testimonials ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center mb-6">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {testimonial.name}
                    </h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {testimonial.title}
                    </p>
                  </div>
                </div>
                <p className={`italic ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  "{testimonial.quote}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section 
        id="cta" 
        ref={ctaRef}
        className={`py-20 relative overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
      >
        <Parallax speed={-5} className="absolute inset-0 z-0">
          <div className={`absolute inset-0 ${
            isDarkMode 
              ? 'bg-gradient-to-br from-blue-900/20 to-purple-900/20' 
              : 'bg-gradient-to-br from-blue-100/50 to-purple-100/50'
          }`} />
        </Parallax>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible.cta ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className={`text-3xl sm:text-4xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Mulai Deteksi Dini Retinopati Diabetik Sekarang
            </h2>
            <p className={`text-xl mb-10 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Bergabunglah dengan ribuan dokter dan pasien yang telah memanfaatkan teknologi AI RetinaScan untuk mencegah kebutaan akibat diabetes.
            </p>
            
              <motion.div
              className="flex flex-col sm:flex-row justify-center gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible.cta ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  to="/register" 
                  className={`px-8 py-3 rounded-lg font-medium flex items-center justify-center ${
                      isDarkMode 
                      ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  } transition-colors duration-300`}
                  >
                    Daftar Sekarang
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  to="/login" 
                  className={`px-8 py-3 rounded-lg font-medium flex items-center justify-center ${
                    isDarkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  } transition-colors duration-300`}
                >
                  Login
                  <LockClosedIcon className="ml-2 h-5 w-5" />
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default withPageTransition(LandingPage);