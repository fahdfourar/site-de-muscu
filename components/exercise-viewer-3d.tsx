"use client";

import React, { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import * as THREE from "three";
import type { Exercise } from "@/data/exercises";

/* ════════════════════════════════════════════════════════════
   KINEFORM — moteur d'animation 3D
   Chaque exercice : posture correcte + matériel (banc, barre,
   haltères, poulie, barres de dips, machines…). Animation claire
   avec temps de pause en haut/bas pour bien lire le mouvement.
   ════════════════════════════════════════════════════════════ */

// ── Palette ──
const LIMB = "#D6D6CF";
const JOINT = "#CDFF47";
const SKIN = "#C4C4BD"; // muscular matte body
const METAL = "#3A3A42";
const BAR = "#5A5A64";
const PLATE = "#15151A";
const PAD = "#23232A";
const FRAME = "#2C2C33";

type V3 = [number, number, number];
type Joints = Record<string, THREE.Vector3>;
type Pose = Record<string, V3>;

function vec(p: V3) {
  return new THREE.Vector3(p[0], p[1], p[2]);
}
function lerpPose(a: Pose, b: Pose, t: number): Joints {
  const out: Joints = {};
  for (const k of Object.keys(a)) {
    const av = a[k];
    const bv = b[k] ?? a[k];
    out[k] = new THREE.Vector3(
      av[0] + (bv[0] - av[0]) * t,
      av[1] + (bv[1] - av[1]) * t,
      av[2] + (bv[2] - av[2]) * t
    );
  }
  return out;
}
function clone(base: Pose, over: Partial<Pose>): Pose {
  return { ...base, ...over };
}
/** point at `d` from `a` toward `b` (extends past b if d>dist) */
function extend(a: THREE.Vector3, b: THREE.Vector3, d: number) {
  const dir = new THREE.Vector3().subVectors(b, a).normalize();
  return new THREE.Vector3().copy(b).addScaledVector(dir, d);
}

/* ── Mesh helpers ─────────────────────────────────────────── */
function Box({ pos, size, color = METAL, rot }: { pos: V3; size: V3; color?: string; rot?: V3 }) {
  return (
    <mesh position={pos} rotation={rot} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.6} metalness={0.3} />
    </mesh>
  );
}
function Ball({ pos, r, color = JOINT }: { pos: THREE.Vector3 | V3; r: number; color?: string }) {
  const p = Array.isArray(pos) ? pos : [pos.x, pos.y, pos.z];
  return (
    <mesh position={p as V3} castShadow>
      <sphereGeometry args={[r, 16, 16]} />
      <meshStandardMaterial color={color} roughness={0.35} metalness={0.2} />
    </mesh>
  );
}
function Tube({ a, b, r = 0.05, color = LIMB }: { a: THREE.Vector3; b: THREE.Vector3; r?: number; color?: string }) {
  const mid = useMemo(() => new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5), [a, b]);
  const len = useMemo(() => a.distanceTo(b), [a, b]);
  const quat = useMemo(() => {
    const dir = new THREE.Vector3().subVectors(b, a).normalize();
    return new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
  }, [a, b]);
  return (
    <mesh position={mid} quaternion={quat} castShadow>
      <cylinderGeometry args={[r, r, Math.max(len, 0.001), 12]} />
      <meshStandardMaterial color={color} roughness={0.45} metalness={0.25} />
    </mesh>
  );
}
/** tapered limb segment — radius `rb` at a, `rt` at b (muscle volume) */
function TaperedTube({ a, b, rt, rb, color = SKIN }: { a: THREE.Vector3; b: THREE.Vector3; rt: number; rb: number; color?: string }) {
  const mid = useMemo(() => new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5), [a, b]);
  const len = useMemo(() => a.distanceTo(b), [a, b]);
  const quat = useMemo(() => {
    const dir = new THREE.Vector3().subVectors(b, a).normalize();
    return new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
  }, [a, b]);
  return (
    <mesh position={mid} quaternion={quat} castShadow receiveShadow>
      <cylinderGeometry args={[rt, rb, Math.max(len, 0.001), 18]} />
      <meshStandardMaterial color={color} roughness={0.62} metalness={0.08} />
    </mesh>
  );
}

/** Muscular humanoid built from tapered volumes — broad chest, narrow waist. */
function MuscularBody({ j }: { j: Joints }) {
  const chest = j.hip.clone().lerp(j.neck, 0.62);
  return (
    <group>
      {/* head + neck */}
      <Ball pos={j.head} r={0.155} color={SKIN} />
      <TaperedTube a={j.neck} b={j.head} rt={0.09} rb={0.085} />
      {/* torso — V taper: wide chest, narrow waist */}
      <TaperedTube a={j.hip} b={chest} rt={0.205} rb={0.155} />
      <TaperedTube a={chest} b={j.neck} rt={0.135} rb={0.205} />
      <Ball pos={j.hip} r={0.155} color={SKIN} />
      <Ball pos={chest} r={0.2} color={SKIN} />
      {/* deltoids */}
      <Ball pos={j.shoulderL} r={0.115} color={SKIN} />
      <Ball pos={j.shoulderR} r={0.115} color={SKIN} />
      {/* upper arms */}
      <TaperedTube a={j.shoulderL} b={j.elbowL} rt={0.072} rb={0.092} />
      <TaperedTube a={j.shoulderR} b={j.elbowR} rt={0.072} rb={0.092} />
      <Ball pos={j.elbowL} r={0.07} color={SKIN} />
      <Ball pos={j.elbowR} r={0.07} color={SKIN} />
      {/* forearms */}
      <TaperedTube a={j.elbowL} b={j.wristL} rt={0.05} rb={0.072} />
      <TaperedTube a={j.elbowR} b={j.wristR} rt={0.05} rb={0.072} />
      <Ball pos={j.wristL} r={0.052} color={SKIN} />
      <Ball pos={j.wristR} r={0.052} color={SKIN} />
      {/* glutes / hips */}
      <Ball pos={j.hipL} r={0.115} color={SKIN} />
      <Ball pos={j.hipR} r={0.115} color={SKIN} />
      {/* thighs */}
      <TaperedTube a={j.hipL} b={j.kneeL} rt={0.095} rb={0.145} />
      <TaperedTube a={j.hipR} b={j.kneeR} rt={0.095} rb={0.145} />
      <Ball pos={j.kneeL} r={0.092} color={SKIN} />
      <Ball pos={j.kneeR} r={0.092} color={SKIN} />
      {/* calves */}
      <TaperedTube a={j.kneeL} b={j.ankleL} rt={0.058} rb={0.098} />
      <TaperedTube a={j.kneeR} b={j.ankleR} rt={0.058} rb={0.098} />
      {/* feet */}
      <Ball pos={j.ankleL} r={0.058} color={SKIN} />
      <Ball pos={j.ankleR} r={0.058} color={SKIN} />
    </group>
  );
}

