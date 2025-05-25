import { useState } from 'react';
import { motion } from 'framer-motion';

const ShimmerButton = ({ 
  children, 
  onClick, 
  disabled = false, 
  type = "button", 
  className = "",
  fullWidth = false,
  variant = "primary", // primary, secondary, outline
  size = "md", // sm, md, lg
  rounded = "md", // sm, md, lg, full
  animateOnHover = true,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Base classes
  const baseClasses = "relative overflow-hidden font-medium flex items-center justify-center transition-all";
  
  // Size variants
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5",
    lg: "px-6 py-3 text-lg"
  };
  
  // Border radius variants
  const roundedClasses = {
    sm: "rounded",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full"
  };
  
  // Variant classes
  const variantClasses = {
    primary: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:shadow-lg hover:shadow-blue-500/25",
    secondary: "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md hover:shadow-lg hover:shadow-purple-500/25",
    outline: "bg-transparent border border-blue-500/30 text-blue-500 hover:border-blue-500/60"
  };
  
  // Width class
  const widthClass = fullWidth ? "w-full" : "";

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${roundedClasses[rounded]}
        ${variantClasses[variant]}
        ${widthClass}
        ${disabled ? "opacity-70 cursor-not-allowed" : ""}
        ${className}
      `}
      whileHover={animateOnHover && !disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Shimmer effect */}
      {animateOnHover && !disabled && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ clipPath: "inset(0)" }}
        >
          <motion.div
            className="absolute -inset-[100%] w-[400%] h-[200%] bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{
              x: isHovered ? ["-100%", "100%"] : "-100%",
            }}
            transition={{
              duration: isHovered ? 1.5 : 0,
              ease: "linear",
              repeat: isHovered ? Infinity : 0,
            }}
          />
        </motion.div>
      )}
      
      {/* Button content */}
      <div className="relative z-10 flex items-center justify-center">
        {children}
      </div>
    </motion.button>
  );
};

export default ShimmerButton; 