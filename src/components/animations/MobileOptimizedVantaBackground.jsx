import { useEffect, useRef, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { isMobile } from 'react-device-detect';

// Komponen optimasi ekstrem untuk mobile yang menggunakan pendekatan berbeda
// untuk mencapai performa 60fps tanpa patah-patah
const MobileOptimizedVantaBackground = ({ 
  children, 
  className = '',
  backgroundColor = 0x0,
  color1 = 0x5288e,
  color2 = 0x1399ff,
  backgroundAlpha = 0.0,
  quantity = 8, // Parameter untuk jumlah partikel, default rendah
  birdSize = 1.0 // Parameter untuk ukuran partikel
}) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const frameCountRef = useRef(0);
  const fpsIntervalRef = useRef(null);
  const requestRef = useRef(null);
  const previousTimeRef = useRef(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isTabActive, setIsTabActive] = useState(true);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  });

  // Fungsi untuk mengatur FPS target
  const fpsTarget = isMobile ? 30 : 60;
  const interval = 1000 / fpsTarget;

  // Konversi warna hex ke RGB (memoized)
  const hexToRgb = useCallback((hex) => {
    const bigint = parseInt(String(hex).replace(/^0x/, ''), 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255
    };
  }, []);

  // Create particles dengan memoization
  const createParticles = useCallback(() => {
    if (!canvasRef.current) return [];
    
    const canvas = canvasRef.current;
    const bgColor = hexToRgb(backgroundColor);
    const primColor = hexToRgb(color1);
    const secColor = hexToRgb(color2);
    
    // Hitung jumlah partikel berdasarkan ukuran layar dan parameter quantity
    const baseCount = Math.min(12, Math.floor(windowSize.width * windowSize.height / 100000));
    const particleCount = Math.max(5, Math.min(baseCount, quantity * 4));
    
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + (birdSize * 0.8), // Ukuran disesuaikan dengan parameter birdSize
        speedX: (Math.random() * 0.8 - 0.4) * (isMobile ? 0.5 : 1), // Lebih lambat di mobile
        speedY: (Math.random() * 0.8 - 0.4) * (isMobile ? 0.5 : 1),
        color: Math.random() > 0.5 ? primColor : secColor,
        // Tambahkan variasi untuk animasi yang lebih dinamis
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: 0.02 + Math.random() * 0.02
      });
    }
    
    return particles;
  }, [windowSize, quantity, birdSize, backgroundColor, color1, color2, hexToRgb]);

  // Deteksi visibilitas tab
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabActive(!document.hidden);
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Intersection Observer untuk deteksi visibilitas
  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        setIsVisible(entries[0].isIntersecting);
      },
      { threshold: 0.1 }
    );
    
    observer.observe(containerRef.current);
    
    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
      observer.disconnect();
    };
  }, []);

  // Handle window resize dengan throttling
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current) return;
      
      // Gunakan throttling untuk mencegah terlalu banyak resize events
      if (!window.resizeThrottleTimeout) {
        window.resizeThrottleTimeout = setTimeout(() => {
          window.resizeThrottleTimeout = null;
          setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight
          });
        }, 200);
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

  // Inisialisasi canvas dan animasi ringan dengan FPS capped
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;
    
    // Setup canvas dengan pixel ratio yang tepat
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: true, antialias: false });
    
    // Set ukuran canvas dengan pixel ratio yang lebih rendah untuk mobile
    const pixelRatio = isMobile ? Math.min(1.0, window.devicePixelRatio || 1) : (window.devicePixelRatio || 1);
    canvas.width = windowSize.width * pixelRatio;
    canvas.height = windowSize.height * pixelRatio;
    
    // Skala canvas sesuai pixel ratio
    ctx.scale(pixelRatio, pixelRatio);
    
    // Buat gradient background dengan alpha
    const bgColor = hexToRgb(backgroundColor);
    
    // Buat particles
    const particles = createParticles();
    
    // Fungsi untuk menggambar background
    const drawBackground = () => {
      if (backgroundAlpha > 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, `rgba(${bgColor.r}, ${bgColor.g}, ${bgColor.b}, ${backgroundAlpha})`);
        gradient.addColorStop(1, `rgba(${bgColor.r}, ${bgColor.g}, ${bgColor.b}, ${backgroundAlpha * 0.7})`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, windowSize.width, windowSize.height);
      } else {
        ctx.clearRect(0, 0, windowSize.width, windowSize.height);
      }
    };
    
    // Animasi dengan requestAnimationFrame dan FPS target
    const animate = (timestamp) => {
      requestRef.current = requestAnimationFrame(animate);
      
      // Jika tab tidak aktif atau komponen tidak terlihat, tidak perlu render
      if (!isTabActive || !isVisible) {
        return;
      }
      
      // Cek apakah waktunya untuk render frame baru
      const elapsed = timestamp - previousTimeRef.current;
      
      if (elapsed < interval) {
        return;
      }
      
      // Hitung actual FPS untuk debugging
      frameCountRef.current++;
      if (timestamp - fpsIntervalRef.current >= 1000) {
        fpsIntervalRef.current = timestamp;
        frameCountRef.current = 0;
      }
      
      // Update previousTime dengan adjustment untuk menjaga konsistensi
      previousTimeRef.current = timestamp - (elapsed % interval);
      
      // Clear canvas dan gambar background
      drawBackground();
      
      // Render particles dengan optimasi
      ctx.save();
      
      // Batasi jumlah garis yang dihubungkan
      const maxConnections = isMobile ? 2 : 3;
      const visibleConnections = new Map();
      
      // Update dan render particles
      particles.forEach((particle, idx) => {
        // Update posisi dengan gerakan yang lebih dinamis
        particle.x += particle.speedX;
        particle.y += particle.speedY + Math.sin(particle.phase) * 0.3;
        particle.phase += particle.phaseSpeed;
        
        // Boundary checking dengan wrapping
        if (particle.x < -particle.size) particle.x = windowSize.width + particle.size;
        if (particle.x > windowSize.width + particle.size) particle.x = -particle.size;
        if (particle.y < -particle.size) particle.y = windowSize.height + particle.size;
        if (particle.y > windowSize.height + particle.size) particle.y = -particle.size;
        
        // Render particle sebagai elips untuk efek "burung"
        ctx.beginPath();
        
        // Gambar "burung" dengan bentuk sederhana
        ctx.save();
        ctx.translate(particle.x, particle.y);
        const wingFlap = Math.sin(particle.phase) * 0.2 + 0.8;
        
        // Gambar sayap
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-particle.size * 1.5 * wingFlap, -particle.size * 0.5);
        ctx.lineTo(0, -particle.size * 0.2);
        ctx.lineTo(particle.size * 1.5 * wingFlap, -particle.size * 0.5);
        ctx.closePath();
        
        // Fill dengan gradient
        const particleGradient = ctx.createLinearGradient(
          -particle.size, -particle.size, 
          particle.size, particle.size
        );
        particleGradient.addColorStop(0, `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, 0.7)`);
        particleGradient.addColorStop(1, `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, 0.4)`);
        
        ctx.fillStyle = particleGradient;
        ctx.fill();
        ctx.restore();
        
        // Render garis penghubung jika cukup dekat (dengan batas jumlah koneksi)
        let connections = 0;
        
        if (!isMobile || frameCountRef.current % 2 === 0) { // Kurangi perhitungan pada mobile
          for (let j = idx + 1; j < particles.length && connections < maxConnections; j++) {
            const otherParticle = particles[j];
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const maxDistance = isMobile ? 80 : 120;
            
            if (distance < maxDistance) {
              // Gunakan id unik untuk setiap pasangan partikel
              const connectionId = idx < j ? `${idx}-${j}` : `${j}-${idx}`;
              
              if (!visibleConnections.has(connectionId)) {
                visibleConnections.set(connectionId, true);
                connections++;
                
                ctx.beginPath();
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(otherParticle.x, otherParticle.y);
                
                const alpha = 0.15 * (1 - distance / maxDistance);
                ctx.strokeStyle = `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${alpha})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
              }
            }
          }
        }
      });
      
      ctx.restore();
    };
    
    // Inisialisasi timestamp references
    previousTimeRef.current = window.performance.now();
    fpsIntervalRef.current = previousTimeRef.current;
    
    // Mulai animasi
    requestRef.current = requestAnimationFrame(animate);
    
    // Cleanup
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [windowSize, backgroundColor, color1, color2, backgroundAlpha, createParticles, hexToRgb, interval, isTabActive, isVisible]);

  return (
    <div 
      ref={containerRef} 
      className={`mobile-optimized-vanta-background ${className}`} 
      style={{ 
        position: 'absolute', 
        width: '100%', 
        height: '100%', 
        top: 0, 
        left: 0, 
        zIndex: 0,
        overflow: 'hidden',
        pointerEvents: 'none' // Prevent touch events for better performance
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          display: isVisible ? 'block' : 'none' // Hide when not visible
        }}
      />
      <div style={{ position: 'relative', zIndex: 1, pointerEvents: 'auto' }}>
        {children}
      </div>
    </div>
  );
};

MobileOptimizedVantaBackground.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  backgroundColor: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  color1: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  color2: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  backgroundAlpha: PropTypes.number,
  quantity: PropTypes.number,
  birdSize: PropTypes.number
};

export default MobileOptimizedVantaBackground; 