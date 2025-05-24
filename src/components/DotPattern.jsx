"use client";

import { useState, useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

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
  color,
  maskImage = 'radial-gradient(600px circle at center, white, transparent)',
}) {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isMounted, setIsMounted] = useState(false);
  const { theme } = useTheme();

  // Tentukan warna berdasarkan tema dan prop color
  const themeColor = useMemo(() => {
    if (color) return color;
    return theme === 'dark' ? '#3b82f6' : '#1e40af'; // Biru terang untuk dark mode, biru gelap untuk light mode
  }, [theme, color]);

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
    
    // Gunakan ResizeObserver untuk efisiensi yang lebih baik
    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(updateDimensions);
      if (containerRef.current) {
        observer.observe(containerRef.current);
      }
      return () => {
        if (containerRef.current) {
          observer.unobserve(containerRef.current);
        }
      };
    } else {
      // Fallback untuk browser yang tidak mendukung ResizeObserver
      window.addEventListener('resize', updateDimensions);
      return () => window.removeEventListener('resize', updateDimensions);
    }
  }, []);

  // Hitung jumlah titik berdasarkan dimensi kontainer - dioptimasi dengan useMemo
  const dots = useMemo(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return [];
    
    return Array.from(
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
  }, [dimensions, width, height, cx, cy]);

  // Style dasar untuk SVG
  const svgStyle = useMemo(() => ({
    WebkitMaskImage: maskImage,
    maskImage: maskImage,
  }), [maskImage]);

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
          <stop offset="0%" stopColor={themeColor} stopOpacity="1" />
          <stop offset="100%" stopColor={themeColor} stopOpacity="0" />
        </radialGradient>
      </defs>
      {dots.map((dot, index) => (
        <motion.circle
          key={`${dot.x}-${dot.y}-${index}`}
          cx={dot.x}
          cy={dot.y}
          r={cr}
          fill={glow ? "url(#dot-gradient)" : themeColor}
          className={`opacity-80 ${theme === 'light' ? 'opacity-60' : 'opacity-80'}`}
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