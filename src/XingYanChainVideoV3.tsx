import React from 'react';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  random,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const CREAM = '#f4f1e9';
const WHITE = '#fffefa';
const INK = '#102a43';
const MUTED = '#587384';
const BLUE = '#1687ff';
const CYAN = '#55dcff';
const GREEN = '#31bf91';
const RED = '#ef4764';
const FONT = 'Microsoft YaHei, Noto Sans CJK SC, PingFang SC, sans-serif';

const clamp = {
  extrapolateLeft: 'clamp' as const,
  extrapolateRight: 'clamp' as const,
};

const ease = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});

const fadeWindow = (frame: number, a: number, b: number, c: number, d: number) =>
  interpolate(frame, [a, b, c, d], [0, 1, 1, 0], clamp);

const mix = (a: number, b: number, t: number) => a + (b - a) * t;

const coreZAt = (frame: number) =>
  interpolate(frame, [0, 270, 430, 600, 850, 930, 1080, 1200], [0, 0, -10, -30, -34, -42, -50, -50], clamp);

const coreYAt = (frame: number) => {
  if (frame < 58) {
    const t = frame / 58;
    return 6.5 - 6.35 * t * t;
  }
  if (frame < 165) {
    const t = frame - 58;
    return 0.15 + Math.abs(Math.sin(t * 0.105)) * 2.35 * Math.exp(-t / 42);
  }
  if (frame < 600) return 0.15;
  if (frame < 690) return mix(0.15, 3.35, ease(frame, 600, 690));
  if (frame < 835) return 3.35;
  if (frame < 915) return mix(3.35, 0.15, ease(frame, 835, 915));
  if (frame < 1110) return 0.15;
  return mix(0.15, 2.35, ease(frame, 1110, 1180));
};

const CameraRig: React.FC<{frame: number}> = ({frame}) => {
  const {camera} = useThree();
  const z = coreZAt(frame);
  const scoreOrbit = Math.sin(ease(frame, 620, 820) * Math.PI) * 1.25;
  const finalPush = ease(frame, 1110, 1190);
  camera.position.set(scoreOrbit, mix(4.3, 3.25, finalPush), z + mix(14.8, 11.8, finalPush));
  camera.lookAt(0, mix(0.15, 0.6, finalPush), z - mix(2.2, 0.2, finalPush));
  camera.updateProjectionMatrix();
  return null;
};

const StudioWorld: React.FC = () => (
  <>
    <color attach="background" args={[CREAM]} />
    <fog attach="fog" args={[CREAM, 18, 58]} />
    <ambientLight intensity={0.9} />
    <hemisphereLight args={['#ffffff', '#8ca0ad', 1.55]} />
    <directionalLight
      castShadow
      color="#fffdf6"
      intensity={3.2}
      position={[7, 13, 10]}
      shadow-mapSize-width={2048}
      shadow-mapSize-height={2048}
      shadow-camera-left={-12}
      shadow-camera-right={12}
      shadow-camera-top={12}
      shadow-camera-bottom={-12}
    />
    <directionalLight color="#72cfff" intensity={1.3} position={[-8, 6, 2]} />
    <mesh receiveShadow position={[0, -1.55, -27]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[36, 78]} />
      <meshStandardMaterial color="#f2f0ea" roughness={0.82} metalness={0.03} />
    </mesh>
    <mesh receiveShadow position={[0, 8, -63]}>
      <planeGeometry args={[42, 28]} />
      <meshStandardMaterial color="#fbfaf5" roughness={1} />
    </mesh>
    <mesh position={[-0.8, -1.48, -27]} receiveShadow>
      <boxGeometry args={[0.075, 0.035, 65]} />
      <meshStandardMaterial color="#7cbfff" metalness={0.35} roughness={0.35} />
    </mesh>
    <mesh position={[0.8, -1.48, -27]} receiveShadow>
      <boxGeometry args={[0.075, 0.035, 65]} />
      <meshStandardMaterial color="#7cbfff" metalness={0.35} roughness={0.35} />
    </mesh>
    {new Array(22).fill(true).map((_, i) => (
      <mesh key={i} position={[0, -1.465, 1 - i * 2.8]} receiveShadow>
        <boxGeometry args={[1.45, 0.018, 0.04]} />
        <meshStandardMaterial color="#a9d8ff" metalness={0.15} roughness={0.5} />
      </mesh>
    ))}
  </>
);

