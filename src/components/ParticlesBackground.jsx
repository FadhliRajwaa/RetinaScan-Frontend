import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Komponen untuk menampilkan efek partikel di latar belakang dengan performa yang sangat dioptimalkan,
 * animasi yang smooth, dan efek visual yang ringan untuk menghindari lag
 * 
 * @param {Object} props - Props komponen
 * @param {string} props.color - Warna partikel
 * @param {number} props.count - Jumlah partikel
 * @param {number} props.speed - Kecepatan animasi
 * @param {boolean} props.connected - Apakah partikel terhubung dengan garis
 * @param {string} props.type - Jenis animasi partikel ('default', 'wave', 'pulse', 'gravity', 'vortex', 'magnetic')
 * @param {boolean} props.interactive - Apakah partikel bereaksi terhadap gerakan mouse
 * @param {Object} props.style - Style tambahan untuk container
 * @returns {JSX.Element} Komponen ParticlesBackground
 */
const ParticlesBackground = ({
  color = 'rgba(79, 70, 229, 0.4)', // Default: Indigo dengan transparansi
  count = 50, // Meningkatkan jumlah default dari 30 ke 50 untuk efek visual lebih baik
  speed = 0.8, // Meningkatkan kecepatan default dari 0.3 ke 0.8 untuk animasi lebih terlihat
  connected = true,
  type = 'default',
  interactive = true, // Default ke true untuk interaksi yang lebih menarik
  style = {},
}) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationFrameId = useRef(null);
  const mousePosition = useRef({ x: null, y: null });
  const [isVisible, setIsVisible] = useState(true);
  const mouseRadius = useRef(120); // Meningkatkan radius pengaruh mouse dari 100 ke 120
  const mouseForce = useRef(3 * speed); // Meningkatkan kekuatan pengaruh mouse dari 2 ke 3
  const lastMouseMoveTime = useRef(0);
  const mouseActive = useRef(false);
  
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

  // Inisialisasi partikel dengan berbagai jenis - lebih dioptimalkan
  const initParticles = (canvas, ctx) => {
    const particles = [];
    const { width, height } = canvas;
    
    // Batasi jumlah partikel berdasarkan ukuran layar dan performa
    // Kurangi pembatasan jumlah partikel untuk efek visual lebih baik
    const adjustedCount = Math.min(count, Math.floor((width * height) / 15000));

    // Ekstrak komponen warna untuk variasi
    let baseColor = color;
    let r, g, b;
    
    if (color.includes('rgb')) {
      const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
      if (rgbMatch) {
        r = parseInt(rgbMatch[1]);
        g = parseInt(rgbMatch[2]);
        b = parseInt(rgbMatch[3]);
      }
    }

    for (let i = 0; i < adjustedCount; i++) {
      const size = Math.random() * 3 + 1.5; // Meningkatkan ukuran partikel untuk visibilitas lebih baik
      const x = Math.random() * width;
      const y = Math.random() * height;
      
      // Variasi kecepatan dan arah berdasarkan jenis animasi - lebih terlihat
      let directionX, directionY;
      
      switch (type) {
        case 'wave':
          directionX = (Math.random() * 0.4 - 0.2) * speed; // Meningkatkan kecepatan
          directionY = Math.sin(x / 100) * speed * 0.4; // Meningkatkan amplitudo
          break;
        case 'pulse':
          directionX = (Math.random() * 1 - 0.5) * speed * 0.3; // Meningkatkan kecepatan
          directionY = (Math.random() * 1 - 0.5) * speed * 0.3;
          break;
        case 'gravity':
          directionX = (Math.random() * 1 - 0.5) * speed * 0.4; // Meningkatkan kecepatan
          directionY = Math.random() * speed * 0.1 + 0.05; // Meningkatkan efek gravitasi
          break;
        case 'vortex':
          directionX = (Math.random() * 1 - 0.5) * speed * 0.3; // Meningkatkan kecepatan
          directionY = (Math.random() * 1 - 0.5) * speed * 0.3;
          break;
        case 'magnetic':
          directionX = (Math.random() * 1 - 0.5) * speed * 0.2; // Meningkatkan kecepatan
          directionY = (Math.random() * 1 - 0.5) * speed * 0.2;
          break;
        default:
          directionX = (Math.random() * 1 - 0.5) * speed * 0.6; // Meningkatkan kecepatan
          directionY = (Math.random() * 1 - 0.5) * speed * 0.6;
      }
      
      const opacity = Math.random() * 0.7 + 0.3; // Meningkatkan opasitas untuk visibilitas lebih baik
      const initialSize = size;
      
      // Variasi warna yang lebih terlihat
      let particleColor = baseColor;
      if (r !== undefined && g !== undefined && b !== undefined) {
        // Variasi warna untuk efek visual lebih menarik
        const hueShift = Math.random() * 20 - 10; // Meningkatkan variasi warna
        const rNew = Math.min(255, Math.max(0, r + hueShift));
        const gNew = Math.min(255, Math.max(0, g + hueShift));
        const bNew = Math.min(255, Math.max(0, b + hueShift));
        particleColor = `rgba(${rNew}, ${gNew}, ${bNew}, ${opacity})`;
      }
      
      particles.push({
        x,
        y,
        size,
        initialSize,
        directionX,
        directionY,
        opacity,
        color: particleColor, // Warna individual untuk setiap partikel
        // Properti tambahan untuk animasi - lebih dinamis
        pulseFactor: 0,
        pulseDirection: 1,
        originalX: x, // Untuk efek magnetic
        originalY: y, // Untuk efek magnetic
        vortexAngle: Math.random() * Math.PI * 2, // Untuk efek vortex
        vortexRadius: Math.random() * 40 + 30, // Meningkatkan radius vortex
        // Properti untuk interaktivitas mouse
        targetX: x,
        targetY: y,
        force: 0,
        forceDirectionX: 0,
        forceDirectionY: 0,
        velocity: Math.random() * 1.5 + 0.5, // Meningkatkan velocity
        dampening: 0.95, // Sesuaikan faktor perlambatan
        // Properti untuk efek glow - lebih terlihat
        glowIntensity: Math.random() * 0.4 + 0.2, // Meningkatkan intensitas glow
      });
    }

    return particles;
  };

  // Menggambar partikel dengan optimasi untuk performa dan visibilitas
  const drawParticles = (ctx, particles, width, height) => {
    ctx.clearRect(0, 0, width, height);

    // Batch rendering untuk performa lebih baik
    particles.forEach((particle) => {
      // Efek glow untuk partikel yang berinteraksi dengan mouse
      if (interactive && particle.force > 0.2 && mouseActive.current) {
        ctx.beginPath();
        
        // Ukuran glow lebih terlihat
        const glowSize = particle.size * 2.5;
        const glowIntensity = particle.glowIntensity;
        
        const glow = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, glowSize
        );
        
        // Gunakan warna individu partikel untuk glow
        const particleColor = particle.color || color;
        glow.addColorStop(0, particleColor.replace(')', `, ${particle.opacity * glowIntensity})`));
        glow.addColorStop(1, particleColor.replace(')', ', 0)'));
        
        ctx.fillStyle = glow;
        ctx.arc(particle.x, particle.y, glowSize, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Gambar partikel utama - lebih terlihat
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      
      // Gunakan warna individu partikel
      const particleColor = particle.color || color;
      ctx.fillStyle = particleColor.replace(')', `, ${particle.opacity})`);
      ctx.fill();
    });

    if (connected) {
      connectParticles(ctx, particles, width, height);
    }
  };

  // Menghubungkan partikel dengan garis - lebih terlihat
  const connectParticles = (ctx, particles, width, height) => {
    // Optimasi: Sesuaikan maxDistance berdasarkan ukuran layar
    const maxDistance = Math.min(width, height) * 0.07; // Meningkatkan jarak koneksi
    
    // Batasi jumlah koneksi untuk performa
    const maxConnections = 2; // Meningkatkan jumlah koneksi maksimum untuk efek visual lebih baik
    
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
        if (connections >= maxConnections) break; // Keluar lebih awal jika sudah mencapai batas koneksi
        
        for (let y = gridY - 1; y <= gridY + 1; y++) {
          if (connections >= maxConnections) break; // Keluar lebih awal jika sudah mencapai batas koneksi
          
          const key = `${x},${y}`;
          if (!grid[key]) continue;
          
          // Periksa partikel dalam grid ini
          for (let j = 0; j < grid[key].length && connections < maxConnections; j++) {
            const index = grid[key][j];
            if (i === index) continue; // Skip diri sendiri
            
            const targetParticle = particles[index];
            const dx = particle.x - targetParticle.x;
            const dy = particle.y - targetParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < maxDistance) {
              // Hitung opacity berdasarkan jarak
              const opacity = 1 - (distance / maxDistance);
              
              // Gambar garis koneksi - lebih terlihat
              ctx.beginPath();
              ctx.strokeStyle = `rgba(${r || 79}, ${g || 70}, ${b || 229}, ${opacity * 0.2})`; // Meningkatkan opasitas garis
              ctx.lineWidth = Math.min(particle.size, targetParticle.size) * 0.3; // Meningkatkan ketebalan garis
              
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(targetParticle.x, targetParticle.y);
              ctx.stroke();
              
              connections++;
            }
          }
        }
      }
    });
  };

  // Update posisi dan properti partikel - lebih dinamis
  const updateParticles = (particles, width, height, timestamp) => {
    // Throttle mouse interaction calculations
    const now = timestamp;
    const mouseInteractionActive = interactive && mouseActive.current && (now - lastMouseMoveTime.current < 150);
    
    return particles.map(particle => {
      // Buat salinan partikel untuk diupdate
      const updatedParticle = { ...particle };
      
      // Interaksi mouse jika aktif
      if (mouseInteractionActive && 
          mousePosition.current.x !== null && 
          mousePosition.current.y !== null) {
        
        const dx = mousePosition.current.x - updatedParticle.x;
        const dy = mousePosition.current.y - updatedParticle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouseRadius.current) {
          // Hitung kekuatan berdasarkan jarak dari mouse
          const force = (mouseRadius.current - distance) / mouseRadius.current;
          
          // Arah menjauh dari mouse
          updatedParticle.forceDirectionX = -dx / distance;
          updatedParticle.forceDirectionY = -dy / distance;
          
          // Terapkan kekuatan
          updatedParticle.force = force * mouseForce.current;
          
          // Update targetX dan targetY untuk efek "menghindar"
          updatedParticle.targetX = updatedParticle.x + updatedParticle.forceDirectionX * updatedParticle.force;
          updatedParticle.targetY = updatedParticle.y + updatedParticle.forceDirectionY * updatedParticle.force;
        } else {
          // Kurangi force secara bertahap jika tidak dalam radius mouse
          updatedParticle.force *= 0.92;
        }
      } else {
        // Kurangi force secara bertahap jika mouse tidak aktif
        updatedParticle.force *= 0.92;
      }
      
      // Update posisi berdasarkan jenis animasi - lebih dinamis
      switch (type) {
        case 'wave':
          // Efek gelombang yang lebih dinamis
          updatedParticle.y += Math.sin((updatedParticle.x / 100) + (timestamp / 1000)) * speed * 0.3;
          updatedParticle.x += updatedParticle.directionX;
          break;
          
        case 'pulse':
          // Efek pulse yang lebih dinamis
          updatedParticle.pulseFactor += 0.01 * updatedParticle.pulseDirection * speed;
          
          if (updatedParticle.pulseFactor > 0.5) {
            updatedParticle.pulseDirection = -1;
          } else if (updatedParticle.pulseFactor < -0.5) {
            updatedParticle.pulseDirection = 1;
          }
          
          updatedParticle.size = updatedParticle.initialSize * (1 + updatedParticle.pulseFactor * 0.4);
          updatedParticle.x += updatedParticle.directionX;
          updatedParticle.y += updatedParticle.directionY;
          break;
          
        case 'gravity':
          // Efek gravitasi yang lebih dinamis
          updatedParticle.directionY += 0.01 * speed;
          updatedParticle.x += updatedParticle.directionX;
          updatedParticle.y += updatedParticle.directionY;
          break;
          
        case 'vortex':
          // Efek vortex yang lebih dinamis
          updatedParticle.vortexAngle += 0.01 * speed;
          const vx = Math.cos(updatedParticle.vortexAngle) * updatedParticle.vortexRadius;
          const vy = Math.sin(updatedParticle.vortexAngle) * updatedParticle.vortexRadius;
          
          // Bergerak menuju posisi vortex
          updatedParticle.x += (updatedParticle.originalX + vx - updatedParticle.x) * 0.01 * speed;
          updatedParticle.y += (updatedParticle.originalY + vy - updatedParticle.y) * 0.01 * speed;
          break;
          
        case 'magnetic':
          // Efek magnetic yang lebih dinamis
          const dx = updatedParticle.originalX - updatedParticle.x;
          const dy = updatedParticle.originalY - updatedParticle.y;
          
          updatedParticle.x += dx * 0.01 * speed;
          updatedParticle.y += dy * 0.01 * speed;
          
          updatedParticle.x += updatedParticle.directionX;
          updatedParticle.y += updatedParticle.directionY;
          break;
          
        default:
          // Default movement - lebih dinamis
          updatedParticle.x += updatedParticle.directionX;
          updatedParticle.y += updatedParticle.directionY;
      }
      
      // Jika ada force dari interaksi mouse, bergerak menuju target
      if (updatedParticle.force > 0.01) {
        updatedParticle.x += (updatedParticle.targetX - updatedParticle.x) * updatedParticle.force * 0.05;
        updatedParticle.y += (updatedParticle.targetY - updatedParticle.y) * updatedParticle.force * 0.05;
      }
      
      // Pantulkan partikel jika mencapai batas canvas
      if (updatedParticle.x < 0 || updatedParticle.x > width) {
        updatedParticle.directionX *= -1;
        updatedParticle.x = updatedParticle.x < 0 ? 0 : width;
      }
      
      if (updatedParticle.y < 0 || updatedParticle.y > height) {
        updatedParticle.directionY *= -1;
        updatedParticle.y = updatedParticle.y < 0 ? 0 : height;
      }
      
      return updatedParticle;
    });
  };

  // Animasi utama dengan optimasi
  const animate = (timestamp) => {
    if (!isVisible) {
      animationFrameId.current = requestAnimationFrame(animate);
      return;
    }
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const particles = particlesRef.current;
    
    particlesRef.current = updateParticles(particles, canvas.width, canvas.height, timestamp);
    drawParticles(ctx, particlesRef.current, canvas.width, canvas.height);
    
    animationFrameId.current = requestAnimationFrame(animate);
  };

  // Handle resize window dengan throttling
  const handleResize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const ctx = canvas.getContext('2d');
    particlesRef.current = initParticles(canvas, ctx);
  };

  // Throttle function untuk event handlers
  const throttle = (callback, delay) => {
    let previousCall = 0;
    return function(...args) {
      const now = Date.now();
      if (now - previousCall >= delay) {
        previousCall = now;
        callback(...args);
      }
    };
  };

  // Handle mouse move dengan throttling untuk performa
  const handleMouseMove = throttle((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    mousePosition.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    
    mouseActive.current = true;
    lastMouseMoveTime.current = Date.now();
  }, 16); // ~60fps untuk interaktivitas lebih baik

  const handleMouseLeave = () => {
    mousePosition.current = { x: null, y: null };
    mouseActive.current = false;
  };

  // Setup canvas dan animasi dengan cleanup yang lebih baik
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Set ukuran canvas
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const ctx = canvas.getContext('2d');
    particlesRef.current = initParticles(canvas, ctx);
    
    // Start animation
    animationFrameId.current = requestAnimationFrame(animate);
    
    // Event listeners dengan throttling
    const throttledResize = throttle(handleResize, 200);
    window.addEventListener('resize', throttledResize);
    
    // Hanya tambahkan event listener jika interactive = true
    if (interactive) {
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseleave', handleMouseLeave);
      
      // Touch events for mobile
      canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        handleMouseMove({
          clientX: e.touches[0].clientX,
          clientY: e.touches[0].clientY
        });
      });
      
      canvas.addEventListener('touchend', handleMouseLeave);
    }
    
    // Cleanup
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      
      window.removeEventListener('resize', throttledResize);
      if (interactive && canvas) {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseleave', handleMouseLeave);
        canvas.removeEventListener('touchmove', handleMouseMove);
        canvas.removeEventListener('touchend', handleMouseLeave);
      }
    };
  }, [color, count, speed, connected, type, interactive, isVisible]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-0"
      style={{
        ...style,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease'
      }}
    />
  );
};

ParticlesBackground.propTypes = {
  color: PropTypes.string,
  count: PropTypes.number,
  speed: PropTypes.number,
  connected: PropTypes.bool,
  type: PropTypes.oneOf(['default', 'wave', 'pulse', 'gravity', 'vortex', 'magnetic']),
  interactive: PropTypes.bool,
  style: PropTypes.object
};

export default ParticlesBackground; 