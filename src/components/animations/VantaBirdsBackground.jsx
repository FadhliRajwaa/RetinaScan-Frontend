import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

const VantaBirdsBackground = ({ children, className }) => {
  const [vantaEffect, setVantaEffect] = useState(null);
  const [error, setError] = useState(false);
  const vantaRef = useRef(null);
  const { isDarkMode } = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isBatteryLow, setIsBatteryLow] = useState(false);
  
  // Check if device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);
  
  // Check if user prefers reduced motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);
  
  // Check battery status if available
  useEffect(() => {
    if ('getBattery' in navigator) {
      navigator.getBattery().then(battery => {
        setIsBatteryLow(battery.level <= 0.2 && !battery.charging);
        
        const handleChange = () => {
          setIsBatteryLow(battery.level <= 0.2 && !battery.charging);
        };
        
        battery.addEventListener('levelchange', handleChange);
        battery.addEventListener('chargingchange', handleChange);
        
        return () => {
          battery.removeEventListener('levelchange', handleChange);
          battery.removeEventListener('chargingchange', handleChange);
        };
      }).catch(() => {
        // Ignore battery API errors
      });
    }
  }, []);
  
  // Determine if animation should be simplified or disabled
  const shouldSimplify = isMobile || prefersReducedMotion || isBatteryLow;
  
  useEffect(() => {
    // Skip if there's an error or user prefers reduced motion
    if (error || prefersReducedMotion || !vantaRef.current) return;
    
    // Prevent multiple initializations
    if (vantaEffect) return;
    
    // Check if VANTA is available globally
    if (typeof window.VANTA === 'undefined') {
      console.error('VANTA is not defined. Make sure the script is loaded correctly.');
      setError(true);
      return;
    }
    
    try {
      // Configure options based on device capabilities and theme
      const options = {
        el: vantaRef.current,
        mouseControls: !shouldSimplify,
        touchControls: !shouldSimplify,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: shouldSimplify ? 0.5 : 1.00,
        scaleMobile: 0.5,
        backgroundColor: isDarkMode ? 0x0f172a : 0xf8fafc, // dark: slate-900, light: slate-50
        color1: isDarkMode ? 0x60a5fa : 0x3b82f6, // dark: blue-400, light: blue-500
        color2: isDarkMode ? 0x3b82f6 : 0x2563eb, // dark: blue-500, light: blue-600
        colorMode: "variance",
        birdSize: shouldSimplify ? 1.0 : 1.2,
        wingSpan: shouldSimplify ? 15.0 : 30.0,
        speedLimit: shouldSimplify ? 3.0 : 5.0,
        separation: shouldSimplify ? 40.0 : 50.0,
        alignment: 50.0,
        cohesion: 50.0,
        quantity: shouldSimplify ? 1.0 : 3.0,
        backgroundAlpha: 0.0, // Transparent background
        fps: shouldSimplify ? 30 : 60
      };
      
      // Initialize effect using global VANTA
      const effect = window.VANTA.BIRDS(options);
      
      if (effect) {
        setVantaEffect(effect);
      }
    } catch (err) {
      console.error('Failed to initialize Vanta effect:', err);
      setError(true);
    }
    
    // Cleanup
    return () => {
      if (vantaEffect) {
        try {
          vantaEffect.destroy();
        } catch (err) {
          console.error('Error destroying Vanta effect:', err);
        }
      }
    };
  }, [vantaEffect, isDarkMode, shouldSimplify, prefersReducedMotion, error]);

  // Recreate effect when theme or device capability changes
  useEffect(() => {
    if (vantaEffect) {
      try {
        vantaEffect.destroy();
      } catch (err) {
        console.error('Error destroying Vanta effect:', err);
      }
      setVantaEffect(null);
    }
  }, [isDarkMode, isMobile, prefersReducedMotion, isBatteryLow]);

  // If error or reduced motion preference, just return a simple gradient background
  if (error || prefersReducedMotion) {
    return (
      <div 
        className={`simple-background ${className || ''}`} 
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          zIndex: 0,
          opacity: 0.2,
          background: isDarkMode 
            ? 'radial-gradient(circle, rgba(37,99,235,0.1) 0%, rgba(15,23,42,0) 70%)' 
            : 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, rgba(248,250,252,0) 70%)',
          pointerEvents: 'none'
        }}
      >
        {children}
      </div>
    );
  }

  return (
    <div ref={vantaRef} className={`vanta-birds-bg ${className || ''}`} style={{ 
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      zIndex: 0,
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      opacity: prefersReducedMotion ? 0.1 : 
              isBatteryLow ? 0.2 :
              isDarkMode ? (isMobile ? 0.4 : 0.6) : 
                          (isMobile ? 0.3 : 0.5),
      pointerEvents: 'none' // Allow clicking through to content below
    }}>
      {children}
    </div>
  );
};

export default VantaBirdsBackground; 