"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Grid, Environment } from "@react-three/drei";
import * as THREE from "three";
import type { Exercise } from "@/data/exercises";

// ─── Geometry helpers ─────────────────────────────────────────────────────────

function Box({
  pos,
  scale,
  color,
  opacity = 1,
}: {
  pos: [number, number, number];
  scale: [number, number, number];
  color: string;
  opacity?: number;
}) {
  return (
    <mesh position={pos} castShadow>
      <boxGeometry args={scale} />
      <meshStandardMaterial
        color={color}
        transparent={opacity < 1}
        opacity={opacity}
        roughness={0.4}
        metalness={0.2}
      />
    </mesh>
  );
}

function Sphere({
  pos,
  r,
  color,
}: {
  pos: [number, number, number];
  r: number;
  color: string;
}) {
  return (
    <mesh position={pos} castShadow>
      <sphereGeometry args={[r, 12, 12]} />
      <meshStandardMaterial color={color} roughness={0.4} metalness={0.2} />
    </mesh>
  );
}

function Cylinder({
  start,
  end,
  r = 0.045,
  color,
}: {
  start: THREE.Vector3;
  end: THREE.Vector3;
  r?: number;
  color: string;
}) {
  const mid = useMemo(
    () => new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5),
    [start, end]
  );
  const length = useMemo(() => start.distanceTo(end), [start, end]);
  const quat = useMemo(() => {
    const dir = new THREE.Vector3().subVectors(end, start).normalize();
    const up = new THREE.Vector3(0, 1, 0);
    const q = new THREE.Quaternion().setFromUnitVectors(up, dir);
    return q;
  }, [start, end]);

  return (
    <mesh position={mid} quaternion={quat} castShadow>
      <cylinderGeometry args={[r, r, length, 8]} />
      <meshStandardMaterial color={color} roughness={0.4} metalness={0.2} />
    </mesh>
  );
}

// ─── Stick figure joints ──────────────────────────────────────────────────────

type Joints = {
  head: THREE.Vector3;
  neck: THREE.Vector3;
  shoulderL: THREE.Vector3;
  shoulderR: THREE.Vector3;
  elbowL: THREE.Vector3;
  elbowR: THREE.Vector3;
  wristL: THREE.Vector3;
  wristR: THREE.Vector3;
  hip: THREE.Vector3;
  hipL: THREE.Vector3;
  hipR: THREE.Vector3;
  kneeL: THREE.Vector3;
  kneeR: THREE.Vector3;
  ankleL: THREE.Vector3;
  ankleR: THREE.Vector3;
};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
function lerpV3(
  a: [number, number, number],
  b: [number, number, number],
  t: number
): [number, number, number] {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}
function v3(...args: [number, number, number]) {
  return new THREE.Vector3(...args);
}

// ─── Animation poses per exercise type ───────────────────────────────────────

