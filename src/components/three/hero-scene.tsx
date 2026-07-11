"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const COUNT = 2500;
/** Violet/cyan mix ≈ matches the 2D particle field this scene replaces. */
const VIOLET = new THREE.Color("#a78bfa");
const CYAN = new THREE.Color("#22d3ee");

function ParticleField() {
  const tiltRef = useRef<THREE.Group>(null);
  const spinRef = useRef<THREE.Points>(null);
  const pointer = useRef({ x: 0, y: 0 });

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 9;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
      const color = Math.random() < 0.65 ? VIOLET : CYAN;
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    return { positions, colors };
  }, []);

  // The wrapper is pointer-events-none (content stays clickable), so the
  // canvas never receives pointer events — track the mouse on window instead.
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // Slow constant spin on the points; damped tilt toward the cursor on the
  // parent group so the two rotations never fight on the same axis.
  useFrame((_, delta) => {
    if (spinRef.current) spinRef.current.rotation.y += delta * 0.02;
    const tilt = tiltRef.current;
    if (tilt) {
      tilt.rotation.x += (pointer.current.y * 0.1 - tilt.rotation.x) * 0.05;
      tilt.rotation.y += (pointer.current.x * 0.16 - tilt.rotation.y) * 0.05;
    }
  });

  return (
    <group ref={tiltRef}>
      <points ref={spinRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.035}
          vertexColors
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
    </group>
  );
}

/**
 * 3D particle backdrop for the hero. Desktop-only, lazy-loaded (see
 * HeroBackdrop). Renders only while the hero is on screen — the observer
 * flips `frameloop` to "never" the moment it scrolls out of view.
 */
export default function HeroScene({ onReady }: { onReady?: () => void }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [frameloop, setFrameloop] = useState<"always" | "never">("always");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) =>
      setFrameloop(entry.isIntersecting ? "always" : "never"),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 transition-opacity duration-1000"
      style={{ opacity: ready ? 1 : 0 }}
    >
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 6], fov: 60 }}
        frameloop={frameloop}
        onCreated={() => {
          setReady(true);
          onReady?.();
        }}
        fallback={null}
      >
        <fog attach="fog" args={["#05050a", 5, 11]} />
        <ParticleField />
      </Canvas>
    </div>
  );
}
