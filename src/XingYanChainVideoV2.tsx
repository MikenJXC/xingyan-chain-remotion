import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  random,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const BG = '#f4f1ea';
const PAPER = '#fffefa';
const INK = '#10273d';
const MUTED = '#668092';
const BLUE = '#1687ff';
const CYAN = '#55dcff';
const NAVY = '#06315f';
const RED = '#ef4764';
const GREEN = '#2fbf91';
const FONT = 'Microsoft YaHei, Noto Sans CJK SC, PingFang SC, sans-serif';

const clamp = {
  extrapolateLeft: 'clamp' as const,
  extrapolateRight: 'clamp' as const,
};

const p = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});

const windowOpacity = (frame: number, fadeIn: number, fullIn: number, fullOut: number, fadeOut: number) =>
  interpolate(frame, [fadeIn, fullIn, fullOut, fadeOut], [0, 1, 1, 0], clamp);

const Studio: React.FC<{frame: number}> = ({frame}) => (
  <AbsoluteFill
    style={{
      background:
        'radial-gradient(circle at 50% 36%, #ffffff 0%, #fbfaf6 28%, #f2efe8 61%, #e6e8e7 100%)',
      overflow: 'hidden',
      fontFamily: FONT,
      color: INK,
    }}
  >
    <div
      style={{
        position: 'absolute',
        left: '8%',
        right: '8%',
        top: 120,
        height: 620,
        borderRadius: '48% 48% 18% 18% / 18% 18% 10% 10%',
        background: 'linear-gradient(180deg, rgba(255,255,255,.9), rgba(255,255,255,.18))',
        boxShadow: 'inset 0 -80px 130px rgba(79,107,128,.06), 0 60px 120px rgba(58,75,89,.05)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: -430,
        right: -430,
        bottom: -510,
        height: 980,
        transform: 'perspective(980px) rotateX(66deg)',
        transformOrigin: '50% 0%',
        backgroundImage:
          'linear-gradient(rgba(45,96,129,.055) 1px, transparent 1px), linear-gradient(90deg, rgba(45,96,129,.05) 1px, transparent 1px)',
        backgroundSize: '92px 92px',
        opacity: 0.65,
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: 695,
        width: 1140,
        height: 210,
        transform: 'translateX(-50%)',
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(43,70,91,.12), rgba(43,70,91,0) 67%)',
        filter: 'blur(16px)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.2,
        background: `radial-gradient(circle at ${48 + Math.sin(frame / 170) * 4}% 24%, rgba(255,255,255,.9), transparent 27%)`,
        mixBlendMode: 'screen',
      }}
    />
  </AbsoluteFill>
);

const ContinuityRail: React.FC<{frame: number; opacity?: number}> = ({frame, opacity = 1}) => {
  const ticks = new Array(10).fill(true);
  return (
    <div style={{position: 'absolute', inset: 0, opacity}}>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
        <defs>
          <linearGradient id="rail" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={BLUE} stopOpacity="0" />
            <stop offset="0.25" stopColor={BLUE} stopOpacity="0.25" />
            <stop offset="1" stopColor={BLUE} stopOpacity="0.86" />
          </linearGradient>
        </defs>
        <path d="M960 390 C960 550 960 780 960 1100" stroke="url(#rail)" strokeWidth="7" fill="none" />
        <path d="M937 405 C926 620 900 840 860 1100" stroke="#6387a2" strokeOpacity=".12" strokeWidth="2" fill="none" />
        <path d="M983 405 C994 620 1020 840 1060 1100" stroke="#6387a2" strokeOpacity=".12" strokeWidth="2" fill="none" />
        {ticks.map((_, i) => {
          const y = 430 + ((i * 96 + frame * 5.4) % 650);
          const width = 18 + (y - 420) * 0.09;
          return <line key={i} x1={960 - width} x2={960 + width} y1={y} y2={y} stroke={BLUE} strokeOpacity=".28" strokeWidth="3" />;
        })}
      </svg>
    </div>
  );
};

