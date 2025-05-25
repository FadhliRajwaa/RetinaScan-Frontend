// Tema bersama untuk frontend dan dashboard
export const globalTheme = {
  primary: '#3B82F6', // Blue-600
  secondary: '#10B981', // Green-500
  accent: '#8B5CF6', // Violet-500
  background: '#F9FAFB', // gray-50
  text: '#1F2937', // gray-800
  
  // Gradients
  primaryGradient: 'linear-gradient(135deg, #3B82F6, #60A5FA)',
  accentGradient: 'linear-gradient(135deg, #8B5CF6, #A78BFA)',
  blueGradient: 'linear-gradient(135deg, #2563EB, #3B82F6)',
  purpleGradient: 'linear-gradient(135deg, #7C3AED, #8B5CF6)',
  successGradient: 'linear-gradient(135deg, #10B981, #34D399)', 
  warningGradient: 'linear-gradient(135deg, #F59E0B, #FBBF24)',
  dangerGradient: 'linear-gradient(135deg, #EF4444, #F87171)',
  
  // Modern Gradients
  modernGradient1: 'linear-gradient(135deg, #4F46E5, #7C3AED, #8B5CF6)',
  modernGradient2: 'linear-gradient(135deg, #2563EB, #3B82F6, #60A5FA)',
  modernGradient3: 'linear-gradient(135deg, #0891B2, #06B6D4, #22D3EE)',
  modernGradient4: 'linear-gradient(135deg, #059669, #10B981, #34D399)',
  glassmorphismGradient: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.1))',
  darkGlassmorphismGradient: 'linear-gradient(135deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.1))',
  
  // Shadows
  smallShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  mediumShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  largeShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  
  // Modern Shadows
  neuomorphicShadow: '10px 10px 20px rgba(0, 0, 0, 0.05), -10px -10px 20px rgba(255, 255, 255, 0.8)',
  coloredShadow: '0 8px 16px rgba(59, 130, 246, 0.2)',
  accentColoredShadow: '0 8px 16px rgba(139, 92, 246, 0.2)',
  innerShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  glowShadow: '0 0 15px rgba(59, 130, 246, 0.5)',
  accentGlowShadow: '0 0 15px rgba(139, 92, 246, 0.5)',
  
  // Border Radius
  borderRadiusSm: '0.375rem',
  borderRadiusMd: '0.5rem',
  borderRadiusLg: '0.75rem',
  borderRadiusXl: '1rem',
  borderRadiusFull: '9999px',
  
  // Animations
  transitionFast: 'all 0.2s ease',
  transitionNormal: 'all 0.3s ease', 
  transitionSlow: 'all 0.5s ease',
  
  // Glass Effect
  glassEffect: {
    background: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  
  // Modern Glass Effects
  modernGlassEffect: {
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
  },
  
  // Dark Glass Effect
  darkGlassEffect: {
    background: 'rgba(0, 0, 0, 0.2)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  
  // Modern Dark Glass Effect
  modernDarkGlassEffect: {
    background: 'rgba(15, 23, 42, 0.6)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
  },
  
  // Card Styles
  cardStyles: {
    default: {
      background: '#FFFFFF',
      borderRadius: '0.75rem',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    },
    glass: {
      background: 'rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '0.75rem',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
    },
    neuomorphic: {
      background: '#F9FAFB',
      borderRadius: '0.75rem',
      boxShadow: '10px 10px 20px rgba(0, 0, 0, 0.05), -10px -10px 20px rgba(255, 255, 255, 0.8)',
    },
    bordered: {
      background: '#FFFFFF',
      borderRadius: '0.75rem',
      border: '1px solid rgba(0, 0, 0, 0.1)',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
    },
    colorful: {
      background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
      borderRadius: '0.75rem',
      boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.3)',
      color: 'white',
    },
  },
  
  // Button Styles
  buttonStyles: {
    primary: {
      background: 'linear-gradient(135deg, #3B82F6, #60A5FA)',
      borderRadius: '9999px',
      boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.3)',
      color: 'white',
    },
    secondary: {
      background: 'linear-gradient(135deg, #10B981, #34D399)',
      borderRadius: '9999px',
      boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.3)',
      color: 'white',
    },
    accent: {
      background: 'linear-gradient(135deg, #8B5CF6, #A78BFA)',
      borderRadius: '9999px',
      boxShadow: '0 10px 15px -3px rgba(139, 92, 246, 0.3)',
      color: 'white',
    },
    glass: {
      background: 'rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '9999px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      color: 'white',
    },
  },
};

