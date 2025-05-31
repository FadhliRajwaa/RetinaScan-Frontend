import React, { Suspense, useRef } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera, useProgress, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';

// Loader untuk memastikan model dan tekstur sudah siap sebelum ditampilkan
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center">
        <div className="w-24 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm mt-2 text-gray-600">{Math.round(progress)}% loaded</p>
      </div>
    </Html>
  );
}

// Komponen untuk menangani efek cahaya dan kamera dinamis
function SceneSetup({ children, cameraPosition = [0, 0, 10], controls = true }) {
  const { isDarkMode } = useTheme();
  const { camera } = useThree();
  const cameraRef = useRef();
  
  // Set camera position berdasarkan prop
  useFrame(() => {
    if (cameraRef.current) {
      camera.position.lerp(
        new THREE.Vector3(...cameraPosition),
        0.05
      );
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
    }
  });

  return (
    <>
      <PerspectiveCamera 
        ref={cameraRef}
        makeDefault 
        position={cameraPosition}
        fov={50}
        near={0.1}
        far={1000}
      />
      
      {/* Ambient light untuk base illumination */}
      <ambientLight intensity={isDarkMode ? 0.3 : 0.6} />
      
      {/* Main directional light */}
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={isDarkMode ? 0.7 : 1} 
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      
      {/* Fill light untuk mengurangi bayangan */}
      <directionalLight 
        position={[-5, 3, -5]} 
        intensity={isDarkMode ? 0.3 : 0.5} 
      />
      
      {/* Environment untuk refleksi */}
      <Environment preset={isDarkMode ? "night" : "sunset"} />
      
      {/* Orbit controls jika dibutuhkan */}
      {controls && <OrbitControls enableZoom={false} enablePan={false} />}
      
      {/* Render children (3D objects) */}
      {children}
    </>
  );
}

// Komponen utama untuk scene 3D
export default function Scene3D({ 
  children, 
  cameraPosition = [0, 0, 10],
  className = "",
  controls = false,
  style = {}
}) {
  return (
    <div className={`${className}`} style={{ ...style }}>
      <Canvas shadows dpr={[1, 2]} gl={{ antialias: true }}>
        <Suspense fallback={<Loader />}>
          <SceneSetup cameraPosition={cameraPosition} controls={controls}>
            {children}
          </SceneSetup>
        </Suspense>
      </Canvas>
    </div>
  );
} 