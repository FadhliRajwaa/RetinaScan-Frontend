// Preload THREE.js and make it available globally
import * as THREE from 'three';

// Export THREE to make it available for other modules
export default THREE;

// Make THREE available globally if needed for debugging
if (typeof window !== 'undefined') {
  window.THREE = THREE;
}

// Function to check if THREE is loaded properly
export const checkThreeAvailability = () => {
  if (!THREE) {
    console.error('THREE.js is not available');
    return false;
  }
  
  if (!THREE.WebGLRenderer) {
    console.error('THREE.WebGLRenderer is not available');
    return false;
  }
  
  return true;
}; 