const ImpactWave: React.FC<{frame: number}> = ({frame}) => {
  const t = ease(frame, 56, 105);
  const opacity = interpolate(t, [0, 0.12, 1], [0, 0.78, 0], clamp);
  return (
    <mesh position={[0, -1.44, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[0.6 + t * 8.4, 0.6 + t * 8.4, 1]}>
      <ringGeometry args={[0.78, 0.86, 96]} />
      <meshBasicMaterial color={BLUE} transparent opacity={opacity} side={THREE.DoubleSide} />
    </mesh>
  );
};

const EvidenceCore3D: React.FC<{frame: number}> = ({frame}) => {
  const z = coreZAt(frame);
  const y = coreYAt(frame);
  const roll = -z * 0.85 + frame * 0.018;
  const pulse = 1 + Math.sin(frame * 0.12) * 0.025 + ease(frame, 185, 220) * 0.07;
  return (
    <group position={[0, y, z]} rotation={[roll, frame * 0.008, 0]} scale={pulse}>
      <pointLight color={CYAN} intensity={4.5} distance={5.5} decay={2} />
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[0.84, 64, 64]} />
        <meshPhysicalMaterial
          color="#0c87f5"
          metalness={0.18}
          roughness={0.11}
          clearcoat={1}
          clearcoatRoughness={0.06}
          transmission={0.07}
          thickness={1.2}
          emissive="#003b73"
          emissiveIntensity={0.14 + ease(frame, 175, 220) * 0.18}
        />
      </mesh>
      <mesh position={[-0.27, 0.29, 0.69]} scale={[0.27, 0.13, 0.08]}>
        <sphereGeometry args={[1, 32, 24]} />
        <meshBasicMaterial color="#eaffff" transparent opacity={0.78} />
      </mesh>
      {[0, 1, 2].map((i) => (
        <group key={i} rotation={[Math.PI / 2 + i * 0.2, frame * (0.007 + i * 0.003), i * 0.35]}>
          <mesh>
            <torusGeometry args={[1.1 + i * 0.22, 0.018 + i * 0.004, 12, 96]} />
            <meshPhysicalMaterial color={i === 0 ? CYAN : BLUE} metalness={0.5} roughness={0.22} emissive={BLUE} emissiveIntensity={0.24} />
          </mesh>
          <mesh position={[1.1 + i * 0.22, 0, 0]}>
            <sphereGeometry args={[0.055 + i * 0.01, 20, 20]} />
            <meshBasicMaterial color={CYAN} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

type CardPose = {x: number; z: number; velocity: number; spin: number};

const cardPoses: CardPose[] = new Array(10).fill(true).map((_, i) => {
  const angle = (i / 10) * Math.PI * 2 + 0.22;
  return {
    x: Math.cos(angle) * (2.5 + (i % 3) * 0.5),
    z: Math.sin(angle) * (2.2 + (i % 2) * 0.45),
    velocity: 4.6 + random(`card-v-${i}`) * 1.8,
    spin: (random(`card-s-${i}`) - 0.5) * 2.2,
  };
});

const ResearchCard: React.FC<{frame: number; index: number}> = ({frame, index}) => {
  const pose = cardPoses[index];
  const selected = index === 4;
  const seconds = Math.max(0, frame - 56) / 30;
  const ballisticY = -1.28 + pose.velocity * seconds - 4.4 * seconds * seconds;
  const landedY = Math.max(-1.28, ballisticY);
  const capture = selected ? ease(frame, 118, 202) : 0;
  const slide = selected ? 0 : ease(frame, 185, 270);
  const coreY = coreYAt(frame);
  const x = selected ? mix(pose.x, 0, capture) : pose.x * (1 + slide * 0.65);
  const y = selected ? mix(landedY, coreY, capture) : landedY;
  const z = selected ? mix(pose.z, coreZAt(frame), capture) : pose.z * (1 + slide * 0.45);
  const scale = selected ? 1 - capture * 0.94 : 1;
  const opacity = selected ? 1 - ease(frame, 188, 208) : 1 - ease(frame, 235, 285);
  const airborne = landedY > -1.27;
  return (
    <group
      position={[x, y, z]}
      rotation={[
        airborne ? -0.55 + seconds * (0.9 + index * 0.035) : -Math.PI / 2,
        seconds * pose.spin,
        airborne ? pose.spin * seconds * 0.7 : 0,
      ]}
      scale={scale}
    >
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.72, 1.02, 0.09]} />
        <meshPhysicalMaterial color={selected ? '#e9f7ff' : '#fbfdfc'} roughness={0.26} metalness={0.03} transmission={0.14} transparent opacity={opacity} thickness={0.7} />
      </mesh>
      {[0, 1, 2].map((line) => (
        <mesh key={line} position={[-0.18, 0.25 - line * 0.22, 0.055]}>
          <boxGeometry args={[0.95 - line * 0.14, 0.055, 0.018]} />
          <meshBasicMaterial color={selected ? BLUE : '#b8c8cf'} transparent opacity={opacity * 0.85} />
        </mesh>
      ))}
      <mesh position={[0.59, -0.29, 0.07]}>
        <sphereGeometry args={[0.13, 24, 24]} />
        <meshPhysicalMaterial color={selected ? CYAN : '#c5d2d7'} roughness={0.18} metalness={0.2} transparent opacity={opacity} />
      </mesh>
    </group>
  );
};

const DataCards: React.FC<{frame: number}> = ({frame}) => (
  <group>
    {cardPoses.map((_, i) => <ResearchCard key={i} frame={frame} index={i} />)}
  </group>
);

const conditionData = [
  {z: -2.2, side: -1},
  {z: -3.7, side: 1},
  {z: -5.2, side: -1},
  {z: -6.8, side: 1},
  {z: -8.2, side: -1},
  {z: -9.6, side: 1},
];

const ConditionPod: React.FC<{frame: number; index: number}> = ({frame, index}) => {
  const datum = conditionData[index];
  const trigger = 296 + index * 22;
  const attach = ease(frame, trigger, trigger + 34);
  const merge = ease(frame, 420 + index * 2, 455 + index * 2);
  const zCore = coreZAt(frame);
  const yCore = coreYAt(frame);
  const orbitAngle = frame * 0.035 + index * Math.PI / 3;
  const orbitX = Math.cos(orbitAngle) * 1.2;
  const orbitY = yCore + Math.sin(orbitAngle) * 0.7;
  const orbitZ = zCore + Math.sin(orbitAngle * 0.8) * 0.5;
  const x = mix(datum.side * 2.7, orbitX, attach);
  const y = mix(-1.0, orbitY, attach);
  const z = mix(datum.z, orbitZ, attach);
  const scale = (0.65 + attach * 0.35) * (1 - merge * 0.88);
  return (
    <group position={[x, y, z]} scale={scale} rotation={[frame * 0.012, frame * 0.018, index * 0.4]}>
      <mesh castShadow receiveShadow>
        <dodecahedronGeometry args={[0.38, 0]} />
        <meshPhysicalMaterial color={index % 2 ? '#74d6ff' : '#d9f5ff'} metalness={0.25} roughness={0.16} clearcoat={1} emissive={BLUE} emissiveIntensity={attach * 0.12} />
      </mesh>
      <mesh scale={1.35}>
        <dodecahedronGeometry args={[0.38, 0]} />
        <meshBasicMaterial color={CYAN} wireframe transparent opacity={0.24} />
      </mesh>
    </group>
  );
};

const gateData = [
  {z: -14, trigger: 466},
  {z: -19, trigger: 507},
  {z: -24, trigger: 548},
  {z: -29, trigger: 584},
];

const EvidenceGate3D: React.FC<{frame: number; index: number}> = ({frame, index}) => {
  const {z, trigger} = gateData[index];
  const hit = Math.max(0, frame - trigger);
  const vibration = hit < 32 ? Math.sin(hit * 1.15) * Math.exp(-hit / 8) * 0.13 : 0;
  const active = ease(frame, trigger - 18, trigger + 18) * (1 - ease(frame, trigger + 26, trigger + 72));
  const retire = ease(frame, trigger + 20, trigger + 60);
  const material = (
    <meshPhysicalMaterial
      color={index === 3 ? '#36bfff' : '#65b9f4'}
      metalness={0.46}
      roughness={0.21}
      clearcoat={1}
      emissive={BLUE}
      emissiveIntensity={0.08 + active * 0.62}
    />
  );
  return (
    <group position={[vibration, -retire * 5.6, z]}>
      <mesh castShadow receiveShadow position={[-2.35, 0.6, 0]}>{material}<boxGeometry args={[0.38, 4.25, 0.48]} /></mesh>
      <mesh castShadow receiveShadow position={[2.35, 0.6, 0]}>{material}<boxGeometry args={[0.38, 4.25, 0.48]} /></mesh>
      <mesh castShadow receiveShadow position={[0, 2.55, 0]}>{material}<boxGeometry args={[5.08, 0.38, 0.48]} /></mesh>
      <mesh receiveShadow position={[0, -1.42, 0]}>
        <boxGeometry args={[5.4, 0.16, 0.82]} />
        <meshPhysicalMaterial color="#aedbff" metalness={0.35} roughness={0.25} emissive={BLUE} emissiveIntensity={active * 0.4} />
      </mesh>
      {active > 0 ? <pointLight color={CYAN} intensity={active * 3.5} distance={6} /> : null}
    </group>
  );
};

const EvidenceNode: React.FC<{frame: number; index: number}> = ({frame, index}) => {
  const trigger = gateData[index].trigger;
  const appear = ease(frame, trigger, trigger + 20);
  const angle = frame * 0.04 + index * Math.PI / 2;
  const z = coreZAt(frame);
  const y = coreYAt(frame);
  return (
    <mesh position={[Math.cos(angle) * 1.18, y + Math.sin(angle) * 0.72, z + Math.sin(angle * 0.7) * 0.48]} scale={appear * (1 - ease(frame, 880, 910))}>
      <sphereGeometry args={[0.1, 24, 24]} />
      <meshPhysicalMaterial color={CYAN} emissive={BLUE} emissiveIntensity={1.1} roughness={0.13} />
    </mesh>
  );
};

const EvidenceRoute: React.FC<{frame: number}> = ({frame}) => (
  <>
    {conditionData.map((_, i) => <ConditionPod key={i} frame={frame} index={i} />)}
    {gateData.map((_, i) => <EvidenceGate3D key={i} frame={frame} index={i} />)}
    {gateData.map((_, i) => <EvidenceNode key={i} frame={frame} index={i} />)}
  </>
);

const scores = [74, 82, 88, 79, 71];
const scoreHeights = [2.2, 2.85, 3.65, 2.55, 1.95];

const ScorePillar3D: React.FC<{frame: number; index: number}> = ({frame, index}) => {
  const rise = ease(frame, 596 + index * 8, 670 + index * 8);
  const penalties = [0.72, 0.93, 1, 0.84, 0.64];
  const clampEffect = ease(frame, 720, 830);
  const descend = ease(frame, 842, 908);
  const h = scoreHeights[index] * rise * mix(1, penalties[index], clampEffect) * (1 - descend);
  const x = (index - 2) * 1.9;
  const color = index === 2 ? GREEN : BLUE;
  return (
    <group position={[x, -1.5, -34]}>
      <mesh castShadow receiveShadow position={[0, h / 2, 0]} scale={[1, Math.max(0.001, h / scoreHeights[index]), 1]}>
        <cylinderGeometry args={[0.67, 0.76, scoreHeights[index], 48]} />
        <meshPhysicalMaterial color={color} metalness={0.35} roughness={0.16} clearcoat={1} emissive={color} emissiveIntensity={index === 2 ? 0.14 : 0.04} />
      </mesh>
      <mesh position={[0, h + 0.03, 0]} scale={rise * (1 - descend)} castShadow>
        <cylinderGeometry args={[0.69, 0.69, 0.08, 48]} />
        <meshPhysicalMaterial color={index === 2 ? '#8dffd5' : '#93ddff'} metalness={0.3} roughness={0.1} />
      </mesh>
      {index === 2 && frame > 680 ? <pointLight position={[0, h + 0.5, 0]} color={GREEN} intensity={2.3 * (1 - descend)} distance={4.5} /> : null}
    </group>
  );
};

const RuleClamp3D: React.FC<{frame: number; index: number}> = ({frame, index}) => {
  const down = ease(frame, 708 + index * 38, 742 + index * 38);
  const up = ease(frame, 828 + index * 5, 858 + index * 5);
  const y = mix(10.5, 3.25 - index * 0.75, down) + up * 5.8;
  return (
    <group position={[0, y, -35.7 - index * 0.28]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[11.2, 0.18, 0.78]} />
        <meshPhysicalMaterial color={RED} transparent opacity={0.62 * down * (1 - up)} metalness={0.28} roughness={0.2} transmission={0.1} emissive={RED} emissiveIntensity={0.28} />
      </mesh>
      <pointLight color={RED} intensity={down * (1 - up) * 1.8} distance={5} />
    </group>
  );
};

const ScoringChamber: React.FC<{frame: number}> = ({frame}) => (
  <group>
    <mesh receiveShadow position={[0, -1.42, -34]}>
      <cylinderGeometry args={[6.4, 6.8, 0.22, 64]} />
      <meshPhysicalMaterial color="#dce8eb" roughness={0.35} metalness={0.18} />
    </mesh>
    {scores.map((_, i) => <ScorePillar3D key={i} frame={frame} index={i} />)}
    {[0, 1, 2].map((i) => <RuleClamp3D key={i} frame={frame} index={i} />)}
  </group>
);

const Scanner3D: React.FC<{frame: number}> = ({frame}) => {
  const active = fadeWindow(frame, 875, 910, 985, 1010);
  const retire = ease(frame, 1002, 1052);
  return (
    <group position={[0, -retire * 6.2, -42]} rotation={[0, 0, frame * 0.012]}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} rotation={[0, 0, i * Math.PI / 3]} castShadow>
          <torusGeometry args={[1.9 + i * 0.28, 0.07 - i * 0.012, 20, 100]} />
          <meshPhysicalMaterial color={i === 0 ? CYAN : BLUE} metalness={0.48} roughness={0.12} emissive={BLUE} emissiveIntensity={0.22 + active * 0.42} transparent opacity={0.42 + active * 0.45} />
        </mesh>
      ))}
      <pointLight color={CYAN} intensity={active * 3.2} distance={6} />
    </group>
  );
};