const ProgressHeader: React.FC<{frame: number}> = ({frame}) => {
  const phase = Math.min(3, Math.floor(frame / 300));
  const labels = ['提出问题', '建立证据', '统一评分', '复核交付'];
  return (
    <div style={{position: 'absolute', left: 64, right: 64, top: 48, height: 58, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: FONT}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 15}}>
        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 30%, #d8fbff, #3bcfff 32%, #0878df 72%, #05417d)',
            boxShadow: '0 8px 20px rgba(22,135,255,.3)',
          }}
        />
        <div style={{fontSize: 24, fontWeight: 850, letterSpacing: 3}}>星研链</div>
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: 13}}>
        {labels.map((label, i) => (
          <React.Fragment key={label}>
            {i > 0 ? <div style={{width: 38, height: 1, background: i <= phase ? '#3aa8ff' : '#bdc8ce'}} /> : null}
            <div style={{display: 'flex', alignItems: 'center', gap: 8, opacity: i === phase ? 1 : 0.48}}>
              <div style={{width: i === phase ? 12 : 8, height: i === phase ? 12 : 8, borderRadius: '50%', background: i <= phase ? BLUE : '#a6b5bd', boxShadow: i === phase ? '0 0 0 7px rgba(22,135,255,.12)' : undefined}} />
              <span style={{fontSize: 14, fontWeight: i === phase ? 800 : 600, letterSpacing: 1}}>{label}</span>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

const HeroCore: React.FC<{frame: number; x: number; y: number; scale: number; glow?: number}> = ({frame, x, y, scale, glow = 1}) => (
  <div style={{position: 'absolute', left: x, top: y + 97 * scale, width: 230 * scale, height: 46 * scale, transform: 'translate(-50%, -50%)', borderRadius: '50%', background: `rgba(17,54,81,${0.17 * glow})`, filter: `blur(${14 * scale}px)`, zIndex: 31}} />
  
);

const CoreBody: React.FC<{frame: number; x: number; y: number; scale: number; glow?: number}> = ({frame, x, y, scale, glow = 1}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: 178,
      height: 178,
      transform: `translate(-50%, -50%) scale(${scale})`,
      transformStyle: 'preserve-3d',
      zIndex: 34,
    }}
  >
    {[0, 1, 2].map((ring) => (
      <div
        key={ring}
        style={{
          position: 'absolute',
          left: 89,
          top: 89,
          width: 226 + ring * 47,
          height: 226 + ring * 47,
          borderRadius: '50%',
          border: `${ring === 0 ? 3 : 2}px solid rgba(22,135,255,${0.45 - ring * 0.1})`,
          transform: `translate(-50%, -50%) rotateX(${64 + ring * 7}deg) rotateZ(${frame * (ring % 2 ? -0.32 : 0.22)}deg)`,
          boxShadow: `0 0 ${22 + ring * 10}px rgba(65,198,255,${0.2 * glow})`,
        }}
      >
        <div style={{position: 'absolute', left: ring % 2 ? '18%' : '68%', top: -7, width: 14, height: 14, borderRadius: '50%', background: CYAN, boxShadow: `0 0 15px ${CYAN}`}} />
      </div>
    ))}
    <div
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '50%',
        background:
          'radial-gradient(circle at 30% 23%, #ffffff 0%, #d6fbff 7%, #61e3ff 19%, #1687ff 48%, #0b5eae 69%, #032a54 91%, #021c39 100%)',
        boxShadow: `inset -22px -26px 34px rgba(0,20,60,.32), inset 18px 18px 32px rgba(255,255,255,.36), 0 27px 44px rgba(7,56,96,.30), 0 0 ${50 * glow}px rgba(22,135,255,.44)`,
      }}
    />
    <div style={{position: 'absolute', left: 35, top: 26, width: 50, height: 25, borderRadius: '50%', background: 'rgba(255,255,255,.72)', filter: 'blur(8px)', transform: 'rotate(-28deg)'}} />
    <div style={{position: 'absolute', right: 26, bottom: 38, width: 38, height: 18, borderRadius: '50%', background: 'rgba(4,38,84,.32)', filter: 'blur(7px)', transform: 'rotate(-25deg)'}} />
  </div>
);

const HeroObject: React.FC<{frame: number}> = ({frame}) => {
  const {fps} = useVideoConfig();
  const intro = spring({fps, frame: frame - 4, config: {damping: 16, stiffness: 82}, durationInFrames: 58});
  const finalMove = p(frame, 1110, 1170);
  const scoringShrink = interpolate(frame, [600, 650, 840, 900], [1, 0.72, 0.72, 1], clamp);
  const y = interpolate(finalMove, [0, 1], [458, 362]);
  const scale = intro * scoringShrink * interpolate(finalMove, [0, 1], [1, 0.78]);
  const glow = 1 + p(frame, 171, 230) * 0.55 + p(frame, 820, 875) * 0.35;
  return (
    <>
      <HeroCore frame={frame} x={960} y={y} scale={scale} glow={glow} />
      <CoreBody frame={frame} x={960} y={y} scale={scale} glow={glow} />
    </>
  );
};

