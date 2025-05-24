import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Komponen untuk menampilkan efek partikel di latar belakang dengan performa yang dioptimalkan,
 * efek glow yang lebih kuat, dan interaktivitas yang ditingkatkan
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
  color = 'rgba(79, 70, 229, 0.6)', // Default: Indigo dengan transparansi
  count = 80,
  speed = 1,
  connected = true,
  type = 'default',
  interactive = true,
  style = {},
}) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationFrameId = useRef(null);
  const mousePosition = useRef({ x: null, y: null });
  const [isVisible, setIsVisible] = useState(true);
  const mouseRadius = useRef(180); // Radius pengaruh mouse (ditingkatkan dari 150)
  const mouseForce = useRef(6 * speed); // Kekuatan pengaruh mouse (ditingkatkan dari 5)
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

  // Inisialisasi partikel dengan berbagai jenis
  const initParticles = (canvas, ctx) => {
    const particles = [];
    const { width, height } = canvas;
    
    // Batasi jumlah partikel berdasarkan ukuran layar untuk performa
    const adjustedCount = Math.min(count, Math.floor((width * height) / 8000));

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
      const size = Math.random() * 4 + 1;
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
        case 'vortex':
          directionX = (Math.random() * 2 - 1) * speed * 0.3;
          directionY = (Math.random() * 2 - 1) * speed * 0.3;
          break;
        case 'magnetic':
          directionX = (Math.random() * 2 - 1) * speed * 0.2;
          directionY = (Math.random() * 2 - 1) * speed * 0.2;
          break;
        default:
          directionX = (Math.random() * 2 - 1) * speed;
          directionY = (Math.random() * 2 - 1) * speed;
      }
      
      const opacity = Math.random() * 0.7 + 0.3;
      const initialSize = size;
      
      // Variasi warna yang lebih dinamis
      let particleColor = baseColor;
      if (r !== undefined && g !== undefined && b !== undefined) {
        // Variasi warna berdasarkan posisi untuk efek gradien
        const hueShift = Math.random() * 40 - 20; // Variasi hue yang lebih besar (-20 hingga +20)
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
        // Properti tambahan untuk animasi
        angle: Math.random() * 360,
        spin: Math.random() > 0.5 ? 1 : -1,
        pulseFactor: 0,
        pulseDirection: 1,
        originalX: x, // Untuk efek magnetic
        originalY: y, // Untuk efek magnetic
        vortexAngle: Math.random() * Math.PI * 2, // Untuk efek vortex
        vortexRadius: Math.random() * 100 + 50, // Untuk efek vortex
        // Properti untuk interaktivitas mouse
        targetX: x,
        targetY: y,
        force: 0,
        forceDirectionX: 0,
        forceDirectionY: 0,
        velocity: Math.random() * 2 + 0.5,
        dampening: 0.95, // Faktor perlambatan
        // Properti baru untuk efek glow
        glowIntensity: Math.random() * 0.5 + 0.5, // Intensitas glow (0.5-1.0)
        glowSize: Math.random() * 2 + 1.5, // Ukuran glow relatif terhadap ukuran partikel
        // Properti untuk animasi partikel yang lebih dinamis
        lifespan: Math.random() * 0.5 + 0.5, // Faktor umur partikel (0.5-1.0)
        fadeState: 'in', // 'in', 'visible', 'out'
        fadeProgress: 0, // 0-1
        fadeSpeed: Math.random() * 0.01 + 0.005 // Kecepatan fade
      });
    }

    return particles;
  };

  // Menggambar partikel dengan optimasi untuk performa dan efek glow yang ditingkatkan
  const drawParticles = (ctx, particles, width, height) => {
    ctx.clearRect(0, 0, width, height);

    // Batch rendering untuk performa lebih baik
    particles.forEach((particle) => {
      // Efek glow yang lebih kuat untuk partikel yang berinteraksi dengan mouse
      if (particle.force > 0 || mouseActive.current) {
        ctx.beginPath();
        
        // Ukuran glow berdasarkan interaksi mouse dan properti partikel
        const glowSize = particle.size * (2 + particle.glowSize * (particle.force > 0 ? 2 : 1));
        const glowIntensity = particle.glowIntensity * (particle.force > 0 ? 1.5 : 1);
        
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
      
      // Gambar partikel utama
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

  // Menghubungkan partikel dengan garis - dengan optimasi dan efek yang ditingkatkan
  const connectParticles = (ctx, particles, width, height) => {
    // Optimasi: Sesuaikan maxDistance berdasarkan ukuran layar
    const maxDistance = Math.min(width, height) * 0.08; // Ditingkatkan dari 0.07
    
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
              
              // Gunakan gradient untuk koneksi yang lebih menarik
              const gradient = ctx.createLinearGradient(
                particle.x, particle.y, 
                otherParticle.x, otherParticle.y
              );
              
              const particleColor1 = particle.color || color;
              const particleColor2 = otherParticle.color || color;
              
              gradient.addColorStop(0, particleColor1.replace(')', `, ${opacity * 0.6})`));
              gradient.addColorStop(1, particleColor2.replace(')', `, ${opacity * 0.6})`));
              
              ctx.beginPath();
              ctx.strokeStyle = gradient;
              ctx.lineWidth = Math.min(1.2, 0.8 + opacity * 0.4); // Variasi ketebalan garis
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              ctx.stroke();
            }
          }
        }
      }
    });

    // Koneksi dengan mouse jika mouse di dalam canvas dan interaktif
    if (interactive && mousePosition.current.x !== null && mousePosition.current.y !== null) {
      const mouseMaxConnections = 8; // Lebih banyak koneksi untuk mouse
      let mouseConnections = 0;
      
      // Efek ripple saat mouse bergerak
      if (mouseActive.current) {
        ctx.beginPath();
        const rippleRadius = mouseRadius.current * (1 + Math.sin(Date.now() * 0.005) * 0.2);
        const gradient = ctx.createRadialGradient(
          mousePosition.current.x, mousePosition.current.y, 0,
          mousePosition.current.x, mousePosition.current.y, rippleRadius
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.arc(mousePosition.current.x, mousePosition.current.y, rippleRadius, 0, Math.PI * 2);
        ctx.fill();
      }
      
      for (let i = 0; i < particles.length && mouseConnections < mouseMaxConnections; i++) {
        const particle = particles[i];
        const dx = mousePosition.current.x - particle.x;
        const dy = mousePosition.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouseRadius.current) {
          mouseConnections++;
          const opacity = 1 - distance / mouseRadius.current;
          
          // Gradient untuk koneksi mouse yang lebih menarik
          const gradient = ctx.createLinearGradient(
            mousePosition.current.x, mousePosition.current.y, 
            particle.x, particle.y
          );
          
          const particleColor = particle.color || color;
          gradient.addColorStop(0, 'rgba(255, 255, 255, ' + opacity * 0.8 + ')');
          gradient.addColorStop(1, particleColor.replace(')', `, ${opacity * 0.6})`));
          
          ctx.beginPath();
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 1.5 * opacity; // Garis lebih tebal untuk koneksi mouse
          ctx.moveTo(mousePosition.current.x, mousePosition.current.y);
          ctx.lineTo(particle.x, particle.y);
          ctx.stroke();
        }
      }
    }
  };

  // Update posisi dan properti partikel dengan animasi yang ditingkatkan
  const updateParticles = (particles, width, height, timestamp) => {
    const now = timestamp || performance.now();
    const mouseIsActive = mouseActive.current && (now - lastMouseMoveTime.current < 2000);
    
    particles.forEach(particle => {
      // Update posisi berdasarkan jenis animasi
      switch (type) {
        case 'wave':
          // Efek gelombang yang lebih dinamis
          particle.y += Math.sin((now / 1000) + (particle.x / 100)) * speed * 0.3;
          particle.x += particle.directionX;
          break;
          
        case 'pulse':
          // Efek pulse yang lebih menarik dengan variasi ukuran
          particle.pulseFactor += 0.01 * particle.pulseDirection * speed;
          if (particle.pulseFactor > 1) {
            particle.pulseFactor = 1;
            particle.pulseDirection = -1;
          } else if (particle.pulseFactor < 0) {
            particle.pulseFactor = 0;
            particle.pulseDirection = 1;
          }
          particle.size = particle.initialSize * (1 + particle.pulseFactor * 0.5);
          
          particle.x += particle.directionX;
          particle.y += particle.directionY;
          break;
          
        case 'gravity':
          // Efek gravitasi yang lebih realistis
          particle.directionY += 0.01 * speed; // Simulasi gravitasi
          particle.x += particle.directionX;
          particle.y += particle.directionY;
          
          // Bounce effect di bagian bawah
          if (particle.y > height) {
            particle.y = height;
            particle.directionY = -particle.directionY * 0.6; // Pantulan dengan redaman
          }
          break;
          
        case 'vortex':
          // Efek vortex yang lebih dinamis
          particle.vortexAngle += 0.01 * speed * (1 + (mouseIsActive ? 0.5 : 0));
          
          // Jarak dari pusat vortex (tengah canvas)
          const centerX = width / 2;
          const centerY = height / 2;
          const dx = particle.x - centerX;
          const dy = particle.y - centerY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Kecepatan rotasi berdasarkan jarak dari pusat
          const rotationSpeed = (1 - Math.min(1, distance / Math.max(width, height))) * 0.02 * speed;
          
          // Pergerakan melingkar
          const angle = Math.atan2(dy, dx);
          const newAngle = angle + rotationSpeed;
          
          // Tarikan ke dalam vortex
          const pullFactor = 0.05 * speed;
          const newDistance = distance > 50 ? distance - pullFactor : distance;
          
          // Update posisi
          particle.x = centerX + Math.cos(newAngle) * newDistance;
          particle.y = centerY + Math.sin(newAngle) * newDistance;
          break;
          
        case 'magnetic':
          // Efek magnetic yang lebih responsif
          // Jarak dari posisi awal
          const originalDx = particle.x - particle.originalX;
          const originalDy = particle.y - particle.originalY;
          const originalDistance = Math.sqrt(originalDx * originalDx + originalDy * originalDy);
          
          // Kekuatan tarik kembali ke posisi awal
          const pullStrength = 0.03 * speed;
          
          // Tambahkan gaya tarik ke posisi awal
          particle.directionX += -originalDx * pullStrength / (originalDistance + 1);
          particle.directionY += -originalDy * pullStrength / (originalDistance + 1);
          
          // Redaman untuk mencegah osilasi berlebihan
          particle.directionX *= 0.98;
          particle.directionY *= 0.98;
          
          // Update posisi
          particle.x += particle.directionX;
          particle.y += particle.directionY;
          break;
          
        default:
          // Gerakan default dengan sedikit variasi
          particle.x += particle.directionX;
          particle.y += particle.directionY;
      }
      
      // Efek interaktif dengan mouse
      if (interactive && mousePosition.current.x !== null && mousePosition.current.y !== null && mouseIsActive) {
        const dx = mousePosition.current.x - particle.x;
        const dy = mousePosition.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouseRadius.current) {
          // Kekuatan interaksi berdasarkan jarak
          const force = (mouseRadius.current - distance) / mouseRadius.current;
          const directionX = dx / distance;
          const directionY = dy / distance;
          
          // Efek repulsi (menjauh dari mouse)
          particle.forceDirectionX = -directionX * force * mouseForce.current;
          particle.forceDirectionY = -directionY * force * mouseForce.current;
          particle.force = force;
          
          // Tingkatkan ukuran partikel saat berinteraksi dengan mouse
          particle.size = particle.initialSize * (1 + force * 0.5);
        } else {
          // Kurangi kekuatan secara bertahap
          particle.force *= 0.95;
          particle.forceDirectionX *= 0.95;
          particle.forceDirectionY *= 0.95;
          
          // Kembalikan ukuran ke normal
          particle.size = particle.initialSize + (particle.size - particle.initialSize) * 0.95;
        }
        
        // Terapkan kekuatan ke pergerakan partikel
        particle.x += particle.forceDirectionX;
        particle.y += particle.forceDirectionY;
      } else {
        // Kurangi kekuatan secara bertahap jika mouse tidak aktif
        particle.force *= 0.95;
        particle.forceDirectionX *= 0.95;
        particle.forceDirectionY *= 0.95;
        
        // Kembalikan ukuran ke normal
        particle.size = particle.initialSize + (particle.size - particle.initialSize) * 0.95;
      }
      
      // Batasi posisi partikel di dalam canvas dengan efek bounce
      if (particle.x < 0) {
        particle.x = 0;
        particle.directionX = Math.abs(particle.directionX);
      } else if (particle.x > width) {
        particle.x = width;
        particle.directionX = -Math.abs(particle.directionX);
      }
      
      if (particle.y < 0) {
        particle.y = 0;
        particle.directionY = Math.abs(particle.directionY);
      } else if (particle.y > height) {
        particle.y = height;
        particle.directionY = -Math.abs(particle.directionY);
      }
      
      // Animasi fade in/out untuk efek yang lebih dinamis
      if (particle.fadeState === 'in') {
        particle.fadeProgress += particle.fadeSpeed;
        if (particle.fadeProgress >= 1) {
          particle.fadeProgress = 1;
          particle.fadeState = 'visible';
        }
        particle.opacity = particle.fadeProgress * 0.7 + 0.3;
      } else if (particle.fadeState === 'out') {
        particle.fadeProgress -= particle.fadeSpeed;
        if (particle.fadeProgress <= 0) {
          particle.fadeProgress = 0;
          particle.fadeState = 'in';
          // Reposisi partikel untuk efek regenerasi
          particle.x = Math.random() * width;
          particle.y = Math.random() * height;
        }
        particle.opacity = particle.fadeProgress * 0.7 + 0.3;
      }
      
      // Secara acak ubah state partikel untuk efek yang lebih dinamis
      if (Math.random() < 0.001) {
        if (particle.fadeState === 'visible') {
          particle.fadeState = 'out';
        }
      }
    });
    
    return particles;
  };

  // Fungsi animasi utama
  const animate = (timestamp) => {
    if (!isVisible) {
      animationFrameId.current = requestAnimationFrame(animate);
      return;
    }
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Update dan gambar partikel
    particlesRef.current = updateParticles(particlesRef.current, canvas.width, canvas.height, timestamp);
    drawParticles(ctx, particlesRef.current, canvas.width, canvas.height);
    
    // Lanjutkan loop animasi
    animationFrameId.current = requestAnimationFrame(animate);
  };

  // Handler untuk resize window
  const handleResize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Sesuaikan ukuran canvas dengan ukuran parent
    const parent = canvas.parentElement;
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
    
    // Reinisialisasi partikel dengan ukuran baru
    const ctx = canvas.getContext('2d');
    particlesRef.current = initParticles(canvas, ctx);
  };

  // Handler untuk mouse move dengan throttle
  const handleMouseMove = (e) => {
    if (!interactive) return;
    
    const now = performance.now();
    lastMouseMoveTime.current = now;
    mouseActive.current = true;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    mousePosition.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  // Handler untuk mouse leave
  const handleMouseLeave = () => {
    mousePosition.current = { x: null, y: null };
    mouseActive.current = false;
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

  // Setup canvas dan event listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Sesuaikan ukuran canvas dengan ukuran parent
    handleResize();
    
    // Inisialisasi partikel
    particlesRef.current = initParticles(canvas, ctx);
    
    // Setup event listeners
    const throttledMouseMove = throttle(handleMouseMove, 16); // ~60fps
    const throttledResize = throttle(handleResize, 200);
    
    window.addEventListener('resize', throttledResize);
    canvas.addEventListener('mousemove', throttledMouseMove);
    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      throttledMouseMove({
        clientX: touch.clientX,
        clientY: touch.clientY
      });
    }, { passive: false });
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('touchend', handleMouseLeave);
    
    // Mulai animasi
    animationFrameId.current = requestAnimationFrame(animate);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', throttledResize);
      canvas.removeEventListener('mousemove', throttledMouseMove);
      canvas.removeEventListener('touchmove', throttledMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('touchend', handleMouseLeave);
      
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [color, count, speed, connected, type, interactive]); // Re-init jika props berubah

  return (
    <div className="particles-container" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, ...style }}>
      <canvas
        ref={canvasRef}
        style={{ display: 'block', width: '100%', height: '100%' }}
      />
    </div>
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