function getPoses(type: string): { poseA: Joints; poseB: Joints } {
  switch (type) {
    case "bench-press":
      return {
        poseA: {
          head: v3(0, 0.9, 0),
          neck: v3(0, 0.78, 0),
          shoulderL: v3(-0.28, 0.7, 0),
          shoulderR: v3(0.28, 0.7, 0),
          elbowL: v3(-0.55, 0.85, 0),
          elbowR: v3(0.55, 0.85, 0),
          wristL: v3(-0.55, 1.2, 0),
          wristR: v3(0.55, 1.2, 0),
          hip: v3(0, 0.35, 0),
          hipL: v3(-0.14, 0.3, 0),
          hipR: v3(0.14, 0.3, 0),
          kneeL: v3(-0.18, 0.0, 0.3),
          kneeR: v3(0.18, 0.0, 0.3),
          ankleL: v3(-0.22, 0.0, 0.6),
          ankleR: v3(0.22, 0.0, 0.6),
        },
        poseB: {
          head: v3(0, 0.9, 0),
          neck: v3(0, 0.78, 0),
          shoulderL: v3(-0.28, 0.7, 0),
          shoulderR: v3(0.28, 0.7, 0),
          elbowL: v3(-0.55, 0.5, 0),
          elbowR: v3(0.55, 0.5, 0),
          wristL: v3(-0.55, 0.72, 0),
          wristR: v3(0.55, 0.72, 0),
          hip: v3(0, 0.35, 0),
          hipL: v3(-0.14, 0.3, 0),
          hipR: v3(0.14, 0.3, 0),
          kneeL: v3(-0.18, 0.0, 0.3),
          kneeR: v3(0.18, 0.0, 0.3),
          ankleL: v3(-0.22, 0.0, 0.6),
          ankleR: v3(0.22, 0.0, 0.6),
        },
      };

    case "push-up":
      return {
        poseA: {
          head: v3(0, 0.65, 0.9),
          neck: v3(0, 0.55, 0.7),
          shoulderL: v3(-0.25, 0.5, 0.5),
          shoulderR: v3(0.25, 0.5, 0.5),
          elbowL: v3(-0.35, 0.5, 0.0),
          elbowR: v3(0.35, 0.5, 0.0),
          wristL: v3(-0.35, 0.08, 0.0),
          wristR: v3(0.35, 0.08, 0.0),
          hip: v3(0, 0.4, -0.2),
          hipL: v3(-0.1, 0.35, -0.2),
          hipR: v3(0.1, 0.35, -0.2),
          kneeL: v3(-0.12, 0.2, -0.6),
          kneeR: v3(0.12, 0.2, -0.6),
          ankleL: v3(-0.14, 0.08, -1.0),
          ankleR: v3(0.14, 0.08, -1.0),
        },
        poseB: {
          head: v3(0, 0.3, 0.9),
          neck: v3(0, 0.22, 0.7),
          shoulderL: v3(-0.25, 0.18, 0.5),
          shoulderR: v3(0.25, 0.18, 0.5),
          elbowL: v3(-0.35, 0.18, 0.18),
          elbowR: v3(0.35, 0.18, 0.18),
          wristL: v3(-0.35, 0.08, 0.0),
          wristR: v3(0.35, 0.08, 0.0),
          hip: v3(0, 0.18, -0.2),
          hipL: v3(-0.1, 0.15, -0.2),
          hipR: v3(0.1, 0.15, -0.2),
          kneeL: v3(-0.12, 0.1, -0.6),
          kneeR: v3(0.12, 0.1, -0.6),
          ankleL: v3(-0.14, 0.08, -1.0),
          ankleR: v3(0.14, 0.08, -1.0),
        },
      };

    case "squat":
    case "sumo-squat":
      const wide = type === "sumo-squat";
      return {
        poseA: {
          head: v3(0, 1.75, 0),
          neck: v3(0, 1.55, 0),
          shoulderL: v3(wide ? -0.35 : -0.28, 1.4, 0),
          shoulderR: v3(wide ? 0.35 : 0.28, 1.4, 0),
          elbowL: v3(wide ? -0.5 : -0.4, 1.15, 0),
          elbowR: v3(wide ? 0.5 : 0.4, 1.15, 0),
          wristL: v3(wide ? -0.5 : -0.4, 0.9, 0.05),
          wristR: v3(wide ? 0.5 : 0.4, 0.9, 0.05),
          hip: v3(0, 0.95, 0),
          hipL: v3(wide ? -0.2 : -0.13, 0.9, 0),
          hipR: v3(wide ? 0.2 : 0.13, 0.9, 0),
          kneeL: v3(wide ? -0.22 : -0.15, 0.5, 0),
          kneeR: v3(wide ? 0.22 : 0.15, 0.5, 0),
          ankleL: v3(wide ? -0.25 : -0.17, 0.0, wide ? 0.1 : 0),
          ankleR: v3(wide ? 0.25 : 0.17, 0.0, wide ? 0.1 : 0),
        },
        poseB: {
          head: v3(0, 1.1, 0.1),
          neck: v3(0, 0.95, 0.05),
          shoulderL: v3(wide ? -0.3 : -0.25, 0.85, 0.05),
          shoulderR: v3(wide ? 0.3 : 0.25, 0.85, 0.05),
          elbowL: v3(wide ? -0.42 : -0.35, 0.65, 0.1),
          elbowR: v3(wide ? 0.42 : 0.35, 0.65, 0.1),
          wristL: v3(wide ? -0.42 : -0.35, 0.45, 0.2),
          wristR: v3(wide ? 0.42 : 0.35, 0.45, 0.2),
          hip: v3(0, 0.5, 0),
          hipL: v3(wide ? -0.22 : -0.15, 0.45, 0),
          hipR: v3(wide ? 0.22 : 0.15, 0.45, 0),
          kneeL: v3(wide ? -0.42 : -0.3, 0.28, wide ? 0.15 : 0.2),
          kneeR: v3(wide ? 0.42 : 0.3, 0.28, wide ? 0.15 : 0.2),
          ankleL: v3(wide ? -0.5 : -0.2, 0.0, wide ? 0.15 : 0.3),
          ankleR: v3(wide ? 0.5 : 0.2, 0.0, wide ? 0.15 : 0.3),
        },
      };

    case "pull-up":
      return {
        poseA: {
          head: v3(0, 1.2, 0),
          neck: v3(0, 1.05, 0),
          shoulderL: v3(-0.3, 0.85, 0),
          shoulderR: v3(0.3, 0.85, 0),
          elbowL: v3(-0.35, 1.2, 0),
          elbowR: v3(0.35, 1.2, 0),
          wristL: v3(-0.38, 1.65, 0),
          wristR: v3(0.38, 1.65, 0),
          hip: v3(0, 0.3, 0),
          hipL: v3(-0.12, 0.25, 0),
          hipR: v3(0.12, 0.25, 0),
          kneeL: v3(-0.14, -0.15, 0),
          kneeR: v3(0.14, -0.15, 0),
          ankleL: v3(-0.15, -0.6, 0),
          ankleR: v3(0.15, -0.6, 0),
        },
        poseB: {
          head: v3(0, 1.55, 0),
          neck: v3(0, 1.42, 0),
          shoulderL: v3(-0.3, 1.3, 0),
          shoulderR: v3(0.3, 1.3, 0),
          elbowL: v3(-0.38, 1.55, 0),
          elbowR: v3(0.38, 1.55, 0),
          wristL: v3(-0.4, 1.68, 0),
          wristR: v3(0.4, 1.68, 0),
          hip: v3(0, 0.65, 0),
          hipL: v3(-0.12, 0.6, 0),
          hipR: v3(0.12, 0.6, 0),
          kneeL: v3(-0.15, 0.2, 0.2),
          kneeR: v3(0.15, 0.2, 0.2),
          ankleL: v3(-0.17, -0.2, 0.1),
          ankleR: v3(0.17, -0.2, 0.1),
        },
      };

    case "overhead-press":
      return {
        poseA: {
          head: v3(0, 1.75, 0),
          neck: v3(0, 1.58, 0),
          shoulderL: v3(-0.28, 1.4, 0),
          shoulderR: v3(0.28, 1.4, 0),
          elbowL: v3(-0.4, 1.35, 0),
          elbowR: v3(0.4, 1.35, 0),
          wristL: v3(-0.38, 1.55, 0),
          wristR: v3(0.38, 1.55, 0),
          hip: v3(0, 0.95, 0),
          hipL: v3(-0.13, 0.88, 0),
          hipR: v3(0.13, 0.88, 0),
          kneeL: v3(-0.15, 0.5, 0),
          kneeR: v3(0.15, 0.5, 0),
          ankleL: v3(-0.17, 0.0, 0),
          ankleR: v3(0.17, 0.0, 0),
        },
        poseB: {
          head: v3(0, 1.75, 0),
          neck: v3(0, 1.58, 0),
          shoulderL: v3(-0.28, 1.4, 0),
          shoulderR: v3(0.28, 1.4, 0),
          elbowL: v3(-0.45, 1.75, 0),
          elbowR: v3(0.45, 1.75, 0),
          wristL: v3(-0.38, 2.1, 0),
          wristR: v3(0.38, 2.1, 0),
          hip: v3(0, 0.95, 0),
          hipL: v3(-0.13, 0.88, 0),
          hipR: v3(0.13, 0.88, 0),
          kneeL: v3(-0.15, 0.5, 0),
          kneeR: v3(0.15, 0.5, 0),
          ankleL: v3(-0.17, 0.0, 0),
          ankleR: v3(0.17, 0.0, 0),
        },
      };

    case "lateral-raise":
      return {
        poseA: {
          head: v3(0, 1.75, 0),
          neck: v3(0, 1.58, 0),
          shoulderL: v3(-0.28, 1.4, 0),
          shoulderR: v3(0.28, 1.4, 0),
          elbowL: v3(-0.35, 1.2, 0),
          elbowR: v3(0.35, 1.2, 0),
          wristL: v3(-0.38, 0.98, 0),
          wristR: v3(0.38, 0.98, 0),
          hip: v3(0, 0.95, 0),
          hipL: v3(-0.13, 0.88, 0),
          hipR: v3(0.13, 0.88, 0),
          kneeL: v3(-0.15, 0.5, 0),
          kneeR: v3(0.15, 0.5, 0),
          ankleL: v3(-0.17, 0.0, 0),
          ankleR: v3(0.17, 0.0, 0),
        },
        poseB: {
          head: v3(0, 1.75, 0),
          neck: v3(0, 1.58, 0),
          shoulderL: v3(-0.28, 1.4, 0),
          shoulderR: v3(0.28, 1.4, 0),
          elbowL: v3(-0.7, 1.4, 0),
          elbowR: v3(0.7, 1.4, 0),
          wristL: v3(-1.0, 1.38, 0),
          wristR: v3(1.0, 1.38, 0),
          hip: v3(0, 0.95, 0),
          hipL: v3(-0.13, 0.88, 0),
          hipR: v3(0.13, 0.88, 0),
          kneeL: v3(-0.15, 0.5, 0),
          kneeR: v3(0.15, 0.5, 0),
          ankleL: v3(-0.17, 0.0, 0),
          ankleR: v3(0.17, 0.0, 0),
        },
      };

    case "barbell-curl":
    case "dumbbell-curl":
    case "hammer-curl":
      return {
        poseA: {
          head: v3(0, 1.75, 0),
          neck: v3(0, 1.58, 0),
          shoulderL: v3(-0.28, 1.4, 0),
          shoulderR: v3(0.28, 1.4, 0),
          elbowL: v3(-0.32, 1.1, 0),
          elbowR: v3(0.32, 1.1, 0),
          wristL: v3(-0.35, 0.82, 0),
          wristR: v3(0.35, 0.82, 0),
          hip: v3(0, 0.95, 0),
          hipL: v3(-0.13, 0.88, 0),
          hipR: v3(0.13, 0.88, 0),
          kneeL: v3(-0.15, 0.5, 0),
          kneeR: v3(0.15, 0.5, 0),
          ankleL: v3(-0.17, 0.0, 0),
          ankleR: v3(0.17, 0.0, 0),
        },
        poseB: {
          head: v3(0, 1.75, 0),
          neck: v3(0, 1.58, 0),
          shoulderL: v3(-0.28, 1.4, 0),
          shoulderR: v3(0.28, 1.4, 0),
          elbowL: v3(-0.3, 1.12, 0),
          elbowR: v3(0.3, 1.12, 0),
          wristL: v3(-0.28, 1.52, 0.1),
          wristR: v3(0.28, 1.52, 0.1),
          hip: v3(0, 0.95, 0),
          hipL: v3(-0.13, 0.88, 0),
          hipR: v3(0.13, 0.88, 0),
          kneeL: v3(-0.15, 0.5, 0),
          kneeR: v3(0.15, 0.5, 0),
          ankleL: v3(-0.17, 0.0, 0),
          ankleR: v3(0.17, 0.0, 0),
        },
      };

    case "dips":
      return {
        poseA: {
          head: v3(0, 1.4, 0),
          neck: v3(0, 1.25, 0),
          shoulderL: v3(-0.28, 1.1, 0),
          shoulderR: v3(0.28, 1.1, 0),
          elbowL: v3(-0.38, 0.78, 0),
          elbowR: v3(0.38, 0.78, 0),
          wristL: v3(-0.38, 0.42, 0),
          wristR: v3(0.38, 0.42, 0),
          hip: v3(0, 0.72, 0),
          hipL: v3(-0.12, 0.65, 0),
          hipR: v3(0.12, 0.65, 0),
          kneeL: v3(-0.14, 0.28, 0.1),
          kneeR: v3(0.14, 0.28, 0.1),
          ankleL: v3(-0.15, -0.1, 0.1),
          ankleR: v3(0.15, -0.1, 0.1),
        },
        poseB: {
          head: v3(0, 1.05, 0),
          neck: v3(0, 0.9, 0),
          shoulderL: v3(-0.28, 0.75, 0),
          shoulderR: v3(0.28, 0.75, 0),
          elbowL: v3(-0.38, 0.42, 0),
          elbowR: v3(0.38, 0.42, 0),
          wristL: v3(-0.38, 0.42, 0),
          wristR: v3(0.38, 0.42, 0),
          hip: v3(0, 0.38, 0),
          hipL: v3(-0.12, 0.32, 0),
          hipR: v3(0.12, 0.32, 0),
          kneeL: v3(-0.14, 0.02, 0.18),
          kneeR: v3(0.14, 0.02, 0.18),
          ankleL: v3(-0.15, -0.3, 0.1),
          ankleR: v3(0.15, -0.3, 0.1),
        },
      };

    case "crunch":
    case "leg-raise":
      return {
        poseA: {
          head: v3(0, 0.15, 0.9),
          neck: v3(0, 0.12, 0.72),
          shoulderL: v3(-0.25, 0.1, 0.5),
          shoulderR: v3(0.25, 0.1, 0.5),
          elbowL: v3(-0.4, 0.1, 0.3),
          elbowR: v3(0.4, 0.1, 0.3),
          wristL: v3(-0.4, 0.1, 0.05),
          wristR: v3(0.4, 0.1, 0.05),
          hip: v3(0, 0.08, -0.15),
          hipL: v3(-0.12, 0.06, -0.15),
          hipR: v3(0.12, 0.06, -0.15),
          kneeL: v3(-0.14, 0.1, -0.5),
          kneeR: v3(0.14, 0.1, -0.5),
          ankleL: v3(type === "leg-raise" ? -0.16 : -0.16, 0.08, type === "leg-raise" ? -0.9 : -0.7),
          ankleR: v3(type === "leg-raise" ? 0.16 : 0.16, 0.08, type === "leg-raise" ? -0.9 : -0.7),
        },
        poseB: {
          head: v3(0, 0.45, 0.65),
          neck: v3(0, 0.35, 0.52),
          shoulderL: v3(-0.25, 0.28, 0.35),
          shoulderR: v3(0.25, 0.28, 0.35),
          elbowL: v3(-0.38, 0.18, 0.15),
          elbowR: v3(0.38, 0.18, 0.15),
          wristL: v3(-0.38, 0.1, 0.05),
          wristR: v3(0.38, 0.1, 0.05),
          hip: v3(0, 0.08, -0.15),
          hipL: v3(-0.12, 0.06, -0.15),
          hipR: v3(0.12, 0.06, -0.15),
          kneeL: v3(type === "leg-raise" ? -0.14 : -0.18, type === "leg-raise" ? 0.45 : 0.12, type === "leg-raise" ? -0.35 : -0.42),
          kneeR: v3(type === "leg-raise" ? 0.14 : 0.18, type === "leg-raise" ? 0.45 : 0.12, type === "leg-raise" ? -0.35 : -0.42),
          ankleL: v3(type === "leg-raise" ? -0.16 : -0.16, type === "leg-raise" ? 0.78 : 0.1, type === "leg-raise" ? -0.15 : -0.62),
          ankleR: v3(type === "leg-raise" ? 0.16 : 0.16, type === "leg-raise" ? 0.78 : 0.1, type === "leg-raise" ? -0.15 : -0.62),
        },
      };

    case "lunge":
      return {
        poseA: {
          head: v3(0, 1.75, 0),
          neck: v3(0, 1.58, 0),
          shoulderL: v3(-0.28, 1.4, 0),
          shoulderR: v3(0.28, 1.4, 0),
          elbowL: v3(-0.35, 1.18, 0),
          elbowR: v3(0.35, 1.18, 0),
          wristL: v3(-0.38, 0.95, 0),
          wristR: v3(0.38, 0.95, 0),
          hip: v3(0, 0.95, 0),
          hipL: v3(-0.13, 0.88, 0),
          hipR: v3(0.13, 0.88, 0),
          kneeL: v3(-0.15, 0.5, 0),
          kneeR: v3(0.15, 0.5, 0),
          ankleL: v3(-0.17, 0.0, 0),
          ankleR: v3(0.17, 0.0, 0),
        },
        poseB: {
          head: v3(0, 1.55, 0.3),
          neck: v3(0, 1.4, 0.25),
          shoulderL: v3(-0.28, 1.25, 0.2),
          shoulderR: v3(0.28, 1.25, 0.2),
          elbowL: v3(-0.35, 1.05, 0.15),
          elbowR: v3(0.35, 1.05, 0.15),
          wristL: v3(-0.38, 0.85, 0.1),
          wristR: v3(0.38, 0.85, 0.1),
          hip: v3(0, 0.75, 0),
          hipL: v3(-0.13, 0.68, 0),
          hipR: v3(0.13, 0.68, 0),
          kneeL: v3(-0.2, 0.35, 0.55),
          kneeR: v3(0.15, 0.08, -0.4),
          ankleL: v3(-0.22, 0.0, 0.85),
          ankleR: v3(0.15, 0.0, -0.55),
        },
      };

    case "rdl":
    case "good-morning":
      return {
        poseA: {
          head: v3(0, 1.75, 0),
          neck: v3(0, 1.58, 0),
          shoulderL: v3(-0.28, 1.4, 0),
          shoulderR: v3(0.28, 1.4, 0),
          elbowL: v3(-0.35, 1.18, 0),
          elbowR: v3(0.35, 1.18, 0),
          wristL: v3(-0.32, 0.88, 0.1),
          wristR: v3(0.32, 0.88, 0.1),
          hip: v3(0, 0.95, 0),
          hipL: v3(-0.13, 0.88, 0),
          hipR: v3(0.13, 0.88, 0),
          kneeL: v3(-0.15, 0.5, 0),
          kneeR: v3(0.15, 0.5, 0),
          ankleL: v3(-0.17, 0.0, 0),
          ankleR: v3(0.17, 0.0, 0),
        },
        poseB: {
          head: v3(0, 1.0, 0.75),
          neck: v3(0, 0.88, 0.6),
          shoulderL: v3(-0.28, 0.8, 0.5),
          shoulderR: v3(0.28, 0.8, 0.5),
          elbowL: v3(-0.32, 0.65, 0.32),
          elbowR: v3(0.32, 0.65, 0.32),
          wristL: v3(-0.3, 0.5, 0.15),
          wristR: v3(0.3, 0.5, 0.15),
          hip: v3(0, 0.95, -0.15),
          hipL: v3(-0.13, 0.88, -0.15),
          hipR: v3(0.13, 0.88, -0.15),
          kneeL: v3(-0.15, 0.5, 0.05),
          kneeR: v3(0.15, 0.5, 0.05),
          ankleL: v3(-0.17, 0.0, 0),
          ankleR: v3(0.17, 0.0, 0),
        },
      };

    default:
      return {
        poseA: {
          head: v3(0, 1.75, 0),
          neck: v3(0, 1.58, 0),
          shoulderL: v3(-0.28, 1.4, 0),
          shoulderR: v3(0.28, 1.4, 0),
          elbowL: v3(-0.5, 1.2, 0),
          elbowR: v3(0.5, 1.2, 0),
          wristL: v3(-0.55, 0.98, 0),
          wristR: v3(0.55, 0.98, 0),
          hip: v3(0, 0.95, 0),
          hipL: v3(-0.13, 0.88, 0),
          hipR: v3(0.13, 0.88, 0),
          kneeL: v3(-0.15, 0.5, 0),
          kneeR: v3(0.15, 0.5, 0),
          ankleL: v3(-0.17, 0.0, 0),
          ankleR: v3(0.17, 0.0, 0),
        },
        poseB: {
          head: v3(0, 1.75, 0),
          neck: v3(0, 1.58, 0),
          shoulderL: v3(-0.28, 1.4, 0),
          shoulderR: v3(0.28, 1.4, 0),
          elbowL: v3(-0.5, 1.55, 0),
          elbowR: v3(0.5, 1.55, 0),
          wristL: v3(-0.55, 1.78, 0),
          wristR: v3(0.55, 1.78, 0),
          hip: v3(0, 0.95, 0),
          hipL: v3(-0.13, 0.88, 0),
          hipR: v3(0.13, 0.88, 0),
          kneeL: v3(-0.15, 0.5, 0),
          kneeR: v3(0.15, 0.5, 0),
          ankleL: v3(-0.17, 0.0, 0),
          ankleR: v3(0.17, 0.0, 0),
        },
      };
  }
}

