import { motion } from 'framer-motion';
import { useState } from 'react';

const AnimatedCard = ({ 
  children, 
  className = '', 
  hoverEffect = true, 
  glowEffect = true,
  hoverScale = 1.02,
  delay = 0 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div 
      className={`relative overflow-hidden rounded-2xl ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: delay, 
        ease: [0.22, 1, 0.36, 1] 
      }}
      whileHover={hoverEffect ? { scale: hoverScale } : {}}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {glowEffect && (
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-violet-600/20 rounded-2xl opacity-0"
          animate={{ opacity: isHovered ? 0.8 : 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
      
      {/* Shine effect on hover */}
      {glowEffect && (
        <motion.div 
          className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none"
          style={{ clipPath: "inset(0)" }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent w-[200%] h-[200%]"
            animate={{
              x: isHovered ? ["100%", "-100%"] : "100%",
              y: isHovered ? ["100%", "-100%"] : "100%",
            }}
            transition={{
              duration: isHovered ? 1.5 : 0,
              ease: "linear",
              repeat: isHovered ? Infinity : 0,
            }}
          />
        </motion.div>
      )}
      
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

export default AnimatedCard; 