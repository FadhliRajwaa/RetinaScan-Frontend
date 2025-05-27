import { createContext, useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { newTheme, enhancedAnimations, breakpoints } from '../utils/newTheme';

// Theme Context
export const ThemeContext = createContext();

// Theme Provider Component
export const ThemeProvider = ({ children }) => {
  // State untuk melacak mode gelap/terang
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Cek preferensi tema dari localStorage atau preferensi sistem
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  
  // State untuk melacak ukuran layar dan responsivitas
  const [viewport, setViewport] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });
  
  // State untuk animasi transisi tema
  const [themeTransitioning, setThemeTransitioning] = useState(false);
  
  // State untuk preferensi pengurangan gerakan (a11y)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  // State untuk arah teks (LTR/RTL)
  const [direction, setDirection] = useState('ltr');
  
  // Deteksi perubahan ukuran layar
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setViewport({
        isMobile: width < parseInt(breakpoints.md),
        isTablet: width >= parseInt(breakpoints.md) && width < parseInt(breakpoints.lg),
        isDesktop: width >= parseInt(breakpoints.lg),
        width: width,
        height: window.innerHeight,
      });
    };
    
    // Deteksi preferensi pengurangan gerakan
    const handleReducedMotionChange = () => {
      setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    };
    
    // Inisialisasi
    handleResize();
    handleReducedMotionChange();
    
    // Pasang listener
    window.addEventListener('resize', handleResize);
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', handleReducedMotionChange);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.matchMedia('(prefers-reduced-motion: reduce)').removeEventListener('change', handleReducedMotionChange);
    };
  }, []);

  // Efek untuk menerapkan tema ke dokumen dengan transisi yang lebih halus
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
      localStorage.setItem('theme', 'light');
    }
    
    // Set atribut dir untuk dukungan RTL jika diperlukan
    document.documentElement.setAttribute('dir', direction);
  }, [isDarkMode, direction]);

  // Toggle tema gelap/terang dengan animasi transisi
  const toggleTheme = () => {
    setThemeTransitioning(true);
    setTimeout(() => {
      setIsDarkMode(prev => !prev);
      setTimeout(() => {
        setThemeTransitioning(false);
      }, 300);
    }, 100);
  };
  
  // Fungsi untuk mengatur tema secara langsung
  const setThemeMode = (mode) => {
    setThemeTransitioning(true);
    setTimeout(() => {
      setIsDarkMode(mode === 'dark');
      setTimeout(() => {
        setThemeTransitioning(false);
      }, 300);
    }, 100);
  };
  
  // Fungsi untuk mengatur arah teks
  const setTextDirection = (dir) => {
    setDirection(dir === 'rtl' ? 'rtl' : 'ltr');
  };

  // Tema yang diperluas dengan mode gelap/terang dan properti responsif
  const extendedTheme = {
    ...newTheme,
    isDarkMode,
    direction,
    viewport,
    prefersReducedMotion,
    // Warna yang disesuaikan berdasarkan mode
    current: {
      background: isDarkMode ? newTheme.background.dark : newTheme.background.light,
      backgroundAlt: isDarkMode ? newTheme.background.dark2 : newTheme.background.light2,
      backgroundTertiary: isDarkMode ? newTheme.background.dark3 : newTheme.background.light3,
      text: isDarkMode ? newTheme.text.light : newTheme.text.primary,
      textSecondary: isDarkMode ? newTheme.text.light2 : newTheme.text.secondary,
      primary: newTheme.primary[isDarkMode ? 400 : 500],
      secondary: newTheme.secondary[isDarkMode ? 400 : 500],
      accent: newTheme.accent[isDarkMode ? 400 : 500],
      border: isDarkMode ? newTheme.border.dark : newTheme.border.light,
      // Efek kaca yang disesuaikan berdasarkan mode
      glassEffect: isDarkMode ? newTheme.glass.dark : newTheme.glass.light,
      shadow: isDarkMode ? 
        `0 4px 20px rgba(0, 0, 0, 0.25)` : 
        newTheme.shadow.lg,
    },
    // Fungsi untuk parallax scroll
    parallax: {
      useParallax: (value, distance) => {
        const { scrollYProgress } = useScroll();
        return useTransform(
          scrollYProgress, 
          [0, 1], 
          [value, value + distance]
        );
      }
    },
    // Utilitas untuk responsivitas
    responsive: {
      isMobile: viewport.isMobile,
      isTablet: viewport.isTablet,
      isDesktop: viewport.isDesktop,
      // Helper functions untuk ukuran
      fontSize: (base, mobile, tablet) => {
        if (viewport.isMobile) return mobile || base * 0.875;
        if (viewport.isTablet) return tablet || base * 0.9375;
        return base;
      },
      spacing: (base, mobile, tablet) => {
        if (viewport.isMobile) return mobile || base * 0.75;
        if (viewport.isTablet) return tablet || base * 0.875;
        return base;
      }
    }
  };

  // Animasi yang disesuaikan berdasarkan preferensi pengurangan gerakan
  const adaptiveAnimations = prefersReducedMotion ? {
    // Versi animasi yang lebih sederhana untuk preferensi pengurangan gerakan
    page: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.2 }
    },
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.2 }
    },
    // Hindari animasi yang terlalu kompleks
    hover: { scale: 1 },
    tap: { scale: 1 },
  } : enhancedAnimations;

  return (
    <ThemeContext.Provider value={{ 
      theme: extendedTheme, 
      setThemeMode,
      viewport, 
      isDarkMode, 
      toggleTheme,
      themeTransitioning,
      prefersReducedMotion,
      direction,
      setTextDirection,
      animations: adaptiveAnimations
    }}>
      <div className={`theme-transition ${themeTransitioning ? 'transitioning' : ''}`}
           style={{ 
             transition: 'background-color 0.3s ease, color 0.3s ease',
             minHeight: '100vh',
             display: 'flex',
             flexDirection: 'column'
           }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

// Custom hook untuk menggunakan theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// HOC untuk mendukung animasi page transition dengan efek yang lebih halus
export const withPageTransition = (Component) => {
  return (props) => {
    const { isDarkMode, themeTransitioning, animations, prefersReducedMotion } = useTheme();
    
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={isDarkMode ? 'dark' : 'light'}
          initial={animations.page.initial}
          animate={animations.page.animate}
          exit={animations.page.exit}
          transition={animations.page.transition}
          className={`w-full ${themeTransitioning ? 'opacity-0' : 'opacity-100'}`}
          style={{ 
            willChange: prefersReducedMotion ? 'opacity' : 'opacity, transform',
            transform: 'translateZ(0)',
            transition: 'opacity 0.3s ease'
          }}
        >
          <Component {...props} />
        </motion.div>
      </AnimatePresence>
    );
  };
};

// Parallax HOC untuk komponen dengan efek parallax
export const withParallaxEffect = (Component) => {
  return (props) => {
    const { prefersReducedMotion } = useTheme();
    
    // Jika pengguna lebih suka pengurangan gerakan, lewati efek parallax
    if (prefersReducedMotion) {
      return <Component {...props} />;
    }
    
    return (
      <motion.div
        style={{
          position: 'relative',
          zIndex: 1,
          willChange: 'transform'
        }}
      >
        <Component {...props} />
      </motion.div>
    );
  };
};

// Komponen pembungkus animasi responsif
export const AnimatedElement = ({ 
  children, 
  animation = 'fadeIn', 
  delay = 0,
  className = '',
  ...props 
}) => {
  const { animations, prefersReducedMotion } = useTheme();
  
  // Ambil konfigurasi animasi yang tepat atau gunakan default
  const selectedAnimation = animations[animation] || animations.fadeIn;
  
  // Jika preferensi pengurangan gerakan diaktifkan, render tanpa animasi
  if (prefersReducedMotion) {
    return <div className={className} {...props}>{children}</div>;
  }
  
  return (
    <motion.div
      initial={selectedAnimation.initial}
      animate={selectedAnimation.animate}
      exit={selectedAnimation.exit || { opacity: 0 }}
      transition={
        selectedAnimation.transition 
          ? { ...selectedAnimation.transition, delay } 
          : { duration: 0.5, delay }
      }
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Export animations dari tema bersama
export const animations = enhancedAnimations; 