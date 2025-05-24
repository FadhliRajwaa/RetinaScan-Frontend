import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useState, useEffect, useRef } from 'react';
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

// Import komponen animasi
import AnimatedBackground from '../components/animations/AnimatedBackground';
import ParticlesBackground from '../components/animations/ParticlesBackground';
import AnimatedText from '../components/animations/AnimatedText';
import AnimatedButton from '../components/animations/AnimatedButton';

function LandingPage() {
  const { theme } = useTheme();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState('');
  const heroRef = useRef(null);
  
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
  
  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
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

  return (
    <div className="overflow-hidden">
      {/* Hero Section dengan Animated Background */}
      <section className="relative min-h-screen flex items-center">
        <AnimatedBackground 
          effectType="BIRDS" 
          customConfig={{ 
            backgroundColor: 0x111827,
            color1: 0x3b82f6,
            color2: 0x8b5cf6
          }}
          className="min-h-screen"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-20">
            <div className="text-center">
              <AnimatedText
                text="Deteksi Dini"
                type="letters"
                className="text-4xl md:text-6xl font-bold mb-2 text-white"
                delay={0.3}
              />
              
              <AnimatedText
                text="Retinopati Diabetik"
                type="letters"
                className="text-4xl md:text-6xl font-bold mb-6 text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
                delay={0.6}
              />
              
              <AnimatedText
                text="Solusi berbasis AI untuk tim medis dalam mendeteksi dan mengklasifikasikan tingkat keparahan retinopati diabetik melalui analisis citra fundus retina secara cepat dan akurat."
                className="text-lg md:text-xl mb-8 text-blue-100 max-w-3xl mx-auto"
                delay={0.9}
              />
            
            {/* Medical Info Card */}
            <motion.div
              className="mb-10 p-6 rounded-xl mx-auto max-w-3xl"
              style={{ ...theme.glassEffect }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
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
            
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              {isAuthenticated ? (
                <a href={`${DASHBOARD_URL}?token=${token}`}>
                    <AnimatedButton
                      variant="primary"
                      size="lg"
                      withGlow
                      withGradient
                      gradientColors={['#3b82f6', '#8b5cf6']}
                  >
                    Mulai Sekarang
                    <ArrowRightIcon className="w-5 h-5 ml-2" />
                    </AnimatedButton>
                </a>
              ) : (
                <>
                  <Link to="/register">
                      <AnimatedButton
                        variant="primary"
                        size="lg"
                        withGlow
                        withGradient
                        gradientColors={['#3b82f6', '#8b5cf6']}
                    >
                      Mulai Sekarang
                      <ArrowRightIcon className="w-5 h-5 ml-2" />
                      </AnimatedButton>
                  </Link>
                  <Link to="/login">
                      <AnimatedButton
                        variant="outline"
                        size="lg"
                        className="bg-white/10 border-white text-white hover:bg-white/20"
                    >
                      Login
                      </AnimatedButton>
                  </Link>
                </>
              )}
              </div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.5 }}
              className="flex justify-center"
                onClick={() => scrollToSection(heroRef)}
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
        </AnimatedBackground>
        
        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
            <path fill="#ffffff" fillOpacity="1" d="M0,256L48,234.7C96,213,192,171,288,154.7C384,139,480,149,576,165.3C672,181,768,203,864,197.3C960,192,1056,160,1152,154.7C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* Features Section dengan ParticlesBackground */}
      <section className="py-20 bg-white relative" ref={heroRef}>
        <ParticlesBackground 
          preset="bubbles" 
          customOptions={{
            particles: {
              color: {
                value: ["#3b82f6", "#8b5cf6", "#10B981"]
              },
              opacity: {
                value: 0.3
              }
            }
          }}
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
            custom={0}
          >
            <AnimatedText
              text="Fitur Utama untuk Tim Medis"
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              highlight
              highlightColor="rgba(59, 130, 246, 0.1)"
            />
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
              <p className="text-gray-600 mb-4">Dapatkan laporan terstruktur yang mudah dibaca dengan detail analisis komprehensif.</p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5 h-4 w-4 rounded-full bg-green-100 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  </div>
                  <span>Ekspor ke PDF atau integrasi EMR</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5 h-4 w-4 rounded-full bg-green-100 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  </div>
                  <span>Visualisasi area yang terdeteksi</span>
                </li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="relative py-20 overflow-hidden">
        <AnimatedBackground 
          effectType="WAVES" 
          customConfig={{ 
            color: 0x3b82f6,
            waveHeight: 15,
            waveSpeed: 0.5
          }}
          className="min-h-[400px]"
          overlayOpacity={0.7}
          overlayColor="rgba(17, 24, 39, 0.7)"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center relative z-20">
            <AnimatedText
              text="Mulai Deteksi Retinopati Diabetik Sekarang"
              type="letters"
              className="text-3xl md:text-4xl font-bold text-white mb-6"
            />
            
            <AnimatedText
              text="Bergabunglah dengan ribuan profesional medis yang telah menggunakan RetinaScan untuk meningkatkan diagnosis dan perawatan pasien diabetes."
              className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto"
              delay={0.5}
            />
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                {isAuthenticated ? (
                  <a href={`${DASHBOARD_URL}?token=${token}`}>
                  <AnimatedButton
                    variant="light"
                    size="lg"
                    withGlow="rgba(255, 255, 255, 0.5)"
                  >
                    Akses Dashboard
                    <ArrowRightIcon className="w-5 h-5 ml-2" />
                  </AnimatedButton>
                  </a>
                ) : (
                <>
                  <Link to="/register">
                    <AnimatedButton
                      variant="light"
                      size="lg"
                      withGlow="rgba(255, 255, 255, 0.5)"
                    >
                      Daftar Sekarang
                      <ArrowRightIcon className="w-5 h-5 ml-2" />
                    </AnimatedButton>
                  </Link>
                  <Link to="/login">
                    <AnimatedButton
                      variant="outline"
                      size="lg"
                      className="border-white text-white hover:bg-white/20"
                    >
                      Login
                    </AnimatedButton>
                  </Link>
                </>
                )}
            </div>
        </div>
        </AnimatedBackground>
      </section>
    </div>
  );
}

export default LandingPage;