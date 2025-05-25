import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const AnimatedBackground = ({
  type = 'dots',
  color = '#3B82F6',
  secondaryColor = '#8B5CF6',
  density = 'medium',
  speed = 'medium',
  className = '',
  children,
  ...props
}) => {
  const { animationsEnabled, reducedMotion } = useTheme();
  const shouldAnimate = animationsEnabled && !reducedMotion;
  const [particles, setParticles] = useState([]);
  
  // Tentukan jumlah partikel berdasarkan density
  const getParticleCount = () => {
    switch (density) {
      case 'low': return 20;
      case 'medium': return 50;
      case 'high': return 100;
      default: return 50;
    }
  };
  
  // Tentukan kecepatan animasi berdasarkan speed
  const getAnimationDuration = () => {
    switch (speed) {
      case 'slow': return { min: 20, max: 40 };
      case 'medium': return { min: 10, max: 20 };
      case 'fast': return { min: 5, max: 15 };
      default: return { min: 10, max: 20 };
    }
  };
  
  // Buat partikel saat komponen dimount
  useEffect(() => {
    if (!shouldAnimate) return;
    
    const count = getParticleCount();
    const newParticles = [];
    
    for (let i = 0; i < count; i++) {
      const size = Math.random() * 10 + 5; // 5-15px
      const x = Math.random() * 100; // 0-100%
      const y = Math.random() * 100; // 0-100%
      const duration = getAnimationDuration();
      const animDuration = Math.random() * (duration.max - duration.min) + duration.min;
      
      newParticles.push({
        id: i,
        size,
        x,
        y,
        animDuration,
        delay: Math.random() * 5, // 0-5s delay
        opacity: Math.random() * 0.5 + 0.1 // 0.1-0.6 opacity
      });
    }
    
    setParticles(newParticles);
  }, [shouldAnimate, density, speed]);
  
  // Render background berdasarkan tipe
  const renderBackground = () => {
    if (!shouldAnimate) {
      return null;
    }
    
    switch (type) {
      case 'dots':
        return particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              backgroundColor: Math.random() > 0.5 ? color : secondaryColor,
              opacity: particle.opacity,
            }}
            animate={{
              x: [0, Math.random() * 50 - 25, Math.random() * 50 - 25, 0],
              y: [0, Math.random() * 50 - 25, Math.random() * 50 - 25, 0],
              scale: [1, Math.random() * 0.5 + 0.8, Math.random() * 0.5 + 0.8, 1],
              opacity: [particle.opacity, particle.opacity * 1.5, particle.opacity, particle.opacity],
            }}
            transition={{
              duration: particle.animDuration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut"
            }}
          />
        ));
        
      case 'grid':
        return (
          <motion.div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `linear-gradient(${color}20 1px, transparent 1px), linear-gradient(90deg, ${color}20 1px, transparent 1px)`,
              backgroundSize: '50px 50px',
            }}
            animate={{
              backgroundPosition: ['0px 0px', '50px 50px'],
            }}
            transition={{
              duration: getAnimationDuration().max,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        );
        
      case 'waves':
        return (
          <svg
            className="absolute inset-0 w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
          >
            <motion.path
              fill={color}
              fillOpacity="0.1"
              d="M0,160L48,138.7C96,117,192,75,288,64C384,53,480,75,576,106.7C672,139,768,181,864,181.3C960,181,1056,139,1152,117.3C1248,96,1344,96,1392,96L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              animate={{
                d: [
                  "M0,160L48,138.7C96,117,192,75,288,64C384,53,480,75,576,106.7C672,139,768,181,864,181.3C960,181,1056,139,1152,117.3C1248,96,1344,96,1392,96L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                  "M0,192L48,197.3C96,203,192,213,288,192C384,171,480,117,576,106.7C672,96,768,128,864,149.3C960,171,1056,181,1152,160C1248,139,1344,85,1392,58.7L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                  "M0,160L48,138.7C96,117,192,75,288,64C384,53,480,75,576,106.7C672,139,768,181,864,181.3C960,181,1056,139,1152,117.3C1248,96,1344,96,1392,96L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                ]
              }}
              transition={{
                duration: getAnimationDuration().max,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.path
              fill={secondaryColor}
              fillOpacity="0.1"
              d="M0,256L48,240C96,224,192,192,288,181.3C384,171,480,181,576,186.7C672,192,768,192,864,170.7C960,149,1056,107,1152,112C1248,117,1344,171,1392,197.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              animate={{
                d: [
                  "M0,256L48,240C96,224,192,192,288,181.3C384,171,480,181,576,186.7C672,192,768,192,864,170.7C960,149,1056,107,1152,112C1248,117,1344,171,1392,197.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                  "M0,224L48,213.3C96,203,192,181,288,154.7C384,128,480,96,576,106.7C672,117,768,171,864,197.3C960,224,1056,224,1152,213.3C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                  "M0,256L48,240C96,224,192,192,288,181.3C384,171,480,181,576,186.7C672,192,768,192,864,170.7C960,149,1056,107,1152,112C1248,117,1344,171,1392,197.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                ]
              }}
              transition={{
                duration: getAnimationDuration().max * 1.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            />
          </svg>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className={`relative overflow-hidden ${className}`} {...props}>
      {renderBackground()}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default AnimatedBackground; 