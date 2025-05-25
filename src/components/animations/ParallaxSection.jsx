import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const ParallaxSection = ({ 
  children, 
  className = '', 
  backgroundImage = null,
  backgroundGradient = null,
  speed = 0.5,
  direction = 'up',
  overlay = false,
  overlayColor = 'rgba(0, 0, 0, 0.5)',
  height = '500px',
  ...props 
}) => {
  const { animationsEnabled, reducedMotion } = useTheme();
  const shouldAnimate = animationsEnabled && !reducedMotion;
  const ref = useRef(null);
  
  // Gunakan useScroll untuk mengukur posisi scroll
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  // Transformasi berdasarkan arah parallax
  const getTransformValue = () => {
    switch (direction) {
      case 'up': return useTransform(scrollYProgress, [0, 1], ['0%', `${-speed * 20}%`]);
      case 'down': return useTransform(scrollYProgress, [0, 1], ['0%', `${speed * 20}%`]);
      case 'left': return useTransform(scrollYProgress, [0, 1], ['0%', `${-speed * 10}%`]);
      case 'right': return useTransform(scrollYProgress, [0, 1], ['0%', `${speed * 10}%`]);
      default: return useTransform(scrollYProgress, [0, 1], ['0%', `${-speed * 20}%`]);
    }
  };
  
  // Pilih transformasi yang tepat berdasarkan arah
  const y = direction === 'up' || direction === 'down' 
    ? getTransformValue() 
    : undefined;
    
  const x = direction === 'left' || direction === 'right'
    ? getTransformValue()
    : undefined;
    
  // Style untuk background
  const backgroundStyle = {
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : backgroundGradient || 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height,
  };
  
  // Jika animasi dinonaktifkan, tampilkan div biasa
  if (!shouldAnimate) {
    return (
      <div 
        ref={ref}
        className={`relative overflow-hidden ${className}`}
        style={backgroundStyle}
        {...props}
      >
        {overlay && (
          <div 
            className="absolute inset-0" 
            style={{ backgroundColor: overlayColor }}
          />
        )}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    );
  }
  
  return (
    <div 
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      {...props}
    >
      <motion.div
        className="absolute inset-0"
        style={{ 
          ...backgroundStyle,
          y,
          x,
        }}
      />
      
      {overlay && (
        <div 
          className="absolute inset-0" 
          style={{ backgroundColor: overlayColor }}
        />
      )}
      
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
};

export default ParallaxSection; 