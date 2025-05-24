"use client";

import { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as THREE from 'three';
import WAVES from 'vanta/dist/vanta.waves.min';
import { useTheme } from '../context/ThemeContext';

/**
 * Waves Background Component
 *
 * Komponen yang membuat latar belakang dengan efek waves menggunakan Vanta.js
 * Efek ini secara otomatis menyesuaikan ukuran kontainernya dan mendukung theme switching
 * 
 * @param {Object} props
 * @param {string} props.className - Kelas CSS tambahan
 * @param {Object} props.options - Opsi tambahan untuk Vanta.js waves
 * @returns {JSX.Element} - Komponen React
 */
function WavesBackground({ 
  className = '',
  options = {} 
}) {
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!vantaEffect) {
      // Initialize Vanta.js effect
      setVantaEffect(
        WAVES({
          el: vantaRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          color: 0x000000, // Black color
          shininess: 150.00,
          waveHeight: 20.00,
          waveSpeed: 0.50,
          zoom: 0.65,
          ...options
        })
      );
    }

    // Cleanup function
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [options]);

  // Update effect when theme changes
  useEffect(() => {
    if (vantaEffect) {
      const themeOptions = theme === 'dark' 
        ? { color: 0x000000 } 
        : { color: 0x050505 };
      
      vantaEffect.setOptions(themeOptions);
    }
  }, [theme, vantaEffect]);

  return (
    <div 
      ref={vantaRef} 
      className={`absolute inset-0 -z-10 overflow-hidden ${className}`}
      aria-hidden="true"
    />
  );
}

WavesBackground.propTypes = {
  className: PropTypes.string,
  options: PropTypes.object
};

export default WavesBackground; 