const ResourceCube: React.FC<{frame: number; index: number}> = ({frame, index}) => {
  const trigger = 950 + index * 28;
  const move = ease(frame, trigger, trigger + 46);
  const start = [
    [-3.5, 0.3, -43.5],
    [3.5, 0.6, -44.2],
    [0, -1.0, -45],
  ][index];
  const z = coreZAt(frame);
  const y = coreYAt(frame);
  const angle = index * Math.PI * 2 / 3 + frame * 0.025;
  const target = [Math.cos(angle) * 1.08, y + Math.sin(angle) * 0.7, z];
  const merge = ease(frame, 1045, 1080);
  return (
    <group position={[mix(start[0], target[0], move), mix(start[1], target[1], move), mix(start[2], target[2], move)]} rotation={[frame * 0.025, frame * 0.02, index]} scale={(0.78 + move * 0.22) * (1 - merge * 0.82)}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.62, 0.62, 0.62]} />
        <meshPhysicalMaterial color={index === 0 ? '#83e5c5' : index === 1 ? '#80cfff' : '#b7a8ff'} metalness={0.32} roughness={0.14} clearcoat={1} emissive={index === 0 ? GREEN : BLUE} emissiveIntensity={move * 0.12} />
      </mesh>
    </group>
  );
};

const ReportPage3D: React.FC<{frame: number; index: number}> = ({frame, index}) => {
  const open = ease(frame, 1010 + index * 14, 1065 + index * 14);
  const close = ease(frame, 1110, 1160);
  const spreadX = [-3.75, -1.28, 1.28, 3.75][index];
  const x = mix(0, spreadX, open) * (1 - close);
  const y = mix(coreYAt(frame), 0.65 + (index % 2) * 0.32, open) * (1 - close) + coreYAt(frame) * close;
  const z = mix(coreZAt(frame), -50 + (index % 2) * 0.18, open);
  const scale = (0.12 + open * 0.88) * (1 - close * 0.9);
  return (
    <group position={[x, y, z]} rotation={[0, (index - 1.5) * -0.12 * open, (index - 1.5) * 0.08 * open]} scale={scale}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.25, 3.05, 0.075]} />
        <meshPhysicalMaterial color={WHITE} roughness={0.48} metalness={0.02} clearcoat={0.25} />
      </mesh>
      <mesh position={[-0.52, 1.05, 0.045]}>
        <boxGeometry args={[0.9, 0.09, 0.015]} />
        <meshBasicMaterial color={BLUE} />
      </mesh>
      {[0, 1, 2, 3, 4].map((line) => (
        <mesh key={line} position={[-0.08, 0.55 - line * 0.34, 0.047]}>
          <boxGeometry args={[1.58 - line * 0.12, 0.055, 0.015]} />
          <meshBasicMaterial color={line < 3 ? '#93aebc' : '#c0cdd2'} />
        </mesh>
      ))}
      {index === 3 ? <mesh position={[0, -1.03, 0.05]}><boxGeometry args={[1.68, 0.26, 0.018]} /><meshBasicMaterial color="#ffc6cf" /></mesh> : null}
    </group>
  );
};

