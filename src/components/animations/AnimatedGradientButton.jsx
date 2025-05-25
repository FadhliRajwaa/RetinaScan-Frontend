import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { Link } from 'react-router-dom';

const AnimatedGradientButton = ({
  children,
  to = null,
  onClick = null,
  className = '',
  gradient = 'primary',
  size = 'md',
  fullWidth = false,
  shadow = true,
  disabled = false,
  ...props
}) => {
  const { theme, animations, animationsEnabled, reducedMotion } = useTheme();
  const shouldAnimate = animationsEnabled && !reducedMotion && !disabled;
  
  // Pilih gradien berdasarkan prop
  const getGradient = () => {
    switch (gradient) {
      case 'primary': return theme.primaryGradient;
      case 'accent': return theme.accentGradient;
      case 'success': return theme.successGradient;
      case 'warning': return theme.warningGradient;
      case 'danger': return theme.dangerGradient;
      case 'modern1': return theme.modernGradient1;
      case 'modern2': return theme.modernGradient2;
      case 'modern3': return theme.modernGradient3;
      case 'modern4': return theme.modernGradient4;
      default: return theme.primaryGradient;
    }
  };
  
  // Ukuran tombol
  const getSize = () => {
    switch (size) {
      case 'sm': return 'px-4 py-2 text-sm';
      case 'md': return 'px-6 py-3 text-base';
      case 'lg': return 'px-8 py-4 text-lg';
      default: return 'px-6 py-3 text-base';
    }
  };
  
  // Style untuk tombol
  const buttonStyle = {
    background: getGradient(),
    borderRadius: '9999px',
    boxShadow: shadow ? '0 10px 15px -3px rgba(0, 0, 0, 0.2)' : 'none',
    opacity: disabled ? 0.6 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
  };
  
  // Class untuk tombol
  const buttonClasses = `
    ${getSize()}
    font-semibold text-white
    transition-all duration-300
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `;
  
  // Animasi untuk tombol
  const buttonVariants = {
    rest: { 
      scale: 1,
      backgroundPosition: '0% 50%',
    },
    hover: shouldAnimate ? { 
      scale: 1.03,
      backgroundPosition: '100% 50%',
      transition: { 
        duration: 0.3,
        backgroundPosition: {
          duration: 0.8,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut'
        }
      }
    } : {},
    tap: shouldAnimate ? { 
      scale: 0.97,
      transition: { duration: 0.1 }
    } : {}
  };
  
  // Efek shimmer
  const shimmerVariants = {
    rest: {
      x: '-100%',
      opacity: 0
    },
    hover: shouldAnimate ? {
      x: '100%',
      opacity: 0.2,
      transition: {
        repeat: Infinity,
        duration: 1.5,
        ease: 'linear'
      }
    } : {}
  };
  
  // Jika animasi dinonaktifkan atau disabled, gunakan tombol biasa
  if (!shouldAnimate) {
    if (to) {
      return (
        <Link
          to={to}
          className={buttonClasses}
          style={{
            ...buttonStyle,
            backgroundSize: '200% 200%',
          }}
          onClick={disabled ? (e) => e.preventDefault() : onClick}
          {...props}
        >
          {children}
        </Link>
      );
    }
    
    return (
      <button
        className={buttonClasses}
        style={{
          ...buttonStyle,
          backgroundSize: '200% 200%',
        }}
        onClick={onClick}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
  
  // Komponen dengan animasi
  const AnimatedButton = motion.button;
  const AnimatedLink = motion(Link);
  
  // Render tombol atau link berdasarkan prop 'to'
  const ButtonComponent = to ? AnimatedLink : AnimatedButton;
  
  return (
    <ButtonComponent
      to={to}
      className={buttonClasses}
      style={{
        ...buttonStyle,
        backgroundSize: '200% 200%',
      }}
      variants={buttonVariants}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      onClick={disabled ? (e) => e.preventDefault() : onClick}
      disabled={disabled}
      {...props}
    >
      <div className="relative overflow-hidden w-full h-full flex items-center justify-center">
        {children}
        <motion.div
          className="absolute top-0 left-0 w-full h-full bg-white"
          style={{ opacity: 0 }}
          variants={shimmerVariants}
        />
      </div>
    </ButtonComponent>
  );
};

export default AnimatedGradientButton; 