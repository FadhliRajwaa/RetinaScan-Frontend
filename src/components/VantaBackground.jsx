import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';

// Lazy load VANTA untuk menghindari masalah SSR
let WAVES = null;

/**
 * Komponen untuk menampilkan efek background menggunakan Vanta.js
 * 
 * @param {Object} props - Props komponen
 * @param {string} props.color - Warna efek (dalam format hex)
 * @param {number} props.waveHeight - Tinggi gelombang
 * @param {number} props.waveSpeed - Kecepatan gelombang
 * @param {number} props.zoom - Level zoom
 * @param {boolean} props.mouseControls - Apakah efek bereaksi terhadap mouse
 * @returns {JSX.Element} Komponen VantaBackground
 */
const VantaBackground = ({
  color,
  waveHeight = 15,
  waveSpeed = 1.0,
  zoom = 1,
  mouseControls = true,
}) => {
  const vantaRef = useRef(null);
  const vantaEffectRef = useRef(null);
  const [vantaLoaded, setVantaLoaded] = useState(false);
  const [threeReady, setThreeReady] = useState(false);
  const { theme } = useTheme();
  
  // Warna berdasarkan tema
  const themeColor = theme === 'dark' ? 0x000000 : 0x3b82f6; // Hitam untuk dark mode, biru untuk light mode
  const actualColor = color !== undefined ? color : themeColor;
  
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
      if (!WAVES) {
        try {
          // Dynamically import Vanta
          log('Loading Vanta.js WAVES effect');
          WAVES = (await import('vanta/dist/vanta.waves.min')).default;
          log('Vanta WAVES loaded:', WAVES);
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
    if (!vantaLoaded || !vantaRef.current || !WAVES || !threeReady) {
      log('Skipping Vanta init, not ready yet:', { vantaLoaded, hasRef: !!vantaRef.current, hasWAVES: !!WAVES, threeReady });
      return;
    }

    log('Initializing Vanta WAVES with:', { color: actualColor, waveHeight, waveSpeed });

    // Destroy previous effect if exists
    if (vantaEffectRef.current) {
      vantaEffectRef.current.destroy();
    }

    try {
      // Create new effect
      vantaEffectRef.current = WAVES({
        el: vantaRef.current,
        THREE: THREE,
        mouseControls: mouseControls,
        touchControls: true,
        gyroControls: false,
        waveHeight: waveHeight,
        waveSpeed: waveSpeed,
        zoom: zoom,
        color: actualColor,
        shininess: 50, // Meningkatkan shininess untuk efek yang lebih terlihat
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        amplitude: 1.0 // Meningkatkan amplitudo gelombang
      });
      log('Vanta effect created successfully');
    } catch (error) {
      console.error('Error creating Vanta effect:', error);
    }

  }, [vantaLoaded, actualColor, waveHeight, waveSpeed, zoom, mouseControls, theme, threeReady]);

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
  waveHeight: PropTypes.number,
  waveSpeed: PropTypes.number,
  zoom: PropTypes.number,
  mouseControls: PropTypes.bool,
};

export default VantaBackground; 