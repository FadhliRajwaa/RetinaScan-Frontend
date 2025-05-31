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
  const [devicePerformance, setDevicePerformance] = useState('high'); // 'low', 'medium', 'high'

  // Detect device performance
  useEffect(() => {
    const checkPerformance = () => {
      // Check if device is mobile first
      const userAgent = typeof window.navigator === 'undefined' ? '' : navigator.userAgent;
      const mobile = Boolean(
        userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i)
      );
      setIsMobile(mobile);
      
      // Simple performance detection based on device memory and processor cores
      if (typeof window !== 'undefined') {
        // Check device memory if available
        const memory = navigator.deviceMemory || 4; // Default to 4GB if not available
        const cores = navigator.hardwareConcurrency || 4; // Default to 4 cores if not available
        
        // Check if it's a low-end device
        if (mobile && (memory <= 2 || cores <= 4)) {
          setDevicePerformance('low');
        } 
        // Check if it's a mid-range device
        else if ((mobile && (memory <= 4 || cores <= 6)) || 
                (!mobile && (memory <= 4 || cores <= 4))) {
          setDevicePerformance('medium');
        } 
        // Otherwise it's a high-end device
        else {
          setDevicePerformance('high');
        }
      }
    };
    
    checkPerformance();
    
    // Check again if window size changes
    const handleResize = () => {
      // Use throttling to prevent excessive calls
      if (!window.resizeThrottleTimeout) {
        window.resizeThrottleTimeout = setTimeout(() => {
          window.resizeThrottleTimeout = null;
          checkPerformance();
        }, 250);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (window.resizeThrottleTimeout) {
        clearTimeout(window.resizeThrottleTimeout);
      }
    };
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
          
          // If scripts still not detected after retries, try loading them directly
          if (retryCount === 2) {
            console.log('Loading THREE.js directly');
            const threeScript = document.createElement('script');
            threeScript.src = './three.r134.min.js';
            document.head.appendChild(threeScript);
            
            threeScript.onload = () => {
              console.log('Loading Vanta.js directly');
              const vantaScript = document.createElement('script');
              vantaScript.src = './vanta.birds.min.js';
              document.head.appendChild(vantaScript);
              
              vantaScript.onload = () => {
                console.log('Initializing Vanta directly');
                setIsScriptLoaded(true);
              };
            };
          }
          
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
      
      // Adjust parameters based on device performance
      let performanceSettings = {
        actualBirdSize: birdSize,
        actualQuantity: quantity,
        actualSpeedLimit: speedLimit,
        actualFps: 60,
        actualWingSpan: wingSpan
      };
      
      // Apply performance-based settings
      if (devicePerformance === 'low') {
        performanceSettings = {
          actualBirdSize: birdSize * 1.3, // Bigger birds = fewer birds needed
          actualQuantity: Math.max(1, quantity * 0.5), // Significantly reduce bird count
          actualSpeedLimit: speedLimit * 0.6, // Slower movement
          actualFps: 30, // Lower FPS
          actualWingSpan: wingSpan * 0.9 // Slightly smaller wingspan
        };
      } else if (devicePerformance === 'medium') {
        performanceSettings = {
          actualBirdSize: birdSize * 1.1,
          actualQuantity: Math.max(1, quantity * 0.7),
          actualSpeedLimit: speedLimit * 0.75,
          actualFps: 45,
          actualWingSpan: wingSpan * 0.95
        };
      }
      
      const newEffect = window.VANTA.BIRDS({
        el: vantaRef.current,
        mouseControls: mouseControls,
        touchControls: touchControls,
        gyroControls: gyroControls,
        minHeight: minHeight,
        minWidth: minWidth,
        scale: isMobile ? scaleMobile : scale,
        scaleMobile: scaleMobile,
        backgroundColor: backgroundColor,
        color1: color1,
        color2: color2,
        colorMode: colorMode,
        birdSize: performanceSettings.actualBirdSize,
        wingSpan: performanceSettings.actualWingSpan,
        speedLimit: performanceSettings.actualSpeedLimit,
        separation: separation,
        alignment: alignment,
        cohesion: cohesion,
        quantity: performanceSettings.actualQuantity,
        backgroundAlpha: backgroundAlpha,
        // Make sure vanta doesn't affect layout
        position: 'absolute',
        zIndex: '-1',
        pointerEvents: 'none'
      });
      
      setVantaEffect(newEffect);
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
    devicePerformance,
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

    // Throttle the resize handler for better performance
    let timeoutId;
    let lastExecution = 0;
    const throttleDelay = 200; // ms
    
    const throttledResize = () => {
      const now = Date.now();
      if (now - lastExecution > throttleDelay) {
        handleResize();
        lastExecution = now;
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(handleResize, throttleDelay);
      }
    };

    window.addEventListener('resize', throttledResize);
    
    return () => {
      window.removeEventListener('resize', throttledResize);
      clearTimeout(timeoutId);
    };
  }, [vantaEffect]);

  // Add visibility change handler to pause animation when tab is not visible
  useEffect(() => {
    if (!vantaEffect) return;
    
    const handleVisibilityChange = () => {
      if (document.hidden && vantaEffect) {
        // Pause animation when tab is not visible
        if (vantaEffect.setOptions) {
          vantaEffect.setOptions({ fps: 0 }); // Completely pause when not visible
        }
      } else if (vantaEffect) {
        // Resume normal animation when tab is visible again
        if (vantaEffect.setOptions) {
          const fps = devicePerformance === 'low' ? 30 : (devicePerformance === 'medium' ? 45 : 60);
          vantaEffect.setOptions({ fps });
        }
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [vantaEffect, devicePerformance]);

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