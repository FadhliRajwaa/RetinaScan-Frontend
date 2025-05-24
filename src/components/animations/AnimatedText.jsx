import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const textVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const letterVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 12,
      stiffness: 100
    }
  }
};

const wordVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 12,
      stiffness: 100
    }
  }
};

const highlightVariants = {
  initial: { backgroundSize: '0% 100%' },
  animate: { 
    backgroundSize: '100% 100%',
    transition: { duration: 0.8, ease: 'easeOut' }
  }
};

const AnimatedText = ({
  text,
  type = 'words',
  className = '',
  delay = 0,
  duration = 0.5,
  highlight = false,
  highlightColor = 'rgba(59, 130, 246, 0.3)',
  once = true,
  ...props
}) => {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div className={className}>{text}</div>;
  }

  if (type === 'letters') {
    return (
      <motion.div
        className={`inline-block ${className}`}
        variants={textVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay }}
        {...props}
      >
        {text.split('').map((char, index) => (
          <motion.span
            key={`${char}-${index}`}
            variants={letterVariants}
            style={{ display: 'inline-block' }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </motion.div>
    );
  }

  if (highlight) {
    return (
      <motion.span
        className={`inline-block ${className}`}
        initial="initial"
        animate="animate"
        style={{
          backgroundImage: `linear-gradient(${highlightColor}, ${highlightColor})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: '0 100%',
          backgroundSize: '0% 100%',
          transition: `background-size ${duration}s ease-out`
        }}
        variants={highlightVariants}
        {...props}
      >
        {text}
      </motion.span>
    );
  }

  return (
    <motion.div
      className={`inline-block ${className}`}
      variants={textVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay }}
      {...props}
    >
      {text.split(' ').map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          variants={wordVariants}
          className="inline-block"
          style={{ marginRight: '0.25em' }}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default AnimatedText; 