import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Komponen untuk menampilkan efek partikel di latar belakang
 * 
 * @param {Object} props - Props komponen
 * @param {string} props.color - Warna partikel
 * @param {number} props.count - Jumlah partikel
 * @param {number} props.speed - Kecepatan animasi
 * @param {boolean} props.connected - Apakah partikel terhubung dengan garis
 * @param {Object} props.style - Style tambahan untuk container
 * @returns {JSX.Element} Komponen ParticlesBackground
 */
const ParticlesBackground = ({
  color = 'rgba(79, 70, 229, 0.6)', // Default: Indigo dengan transparansi
  count = 80,
  speed = 1,
  connected = true,
  style = {},
}) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationFrameId = useRef(null);
  const mousePosition = useRef({ x: null, y: null });

  // Inisialisasi partikel
  const initParticles = (canvas, ctx) => {
    const particles = [];
    const { width, height } = canvas;

    for (let i = 0; i < count; i++) {
      const size = Math.random() * 3 + 1;
      const x = Math.random() * width;
      const y = Math.random() * height;
      const directionX = (Math.random() * 2 - 1) * speed;
      const directionY = (Math.random() * 2 - 1) * speed;
      const opacity = Math.random() * 0.5 + 0.2;

      particles.push({
        x,
        y,
        size,
        directionX,
        directionY,
        opacity,
      });
    }

    return particles;
  };

  // Menggambar partikel
  const drawParticles = (ctx, particles, width, height) => {
    ctx.clearRect(0, 0, width, height);

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

  // Menghubungkan partikel dengan garis
  const connectParticles = (ctx, particles, width, height) => {
    const maxDistance = width * 0.07;

    particles.forEach((particle, i) => {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[j].x - particle.x;
        const dy = particles[j].y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          const opacity = 1 - distance / maxDistance;
          ctx.beginPath();
          ctx.strokeStyle = color.replace(')', `, ${opacity * 0.3})`);
          ctx.lineWidth = 0.5;
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    });

    // Koneksi dengan mouse jika mouse di dalam canvas
    if (mousePosition.current.x !== null && mousePosition.current.y !== null) {
      particles.forEach((particle) => {
        const dx = mousePosition.current.x - particle.x;
        const dy = mousePosition.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance * 1.5) {
          const opacity = 1 - distance / (maxDistance * 1.5);
          ctx.beginPath();
          ctx.strokeStyle = color.replace(')', `, ${opacity * 0.5})`);
          ctx.lineWidth = 0.8;
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(mousePosition.current.x, mousePosition.current.y);
          ctx.stroke();
        }
      });
    }
  };

  // Mengupdate posisi partikel
  const updateParticles = (particles, width, height) => {
    return particles.map((particle) => {
      // Update posisi
      particle.x += particle.directionX;
      particle.y += particle.directionY;

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

  // Animasi partikel
  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const particles = particlesRef.current;

    drawParticles(ctx, particles, canvas.width, canvas.height);
    particlesRef.current = updateParticles(particles, canvas.width, canvas.height);
    animationFrameId.current = requestAnimationFrame(animate);
  };

  // Resize handler
  const handleResize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Reinitialize particles
    particlesRef.current = initParticles(canvas, canvas.getContext('2d'));
  };

  // Mouse move handler
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext('2d');
    particlesRef.current = initParticles(canvas, ctx);

    // Start animation
    animate();

    // Add event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Cleanup
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [color, count, speed, connected]);

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
  style: PropTypes.object,
};

export default ParticlesBackground; 