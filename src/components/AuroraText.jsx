import { useEffect, useRef, useState } from 'react';

export const AuroraText = ({
  children,
  className = '',
  colors = ['#ff3cbd', '#7e24fa', '#24a3fa', '#24faa3'],
  size = 200,
  blur = 100,
  speed = 5,
  ...props
}) => {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const textRef = useRef(null);
  const animationRef = useRef(null);
  
  useEffect(() => {
    setMounted(true);
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const text = textRef.current;
    
    if (!canvas || !ctx || !text) return;
    
    // Setup
    const calculateSize = () => {
      const bounds = text.getBoundingClientRect();
      
      // Adjusting canvas size
      canvas.width = bounds.width + size * 2;
      canvas.height = bounds.height + size * 2;
      
      // Position canvas behind text and centered
      canvas.style.top = `${-size + bounds.height / 2}px`;
      canvas.style.left = `${-size + bounds.width / 2}px`;
    };
    
    calculateSize();
    window.addEventListener('resize', calculateSize);
    
    // Create color blobs
    const blobs = colors.map((color) => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      r: size,
      color
    }));
    
    // Animation
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw blobs
      blobs.forEach((blob) => {
        // Move blob
        blob.x += blob.vx;
        blob.y += blob.vy;
        
        // Bounce off walls
        if (blob.x < 0 || blob.x > canvas.width) blob.vx *= -1;
        if (blob.y < 0 || blob.y > canvas.height) blob.vy *= -1;
        
        // Draw gradient
        const gradient = ctx.createRadialGradient(
          blob.x, blob.y, 0,
          blob.x, blob.y, blob.r
        );
        gradient.addColorStop(0, `${blob.color}ff`);
        gradient.addColorStop(1, `${blob.color}00`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(blob.x, blob.y, blob.r, 0, Math.PI * 2);
        ctx.fill();
      });
      
      // Apply composite operation and blur
      ctx.globalCompositeOperation = 'lighter';
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      setMounted(false);
      window.removeEventListener('resize', calculateSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [colors, size, speed]);
  
  const combinedClassName = `relative inline-block ${className}`;
  
  if (!mounted) return <span className={combinedClassName}>{children}</span>;
  
  return (
    <span ref={containerRef} className={combinedClassName} {...props}>
      <canvas 
        ref={canvasRef} 
        className="absolute pointer-events-none z-0" 
        style={{ filter: `blur(${blur}px)` }}
      />
      <span 
        ref={textRef} 
        className="relative z-10 bg-clip-text text-transparent bg-white mix-blend-overlay"
        style={{ WebkitBackgroundClip: 'text' }}
      >
        {children}
      </span>
    </span>
  );
};

export default AuroraText; 