const CausalPulse: React.FC<{frame: number; at: number; color?: string; strength?: number}> = ({frame, at, color = BLUE, strength = 1}) => {
  const life = p(frame, at, at + 34);
  const opacity = interpolate(life, [0, 0.16, 1], [0, 0.78 * strength, 0], clamp);
  return (
    <>
      {[0, 1, 2].map((i) => {
        const delayed = p(frame, at + i * 5, at + 29 + i * 5);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 960,
              top: frame >= 1110 ? interpolate(p(frame, 1110, 1170), [0, 1], [458, 362]) : 458,
              width: 190,
              height: 190,
              borderRadius: '50%',
              border: `3px solid ${color}`,
              transform: `translate(-50%, -50%) scale(${0.72 + delayed * (2.5 + i * 0.36)})`,
              opacity: opacity * (1 - i * 0.18),
              boxShadow: `0 0 25px ${color}55`,
              zIndex: 33,
            }}
          />
        );
      })}
      {new Array(12).fill(true).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        const r = life * (180 + (i % 3) * 30);
        return <div key={`spark-${i}`} style={{position: 'absolute', left: 960 + Math.cos(a) * r, top: 458 + Math.sin(a) * r * 0.62, width: 7 + (i % 2) * 3, height: 7 + (i % 2) * 3, borderRadius: '50%', background: color, opacity, boxShadow: `0 0 12px ${color}`, zIndex: 35}} />;
      })}
    </>
  );
};

const CauseEffectLayer: React.FC<{frame: number}> = ({frame}) => (
  <div style={{position: 'absolute', inset: 0, zIndex: 36, pointerEvents: 'none'}}>
    <CausalPulse frame={frame} at={276} />
    <CausalPulse frame={frame} at={586} color={CYAN} />
    <CausalPulse frame={frame} at={876} color={GREEN} />
    <CausalPulse frame={frame} at={1118} color={BLUE} strength={0.8} />
  </div>
);

const Caption: React.FC<{opacity: number; eyebrow: string; title: string; subtitle?: string; accent?: string}> = ({opacity, eyebrow, title, subtitle, accent = BLUE}) => (
  <div style={{position: 'absolute', left: 0, right: 0, bottom: 86, textAlign: 'center', opacity, fontFamily: FONT, zIndex: 80}}>
    <div style={{fontSize: 16, fontWeight: 850, color: accent, letterSpacing: 5}}>{eyebrow}</div>
    <div style={{fontSize: 55, lineHeight: 1.15, marginTop: 13, fontWeight: 900, letterSpacing: 1.5, color: INK}}>{title}</div>
    {subtitle ? <div style={{fontSize: 23, marginTop: 12, color: MUTED, letterSpacing: 1.5}}>{subtitle}</div> : null}
  </div>
);

