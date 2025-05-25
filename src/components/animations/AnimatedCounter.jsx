import { useState, useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const AnimatedCounter = ({ 
  end, 
  start = 0, 
  duration = 2, 
  delay = 0,
  prefix = '',
  suffix = '',
  className = '',
  gradientText = false,
  ...props 
}) => {
  const [count, setCount] = useState(start);
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const { theme, animationsEnabled, reducedMotion } = useTheme();
  const shouldAnimate = animationsEnabled && !reducedMotion;
  
  // Animasi counter
  useEffect(() => {
    if (isInView && shouldAnimate) {
      let startTime;
      let animationFrame;
      
      const updateCount = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
        
        const currentCount = Math.floor(progress * (end - start) + start);
        setCount(currentCount);
        
        if (progress < 1) {
          animationFrame = requestAnimationFrame(updateCount);
        }
      };
      
      // Delay animasi jika diperlukan
      const timer = setTimeout(() => {
        animationFrame = requestAnimationFrame(updateCount);
        controls.start({ 
          opacity: 1, 
          y: 0, 
          scale: 1,
          transition: { 
            type: 'spring',
            damping: 15,
            stiffness: 100,
            duration: 0.8 
          } 
        });
      }, delay * 1000);
      
      return () => {
        clearTimeout(timer);
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
        }
      };
    } else if (!shouldAnimate) {
      setCount(end);
      controls.set({ opacity: 1, y: 0, scale: 1 });
    }
  }, [isInView, end, start, duration, delay, controls, shouldAnimate]);
  
  // Style untuk gradient text
  const gradientStyle = gradientText ? {
    background: 'linear-gradient(90deg, #3B82F6, #8B5CF6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  } : {};

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={controls}
      className={className}
      style={gradientStyle}
      {...props}
    >
      {prefix}{count}{suffix}
    </motion.span>
  );
};

export default AnimatedCounter; 