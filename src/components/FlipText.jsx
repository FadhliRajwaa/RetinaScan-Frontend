import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const FlipText = ({
  children,
  className = '',
  delay = 0,
  staggerDelay = 0.05,
  duration = 0.5,
  ...props
}) => {
  const [items, setItems] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setItems(children.split(' '));
    return () => setMounted(false);
  }, [children]);

  if (!mounted) return null;

  return (
    <span className={`inline-block ${className}`} {...props}>
      {items.map((word, i) => (
        <span key={`word-${i}`} className="inline-block mx-[0.15em] first:ml-0 last:mr-0">
          {Array.from(word).map((letter, j) => (
            <motion.span
              key={`letter-${j}`}
              className="inline-block"
              initial={{ opacity: 0, rotateX: -90 }}
              animate={{ opacity: 1, rotateX: 0 }}
              transition={{
                delay: i * staggerDelay + j * 0.04 + delay,
                duration,
                ease: [0.25, 0.1, 0.25, 1.0],
              }}
              style={{ transformOrigin: "50% 50%" }}
            >
              {letter}
            </motion.span>
          ))}
        </span>
      ))}
    </span>
  );
};

export default FlipText; 