/** disc (weight plate) centred at p, axis along `axis` */
function Plate({ p, axis, r = 0.17, color = PLATE }: { p: THREE.Vector3; axis: THREE.Vector3; r?: number; color?: string }) {
  const quat = useMemo(
    () => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), axis.clone().normalize()),
    [axis]
  );
  return (
    <mesh position={p} quaternion={quat} castShadow>
      <cylinderGeometry args={[r, r, 0.05, 20]} />
      <meshStandardMaterial color={color} roughness={0.5} metalness={0.4} />
    </mesh>
  );
}

/* ════════════════════════════════════════════════════════════
   POSES — base templates + overrides per exercise
   ════════════════════════════════════════════════════════════ */

const STAND: Pose = {
  head: [0, 1.78, 0], neck: [0, 1.56, 0],
  shoulderL: [-0.3, 1.4, 0], shoulderR: [0.3, 1.4, 0],
  elbowL: [-0.34, 1.12, 0.02], elbowR: [0.34, 1.12, 0.02],
  wristL: [-0.35, 0.86, 0.04], wristR: [0.35, 0.86, 0.04],
  hip: [0, 0.98, 0], hipL: [-0.15, 0.94, 0], hipR: [0.15, 0.94, 0],
  kneeL: [-0.16, 0.5, 0.03], kneeR: [0.16, 0.5, 0.03],
  ankleL: [-0.16, 0.04, 0], ankleR: [0.16, 0.04, 0],
};

// lying on a flat bench, spine along Z (head -Z), feet on floor
const LIE: Pose = {
  head: [0, 0.66, -0.62], neck: [0, 0.66, -0.44],
  shoulderL: [-0.28, 0.66, -0.3], shoulderR: [0.28, 0.66, -0.3],
  elbowL: [-0.42, 0.66, -0.3], elbowR: [0.42, 0.66, -0.3],
  wristL: [-0.34, 0.98, -0.3], wristR: [0.34, 0.98, -0.3],
  hip: [0, 0.64, 0.18], hipL: [-0.15, 0.64, 0.18], hipR: [0.15, 0.64, 0.18],
  kneeL: [-0.16, 0.36, 0.46], kneeR: [0.16, 0.36, 0.46],
  ankleL: [-0.16, 0.04, 0.5], ankleR: [0.16, 0.04, 0.5],
};

// supine on floor (crunch / leg raise)
const FLOOR_BACK: Pose = {
  head: [0, 0.12, -0.7], neck: [0, 0.11, -0.52],
  shoulderL: [-0.26, 0.1, -0.4], shoulderR: [0.26, 0.1, -0.4],
  elbowL: [-0.4, 0.1, -0.25], elbowR: [0.4, 0.1, -0.25],
  wristL: [-0.42, 0.1, -0.05], wristR: [0.42, 0.1, -0.05],
  hip: [0, 0.1, 0.05], hipL: [-0.14, 0.1, 0.05], hipR: [0.14, 0.1, 0.05],
  kneeL: [-0.14, 0.1, 0.5], kneeR: [0.14, 0.1, 0.5],
  ankleL: [-0.15, 0.08, 0.85], ankleR: [0.15, 0.08, 0.85],
};

// hanging from a bar (pull-up)
const HANG: Pose = {
  head: [0, 1.28, 0], neck: [0, 1.12, 0],
  shoulderL: [-0.3, 0.95, 0], shoulderR: [0.3, 0.95, 0],
  elbowL: [-0.34, 1.28, 0], elbowR: [0.34, 1.28, 0],
  wristL: [-0.38, 1.66, 0], wristR: [0.38, 1.66, 0],
  hip: [0, 0.42, 0], hipL: [-0.13, 0.38, 0], hipR: [0.13, 0.38, 0],
  kneeL: [-0.15, -0.02, 0.06], kneeR: [0.15, -0.02, 0.06],
  ankleL: [-0.16, -0.46, 0.04], ankleR: [0.16, -0.46, 0.04],
};

// bent over (row, RDL, good morning) — hinge at hips, flat back
const BENT: Pose = {
  head: [0, 1.18, 0.5], neck: [0, 1.12, 0.34],
  shoulderL: [-0.28, 1.06, 0.26], shoulderR: [0.28, 1.06, 0.26],
  elbowL: [-0.3, 0.82, 0.22], elbowR: [0.3, 0.82, 0.22],
  wristL: [-0.3, 0.56, 0.18], wristR: [0.3, 0.56, 0.18],
  hip: [0, 0.96, -0.04], hipL: [-0.15, 0.94, -0.04], hipR: [0.15, 0.94, -0.04],
  kneeL: [-0.16, 0.5, 0.06], kneeR: [0.16, 0.5, 0.06],
  ankleL: [-0.16, 0.04, 0], ankleR: [0.16, 0.04, 0],
};

// seated upright on a machine (lat pulldown)
const SEAT: Pose = {
  head: [0, 1.5, 0], neck: [0, 1.32, 0],
  shoulderL: [-0.3, 1.16, 0], shoulderR: [0.3, 1.16, 0],
  elbowL: [-0.4, 0.92, 0], elbowR: [0.4, 0.92, 0],
  wristL: [-0.42, 0.68, 0], wristR: [0.42, 0.68, 0],
  hip: [0, 0.62, 0.04], hipL: [-0.15, 0.62, 0.04], hipR: [0.15, 0.62, 0.04],
  kneeL: [-0.16, 0.42, 0.42], kneeR: [0.16, 0.42, 0.42],
  ankleL: [-0.16, 0.04, 0.5], ankleR: [0.16, 0.04, 0.5],
};

// prone on a bench (lying leg curl)
const PRONE: Pose = {
  head: [0, 0.66, 0.66], neck: [0, 0.66, 0.48],
  shoulderL: [-0.26, 0.66, 0.34], shoulderR: [0.26, 0.66, 0.34],
  elbowL: [-0.34, 0.62, 0.5], elbowR: [0.34, 0.62, 0.5],
  wristL: [-0.36, 0.58, 0.66], wristR: [0.36, 0.58, 0.66],
  hip: [0, 0.64, -0.1], hipL: [-0.15, 0.64, -0.1], hipR: [0.15, 0.64, -0.1],
  kneeL: [-0.15, 0.62, -0.42], kneeR: [0.15, 0.62, -0.42],
  ankleL: [-0.15, 0.58, -0.74], ankleR: [0.15, 0.58, -0.74],
};

type Stance = "stand" | "lie" | "floor" | "hang" | "bent" | "seat" | "prone" | "support";

type Def = { stance: Stance; a: Pose; b: Pose; alt?: boolean };

