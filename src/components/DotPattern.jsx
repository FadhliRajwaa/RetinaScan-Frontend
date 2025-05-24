"use client";

import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

/**
 * DotPattern Component
 *
 * Komponen yang membuat latar belakang dengan pola titik yang dapat dianimasi.
 * Pola ini secara otomatis menyesuaikan ukuran kontainernya dan dapat menampilkan titik yang bersinar.
 */
function DotPattern({
  width = 16,
  height = 16,
  cx = 1,
  cy = 1,
  cr = 1,
  className = '',
  glow = false,
  color = '#3b82f6',
  maskImage = 'radial-gradient(600px circle at center, white, transparent)',
}) {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Hitung jumlah titik berdasarkan dimensi kontainer
  const dots = Array.from(
    {
      length:
        Math.ceil(dimensions.width / width) *
        Math.ceil(dimensions.height / height),
    },
    (_, i) => {
      const col = i % Math.ceil(dimensions.width / width);
      const row = Math.floor(i / Math.ceil(dimensions.width / width));
      return {
        x: col * width + cx,
        y: row * height + cy,
        delay: Math.random() * 5,
        duration: Math.random() * 3 + 2,
      };
    }
  );

  // Style dasar untuk SVG
  const svgStyle = {
    WebkitMaskImage: maskImage,
    maskImage: maskImage,
  };

  if (!isMounted) {
    return null;
  }

  return (
    <svg
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      style={svgStyle}
    >
      <defs>
        <radialGradient id="dot-gradient">
          <stop offset="0%" stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      {dots.map((dot, index) => (
        <motion.circle
          key={`${dot.x}-${dot.y}-${index}`}
          cx={dot.x}
          cy={dot.y}
          r={cr}
          fill={glow ? "url(#dot-gradient)" : color}
          className="opacity-80"
          initial={glow ? { opacity: 0.4, scale: 1 } : {}}
          animate={
            glow
              ? {
                  opacity: [0.4, 1, 0.4],
                  scale: [1, 1.5, 1],
                }
              : {}
          }
          transition={
            glow
              ? {
                  duration: dot.duration,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: dot.delay,
                  ease: "easeInOut",
                }
              : {}
          }
        />
      ))}
    </svg>
  );
}

DotPattern.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  cx: PropTypes.number,
  cy: PropTypes.number,
  cr: PropTypes.number,
  className: PropTypes.string,
  glow: PropTypes.bool,
  color: PropTypes.string,
  maskImage: PropTypes.string,
};

export default DotPattern; 