const DataTile3D: React.FC<{frame: number; index: number; opacity: number}> = ({frame, index, opacity}) => {
  const {fps} = useVideoConfig();
  const arrive = spring({fps, frame: frame - index * 5, config: {damping: 17, stiffness: 76}, durationInFrames: 82});
  const selected = index === 5;
  const focus = p(frame, 88, 142);
  const absorb = p(frame, 160, 220);
  const angle = (index / 10) * Math.PI * 2 - Math.PI / 2;
  const endX = 960 + Math.cos(angle) * (340 + (index % 2) * 80);
  const endY = 455 + Math.sin(angle) * 230;
  const startX = 960 + Math.cos(angle) * (980 + (index % 3) * 160);
  const startY = 455 + Math.sin(angle) * 650;
  let x = interpolate(arrive, [0, 1], [startX, endX]);
  let y = interpolate(arrive, [0, 1], [startY, endY]);
  let tileOpacity = opacity * arrive * (selected ? 1 : 1 - focus * 0.74);
  let scale = 0.82 + (index % 3) * 0.07;
  if (selected) {
    x = interpolate(focus, [0, 1], [x, 960]);
    y = interpolate(focus, [0, 1], [y, 458]);
    scale = interpolate(focus, [0, 1], [scale, 1.15]) * interpolate(absorb, [0, 1], [1, 0.08]);
    tileOpacity *= 1 - p(frame, 200, 222);
  } else {
    x += Math.cos(angle) * focus * 130;
    y += Math.sin(angle) * focus * 80;
    tileOpacity *= 1 - p(frame, 215, 265);
  }
  const rotY = (index - 5) * 8 + Math.sin(frame / 37 + index) * 8;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 222,
        height: 142,
        transform: `translate(-50%, -50%) perspective(900px) rotateX(${10 + index % 3 * 5}deg) rotateY(${rotY}deg) rotateZ(${(index - 5) * 2.5}deg) scale(${scale})`,
        transformStyle: 'preserve-3d',
        opacity: tileOpacity,
        zIndex: selected ? 33 : 18 + index,
      }}
    >
      <div style={{position: 'absolute', inset: 0, borderRadius: 20, border: `2px solid ${selected && focus > 0.2 ? BLUE : 'rgba(120,151,168,.4)'}`, background: 'linear-gradient(145deg, rgba(255,255,255,.94), rgba(225,239,244,.72))', boxShadow: selected && focus > 0.2 ? '0 26px 65px rgba(22,135,255,.28), inset 0 1px 0 white' : '0 24px 46px rgba(45,65,77,.16), inset 0 1px 0 white', backdropFilter: 'blur(9px)'}}>
        <div style={{position: 'absolute', left: 22, top: 24, width: 112, height: 8, borderRadius: 8, background: selected ? '#1687ff' : '#9db7c5'}} />
        {[0, 1, 2].map((line) => <div key={line} style={{position: 'absolute', left: 22, top: 54 + line * 23, width: 154 - line * 17, height: 6, borderRadius: 6, background: '#b8cbd4'}} />)}
        <div style={{position: 'absolute', right: 20, bottom: 18, width: 35, height: 35, borderRadius: '50%', background: `radial-gradient(circle at 35% 30%, #fff, ${selected ? CYAN : '#cad9df'} 32%, ${selected ? BLUE : '#91aebb'})`, boxShadow: '0 7px 12px rgba(44,75,91,.18)'}} />
      </div>
      <div style={{position: 'absolute', left: 18, right: -9, bottom: -11, height: 14, borderRadius: '0 0 17px 17px', background: 'linear-gradient(180deg, #b8cbd4, #829eab)', transform: 'rotateX(70deg)', transformOrigin: 'top', opacity: 0.7}} />
      <div style={{position: 'absolute', right: -11, top: 15, bottom: 8, width: 14, borderRadius: '0 13px 13px 0', background: 'linear-gradient(90deg, #afc3ce, #7894a3)', transform: 'rotateY(62deg)', transformOrigin: 'left', opacity: 0.58}} />
    </div>
  );
};

const OpeningWorld: React.FC<{frame: number}> = ({frame}) => {
  const opacity = windowOpacity(frame, 0, 12, 275, 315);
  return (
    <div style={{position: 'absolute', inset: 0, opacity}}>
      {new Array(10).fill(true).map((_, i) => <DataTile3D key={i} frame={frame} index={i} opacity={opacity} />)}
      <Caption opacity={windowOpacity(frame, 10, 22, 88, 103)} eyebrow="TEN IDEAS ARE EASY" title="十个选题，不等于一个好方向" subtitle="真正困难的是：这个方向，凭什么比那个好？" />
      <Caption opacity={windowOpacity(frame, 213, 226, 283, 302)} eyebrow="EVIDENCE FIRST" title="先把依据装进答案" subtitle="星研链，不急着给结论" />
    </div>
  );
};

const ConstraintBlock: React.FC<{local: number; index: number; label: string}> = ({local, index, label}) => {
  const {fps} = useVideoConfig();
  const enter = spring({fps, frame: local - index * 8, config: {damping: 18, stiffness: 90}, durationInFrames: 64});
  const snap = p(local, 72 + index * 5, 118 + index * 5);
  const startAngle = (index / 6) * Math.PI * 2 - Math.PI / 2;
  const startX = 960 + Math.cos(startAngle) * 430;
  const startY = 458 + Math.sin(startAngle) * 260;
  const endAngle = (index / 6) * Math.PI * 2 + local * 0.004;
  const endX = 960 + Math.cos(endAngle) * 152;
  const endY = 458 + Math.sin(endAngle) * 92;
  const x = interpolate(snap, [0, 1], [startX, endX]);
  const y = interpolate(snap, [0, 1], [startY, endY]);
  const fade = 1 - p(local, 138, 166);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 170, height: 58, transform: `translate(-50%, -50%) perspective(700px) rotateX(12deg) rotateY(${(index - 2.5) * 9}deg) scale(${0.7 + enter * 0.3 - snap * 0.23})`, opacity: enter * fade, zIndex: 38}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: 16, background: 'linear-gradient(150deg, #ffffff, #e4edf0)', border: '1px solid rgba(89,132,155,.35)', boxShadow: '0 18px 32px rgba(44,68,82,.18), inset 0 1px 0 #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 820, color: INK}}>{label}</div>
      <div style={{position: 'absolute', left: 12, right: 2, bottom: -8, height: 9, borderRadius: '0 0 12px 12px', background: '#9db5c1', transform: 'rotateX(70deg)', transformOrigin: 'top'}} />
    </div>
  );
};