const DeliveryStation: React.FC<{frame: number}> = ({frame}) => (
  <>
    <Scanner3D frame={frame} />
    {[0, 1, 2].map((i) => <ResourceCube key={i} frame={frame} index={i} />)}
    {[0, 1, 2, 3].map((i) => <ReportPage3D key={i} frame={frame} index={i} />)}
  </>
);

const World3D: React.FC<{frame: number}> = ({frame}) => (
  <>
    <CameraRig frame={frame} />
    <StudioWorld />
    <ImpactWave frame={frame} />
    <DataCards frame={frame} />
    <EvidenceRoute frame={frame} />
    <ScoringChamber frame={frame} />
    <DeliveryStation frame={frame} />
    <EvidenceCore3D frame={frame} />
  </>
);

const Caption: React.FC<{opacity: number; eyebrow: string; title: string; subtitle?: string; accent?: string}> = ({opacity, eyebrow, title, subtitle, accent = BLUE}) => (
  <div style={{position: 'absolute', left: 92, right: 92, bottom: 48, textAlign: 'center', opacity, fontFamily: FONT, zIndex: 40, textShadow: '0 2px 13px rgba(255,255,255,.98)', padding: '20px 34px 24px', borderRadius: 28, boxSizing: 'border-box', background: 'linear-gradient(180deg, rgba(255,255,255,.18), rgba(250,249,244,.88))', border: '1px solid rgba(57,130,171,.13)', boxShadow: '0 24px 60px rgba(45,72,88,.1)'}}>
    <div style={{fontSize: 18, letterSpacing: 5.2, fontWeight: 900, color: accent}}>{eyebrow}</div>
    <div style={{fontSize: 64, lineHeight: 1.12, marginTop: 11, fontWeight: 950, letterSpacing: 1.1, color: INK}}>{title}</div>
    {subtitle ? <div style={{fontSize: 27, lineHeight: 1.3, marginTop: 11, color: MUTED, letterSpacing: 1, fontWeight: 650}}>{subtitle}</div> : null}
  </div>
);

