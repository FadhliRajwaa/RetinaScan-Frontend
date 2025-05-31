import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

const MetaballsBackground = ({ numBalls = 20, opacity = 0.7 }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const { isDarkMode } = useTheme();
  const metaballsRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollYRef = useRef(0);

  // Track scrolling to adjust metaballs movement
  useEffect(() => {
    const handleScroll = () => {
      scrollYRef.current = window.scrollY * 0.1; // Reduce effect of scroll
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl');
    
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    // Set canvas size to window size
    const resizeCanvas = () => {
      const devicePixelRatio = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * devicePixelRatio;
      canvas.height = window.innerHeight * devicePixelRatio;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize metaballs with different sizes
    metaballsRef.current = [];
    const smallBalls = Math.floor(numBalls * 0.6); // 60% small balls
    const mediumBalls = Math.floor(numBalls * 0.3); // 30% medium balls
    const largeBalls = numBalls - smallBalls - mediumBalls; // 10% large balls
    
    // Add small balls (good for background)
    for (let i = 0; i < smallBalls; i++) {
      const radius = Math.random() * 20 + 10;
      metaballsRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8, // Very slow movement
        vy: (Math.random() - 0.5) * 0.8,
        r: radius,
        type: 'small'
      });
    }
    
    // Add medium balls
    for (let i = 0; i < mediumBalls; i++) {
      const radius = Math.random() * 40 + 30;
      metaballsRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.6, // Slower movement
        vy: (Math.random() - 0.5) * 0.6,
        r: radius,
        type: 'medium'
      });
    }
    
    // Add large balls (focal points)
    for (let i = 0; i < largeBalls; i++) {
      const radius = Math.random() * 60 + 70;
      metaballsRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4, // Very slow movement
        vy: (Math.random() - 0.5) * 0.4,
        r: radius,
        type: 'large'
      });
    }

    // Shader source code
    const vertexShaderSrc = `
      attribute vec2 position;
      
      void main() {
        // position specifies only x and y.
        // We set z to be 0.0, and w to be 1.0
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fragmentShaderSrc = `
      precision highp float;
      
      const float WIDTH = ${canvas.width}.0;
      const float HEIGHT = ${canvas.height}.0;
      
      uniform vec3 metaballs[${numBalls}];
      uniform vec3 colorA;
      uniform vec3 colorB;
      uniform vec3 colorC;
      uniform float globalOpacity;
      
      void main() {
        float x = gl_FragCoord.x;
        float y = gl_FragCoord.y;
        
        float sum = 0.0;
        for (int i = 0; i < ${numBalls}; i++) {
          vec3 metaball = metaballs[i];
          float dx = metaball.x - x;
          float dy = metaball.y - y;
          float radius = metaball.z;
          
          sum += (radius * radius) / (dx * dx + dy * dy);
        }
        
        if (sum >= 0.99) {
          // Create a smoother gradient between colors
          vec3 color = mix(colorB, colorC, smoothstep(0.99, 1.2, sum));
          
          // Add visual interest with slight opacity variation based on sum
          float alpha = globalOpacity * (0.8 + 0.2 * smoothstep(0.99, 1.3, sum));
          
          gl_FragColor = vec4(color, alpha);
          return;
        }
        
        gl_FragColor = vec4(colorA, 0.0); // Transparent background
      }
    `;

    // Compile shaders
    const compileShader = (shaderSource, shaderType) => {
      const shader = gl.createShader(shaderType);
      gl.shaderSource(shader, shaderSource);
      gl.compileShader(shader);
      
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile failed: ' + gl.getShaderInfoLog(shader));
        return null;
      }
      
      return shader;
    };

    const vertexShader = compileShader(vertexShaderSrc, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(fragmentShaderSrc, gl.FRAGMENT_SHADER);
    
    // Create program
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);
    
    // Create buffer
    const vertexData = new Float32Array([
      -1.0,  1.0, // top left
      -1.0, -1.0, // bottom left
       1.0,  1.0, // top right
       1.0, -1.0, // bottom right
    ]);
    
    const vertexDataBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexDataBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);
    
    // Get attribute location
    const getAttribLocation = (program, name) => {
      const attributeLocation = gl.getAttribLocation(program, name);
      if (attributeLocation === -1) {
        console.error('Cannot find attribute ' + name + '.');
        return null;
      }
      return attributeLocation;
    };
    
    // Get uniform location
    const getUniformLocation = (program, name) => {
      const uniformLocation = gl.getUniformLocation(program, name);
      if (uniformLocation === null) {
        console.error('Cannot find uniform ' + name + '.');
        return null;
      }
      return uniformLocation;
    };
    
    const positionHandle = getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionHandle);
    gl.vertexAttribPointer(
      positionHandle,
      2, // position is a vec2
      gl.FLOAT, // each component is a float
      gl.FALSE, // don't normalize values
      2 * 4, // two 4 byte float components per vertex
      0 // offset into each span of vertex data
    );
    
    const metaballsHandle = getUniformLocation(program, 'metaballs');
    const colorAHandle = getUniformLocation(program, 'colorA');
    const colorBHandle = getUniformLocation(program, 'colorB');
    const colorCHandle = getUniformLocation(program, 'colorC');
    const globalOpacityHandle = getUniformLocation(program, 'globalOpacity');

    // Set global opacity
    gl.uniform1f(globalOpacityHandle, opacity);

    // Set colors based on theme - RetinaScan themed colors
    const updateColors = () => {
      if (isDarkMode) {
        // Dark theme colors - blues and purples (RetinaScan colors)
        gl.uniform3fv(colorAHandle, [0.05, 0.05, 0.1]); // Dark blue background
        gl.uniform3fv(colorBHandle, [0.2, 0.3, 0.7]); // Medium blue
        gl.uniform3fv(colorCHandle, [0.3, 0.2, 0.7]); // Purple highlight
      } else {
        // Light theme colors - blues and light blue (RetinaScan colors)
        gl.uniform3fv(colorAHandle, [0.95, 0.97, 1.0]); // Very light blue background
        gl.uniform3fv(colorBHandle, [0.3, 0.6, 0.9]); // Light blue
        gl.uniform3fv(colorCHandle, [0.5, 0.7, 1.0]); // Light blue highlight
      }
    };

    updateColors();

    // Animation loop
    const loop = () => {
      // Update metaball positions
      for (let i = 0; i < numBalls; i++) {
        const metaball = metaballsRef.current[i];
        
        // Add very subtle attraction to mouse position for interactivity
        if (mouseRef.current.x && mouseRef.current.y) {
          const dx = mouseRef.current.x - metaball.x;
          const dy = mouseRef.current.y - metaball.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Different ball types react differently to mouse
          let mouseInfluence = 0;
          if (metaball.type === 'small') mouseInfluence = 0.005;
          else if (metaball.type === 'medium') mouseInfluence = 0.01;
          else mouseInfluence = 0.015;
          
          if (distance > 0) {
            metaball.vx += (dx / distance) * mouseInfluence;
            metaball.vy += (dy / distance) * mouseInfluence;
          }
        }
        
        // Adjust velocity based on scroll position - creates parallax effect
        metaball.vy += scrollYRef.current * 0.0002 * (metaball.type === 'small' ? 0.5 : 
                                                      metaball.type === 'medium' ? 1 : 1.5);
        
        // Apply velocity with damping (strong damping for smoother movement)
        metaball.vx *= 0.97;
        metaball.vy *= 0.97;
        
        // Update position
        metaball.x += metaball.vx;
        metaball.y += metaball.vy;
        
        // Bounce off edges with slight randomization to avoid patterns
        if (metaball.x < metaball.r || metaball.x > canvas.width - metaball.r) {
          metaball.vx *= -0.9; // Lose some energy on bounce
          metaball.vx += (Math.random() - 0.5) * 0.2; // Add slight randomness
          metaball.x = Math.max(metaball.r, Math.min(canvas.width - metaball.r, metaball.x));
        }
        if (metaball.y < metaball.r || metaball.y > canvas.height - metaball.r) {
          metaball.vy *= -0.9; // Lose some energy on bounce
          metaball.vy += (Math.random() - 0.5) * 0.2; // Add slight randomness
          metaball.y = Math.max(metaball.r, Math.min(canvas.height - metaball.r, metaball.y));
        }
        
        // Occasionally add a tiny random movement to keep things interesting
        if (Math.random() < 0.01) {
          metaball.vx += (Math.random() - 0.5) * 0.1;
          metaball.vy += (Math.random() - 0.5) * 0.1;
        }
      }
      
      // Send data to GPU
      const dataToSendToGPU = new Float32Array(3 * numBalls);
      for (let i = 0; i < numBalls; i++) {
        const baseIndex = 3 * i;
        const mb = metaballsRef.current[i];
        dataToSendToGPU[baseIndex + 0] = mb.x;
        dataToSendToGPU[baseIndex + 1] = mb.y;
        dataToSendToGPU[baseIndex + 2] = mb.r;
      }
      
      gl.uniform3fv(metaballsHandle, dataToSendToGPU);
      
      // Draw
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      
      // Request next frame
      animationRef.current = requestAnimationFrame(loop);
    };
    
    // Start animation
    loop();
    
    // Update mouse position with throttling for better performance
    let mouseTimeout;
    const handleMouseMove = (e) => {
      if (!mouseTimeout) {
        mouseTimeout = setTimeout(() => {
          const rect = canvas.getBoundingClientRect();
          const scaleX = canvas.width / rect.width;
          const scaleY = canvas.height / rect.height;
          
          mouseRef.current = {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
          };
          mouseTimeout = null;
        }, 16); // approx 60fps
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Clean up
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(mouseTimeout);
    };
  }, [numBalls, isDarkMode, opacity]);
  
  return (
    <div className="metaballs-container">
      <canvas ref={canvasRef} className="metaballs-canvas" />
    </div>
  );
};

export default MetaballsBackground; 