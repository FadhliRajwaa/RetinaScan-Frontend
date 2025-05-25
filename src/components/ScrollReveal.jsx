import { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import PropTypes from 'prop-types';

/**
 * Komponen untuk menampilkan animasi saat elemen di-scroll
 * 
 * @param {Object} props - Props komponen
 * @param {React.ReactNode} props.children - Konten yang akan dianimasikan
 * @param {string} props.animation - Jenis animasi ('fade-up', 'fade-down', 'fade-left', 'fade-right', 'zoom-in', 'zoom-out')
 * @param {number} props.delay - Delay animasi dalam detik
 * @param {number} props.duration - Durasi animasi dalam detik
 * @param {number} props.threshold - Threshold untuk IntersectionObserver (0-1)
 * @param {boolean} props.once - Apakah animasi hanya sekali atau berulang setiap kali elemen masuk viewport
 * @param {Object} props.className - Class tambahan untuk container
 * @returns {JSX.Element} Komponen ScrollReveal
 */
const ScrollReveal = ({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 0.6,
  threshold = 0.1,
  once = true,
  className = '',
  ...props
}) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold,
    triggerOnce: once,
  });

  // Definisi animasi berdasarkan jenis
  const variants = {
    'fade-up': {
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { 
          duration, 
          delay,
          ease: [0.22, 1, 0.36, 1]
        } 
      },
      hidden: { opacity: 0, y: 50 }
    },
    'fade-down': {
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { 
          duration, 
          delay,
          ease: [0.22, 1, 0.36, 1]
        } 
      },
      hidden: { opacity: 0, y: -50 }
    },
    'fade-left': {
      visible: { 
        opacity: 1, 
        x: 0,
        transition: { 
          duration, 
          delay,
          ease: [0.22, 1, 0.36, 1]
        } 
      },
      hidden: { opacity: 0, x: 50 }
    },
    'fade-right': {
      visible: { 
        opacity: 1, 
        x: 0,
        transition: { 
          duration, 
          delay,
          ease: [0.22, 1, 0.36, 1]
        } 
      },
      hidden: { opacity: 0, x: -50 }
    },
    'zoom-in': {
      visible: { 
        opacity: 1, 
        scale: 1,
        transition: { 
          duration, 
          delay,
          ease: [0.22, 1, 0.36, 1]
        } 
      },
      hidden: { opacity: 0, scale: 0.8 }
    },
    'zoom-out': {
      visible: { 
        opacity: 1, 
        scale: 1,
        transition: { 
          duration, 
          delay,
          ease: [0.22, 1, 0.36, 1]
        } 
      },
      hidden: { opacity: 0, scale: 1.2 }
    },
    'flip': {
      visible: { 
        opacity: 1, 
        rotateX: 0,
        transition: { 
          duration, 
          delay,
          ease: [0.22, 1, 0.36, 1]
        } 
      },
      hidden: { opacity: 0, rotateX: 90 }
    },
    'slide-in': {
      visible: { 
        opacity: 1, 
        x: 0,
        transition: { 
          duration, 
          delay,
          ease: [0.22, 1, 0.36, 1]
        } 
      },
      hidden: { opacity: 0, x: -100 }
    },
  };

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    } else if (!once) {
      controls.start('hidden');
    }
  }, [controls, inView, once]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants[animation]}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

ScrollReveal.propTypes = {
  children: PropTypes.node.isRequired,
  animation: PropTypes.oneOf([
    'fade-up', 
    'fade-down', 
    'fade-left', 
    'fade-right', 
    'zoom-in', 
    'zoom-out',
    'flip',
    'slide-in'
  ]),
  delay: PropTypes.number,
  duration: PropTypes.number,
  threshold: PropTypes.number,
  once: PropTypes.bool,
  className: PropTypes.string,
};

export default ScrollReveal; 