function getDef(type: string): Def {
  switch (type) {
    /* ───── PECTORAUX ───── */
    case "bench-press":
      return {
        stance: "lie",
        a: clone(LIE, { elbowL: [-0.46, 0.78, -0.3], elbowR: [0.46, 0.78, -0.3], wristL: [-0.34, 1.28, -0.3], wristR: [0.34, 1.28, -0.3] }),
        b: clone(LIE, { elbowL: [-0.56, 0.7, -0.34], elbowR: [0.56, 0.7, -0.34], wristL: [-0.34, 0.82, -0.34], wristR: [0.34, 0.82, -0.34] }),
      };
    case "push-up":
      return {
        stance: "support",
        a: PUSHUP_UP, b: PUSHUP_DOWN,
      };
    case "chest-fly":
      return {
        stance: "lie",
        a: clone(LIE, { elbowL: [-0.34, 0.78, -0.3], elbowR: [0.34, 0.78, -0.3], wristL: [-0.3, 1.22, -0.3], wristR: [0.3, 1.22, -0.3] }),
        b: clone(LIE, { elbowL: [-0.74, 0.7, -0.3], elbowR: [0.74, 0.7, -0.3], wristL: [-0.92, 0.78, -0.3], wristR: [0.92, 0.78, -0.3] }),
      };

    /* ───── DOS ───── */
    case "pull-up":
      return {
        stance: "hang",
        a: HANG,
        b: clone(HANG, {
          head: [0, 1.62, 0.04], neck: [0, 1.48, 0.02],
          shoulderL: [-0.3, 1.34, 0], shoulderR: [0.3, 1.34, 0],
          elbowL: [-0.42, 1.5, -0.04], elbowR: [0.42, 1.5, -0.04],
          hip: [0, 0.78, 0.06], hipL: [-0.13, 0.74, 0.06], hipR: [0.13, 0.74, 0.06],
          kneeL: [-0.15, 0.36, 0.12], kneeR: [0.15, 0.36, 0.12],
          ankleL: [-0.16, -0.04, 0.12], ankleR: [0.16, -0.04, 0.12],
        }),
      };
    case "dumbbell-row":
      return {
        stance: "bent",
        a: clone(BENT, {
          shoulderL: [-0.28, 1.04, 0.26], elbowL: [-0.34, 0.74, 0.2], wristL: [-0.34, 0.5, 0.18],
          // right hand plants on bench
          shoulderR: [0.26, 1.06, 0.3], elbowR: [0.3, 0.78, 0.42], wristR: [0.3, 0.62, 0.56],
        }),
        b: clone(BENT, {
          shoulderL: [-0.3, 1.1, 0.24], elbowL: [-0.34, 1.06, 0.04], wristL: [-0.32, 0.9, 0.16],
          shoulderR: [0.26, 1.06, 0.3], elbowR: [0.3, 0.78, 0.42], wristR: [0.3, 0.62, 0.56],
        }),
      };
    case "lat-pulldown":
      return {
        stance: "seat",
        a: clone(SEAT, { elbowL: [-0.5, 1.2, 0], elbowR: [0.5, 1.2, 0], wristL: [-0.5, 1.6, 0], wristR: [0.5, 1.6, 0] }),
        b: clone(SEAT, { elbowL: [-0.46, 0.96, -0.06], elbowR: [0.46, 0.96, -0.06], wristL: [-0.4, 1.22, -0.02], wristR: [0.4, 1.22, -0.02] }),
      };

    /* ───── ÉPAULES ───── */
    case "overhead-press":
      return {
        stance: "stand",
        a: clone(STAND, { elbowL: [-0.44, 1.36, 0.02], elbowR: [0.44, 1.36, 0.02], wristL: [-0.34, 1.5, 0.04], wristR: [0.34, 1.5, 0.04] }),
        b: clone(STAND, { elbowL: [-0.38, 1.78, 0], elbowR: [0.38, 1.78, 0], wristL: [-0.32, 2.12, 0], wristR: [0.32, 2.12, 0] }),
      };
    case "lateral-raise":
      return {
        stance: "stand",
        a: clone(STAND, { elbowL: [-0.34, 1.12, 0.04], elbowR: [0.34, 1.12, 0.04], wristL: [-0.36, 0.88, 0.06], wristR: [0.36, 0.88, 0.06] }),
        b: clone(STAND, { elbowL: [-0.7, 1.4, 0.02], elbowR: [0.7, 1.4, 0.02], wristL: [-0.98, 1.4, 0.02], wristR: [0.98, 1.4, 0.02] }),
      };
    case "face-pull":
      return {
        stance: "stand",
        a: clone(STAND, { elbowL: [-0.42, 1.32, 0.1], elbowR: [0.42, 1.32, 0.1], wristL: [-0.4, 1.42, 0.5], wristR: [0.4, 1.42, 0.5] }),
        b: clone(STAND, { elbowL: [-0.66, 1.5, 0.06], elbowR: [0.66, 1.5, 0.06], wristL: [-0.5, 1.62, 0.06], wristR: [0.5, 1.62, 0.06] }),
      };

    /* ───── BICEPS — 3 mouvements DISTINCTS ───── */
    case "barbell-curl":
      // both hands together on a straight bar, supinated
      return {
        stance: "stand",
        a: clone(STAND, { elbowL: [-0.3, 1.1, 0.06], elbowR: [0.3, 1.1, 0.06], wristL: [-0.22, 0.84, 0.22], wristR: [0.22, 0.84, 0.22] }),
        b: clone(STAND, { elbowL: [-0.28, 1.08, 0.08], elbowR: [0.28, 1.08, 0.08], wristL: [-0.22, 1.42, 0.18], wristR: [0.22, 1.42, 0.18] }),
      };
    case "dumbbell-curl":
      // alternating dumbbells, supinated
      return {
        stance: "stand",
        alt: true,
        a: clone(STAND, { elbowL: [-0.32, 1.1, 0.05], elbowR: [0.32, 1.1, 0.05], wristL: [-0.33, 0.84, 0.08], wristR: [0.33, 0.84, 0.08] }),
        b: clone(STAND, { elbowL: [-0.3, 1.08, 0.07], elbowR: [0.3, 1.08, 0.07], wristL: [-0.28, 1.46, 0.14], wristR: [0.28, 1.46, 0.14] }),
      };
    case "hammer-curl":
      // neutral grip, both arms together, dumbbells vertical
      return {
        stance: "stand",
        a: clone(STAND, { elbowL: [-0.33, 1.1, 0.05], elbowR: [0.33, 1.1, 0.05], wristL: [-0.34, 0.84, 0.08], wristR: [0.34, 0.84, 0.08] }),
        b: clone(STAND, { elbowL: [-0.32, 1.06, 0.06], elbowR: [0.32, 1.06, 0.06], wristL: [-0.32, 1.42, 0.12], wristR: [0.32, 1.42, 0.12] }),
      };

    /* ───── TRICEPS ───── */
    case "dips":
      return { stance: "support", a: DIP_UP, b: DIP_DOWN };
    case "tricep-pushdown":
      return {
        stance: "stand",
        a: clone(STAND, { elbowL: [-0.26, 1.12, 0.08], elbowR: [0.26, 1.12, 0.08], wristL: [-0.24, 1.3, 0.12], wristR: [0.24, 1.3, 0.12] }),
        b: clone(STAND, { elbowL: [-0.26, 1.12, 0.06], elbowR: [0.26, 1.12, 0.06], wristL: [-0.26, 0.86, 0.1], wristR: [0.26, 0.86, 0.1] }),
      };
    case "overhead-tricep":
      // both hands hold one dumbbell behind head
      return {
        stance: "stand",
        a: clone(STAND, { elbowL: [-0.26, 1.62, 0.02], elbowR: [0.26, 1.62, 0.02], wristL: [-0.18, 1.9, -0.06], wristR: [0.18, 1.9, -0.06] }),
        b: clone(STAND, { elbowL: [-0.28, 1.6, 0.02], elbowR: [0.28, 1.6, 0.02], wristL: [-0.2, 1.46, -0.32], wristR: [0.2, 1.46, -0.32] }),
      };

    /* ───── QUADRICEPS ───── */
    case "squat":
      return {
        stance: "stand",
        a: clone(STAND, BACK_BAR_ARMS),
        b: clone(STAND, {
          ...BACK_BAR_ARMS,
          head: [0, 1.4, 0.12], neck: [0, 1.2, 0.08],
          shoulderL: [-0.32, 1.04, 0.06], shoulderR: [0.32, 1.04, 0.06],
          elbowL: [-0.5, 0.96, 0.0], elbowR: [0.5, 0.96, 0.0],
          wristL: [-0.5, 1.12, -0.06], wristR: [0.5, 1.12, -0.06],
          hip: [0, 0.56, -0.02], hipL: [-0.18, 0.54, -0.02], hipR: [0.18, 0.54, -0.02],
          kneeL: [-0.22, 0.3, 0.22], kneeR: [0.22, 0.3, 0.22],
        }),
      };
    case "leg-press":
      return { stance: "seat", a: LEGPRESS_EXT, b: LEGPRESS_FLEX };
    case "lunge":
      return {
        stance: "stand",
        a: STAND,
        b: clone(STAND, {
          head: [0, 1.54, 0.28], neck: [0, 1.34, 0.24],
          shoulderL: [-0.3, 1.18, 0.2], shoulderR: [0.3, 1.18, 0.2],
          elbowL: [-0.34, 0.92, 0.16], elbowR: [0.34, 0.92, 0.16],
          wristL: [-0.34, 0.66, 0.12], wristR: [0.34, 0.66, 0.12],
          hip: [0, 0.78, 0], hipL: [-0.15, 0.76, 0], hipR: [0.15, 0.76, 0],
          kneeL: [-0.2, 0.34, 0.6], kneeR: [0.16, 0.12, -0.44],
          ankleL: [-0.22, 0.04, 0.9], ankleR: [0.16, 0.04, -0.6],
        }),
      };

    /* ───── ISCHIO ───── */
    case "rdl":
    case "good-morning": {
      const back = type === "good-morning";
      return {
        stance: "stand",
        a: back ? clone(STAND, BACK_BAR_ARMS) : clone(STAND, { wristL: [-0.2, 0.86, 0.16], wristR: [0.2, 0.86, 0.16], elbowL: [-0.3, 1.12, 0.06], elbowR: [0.3, 1.12, 0.06] }),
        b: back
          ? clone(STAND, {
              ...BACK_BAR_ARMS,
              head: [0, 1.18, 0.66], neck: [0, 1.12, 0.48],
              shoulderL: [-0.3, 1.04, 0.4], shoulderR: [0.3, 1.04, 0.4],
              elbowL: [-0.48, 1.0, 0.36], elbowR: [0.48, 1.0, 0.36],
              wristL: [-0.5, 1.06, 0.32], wristR: [0.5, 1.06, 0.32],
              hip: [0, 0.96, -0.16], hipL: [-0.15, 0.94, -0.16], hipR: [0.15, 0.94, -0.16],
              kneeL: [-0.16, 0.5, 0.04], kneeR: [0.16, 0.5, 0.04],
            })
          : clone(STAND, {
              head: [0, 1.12, 0.66], neck: [0, 1.06, 0.48],
              shoulderL: [-0.28, 0.96, 0.4], shoulderR: [0.28, 0.96, 0.4],
              elbowL: [-0.3, 0.74, 0.34], elbowR: [0.3, 0.74, 0.34],
              wristL: [-0.2, 0.5, 0.28], wristR: [0.2, 0.5, 0.28],
              hip: [0, 0.96, -0.16], hipL: [-0.15, 0.94, -0.16], hipR: [0.15, 0.94, -0.16],
              kneeL: [-0.16, 0.5, 0.02], kneeR: [0.16, 0.5, 0.02],
            }),
      };
    }
    case "leg-curl":
      return {
        stance: "prone",
        a: PRONE,
        b: clone(PRONE, {
          kneeL: [-0.15, 0.62, -0.38], kneeR: [0.15, 0.62, -0.38],
          ankleL: [-0.15, 1.04, -0.18], ankleR: [0.15, 1.04, -0.18],
        }),
      };

    /* ───── FESSIERS ───── */
    case "hip-thrust":
      return { stance: "lie", a: HIPTHRUST_DOWN, b: HIPTHRUST_UP };
    case "sumo-squat":
      return {
        stance: "stand",
        a: clone(STAND, {
          hipL: [-0.26, 0.94, 0], hipR: [0.26, 0.94, 0],
          kneeL: [-0.34, 0.5, 0.06], kneeR: [0.34, 0.5, 0.06],
          ankleL: [-0.4, 0.04, 0.08], ankleR: [0.4, 0.04, 0.08],
          elbowL: [-0.22, 1.16, 0.12], elbowR: [0.22, 1.16, 0.12],
          wristL: [-0.12, 1.0, 0.16], wristR: [0.12, 1.0, 0.16],
        }),
        b: clone(STAND, {
          hip: [0, 0.62, 0], hipL: [-0.28, 0.6, 0], hipR: [0.28, 0.6, 0],
          kneeL: [-0.42, 0.36, 0.16], kneeR: [0.42, 0.36, 0.16],
          ankleL: [-0.42, 0.04, 0.08], ankleR: [0.42, 0.04, 0.08],
          elbowL: [-0.22, 0.84, 0.12], elbowR: [0.22, 0.84, 0.12],
          wristL: [-0.12, 0.68, 0.16], wristR: [0.12, 0.68, 0.16],
        }),
      };
    case "cable-kickback":
      return {
        stance: "stand",
        a: clone(BENT, {
          kneeR: [0.16, 0.48, 0.08], ankleR: [0.16, 0.06, 0.1],
          hipL: [-0.15, 0.92, -0.04], kneeL: [-0.16, 0.52, 0.12], ankleL: [-0.16, 0.18, 0.34],
        }),
        b: clone(BENT, {
          hipL: [-0.15, 0.92, -0.04], kneeL: [-0.16, 0.66, -0.3], ankleL: [-0.16, 0.5, -0.66],
        }),
      };

    /* ───── ABDOS ───── */
    case "crunch":
      return {
        stance: "floor",
        a: clone(FLOOR_BACK, {
          kneeL: [-0.14, 0.32, 0.34], kneeR: [0.14, 0.32, 0.34],
          ankleL: [-0.15, 0.08, 0.6], ankleR: [0.15, 0.08, 0.6],
          elbowL: [-0.34, 0.2, -0.34], elbowR: [0.34, 0.2, -0.34],
          wristL: [-0.18, 0.22, -0.42], wristR: [0.18, 0.22, -0.42],
        }),
        b: clone(FLOOR_BACK, {
          head: [0, 0.42, -0.5], neck: [0, 0.34, -0.42],
          shoulderL: [-0.26, 0.28, -0.34], shoulderR: [0.26, 0.28, -0.34],
          elbowL: [-0.3, 0.26, -0.2], elbowR: [0.3, 0.26, -0.2],
          wristL: [-0.16, 0.34, -0.34], wristR: [0.16, 0.34, -0.34],
          kneeL: [-0.14, 0.32, 0.34], kneeR: [0.14, 0.32, 0.34],
          ankleL: [-0.15, 0.08, 0.6], ankleR: [0.15, 0.08, 0.6],
        }),
      };
    case "plank":
      return { stance: "support", a: PLANK_POSE, b: PLANK_POSE };
    case "leg-raise":
      return {
        stance: "floor",
        a: clone(FLOOR_BACK, { kneeL: [-0.14, 0.1, 0.5], kneeR: [0.14, 0.1, 0.5], ankleL: [-0.15, 0.1, 0.92], ankleR: [0.15, 0.1, 0.92] }),
        b: clone(FLOOR_BACK, {
          hip: [0, 0.12, 0.05], kneeL: [-0.14, 0.5, 0.16], kneeR: [0.14, 0.5, 0.16],
          ankleL: [-0.15, 0.92, 0.1], ankleR: [0.15, 0.92, 0.1],
        }),
      };

    default:
      return { stance: "stand", a: STAND, b: clone(STAND, { wristL: [-0.35, 1.3, 0.1], wristR: [0.35, 1.3, 0.1] }) };
  }
}

