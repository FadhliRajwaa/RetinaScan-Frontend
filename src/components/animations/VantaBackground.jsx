import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

const VantaBackground = ({ 
  children, 
  className = '',
  mouseControls = true,
  touchControls = true,
  gyroControls = false,
  minHeight = 200,
  minWidth = 200,
  scale = 1.00,
  scaleMobile = 1.00,
  backgroundColor = 0x0,
  color1 = 0x5288e,
  color2 = 0x1399ff,
  colorMode = "variance",
  birdSize = 1.5,
  wingSpan = 30.0,
  speedLimit = 5.0,
  separation = 100.0,
  alignment = 20.0,
  cohesion = 20.0,
  quantity = 3.0,
  backgroundAlpha = 0.0
}) => {
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = typeof window.navigator === 'undefined' ? '' : navigator.userAgent;
      const mobile = Boolean(
        userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i)
      );
      setIsMobile(mobile);
    };
    
    checkMobile();
    
    // Check again if window size changes
    const handleResize = () => {
      checkMobile();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Check if scripts are already loaded
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.THREE && window.VANTA && window.VANTA.BIRDS) {
        setIsScriptLoaded(true);
      }
    }
  }, []);

  useEffect(() => {
    // Check if we're in a browser environment (not SSR)
    if (typeof window === 'undefined') return;
    
    // Debounce the effect initialization to improve performance
    let timeoutId;
    
    const initEffect = () => {
      // Make sure VANTA and THREE are available in the global scope
      const VANTA = window.VANTA || {};
      const THREE = window.THREE;
      
      if (!VANTA.BIRDS || !THREE) {
        // Only try to load scripts if they aren't already loaded
        if (!isInitialized) {
          const loadScripts = async () => {
            try {
              // Check if scripts need to be loaded
              if (!window.THREE) {
                await loadScript('/js/three.r134.min.js');
              }
              
              if (!window.VANTA || !window.VANTA.BIRDS) {
                await loadScript('/js/vanta.birds.min.js');
              }
              
              setIsInitialized(true);
              setIsScriptLoaded(true);
            } catch (error) {
              console.error('Error loading Vanta.js scripts:', error);
            }
          };
          
          loadScripts();
        }
        return;
      }

      // Cleanup previous effect
      if (vantaEffect) vantaEffect.destroy();
      
      // Only initialize if the ref exists and scripts are loaded
      if (!vantaRef.current || !window.VANTA.BIRDS) return;

      // Adjust parameters for mobile devices
      const actualBirdSize = isMobile ? birdSize * 0.8 : birdSize;
      const actualQuantity = isMobile ? Math.max(1, quantity * 0.7) : quantity;
      const actualSpeedLimit = isMobile ? speedLimit * 0.8 : speedLimit;
      
      // Initialize the effect with optimized settings
      const effect = window.VANTA.BIRDS({
        el: vantaRef.current,
        THREE,
        mouseControls,
        touchControls: isMobile ? true : touchControls, // Always enable touch controls on mobile
        gyroControls: isMobile ? false : gyroControls, // Disable gyro on mobile to save battery
        minHeight,
        minWidth,
        scale,
        scaleMobile,
        backgroundColor,
        color1,
        color2,
        colorMode,
        birdSize: actualBirdSize,
        wingSpan,
        speedLimit: actualSpeedLimit,
        separation,
        alignment,
        cohesion,
        quantity: actualQuantity,
        backgroundAlpha,
        // Add performance optimizations
        fps: isMobile ? 30 : 60, // Lower FPS on mobile
      });

      setVantaEffect(effect);
    };

    // Use a timeout to debounce the initialization
    timeoutId = setTimeout(() => {
      if (isScriptLoaded || window.THREE && window.VANTA && window.VANTA.BIRDS) {
        initEffect();
      }
    }, 100);

    // Cleanup on unmount
    return () => {
      clearTimeout(timeoutId);
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [
    isInitialized,
    isScriptLoaded,
    isMobile, // Re-render when mobile state changes
    mouseControls,
    touchControls,
    gyroControls,
    minHeight,
    minWidth,
    scale,
    scaleMobile,
    backgroundColor,
    color1,
    color2,
    colorMode,
    birdSize,
    wingSpan,
    speedLimit,
    separation,
    alignment,
    cohesion,
    quantity,
    backgroundAlpha
  ]);

  // Handle window resize for better performance
  useEffect(() => {
    if (!vantaEffect) return;

    const handleResize = () => {
      if (vantaEffect && vantaEffect.resize) {
        vantaEffect.resize();
      }
    };

    // Debounce the resize handler
    let timeoutId;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 100);
    };

    window.addEventListener('resize', debouncedResize);
    
    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(timeoutId);
    };
  }, [vantaEffect]);

  // Add visibility change handler to pause animation when tab is not visible
  useEffect(() => {
    if (!vantaEffect) return;
    
    const handleVisibilityChange = () => {
      if (document.hidden && vantaEffect) {
        // Pause or slow down animation when tab is not visible
        if (vantaEffect.setOptions) {
          vantaEffect.setOptions({ fps: 10 }); // Lower FPS dramatically when not visible
        }
      } else if (vantaEffect) {
        // Resume normal animation when tab is visible again
        if (vantaEffect.setOptions) {
          vantaEffect.setOptions({ fps: isMobile ? 30 : 60 });
        }
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [vantaEffect, isMobile]);

  // Helper function to load scripts dynamically
  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  };

  return (
    <div 
      ref={vantaRef} 
      className={`vanta-background ${className}`} 
      style={{ 
        position: 'absolute', 
        width: '100%', 
        height: '100%', 
        top: 0, 
        left: 0, 
        zIndex: 0,
        // Add will-change for better performance
        willChange: 'transform',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        // Additional optimizations
        pointerEvents: 'none', // Prevent unnecessary hover events
      }}
      aria-hidden="true" // For accessibility, this is just decorative
    >
      <div style={{ position: 'relative', zIndex: 1, pointerEvents: 'auto' }}>
        {children}
      </div>
    </div>
  );
};

VantaBackground.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  mouseControls: PropTypes.bool,
  touchControls: PropTypes.bool,
  gyroControls: PropTypes.bool,
  minHeight: PropTypes.number,
  minWidth: PropTypes.number,
  scale: PropTypes.number,
  scaleMobile: PropTypes.number,
  backgroundColor: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  color1: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  color2: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  colorMode: PropTypes.string,
  birdSize: PropTypes.number,
  wingSpan: PropTypes.number,
  speedLimit: PropTypes.number,
  separation: PropTypes.number,
  alignment: PropTypes.number,
  cohesion: PropTypes.number,
  quantity: PropTypes.number,
  backgroundAlpha: PropTypes.number
};

export default VantaBackground; 