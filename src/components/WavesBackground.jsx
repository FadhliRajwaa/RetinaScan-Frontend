"use client";

import { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// Import Three.js dengan ES modules format
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';

// Simpan WAVES sebagai variable yang akan diimpor secara lazy
let WAVES = null;

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
  const [isMounted, setIsMounted] = useState(false);
  const [isVantaLoaded, setIsVantaLoaded] = useState(false);

  // Impor Vanta.js secara lazy ketika komponen dimount
  useEffect(() => {
    const loadVanta = async () => {
      try {
        // Impor Vanta.js secara lazy
        WAVES = (await import('vanta/dist/vanta.waves.min')).default;
        setIsVantaLoaded(true);
        console.log('Vanta.js loaded successfully');
      } catch (error) {
        console.error('Error loading Vanta.js:', error);
      }
    };

    if (!WAVES) {
      loadVanta();
    } else {
      setIsVantaLoaded(true);
    }
  }, []);

  // Pastikan komponen dimount sebelum inisialisasi Vanta
  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
      // Pastikan efek dihancurkan saat komponen unmount
      if (vantaEffect) {
        try {
          console.log('Destroying Vanta.js effect on unmount');
          vantaEffect.destroy();
        } catch (error) {
          console.error('Error destroying Vanta.js effect:', error);
        }
      }
    };
  }, []);

  // Inisialisasi efek Vanta
  useEffect(() => {
    // Hanya inisialisasi jika komponen dimount, Vanta.js sudah diimpor, efek belum dibuat, dan ref tersedia
    if (!vantaEffect && isMounted && isVantaLoaded && WAVES && vantaRef.current) {
      console.log('Initializing Vanta.js effect');
      
      // Delay sedikit untuk memastikan DOM sudah sepenuhnya dirender
      const initTimer = setTimeout(() => {
        try {
          // Pastikan window dan THREE tersedia
          if (!window || !THREE) {
            console.error('Window atau THREE tidak tersedia');
            return;
          }
          
          // Initialize Vanta.js effect dengan tinggi yang cukup
          // Tangani dengan defensive programming untuk mencegah error "pp is not a function"
          const effect = WAVES({
            el: vantaRef.current,
            THREE: THREE,
            mouseControls: false, // Nonaktifkan mouse control agar tidak mengganggu interaksi form
            touchControls: false, // Nonaktifkan touch control agar tidak mengganggu interaksi form
            gyroControls: false,
            minHeight: window.innerHeight,
            minWidth: window.innerWidth,
            scale: 1.00,
            scaleMobile: 1.00,
            color: 0x000000, // Black color
            shininess: 150.00,
            waveHeight: 15.00, // Mengurangi tinggi gelombang agar tidak terlalu mencolok
            waveSpeed: 0.50, // Mengurangi kecepatan agar tidak terlalu mengganggu
            zoom: 0.85, // Meningkatkan zoom sedikit
            ...options
          });
          
          if (effect) {
            setVantaEffect(effect);
            console.log('Vanta.js effect initialized successfully');
          } else {
            console.error('Failed to initialize Vanta.js effect');
          }
        } catch (error) {
          console.error('Error initializing Vanta.js effect:', error);
        }
      }, 300); // Meningkatkan delay untuk memberikan waktu lebih pada DOM
      
      return () => clearTimeout(initTimer);
    }
  }, [options, isMounted, isVantaLoaded]);

  // Update effect when theme changes
  useEffect(() => {
    if (vantaEffect) {
      try {
        const themeOptions = theme === 'dark' 
          ? { color: 0x000000 } // Black color for dark mode
          : { color: 0x000000 }; // Keep black for light mode too as requested
        
        console.log('Updating Vanta.js effect with theme:', theme);
        vantaEffect.setOptions(themeOptions);
      } catch (error) {
        console.error('Error updating Vanta.js effect:', error);
      }
    }
  }, [theme, vantaEffect]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (vantaEffect) {
        try {
          // Resize effect untuk mencegah masalah sizing
          console.log('Window resize detected, resizing Vanta effect');
          vantaEffect.resize();
        } catch (error) {
          console.error('Error resizing Vanta.js effect:', error);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [vantaEffect]);

  // Render fallback tanpa effect jika Vanta.js tidak tersedia
  if (!isVantaLoaded) {
    return (
      <div 
        className={`fixed inset-0 -z-10 h-full w-full overflow-hidden pointer-events-none bg-gradient-to-b from-gray-900 to-black ${className}`}
        aria-hidden="true"
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none'
        }}
      />
    );
  }

  return (
    <div 
      ref={vantaRef} 
      className={`fixed inset-0 -z-10 h-full w-full overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none'
      }}
    />
  );
}

WavesBackground.propTypes = {
  className: PropTypes.string,
  options: PropTypes.object
};

export default WavesBackground; 