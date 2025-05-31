import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
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
import { ParallaxBanner, Parallax, useParallax, ParallaxProvider } from 'react-scroll-parallax';

function LandingPage() {
  const { theme, animations, isDarkMode } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isVisible, setIsVisible] = useState({
    features: false,
    about: false,
    testimonials: false,
    cta: false
  });
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  
  // Environment variables
  const DASHBOARD_URL = import.meta.env.VITE_DASHBOARD_URL || 'http://localhost:3000';
  
  // Check authentication status
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);
  
  // Track scroll position for enhanced animations
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
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
  
  // Enhanced mouse parallax effect with better performance
  useEffect(() => {
    const handleMouseMove = (e) => {
      // Use requestAnimationFrame for better performance
      requestAnimationFrame(() => {
        setX(e.clientX / window.innerWidth - 0.5);
        setY(e.clientY / window.innerHeight - 0.5);
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  // Observer for section visibility with improved threshold
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
      { threshold: [0.1, 0.3, 0.5], rootMargin: "0px 0px -10% 0px" }
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
  
  // Enhanced animation variants with better timing and effects
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: { 
        type: 'spring',
        damping: 15,
        stiffness: 100,
        delay: custom * 0.15, // Faster stagger
        duration: 0.7
      }
    })
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // Faster stagger
        delayChildren: 0.2
      }
    }
  };
  
  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        type: 'spring',
        damping: 15,
        stiffness: 100,
        delay: custom * 0.1, // Faster stagger
        duration: 0.5
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

  // Enhanced mouse follow animation with spring effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const smoothMouseX = useSpring(mouseX, { stiffness: 100, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 100, damping: 20 });
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      // Use requestAnimationFrame for better performance
      requestAnimationFrame(() => {
        mouseX.set(e.clientX - window.innerWidth / 2);
        mouseY.set(e.clientY - window.innerHeight / 2);
      });
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseX, mouseY]);

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
      {/* Hero Section - Enhanced Modern Design with Better Parallax */}
      <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden" ref={heroRef}>
        {/* Enhanced animated gradient background */}
        <motion.div 
          className="absolute inset-0 z-0 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          {/* Main animated gradient with CSS */}
          <div className="absolute inset-0 animated-gradient" 
            style={{
              background: isDarkMode 
                ? 'linear-gradient(120deg, rgba(29, 78, 216, 0.1), rgba(67, 56, 202, 0.1), rgba(124, 58, 237, 0.1))'
                : 'linear-gradient(120deg, rgba(59, 130, 246, 0.15), rgba(79, 70, 229, 0.15), rgba(139, 92, 246, 0.15))'
            }}
          />
          
          {/* Animated blobs */}
          <div className="blob bg-blue-400 dark:bg-blue-600 h-96 w-96 top-0 left-0 opacity-10 dark:opacity-5" />
          <div className="blob bg-indigo-400 dark:bg-indigo-600 h-96 w-96 bottom-0 right-0 opacity-10 dark:opacity-5" 
               style={{animationDelay: '-2s'}} />
          <div className="blob bg-purple-400 dark:bg-purple-600 h-64 w-64 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 dark:opacity-5"
               style={{animationDelay: '-4s'}} />
          
          {/* Main animated gradient - use Framer Motion for more control */}
          <motion.div 
            className="absolute -inset-[100px] filter blur-3xl opacity-30"
            animate={{
              background: isDarkMode 
                ? [
                    'radial-gradient(circle at 20% 20%, rgba(14, 165, 233, 0.15) 0%, rgba(79, 70, 229, 0.1) 50%, rgba(10, 10, 10, 0) 80%)',
                    'radial-gradient(circle at 40% 70%, rgba(14, 165, 233, 0.15) 0%, rgba(79, 70, 229, 0.1) 50%, rgba(10, 10, 10, 0) 80%)',
                    'radial-gradient(circle at 60% 30%, rgba(14, 165, 233, 0.15) 0%, rgba(79, 70, 229, 0.1) 50%, rgba(10, 10, 10, 0) 80%)',
                    'radial-gradient(circle at 20% 20%, rgba(14, 165, 233, 0.15) 0%, rgba(79, 70, 229, 0.1) 50%, rgba(10, 10, 10, 0) 80%)',
                  ]
                : [
                    'radial-gradient(circle at 20% 20%, rgba(56, 189, 248, 0.4) 0%, rgba(59, 130, 246, 0.3) 50%, rgba(255, 255, 255, 0) 80%)',
                    'radial-gradient(circle at 40% 70%, rgba(56, 189, 248, 0.4) 0%, rgba(59, 130, 246, 0.3) 50%, rgba(255, 255, 255, 0) 80%)',
                    'radial-gradient(circle at 60% 30%, rgba(56, 189, 248, 0.4) 0%, rgba(59, 130, 246, 0.3) 50%, rgba(255, 255, 255, 0) 80%)',
                    'radial-gradient(circle at 20% 20%, rgba(56, 189, 248, 0.4) 0%, rgba(59, 130, 246, 0.3) 50%, rgba(255, 255, 255, 0) 80%)',
                  ],
            }}
            transition={{
              background: {
                duration: 15,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.33, 0.66, 1]
              }
            }}
          />
          
          {/* Subtle mouse-responsive overlay */}
          <motion.div 
            className="absolute inset-0"
            style={{
              background: isDarkMode 
                ? 'radial-gradient(circle at 50% 50%, rgba(30, 64, 175, 0.05), rgba(10, 10, 10, 0))'
                : 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1), rgba(255, 255, 255, 0))',
              backgroundSize: '120% 120%',
              backgroundPosition: `${50 + x * 10}% ${50 + y * 10}%`,
              transition: 'background-position 2s cubic-bezier(0.19, 1, 0.22, 1)',
            }}
          />
        </motion.div>

        {/* Enhanced animated floating elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Animated circles with improved responsiveness */}
          <Parallax 
            translateY={['-100px', '100px']} 
            className={`absolute top-1/4 left-[5%] sm:left-[15%] w-32 sm:w-64 h-32 sm:h-64 rounded-full ${
              isDarkMode ? 'bg-blue-500/10' : 'bg-blue-300/20'
            } blur-3xl`}
          />
          
          <Parallax 
            translateY={['100px', '-100px']} 
            className={`absolute bottom-1/4 right-[5%] sm:right-[15%] w-40 sm:w-80 h-40 sm:h-80 rounded-full ${
              isDarkMode ? 'bg-purple-500/10' : 'bg-purple-300/20'
            } blur-3xl`}
          />
          
          {/* Animated grid pattern with better mobile optimization */}
          <div className="absolute inset-0 opacity-5 sm:opacity-10">
            <div className="absolute inset-0 bg-grid-pattern bg-[length:30px_30px] sm:bg-[length:50px_50px] [mask-image:radial-gradient(ellipse_at_center,white_20%,transparent_80%)]"></div>
          </div>
          
          {/* Optimized floating particles for mobile and desktop */}
          {[...Array(10)].map((_, i) => (
            <motion.div 
              key={i}
              className={`absolute rounded-full ${
                isDarkMode ? 'bg-blue-400/30' : 'bg-blue-500/20'
              } w-1 h-1 sm:w-2 sm:h-2`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 8 + Math.random() * 8,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        {/* Hero Content - Enhanced Responsive Design */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center">
          {/* Enhanced Animated Blob Background */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -z-10">
            <motion.div 
              className={`w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] rounded-full filter blur-3xl opacity-20 ${
                isDarkMode ? 'bg-blue-700' : 'bg-blue-400'
              }`}
              animate={{
                scale: [1, 1.1, 1],
                borderRadius: ["60% 40% 70% 30%", "40% 60% 30% 70%", "60% 40% 70% 30%"],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          </div>
        
          {/* Logo Icon with Enhanced Glow Effect */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-6 sm:mb-8 relative"
          >
            <motion.div
              className={`absolute inset-0 rounded-full ${
                isDarkMode ? 'bg-blue-500/30' : 'bg-blue-200'
              } blur-xl`}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <div className={`relative z-10 p-3 sm:p-4 rounded-full ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-xl`}>
              <EyeIcon className={`h-12 w-12 sm:h-16 sm:w-16 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
          </motion.div>
            
          {/* Main Heading with Enhanced Animated Highlight */}
          <motion.div
            className="text-center mb-4 sm:mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-2 sm:mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              <span>Deteksi Dini</span>{" "}
              <span className="relative inline-block">
                <span className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  Retinopati Diabetik
                </span>
                <motion.span 
                  className={`absolute bottom-0 left-0 h-1 sm:h-1.5 ${
                    isDarkMode ? 'bg-blue-400' : 'bg-blue-600'
                  } rounded-full`}
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
                />
              </span>
            </h1>
            <motion.h2 
              className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              dengan Teknologi AI
            </motion.h2>
          </motion.div>

          {/* Enhanced Description with Animated Typing Effect */}
          <motion.div
            className="max-w-xl sm:max-w-2xl text-center mb-6 sm:mb-10 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <p className={`text-base sm:text-lg md:text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Teknologi AI canggih untuk mendeteksi kelainan retina akibat diabetes dengan akurasi tinggi, 
              membantu dokter dan pasien mencegah kebutaan.
            </p>
          </motion.div>

          {/* Enhanced Responsive CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 mb-8 sm:mb-12 w-full max-w-xs sm:max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {isAuthenticated ? (
              <motion.div 
                whileHover="hover" 
                whileTap="tap" 
                variants={buttonVariants}
                className="w-full"
              >
                <a 
                  href={DASHBOARD_URL} 
                  className={`w-full px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-medium flex items-center justify-center ${
                    isDarkMode 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white' 
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
                  } transition-all duration-300 shadow-lg`}
                >
                  <span>Buka Dashboard</span>
                  <motion.span
                    initial={{ x: 0 }}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                  </motion.span>
                </a>
              </motion.div>
            ) : (
              <>
                <motion.div 
                  whileHover="hover" 
                  whileTap="tap" 
                  variants={buttonVariants}
                  className="w-full"
                >
                  <Link 
                    to="/register" 
                    className={`w-full px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-medium flex items-center justify-center ${
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
                  className="w-full"
                >
                  <Link 
                    to="/login" 
                    className={`w-full px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-medium flex items-center justify-center ${
                      isDarkMode 
                        ? 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700' 
                        : 'bg-white hover:bg-gray-100 text-gray-900 border border-gray-200 shadow-md'
                    } transition-colors duration-300`}
                  >
                    Login
                  </Link>
                </motion.div>
              </>
            )}
          </motion.div>

          {/* Enhanced Stats Cards with Better Responsiveness */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 w-full max-w-xs sm:max-w-2xl lg:max-w-4xl mb-8 sm:mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            {[
              { value: '95%', label: 'Akurasi', icon: <ChartBarIcon className="h-5 w-5 sm:h-6 sm:w-6" />, color: 'blue' },
              { value: '60s', label: 'Waktu Analisis', icon: <BoltIcon className="h-5 w-5 sm:h-6 sm:w-6" />, color: 'purple' },
              { value: '50+', label: 'Rumah Sakit', icon: <UserGroupIcon className="h-5 w-5 sm:h-6 sm:w-6" />, color: 'green' }
            ].map((stat, index) => (
              <motion.div 
                key={stat.label}
                className={`p-3 sm:p-6 rounded-xl sm:rounded-2xl ${
                  isDarkMode 
                    ? 'bg-gray-800/70 backdrop-blur-sm border border-gray-700' 
                    : 'bg-white/70 backdrop-blur-sm shadow-xl border border-gray-100'
                }`}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                custom={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                <div className={`inline-flex items-center justify-center p-2 sm:p-3 rounded-lg mb-2 sm:mb-4 ${
                  stat.color === 'blue' ? isDarkMode ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 text-blue-600' :
                  stat.color === 'purple' ? isDarkMode ? 'bg-purple-900/50 text-purple-400' : 'bg-purple-100 text-purple-600' :
                  isDarkMode ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-600'
                }`}>
                  {stat.icon}
                </div>
                <div className={`text-xl sm:text-2xl lg:text-3xl font-bold mb-0.5 sm:mb-1 ${
                  stat.color === 'blue' ? isDarkMode ? 'text-blue-400' : 'text-blue-600' :
                  stat.color === 'purple' ? isDarkMode ? 'text-purple-400' : 'text-purple-600' :
                  isDarkMode ? 'text-green-400' : 'text-green-600'
                }`}>
                  {stat.value}
                </div>
                <div className={`text-sm sm:text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Enhanced Hero Image with Glass Effect */}
          <motion.div
            className="w-full max-w-xs sm:max-w-lg lg:max-w-3xl mx-auto"
            style={{ perspective: 1000 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <motion.div
              className="relative"
              style={{
                transformStyle: "preserve-3d",
              }}
              animate={{
                rotateX: smoothMouseY.get() * 0.01,
                rotateY: smoothMouseX.get() * -0.01,
              }}
            >
              {/* Decorative elements with better mobile support */}
              <motion.div
                className={`absolute -inset-2 sm:-inset-4 rounded-xl sm:rounded-3xl ${
                  isDarkMode ? 'bg-blue-500/10' : 'bg-blue-100'
                } transform -rotate-6`}
                animate={{
                  rotate: [-6, -4, -6],
                  transition: { duration: 8, repeat: Infinity, ease: "easeInOut" }
                }}
              />
              <motion.div
                className={`absolute -inset-2 sm:-inset-4 rounded-xl sm:rounded-3xl ${
                  isDarkMode ? 'bg-purple-500/10' : 'bg-purple-100'
                } transform rotate-3`}
                animate={{
                  rotate: [3, 5, 3],
                  transition: { duration: 8, repeat: Infinity, ease: "easeInOut" }
                }}
              />
              
              {/* Enhanced Hero Image with Glass Effect */}
              <motion.div 
                className={`relative rounded-xl sm:rounded-3xl overflow-hidden border ${
                  isDarkMode ? 'border-gray-700' : 'border-gray-200'
                } shadow-2xl max-h-[300px] sm:max-h-[400px] md:max-h-[450px]`}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className={`absolute inset-0 ${
                  isDarkMode ? 'bg-gradient-to-br from-blue-500/10 to-purple-500/10' : 'bg-gradient-to-br from-blue-100/50 to-purple-100/50'
                }`}></div>
                <img 
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=2070" 
                  alt="Retina Scan Technology" 
                  className="w-full h-full object-cover rounded-xl sm:rounded-3xl relative z-10"
                />
                <div className={`absolute inset-0 ${
                  isDarkMode ? 'bg-gradient-to-t from-gray-900/80 to-transparent' : 'bg-gradient-to-t from-white/80 to-transparent'
                }`}></div>
                
                {/* Interactive Hotspots */}
                {[
                  { top: '25%', left: '20%', color: 'blue', label: 'AI Detection' },
                  { top: '60%', left: '75%', color: 'purple', label: 'High Precision' },
                  { top: '80%', left: '30%', color: 'green', label: 'Fast Results' }
                ].map((spot, index) => (
                  <motion.div
                    key={index}
                    className="absolute"
                    style={{ top: spot.top, left: spot.left }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1.5 + index * 0.2, duration: 0.5 }}
                  >
                    <motion.div
                      className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                        spot.color === 'blue' ? 'bg-blue-500' : 
                        spot.color === 'purple' ? 'bg-purple-500' : 'bg-green-500'
                      } relative z-20 cursor-pointer group`}
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <motion.div
                        className={`absolute inset-0 rounded-full ${
                          spot.color === 'blue' ? 'bg-blue-500' : 
                          spot.color === 'purple' ? 'bg-purple-500' : 'bg-green-500'
                        } opacity-50`}
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      ></motion.div>
                      
                      {/* Tooltip on hover */}
                      <div className={`absolute opacity-0 group-hover:opacity-100 bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-1.5 py-0.5 text-xs font-medium rounded ${
                        isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900 shadow-md'
                      } whitespace-nowrap pointer-events-none transition-opacity duration-200`}>
                        {spot.label}
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
          
          {/* Enhanced Scroll Down Indicator */}
          <motion.div 
            className="absolute bottom-5 sm:bottom-10 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 1 }}
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
              className="flex flex-col items-center"
            >
              <span className={`hidden sm:inline text-xs sm:text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Scroll Down</span>
              <ArrowDownIcon className={`h-4 w-4 sm:h-5 sm:w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section 
        id="features" 
        ref={featuresRef} 
        className={`py-16 md:py-24 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-900'} relative overflow-hidden`}
      >
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Decorative grid pattern */}
          <div className={`absolute inset-0 opacity-5 ${isDarkMode ? 'opacity-5' : 'opacity-10'}`}>
            <div className="absolute inset-0 bg-grid-pattern bg-[length:30px_30px] sm:bg-[length:50px_50px]"></div>
          </div>
          
          {/* Animated blobs */}
          <motion.div 
            className={`absolute -right-16 -top-16 w-64 h-64 rounded-full ${
              isDarkMode ? 'bg-blue-900/20' : 'bg-blue-200/30'
            } blur-3xl`}
            animate={{
              scale: [1, 1.2, 1],
              x: [0, -20, 0],
              y: [0, 20, 0],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
          
          <motion.div 
            className={`absolute -left-16 -bottom-16 w-64 h-64 rounded-full ${
              isDarkMode ? 'bg-purple-900/20' : 'bg-purple-200/30'
            } blur-3xl`}
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 20, 0],
              y: [0, -20, 0],
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section header with enhanced animation */}
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-12 md:mb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible.features ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isVisible.features ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center justify-center p-2 mb-4 rounded-lg bg-opacity-25 backdrop-blur-sm border border-opacity-30"
              style={{
                background: isDarkMode 
                  ? 'rgba(59, 130, 246, 0.1)' 
                  : 'rgba(59, 130, 246, 0.1)',
                borderColor: isDarkMode 
                  ? 'rgba(59, 130, 246, 0.2)' 
                  : 'rgba(59, 130, 246, 0.2)'
              }}
            >
              <SparklesIcon className={`h-5 w-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              <span className={`ml-2 text-sm font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                Fitur Unggulan
              </span>
            </motion.div>
            
            <motion.h2 
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible.features ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Kenapa Memilih RetinaScan?
            </motion.h2>
            
            <motion.p 
              className={`text-base sm:text-lg md:text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible.features ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Solusi komprehensif dengan teknologi AI terkini untuk deteksi dan pencegahan retinopati diabetik
            </motion.p>
          </motion.div>

          {/* Enhanced Feature Cards Grid with Better Responsiveness */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate={isVisible.features ? "visible" : "hidden"}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={cardVariants}
                custom={index}
                whileHover="hover"
                whileTap="tap"
                className={`relative group rounded-xl sm:rounded-2xl p-6 sm:p-8 overflow-hidden ${
                  isDarkMode 
                    ? 'bg-gray-800/80 border border-gray-700 hover:border-gray-600' 
                    : 'bg-white/90 border border-gray-100 hover:border-gray-200 shadow-lg hover:shadow-xl'
                } transition-all duration-300`}
              >
                {/* Animated background gradient */}
                <motion.div 
                  className={`absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-100 -z-10 transition-opacity duration-300 ${
                    feature.color === 'blue' ? isDarkMode ? 'bg-gradient-to-br from-blue-900/30 to-transparent' : 'bg-gradient-to-br from-blue-50 to-transparent' :
                    feature.color === 'purple' ? isDarkMode ? 'bg-gradient-to-br from-purple-900/30 to-transparent' : 'bg-gradient-to-br from-purple-50 to-transparent' :
                    feature.color === 'green' ? isDarkMode ? 'bg-gradient-to-br from-green-900/30 to-transparent' : 'bg-gradient-to-br from-green-50 to-transparent' :
                    feature.color === 'red' ? isDarkMode ? 'bg-gradient-to-br from-red-900/30 to-transparent' : 'bg-gradient-to-br from-red-50 to-transparent' :
                    feature.color === 'amber' ? isDarkMode ? 'bg-gradient-to-br from-amber-900/30 to-transparent' : 'bg-gradient-to-br from-amber-50 to-transparent' :
                    isDarkMode ? 'bg-gradient-to-br from-indigo-900/30 to-transparent' : 'bg-gradient-to-br from-indigo-50 to-transparent'
                  }`}
                />
                
                {/* Enhanced Icon Container */}
                <motion.div 
                  className={`inline-flex items-center justify-center p-3 rounded-xl mb-5 ${
                    feature.color === 'blue' ? isDarkMode ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 text-blue-600' :
                    feature.color === 'purple' ? isDarkMode ? 'bg-purple-900/50 text-purple-400' : 'bg-purple-100 text-purple-600' :
                    feature.color === 'green' ? isDarkMode ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-600' :
                    feature.color === 'red' ? isDarkMode ? 'bg-red-900/50 text-red-400' : 'bg-red-100 text-red-600' :
                    feature.color === 'amber' ? isDarkMode ? 'bg-amber-900/50 text-amber-400' : 'bg-amber-100 text-amber-600' :
                    isDarkMode ? 'bg-indigo-900/50 text-indigo-400' : 'bg-indigo-100 text-indigo-600'
                  }`}
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.1, rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  {feature.icon}
                </motion.div>
                
                {/* Feature title and description */}
                <h3 className={`text-xl sm:text-2xl font-bold mb-2 ${
                  feature.color === 'blue' ? isDarkMode ? 'text-blue-400' : 'text-blue-600' :
                  feature.color === 'purple' ? isDarkMode ? 'text-purple-400' : 'text-purple-600' :
                  feature.color === 'green' ? isDarkMode ? 'text-green-400' : 'text-green-600' :
                  feature.color === 'red' ? isDarkMode ? 'text-red-400' : 'text-red-600' :
                  feature.color === 'amber' ? isDarkMode ? 'text-amber-400' : 'text-amber-600' :
                  isDarkMode ? 'text-indigo-400' : 'text-indigo-600'
                }`}>
                  {feature.title}
                </h3>
                
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {feature.description}
                </p>
                
                {/* Learn more link with animation */}
                <motion.div 
                  className={`mt-4 inline-flex items-center font-medium ${
                    feature.color === 'blue' ? isDarkMode ? 'text-blue-400' : 'text-blue-600' :
                    feature.color === 'purple' ? isDarkMode ? 'text-purple-400' : 'text-purple-600' :
                    feature.color === 'green' ? isDarkMode ? 'text-green-400' : 'text-green-600' :
                    feature.color === 'red' ? isDarkMode ? 'text-red-400' : 'text-red-600' :
                    feature.color === 'amber' ? isDarkMode ? 'text-amber-400' : 'text-amber-600' :
                    isDarkMode ? 'text-indigo-400' : 'text-indigo-600'
                  } opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  initial={{ x: -10 }}
                  whileHover={{ x: 0 }}
                >
                  <span>Pelajari Lebih Lanjut</span>
                  <ArrowRightIcon className="h-4 w-4 ml-1" />
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
                      className="relative z-10 rounded-xl shadow-xl w-full h-auto object-cover max-h-[300px] sm:max-h-[350px] md:max-h-[400px]"
                    />
                  </div>
                </motion.div>
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section 
        id="testimonials"
        ref={testimonialsRef}
        className={`py-16 md:py-24 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} relative overflow-hidden`}
      >
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div 
            className={`absolute top-0 right-0 w-1/3 h-1/3 ${
              isDarkMode ? 'bg-blue-500/5' : 'bg-blue-100/50'
            } rounded-bl-full blur-3xl`}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.7, 0.5],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className={`absolute bottom-0 left-0 w-1/3 h-1/3 ${
              isDarkMode ? 'bg-purple-500/5' : 'bg-purple-100/50'
            } rounded-tr-full blur-3xl`}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.7, 0.5],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section header */}
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-12 md:mb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible.testimonials ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isVisible.testimonials ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center justify-center p-2 mb-4 rounded-lg bg-opacity-25 backdrop-blur-sm border border-opacity-30"
              style={{
                background: isDarkMode 
                  ? 'rgba(139, 92, 246, 0.1)' 
                  : 'rgba(139, 92, 246, 0.1)',
                borderColor: isDarkMode 
                  ? 'rgba(139, 92, 246, 0.2)' 
                  : 'rgba(139, 92, 246, 0.2)'
              }}
            >
              <UserGroupIcon className={`h-5 w-5 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
              <span className={`ml-2 text-sm font-medium ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                Testimoni
              </span>
            </motion.div>
            
            <motion.h2 
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible.testimonials ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Apa Kata Mereka?
            </motion.h2>
            
            <motion.p 
              className={`text-base sm:text-lg md:text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible.testimonials ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Pendapat dari para dokter dan pasien yang telah menggunakan RetinaScan
            </motion.p>
          </motion.div>
          
          {/* Enhanced Testimonial Cards */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
            variants={staggerContainer}
            initial="hidden"
            animate={isVisible.testimonials ? "visible" : "hidden"}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                custom={index}
                whileHover="hover"
                whileTap="tap"
                className={`rounded-2xl p-6 sm:p-8 ${
                  isDarkMode 
                    ? 'bg-gray-800 border border-gray-700' 
                    : 'bg-white border border-gray-100 shadow-lg'
                } relative overflow-hidden group`}
              >
                {/* Decorative quotation mark */}
                <div className={`absolute top-4 right-4 text-6xl leading-none ${
                  isDarkMode ? 'text-gray-700' : 'text-gray-100'
                } font-serif`}>
                  "
                </div>
                
                <div className="relative z-10">
                  {/* Quote */}
                  <p className={`mb-6 text-lg italic ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    "{testimonial.quote}"
                  </p>
                  
                  {/* Author info */}
                  <div className="flex items-center">
                    <div className="mr-4 relative">
                      <motion.div 
                        className="absolute inset-0 rounded-full"
                        animate={{
                          boxShadow: [
                            `0 0 0 0px ${isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.3)'}`,
                            `0 0 0 4px ${isDarkMode ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.1)'}`,
                            `0 0 0 0px ${isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.3)'}`
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name} 
                        className="w-12 h-12 rounded-full object-cover border-2 border-white"
                      />
                    </div>
                    
                    <div>
                      <h4 className="font-bold">{testimonial.name}</h4>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {testimonial.title}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Enhanced CTA Section */}
      <section 
        id="cta" 
        ref={ctaRef}
        className={`py-16 md:py-24 relative overflow-hidden ${
          isDarkMode 
            ? 'bg-gradient-to-br from-gray-900 via-blue-900/30 to-gray-900 text-white' 
            : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 text-gray-900'
        }`}
      >
        {/* Enhanced animated gradient background */}
        <motion.div 
          className="absolute inset-0 z-0 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          {/* Main animated gradient with CSS */}
          <div className="absolute inset-0 animated-gradient" 
            style={{
              background: isDarkMode 
                ? 'linear-gradient(120deg, rgba(79, 70, 229, 0.1), rgba(67, 56, 202, 0.1), rgba(29, 78, 216, 0.1))'
                : 'linear-gradient(120deg, rgba(139, 92, 246, 0.15), rgba(79, 70, 229, 0.15), rgba(59, 130, 246, 0.15))'
            }}
          />
          
          {/* Animated blobs */}
          <div className="blob bg-indigo-400 dark:bg-indigo-600 h-96 w-96 top-0 right-0 opacity-10 dark:opacity-5" />
          <div className="blob bg-blue-400 dark:bg-blue-600 h-96 w-96 bottom-0 left-0 opacity-10 dark:opacity-5" 
               style={{animationDelay: '-3s'}} />
          <div className="blob bg-purple-400 dark:bg-purple-600 h-72 w-72 top-1/2 right-1/3 -translate-y-1/2 opacity-10 dark:opacity-5"
               style={{animationDelay: '-5s'}} />
          
          {/* Main animated gradient with Framer Motion */}
          <motion.div 
            className="absolute -inset-[100px] filter blur-3xl opacity-30"
            animate={{
              background: isDarkMode 
                ? [
                    'radial-gradient(circle at 70% 30%, rgba(79, 70, 229, 0.15) 0%, rgba(14, 165, 233, 0.1) 50%, rgba(10, 10, 10, 0) 80%)',
                    'radial-gradient(circle at 30% 60%, rgba(79, 70, 229, 0.15) 0%, rgba(14, 165, 233, 0.1) 50%, rgba(10, 10, 10, 0) 80%)',
                    'radial-gradient(circle at 50% 40%, rgba(79, 70, 229, 0.15) 0%, rgba(14, 165, 233, 0.1) 50%, rgba(10, 10, 10, 0) 80%)',
                    'radial-gradient(circle at 70% 30%, rgba(79, 70, 229, 0.15) 0%, rgba(14, 165, 233, 0.1) 50%, rgba(10, 10, 10, 0) 80%)',
                  ]
                : [
                    'radial-gradient(circle at 70% 30%, rgba(79, 70, 229, 0.3) 0%, rgba(56, 189, 248, 0.2) 50%, rgba(255, 255, 255, 0) 80%)',
                    'radial-gradient(circle at 30% 60%, rgba(79, 70, 229, 0.3) 0%, rgba(56, 189, 248, 0.2) 50%, rgba(255, 255, 255, 0) 80%)',
                    'radial-gradient(circle at 50% 40%, rgba(79, 70, 229, 0.3) 0%, rgba(56, 189, 248, 0.2) 50%, rgba(255, 255, 255, 0) 80%)',
                    'radial-gradient(circle at 70% 30%, rgba(79, 70, 229, 0.3) 0%, rgba(56, 189, 248, 0.2) 50%, rgba(255, 255, 255, 0) 80%)',
                  ],
            }}
            transition={{
              background: {
                duration: 18,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.33, 0.66, 1]
              }
            }}
          />
          
          {/* Subtle mouse-responsive overlay */}
          <motion.div 
            className="absolute inset-0"
            style={{
              background: isDarkMode 
                ? 'radial-gradient(circle at 50% 50%, rgba(79, 70, 229, 0.05), rgba(10, 10, 10, 0))'
                : 'radial-gradient(circle at 50% 50%, rgba(79, 70, 229, 0.1), rgba(255, 255, 255, 0))',
              backgroundSize: '120% 120%',
              backgroundPosition: `${50 + x * 10}% ${50 + y * 10}%`,
              transition: 'background-position 2s cubic-bezier(0.19, 1, 0.22, 1)',
            }}
          />
          
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-grid-pattern opacity-30 dark:opacity-10 
                         bg-[length:20px_20px] sm:bg-[length:30px_30px]"></div>
        </motion.div>
        
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 30%, ${
                isDarkMode 
                  ? 'rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0) 50%' 
                  : 'rgba(59, 130, 246, 0.4) 0%, rgba(59, 130, 246, 0) 50%'
              })`,
            }}
          />
          
          <motion.div 
            className="absolute -top-24 -right-24 w-96 h-96 rounded-full"
            style={{
              background: isDarkMode 
                ? 'radial-gradient(circle, rgba(79, 70, 229, 0.2) 0%, rgba(79, 70, 229, 0) 70%)' 
                : 'radial-gradient(circle, rgba(79, 70, 229, 0.4) 0%, rgba(79, 70, 229, 0) 70%)',
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.7, 0.5],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Floating particles */}
          {[...Array(5)].map((_, i) => (
            <motion.div 
              key={i}
              className={`absolute rounded-full ${isDarkMode ? 'bg-blue-400/30' : 'bg-blue-500/20'} w-2 h-2`}
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
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible.cta ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={isVisible.cta ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`inline-flex items-center justify-center p-3 rounded-full mb-6 ${
                isDarkMode ? 'bg-blue-900/50' : 'bg-blue-100'
              }`}
            >
              <EyeIcon className={`h-8 w-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </motion.div>
            
            <motion.h2 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible.cta ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Mulai Deteksi Dini Retinopati Diabetik Sekarang
            </motion.h2>
            
            <motion.p 
              className={`text-lg sm:text-xl mb-8 max-w-2xl mx-auto ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible.cta ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Lindungi kesehatan mata Anda dengan teknologi AI terkini. Daftar sekarang dan dapatkan analisis retina pertama secara gratis.
            </motion.p>
            
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible.cta ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {isAuthenticated ? (
                <motion.div whileHover="hover" whileTap="tap" variants={buttonVariants}>
                  <a 
                    href={DASHBOARD_URL} 
                    className={`px-8 py-4 rounded-lg font-medium flex items-center justify-center ${
                      isDarkMode 
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white' 
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
                    } transition-all duration-300 shadow-lg`}
                  >
                    <span>Buka Dashboard</span>
                    <motion.span
                      initial={{ x: 0 }}
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ArrowRightIcon className="ml-2 h-5 w-5" />
                    </motion.span>
                  </a>
                </motion.div>
              ) : (
                <>
                  <motion.div whileHover="hover" whileTap="tap" variants={buttonVariants}>
                    <Link 
                      to="/register" 
                      className={`px-8 py-4 rounded-lg font-medium flex items-center justify-center ${
                        isDarkMode 
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white' 
                          : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
                      } transition-all duration-300 shadow-lg`}
                    >
                      <span>Daftar Sekarang</span>
                      <motion.span
                        initial={{ x: 0 }}
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ArrowRightIcon className="ml-2 h-5 w-5" />
                      </motion.span>
                    </Link>
                  </motion.div>
                  
                  <motion.div whileHover="hover" whileTap="tap" variants={buttonVariants}>
                    <Link 
                      to="/login" 
                      className={`px-8 py-4 rounded-lg font-medium flex items-center justify-center ${
                        isDarkMode 
                          ? 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700' 
                          : 'bg-white hover:bg-gray-100 text-gray-900 border border-gray-200 shadow-md'
                      } transition-colors duration-300`}
                    >
                      Login
                    </Link>
                  </motion.div>
                </>
              )}
            </motion.div>
            
            {/* Trust indicators */}
            <motion.div 
              className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-10"
              initial={{ opacity: 0 }}
              animate={isVisible.cta ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <div className="flex items-center">
                <ShieldCheckIcon className={`h-5 w-5 mr-2 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Data Aman & Terenkripsi
                </span>
              </div>
              
              <div className="flex items-center">
                <CheckCircleIcon className={`h-5 w-5 mr-2 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Terintegrasi dengan 50+ Rumah Sakit
                </span>
              </div>
              
              <div className="flex items-center">
                <BeakerIcon className={`h-5 w-5 mr-2 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Diuji Secara Klinis
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default withPageTransition(LandingPage);