// ─── Animated character ───────────────────────────────────────────────────────

const BODY_COLOR = "#D6D6CF";
const JOINT_COLOR = "#CDFF47";
const ACTIVE_MUSCLE_COLOR = "#FF5436";

function lerpJoints(a: Joints, b: Joints, t: number): Joints {
  const keys = Object.keys(a) as (keyof Joints)[];
  const result = {} as Joints;
  for (const k of keys) {
    result[k] = new THREE.Vector3().lerpVectors(a[k], b[k], t);
  }
  return result;
}

function Character({
  animationType,
  speed = 0.5,
  muscleColor = ACTIVE_MUSCLE_COLOR,
}: {
  animationType: string;
  speed?: number;
  muscleColor?: string;
}) {
  const timeRef = useRef(0);
  const jointsRef = useRef<Joints | null>(null);
  const meshRefs = useRef<{ [key: string]: THREE.Mesh | null }>({});

  const { poseA, poseB } = useMemo(
    () => getPoses(animationType),
    [animationType]
  );

  const [joints, setJoints] = React.useState<Joints>(() =>
    lerpJoints(poseA, poseB, 0)
  );

  useFrame((_, delta) => {
    timeRef.current += delta * speed;
    const t = (Math.sin(timeRef.current * Math.PI) + 1) / 2;
    setJoints(lerpJoints(poseA, poseB, t));
  });

  const j = joints;

  const bones: Array<{ start: THREE.Vector3; end: THREE.Vector3; key: string }> =
    [
      { start: j.neck, end: j.head, key: "spine-head" },
      { start: j.hip, end: j.neck, key: "spine" },
      { start: j.shoulderL, end: j.elbowL, key: "upper-arm-l" },
      { start: j.shoulderR, end: j.elbowR, key: "upper-arm-r" },
      { start: j.elbowL, end: j.wristL, key: "lower-arm-l" },
      { start: j.elbowR, end: j.wristR, key: "lower-arm-r" },
      { start: j.shoulderL, end: j.shoulderR, key: "collar" },
      { start: j.hip, end: j.hipL, key: "hip-l" },
      { start: j.hip, end: j.hipR, key: "hip-r" },
      { start: j.hipL, end: j.kneeL, key: "upper-leg-l" },
      { start: j.hipR, end: j.kneeR, key: "upper-leg-r" },
      { start: j.kneeL, end: j.ankleL, key: "lower-leg-l" },
      { start: j.kneeR, end: j.ankleR, key: "lower-leg-r" },
    ];

  return (
    <group>
      {bones.map((b) => (
        <Cylinder
          key={b.key}
          start={b.start}
          end={b.end}
          r={0.048}
          color={BODY_COLOR}
        />
      ))}
      {/* Joints */}
      {[j.head, j.neck, j.shoulderL, j.shoulderR, j.elbowL, j.elbowR, j.wristL, j.wristR, j.hip, j.hipL, j.hipR, j.kneeL, j.kneeR, j.ankleL, j.ankleR].map(
        (pos, i) => (
          <Sphere
            key={i}
            pos={[pos.x, pos.y, pos.z]}
            r={i === 0 ? 0.12 : 0.065}
            color={i === 0 ? BODY_COLOR : JOINT_COLOR}
          />
        )
      )}
    </group>
  );
}

