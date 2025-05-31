import THREE, { checkThreeAvailability } from './preloadThree';

// Function to initialize VantaJS effects
export const initVantaBirds = async (element, options) => {
  if (!element) return null;

  // Ensure THREE.js is available
  if (!checkThreeAvailability()) {
    console.error('THREE.js not properly loaded');
    return null;
  }

  try {
    // Import VantaJS Birds effect
    const VANTA = await import('vanta/dist/vanta.birds.min');
    
    if (!VANTA || !VANTA.default) {
      console.error('Failed to load VantaJS Birds effect');
      return null;
    }
    
    // Merge default options with provided options
    const defaultOptions = {
      el: element,
      THREE: THREE, // Pass THREE directly
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.00,
      scaleMobile: 0.75,
      backgroundColor: 0x0f172a,
      color1: 0x60a5fa,
      color2: 0x3b82f6,
      colorMode: "variance",
      birdSize: 1.2,
      wingSpan: 30.0,
      speedLimit: 5.0,
      separation: 50.0,
      alignment: 50.0,
      cohesion: 50.0,
      quantity: 3.0,
      backgroundAlpha: 0.0
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    
    // Initialize VANTA effect
    return VANTA.default.BIRDS(mergedOptions);
  } catch (error) {
    console.error('Error initializing VantaJS Birds effect:', error);
    return null;
  }
};

export default initVantaBirds; 