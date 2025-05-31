import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import VantaBackground from './VantaBackground';
import MobileOptimizedVantaBackground from './MobileOptimizedVantaBackground';

// Komponen ini akan otomatis memilih versi background yang optimal
// berdasarkan kemampuan perangkat
const OptimizedBackgroundSwitch = (props) => {
  const [useOptimized, setUseOptimized] = useState(false);
  const [hasTested, setHasTested] = useState(false);

  useEffect(() => {
    const detectLowPerformanceDevice = () => {
      // Cek apakah device adalah mobile
      const userAgent = navigator.userAgent || '';
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      
      // Jika bukan mobile, gunakan versi normal
      if (!isMobile) {
        setUseOptimized(false);
        setHasTested(true);
        return;
      }
      
      // Cek RAM dan CPU jika tersedia
      const lowMemory = navigator.deviceMemory && navigator.deviceMemory < 4;
      const lowCpu = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
      
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
      
      // Deteksi GPU mobile yang lemah - sekarang lebih agresif untuk semua GPU mobile
      const hasWeakGPU = renderer && (
        /Adreno/i.test(renderer) || 
        /Apple A/i.test(renderer) ||
        /Mali/i.test(renderer) ||
        /PowerVR/i.test(renderer) ||
        /Intel/i.test(renderer) ||
        /Google SwiftShader/i.test(renderer)
      );
      
      // Cek apakah browser dalam mode data saver
      const saveData = navigator.connection && navigator.connection.saveData;
      
      // Cek apakah user memilih reduce motion di sistem
      const prefersReducedMotion = window.matchMedia && 
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      // Cek ukuran layar (layar kecil biasanya menandakan perangkat dengan GPU lebih lemah)
      const hasSmallScreen = window.innerWidth < 768;
      
      // Jika beberapa faktor risiko terdeteksi, gunakan versi optimized
      // Kita lebih agresif dalam mendeteksi perangkat yang perlu dioptimalkan
      if (
        isMobile || // Semua perangkat mobile akan menggunakan optimized background
        lowMemory || 
        lowCpu || 
        hasWeakGPU || 
        saveData || 
        hasSmallScreen ||
        prefersReducedMotion
      ) {
        console.log('Switching to optimized background for better performance');
        setUseOptimized(true);
      } else {
        setUseOptimized(false);
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
  
  // Berdasarkan hasil deteksi, tampilkan komponen yang sesuai
  return useOptimized ? (
    <MobileOptimizedVantaBackground {...props} />
  ) : (
    <VantaBackground {...props} />
  );
};

OptimizedBackgroundSwitch.propTypes = {
  children: PropTypes.node,
  backgroundColor: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  backgroundAlpha: PropTypes.number,
  // Semua props lainnya akan dilewatkan ke komponen background
};

export default OptimizedBackgroundSwitch; 