// arms holding a bar across the upper back (squat / good morning)
const BACK_BAR_ARMS: Partial<Pose> = {
  elbowL: [-0.5, 1.18, -0.16], elbowR: [0.5, 1.18, -0.16],
  wristL: [-0.56, 1.34, -0.12], wristR: [0.56, 1.34, -0.12],
};

// push-up keyframes
const PUSHUP_UP: Pose = {
  head: [0, 0.62, 0.92], neck: [0, 0.56, 0.74],
  shoulderL: [-0.26, 0.52, 0.52], shoulderR: [0.26, 0.52, 0.52],
  elbowL: [-0.32, 0.28, 0.5], elbowR: [0.32, 0.28, 0.5],
  wristL: [-0.34, 0.06, 0.52], wristR: [0.34, 0.06, 0.52],
  hip: [0, 0.42, -0.05], hipL: [-0.13, 0.4, -0.05], hipR: [0.13, 0.4, -0.05],
  kneeL: [-0.14, 0.22, -0.6], kneeR: [0.14, 0.22, -0.6],
  ankleL: [-0.15, 0.06, -1.02], ankleR: [0.15, 0.06, -1.02],
};
const PUSHUP_DOWN: Pose = clone(PUSHUP_UP, {
  head: [0, 0.32, 0.96], neck: [0, 0.28, 0.76],
  shoulderL: [-0.26, 0.24, 0.54], shoulderR: [0.26, 0.24, 0.54],
  elbowL: [-0.42, 0.2, 0.32], elbowR: [0.42, 0.2, 0.32],
  hip: [0, 0.2, -0.05], hipL: [-0.13, 0.18, -0.05], hipR: [0.13, 0.18, -0.05],
});

