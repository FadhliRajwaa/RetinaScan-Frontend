import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';

// Komponen testimonial 3D yang berputar dan responsif terhadap hover
export default function RotatingTestimonial({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  width = 4,
  height = 5,
  depth = 0.1,
  quote = "Testimonial text goes here",
  name = "User Name",
  title = "User Title",
  imageUrl = "",
  delayFactor = 0 // Untuk staggering efek
}) {
  const { isDarkMode } = useTheme();
  const testimonialRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  // Animasi pergerakan testimonial
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() + delayFactor * 3;
    
    // Bergerak naik-turun dengan lambat
    testimonialRef.current.position.y = position[1] + Math.sin(t * 0.2) * 0.1;
    
    // Rotasi untuk kesan 3D
    if (!hovered) {
      testimonialRef.current.rotation.y = rotation[1] + Math.sin(t * 0.15) * 0.1;
    } else {
      // Saat hover, mengarah ke depan
      testimonialRef.current.rotation.y = THREE.MathUtils.lerp(
        testimonialRef.current.rotation.y,
        rotation[1],
        0.1
      );
    }
    
    // Efek hover
    if (hovered) {
      testimonialRef.current.scale.lerp(new THREE.Vector3(1.05, 1.05, 1.05), 0.1);
    } else {
      testimonialRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
    }
  });

  // Warna berdasarkan tema
  const bgColor = isDarkMode ? "#1F2937" : "#FFFFFF";
  const textColor = isDarkMode ? "#FFFFFF" : "#111827";
  const subTextColor = isDarkMode ? "#CBD5E1" : "#4B5563";
  const accentColor = isDarkMode ? "#3B82F6" : "#2563EB";

  return (
    <group
      ref={testimonialRef}
      position={position}
      rotation={rotation}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Kartu testimonial */}
      <mesh>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial
          color={bgColor}
          roughness={0.2}
          metalness={0.1}
          envMapIntensity={isDarkMode ? 0.3 : 0.7}
        />
      </mesh>

      {/* Garis aksen */}
      <mesh position={[0, height * 0.3, 0.01]}>
        <boxGeometry args={[width * 0.8, 0.05, depth * 0.1]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={isDarkMode ? 0.7 : 0.3}
        />
      </mesh>

      {/* Foto profil (simplified) */}
      <mesh position={[0, height * 0.35, depth / 2 + 0.01]}>
        <circleGeometry args={[0.5, 32]} />
        <meshBasicMaterial color={accentColor} />
      </mesh>

      {/* Text Quote */}
      <Text
        position={[0, 0, depth / 2 + 0.01]}
        fontSize={0.18}
        color={textColor}
        anchorX="center"
        anchorY="middle"
        maxWidth={width * 0.75}
        textAlign="center"
      >
        {`"${quote}"`}
      </Text>

      {/* Nama */}
      <Text
        position={[0, -height * 0.35, depth / 2 + 0.01]}
        fontSize={0.22}
        color={textColor}
        anchorX="center"
        anchorY="middle"
      >
        {name}
      </Text>

      {/* Jabatan/Title */}
      <Text
        position={[0, -height * 0.42, depth / 2 + 0.01]}
        fontSize={0.16}
        color={subTextColor}
        anchorX="center"
        anchorY="middle"
      >
        {title}
      </Text>
    </group>
  );
} 