const Overlay: React.FC<{frame: number}> = ({frame}) => {
  const phase = Math.min(3, Math.floor(frame / 300));
  const labels = ['问题落地', '证据装配', '规则评分', '复核交付'];
  const final = ease(frame, 1112, 1132);
  return (
    <AbsoluteFill style={{fontFamily: FONT, pointerEvents: 'none'}}>
      <div style={{position: 'absolute', left: 58, top: 42, display: 'flex', alignItems: 'center', gap: 15, color: INK, zIndex: 30}}>
        <div style={{width: 26, height: 26, borderRadius: '50%', background: 'radial-gradient(circle at 32% 25%, #fff, #56ddff 24%, #1687ff 60%, #063b73)', boxShadow: '0 8px 20px rgba(22,135,255,.3)'}} />
        <div style={{fontSize: 27, fontWeight: 900, letterSpacing: 3}}>星研链</div>
      </div>
      <div style={{position: 'absolute', right: 58, top: 45, display: 'flex', alignItems: 'center', gap: 11, color: INK, zIndex: 30, padding: '12px 18px', borderRadius: 28, background: 'rgba(255,255,255,.58)', border: '1px solid rgba(55,126,165,.12)'}}>
        {labels.map((label, i) => (
          <React.Fragment key={label}>
            {i ? <div style={{width: 34, height: 1, background: i <= phase ? BLUE : '#b7c4ca'}} /> : null}
            <div style={{display: 'flex', alignItems: 'center', gap: 7, opacity: i === phase ? 1 : 0.44}}>
              <div style={{width: i === phase ? 13 : 8, height: i === phase ? 13 : 8, borderRadius: '50%', background: i <= phase ? BLUE : '#9fb0b9', boxShadow: i === phase ? '0 0 0 7px rgba(22,135,255,.12)' : undefined}} />
              <span style={{fontSize: 16, fontWeight: i === phase ? 850 : 650}}>{label}</span>
            </div>
          </React.Fragment>
        ))}
      </div>
      <Caption opacity={fadeWindow(frame, 8, 14, 160, 174)} eyebrow="WHY THIS DIRECTION?" title="AI 可以一次给你十个选题" subtitle="真正困难的是：这个方向，凭什么比那个好？" />
      <Caption opacity={fadeWindow(frame, 190, 196, 239, 248)} eyebrow="EVIDENCE FIRST" title="星研链，不急着给答案" subtitle="先摆证据，再给结论" />
      <Caption opacity={fadeWindow(frame, 260, 268, 382, 392)} eyebrow="CONDITIONS BEFORE IDEAS" title="先把条件问清楚" subtitle="研究目标 · 时间 · 算力 · 数据 · 风险偏好" />
      <Caption opacity={fadeWindow(frame, 405, 413, 547, 557)} eyebrow="SEARCH · DEDUP · VERIFY · CITE" title="检索、去重、逐条核验" subtitle="汇成带编号的证据链" />
      <Caption opacity={fadeWindow(frame, 574, 582, 688, 698)} eyebrow="FIVE DIRECTIONS · ONE RULER" title="有了证据，才生成五个方向" subtitle="用同一把尺子评分" />
      <Caption opacity={fadeWindow(frame, 712, 722, 842, 854)} eyebrow="HARD RULES, NOT REMINDERS" title="三条硬规则，压住虚高" subtitle="评分可以复算，结论可以追问" accent={RED} />
      <Caption opacity={fadeWindow(frame, 870, 880, 974, 986)} eyebrow="DETERMINISTIC AUDIT" title="程序复核，再匹配实验资源" subtitle="数据集 · 开源代码 · 评测指标" />
      <Caption opacity={fadeWindow(frame, 990, 1000, 1092, 1104)} eyebrow="REPORT WITH BOUNDARIES" title="交付方案，也交代边界" subtitle="证据不足 · 检索边界 · 待确认条件" />
      <div style={{position: 'absolute', left: 0, right: 0, top: 586, textAlign: 'center', opacity: final, transform: `translateY(${(1 - final) * 28}px)`, color: INK, zIndex: 45, textShadow: '0 3px 18px rgba(255,255,255,.96)'}}>
        <div style={{fontSize: 84, fontWeight: 950, letterSpacing: 13}}>星研链</div>
        <div style={{fontSize: 35, fontWeight: 760, marginTop: 18, color: '#285b79', letterSpacing: 7}}>先摆证据，再给结论</div>
        <div style={{fontSize: 17, fontWeight: 850, marginTop: 22, color: MUTED, letterSpacing: 5}}>EVIDENCE-FIRST RESEARCH AGENT</div>
      </div>
    </AbsoluteFill>
  );
};

export const XingYanChainVideoV3: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  return (
    <AbsoluteFill style={{backgroundColor: CREAM}}>
      <Audio src={staticFile('audio/xingyan-voiceover-40s.wav')} volume={1} />
      <ThreeCanvas
        width={width}
        height={height}
        shadows
        orthographic={false}
        camera={{fov: 43, near: 0.1, far: 120, position: [0, 4.3, 14.8]}}
        gl={{antialias: true, preserveDrawingBuffer: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05}}
        style={{backgroundColor: CREAM}}
      >
        <World3D frame={frame} />
      </ThreeCanvas>
      <Overlay frame={frame} />
    </AbsoluteFill>
  );
};
