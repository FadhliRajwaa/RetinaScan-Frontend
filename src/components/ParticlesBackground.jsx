import { useEffect, useRef, useState, useMemo } from 'react';
import PropTypes from 'prop-types';

/**
 * Komponen untuk menampilkan efek partikel di latar belakang dengan performa yang dioptimalkan
 * dan efek visual modern yang ringan
 * 
 * @param {Object} props - Props komponen
 * @param {string} props.color - Warna partikel atau gradient
 * @param {number} props.count - Jumlah partikel 
 * @param {number} props.speed - Kecepatan animasi
 * @param {boolean} props.connected - Apakah partikel terhubung dengan garis
 * @param {string} props.type - Jenis animasi ('default', 'wave', 'pulse', 'flow')
 * @param {boolean} props.interactive - Apakah partikel bereaksi terhadap gerakan mouse
 * @param {boolean} props.glow - Efek cahaya pada partikel
 * @param {Object} props.style - Style tambahan untuk container
 * @returns {JSX.Element} Komponen ParticlesBackground
 */
const ParticlesBackground = ({
  color = 'rgba(99, 102, 241, 0.6)',
  count = 50, 
  speed = 1.0,
  connected = true,
  type = 'flow',
  interactive = true,
  glow = true,
  style = {},
}) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationFrameId = useRef(null);
  const mousePosition = useRef({ x: null, y: null });
  const [isVisible, setIsVisible] = useState(true);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const mouseRadius = useRef(120);
  const mouseForce = useRef(4 * speed);
  const lastMouseMoveTime = useRef(0);
  const mouseActive = useRef(false);
  const devicePixelRatio = useRef(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1);
  const lastFrameTime = useRef(0);
  
  // Mengekstrak komponen warna dari string color untuk efek gradient dan variasi
  const colorComponents = useMemo(() => {
    let r = 99, g = 102, b = 241, a = 0.6; // Default: Indigo
    
    if (color.includes('rgb')) {
      const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/i);
      if (rgbMatch) {
        r = parseInt(rgbMatch[1]);
        g = parseInt(rgbMatch[2]);
        b = parseInt(rgbMatch[3]);
        a = rgbMatch[4] ? parseFloat(rgbMatch[4]) : 1;
      }
    }
    
    return { r, g, b, a };
  }, [color]);
  
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

  // Inisialisasi partikel dengan optimasi untuk ukuran layar
  const initParticles = (canvas) => {
    const { width, height } = canvas;
    const particles = [];
    
    // Adjust particle count based on screen size for better performance
    const scaleFactor = Math.min(width, height) / 1000;
    const adjustedCount = Math.min(Math.floor(count * scaleFactor), count);
    const actualCount = Math.max(adjustedCount, 20);
    
    const { r, g, b, a } = colorComponents;

    for (let i = 0; i < actualCount; i++) {
      const size = Math.random() * 3 + 0.5; // Ukuran lebih kecil untuk performa lebih baik
      const x = Math.random() * width;
      const y = Math.random() * height;
      
      // Variasi kecepatan dan arah berdasarkan jenis animasi
      let directionX, directionY;
      
      switch (type) {
        case 'wave':
          directionX = (Math.random() * 0.6 - 0.3) * speed;
          directionY = Math.sin(x / 100) * speed * 0.3;
          break;
        case 'pulse':
          directionX = (Math.random() * 0.8 - 0.4) * speed * 0.3;
          directionY = (Math.random() * 0.8 - 0.4) * speed * 0.3;
          break;
        case 'flow':
          directionX = Math.cos(Math.random() * Math.PI * 2) * speed * 0.2;
          directionY = Math.sin(Math.random() * Math.PI * 2) * speed * 0.2;
          break;
        default:
          directionX = (Math.random() * 0.8 - 0.4) * speed * 0.5;
          directionY = (Math.random() * 0.8 - 0.4) * speed * 0.5;
      }
      
      // Variasi opacity untuk efek kedalaman
      const opacity = Math.random() * 0.6 + 0.4;
      
      // Variasi warna untuk efek visual yang lebih menarik
      const hueShift = Math.random() * 30 - 15;
      const rNew = Math.min(255, Math.max(0, r + hueShift));
      const gNew = Math.min(255, Math.max(0, g + hueShift));
      const bNew = Math.min(255, Math.max(0, b + hueShift));
      const particleColor = `rgba(${rNew}, ${gNew}, ${bNew}, ${opacity * a})`;
      
      particles.push({
        x,
        y,
        size,
        initialSize: size,
        directionX,
        directionY,
        opacity,
        color: particleColor,
        // Properties for special effects
        pulseFactor: 0,
        pulseDirection: Math.random() > 0.5 ? 1 : -1,
        originalX: x,
        originalY: y,
        angle: Math.random() * Math.PI * 2,
        orbitRadius: Math.random() * 30 + 10,
        orbitSpeed: (Math.random() * 0.01 + 0.005) * speed,
        // Properties for mouse interactivity
        targetX: x,
        targetY: y,
        force: 0,
        forceDirectionX: 0,
        forceDirectionY: 0,
        velocity: Math.random() * 1.5 + 0.5,
        dampening: 0.95,
        // Properties for glow effect
        glowIntensity: Math.random() * 0.5 + 0.3,
        glowSize: Math.random() * 1.2 + 0.8,
        // Custom properties
        phase: Math.random() * Math.PI * 2,
        waveAmplitude: Math.random() * 1.2 + 0.3,
        flowOffset: Math.random() * Math.PI * 2,
        flowSpeed: (Math.random() * 0.3 + 0.1) * speed,
      });
    }

    return particles;
  };
  
  // Improved drawing with optimized batch rendering
  const drawParticles = (ctx, particles) => {
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);
    
    // Draw connections first (if enabled) to ensure particles are on top
    if (connected) {
      connectParticles(ctx, particles);
    }
    
    // Batch rendering for better performance
    particles.forEach((particle) => {
      // Draw glow effect for particles if enabled
      if (glow && (particle.force > 0.1 || type === 'pulse' || type === 'flow')) {
        const glowSize = particle.size * (1.5 + particle.glowSize);
        const intensity = particle.glowIntensity * 
                          (mouseActive.current && particle.force > 0.1 ? 1.2 : 0.6);
        
        // Create gradient for glow
        const glow = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, glowSize
        );
        
        const { r, g, b } = parseColor(particle.color);
        glow.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${particle.opacity * intensity})`);
        glow.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, glowSize, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Draw the particle
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.fill();
    });
  };

  // Helper function to parse color
  const parseColor = (color) => {
    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/i);
    if (match) {
      return {
        r: parseInt(match[1]), 
        g: parseInt(match[2]), 
        b: parseInt(match[3]),
        a: match[4] ? parseFloat(match[4]) : 1
      };
    }
    return { r: 255, g: 255, b: 255, a: 1 };
  };

  // Optimized connection drawing for particles
  const connectParticles = (ctx, particles) => {
    // Adjust max distance based on screen size
    const maxDistance = Math.min(dimensions.width, dimensions.height) * 0.07;
    
    // Spatial partitioning grid to reduce comparisons
    const gridSize = maxDistance;
    const grid = {};
    
    // Place particles into grid
    particles.forEach((particle, index) => {
      const gridX = Math.floor(particle.x / gridSize);
      const gridY = Math.floor(particle.y / gridSize);
      const key = `${gridX},${gridY}`;
      
      if (!grid[key]) grid[key] = [];
      grid[key].push(index);
    });
    
    // Check neighboring cells for connections
    particles.forEach((particle, i) => {
      const gridX = Math.floor(particle.x / gridSize);
      const gridY = Math.floor(particle.y / gridSize);
      
      // Check neighboring cells
      for (let x = gridX - 1; x <= gridX + 1; x++) {
        for (let y = gridY - 1; y <= gridY + 1; y++) {
          const key = `${x},${y}`;
          if (!grid[key]) continue;
          
          // Check particles in this cell
          grid[key].forEach(j => {
            if (i === j) return; // Skip self
            
            const targetParticle = particles[j];
            const dx = particle.x - targetParticle.x;
            const dy = particle.y - targetParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < maxDistance) {
              const opacity = (1 - (distance / maxDistance)) * 0.3; // Reduced opacity for better performance
              
              // Simplified connection style
              const { r, g, b } = colorComponents;
              ctx.beginPath();
              ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
              ctx.lineWidth = 0.5; // Thinner lines for better performance
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(targetParticle.x, targetParticle.y);
              ctx.stroke();
            }
          });
        }
      }
    });
  };

  // Update particle positions based on animation type
  const updateParticles = (particles, width, height, timestamp) => {
    const now = timestamp;
    const mouseInteractionActive = interactive && mouseActive.current && (now - lastMouseMoveTime.current < 200);
    
    // Calculate delta time for smooth animation
    const deltaTime = lastFrameTime.current ? Math.min((now - lastFrameTime.current) / 16, 2) : 1;
    lastFrameTime.current = now;
    
    return particles.map(particle => {
      // Clone particle for updates
      const updatedParticle = { ...particle };
      
      // Handle mouse interaction
      if (mouseInteractionActive && 
          mousePosition.current.x !== null && 
          mousePosition.current.y !== null) {
        
        const dx = mousePosition.current.x - updatedParticle.x;
        const dy = mousePosition.current.y - updatedParticle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouseRadius.current) {
          // Calculate force based on distance from mouse
          const force = (mouseRadius.current - distance) / mouseRadius.current;
          
          // Direction away from mouse (repulsion)
          updatedParticle.forceDirectionX = -dx / distance;
          updatedParticle.forceDirectionY = -dy / distance;
          
          // Apply force
          updatedParticle.force = force * mouseForce.current;
          
          // Set target position for smooth movement
          updatedParticle.targetX = updatedParticle.x + updatedParticle.forceDirectionX * updatedParticle.force * 3;
          updatedParticle.targetY = updatedParticle.y + updatedParticle.forceDirectionY * updatedParticle.force * 3;
        } else {
          // Gradually reduce force
          updatedParticle.force *= 0.92;
        }
      } else {
        // Gradually reduce force when mouse inactive
        updatedParticle.force *= 0.92;
      }
      
      // Special animations based on type
      const time = now / 1000; // Convert to seconds for easier math
      
      switch (type) {
        case 'wave': {
          // Dynamic wave pattern
          const phaseX = updatedParticle.phase + time * 0.4 * speed;
          const phaseY = updatedParticle.phase + time * 0.2 * speed;
          
          updatedParticle.directionY = Math.sin(phaseX) * updatedParticle.waveAmplitude * 0.2 * speed;
          updatedParticle.directionX = Math.cos(phaseY) * updatedParticle.waveAmplitude * 0.1 * speed;
          
          // Apply direction
          updatedParticle.x += updatedParticle.directionX * deltaTime;
          updatedParticle.y += updatedParticle.directionY * deltaTime;
          break;
        }
          
        case 'pulse': {
          // Enhanced pulse effect (size and opacity)
          updatedParticle.pulseFactor += 0.01 * updatedParticle.pulseDirection * speed * deltaTime;
          
          if (updatedParticle.pulseFactor > 0.5) {
            updatedParticle.pulseDirection = -1;
          } else if (updatedParticle.pulseFactor < -0.5) {
            updatedParticle.pulseDirection = 1;
          }
          
          // Pulse size based on factor
          updatedParticle.size = updatedParticle.initialSize * (1 + updatedParticle.pulseFactor * 0.4);
          
          // Update position
          updatedParticle.x += updatedParticle.directionX * deltaTime;
          updatedParticle.y += updatedParticle.directionY * deltaTime;
          break;
        }
          
        case 'flow': {
          // Flowing fluid-like motion - simplified for better performance
          const flowPhase = updatedParticle.flowOffset + time * updatedParticle.flowSpeed;
          
          // Create flowing vector field effect
          const noiseX = Math.sin(flowPhase + updatedParticle.x / 150);
          const noiseY = Math.cos(flowPhase + updatedParticle.y / 150);
          
          updatedParticle.directionX = noiseX * speed * 0.3;
          updatedParticle.directionY = noiseY * speed * 0.3;
          
          // Update position
          updatedParticle.x += updatedParticle.directionX * deltaTime;
          updatedParticle.y += updatedParticle.directionY * deltaTime;
          break;
        }
          
        default: {
          // Standard movement
          updatedParticle.x += updatedParticle.directionX * deltaTime;
          updatedParticle.y += updatedParticle.directionY * deltaTime;
          break;
        }
      }
      
      // Apply mouse interaction force
      if (updatedParticle.force > 0.01) {
        updatedParticle.x += (updatedParticle.targetX - updatedParticle.x) * updatedParticle.force * 0.08 * deltaTime;
        updatedParticle.y += (updatedParticle.targetY - updatedParticle.y) * updatedParticle.force * 0.08 * deltaTime;
      }
      
      // Bounce particles when they reach the edges
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

  // Main animation loop with requestAnimationFrame
  const animate = (timestamp) => {
    if (!isVisible || !canvasRef.current) {
      animationFrameId.current = requestAnimationFrame(animate);
      return;
    }
    
    const ctx = canvasRef.current.getContext('2d', { alpha: true });
    
    particlesRef.current = updateParticles(
      particlesRef.current, 
      dimensions.width, 
      dimensions.height, 
      timestamp
    );
    
    drawParticles(ctx, particlesRef.current);
    
    animationFrameId.current = requestAnimationFrame(animate);
  };

  // Handle window resize with throttling
  const handleResize = () => {
    if (!canvasRef.current) return;
    
    // Update canvas size with device pixel ratio for sharp rendering
    const canvas = canvasRef.current;
    const containerRect = canvas.getBoundingClientRect();
    
    // Set display size
    canvas.style.width = `${containerRect.width}px`;
    canvas.style.height = `${containerRect.height}px`;
    
    // Set actual size scaled by pixel ratio
    canvas.width = Math.floor(containerRect.width * devicePixelRatio.current);
    canvas.height = Math.floor(containerRect.height * devicePixelRatio.current);
    
    // Scale canvas context
    const ctx = canvas.getContext('2d', { alpha: true });
    ctx.scale(devicePixelRatio.current, devicePixelRatio.current);
    
    // Update dimensions in state
    setDimensions({
      width: containerRect.width,
      height: containerRect.height
    });
    
    // Reinitialize particles
    particlesRef.current = initParticles(canvas);
  };

  // Throttle function for event handlers
  const throttle = (callback, delay = 100) => {
    let previousCall = 0;
    return function(...args) {
      const now = Date.now();
      if (now - previousCall >= delay) {
        previousCall = now;
        callback(...args);
      }
    };
  };

  // Handle mouse move with throttling
  const handleMouseMove = throttle((e) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    mousePosition.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };

    mouseActive.current = true;
    lastMouseMoveTime.current = Date.now();
  }, 16); // 60fps throttling

  const handleMouseLeave = () => {
    mousePosition.current = { x: null, y: null };
    mouseActive.current = false;
  };

  // Setup and cleanup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Initial setup
    handleResize();
    
    // Start animation
    animationFrameId.current = requestAnimationFrame(animate);
    
    // Event listeners
    const throttledResize = throttle(handleResize, 200);
    window.addEventListener('resize', throttledResize);
    
    // Touch and mouse event listeners
    if (interactive) {
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseleave', handleMouseLeave);
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
  }, [color, count, speed, connected, type, interactive, glow, isVisible]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-0"
      style={{
        ...style,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.5s ease',
      }}
    />
  );
};

ParticlesBackground.propTypes = {
  color: PropTypes.string,
  count: PropTypes.number,
  speed: PropTypes.number,
  connected: PropTypes.bool,
  type: PropTypes.oneOf(['default', 'wave', 'pulse', 'flow']),
  interactive: PropTypes.bool,
  glow: PropTypes.bool,
  style: PropTypes.object
};

export default ParticlesBackground; 