import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import WAVES from 'vanta/dist/vanta.waves.min';
import BIRDS from 'vanta/dist/vanta.birds.min';
import CELLS from 'vanta/dist/vanta.cells.min';
import NET from 'vanta/dist/vanta.net.min';
import DOTS from 'vanta/dist/vanta.dots.min';
import GLOBE from 'vanta/dist/vanta.globe.min';
import { motion } from 'framer-motion';

const effectTypes = {
  WAVES,
  BIRDS,
  CELLS,
  NET,
  DOTS,
  GLOBE
};

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
    birdSize: 1.5,
    wingSpan: 30,
    speedLimit: 5,
    separation: 20
  },
  CELLS: {
    color1: 0x3b82f6,
    color2: 0x8b5cf6,
    size: 1.5,
    speed: 2
  },
  NET: {
    color: 0x3b82f6,
    backgroundColor: 0x111827,
    points: 10,
    maxDistance: 20,
    spacing: 16
  },
  DOTS: {
    color: 0x3b82f6,
    backgroundColor: 0x111827,
    size: 3,
    spacing: 35,
    showLines: true
  },
  GLOBE: {
    color: 0x3b82f6,
    backgroundColor: 0x111827,
    size: 1,
    spacing: 1.5,
    showDots: true
  }
};

const AnimatedBackground = ({ 
  children, 
  effectType = 'WAVES', 
  customConfig = {}, 
  className = '',
  overlay = true,
  overlayOpacity = 0.5,
  overlayColor = 'rgba(0, 0, 0, 0.2)'
}) => {
  const [vantaEffect, setVantaEffect] = useState(null);
  const vantaRef = useRef(null);

  useEffect(() => {
    if (!vantaEffect && vantaRef.current) {
      const VantaEffect = effectTypes[effectType];
      if (VantaEffect) {
        const config = {
          el: vantaRef.current,
          THREE,
          ...effectConfigs[effectType],
          ...customConfig
        };
        
        setVantaEffect(VantaEffect(config));
      }
    }

    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect, effectType, customConfig]);

  return (
    <div className={`relative w-full h-full ${className}`} ref={vantaRef}>
      {overlay && (
        <motion.div 
          className="absolute inset-0 z-10" 
          initial={{ opacity: 0 }}
          animate={{ opacity: overlayOpacity }}
          transition={{ duration: 1 }}
          style={{ backgroundColor: overlayColor }}
        />
      )}
      <div className="relative z-20 w-full h-full">
        {children}
      </div>
    </div>
  );
};

export default AnimatedBackground; 