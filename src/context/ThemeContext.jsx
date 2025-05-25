import { createContext, useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { globalTheme, animations as sharedAnimations } from '../utils/theme';

// Theme Context
export const ThemeContext = createContext();

// Theme Provider Component
export const ThemeProvider = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [theme, setTheme] = useState(globalTheme);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Deteksi perangkat mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    // Deteksi preferensi reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(prefersReducedMotion.matches);
    
    const handleReducedMotionChange = (e) => {
      setReducedMotion(e.matches);
    };
    
    prefersReducedMotion.addEventListener('change', handleReducedMotionChange);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      prefersReducedMotion.removeEventListener('change', handleReducedMotionChange);
    };
  }, []);

  // Fungsi untuk toggle animasi
  const toggleAnimations = () => {
    setAnimationsEnabled(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      setTheme, 
      isMobile, 
      animationsEnabled, 
      toggleAnimations,
      reducedMotion
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook untuk menggunakan theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  // Menggabungkan animasi dengan state animationsEnabled
  const { animationsEnabled, reducedMotion, ...rest } = context;
  
  // Jika animasi dinonaktifkan atau reduced motion diaktifkan, gunakan animasi minimal
  const animations = animationsEnabled && !reducedMotion 
    ? sharedAnimations 
    : {
        // Versi minimal dari animasi
        fadeInUp: {
          hidden: { opacity: 0 },
          visible: () => ({ opacity: 1, transition: { duration: 0.3 } })
        },
        fadeInDown: {
          hidden: { opacity: 0 },
          visible: () => ({ opacity: 1, transition: { duration: 0.3 } })
        },
        fadeInLeft: {
          hidden: { opacity: 0 },
          visible: () => ({ opacity: 1, transition: { duration: 0.3 } })
        },
        fadeInRight: {
          hidden: { opacity: 0 },
          visible: () => ({ opacity: 1, transition: { duration: 0.3 } })
        },
        container: {
          hidden: { opacity: 0 },
          visible: { opacity: 1 }
        },
        item: {
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration: 0.3 } }
        },
        card: {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          hover: { opacity: 1 }
        },
        button: {
          hover: {},
          tap: {}
        },
        page: {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: { duration: 0.2 }
        },
        modal: {
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration: 0.3 } },
          exit: { opacity: 0, transition: { duration: 0.2 } }
        },
        dropdown: {
          hidden: { opacity: 0, height: 0 },
          visible: { opacity: 1, height: 'auto', transition: { duration: 0.3 } },
          exit: { opacity: 0, height: 0, transition: { duration: 0.2 } }
        },
        toast: {
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration: 0.3 } },
          exit: { opacity: 0, transition: { duration: 0.2 } }
        }
      };
  
  return { ...rest, animations, animationsEnabled, toggleAnimations, reducedMotion };
};

// HOC untuk mendukung animasi page transition
export const withPageTransition = (Component) => {
  return (props) => {
    const { animationsEnabled, reducedMotion } = useTheme();
    const shouldAnimate = animationsEnabled && !reducedMotion;
    
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ 
          duration: shouldAnimate ? 0.4 : 0.2,
          ease: "easeOut" 
        }}
        style={{ 
          willChange: 'opacity',
          transform: 'translateZ(0)'
        }}
      >
        <Component {...props} />
      </motion.div>
    );
  };
};

// Export animations dari tema bersama
export const animations = sharedAnimations;

// HOC untuk animasi scroll-based
export const withScrollAnimation = (Component) => {
  return (props) => {
    const { animationsEnabled, reducedMotion } = useTheme();
    
    if (!animationsEnabled || reducedMotion) {
      return <Component {...props} />;
    }
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Component {...props} />
      </motion.div>
    );
  };
};

// Komponen AnimatedSection untuk animasi berbasis scroll
export const AnimatedSection = ({ children, delay = 0, direction = "up", className = "", ...props }) => {
  const { animationsEnabled, reducedMotion } = useTheme();
  const shouldAnimate = animationsEnabled && !reducedMotion;
  
  const getInitialPosition = () => {
    switch (direction) {
      case "up": return { opacity: 0, y: 50 };
      case "down": return { opacity: 0, y: -50 };
      case "left": return { opacity: 0, x: 50 };
      case "right": return { opacity: 0, x: -50 };
      case "scale": return { opacity: 0, scale: 0.9 };
      default: return { opacity: 0, y: 50 };
    }
  };
  
  const getFinalPosition = () => {
    switch (direction) {
      case "up": 
      case "down": return { opacity: 1, y: 0 };
      case "left":
      case "right": return { opacity: 1, x: 0 };
      case "scale": return { opacity: 1, scale: 1 };
      default: return { opacity: 1, y: 0 };
    }
  };
  
  if (!shouldAnimate) {
    return <div className={className} {...props}>{children}</div>;
  }
  
  return (
    <motion.div
      initial={getInitialPosition()}
      whileInView={getFinalPosition()}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 0.8, 
        ease: "easeOut",
        delay: delay * 0.2
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}; 