// Animations untuk Framer Motion yang bisa digunakan di kedua aplikasi
export const animations = {
  // Fade in dari bawah (untuk elemen individu)
  fadeInUp: {
    hidden: { y: 20, opacity: 0 },
    visible: (delay = 0) => ({
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 15,
        stiffness: 100,
        delay,
        duration: 0.5
      }
    })
  },
  
  // Fade in dari atas
  fadeInDown: {
    hidden: { y: -20, opacity: 0 },
    visible: (delay = 0) => ({
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 15,
        stiffness: 100,
        delay,
        duration: 0.5
      }
    })
  },
  
  // Fade in dari kiri
  fadeInLeft: {
    hidden: { x: -20, opacity: 0 },
    visible: (delay = 0) => ({
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 15,
        stiffness: 100,
        delay,
        duration: 0.5
      }
    })
  },
  
  // Fade in dari kanan
  fadeInRight: {
    hidden: { x: 20, opacity: 0 },
    visible: (delay = 0) => ({
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 15,
        stiffness: 100,
        delay,
        duration: 0.5
      }
    })
  },
  
  // Container untuk elemen staggered
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  },
  
  // Item untuk container staggered
  item: {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 15,
        stiffness: 100
      }
    }
  },
  
  // Card animations
  card: {
    initial: { scale: 0.97, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    hover: { scale: 1.02, y: -3, boxShadow: '0 10px 15px -5px rgba(0, 0, 0, 0.1)' },
    tap: { scale: 0.98 }
  },
  
  // Button animations
  button: {
    hover: { scale: 1.03, transition: { duration: 0.15 } },
    tap: { scale: 0.97, transition: { duration: 0.1 } }
  },
  
  // Page transition
  page: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 }
  },
  
  // Modal animations
  modal: {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 300
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      y: 20,
      transition: { duration: 0.2 }
    }
  },
  
  // Dropdown animations
  dropdown: {
    hidden: { opacity: 0, height: 0, overflow: 'hidden' },
    visible: { opacity: 1, height: 'auto', transition: { duration: 0.3 } },
    exit: { opacity: 0, height: 0, transition: { duration: 0.2 } }
  },
  
  // Toast notification animation
  toast: {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: 50, transition: { duration: 0.2 } }
  },
  
  // Modern animations
  
  // Staggered fade in for lists
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.3
      }
    }
  },
  
  // Staggered item with scale
  staggerItem: {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  },
  
  // Text reveal animation
  textReveal: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 15,
        stiffness: 100,
        duration: 0.7
      }
    }
  },
  
  // Character by character text reveal
  letterReveal: {
    hidden: { opacity: 0, y: 20 },
    visible: i => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.03,
        duration: 0.5
      }
    })
  },
  
  // Scroll-triggered animations
  scrollFadeIn: {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut'
      }
    }
  },
  
  // Scroll-triggered scale animation
  scrollScale: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: 'easeOut'
      }
    }
  },
  
  // Hover animations for cards
  cardHover: {
    rest: { scale: 1, boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.1)' },
    hover: { 
      scale: 1.03, 
      y: -5,
      boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.12)',
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  },
  
  // Shimmer effect animation
  shimmer: {
    hidden: { 
      x: '-100%', 
      opacity: 0.3 
    },
    visible: { 
      x: '100%', 
      opacity: 0.6,
      transition: { 
        repeat: Infinity, 
        duration: 1.5,
        ease: 'linear'
      }
    }
  },
  
  // Pulse animation
  pulse: {
    scale: [1, 1.03, 1],
    opacity: [0.8, 1, 0.8],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  },
  
  // Floating animation
  float: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  },
  
  // Rotate animation
  rotate: {
    rotate: [0, 360],
    transition: {
      duration: 20,
      repeat: Infinity,
      ease: 'linear'
    }
  },
  
  // Bounce animation
  bounce: {
    y: [0, -15, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      repeatType: 'reverse'
    }
  }
}; 