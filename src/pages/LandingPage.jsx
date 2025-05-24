import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
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
  CheckCircleIcon
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
        className="relative min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 pt-16 pb-24"
      >
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-0 w-64 h-64 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-1/3 right-0 w-80 h-80 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-gradient-to-r from-red-400 to-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Hero Content */}
            <motion.div 
              className="lg:w-1/2 text-center lg:text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                Deteksi Dini Retinopati Diabetik dengan AI
              </h1>
              
              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0">
                Teknologi AI canggih untuk mendeteksi penyakit retina dengan cepat dan akurat. Lindungi penglihatan Anda dengan diagnosis dini.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
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
              </div>
            </motion.div>
            
            {/* Hero Animation */}
            <motion.div 
              className="lg:w-1/2 h-64 sm:h-80 md:h-96 lg:h-[500px]"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <LottieAnimation
                animationData={lottieConfig.animations.hero}
                loop={true}
              />
            </motion.div>
          </div>
          
          {/* Scroll Down Indicator */}
          <motion.div 
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            onClick={scrollToFeatures}
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="flex flex-col items-center"
            >
              <span className="text-sm text-gray-500 dark:text-gray-400 mb-2">Scroll Down</span>
              <ArrowDownIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
      
      {/* Features Section */}
      <section 
        id="features" 
        ref={featuresRef}
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-indigo-50 dark:from-gray-900 dark:to-indigo-950"
      >
        <div className="container mx-auto max-w-7xl">
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                Fitur Unggulan
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Teknologi terdepan untuk deteksi dini dan pencegahan penyakit retina
              </p>
            </div>
          </ScrollReveal>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <ScrollReveal 
                key={index} 
                animation={feature.animation}
                delay={index * 0.1}
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
                  <div className={`h-2 bg-gradient-to-r ${feature.color}`}></div>
                  <div className="p-6">
                    <div className={`w-12 h-12 rounded-lg mb-4 flex items-center justify-center bg-gradient-to-br ${feature.color} text-white`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <ParticlesBackground 
          color="rgba(79, 70, 229, 0.1)" 
          count={30} 
          speed={0.2} 
          type="pulse" 
        />
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                Bagaimana RetinaScan Bekerja
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Proses sederhana dengan hasil yang akurat
              </p>
            </div>
          </ScrollReveal>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ScrollReveal animation="fade-right" delay={0.1}>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80">
                <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  Unggah Gambar Retina
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Unggah gambar fundus retina dari perangkat pencitraan Anda ke platform kami yang aman.
                </p>
              </div>
            </ScrollReveal>
            
            <ScrollReveal animation="fade-up" delay={0.2}>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80">
                <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  Analisis AI Otomatis
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Algoritma AI kami menganalisis gambar, mendeteksi kelainan dan tanda-tanda penyakit retina.
                </p>
              </div>
            </ScrollReveal>
            
            <ScrollReveal animation="fade-left" delay={0.3}>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80">
                <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  Laporan Hasil Lengkap
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Dapatkan laporan terperinci dengan visualisasi dan rekomendasi tindak lanjut dalam hitungan detik.
                </p>
              </div>
            </ScrollReveal>
          </div>
          
          <ScrollReveal animation="fade-up" delay={0.4}>
            <div className="mt-16 text-center">
              <Link to={isAuthenticated ? `${DASHBOARD_URL}?token=${token}` : "/register"}>
                <AnimatedButton variant="primary" size="lg">
                  <span className="flex items-center">
                    {isAuthenticated ? 'Buka Dashboard' : 'Coba Sekarang'}
                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                  </span>
                </AnimatedButton>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
      
      {/* Stats Section */}
      <section 
        ref={statsRef}
        className="py-20 px-4 sm:px-6 lg:px-8 bg-indigo-700 dark:bg-indigo-900 text-white"
      >
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <ScrollReveal 
                key={index} 
                animation={stat.animation}
                delay={stat.delay}
              >
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                  <div className="text-indigo-200">{stat.label}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="container mx-auto max-w-7xl">
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                Dipercaya oleh Profesional Medis
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Lihat apa kata para dokter dan tenaga medis tentang RetinaScan
              </p>
            </div>
          </ScrollReveal>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ScrollReveal animation="fade-up" delay={0.1}>
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mr-4">
                    <UserGroupIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">dr. Surya Wijaya</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Spesialis Mata, RS Premier</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  "RetinaScan telah membantu kami mendeteksi kasus retinopati diabetik lebih awal, sehingga pasien bisa mendapatkan penanganan sebelum kondisi memburuk."
                </p>
              </div>
            </ScrollReveal>
            
            <ScrollReveal animation="fade-up" delay={0.2}>
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mr-4">
                    <UserGroupIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">dr. Anita Pratiwi</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Dokter Umum, Klinik Sehat</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  "Akurasi yang tinggi dan kemudahan penggunaan membuat RetinaScan menjadi alat yang sangat berharga dalam praktik sehari-hari kami."
                </p>
              </div>
            </ScrollReveal>
            
            <ScrollReveal animation="fade-up" delay={0.3}>
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mr-4">
                    <UserGroupIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Prof. Dr. Budi Santoso</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Direktur RS Mata Indonesia</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  "Teknologi AI RetinaScan telah membantu kami meningkatkan efisiensi dan mengurangi waktu tunggu pasien, sementara tetap mempertahankan standar diagnosis yang tinggi."
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section 
        ref={ctaRef}
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-800 dark:to-purple-800 text-white relative overflow-hidden"
      >
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-10"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-10"></div>
        </div>
        
        <div className="container mx-auto max-w-4xl relative z-10">
          <ScrollReveal animation="fade-up">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Mulai Deteksi Dini Sekarang
              </h2>
              <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
                Lindungi penglihatan Anda dan pasien Anda dengan teknologi AI canggih untuk deteksi dini penyakit retina.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
              
              <div className="mt-8 flex items-center justify-center space-x-2">
                <CheckCircleIcon className="h-5 w-5 text-indigo-200" />
                <span className="text-indigo-100">Mulai dalam 5 menit</span>
                <span className="mx-2 text-indigo-300">•</span>
                <CheckCircleIcon className="h-5 w-5 text-indigo-200" />
                <span className="text-indigo-100">Tanpa kontrak jangka panjang</span>
                <span className="mx-2 text-indigo-300">•</span>
                <CheckCircleIcon className="h-5 w-5 text-indigo-200" />
                <span className="text-indigo-100">Dukungan 24/7</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default withPageTransition(LandingPage);