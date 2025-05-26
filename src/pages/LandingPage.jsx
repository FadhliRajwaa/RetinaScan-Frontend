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
  LockClosedIcon
} from '@heroicons/react/24/outline';
import { withPageTransition } from '../context/ThemeContext';
import { ParallaxBanner, Parallax } from 'react-scroll-parallax';

function LandingPage() {
  const { theme, animations, isDarkMode } = useTheme();
  const [isVisible, setIsVisible] = useState({
    features: false,
    about: false,
    testimonials: false,
    cta: false
  });
  
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
      {/* Hero Section with Parallax */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
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

        {/* Floating shapes */}
        <div className="absolute inset-0 overflow-hidden">
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
        </div>
        
        {/* Hero content */}
        <motion.div 
          className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10"
          style={{ 
            y: heroY,
            scale: heroScale,
            opacity: heroOpacity
          }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-6"
            >
              <EyeIcon className={`mx-auto h-16 w-16 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </motion.div>
            
            <motion.h1 
              className={`text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              Deteksi Dini <span className={isDarkMode ? 'text-blue-400' : 'text-blue-600'}>Retinopati Diabetik</span> dengan AI
            </motion.h1>
            
            <motion.p 
              className={`text-xl mb-10 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
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
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  to="/register" 
                  className={`px-8 py-3 rounded-lg font-medium flex items-center justify-center ${
                    isDarkMode 
                      ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  } transition-colors duration-300`}
                >
                  Mulai Sekarang
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  to="/#features" 
                  className={`px-8 py-3 rounded-lg font-medium flex items-center justify-center ${
                    isDarkMode 
                      ? 'bg-gray-800 hover:bg-gray-700 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  } transition-colors duration-300`}
                >
                  Pelajari Lebih Lanjut
                </Link>
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
        </motion.div>
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
            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Fitur Unggulan
            </h2>
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
                } shadow-lg hover:shadow-xl transition-all duration-300`}
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible.features ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                whileHover={{ y: -5 }}
              >
                <div className={`inline-block p-3 rounded-lg mb-4 ${
                  feature.color === 'blue' ? isDarkMode ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 text-blue-600' :
                  feature.color === 'purple' ? isDarkMode ? 'bg-purple-900/50 text-purple-400' : 'bg-purple-100 text-purple-600' :
                  feature.color === 'green' ? isDarkMode ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-600' :
                  feature.color === 'red' ? isDarkMode ? 'bg-red-900/50 text-red-400' : 'bg-red-100 text-red-600' :
                  feature.color === 'amber' ? isDarkMode ? 'bg-amber-900/50 text-amber-400' : 'bg-amber-100 text-amber-600' :
                  isDarkMode ? 'bg-indigo-900/50 text-indigo-400' : 'bg-indigo-100 text-indigo-600'
                }`}>
                  {feature.icon}
                </div>
                <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {feature.title}
                </h3>
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
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