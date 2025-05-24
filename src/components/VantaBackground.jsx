import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';

// Lazy load VANTA untuk menghindari masalah SSR
let VANTA = null;

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
  color = 0x0,
  waveHeight = 15,
  waveSpeed = 0.5,
  zoom = 1,
  mouseControls = true,
}) => {
  const vantaRef = useRef(null);
  const vantaEffectRef = useRef(null);
  const [vantaLoaded, setVantaLoaded] = useState(false);
  const { theme } = useTheme();

  // Dinamis import Vanta.js
  useEffect(() => {
    const loadVanta = async () => {
      if (!VANTA) {
        try {
          // Dynamically import Vanta
          const vantaModule = await import('vanta/dist/vanta.waves.min');
          VANTA = vantaModule.default;
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
        vantaEffectRef.current.destroy();
        vantaEffectRef.current = null;
      }
    };
  }, []);

  // Inisialisasi efek Vanta.js
  useEffect(() => {
    if (!vantaLoaded || !vantaRef.current || !VANTA) return;

    // Destroy previous effect if exists
    if (vantaEffectRef.current) {
      vantaEffectRef.current.destroy();
    }

    // Create new effect
    vantaEffectRef.current = VANTA.WAVES({
      el: vantaRef.current,
      THREE: THREE,
      mouseControls: mouseControls,
      touchControls: true,
      gyroControls: false,
      waveHeight: waveHeight,
      waveSpeed: waveSpeed,
      zoom: zoom,
      color: color,
      shininess: 30,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.00,
      scaleMobile: 1.00
    });

  }, [vantaLoaded, color, waveHeight, waveSpeed, zoom, mouseControls, theme]);

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