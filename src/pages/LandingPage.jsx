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
import { withPageTransition } from '../context/ThemeContext';
import { newTheme, enhancedAnimations, lottieConfig } from '../utils/newTheme';
import LottieAnimation from '../components/LottieAnimation';
import ParticlesBackground from '../components/ParticlesBackground';
import AnimatedButton from '../components/AnimatedButton';

const LandingPage = () => {
  const { theme, animations } = useTheme();
  const [animateParticles, setAnimateParticles] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState('');
  const [scrollY, setScrollY] = useState(0);
  
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
  
  // Effect untuk mendeteksi scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

  // Variasi animasi untuk elemen yang muncul saat di-scroll
  const scrollRevealVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <div style={{ overflow: 'hidden' }}>
      {/* Background Particles */}
      <ParticlesBackground color="rgba(79, 70, 229, 0.3)" count={100} speed={0.5} />

      {/* Hero Section */}
      <section
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          padding: '2rem',
          overflow: 'hidden',
        }}
      >
        {/* Decorative Circles */}
        <motion.div
          style={{
            position: 'absolute',
            width: '40rem',
            height: '40rem',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(79, 70, 229, 0.1) 0%, rgba(79, 70, 229, 0) 70%)',
            top: '-20%',
            right: '-10%',
            zIndex: -1,
          }}
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, 5, 0],
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        
        <motion.div
          style={{
            position: 'absolute',
            width: '30rem',
            height: '30rem',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, rgba(6, 182, 212, 0) 70%)',
            bottom: '-10%',
            left: '-5%',
            zIndex: -1,
          }}
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, -5, 0],
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />

        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            zIndex: 1,
          }}
        >
          {/* Hero Content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={enhancedAnimations.container}
          >
            {/* Badge */}
            <motion.div
              variants={enhancedAnimations.item}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                background: newTheme.glass.light.background,
                backdropFilter: newTheme.glass.light.backdropFilter,
                border: newTheme.glass.light.border,
                borderRadius: '9999px',
                padding: '0.5rem 1rem',
                marginBottom: '1.5rem',
                boxShadow: newTheme.shadows.sm,
              }}
            >
              <span
                style={{
                  width: '0.5rem',
                  height: '0.5rem',
                  borderRadius: '50%',
                  background: newTheme.primary,
                  marginRight: '0.5rem',
                }}
              />
              <span
                style={{
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: newTheme.text.accent,
                }}
              >
                Teknologi Terkini untuk Kesehatan Mata
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={enhancedAnimations.item}
              style={{
                fontSize: '3.5rem',
                fontWeight: '800',
                lineHeight: '1.1',
                marginBottom: '1.5rem',
                background: newTheme.gradients.retina,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textFillColor: 'transparent',
              }}
            >
              Deteksi Dini Retinopati Diabetik dengan AI
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={enhancedAnimations.item}
              style={{
                fontSize: '1.25rem',
                lineHeight: '1.7',
                color: newTheme.text.secondary,
                maxWidth: '800px',
                margin: '0 auto 2rem',
              }}
            >
              Solusi inovatif berbasis kecerdasan buatan untuk mendeteksi retinopati diabetik pada tahap awal, 
              membantu mencegah kebutaan dan meningkatkan kualitas hidup pasien diabetes.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={enhancedAnimations.item}
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem',
                justifyContent: 'center',
                marginBottom: '3rem',
              }}
            >
              {isAuthenticated ? (
                <a href={DASHBOARD_URL}>
                  <AnimatedButton 
                    variant="primary" 
                    size="lg"
                  >
                    Buka Dashboard
                  </AnimatedButton>
                </a>
              ) : (
                <>
                  <Link to="/login">
                    <AnimatedButton 
                      variant="primary" 
                      size="lg"
                    >
                      Mulai Sekarang
                    </AnimatedButton>
                  </Link>
                  <Link to="/register">
                    <AnimatedButton 
                      variant="outline" 
                      size="lg"
                    >
                      Daftar Akun
                    </AnimatedButton>
                  </Link>
                </>
              )}
            </motion.div>
          </motion.div>

          {/* Hero Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            style={{
              width: '100%',
              maxWidth: '600px',
              height: '400px',
              margin: '0 auto',
            }}
          >
            <LottieAnimation
              animationData={lottieConfig.animations.eyeScan}
              loop={true}
              autoplay={true}
            />
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          style={{
            position: 'absolute',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
          }}
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          onClick={() => window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth',
          })}
        >
          <span style={{ color: newTheme.text.secondary, marginBottom: '0.5rem', fontSize: '0.875rem' }}>
            Scroll untuk melihat lebih banyak
          </span>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke={newTheme.primary}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
          </svg>
        </motion.div>
      </section>

      {/* Features Section */}
      <section
        style={{
          padding: '6rem 2rem',
          background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(239,246,255,0.5) 100%)',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
          }}
        >
          {/* Section Header */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={scrollRevealVariants}
            style={{
              textAlign: 'center',
              marginBottom: '4rem',
            }}
          >
            <h2
              style={{
                fontSize: '2.5rem',
                fontWeight: '700',
                marginBottom: '1rem',
                color: newTheme.text.primary,
              }}
            >
              Fitur Unggulan
            </h2>
            <p
              style={{
                fontSize: '1.125rem',
                color: newTheme.text.secondary,
                maxWidth: '700px',
                margin: '0 auto',
              }}
            >
              Sistem kami menggabungkan teknologi AI terkini dengan pengalaman pengguna yang intuitif untuk memberikan solusi deteksi retinopati diabetik yang akurat dan mudah digunakan.
            </p>
          </motion.div>

          {/* Features Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem',
            }}
          >
            {/* Feature 1 */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={scrollRevealVariants}
              style={{
                background: 'white',
                borderRadius: '1rem',
                padding: '2rem',
                boxShadow: newTheme.shadows.md,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
              }}
            >
              <div
                style={{
                  width: '3rem',
                  height: '3rem',
                  borderRadius: '0.75rem',
                  background: 'rgba(79, 70, 229, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={newTheme.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </div>
              <h3
                style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  marginBottom: '0.75rem',
                  color: newTheme.text.primary,
                }}
              >
                Deteksi Cepat & Akurat
              </h3>
              <p
                style={{
                  color: newTheme.text.secondary,
                  lineHeight: '1.6',
                }}
              >
                Algoritma AI kami dapat mendeteksi tanda-tanda retinopati diabetik dengan akurasi tinggi dalam hitungan detik, membantu diagnosis dini dan penanganan yang tepat.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={scrollRevealVariants}
              style={{
                background: 'white',
                borderRadius: '1rem',
                padding: '2rem',
                boxShadow: newTheme.shadows.md,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              }}
            >
              <div
                style={{
                  width: '3rem',
                  height: '3rem',
                  borderRadius: '0.75rem',
                  background: 'rgba(6, 182, 212, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={newTheme.secondary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                  <line x1="8" y1="21" x2="16" y2="21"></line>
                  <line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>
              </div>
              <h3
                style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  marginBottom: '0.75rem',
                  color: newTheme.text.primary,
                }}
              >
                Antarmuka Pengguna Intuitif
              </h3>
              <p
                style={{
                  color: newTheme.text.secondary,
                  lineHeight: '1.6',
                }}
              >
                Platform yang mudah digunakan untuk dokter dan tenaga medis, dengan dashboard yang informatif dan alur kerja yang efisien untuk mengelola data pasien.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={scrollRevealVariants}
              style={{
                background: 'white',
                borderRadius: '1rem',
                padding: '2rem',
                boxShadow: newTheme.shadows.md,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
              }}
            >
              <div
                style={{
                  width: '3rem',
                  height: '3rem',
                  borderRadius: '0.75rem',
                  background: 'rgba(139, 92, 246, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={newTheme.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <h3
                style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  marginBottom: '0.75rem',
                  color: newTheme.text.primary,
                }}
              >
                Keamanan Data Terjamin
              </h3>
              <p
                style={{
                  color: newTheme.text.secondary,
                  lineHeight: '1.6',
                }}
              >
                Kami memprioritaskan keamanan data pasien dengan enkripsi end-to-end dan kepatuhan terhadap standar privasi kesehatan internasional.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        style={{
          padding: '6rem 2rem',
          background: `linear-gradient(135deg, rgba(79, 70, 229, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative Elements */}
        <motion.div
          style={{
            position: 'absolute',
            top: '20%',
            left: '5%',
            width: '15rem',
            height: '15rem',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(79, 70, 229, 0.1) 0%, rgba(79, 70, 229, 0) 70%)',
            zIndex: 0,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        
        <motion.div
          style={{
            position: 'absolute',
            bottom: '10%',
            right: '10%',
            width: '20rem',
            height: '20rem',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0) 70%)',
            zIndex: 0,
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />

        <div
          style={{
            maxWidth: '1000px',
            margin: '0 auto',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={scrollRevealVariants}
            style={{
              background: 'white',
              borderRadius: '1.5rem',
              padding: '3rem',
              boxShadow: newTheme.shadows.xl,
              textAlign: 'center',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {/* Glass Effect Overlay */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '6px',
                background: newTheme.gradients.retina,
                borderTopLeftRadius: '1.5rem',
                borderTopRightRadius: '1.5rem',
              }}
            />
            
            <h2
              style={{
                fontSize: '2.5rem',
                fontWeight: '700',
                marginBottom: '1.5rem',
                color: newTheme.text.primary,
              }}
            >
              Siap Bergabung dengan Kami?
            </h2>
            <p
              style={{
                fontSize: '1.125rem',
                color: newTheme.text.secondary,
                maxWidth: '700px',
                margin: '0 auto 2rem',
                lineHeight: '1.7',
              }}
            >
              Mulai gunakan platform RetinaScan sekarang untuk membantu mendeteksi retinopati diabetik lebih awal dan mencegah komplikasi serius pada pasien diabetes Anda.
            </p>
            <div
              style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              {isAuthenticated ? (
                <a href={DASHBOARD_URL}>
                  <AnimatedButton 
                    variant="primary" 
                    size="lg"
                  >
                    Buka Dashboard
                  </AnimatedButton>
                </a>
              ) : (
                <>
                  <Link to="/register">
                    <AnimatedButton 
                      variant="primary" 
                      size="lg"
                    >
                      Daftar Sekarang
                    </AnimatedButton>
                  </Link>
                  <Link to="/login">
                    <AnimatedButton 
                      variant="secondary" 
                      size="lg"
                    >
                      Masuk ke Akun
                    </AnimatedButton>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: '3rem 2rem',
          background: 'white',
          borderTop: '1px solid rgba(229, 231, 235, 0.5)',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '2rem',
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={newTheme.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <span
              style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                marginLeft: '0.75rem',
                background: newTheme.gradients.primary,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textFillColor: 'transparent',
              }}
            >
              RetinaScan
            </span>
          </div>
          <p
            style={{
              color: newTheme.text.secondary,
              textAlign: 'center',
              fontSize: '0.875rem',
            }}
          >
            &copy; {new Date().getFullYear()} RetinaScan. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default withPageTransition(LandingPage);