// dips keyframes (upright on bars)
const DIP_UP: Pose = {
  head: [0, 1.46, 0], neck: [0, 1.28, 0],
  shoulderL: [-0.27, 1.12, 0], shoulderR: [0.27, 1.12, 0],
  elbowL: [-0.36, 0.82, -0.02], elbowR: [0.36, 0.82, -0.02],
  wristL: [-0.36, 0.5, 0], wristR: [0.36, 0.5, 0],
  hip: [0, 0.74, 0.04], hipL: [-0.12, 0.7, 0.04], hipR: [0.12, 0.7, 0.04],
  kneeL: [-0.14, 0.34, 0.22], kneeR: [0.14, 0.34, 0.22],
  ankleL: [-0.15, 0.02, 0.16], ankleR: [0.15, 0.02, 0.16],
};
const DIP_DOWN: Pose = clone(DIP_UP, {
  head: [0, 1.12, 0.04], neck: [0, 0.94, 0.03],
  shoulderL: [-0.27, 0.78, 0.02], shoulderR: [0.27, 0.78, 0.02],
  elbowL: [-0.4, 0.5, 0.06], elbowR: [0.4, 0.5, 0.06],
  hip: [0, 0.4, 0.06], hipL: [-0.12, 0.36, 0.06], hipR: [0.12, 0.36, 0.06],
  kneeL: [-0.14, 0.04, 0.28], kneeR: [0.14, 0.04, 0.28],
  ankleL: [-0.15, -0.26, 0.18], ankleR: [0.15, -0.26, 0.18],
});

const PLANK_POSE: Pose = {
  head: [0, 0.5, 0.92], neck: [0, 0.46, 0.74],
  shoulderL: [-0.26, 0.42, 0.54], shoulderR: [0.26, 0.42, 0.54],
  elbowL: [-0.28, 0.12, 0.52], elbowR: [0.28, 0.12, 0.52],
  wristL: [-0.28, 0.1, 0.78], wristR: [0.28, 0.1, 0.78],
  hip: [0, 0.34, -0.1], hipL: [-0.13, 0.33, -0.1], hipR: [0.13, 0.33, -0.1],
  kneeL: [-0.14, 0.2, -0.6], kneeR: [0.14, 0.2, -0.6],
  ankleL: [-0.15, 0.06, -1.02], ankleR: [0.15, 0.06, -1.02],
};

