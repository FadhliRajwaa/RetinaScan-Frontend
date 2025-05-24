import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Komponen untuk menampilkan efek partikel di latar belakang dengan performa yang dioptimalkan
 * 
 * @param {Object} props - Props komponen
 * @param {string} props.color - Warna partikel
 * @param {number} props.count - Jumlah partikel
 * @param {number} props.speed - Kecepatan animasi
 * @param {boolean} props.connected - Apakah partikel terhubung dengan garis
 * @param {string} props.type - Jenis animasi partikel ('default', 'wave', 'pulse', 'gravity')
 * @param {Object} props.style - Style tambahan untuk container
 * @returns {JSX.Element} Komponen ParticlesBackground
 */
const ParticlesBackground = ({
  color = 'rgba(79, 70, 229, 0.6)', // Default: Indigo dengan transparansi
  count = 80,
  speed = 1,
  connected = true,
  type = 'default',
  style = {},
}) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationFrameId = useRef(null);
  const mousePosition = useRef({ x: null, y: null });
  const [isVisible, setIsVisible] = useState(true);
  
  // Optimasi: Hanya render partikel jika komponen terlihat di viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    
    const canvas = canvasRef.current;
    if (canvas) {
      observer.observe(canvas);
    }
    
    return () => {
      if (canvas) {
        observer.unobserve(canvas);
      }
    };
  }, []);

  // Inisialisasi partikel dengan berbagai jenis
  const initParticles = (canvas, ctx) => {
    const particles = [];
    const { width, height } = canvas;
    
    // Batasi jumlah partikel berdasarkan ukuran layar untuk performa
    const adjustedCount = Math.min(count, Math.floor((width * height) / 10000));

    for (let i = 0; i < adjustedCount; i++) {
      const size = Math.random() * 3 + 1;
      const x = Math.random() * width;
      const y = Math.random() * height;
      
      // Variasi kecepatan dan arah berdasarkan jenis animasi
      let directionX, directionY;
      
      switch (type) {
        case 'wave':
          directionX = (Math.random() * 0.5 - 0.25) * speed;
          directionY = Math.sin(x / 100) * speed * 0.5;
          break;
        case 'pulse':
          directionX = (Math.random() * 2 - 1) * speed * 0.3;
          directionY = (Math.random() * 2 - 1) * speed * 0.3;
          break;
        case 'gravity':
          directionX = (Math.random() * 2 - 1) * speed * 0.5;
          directionY = Math.random() * speed * 0.2 + 0.1; // Selalu sedikit ke bawah
          break;
        default:
          directionX = (Math.random() * 2 - 1) * speed;
          directionY = (Math.random() * 2 - 1) * speed;
      }
      
      const opacity = Math.random() * 0.5 + 0.2;
      const initialSize = size;
      
      particles.push({
        x,
        y,
        size,
        initialSize,
        directionX,
        directionY,
        opacity,
        // Properti tambahan untuk animasi
        angle: Math.random() * 360,
        spin: Math.random() > 0.5 ? 1 : -1,
        pulseFactor: 0,
        pulseDirection: 1
      });
    }

    return particles;
  };

  // Menggambar partikel dengan optimasi untuk performa
  const drawParticles = (ctx, particles, width, height) => {
    ctx.clearRect(0, 0, width, height);

    // Batch rendering untuk performa lebih baik
    particles.forEach((particle) => {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = color.replace(')', `, ${particle.opacity})`);
      ctx.fill();
    });

    if (connected) {
      connectParticles(ctx, particles, width, height);
    }
  };

  // Menghubungkan partikel dengan garis - dengan optimasi
  const connectParticles = (ctx, particles, width, height) => {
    // Optimasi: Sesuaikan maxDistance berdasarkan ukuran layar
    const maxDistance = Math.min(width, height) * 0.07;
    
    // Batasi jumlah koneksi untuk performa
    const maxConnections = 3;
    
    // Optimasi: Gunakan quadtree atau grid untuk mengurangi jumlah perbandingan
    // Implementasi sederhana: Bagi partikel ke dalam grid
    const gridSize = maxDistance;
    const grid = {};
    
    // Tempatkan partikel ke dalam grid
    particles.forEach((particle, index) => {
      const gridX = Math.floor(particle.x / gridSize);
      const gridY = Math.floor(particle.y / gridSize);
      const key = `${gridX},${gridY}`;
      
      if (!grid[key]) {
        grid[key] = [];
      }
      grid[key].push(index);
    });
    
    // Untuk setiap partikel, periksa hanya partikel di grid terdekat
    particles.forEach((particle, i) => {
      const gridX = Math.floor(particle.x / gridSize);
      const gridY = Math.floor(particle.y / gridSize);
      let connections = 0;
      
      // Periksa grid sekitar
      for (let x = gridX - 1; x <= gridX + 1; x++) {
        for (let y = gridY - 1; y <= gridY + 1; y++) {
          const key = `${x},${y}`;
          if (!grid[key]) continue;
          
          // Periksa partikel dalam grid ini
          for (let j = 0; j < grid[key].length && connections < maxConnections; j++) {
            const index = grid[key][j];
            if (index <= i) continue; // Hindari koneksi duplikat
            
            const otherParticle = particles[index];
            const dx = otherParticle.x - particle.x;
            const dy = otherParticle.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < maxDistance) {
              connections++;
              const opacity = 1 - distance / maxDistance;
              ctx.beginPath();
              ctx.strokeStyle = color.replace(')', `, ${opacity * 0.3})`);
              ctx.lineWidth = 0.5;
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              ctx.stroke();
            }
          }
        }
      }
    });

    // Koneksi dengan mouse jika mouse di dalam canvas
    if (mousePosition.current.x !== null && mousePosition.current.y !== null) {
      const mouseMaxConnections = 5;
      let mouseConnections = 0;
      
      for (let i = 0; i < particles.length && mouseConnections < mouseMaxConnections; i++) {
        const particle = particles[i];
        const dx = mousePosition.current.x - particle.x;
        const dy = mousePosition.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance * 1.5) {
          mouseConnections++;
          const opacity = 1 - distance / (maxDistance * 1.5);
          ctx.beginPath();
          ctx.strokeStyle = color.replace(')', `, ${opacity * 0.5})`);
          ctx.lineWidth = 0.8;
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(mousePosition.current.x, mousePosition.current.y);
          ctx.stroke();
        }
      }
    }
  };

  // Mengupdate posisi partikel dengan animasi berbeda berdasarkan jenis
  const updateParticles = (particles, width, height, timestamp) => {
    return particles.map((particle) => {
      // Update posisi berdasarkan jenis animasi
      switch (type) {
        case 'wave':
          // Gerakan gelombang
          particle.x += particle.directionX;
          particle.y += Math.sin(timestamp / 1000 + particle.x / 100) * speed * 0.5;
          break;
          
        case 'pulse':
          // Efek detak/pulse
          particle.pulseFactor += 0.01 * particle.pulseDirection;
          if (particle.pulseFactor > 1) {
            particle.pulseDirection = -1;
          } else if (particle.pulseFactor < 0) {
            particle.pulseDirection = 1;
          }
          particle.size = particle.initialSize * (1 + particle.pulseFactor * 0.3);
          particle.x += particle.directionX;
          particle.y += particle.directionY;
          break;
          
        case 'gravity':
          // Efek gravitasi - partikel jatuh dan naik kembali
          particle.directionY += 0.01; // Gravitasi
          particle.x += particle.directionX;
          particle.y += particle.directionY;
          
          // Jika menyentuh dasar, pantulkan ke atas
          if (particle.y > height) {
            particle.y = height;
            particle.directionY = -particle.directionY * 0.5;
          }
          break;
          
        default:
          // Gerakan default
          particle.x += particle.directionX;
          particle.y += particle.directionY;
      }

      // Rotasi partikel (untuk efek visual)
      particle.angle += particle.spin * 0.2;

      // Deteksi tabrakan dengan tepi
      if (particle.x > width || particle.x < 0) {
        particle.directionX = -particle.directionX;
      }
      if (particle.y > height || particle.y < 0) {
        particle.directionY = -particle.directionY;
      }

      // Pastikan partikel tetap dalam canvas
      particle.x = Math.max(0, Math.min(width, particle.x));
      particle.y = Math.max(0, Math.min(height, particle.y));

      return particle;
    });
  };

  // Animasi partikel dengan throttling untuk performa
  const animate = (timestamp) => {
    const canvas = canvasRef.current;
    if (!canvas || !isVisible) {
      // Jangan render jika tidak terlihat
      animationFrameId.current = requestAnimationFrame(animate);
      return;
    }

    const ctx = canvas.getContext('2d');
    const particles = particlesRef.current;

    drawParticles(ctx, particles, canvas.width, canvas.height);
    particlesRef.current = updateParticles(particles, canvas.width, canvas.height, timestamp);
    animationFrameId.current = requestAnimationFrame(animate);
  };

  // Resize handler dengan throttling
  const handleResize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Optimasi: Gunakan devicePixelRatio untuk tampilan yang lebih tajam pada layar retina
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    // Skala konteks sesuai dengan devicePixelRatio
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    // Reinitialize particles
    particlesRef.current = initParticles(canvas, ctx);
  };

  // Mouse move handler dengan throttling
  const handleMouseMove = (e) => {
    mousePosition.current = {
      x: e.clientX,
      y: e.clientY,
    };
  };

  // Mouse leave handler
  const handleMouseLeave = () => {
    mousePosition.current = {
      x: null,
      y: null,
    };
  };

  // Throttle function untuk mengoptimalkan event handler
  const throttle = (callback, delay) => {
    let lastCall = 0;
    return function(...args) {
      const now = new Date().getTime();
      if (now - lastCall < delay) {
        return;
      }
      lastCall = now;
      return callback(...args);
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    
    // Skala konteks sesuai dengan devicePixelRatio
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    
    // Inisialisasi partikel
    particlesRef.current = initParticles(canvas, ctx);

    // Throttle event handlers untuk performa
    const throttledResize = throttle(handleResize, 200);
    const throttledMouseMove = throttle(handleMouseMove, 50);

    // Start animation
    animate();

    // Add event listeners
    window.addEventListener('resize', throttledResize);
    canvas.addEventListener('mousemove', throttledMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // Cleanup
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      window.removeEventListener('resize', throttledResize);
      canvas.removeEventListener('mousemove', throttledMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [color, count, speed, connected, type, isVisible]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        ...style,
      }}
    />
  );
};

ParticlesBackground.propTypes = {
  color: PropTypes.string,
  count: PropTypes.number,
  speed: PropTypes.number,
  connected: PropTypes.bool,
  type: PropTypes.oneOf(['default', 'wave', 'pulse', 'gravity']),
  style: PropTypes.object,
};

export default ParticlesBackground; 