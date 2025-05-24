import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';

// Fungsi untuk memuat Vanta effect secara dinamis dengan error handling
const loadVantaEffect = async (effectName) => {
  try {
    // Pastikan THREE.js sudah terdefinisi secara global
    window.THREE = THREE;
    
    // Import Vanta effect secara dinamis
    switch (effectName) {
      case 'WAVES':
        return (await import('vanta/dist/vanta.waves.min')).default;
      case 'BIRDS':
        return (await import('vanta/dist/vanta.birds.min')).default;
      case 'CELLS':
        return (await import('vanta/dist/vanta.cells.min')).default;
      case 'NET':
        return (await import('vanta/dist/vanta.net.min')).default;
      case 'DOTS':
        return (await import('vanta/dist/vanta.dots.min')).default;
      case 'GLOBE':
        return (await import('vanta/dist/vanta.globe.min')).default;
      default:
        return (await import('vanta/dist/vanta.waves.min')).default;
    }
  } catch (error) {
    console.error(`Error loading Vanta effect ${effectName}:`, error);
    return null;
  }
};

// Konfigurasi default untuk setiap efek
const effectConfigs = {
  WAVES: {
    color: 0x1a56db,
    shininess: 60,
    waveHeight: 20,
    waveSpeed: 0.75,
    zoom: 0.8
  },
  BIRDS: {
    backgroundColor: 0x1a202c,
    color1: 0x3b82f6,
    color2: 0x8b5cf6,
    colorMode: 'lerpGradient',
    quantity: 4,
    backgroundAlpha: 0
  },
  CELLS: {
    color1: 0x3b82f6,
    color2: 0x8b5cf6,
    size: 1.5,
    speed: 1
  },
  NET: {
    color: 0x3b82f6,
    backgroundColor: 0x1a202c,
    points: 10,
    maxDistance: 20,
    spacing: 15
  },
  DOTS: {
    color: 0x3b82f6,
    backgroundColor: 0x1a202c,
    size: 3,
    spacing: 35,
    backgroundAlpha: 0
  },
  GLOBE: {
    color: 0x3b82f6,
    backgroundColor: 0x1a202c,
    size: 0.8
  }
};

const AnimatedBackground = ({ 
  effectType = 'WAVES',
  customConfig = {},
  className = '',
  children,
  overlayOpacity = 0,
  overlayColor = 'rgba(0,0,0,0)'
}) => {
  const vantaRef = useRef(null);
  const vantaEffect = useRef(null);
  const [isVantaLoaded, setIsVantaLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let mounted = true;
    let effect = null;

    const initVanta = async () => {
      try {
        // Hapus efek sebelumnya jika ada
        if (vantaEffect.current) {
          vantaEffect.current.destroy();
          vantaEffect.current = null;
        }

        // Muat Vanta effect
        const VantaEffect = await loadVantaEffect(effectType);
        
        // Jika komponen sudah di-unmount atau effect gagal dimuat, jangan lanjutkan
        if (!mounted || !VantaEffect || !vantaRef.current) {
          if (mounted && !VantaEffect) {
            setHasError(true);
          }
          return;
        }

        // Gabungkan konfigurasi default dengan konfigurasi kustom
        const config = {
          ...effectConfigs[effectType],
          ...customConfig,
          el: vantaRef.current,
          THREE: THREE
        };

        // Inisialisasi effect
        effect = VantaEffect(config);
        vantaEffect.current = effect;
        setIsVantaLoaded(true);
      } catch (error) {
        console.error('Error initializing Vanta effect:', error);
        if (mounted) {
          setHasError(true);
        }
      }
    };

    initVanta();

    // Cleanup function
    return () => {
      mounted = false;
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
      }
    };
  }, [effectType, customConfig]);

  // CSS classes untuk fallback background jika Vanta gagal dimuat
  const fallbackClasses = {
    WAVES: 'bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500',
    BIRDS: 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900',
    CELLS: 'bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700',
    NET: 'bg-gradient-to-br from-gray-900 via-blue-800 to-gray-800',
    DOTS: 'bg-gradient-to-br from-gray-900 to-blue-900',
    GLOBE: 'bg-gradient-to-br from-gray-900 via-blue-800 to-gray-900'
  };

  return (
    <div 
      className={`relative ${className} ${hasError ? fallbackClasses[effectType] : ''}`}
      ref={vantaRef}
    >
      {/* Overlay untuk mengontrol opacity latar belakang */}
      {overlayOpacity > 0 && (
        <div 
          className="absolute inset-0 z-0"
          style={{ backgroundColor: overlayColor, opacity: overlayOpacity }}
        ></div>
      )}
      
      {/* Animated content */}
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {children}
      </motion.div>
      
      {/* Fallback animation jika Vanta gagal dimuat */}
      {hasError && (
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="animate-pulse-slow absolute -inset-[10%] rounded-full opacity-20 blur-3xl bg-blue-500"></div>
          <div className="animate-pulse-slow animation-delay-2000 absolute -inset-[20%] rounded-full opacity-20 blur-3xl bg-purple-500"></div>
          <div className="animate-pulse-slow animation-delay-4000 absolute -inset-[15%] rounded-full opacity-20 blur-3xl bg-indigo-500"></div>
        </div>
      )}
    </div>
  );
};

export default AnimatedBackground; 