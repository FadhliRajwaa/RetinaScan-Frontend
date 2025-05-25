import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const GlassCard = ({ 
  children, 
  className = '', 
  dark = false,
  hoverEffect = true,
  padding = true,
  rounded = true,
  border = true,
  shadow = true,
  ...props 
}) => {
  const { theme, animations, animationsEnabled, reducedMotion } = useTheme();
  const shouldAnimate = animationsEnabled && !reducedMotion;
  
  // Pilih efek glass berdasarkan mode (light/dark)
  const glassStyle = dark ? theme.modernDarkGlassEffect : theme.modernGlassEffect;
  
  // Tambahkan class dan style tambahan
  const cardClasses = `
    ${padding ? 'p-6' : ''} 
    ${rounded ? 'rounded-xl' : ''} 
    ${className}
  `;
  
  // Efek hover untuk card
  const hoverVariants = {
    rest: { 
      scale: 1,
      boxShadow: shadow ? '0px 5px 15px rgba(0, 0, 0, 0.1)' : 'none',
    },
    hover: hoverEffect ? { 
      scale: 1.02, 
      y: -5,
      boxShadow: shadow ? '0px 10px 25px rgba(0, 0, 0, 0.15)' : 'none',
      transition: { 
        duration: 0.3, 
        ease: 'easeOut' 
      }
    } : {}
  };
  
  // Jika animasi dinonaktifkan, gunakan div biasa
  if (!shouldAnimate) {
    return (
      <div 
        className={cardClasses}
        style={{
          ...glassStyle,
          border: border ? glassStyle.border : 'none',
          boxShadow: shadow ? glassStyle.boxShadow : 'none',
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
  
  return (
    <motion.div
      className={cardClasses}
      style={{
        ...glassStyle,
        border: border ? glassStyle.border : 'none',
        boxShadow: shadow ? glassStyle.boxShadow : 'none',
      }}
      initial="rest"
      whileHover="hover"
      variants={hoverVariants}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard; 