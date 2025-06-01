import { useEffect, useRef, useState, useCallback } from 'react';
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
  backgroundAlpha = 0.0,
  forceMobileHighPerformance = true // New prop to force high performance on mobile
}) => {
  const vantaRef = useRef(null);
  const containerRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [devicePerformance, setDevicePerformance] = useState('high'); // 'very-low', 'low', 'medium', 'high'
  const [isTabActive, setIsTabActive] = useState(true);
  const [isInViewport, setIsInViewport] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const frameCounterRef = useRef(0);
  const fpsMonitorRef = useRef(null);
  const lastFpsUpdateRef = useRef(Date.now());
  const actualFpsRef = useRef(60);
  const devicePixelRatioRef = useRef(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1);
  const forceHighPerformanceRef = useRef(forceMobileHighPerformance);

  // Advanced performance detection
  useEffect(() => {
    const checkPerformance = () => {
      // Check if device is mobile first
      const userAgent = typeof window.navigator === 'undefined' ? '' : navigator.userAgent;
      const mobile = Boolean(
        userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i)
      );
      setIsMobile(mobile);
      
      // Store device pixel ratio
      devicePixelRatioRef.current = window.devicePixelRatio || 1;
      
      // Advanced performance detection
      if (typeof window !== 'undefined') {
        // Check device memory if available
        const memory = navigator.deviceMemory || 4; // Default to 4GB if not available
        const cores = navigator.hardwareConcurrency || 4; // Default to 4 cores if not available
        
        // Force high performance mode for mobile if requested
        if (mobile && forceHighPerformanceRef.current) {
          console.log('Forcing high performance mode for mobile device');
          setDevicePerformance('high');
          return;
        }
        
        // Try to detect low-end devices using various signals
        const isLowEndDevice = () => {
          // Check if it's a very old mobile device
          const isOldMobile = mobile && userAgent.match(/Android 4|Android 5|iPhone OS [789]_/i);
          
          // Check if it's a low-memory device
          const isLowMemory = memory <= 2;
          
          // Check if it's a low-core device
          const isLowCore = cores <= 2;
          
          // Check if the device has a slow connection
          const isSlowConnection = navigator.connection && 
            (navigator.connection.saveData || 
             navigator.connection.effectiveType === 'slow-2g' || 
             navigator.connection.effectiveType === '2g');
          
          // Check if the browser is reporting a low-end experience
          const hasLowEndExperience = window.matchMedia && 
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          
          // Return true if multiple signals indicate a low-end device
          return (isOldMobile && (isLowMemory || isLowCore)) || 
                 (isLowMemory && isLowCore) || 
                 (isSlowConnection && (isLowMemory || isLowCore)) ||
                 hasLowEndExperience;
        };

        // Skip performance detection if forcing high performance
        if (forceHighPerformanceRef.current) {
          setDevicePerformance('high');
          return;
        }

        // Determine performance category
        if (isLowEndDevice()) {
          setDevicePerformance('very-low');
        } else if (mobile && (memory <= 2 || cores <= 4)) {
          setDevicePerformance('low');
        } else if ((mobile && (memory <= 4 || cores <= 6)) || 
                  (!mobile && (memory <= 4 || cores <= 4))) {
          setDevicePerformance('medium');
        } else {
          setDevicePerformance('high');
        }
        
        // Start FPS monitoring for dynamic adjustments
        startFpsMonitoring();
      }
    };
    
    // FPS monitoring for dynamic performance adjustment
    const startFpsMonitoring = () => {
      if (fpsMonitorRef.current) return;
      
      let lastTime = performance.now();
      let frames = 0;
      
      const checkFps = () => {
        const now = performance.now();
        frames++;
        
        // Update FPS every second
        if (now - lastFpsUpdateRef.current >= 1000) {
          const currentFps = Math.round((frames * 1000) / (now - lastFpsUpdateRef.current));
          actualFpsRef.current = currentFps;
          
          // Dynamic performance adjustment based on actual FPS
          if (!forceHighPerformanceRef.current && currentFps < 30 && devicePerformance !== 'very-low') {
            console.log(`FPS too low (${currentFps}), downgrading performance settings`);
            setDevicePerformance(prev => {
              if (prev === 'high') return 'medium';
              if (prev === 'medium') return 'low';
              if (prev === 'low') return 'very-low';
              return prev;
            });
          }
          
          lastFpsUpdateRef.current = now;
          frames = 0;
        }
        
        lastTime = now;
        fpsMonitorRef.current = requestAnimationFrame(checkFps);
      };
      
      fpsMonitorRef.current = requestAnimationFrame(checkFps);
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
      
      // Clean up FPS monitoring
      if (fpsMonitorRef.current) {
        cancelAnimationFrame(fpsMonitorRef.current);
        fpsMonitorRef.current = null;
      }
    };
  }, [devicePerformance, forceMobileHighPerformance]);

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

  // Intersection Observer to check if component is in viewport
  useEffect(() => {
    if (!vantaRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsInViewport(entry.isIntersecting);
        
        // Pause/resume animation based on visibility
        if (vantaEffect && vantaEffect.setOptions) {
          if (!entry.isIntersecting) {
            vantaEffect.setOptions({ fps: 0 }); // Pause when not in viewport
          } else if (isTabActive) {
            // Resume only if tab is active - always use 60fps on mobile with forceMobileHighPerformance
            const fps = forceHighPerformanceRef.current ? 60 :
                       devicePerformance === 'very-low' ? 20 : 
                       devicePerformance === 'low' ? 30 : 
                       devicePerformance === 'medium' ? 45 : 60;
            vantaEffect.setOptions({ fps });
          }
        }
      },
      { threshold: 0.1 } // Trigger when at least 10% is visible
    );
    
    observer.observe(vantaRef.current);
    
    return () => {
      observer.disconnect();
    };
  }, [vantaEffect, isTabActive, devicePerformance, forceMobileHighPerformance]);

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

    // Use requestIdleCallback to initialize when browser is idle
    const initializeVanta = () => {
      try {
        console.log('Initializing Vanta effect');
        
        // Store the class name in containerRef for optimization detection
        if (className) {
          containerRef.current = { classList: { contains: (cls) => className.includes(cls) } };
        }
        
        // Adjust parameters based on device performance
        let performanceSettings = {
          actualBirdSize: birdSize,
          actualQuantity: quantity,
          actualSpeedLimit: speedLimit,
          actualFps: 60,
          actualWingSpan: wingSpan,
          actualSeparation: separation,
          actualAlignment: alignment,
          actualCohesion: cohesion
        };
        
        // Apply performance-based settings - use optimized settings for mobile but maintain 60fps
        if (forceHighPerformanceRef.current && isMobile) {
          // Check if this is LandingPage by class name
          const isLandingPage = containerRef.current && 
            containerRef.current.classList.contains('hero-vanta-background');
          
          // Use more aggressive optimization for LandingPage
          if (isLandingPage) {
            console.log('Applying extreme optimization for LandingPage on mobile');
            performanceSettings = {
              actualBirdSize: birdSize * 1.5, // Much larger birds = much fewer birds
              actualQuantity: Math.max(1, quantity * 0.3), // Very few birds
              actualSpeedLimit: speedLimit * 0.7, // Slower movement
              actualFps: 50, // Slightly reduced fps for better performance
              actualWingSpan: wingSpan * 0.9,
              actualSeparation: separation * 1.5, // Much more separation
              actualAlignment: alignment * 0.7, // Reduce computation complexity
              actualCohesion: cohesion * 0.7 // Reduce computation complexity
            };
          } else {
            // Normal mobile optimization for other pages
            performanceSettings = {
              actualBirdSize: birdSize * 1.2, // Larger birds = fewer birds needed
              actualQuantity: Math.max(1, quantity * 0.5), // Significantly reduce bird count for mobile
              actualSpeedLimit: speedLimit * 0.8, // Slower speed for better performance
              actualFps: 60, // Always maintain 60fps
              actualWingSpan: wingSpan * 0.95, // Almost same wingspan
              actualSeparation: separation * 1.2, // More separation between birds
              actualAlignment: alignment * 0.9, // Slightly reduce alignment complexity
              actualCohesion: cohesion * 0.9 // Slightly reduce cohesion complexity
            };
          }
        } else if (devicePerformance === 'very-low') {
          // Reduced settings for very low-end devices, but ensure birds are visible
          performanceSettings = {
            actualBirdSize: birdSize * 1.3,
            actualQuantity: Math.max(1, quantity * 0.4), // Minimal birds for very low devices
            actualSpeedLimit: speedLimit * 0.7, // Even slower for very low devices
            actualFps: 30, // Reduced FPS for better performance
            actualWingSpan: wingSpan * 0.9,
            actualSeparation: separation * 1.3,
            actualAlignment: alignment * 0.8,
            actualCohesion: cohesion * 0.8
          };
        } else if (devicePerformance === 'low') {
          performanceSettings = {
            actualBirdSize: birdSize * 1.1, // More similar to desktop
            actualQuantity: Math.max(1, quantity * 0.7), // Less reduction
            actualSpeedLimit: speedLimit * 0.85, // Closer to normal speed
            actualFps: 45, // Higher FPS
            actualWingSpan: wingSpan * 0.95, // Almost same wingspan
            actualSeparation: separation * 1.1,
            actualAlignment: alignment * 0.9,
            actualCohesion: cohesion * 0.9
          };
        } else if (devicePerformance === 'medium') {
          performanceSettings = {
            actualBirdSize: birdSize * 1.05, // Very close to desktop
            actualQuantity: Math.max(1, quantity * 0.8), // Slight reduction
            actualSpeedLimit: speedLimit * 0.9,
            actualFps: 60, // Full FPS
            actualWingSpan: wingSpan * 0.98, // Almost identical
            actualSeparation: separation * 1.05,
            actualAlignment: alignment * 0.95,
            actualCohesion: cohesion * 0.95
          };
        } else {
          // High performance devices get full settings
          performanceSettings = {
            actualBirdSize: birdSize,
            actualQuantity: quantity,
            actualSpeedLimit: speedLimit,
            actualFps: 60,
            actualWingSpan: wingSpan,
            actualSeparation: separation,
            actualAlignment: alignment,
            actualCohesion: cohesion
          };
        }
        
        // Use requestAnimationFrame to optimize rendering
        let lastTime = 0;
        const targetFps = performanceSettings.actualFps;
        const frameInterval = 1000 / targetFps;
        
        // Initialize the effect with optimized settings
        const effect = window.VANTA.BIRDS({
          el: vantaRef.current,
          mouseControls: devicePerformance !== 'very-low' && mouseControls,
          touchControls: devicePerformance !== 'very-low' && touchControls,
          gyroControls: devicePerformance === 'high' && gyroControls,
          minHeight,
          minWidth,
          scale: isMobile ? scaleMobile : scale,
          scaleMobile,
          backgroundColor,
          color1,
          color2,
          colorMode,
          birdSize: performanceSettings.actualBirdSize,
          wingSpan: performanceSettings.actualWingSpan,
          speedLimit: performanceSettings.actualSpeedLimit,
          separation: performanceSettings.actualSeparation,
          alignment: performanceSettings.actualAlignment,
          cohesion: performanceSettings.actualCohesion,
          quantity: performanceSettings.actualQuantity,
          backgroundAlpha,
          fps: isInViewport && isTabActive ? performanceSettings.actualFps : 0, // Start paused if not visible
          frameRequestCallback: (time) => {
            // Throttle frame requests based on target FPS
            frameCounterRef.current++;
            if (time - lastTime >= frameInterval) {
              lastTime = time;
              return true;
            }
            return false;
          }
        });

        // Add renderer optimizations if available
        if (effect && effect.renderer) {
          // Optimize THREE.js renderer
          if (forceHighPerformanceRef.current && isMobile) {
            // For mobile high performance mode, use a similar pixel ratio to desktop
            effect.renderer.setPixelRatio(Math.min(1.5, devicePixelRatioRef.current));
            
            // Use similar canvas size to desktop for better consistency
            const canvasWidth = Math.min(1440, window.innerWidth);
            const canvasHeight = Math.min(900, window.innerHeight);
            effect.renderer.setSize(canvasWidth, canvasHeight);
            
            // Additional mobile performance optimizations
            if (effect.renderer.shadowMap) {
              effect.renderer.shadowMap.enabled = false;
            }
            
            // Keep mouse controls for better experience parity with desktop
            if (effect.setOptions) {
              effect.setOptions({
                mouseControls: true,
                touchControls: true
              });
            }
            
            // Use high performance context on mobile
            if (effect.renderer.getContext && typeof effect.renderer.getContext === 'function') {
              try {
                const gl = effect.renderer.getContext();
                if (gl && gl.getExtension) {
                  // Try to enable performance optimizations
                  gl.getExtension('WEBGL_lose_context');
                  gl.getExtension('OES_element_index_uint');
                }
              } catch (e) {
                console.warn('Failed to optimize WebGL context:', e);
              }
            }
          } else {
            // Normal optimization based on device performance
            effect.renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio || 1));
            
            if (devicePerformance === 'very-low' || devicePerformance === 'low') {
              effect.renderer.setSize(
                Math.min(1024, window.innerWidth), 
                Math.min(768, window.innerHeight)
              );
            }
            
            // Disable shadow maps for better performance
            effect.renderer.shadowMap.enabled = devicePerformance === 'high';
          }
          
          // Set power preference to high-performance for desktop, low-power for mobile
          if (effect.renderer.getContext && effect.renderer.getContext.powerPreference) {
            effect.renderer.getContext.powerPreference = 
              (isMobile && !forceHighPerformanceRef.current) ? 'low-power' : 'high-performance';
          }
          
          // Additional WebGL optimizations
          try {
            if (effect.renderer.info && effect.renderer.info.memory) {
              // Monitor memory usage
              console.log('THREE.js memory:', effect.renderer.info.memory);
            }
            
            // Use antialiasing only on high-end devices
            if (effect.renderer.getContext && typeof effect.renderer.getContext === 'function') {
              const gl = effect.renderer.getContext();
              if (gl && gl.getParameter) {
                const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
                console.log('WebGL max texture size:', maxTextureSize);
                
                // If texture size is limited, reduce quality further
                if (maxTextureSize < 4096 && !forceHighPerformanceRef.current) {
                  if (effect.setOptions) {
                    effect.setOptions({
                      quantity: Math.max(1, performanceSettings.actualQuantity * 0.8)
                    });
                  }
                }
              }
            }
          } catch (e) {
            console.warn('WebGL optimization error:', e);
          }
        }

        // Tambahkan konfigurasi khusus untuk menangani mobile yang lebih lemah
        if (isMobile && effect && effect.setOptions) {
          try {
            // Tambahkan konfigurasi untuk mobile yang membantu performa tanpa mengorbankan tampilan
            effect.setOptions({
              colorMode: "lerp", // Mode warna yang lebih ringan untuk dirender
              backgroundAlpha: 0, // Pastikan background transparan untuk performa lebih baik
              highlightColor: null, // Matikan highlight color untuk menghemat performa
              minHeight: Math.min(1024, minHeight), // Batasi ukuran render
              minWidth: Math.min(1024, minWidth)    // Batasi ukuran render
            });
          } catch (e) {
            console.warn('Failed to apply mobile optimizations:', e);
          }
        }

        // Add extra optimization specifically for LandingPage
        if (isMobile && effect && effect.setOptions && 
            containerRef.current && containerRef.current.classList.contains('hero-vanta-background')) {
          try {
            // Add LandingPage-specific extreme optimizations
            effect.setOptions({
              colorMode: "lerp", // Simpler color mode
              backgroundColor: backgroundColor, // Ensure background color is applied
              backgroundAlpha: 0, // Keep background transparent 
              showDots: false, // Don't show dots at bird positions for better performance
              scaleMobile: Math.min(0.75, scaleMobile), // Ensure mobile scale is not too high
              renderLines: false, // Disable lines between birds
            });
            
            // Further decrease quality on very low-end devices
            if (devicePerformance === 'very-low' || devicePerformance === 'low') {
              if (effect.renderer && effect.renderer.setPixelRatio) {
                effect.renderer.setPixelRatio(0.75); // Lower pixel ratio for better performance
              }
            }
          } catch (e) {
            console.warn('Failed to apply LandingPage-specific optimizations:', e);
          }
        }

        console.log('Vanta effect initialized successfully');
        setVantaEffect(effect);
      } catch (error) {
        console.error('Error initializing Vanta effect:', error);
      }
    };
    
    // Use requestIdleCallback if available, otherwise use setTimeout
    if (window.requestIdleCallback) {
      window.requestIdleCallback(initializeVanta, { timeout: 1000 });
    } else {
      setTimeout(initializeVanta, 100);
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
    backgroundAlpha,
    isInViewport,
    isTabActive,
    forceMobileHighPerformance
  ]);

  // Optimized mouse movement handler with debounce
  const handleMouseMove = useCallback((e) => {
    if (!vantaEffect || devicePerformance === 'very-low') return;
    
    // Store mouse position in ref to avoid re-renders
    mousePositionRef.current = {
      x: e.clientX / window.innerWidth,
      y: e.clientY / window.innerHeight
    };
    
    // Only update state occasionally to avoid re-renders
    if (frameCounterRef.current % 10 === 0) {
      setMousePosition(mousePositionRef.current);
    }
  }, [vantaEffect, devicePerformance]);

  // Handle window resize for better performance
  useEffect(() => {
    if (!vantaEffect) return;

    const handleResize = () => {
      if (vantaEffect && vantaEffect.resize) {
        vantaEffect.resize();
        
        // Adjust renderer size based on device performance
        if (vantaEffect.renderer) {
          if (forceHighPerformanceRef.current && isMobile) {
            // For mobile high performance mode, use a fixed size for better performance
            const canvasWidth = Math.min(1440, window.innerWidth);
            const canvasHeight = Math.min(900, window.innerHeight);
            vantaEffect.renderer.setSize(canvasWidth, canvasHeight);
          } else if (devicePerformance === 'very-low' || devicePerformance === 'low') {
            vantaEffect.renderer.setSize(
              Math.min(1024, window.innerWidth),
              Math.min(768, window.innerHeight)
            );
          }
        }
      }
    };

    // Throttle the resize handler for better performance
    let timeoutId;
    let lastExecution = 0;
    const throttleDelay = devicePerformance === 'very-low' ? 500 : 
                         devicePerformance === 'low' ? 300 : 200; // ms
    
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
  }, [vantaEffect, devicePerformance, isMobile, forceMobileHighPerformance]);

  // Add visibility change handler to pause animation when tab is not visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      const isVisible = !document.hidden;
      setIsTabActive(isVisible);
      
      if (vantaEffect && vantaEffect.setOptions) {
        if (!isVisible) {
          // Pause animation when tab is not visible
          vantaEffect.setOptions({ fps: 0 });
        } else if (isInViewport) {
          // Resume normal animation when tab is visible again and component is in viewport
          const fps = forceHighPerformanceRef.current ? 60 :
                     devicePerformance === 'very-low' ? 20 : 
                     devicePerformance === 'low' ? 30 : 
                     devicePerformance === 'medium' ? 45 : 60;
          vantaEffect.setOptions({ fps });
        }
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [vantaEffect, devicePerformance, isInViewport, forceMobileHighPerformance]);

  // Add mouse event listeners with performance considerations
  useEffect(() => {
    if (devicePerformance === 'very-low') return; // Skip for very low-end devices
    
    // Add event listener only if mouse controls are enabled
    if (mouseControls) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
    }
    
    return () => {
      if (mouseControls) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [mouseControls, handleMouseMove, devicePerformance]);

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
        pointerEvents: devicePerformance === 'very-low' ? 'none' : undefined, // Prevent unnecessary hover events on low-end devices
        // Reduce quality on very low-end devices
        filter: devicePerformance === 'very-low' ? 'blur(1px)' : undefined,
        opacity: devicePerformance === 'very-low' ? 0.9 : 1,
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
  backgroundAlpha: PropTypes.number,
  forceMobileHighPerformance: PropTypes.bool
};

export default VantaBackground; 