const EvidencePortal: React.FC<{local: number; index: number; label: string}> = ({local, index, label}) => {
  const start = 118 + index * 39;
  const travel = p(local, start, start + 82);
  const y = interpolate(travel, [0, 1], [245, 720]);
  const scale = interpolate(travel, [0, 1], [0.36, 1.72]);
  const opacity = interpolate(travel, [0, 0.16, 0.78, 1], [0, 1, 1, 0], clamp);
  return (
    <div style={{position: 'absolute', left: 960, top: y, width: 560, height: 375, transform: `translate(-50%, -50%) perspective(900px) rotateX(${interpolate(travel, [0, 1], [3, -8])}deg) scale(${scale})`, opacity, transformStyle: 'preserve-3d', zIndex: travel > 0.56 ? 52 : 26}}>
      <div style={{position: 'absolute', inset: 0, border: '20px solid rgba(22,135,255,.42)', borderBottomWidth: 28, borderRadius: '150px 150px 26px 26px', boxShadow: 'inset 0 0 0 3px rgba(255,255,255,.78), 0 28px 50px rgba(19,70,104,.18), 0 0 32px rgba(22,135,255,.18)', background: 'linear-gradient(180deg, rgba(255,255,255,.12), rgba(44,161,255,.04))'}} />
      <div style={{position: 'absolute', left: 150, right: 150, top: -28, height: 54, borderRadius: 28, background: 'linear-gradient(180deg, #ffffff, #d9ecf6)', border: '1px solid #8ecaf0', boxShadow: '0 16px 28px rgba(20,75,112,.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 23, fontWeight: 900, letterSpacing: 5, color: NAVY}}>{label}</div>
      <div style={{position: 'absolute', left: 26, right: 26, bottom: -22, height: 28, borderRadius: '0 0 18px 18px', background: 'linear-gradient(180deg, #399bea, #0c63b2)', transform: 'rotateX(65deg)', transformOrigin: 'top'}} />
    </div>
  );
};

const EvidenceWorld: React.FC<{frame: number}> = ({frame}) => {
  const local = frame - 300;
  const opacity = windowOpacity(frame, 270, 305, 585, 625);
  const labels = ['研究对象', '研究目标', '时间预算', '算力条件', '数据约束', '风险偏好'];
  const portals = ['检索', '去重', '核验', '编号'];
  return (
    <div style={{position: 'absolute', inset: 0, opacity}}>
      {labels.map((label, i) => <ConstraintBlock key={label} local={local} index={i} label={label} />)}
      {portals.map((label, i) => <EvidencePortal key={label} local={local} index={i} label={label} />)}
      {portals.map((_, i) => {
        const appear = p(local, 170 + i * 31, 202 + i * 31);
        const a = (i / 4) * Math.PI * 2 + frame * 0.012;
        return <div key={i} style={{position: 'absolute', left: 960 + Math.cos(a) * 137, top: 458 + Math.sin(a) * 81, width: 20, height: 20, borderRadius: '50%', background: `radial-gradient(circle at 35% 25%, #fff, ${CYAN} 30%, ${BLUE} 74%)`, boxShadow: '0 8px 15px rgba(22,135,255,.28)', opacity: appear, zIndex: 45}} />;
      })}
      <Caption opacity={windowOpacity(local, 4, 16, 105, 126)} eyebrow="CONSTRAINTS BEFORE IDEAS" title="先把条件一件件装好" subtitle="目标 · 时间 · 算力 · 数据 · 风险偏好" />
      <Caption opacity={windowOpacity(local, 168, 181, 282, 298)} eyebrow="SEARCH · DEDUP · VERIFY · CITE" title="让结论穿过四道证据门" subtitle="落不回证据编号的，不写" />
    </div>
  );
};

const ScorePillar: React.FC<{local: number; index: number; score: number; x: number}> = ({local, index, score, x}) => {
  const rise = p(local, 12 + index * 6, 88 + index * 6);
  const focus = p(local, 238, 288);
  const descend = p(local, 276, 318);
  const winner = index === 2;
  const height = (205 + (score - 70) * 7.3) * rise * (1 - descend);
  const fade = winner ? 1 : 1 - focus * 0.68;
  const shiftX = winner ? x * (1 - focus) : x + Math.sign(x || 1) * focus * 72;
  const scale = winner ? 1 + focus * 0.2 : 1 - focus * 0.12;
  return (
    <div style={{position: 'absolute', left: 960 + shiftX, top: 735, width: 210, height, transform: `translate(-50%, -100%) perspective(1000px) rotateY(${(index - 2) * -4}deg) scale(${scale})`, transformOrigin: '50% 100%', opacity: rise * fade, transformStyle: 'preserve-3d', zIndex: 24 + index}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: '20px 20px 9px 9px', background: winner ? 'linear-gradient(90deg, #35c59a, #69e4be 48%, #209f78)' : 'linear-gradient(90deg, #1072c5, #36b5f4 48%, #095897)', border: '1px solid rgba(255,255,255,.7)', boxShadow: winner ? '0 34px 60px rgba(47,191,145,.26), inset 0 2px 0 rgba(255,255,255,.7)' : '0 30px 50px rgba(16,80,124,.2), inset 0 2px 0 rgba(255,255,255,.58)', overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 22, right: 22, top: 25, fontSize: 13, fontWeight: 800, letterSpacing: 3, color: 'rgba(255,255,255,.82)'}}>DIRECTION {index + 1}</div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 62, fontSize: 55, fontWeight: 950, color: '#fff', textAlign: 'center', textShadow: '0 4px 12px rgba(0,45,80,.25)'}}>{score}</div>
        <div style={{position: 'absolute', left: 27, right: 27, bottom: 30, display: 'grid', gap: 10}}>
          {[0.78, 0.62, 0.88, 0.72, 0.83].map((v, i) => <div key={i} style={{height: 5, borderRadius: 5, background: 'rgba(255,255,255,.3)', overflow: 'hidden'}}><div style={{height: '100%', width: `${(v - index * 0.025) * 100}%`, background: 'rgba(255,255,255,.85)', borderRadius: 5}} /></div>)}
        </div>
      </div>
      <div style={{position: 'absolute', left: 4, right: -15, top: -17, height: 36, borderRadius: '50%', background: winner ? 'radial-gradient(ellipse, #baffea, #41caa1 58%, #18825f)' : 'radial-gradient(ellipse, #c6f2ff, #36aef0 58%, #07558f)', border: '1px solid rgba(255,255,255,.7)', boxShadow: '0 8px 12px rgba(4,48,83,.18)'}} />
      <div style={{position: 'absolute', right: -17, top: 12, bottom: 7, width: 21, borderRadius: '0 12px 9px 0', background: winner ? 'linear-gradient(90deg, #218a6c, #12664e)' : 'linear-gradient(90deg, #0865a9, #064273)', transform: 'rotateY(48deg)', transformOrigin: 'left'}} />
    </div>
  );
};

