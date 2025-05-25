import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import DOTS from 'vanta/dist/vanta.dots.min';

const VantaBackground = ({ children, options = {}, className = '' }) => {
  const [vantaEffect, setVantaEffect] = useState(null);
  const myRef = useRef(null);

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        DOTS({
          el: myRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: options.scale || 1.00,
          scaleMobile: options.scaleMobile || 1.00,
          color: options.color || 0x3b82f6, // blue-500
          color2: options.color2 || 0x1e40af, // blue-800
          backgroundColor: options.backgroundColor || 0x030712, // gray-950
          spacing: options.spacing || 30.00,
          showLines: options.showLines || false,
          size: options.size || 1.50,
          speed: options.speed || 1.0,
          points: options.points || 20,
          maxDistance: options.maxDistance || 25.00
        })
      );
    }

    // Untuk menangani resize window
    const handleResize = () => {
      if (vantaEffect) {
        vantaEffect.resize();
      }
    };
    
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (vantaEffect) vantaEffect.destroy();
      window.removeEventListener('resize', handleResize);
    };
  }, [vantaEffect, options]);

  return (
    <div 
      ref={myRef} 
      className={`${className} fixed inset-0 w-full h-full overflow-hidden`}
      style={{ zIndex: -1 }}
    >
      {children}
    </div>
  );
};

export default VantaBackground; 