const HIPTHRUST_DOWN: Pose = {
  head: [0, 0.56, -0.66], neck: [0, 0.52, -0.5],
  shoulderL: [-0.27, 0.48, -0.4], shoulderR: [0.27, 0.48, -0.4],
  elbowL: [-0.42, 0.4, -0.36], elbowR: [0.42, 0.4, -0.36],
  wristL: [-0.42, 0.5, -0.42], wristR: [0.42, 0.5, -0.42],
  hip: [0, 0.16, 0.1], hipL: [-0.15, 0.16, 0.1], hipR: [0.15, 0.16, 0.1],
  kneeL: [-0.16, 0.34, 0.38], kneeR: [0.16, 0.34, 0.38],
  ankleL: [-0.16, 0.04, 0.42], ankleR: [0.16, 0.04, 0.42],
};
const HIPTHRUST_UP: Pose = clone(HIPTHRUST_DOWN, {
  hip: [0, 0.5, 0.16], hipL: [-0.15, 0.5, 0.16], hipR: [0.15, 0.5, 0.16],
  kneeL: [-0.16, 0.5, 0.34], kneeR: [0.16, 0.5, 0.34],
});

const LEGPRESS_FLEX: Pose = {
  head: [0, 0.78, -0.66], neck: [0, 0.74, -0.5],
  shoulderL: [-0.27, 0.68, -0.4], shoulderR: [0.27, 0.68, -0.4],
  elbowL: [-0.4, 0.62, -0.34], elbowR: [0.4, 0.62, -0.34],
  wristL: [-0.42, 0.6, -0.18], wristR: [0.42, 0.6, -0.18],
  hip: [0, 0.5, 0.0], hipL: [-0.15, 0.5, 0.0], hipR: [0.15, 0.5, 0.0],
  kneeL: [-0.18, 0.86, 0.38], kneeR: [0.18, 0.86, 0.38],
  ankleL: [-0.2, 0.92, 0.74], ankleR: [0.2, 0.92, 0.74],
};
const LEGPRESS_EXT: Pose = clone(LEGPRESS_FLEX, {
  kneeL: [-0.17, 0.62, 0.5], kneeR: [0.17, 0.62, 0.5],
  ankleL: [-0.18, 0.66, 1.04], ankleR: [0.18, 0.66, 1.04],
});

/* ════════════════════════════════════════════════════════════
   SKELETON — rigid bone lengths so limbs ROTATE (arc) instead of
   stretching. Directions come from the pose interpolation; lengths
   are locked to the canonical body → natural joint rotation.
   ════════════════════════════════════════════════════════════ */
const PARENT_ORDER: [string, string][] = [
  ["hip", "neck"], ["neck", "head"],
  ["neck", "shoulderL"], ["shoulderL", "elbowL"], ["elbowL", "wristL"],
  ["neck", "shoulderR"], ["shoulderR", "elbowR"], ["elbowR", "wristR"],
  ["hip", "hipL"], ["hipL", "kneeL"], ["kneeL", "ankleL"],
  ["hip", "hipR"], ["hipR", "kneeR"], ["kneeR", "ankleR"],
];
const REST_LEN: Record<string, number> = (() => {
  const m: Record<string, number> = {};
  for (const [p, c] of PARENT_ORDER) m[`${p}>${c}`] = vec(STAND[p]).distanceTo(vec(STAND[c]));
  return m;
})();
function constrainBones(J: Joints) {
  for (const [p, c] of PARENT_ORDER) {
    const dir = J[c].clone().sub(J[p]);
    const len = dir.length() || 1e-6;
    dir.multiplyScalar(REST_LEN[`${p}>${c}`] / len);
    J[c] = J[p].clone().add(dir);
  }
  return J;
}

/* ── TIMING — realistic tempo: controlled lift, squeeze, slower lowering ── */
function easeOut(x: number) {
  return 1 - Math.pow(1 - x, 3);
}
function easeIn(x: number) {
  return x * x * x;
}
function repBlend(p: number) {
  if (p < 0.06) return 0;                       // set
  if (p < 0.4) return easeOut((p - 0.06) / 0.34); // concentric (lift) — snappy then decelerate
  if (p < 0.52) return 1;                        // peak squeeze
  if (p < 0.96) return 1 - easeIn((p - 0.52) / 0.44); // eccentric (lower) — slower, controlled
  return 0;                                      // brief reset
}

/* ════════════════════════════════════════════════════════════
   FIGURE + held implements
   ════════════════════════════════════════════════════════════ */
function Figure({ type }: { type: string }) {
  const def = useMemo(() => getDef(type), [type]);
  const t = useRef(0);
  const [joints, setJoints] = useState<Joints>(() => lerpPose(def.a, def.b, 0));

  useFrame((_, dt) => {
    t.current += dt;
    const period = 4.8;
    const p = (t.current % period) / period;
    const m = repBlend(p);

    let jj: Joints;
    if (def.alt) {
      // alternating limbs: right arm offset half a cycle
      const mR = repBlend((p + 0.5) % 1);
      jj = lerpPose(def.a, def.b, m);
      const baseR = lerpPose(def.a, def.b, mR);
      jj.shoulderR = baseR.shoulderR;
      jj.elbowR = baseR.elbowR;
      jj.wristR = baseR.wristR;
    } else {
      jj = lerpPose(def.a, def.b, m);
    }

    // subtle breathing + effort sway through the whole body via the root
    const breathe = Math.sin(t.current * 1.15) * 0.006;
    jj.hip = jj.hip.clone();
    jj.hip.y += breathe;
    jj.hipL = jj.hipL.clone(); jj.hipL.y += breathe;
    jj.hipR = jj.hipR.clone(); jj.hipR.y += breathe;

    constrainBones(jj);
    setJoints(jj);
  });

  const j = joints;

  return (
    <group>
      <MuscularBody j={j} />
      <HeldImplement type={type} j={j} />
    </group>
  );
}