const RuleClamp: React.FC<{local: number; index: number; title: string}> = ({local, index, title}) => {
  const enter = p(local, 132 + index * 30, 164 + index * 30);
  const leave = p(local, 226 + index * 8, 252 + index * 8);
  const y = interpolate(enter, [0, 1], [120, 360 + index * 95]);
  return (
    <div style={{position: 'absolute', left: 960, top: y, width: 1320, height: 82, transform: `translate(-50%, -50%) perspective(1000px) rotateX(61deg) scaleX(${0.84 + enter * 0.16})`, opacity: enter * (1 - leave), zIndex: 55}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: 22, border: '2px solid rgba(239,71,100,.75)', background: 'linear-gradient(180deg, rgba(255,157,173,.3), rgba(239,71,100,.16))', boxShadow: '0 18px 34px rgba(239,71,100,.2), inset 0 2px 0 rgba(255,255,255,.5)'}} />
      <div style={{position: 'absolute', left: 30, top: 19, transform: 'rotateX(-61deg)', transformOrigin: 'left top', display: 'flex', alignItems: 'center', gap: 12, fontSize: 17, fontWeight: 900, color: '#b41d3b', letterSpacing: 2}}><span style={{fontSize: 22}}>●</span>{title}</div>
    </div>
  );
};

