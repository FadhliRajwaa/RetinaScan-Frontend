import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import DOTS from 'vanta/dist/vanta.dots.min';

const VantaBackground = ({ children, options = {} }) => {
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
          scale: 1.00,
          scaleMobile: 1.00,
          color: options.color || 0x8620ff,
          color2: options.color2 || 0x130b58,
          backgroundColor: options.backgroundColor || 0x050505,
          spacing: options.spacing || 25.00,
          showLines: options.showLines || false,
          size: options.size || 3
        })
      );
    }

    // Cleanup
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect, options]);

  return (
    <div ref={myRef} style={{ position: 'absolute', width: '100%', height: '100%', overflow: 'hidden', zIndex: -1 }}>
      {children}
    </div>
  );
};

export default VantaBackground; 