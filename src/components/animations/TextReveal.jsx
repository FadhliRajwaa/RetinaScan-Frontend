import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

// Komponen untuk animasi teks yang muncul huruf demi huruf
const TextReveal = ({ 
  text, 
  tag = 'h1', 
  className = '', 
  delay = 0,
  gradient = false,
  gradientColors = null,
  staggerChildren = 0.03,
  duration = 0.5,
  once = true,
  ...props 
}) => {
  const { animations, animationsEnabled, reducedMotion } = useTheme();
  const shouldAnimate = animationsEnabled && !reducedMotion;
  
  // Bagi teks menjadi array karakter
  const characters = text.split('');
  
  // Variasi animasi untuk setiap karakter
  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: delay + (i * staggerChildren),
        duration
      }
    })
  };
  
  // Variasi container untuk stagger
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerChildren,
        delayChildren: delay
      }
    }
  };
  
  // Style untuk gradient text jika diaktifkan
  const gradientStyle = gradient ? {
    background: gradientColors || 'linear-gradient(90deg, #3B82F6, #8B5CF6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  } : {};
  
  // Jika animasi dinonaktifkan, tampilkan teks biasa
  if (!shouldAnimate) {
    const Tag = tag;
    return <Tag className={className} style={gradientStyle} {...props}>{text}</Tag>;
  }
  
  // Render komponen dengan tag yang dinamis (h1, h2, p, dll)
  const Tag = motion[tag] || motion.div;
  
  return (
    <Tag
      className={className}
      style={gradientStyle}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once }}
      {...props}
    >
      {characters.map((char, index) => (
        <motion.span
          key={index}
          variants={letterVariants}
          custom={index}
          style={{ display: 'inline-block' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </Tag>
  );
};

export default TextReveal; 