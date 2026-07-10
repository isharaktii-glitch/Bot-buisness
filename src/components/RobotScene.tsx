"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Float } from "@react-three/drei";
import RobotModel from "./RobotModel";
import { Suspense } from "react";

export default function RobotScene() {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0.5, 4.5], fov: 45 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[3, 5, 3]} intensity={1.2} />
          <pointLight position={[-3, 2, -3]} color="#00d9a3" intensity={1.5} />
          <pointLight position={[3, -2, 3]} color="#00a8ff" intensity={1} />

          <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
            <RobotModel />
          </Float>

          <Environment preset="city" />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={1.5}
            minPolarAngle={Math.PI / 2.5}
            maxPolarAngle={Math.PI / 1.8}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
