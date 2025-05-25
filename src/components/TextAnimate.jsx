import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const TextAnimate = ({ children, by = 'letter', animation = 'fadeIn', delay = 0, className = '', ...props }) => {
  const [items, setItems] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    if (by === 'letter') {
      setItems(Array.from(children));
    } else if (by === 'word') {
      setItems(children.split(' '));
    } else {
      setItems([children]);
    }
    
    return () => setMounted(false);
  }, [children, by]);

  // Animation variants
  const animations = {
    fadeIn: {
      hidden: { opacity: 0 },
      visible: i => ({
        opacity: 1,
        transition: {
          delay: i * 0.05 + delay
        }
      })
    },
    blurInUp: {
      hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
      visible: i => ({
        opacity: 1, 
        y: 0,
        filter: 'blur(0px)',
        transition: {
          delay: i * 0.05 + delay,
          duration: 0.5
        }
      })
    },
    slideUp: {
      hidden: { opacity: 0, y: 20 },
      visible: i => ({
        opacity: 1, 
        y: 0,
        transition: {
          delay: i * 0.05 + delay,
          duration: 0.4,
          ease: [0.25, 0.1, 0.25, 1.0]
        }
      })
    },
    slideIn: {
      hidden: { opacity: 0, x: -20 },
      visible: i => ({
        opacity: 1, 
        x: 0,
        transition: {
          delay: i * 0.05 + delay,
          duration: 0.4,
          ease: [0.25, 0.1, 0.25, 1.0]
        }
      })
    },
    popIn: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: i => ({
        opacity: 1, 
        scale: 1,
        transition: {
          delay: i * 0.05 + delay,
          type: 'spring',
          stiffness: 250,
          damping: 15
        }
      })
    }
  };
  
  // Get the animation variant
  const variant = animations[animation] || animations.fadeIn;

  if (!mounted) return null;

  return (
    <span className={className} {...props}>
      <AnimatePresence>
        {items.map((item, i) => (
          <motion.span
            key={`${by}-${i}`}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={variant}
            style={{ display: by === 'word' ? 'inline-block' : 'inline' }}
          >
            {item}
            {by === 'word' && i < items.length - 1 ? ' ' : ''}
          </motion.span>
        ))}
      </AnimatePresence>
    </span>
  );
};

export default TextAnimate; 