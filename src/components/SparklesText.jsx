import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Sparkle = ({ size, color, style }) => {
  const sparkleVariants = {
    initial: { opacity: 0, scale: 0 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0 }
  };

  const path = 'M26.5 25.5C19.0043 33.3697 0 34 0 34C0 34 19.1013 35.3684 26.5 43.5C33.234 50.901 34 68 34 68C34 68 36.9884 50.7065 44.5 43.5C51.6431 36.647 68 34 68 34C68 34 51.6947 32.0939 44.5 25.5C36.5605 18.2235 34 0 34 0C34 0 33.6591 17.9837 26.5 25.5Z';

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 68 68"
      fill="none"
      style={style}
      variants={sparkleVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{
        duration: 0.6,
        ease: "easeOut"
      }}
    >
      <path d={path} fill={color} />
    </motion.svg>
  );
};

const generateSparkle = (minSize = 10, maxSize = 20) => {
  const size = Math.random() * (maxSize - minSize) + minSize;
  return {
    id: String(Math.random()),
    size,
    color: `hsl(${Math.random() * 60 + 200}, 100%, 70%)`,
    style: {
      position: 'absolute',
      zIndex: 2,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      transform: `rotate(${Math.random() * 360}deg)`,
    }
  };
};

export const SparklesText = ({ 
  children, 
  className = '', 
  sparklesCount = 10,
  minSize = 10,
  maxSize = 20,
  ...props 
}) => {
  const [sparkles, setSparkles] = useState([]);
  const [isMounted, setIsMounted] = useState(false);
  const intervalRef = useRef(null);
  const containerRef = useRef(null);
  
  // Generate initial sparkles
  useEffect(() => {
    setIsMounted(true);
    
    // Create initial sparkles
    setSparkles(Array.from({ length: sparklesCount }, () => generateSparkle(minSize, maxSize)));
    
    // Setup interval to regenerate sparkles
    intervalRef.current = setInterval(() => {
      const sparkle = generateSparkle(minSize, maxSize);
      setSparkles(prev => [...prev.slice(1), sparkle]);
    }, 300);
    
    return () => {
      setIsMounted(false);
      clearInterval(intervalRef.current);
    };
  }, [sparklesCount, minSize, maxSize]);
  
  if (!isMounted) return <span className={className}>{children}</span>;

  return (
    <span ref={containerRef} className={`inline-block relative ${className}`} {...props}>
      <AnimatePresence>
        {sparkles.map(sparkle => (
          <Sparkle
            key={sparkle.id}
            size={sparkle.size}
            color={sparkle.color}
            style={sparkle.style}
          />
        ))}
      </AnimatePresence>
      <span className="relative z-1 font-medium">{children}</span>
    </span>
  );
};

export default SparklesText; 