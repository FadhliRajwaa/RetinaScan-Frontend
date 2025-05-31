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
  const [isMobile, setIsMobile] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

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

  // Check if scripts are loaded
  useEffect(() => {
    const checkScriptsLoaded = () => {
      if (typeof window !== 'undefined' && window.THREE && window.VANTA && window.VANTA.BIRDS) {
        console.log('THREE and VANTA scripts detected');
        setIsScriptLoaded(true);
        return true;
      }
      return false;
    };

    // Initial check
    const isLoaded = checkScriptsLoaded();
    if (!isLoaded) {
      console.log('Scripts not detected, waiting for load event');
      
      // Listen for custom event from index.html
      const handleVantaLoaded = () => {
        console.log('Vanta loaded event received');
        setIsScriptLoaded(true);
      };
      
      document.addEventListener('vantaLoaded', handleVantaLoaded);
      
      // Check again after a delay (in case the scripts are still loading)
      const timeoutId = setTimeout(() => {
        if (!isScriptLoaded && retryCount < 3) {
          console.log(`Retry check #${retryCount + 1}`);
          setRetryCount(prev => prev + 1);
          checkScriptsLoaded();
        }
      }, 1000);
      
      return () => {
        document.removeEventListener('vantaLoaded', handleVantaLoaded);
        clearTimeout(timeoutId);
      };
    }
  }, [isScriptLoaded, retryCount]);

  // Initialize Vanta effect
  useEffect(() => {
    // Only proceed if scripts are loaded
    if (!isScriptLoaded) return;
    
    // Check if we're in a browser environment (not SSR)
    if (typeof window === 'undefined') return;
    
    // Cleanup previous effect
    if (vantaEffect) {
      console.log('Destroying previous Vanta effect');
      vantaEffect.destroy();
    }
    
    // Only initialize if the ref exists and scripts are loaded
    if (!vantaRef.current) {
      console.log('Ref not available yet');
      return;
    }
    
    if (!window.VANTA || !window.VANTA.BIRDS) {
      console.error('Vanta.js or Three.js not loaded properly');
      return;
    }

    try {
      console.log('Initializing Vanta effect');
      // Adjust parameters for mobile devices
      const actualBirdSize = isMobile ? birdSize * 0.8 : birdSize;
      const actualQuantity = isMobile ? Math.max(1, quantity * 0.7) : quantity;
      const actualSpeedLimit = isMobile ? speedLimit * 0.8 : speedLimit;
      
      // Initialize the effect with optimized settings
      const effect = window.VANTA.BIRDS({
        el: vantaRef.current,
        mouseControls,
        touchControls: isMobile ? true : touchControls,
        gyroControls: isMobile ? false : gyroControls,
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
        fps: isMobile ? 30 : 60, // Lower FPS on mobile
      });

      console.log('Vanta effect initialized successfully');
      setVantaEffect(effect);
    } catch (error) {
      console.error('Error initializing Vanta effect:', error);
    }

    // Cleanup on unmount
    return () => {
      if (vantaEffect) {
        console.log('Cleaning up Vanta effect');
        vantaEffect.destroy();
      }
    };
  }, [
    isScriptLoaded,
    isMobile,
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