/** Equipment that the athlete holds and which follows the joints. */
function HeldImplement({ type, j }: { type: string; j: Joints }) {
  // BAR across both wrists (press / curl / pulldown / pushdown / rdl)
  const acrossWrists = ["bench-press", "overhead-press", "barbell-curl", "rdl", "lat-pulldown", "tricep-pushdown"];
  const acrossBack = ["squat", "good-morning"];
  const acrossHips = ["hip-thrust"];
  const twoDumbbells = ["chest-fly", "lateral-raise", "dumbbell-curl", "lunge"];
  const twoHammers = ["hammer-curl"];

  if (acrossWrists.includes(type)) {
    const a = extend(j.wristR, j.wristL, 0.16);
    const b = extend(j.wristL, j.wristR, 0.16);
    const axis = new THREE.Vector3().subVectors(b, a).normalize();
    return (
      <group>
        <Tube a={a} b={b} r={0.028} color={BAR} />
        <Plate p={extend(j.wristR, j.wristL, 0.05)} axis={axis} />
        <Plate p={extend(j.wristL, j.wristR, 0.05)} axis={axis} />
        {(type === "lat-pulldown" || type === "tricep-pushdown") && (
          <Tube a={new THREE.Vector3(0, j.wristL.y, j.wristL.z).lerp(j.wristR, 0.5)} b={new THREE.Vector3(0, 2.05, type === "lat-pulldown" ? -0.55 : -0.05)} r={0.008} color="#6A6A72" />
        )}
      </group>
    );
  }
  if (acrossBack.includes(type)) {
    const a = extend(j.shoulderR, j.shoulderL, 0.34);
    const b = extend(j.shoulderL, j.shoulderR, 0.34);
    const axis = new THREE.Vector3().subVectors(b, a).normalize();
    const back = new THREE.Vector3(0, 0, -0.06);
    return (
      <group position={back}>
        <Tube a={a} b={b} r={0.03} color={BAR} />
        <Plate p={extend(j.shoulderR, j.shoulderL, -0.02)} axis={axis} r={0.19} />
        <Plate p={extend(j.shoulderL, j.shoulderR, -0.02)} axis={axis} r={0.19} />
      </group>
    );
  }
  if (acrossHips.includes(type)) {
    const a = extend(j.hipR, j.hipL, 0.28);
    const b = extend(j.hipL, j.hipR, 0.28);
    const axis = new THREE.Vector3().subVectors(b, a).normalize();
    return (
      <group position={[0, 0.12, 0]}>
        <Tube a={a} b={b} r={0.03} color={BAR} />
        <Plate p={extend(j.hipR, j.hipL, -0.02)} axis={axis} r={0.2} />
        <Plate p={extend(j.hipL, j.hipR, -0.02)} axis={axis} r={0.2} />
      </group>
    );
  }
  if (twoDumbbells.includes(type) || twoHammers.includes(type)) {
    const hammer = twoHammers.includes(type);
    return (
      <group>
        <Dumbbell at={j.wristL} hammer={hammer} />
        <Dumbbell at={j.wristR} hammer={hammer} />
      </group>
    );
  }
  if (type === "dumbbell-row") {
    return <Dumbbell at={j.wristL} hammer />;
  }
  if (type === "overhead-tricep") {
    const mid = new THREE.Vector3().addVectors(j.wristL, j.wristR).multiplyScalar(0.5);
    return <Dumbbell at={mid} hammer vertical />;
  }
  if (type === "sumo-squat") {
    const mid = new THREE.Vector3().addVectors(j.wristL, j.wristR).multiplyScalar(0.5);
    return <Dumbbell at={mid} hammer vertical />;
  }
  if (type === "face-pull") {
    const mid = new THREE.Vector3().addVectors(j.wristL, j.wristR).multiplyScalar(0.5);
    return (
      <group>
        <Tube a={j.wristL} b={new THREE.Vector3(0, 1.7, -0.05).lerp(mid, 0.4)} r={0.006} color="#6A6A72" />
        <Tube a={j.wristR} b={new THREE.Vector3(0, 1.7, -0.05).lerp(mid, 0.4)} r={0.006} color="#6A6A72" />
      </group>
    );
  }
  if (type === "cable-kickback") {
    return <Tube a={j.ankleL} b={new THREE.Vector3(0, 0.12, -0.95)} r={0.006} color="#6A6A72" />;
  }
  return null;
}

function Dumbbell({ at, hammer = false, vertical = false }: { at: THREE.Vector3; hammer?: boolean; vertical?: boolean }) {
  // axis: along X normally, along Z for hammer grip, along Y for vertical (overhead)
  const axis = vertical
    ? new THREE.Vector3(0, 1, 0)
    : hammer
    ? new THREE.Vector3(0, 0, 1)
    : new THREE.Vector3(1, 0, 0);
  const e1 = at.clone().addScaledVector(axis, 0.13);
  const e2 = at.clone().addScaledVector(axis, -0.13);
  return (
    <group>
      <Tube a={e1} b={e2} r={0.022} color={BAR} />
      <Plate p={at.clone().addScaledVector(axis, 0.13)} axis={axis} r={0.085} />
      <Plate p={at.clone().addScaledVector(axis, -0.13)} axis={axis} r={0.085} />
    </group>
  );
}

/* ════════════════════════════════════════════════════════════
   STATIC EQUIPMENT (benches, machines, bars)
   ════════════════════════════════════════════════════════════ */
function FlatBench({ z = 0.05, top = 0.56 }: { z?: number; top?: number }) {
  const seatH = 0.12;
  const cy = top - seatH / 2;
  return (
    <group>
      <Box pos={[0, cy, z]} size={[0.62, seatH, 1.5]} color={PAD} />
      {[[-0.24, z - 0.6], [0.24, z - 0.6], [-0.24, z + 0.6], [0.24, z + 0.6]].map(([x, zz], i) => (
        <Box key={i} pos={[x, (top - seatH) / 2, zz]} size={[0.06, top - seatH, 0.06]} color={METAL} />
      ))}
    </group>
  );
}
function FloorMat() {
  return <Box pos={[0, 0.015, 0.1]} size={[1.0, 0.03, 2.0]} color={PAD} />;
}
function PullUpBar() {
  return (
    <group>
      <Box pos={[-0.62, 1.1, 0]} size={[0.06, 2.2, 0.06]} color={METAL} />
      <Box pos={[0.62, 1.1, 0]} size={[0.06, 2.2, 0.06]} color={METAL} />
      <Tube a={vec([-0.62, 1.72, 0])} b={vec([0.62, 1.72, 0])} r={0.025} color={BAR} />
    </group>
  );
}
function DipBars() {
  return (
    <group>
      {[-0.36, 0.36].map((x, i) => (
        <group key={i}>
          <Tube a={vec([x, 0.52, -0.4])} b={vec([x, 0.52, 0.4])} r={0.028} color={BAR} />
          <Box pos={[x, 0.26, -0.36]} size={[0.06, 0.52, 0.06]} color={METAL} />
          <Box pos={[x, 0.26, 0.36]} size={[0.06, 0.52, 0.06]} color={METAL} />
        </group>
      ))}
    </group>
  );
}
function CableTower({ low = false }: { low?: boolean }) {
  const z = -0.85;
  const pulleyY = low ? 0.2 : 2.05;
  return (
    <group>
      <Box pos={[0, 1.1, z]} size={[0.1, 2.2, 0.1]} color={METAL} />
      <Box pos={[0, 0.02, z]} size={[0.7, 0.06, 0.7]} color={FRAME} />
      <mesh position={[0, pulleyY, z + 0.05]}>
        <torusGeometry args={[0.08, 0.025, 12, 24]} />
        <meshStandardMaterial color={JOINT} roughness={0.4} metalness={0.5} />
      </mesh>
      {/* weight stack */}
      <Box pos={[0, 0.5, z - 0.02]} size={[0.34, 0.8, 0.22]} color={PLATE} />
    </group>
  );
}
function MachineSeat({ z = 0.04 }: { z?: number }) {
  return (
    <group>
      <Box pos={[0, 0.5, z]} size={[0.5, 0.1, 0.5]} color={PAD} />
      <Box pos={[0, 0.86, z - 0.28]} size={[0.5, 0.7, 0.1]} color={PAD} />
      <Box pos={[0, 0.25, z]} size={[0.08, 0.5, 0.08]} color={METAL} />
      {/* thigh pad */}
      <Box pos={[0, 0.78, z + 0.34]} size={[0.5, 0.1, 0.14]} color={PAD} />
    </group>
  );
}
function LegPressSled() {
  // angled platform the feet push against
  return (
    <group>
      <Box pos={[0, 0.42, 0]} size={[0.62, 0.12, 0.55]} color={PAD} />
      <Box pos={[0, 0.66, 1.05]} size={[0.7, 0.7, 0.1]} color={METAL} rot={[-0.3, 0, 0]} />
      <Box pos={[0, 0.1, 0.4]} size={[0.5, 0.06, 1.4]} color={FRAME} />
    </group>
  );
}
function LegCurlPad() {
  return (
    <group>
      <Box pos={[0, 0.58, 0]} size={[0.5, 0.12, 1.3]} color={PAD} />
      {/* ankle roller */}
      <Tube a={vec([-0.2, 0.62, -0.78])} b={vec([0.2, 0.62, -0.78])} r={0.07} color={PAD} />
      {[[-0.22, -0.6], [0.22, -0.6], [-0.22, 0.55], [0.22, 0.55]].map(([x, z], i) => (
        <Box key={i} pos={[x, 0.26, z]} size={[0.06, 0.52, 0.06]} color={METAL} />
      ))}
    </group>
  );
}
function HipBench() {
  // bench behind the upper back
  return <Box pos={[0, 0.34, -0.62]} size={[0.7, 0.12, 0.4]} color={PAD} />;
}

