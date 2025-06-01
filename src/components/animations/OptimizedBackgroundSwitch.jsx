import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import VantaBackground from './VantaBackground';
import MobileOptimizedVantaBackground from './MobileOptimizedVantaBackground';

// Komponen ini akan otomatis memilih level optimasi yang sesuai
// untuk VantaBackground berdasarkan kemampuan perangkat
const OptimizedBackgroundSwitch = (props) => {
  const [forceMobileOptimization, setForceMobileOptimization] = useState(false);
  const [hasTested, setHasTested] = useState(false);

  useEffect(() => {
    const detectLowPerformanceDevice = () => {
      // Cek apakah device adalah mobile
      const userAgent = navigator.userAgent || '';
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      
      // Jika bukan mobile, tidak perlu optimasi khusus
      if (!isMobile) {
        setForceMobileOptimization(false);
        setHasTested(true);
        return;
      }
      
      // Cek RAM dan CPU jika tersedia
      const lowMemory = navigator.deviceMemory && navigator.deviceMemory < 2; // Hanya RAM sangat rendah
      const lowCpu = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 3; // Hanya CPU sangat lemah
      
      // Deteksi browser dengan kemampuan WebGL terbatas
      const canvas = document.createElement('canvas');
      let gl;
      let renderer = '';
      let debugInfo = null;
      
      try {
        gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (gl) {
          debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
          if (debugInfo) {
            renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
          }
        }
      } catch (e) {
        console.log('WebGL detection error:', e);
      }
      
      // Deteksi GPU mobile yang sangat lemah (hanya GPU lama/rendah)
      const hasVeryWeakGPU = renderer && (
        /Adreno (3|2)\d\d/i.test(renderer) || 
        /Apple A[1-6]/i.test(renderer) ||
        /Mali-(4|3|2)/i.test(renderer) ||
        /PowerVR/i.test(renderer) ||
        /Google SwiftShader/i.test(renderer)
      );
      
      // Cek apakah browser dalam mode data saver
      const saveData = navigator.connection && navigator.connection.saveData;
      
      // Cek apakah user memilih reduce motion di sistem
      const prefersReducedMotion = window.matchMedia && 
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      // Cek ukuran layar (hanya layar sangat kecil)
      const hasVerySmallScreen = window.innerWidth < 480;
      
      // Jika beberapa faktor risiko terdeteksi, aktifkan optimasi untuk mobile
      if (
        (lowMemory && lowCpu) || // Perangkat sangat lemah
        hasVeryWeakGPU || // GPU sangat lemah
        saveData || // Mode hemat data
        hasVerySmallScreen || // Layar sangat kecil
        prefersReducedMotion // User memilih reduce motion
      ) {
        console.log('Using stronger optimizations for low-end mobile device');
        setForceMobileOptimization(true);
      } else {
        // Perangkat mobile dengan performa baik tetap perlu optimasi standar
        console.log('Using standard optimizations for mobile device');
        setForceMobileOptimization(true); // Selalu true untuk mobile untuk memastikan performa baik
      }
      
      setHasTested(true);
    };
    
    // Tambahkan sedikit delay untuk memberi waktu halaman dimuat
    const timerId = setTimeout(detectLowPerformanceDevice, 100);
    return () => clearTimeout(timerId);
  }, []);
  
  // Tampilkan placeholder saat deteksi belum selesai
  if (!hasTested) {
    return (
      <div 
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: props.backgroundColor || '#000000',
          opacity: props.backgroundAlpha || 0,
          zIndex: 0
        }}
      >
        {props.children}
      </div>
    );
  }
  
  // Selalu gunakan VantaBackground, dengan forceMobileHighPerformance berdasarkan deteksi
  return (
    <VantaBackground 
      {...props} 
      forceMobileHighPerformance={forceMobileOptimization}
    />
  );
};

OptimizedBackgroundSwitch.propTypes = {
  children: PropTypes.node,
  backgroundColor: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  backgroundAlpha: PropTypes.number,
  // Semua props lainnya akan dilewatkan ke komponen background
};

export default OptimizedBackgroundSwitch; 