const ScoringWorld: React.FC<{frame: number}> = ({frame}) => {
  const local = frame - 600;
  const opacity = windowOpacity(frame, 575, 610, 880, 920);
  const scores = [74, 82, 88, 79, 71];
  const xs = [-560, -280, 0, 280, 560];
  const rules = ['同行评议不足，证据分不虚高', '数据代码未确认，资源分不虚高', '依赖未声明条件，可行性不虚高'];
  return (
    <div style={{position: 'absolute', inset: 0, opacity}}>
      <div style={{position: 'absolute', left: 300, right: 300, top: 750, height: 76, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(38,105,143,.22), rgba(38,105,143,0) 70%)', filter: 'blur(13px)'}} />
      {scores.map((score, i) => <ScorePillar key={i} local={local} index={i} score={score} x={xs[i]} />)}
      {rules.map((rule, i) => <RuleClamp key={rule} local={local} index={i} title={rule} />)}
      <Caption opacity={windowOpacity(local, 10, 22, 112, 130)} eyebrow="FIVE DIRECTIONS · ONE RULER" title="五个立体方案，同一把尺子" subtitle="新颖性 · 可行性 · 科学价值 · 证据强度 · 资源匹配" />
      <Caption opacity={windowOpacity(local, 162, 176, 265, 286)} eyebrow="HARD RULES, NOT REMINDERS" title="三道实体闸门，压住虚高" subtitle="评分可复算，结论可追问" accent={RED} />
    </div>
  );
};

const Scanner: React.FC<{local: number}> = ({local}) => {
  const scan = p(local, 0, 105);
  const fade = 1 - p(local, 118, 145);
  const y = interpolate(scan, [0, 1], [300, 630]);
  return (
    <div style={{position: 'absolute', left: 960, top: y, width: 470, height: 180, transform: 'translate(-50%, -50%) perspective(900px) rotateX(68deg)', opacity: fade, zIndex: 48}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: '50%', border: '14px solid rgba(22,135,255,.47)', boxShadow: '0 0 0 4px rgba(255,255,255,.9), 0 24px 48px rgba(22,135,255,.22), inset 0 0 30px rgba(22,135,255,.23)'}} />
      <div style={{position: 'absolute', left: 45, right: 45, top: 45, bottom: 45, borderRadius: '50%', border: '3px solid rgba(85,220,255,.85)', boxShadow: '0 0 28px rgba(85,220,255,.8)'}} />
    </div>
  );
};

const ResourceModule: React.FC<{local: number; index: number; label: string; startX: number; startY: number}> = ({local, index, label, startX, startY}) => {
  const move = p(local, 52 + index * 13, 116 + index * 13);
  const fade = 1 - p(local, 137, 166);
  const endAngles = [-2.55, -0.58, 1.58];
  const endX = 960 + Math.cos(endAngles[index]) * 145;
  const endY = 458 + Math.sin(endAngles[index]) * 88;
  const x = interpolate(move, [0, 1], [startX, endX]);
  const y = interpolate(move, [0, 1], [startY, endY]);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 138, height: 78, transform: `translate(-50%, -50%) perspective(800px) rotateX(12deg) rotateY(${index === 1 ? -13 : 13}deg) scale(${0.85 + move * 0.15})`, opacity: move * fade, zIndex: 44}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: 17, background: 'linear-gradient(145deg, #ffffff, #dff5ed)', border: '1px solid rgba(47,191,145,.55)', boxShadow: '0 20px 35px rgba(31,101,78,.18), inset 0 1px 0 #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#177356', fontSize: 17, fontWeight: 900, letterSpacing: 2}}>{label}</div>
      <div style={{position: 'absolute', left: 12, right: -7, bottom: -9, height: 11, borderRadius: '0 0 13px 13px', background: '#78b9a5', transform: 'rotateX(67deg)', transformOrigin: 'top'}} />
    </div>
  );
};

