import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';

// Komponen kartu 3D yang bergerak melayang dan responsif terhadap hover
export default function FloatingCard({ 
  position = [0, 0, 0], 
  rotation = [0, 0, 0],
  width = 3,
  height = 4,
  depth = 0.2,
  title = "Title",
  color = "#3B82F6",
  icon = null,
  delayFactor = 0 // Untuk staggering efek
}) {
  const { isDarkMode } = useTheme();
  const cardRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  // Animasi pergerakan melayang
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() + delayFactor * 2;
    
    // Kartu bergerak naik-turun dengan lambat
    cardRef.current.position.y = position[1] + Math.sin(t * 0.3) * 0.15;
    
    // Sedikit rotasi untuk kesan 3D
    cardRef.current.rotation.x = rotation[0] + Math.sin(t * 0.2) * 0.03;
    cardRef.current.rotation.y = rotation[1] + Math.cos(t * 0.3) * 0.03;
    
    // Efek hover
    if (hovered) {
      cardRef.current.scale.lerp(new THREE.Vector3(1.05, 1.05, 1.05), 0.1);
    } else {
      cardRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
    }
  });

  // Warna berdasarkan tema
  const cardColor = isDarkMode 
    ? new THREE.Color(color).multiplyScalar(0.7) 
    : new THREE.Color(color).multiplyScalar(1.2);
  
  const textColor = isDarkMode ? "#FFFFFF" : "#111827";
  const backColor = isDarkMode ? "#1F2937" : "#FFFFFF";

  return (
    <group 
      ref={cardRef} 
      position={position} 
      rotation={rotation}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Kartu 3D dengan sudut membulat (menggunakan box biasa) */}
      <mesh>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial 
          color={backColor}
          roughness={0.3}
          metalness={0.1}
          envMapIntensity={isDarkMode ? 0.5 : 1}
        />
      </mesh>

      {/* Indikator warna di bagian atas */}
      <mesh position={[0, height * 0.425, depth/2 + 0.01]}>
        <boxGeometry args={[width, height * 0.15, depth * 0.1]} />
        <meshStandardMaterial 
          color={cardColor} 
          roughness={0.3}
          metalness={0.4}
          emissive={cardColor}
          emissiveIntensity={isDarkMode ? 0.6 : 0.2}
        />
      </mesh>

      {/* Text Judul */}
      <Text
        position={[0, -0.1, depth / 2 + 0.01]}
        fontSize={0.3}
        color={textColor}
        anchorX="center"
        anchorY="middle"
        maxWidth={width * 0.8}
        textAlign="center"
      >
        {title}
      </Text>
    </group>
  );
} 