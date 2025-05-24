import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';

// Lazy load VANTA untuk menghindari masalah SSR
let NET = null;

/**
 * Komponen untuk menampilkan efek background menggunakan Vanta.js
 * 
 * @param {Object} props - Props komponen
 * @param {string} props.color - Warna efek (dalam format hex)
 * @param {string} props.highlightColor - Warna highlight untuk efek (dalam format hex)
 * @param {number} props.points - Jumlah titik dalam jaringan
 * @param {number} props.maxDistance - Jarak maksimum antara titik yang terhubung
 * @param {number} props.spacing - Jarak antar titik
 * @param {boolean} props.mouseControls - Apakah efek bereaksi terhadap mouse
 * @returns {JSX.Element} Komponen VantaBackground
 */
const VantaBackground = ({
  color,
  highlightColor,
  points = 15,
  maxDistance = 20.0,
  spacing = 15.0,
  mouseControls = true,
}) => {
  const vantaRef = useRef(null);
  const vantaEffectRef = useRef(null);
  const [vantaLoaded, setVantaLoaded] = useState(false);
  const [threeReady, setThreeReady] = useState(false);
  const { theme } = useTheme();
  
  // Warna berdasarkan tema
  const themeColor = theme === 'dark' ? 0x1E1E2E : 0x03DAC6; // Biru gelap untuk dark mode, teal untuk light mode
  const themeHighlightColor = theme === 'dark' ? 0xBB86FC : 0xBB86FC; // Ungu untuk highlight
  
  const actualColor = color !== undefined ? color : themeColor;
  const actualHighlightColor = highlightColor !== undefined ? highlightColor : themeHighlightColor;
  
  // Debug mode
  const debug = true; // Set ke true untuk melihat log debug
  
  const log = (message, data) => {
    if (debug) {
      console.log(`[VantaBackground] ${message}`, data || '');
    }
  };
  
  // Memastikan THREE.js dimuat dengan benar
  useEffect(() => {
    if (typeof THREE === 'object' && THREE.REVISION) {
      log('THREE.js ready:', THREE.REVISION);
      setThreeReady(true);
    } else {
      console.error('THREE.js not properly loaded');
    }
  }, []);
  
  // Dinamis import Vanta.js
  useEffect(() => {
    if (!threeReady) {
      log('Waiting for THREE.js to be ready');
      return;
    }
    
    const loadVanta = async () => {
      if (!NET) {
        try {
          // Dynamically import Vanta
          log('Loading Vanta.js NET effect');
          NET = (await import('vanta/dist/vanta.net.min')).default;
          log('Vanta NET loaded:', NET);
          setVantaLoaded(true);
        } catch (error) {
          console.error('Error loading Vanta.js:', error);
        }
      } else {
        setVantaLoaded(true);
      }
    };

    loadVanta();

    return () => {
      // Cleanup
      if (vantaEffectRef.current) {
        log('Destroying Vanta effect');
        vantaEffectRef.current.destroy();
        vantaEffectRef.current = null;
      }
    };
  }, [threeReady]);

  // Inisialisasi efek Vanta.js
  useEffect(() => {
    if (!vantaLoaded || !vantaRef.current || !NET || !threeReady) {
      log('Skipping Vanta init, not ready yet:', { vantaLoaded, hasRef: !!vantaRef.current, hasNET: !!NET, threeReady });
      return;
    }

    log('Initializing Vanta NET with:', { color: actualColor, highlightColor: actualHighlightColor, points, maxDistance });

    // Destroy previous effect if exists
    if (vantaEffectRef.current) {
      vantaEffectRef.current.destroy();
    }

    try {
      // Create new effect
      vantaEffectRef.current = NET({
        el: vantaRef.current,
        THREE: THREE,
        mouseControls: mouseControls,
        touchControls: true,
        gyroControls: false,
        scale: 1.00,
        scaleMobile: 1.00,
        color: actualColor,
        backgroundColor: 0x1E1E2E,
        points: points,
        maxDistance: maxDistance,
        spacing: spacing,
        showDots: false,
        highlightColor: actualHighlightColor
      });
      log('Vanta effect created successfully');
    } catch (error) {
      console.error('Error creating Vanta effect:', error);
    }

  }, [vantaLoaded, actualColor, actualHighlightColor, points, maxDistance, spacing, mouseControls, theme, threeReady]);

  return (
    <div 
      ref={vantaRef}
      className="absolute inset-0 w-full h-full z-0"
      aria-hidden="true"
    />
  );
};

VantaBackground.propTypes = {
  color: PropTypes.number,
  highlightColor: PropTypes.number,
  points: PropTypes.number,
  maxDistance: PropTypes.number,
  spacing: PropTypes.number,
  mouseControls: PropTypes.bool,
};

export default VantaBackground; 