// ─── Floor grid ───────────────────────────────────────────────────────────────

function HoloFloor() {
  return (
    <Grid
      args={[6, 6]}
      position={[0, -0.01, 0]}
      cellColor="#26262B"
      sectionColor="#5E7A12"
      cellThickness={0.5}
      sectionThickness={1}
      fadeDistance={8}
      cellSize={0.5}
      sectionSize={2}
    />
  );
}

// ─── Main exported component ──────────────────────────────────────────────────

import React from "react";

export default function ExerciseViewer3D({
  exercise,
  autoRotate = true,
}: {
  exercise: Exercise;
  autoRotate?: boolean;
}) {
  const isFloorLevel =
    ["bench-press", "push-up", "crunch", "plank", "leg-raise"].includes(
      exercise.animationType
    );

  const camY = isFloorLevel ? 1.2 : 1.4;
  const camZ = isFloorLevel ? 3.5 : 3.2;

  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, camY, camZ], fov: 45 }}
        shadows
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[4, 6, 4]}
          intensity={1.2}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[-3, 3, 0]} color="#CDFF47" intensity={7} />
        <pointLight position={[3, 2, 0]} color="#FFFFFF" intensity={4} />

        <HoloFloor />

        <Character
          animationType={exercise.animationType}
          speed={0.6}
        />

        <OrbitControls
          enablePan={false}
          minDistance={2}
          maxDistance={7}
          autoRotate={autoRotate}
          autoRotateSpeed={0.8}
          minPolarAngle={Math.PI / 8}
          maxPolarAngle={Math.PI / 1.8}
        />
      </Canvas>

    </div>
  );
}