function Equipment({ type }: { type: string }) {
  switch (type) {
    case "bench-press":
    case "chest-fly":
      return <FlatBench top={0.56} z={0.05} />;
    case "push-up":
    case "crunch":
    case "leg-raise":
    case "plank":
      return <FloorMat />;
    case "pull-up":
      return <PullUpBar />;
    case "dips":
      return <DipBars />;
    case "dumbbell-row":
      return <FlatBench top={0.5} z={0.5} />;
    case "lat-pulldown":
      return (
        <group>
          <CableTower />
          <MachineSeat />
        </group>
      );
    case "tricep-pushdown":
    case "face-pull":
      return <CableTower />;
    case "cable-kickback":
      return <CableTower low />;
    case "leg-press":
      return <LegPressSled />;
    case "leg-curl":
      return <LegCurlPad />;
    case "hip-thrust":
      return <HipBench />;
    default:
      return null;
  }
}

/* ════════════════════════════════════════════════════════════
   Camera framing per stance
   ════════════════════════════════════════════════════════════ */
function cameraFor(type: string, stance: Stance): { pos: V3; target: V3 } {
  // Frontal-plane moves read best from the FRONT
  const frontal = ["lateral-raise", "face-pull", "pull-up", "sumo-squat"];
  if (frontal.includes(type)) {
    if (type === "pull-up") return { pos: [0.3, 1.1, 3.6], target: [0, 0.95, 0] };
    return { pos: [0.2, 1.2, 3.5], target: [0, 1.2, 0] };
  }
  // Sagittal-plane moves read best from the SIDE (profile)
  const sagittal = [
    "barbell-curl", "dumbbell-curl", "hammer-curl", "tricep-pushdown",
    "overhead-press", "overhead-tricep", "squat", "rdl", "good-morning", "lunge",
  ];
  if (sagittal.includes(type)) return { pos: [3.4, 1.25, 0.9], target: [0, 1.05, 0] };

  switch (stance) {
    case "lie":
      return { pos: [3.0, 1.35, 1.7], target: [0, 0.6, 0] };
    case "floor":
      return { pos: [3.0, 1.1, 1.2], target: [0, 0.3, 0.15] };
    case "support":
      return { pos: [3.0, 1.05, 1.5], target: [0, 0.4, 0.1] };
    case "prone":
      return { pos: [3.0, 1.3, 1.4], target: [0, 0.6, -0.1] };
    case "seat":
      return { pos: [3.0, 1.25, 2.0], target: [0, 0.85, 0] };
    case "bent":
      return { pos: [2.8, 1.2, 2.2], target: [0, 0.85, 0.1] };
    default:
      return { pos: [2.6, 1.2, 2.6], target: [0, 1.0, 0] };
  }
}

/* ════════════════════════════════════════════════════════════
   Error boundary — a 3D error never crashes the page
   ════════════════════════════════════════════════════════════ */
class CanvasBoundary extends React.Component<
  { children: React.ReactNode; color: string },
  { failed: boolean }
> {
  constructor(props: { children: React.ReactNode; color: string }) {
    super(props);
    this.state = { failed: false };
  }
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center">
            <div
              className="w-14 h-14 rounded-2xl mx-auto mb-3"
              style={{ backgroundColor: `${this.props.color}22`, boxShadow: `inset 0 0 0 1px ${this.props.color}55` }}
            />
            <p className="font-mono text-xs text-bone-faint">aperçu 3D indisponible</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

/* ════════════════════════════════════════════════════════════
   MAIN
   ════════════════════════════════════════════════════════════ */
export default function ExerciseViewer3D({
  exercise,
  autoRotate = true,
  accent = "#CDFF47",
}: {
  exercise: Exercise;
  autoRotate?: boolean;
  accent?: string;
}) {
  const def = getDef(exercise.animationType);
  const cam = cameraFor(exercise.animationType, def.stance);

  return (
    <div className="w-full h-full">
      <CanvasBoundary color={accent}>
        <Canvas
          shadows
          dpr={[1, 1.75]}
          camera={{ position: cam.pos, fov: 42 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          style={{ background: "transparent" }}
        >
          <ambientLight intensity={0.45} />
          <directionalLight position={[4, 7, 4]} intensity={1.3} castShadow shadow-mapSize={[1024, 1024]} />
          <pointLight position={[-3, 3, 1]} color="#CDFF47" intensity={6} />
          <pointLight position={[3, 2, 2]} color="#FFFFFF" intensity={3} />

          <Grid
            args={[8, 8]}
            position={[0, 0, 0]}
            cellColor="#26262B"
            sectionColor="#5E7A12"
            cellThickness={0.5}
            sectionThickness={1}
            fadeDistance={11}
            cellSize={0.5}
            sectionSize={2}
            infiniteGrid
          />

          <Equipment type={exercise.animationType} />
          <Figure type={exercise.animationType} />

          <OrbitControls
            makeDefault
            enablePan={false}
            minDistance={2.2}
            maxDistance={8}
            autoRotate={autoRotate}
            autoRotateSpeed={0.7}
            target={cam.target}
            minPolarAngle={Math.PI / 7}
            maxPolarAngle={Math.PI / 1.9}
          />
        </Canvas>
      </CanvasBoundary>
    </div>
  );
}
