import { motion } from 'framer-motion';
import { useState } from 'react';

const buttonVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

const glowVariants = {
  initial: { opacity: 0 },
  hover: { 
    opacity: 0.8,
    transition: { duration: 0.3 }
  }
};

const gradientVariants = {
  initial: { backgroundPosition: '0% 50%' },
  hover: { 
    backgroundPosition: '100% 50%',
    transition: { duration: 1, repeat: Infinity, repeatType: 'reverse' }
  }
};

const AnimatedButton = ({
  children,
  className = '',
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  fullWidth = false,
  withGlow = false,
  withGradient = false,
  gradientColors = ['#3b82f6', '#8b5cf6'],
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const getVariantStyles = () => {
    const baseStyles = 'relative rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2',
      lg: 'px-6 py-3 text-lg'
    };
    
    const variantStyles = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      secondary: 'bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500',
      success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
      warning: 'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500',
      info: 'bg-cyan-500 text-white hover:bg-cyan-600 focus:ring-cyan-500',
      light: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-300',
      dark: 'bg-gray-800 text-white hover:bg-gray-900 focus:ring-gray-700',
      outline: 'bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
      link: 'bg-transparent text-blue-600 hover:underline focus:ring-blue-500 px-1 py-1'
    };
    
    const widthStyles = fullWidth ? 'w-full' : '';
    const disabledStyles = disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer';
    
    return `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyles} ${disabledStyles}`;
  };

  const getGradientStyle = () => {
    if (!withGradient) return {};
    
    return {
      background: `linear-gradient(45deg, ${gradientColors.join(', ')})`,
      backgroundSize: '200% 200%',
    };
  };

  return (
    <motion.button
      type={type}
      className={`${getVariantStyles()} ${className}`}
      disabled={disabled}
      onClick={onClick}
      variants={buttonVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={getGradientStyle()}
      animate={withGradient ? 'hover' : 'initial'}
      {...props}
    >
      {withGlow && (
        <motion.div
          className="absolute inset-0 rounded-lg -z-10"
          style={{ 
            boxShadow: `0 0 20px 5px ${typeof withGlow === 'string' ? withGlow : gradientColors[0]}`,
            opacity: 0
          }}
          variants={glowVariants}
          initial="initial"
          animate={isHovered ? 'hover' : 'initial'}
        />
      )}
      {children}
    </motion.button>
  );
};

export default AnimatedButton; 