const ReportSheet: React.FC<{local: number; index: number; title: string}> = ({local, index, title}) => {
  const open = p(local, 128 + index * 5, 188 + index * 5);
  const close = p(local, 224, 260);
  const spreadX = [-430, -150, 150, 430][index];
  const x = interpolate(open, [0, 1], [960, 960 + spreadX]);
  const y = interpolate(open, [0, 1], [470, 492 + (index % 2) * 24]);
  const rotation = interpolate(open, [0, 1], [0, (index - 1.5) * 5.5]);
  const opacity = open * (1 - close);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 430, height: 540, transform: `translate(-50%, -50%) perspective(1100px) rotateY(${(index - 1.5) * -4}deg) rotateZ(${rotation}deg) scale(${0.35 + open * 0.65 - close * 0.28})`, opacity, transformStyle: 'preserve-3d', zIndex: 30 + index}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: 16, background: 'linear-gradient(145deg, #fffefb, #eef2f1)', border: '1px solid #c6d1d4', boxShadow: '0 35px 70px rgba(42,62,72,.22), inset 0 1px 0 white', padding: '38px 34px', boxSizing: 'border-box'}}>
        <div style={{fontSize: 12, fontWeight: 900, color: BLUE, letterSpacing: 3}}>XINGYAN RESEARCH REPORT</div>
        <div style={{fontSize: 29, marginTop: 15, fontWeight: 900, color: INK}}>{title}</div>
        <div style={{height: 2, background: '#98b5c3', margin: '21px 0 25px'}} />
        {[0, 1, 2, 3, 4].map((line) => <div key={line} style={{display: 'flex', gap: 12, alignItems: 'center', marginBottom: 18}}><div style={{width: 10, height: 10, borderRadius: '50%', background: line < 3 ? BLUE : '#a9bbc3'}} /><div style={{height: 9, width: 290 - line * 22, borderRadius: 8, background: '#c8d5da'}} /></div>)}
        {index === 3 ? <div style={{marginTop: 32, borderTop: `2px solid ${BLUE}`, paddingTop: 24, color: INK}}><div style={{fontSize: 20, fontWeight: 900}}>本轮未发现 ≠ 不存在</div><div style={{fontSize: 14, color: MUTED, marginTop: 10}}>证据不足、检索边界、待确认条件</div></div> : <div style={{position: 'absolute', left: 34, bottom: 40, width: 135, height: 54, borderRadius: 27, background: 'linear-gradient(180deg, #48cfff, #1687ff)', boxShadow: '0 14px 25px rgba(22,135,255,.23)'}} />}
      </div>
      <div style={{position: 'absolute', left: 18, right: -8, bottom: -12, height: 14, borderRadius: '0 0 14px 14px', background: '#aab9be', transform: 'rotateX(70deg)', transformOrigin: 'top'}} />
    </div>
  );
};

const DeliveryWorld: React.FC<{frame: number}> = ({frame}) => {
  const local = frame - 900;
  const opacity = windowOpacity(frame, 875, 910, 1200, 1220);
  const brand = p(local, 226, 282);
  const titles = ['候选方向对比', '优胜方案设计', '最小可行实验', '证据与边界'];
  return (
    <div style={{position: 'absolute', inset: 0, opacity}}>
      <Scanner local={local} />
      <ResourceModule local={local} index={0} label="数据集" startX={300} startY={345} />
      <ResourceModule local={local} index={1} label="开源代码" startX={1620} startY={350} />
      <ResourceModule local={local} index={2} label="评测指标" startX={960} startY={810} />
      {titles.map((title, i) => <ReportSheet key={title} local={local} index={i} title={title} />)}
      <Caption opacity={windowOpacity(local, 5, 18, 114, 136)} eyebrow="DETERMINISTIC AUDIT" title="程序扫描，而不是模型自说自话" subtitle="完整性 · 证据量 · 评分尺度 · 优胜一致性" />
      <Caption opacity={windowOpacity(local, 150, 164, 221, 240)} eyebrow="REPORT WITH BOUNDARIES" title="把方案和边界一起展开" subtitle="不仅告诉你怎么做，也告诉你哪里还不知道" />
      <div style={{position: 'absolute', left: 0, right: 0, top: 565, textAlign: 'center', opacity: brand, transform: `translateY(${(1 - brand) * 38}px)`, zIndex: 90, fontFamily: FONT}}>
        <div style={{fontSize: 76, fontWeight: 950, letterSpacing: 12, color: INK}}>星研链</div>
        <div style={{fontSize: 30, fontWeight: 720, marginTop: 19, color: '#235475', letterSpacing: 6}}>先摆证据，再给结论</div>
        <div style={{fontSize: 14, fontWeight: 800, marginTop: 22, color: MUTED, letterSpacing: 5}}>EVIDENCE-FIRST RESEARCH AGENT</div>
      </div>
    </div>
  );
};

export const XingYanChainVideoV2: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{backgroundColor: BG}}>
      <Audio src={staticFile('audio/xingyan-score.wav')} volume={0.5} />
      <Studio frame={frame} />
      <ContinuityRail frame={frame} opacity={1 - p(frame, 1110, 1180) * 0.7} />
      <OpeningWorld frame={frame} />
      <EvidenceWorld frame={frame} />
      <ScoringWorld frame={frame} />
      <DeliveryWorld frame={frame} />
      <CauseEffectLayer frame={frame} />
      <HeroObject frame={frame} />
      <ProgressHeader frame={frame} />
    </AbsoluteFill>
  );
};
