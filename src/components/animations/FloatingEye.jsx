import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { useTheme } from '../../context/ThemeContext';

// Komponen mata 3D yang bergerak melayang
export default function FloatingEye({ position = [0, 0, 0], scale = 2.5, rotation = [0, 0, 0] }) {
  const { isDarkMode } = useTheme();
  const eyeRef = useRef();
  
  // Animasi pergerakan melayang
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    eyeRef.current.position.y = position[1] + Math.sin(t * 0.5) * 0.5;
    eyeRef.current.rotation.y = rotation[1] + Math.sin(t * 0.3) * 0.2;
    eyeRef.current.rotation.x = rotation[0] + Math.cos(t * 0.2) * 0.1;
  });

  return (
    <group ref={eyeRef} position={position} scale={scale}>
      {/* Menggunakan mesh sederhana sebagai mata */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial 
          color={isDarkMode ? "#3B82F6" : "#2563EB"} 
          emissive={isDarkMode ? "#1E40AF" : "#3B82F6"}
          emissiveIntensity={0.5}
          roughness={0.2} 
          metalness={0.8}
        />
      </mesh>
      
      {/* Pupil */}
      <mesh position={[0, 0, 0.7]}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial 
          color={isDarkMode ? "#111827" : "#1F2937"} 
          roughness={0.1} 
          metalness={0.2}
        />
      </mesh>
      
      {/* Highlight */}
      <mesh position={[0.2, 0.2, 0.9]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
    </group>
  );
} 