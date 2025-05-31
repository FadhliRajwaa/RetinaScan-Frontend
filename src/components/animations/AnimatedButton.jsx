import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';

// Komponen tombol 3D yang animatif dan interaktif
export default function AnimatedButton({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  width = 3,
  height = 1,
  depth = 0.3,
  text = "Button",
  onClick = () => {},
  primary = true,
  delayFactor = 0 // Untuk staggering efek
}) {
  const { isDarkMode } = useTheme();
  const buttonRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  
  // Animasi tombol
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() + delayFactor * 2;
    
    // Sedikit efek melayang
    if (!pressed) {
      buttonRef.current.position.y = position[1] + Math.sin(t * 0.8) * 0.05;
    }
    
    // Efek hover
    if (hovered && !pressed) {
      buttonRef.current.scale.lerp(new THREE.Vector3(1.05, 1.05, 1.05), 0.1);
    } else if (pressed) {
      buttonRef.current.scale.lerp(new THREE.Vector3(0.95, 0.95, 0.95), 0.1);
      buttonRef.current.position.y = position[1] - 0.1;
    } else {
      buttonRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
    }
  });

  // Warna berdasarkan tema dan jenis tombol
  const getButtonColors = () => {
    if (primary) {
      return {
        body: isDarkMode ? "#3B82F6" : "#2563EB",
        side: isDarkMode ? "#1D4ED8" : "#1D4ED8",
        text: "#FFFFFF",
        glow: isDarkMode ? "#60A5FA" : "#3B82F6"
      };
    } else {
      return {
        body: isDarkMode ? "#374151" : "#F3F4F6",
        side: isDarkMode ? "#1F2937" : "#E5E7EB",
        text: isDarkMode ? "#FFFFFF" : "#111827",
        glow: isDarkMode ? "#4B5563" : "#D1D5DB"
      };
    }
  };

  const colors = getButtonColors();

  // Handle interactions
  const handlePointerDown = () => {
    setPressed(true);
    // Tambahkan efek suara click jika diinginkan
  };

  const handlePointerUp = () => {
    setPressed(false);
    onClick();
  };

  return (
    <group
      ref={buttonRef}
      position={position}
      rotation={rotation}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => {
        setHovered(false);
        setPressed(false);
      }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      {/* Glow effect */}
      <mesh position={[0, -0.1, -0.1]} scale={[1.05, 1.05, 1]}>
        <boxGeometry args={[width, height, depth * 0.5]} />
        <meshBasicMaterial 
          color={colors.glow} 
          transparent 
          opacity={hovered ? 0.7 : 0.4} 
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Button base/back */}
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial
          color={colors.side}
          roughness={0.3}
          metalness={0.2}
        />
      </mesh>

      {/* Button front face */}
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[width, height, depth * 0.9]} />
        <meshStandardMaterial
          color={colors.body}
          roughness={0.2}
          metalness={0.3}
          emissive={colors.body}
          emissiveIntensity={isDarkMode ? 0.2 : 0.1}
        />
      </mesh>

      {/* Button text */}
      <Text
        position={[0, 0, depth / 2 + 0.01]}
        fontSize={0.25}
        color={colors.text}
        anchorX="center"
        anchorY="middle"
        maxWidth={width * 0.8}
        textAlign="center"
      >
        {text}
      </Text>
    </group>
  );
} 