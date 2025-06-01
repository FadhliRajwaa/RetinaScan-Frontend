import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import VantaBackground from './VantaBackground';

// Komponen StaticBackground yang sangat ringan untuk perangkat dengan performa sangat rendah
const StaticBackground = ({ backgroundColor, backgroundAlpha, color1, color2, children }) => {
  // Menggunakan CSS gradien statis daripada animasi 3D
  return (
    <div 
      style={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: typeof backgroundColor === 'number' 
          ? `#${backgroundColor.toString(16).padStart(6, '0')}`
          : backgroundColor || '#000000',
        opacity: backgroundAlpha !== undefined ? backgroundAlpha : 1,
        zIndex: 0,
        overflow: 'hidden'
      }}
    >
      {/* Menambahkan elemen dekoratif statis yang mirip dengan birds */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `radial-gradient(circle at 70% 30%, ${
            typeof color1 === 'number' ? `#${color1.toString(16).padStart(6, '0')}33` : 'rgba(0, 119, 255, 0.2)'
          }, transparent 50%), 
          radial-gradient(circle at 30% 70%, ${
            typeof color2 === 'number' ? `#${color2.toString(16).padStart(6, '0')}33` : 'rgba(65, 105, 225, 0.2)'
          }, transparent 50%)`,
          zIndex: 0
        }}
      />
      
      {/* Beberapa "burung" statis yang dibuat dengan CSS */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: `${10 + Math.random() * 80}%`,
            left: `${10 + Math.random() * 80}%`,
            width: '8px',
            height: '3px',
            borderRadius: '50%',
            background: typeof color1 === 'number' 
              ? `#${color1.toString(16).padStart(6, '0')}`
              : '#0077ff',
            opacity: 0.7,
            transform: `rotate(${Math.random() * 360}deg)`,
            zIndex: 1
          }}
        />
      ))}
      
      {children}
    </div>
  );
};

StaticBackground.propTypes = {
  backgroundColor: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  backgroundAlpha: PropTypes.number,
  color1: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  color2: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  children: PropTypes.node
};

// Komponen ini akan otomatis memilih level optimasi yang sesuai
// untuk VantaBackground berdasarkan kemampuan perangkat
const OptimizedBackgroundSwitch = (props) => {
  const [devicePerformance, setDevicePerformance] = useState('detecting'); // 'detecting', 'very-low', 'low', 'medium', 'high'
  const [hasTested, setHasTested] = useState(false);

  useEffect(() => {
    const detectDevicePerformance = () => {
      // Cek apakah device adalah mobile
      const userAgent = navigator.userAgent || '';
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      
      // Jika bukan mobile, gunakan setting high
      if (!isMobile) {
        setDevicePerformance('high');
        setHasTested(true);
        return;
      }
      
      // Deteksi performa lebih detail untuk mobile
      // Cek RAM dan CPU jika tersedia
      const memory = navigator.deviceMemory || 4; // Default 4GB jika tidak tersedia
      const cores = navigator.hardwareConcurrency || 4; // Default 4 cores jika tidak tersedia
      
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
      
      // Cek jaringan dan preferensi pengguna
      const saveData = navigator.connection && navigator.connection.saveData;
      const slowConnection = navigator.connection && 
        (navigator.connection.effectiveType === 'slow-2g' || 
         navigator.connection.effectiveType === '2g');
      const prefersReducedMotion = window.matchMedia && 
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      // Cek ukuran layar
      const hasVerySmallScreen = window.innerWidth < 480;
      
      // Deteksi perangkat dengan performa sangat rendah - gunakan StaticBackground
      if (
        (memory <= 1 && cores <= 2) || // Perangkat sangat lemah (RAM <= 1GB dan cores <= 2)
        hasVeryWeakGPU || // GPU sangat lemah
        (saveData && slowConnection) || // Mode hemat data dan koneksi lambat
        (prefersReducedMotion && hasVerySmallScreen) // Preferensi reduce motion dan layar kecil
      ) {
        console.log('Device terdeteksi sangat lemah - menggunakan StaticBackground');
        setDevicePerformance('very-low');
      }
      // Deteksi perangkat dengan performa rendah - gunakan optimasi agresif
      else if (
        (memory <= 2 && cores <= 4) || // Perangkat lemah
        saveData || // Mode hemat data
        slowConnection || // Koneksi lambat
        prefersReducedMotion // User memilih reduce motion
      ) {
        console.log('Device terdeteksi lemah - menggunakan optimasi agresif');
        setDevicePerformance('low');
      }
      // Perangkat mobile dengan performa cukup baik
      else if (memory <= 4 || cores <= 6) {
        console.log('Device terdeteksi sedang - menggunakan optimasi standar');
        setDevicePerformance('medium');
      }
      // Perangkat mobile high-end
      else {
        console.log('Device terdeteksi kuat - menggunakan optimasi minimal');
        setDevicePerformance('high');
      }
      
      setHasTested(true);
    };
    
    // Tambahkan sedikit delay untuk memberi waktu halaman dimuat
    const timerId = setTimeout(detectDevicePerformance, 100);
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
  
  // Untuk perangkat dengan performa sangat rendah, gunakan StaticBackground
  if (devicePerformance === 'very-low') {
    return (
      <StaticBackground {...props} />
    );
  }
  
  // Untuk perangkat lainnya, gunakan VantaBackground dengan optimasi sesuai
  return (
    <VantaBackground 
      {...props} 
      // Mempertahankan jumlah burung sesuai konfigurasi asli tapi mengoptimalkan ukuran
      quantity={
        // Untuk LandingPage (berdasarkan className)
        props.className && props.className.includes('hero-vanta-background')
        ? (devicePerformance === 'low' 
            ? Math.max(1.5, props.quantity || 3) // Mempertahankan jumlah burung
            : props.quantity || 3) // Gunakan jumlah burung yang dikonfigurasi
        // Untuk halaman lain
        : props.quantity || 3
      }
      // Menyesuaikan ukuran birds berdasarkan performa perangkat
      birdSize={
        props.className && props.className.includes('hero-vanta-background')
        ? (devicePerformance === 'low' 
            ? Math.max(1.0, (props.birdSize || 1.5) * 1.5) // Burung lebih besar di device lemah
            : devicePerformance === 'medium'
              ? Math.max(0.8, (props.birdSize || 1.5) * 1.2) // Burung ukuran sedang
              : props.birdSize || 1.5) // Gunakan ukuran asli
        : props.birdSize || 1.5
      }
      // Mengurangi kecepatan untuk performa lebih baik
      speedLimit={
        devicePerformance === 'low' 
          ? (props.speedLimit || 5.0) * 0.5 // Sangat lambat di device lemah
          : devicePerformance === 'medium'
            ? (props.speedLimit || 5.0) * 0.7 // Lambat di device sedang
            : props.speedLimit || 5.0
      }
      forceMobileHighPerformance={devicePerformance !== 'high'} // Aktifkan optimasi untuk semua kecuali high
    />
  );
};

OptimizedBackgroundSwitch.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  backgroundColor: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  backgroundAlpha: PropTypes.number,
  quantity: PropTypes.number,
  birdSize: PropTypes.number,
  speedLimit: PropTypes.number,
  // Semua props lainnya akan dilewatkan ke komponen background
};

export default OptimizedBackgroundSwitch; 