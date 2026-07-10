"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, Sphere, Cylinder } from "@react-three/drei";
import * as THREE from "three";

export default function RobotModel() {
  const group = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const leftArm = useRef<THREE.Group>(null);
  const rightArm = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (group.current) {
      group.current.position.y = Math.sin(t * 1.2) * 0.15;
      group.current.rotation.y = Math.sin(t * 0.4) * 0.25;
    }
    if (head.current) {
      head.current.rotation.y = Math.sin(t * 0.8) * 0.3;
    }
    if (leftArm.current) {
      leftArm.current.rotation.z = Math.sin(t * 1.5) * 0.15 + 0.3;
    }
    if (rightArm.current) {
      rightArm.current.rotation.z = Math.sin(t * 1.5 + 1) * 0.15 - 0.3;
    }
  });

  return (
    <group ref={group}>
      {/* Head */}
      <group ref={head} position={[0, 1.6, 0]}>
        <RoundedBox args={[0.9, 0.8, 0.8]} radius={0.15} smoothness={4}>
          <meshStandardMaterial color="#e8eef2" metalness={0.6} roughness={0.2} />
        </RoundedBox>
        {/* Eyes */}
        <Sphere args={[0.12, 32, 32]} position={[-0.22, 0.05, 0.42]}>
          <meshStandardMaterial
            color="#00d9a3"
            emissive="#00d9a3"
            emissiveIntensity={2}
          />
        </Sphere>
        <Sphere args={[0.12, 32, 32]} position={[0.22, 0.05, 0.42]}>
          <meshStandardMaterial
            color="#00d9a3"
            emissive="#00d9a3"
            emissiveIntensity={2}
          />
        </Sphere>
        {/* Antenna */}
        <Cylinder args={[0.03, 0.03, 0.4]} position={[0, 0.6, 0]}>
          <meshStandardMaterial color="#888" metalness={0.8} />
        </Cylinder>
        <Sphere args={[0.08, 16, 16]} position={[0, 0.82, 0]}>
          <meshStandardMaterial
            color="#00a8ff"
            emissive="#00a8ff"
            emissiveIntensity={2}
          />
        </Sphere>
      </group>

      {/* Body */}
      <RoundedBox args={[1.2, 1.3, 0.7]} radius={0.15} smoothness={4} position={[0, 0.4, 0]}>
        <meshStandardMaterial color="#c9d2d8" metalness={0.5} roughness={0.3} />
      </RoundedBox>

      {/* Chest light */}
      <Sphere args={[0.15, 32, 32]} position={[0, 0.55, 0.38]}>
        <meshStandardMaterial
          color="#00d9a3"
          emissive="#00d9a3"
          emissiveIntensity={3}
        />
      </Sphere>

      {/* Left Arm */}
      <group ref={leftArm} position={[-0.75, 0.85, 0]}>
        <RoundedBox args={[0.3, 0.9, 0.3]} radius={0.1} position={[0, -0.4, 0]}>
          <meshStandardMaterial color="#e8eef2" metalness={0.6} roughness={0.2} />
        </RoundedBox>
      </group>

      {/* Right Arm */}
      <group ref={rightArm} position={[0.75, 0.85, 0]}>
        <RoundedBox args={[0.3, 0.9, 0.3]} radius={0.1} position={[0, -0.4, 0]}>
          <meshStandardMaterial color="#e8eef2" metalness={0.6} roughness={0.2} />
        </RoundedBox>
      </group>

      {/* Legs */}
      <RoundedBox args={[0.35, 0.7, 0.35]} radius={0.1} position={[-0.3, -0.6, 0]}>
        <meshStandardMaterial color="#c9d2d8" metalness={0.5} roughness={0.3} />
      </RoundedBox>
      <RoundedBox args={[0.35, 0.7, 0.35]} radius={0.1} position={[0.3, -0.6, 0]}>
        <meshStandardMaterial color="#c9d2d8" metalness={0.5} roughness={0.3} />
      </RoundedBox>
    </group>
  );
}
