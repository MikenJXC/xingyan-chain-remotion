import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Easing,
  Sequence,
  interpolate,
  random,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const BLUE = '#35d9ff';
const CYAN = '#64f4ff';
const DEEP = '#06111e';
const NAVY = '#0a2b49';
const WHITE = '#f4fbff';
const MUTED = '#9db7c9';
const RED = '#ff4d66';
const GREEN = '#52f2ad';
const FONT = 'Microsoft YaHei, Noto Sans CJK SC, PingFang SC, sans-serif';

const clamp = {
  extrapolateLeft: 'clamp' as const,
  extrapolateRight: 'clamp' as const,
};

const fadeWindow = (frame: number, start: number, end: number, fade = 14) =>
  interpolate(frame, [start, start + fade, end - fade, end], [0, 1, 1, 0], clamp);

const GridBackground: React.FC<{accent?: string}> = ({accent = BLUE}) => {
  const frame = useCurrentFrame();
  const shift = (frame * 0.45) % 80;
  const particles = new Array(52).fill(true).map((_, i) => ({
    x: random(`star-x-${i}`) * 100,
    y: random(`star-y-${i}`) * 100,
    r: 1 + random(`star-r-${i}`) * 2.6,
    o: 0.15 + random(`star-o-${i}`) * 0.55,
  }));
  return (
    <AbsoluteFill
      style={{
        overflow: 'hidden',
        background:
          'radial-gradient(circle at 50% 48%, #0d3556 0%, #07182a 28%, #030811 68%, #010308 100%)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: '-20%',
          opacity: 0.2,
          transform: `perspective(900px) rotateX(67deg) translateY(${shift}px)`,
          transformOrigin: '50% 68%',
          backgroundImage: `linear-gradient(${accent}22 1px, transparent 1px), linear-gradient(90deg, ${accent}22 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
          maskImage: 'linear-gradient(to top, black 0%, transparent 74%)',
        }}
      />
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${(p.y + frame * (0.006 + (i % 4) * 0.002)) % 100}%`,
            width: p.r,
            height: p.r,
            borderRadius: '50%',
            background: i % 8 === 0 ? CYAN : '#b8eaff',
            opacity: p.o,
            boxShadow: `0 0 ${8 + p.r * 2}px ${accent}`,
          }}
        />
      ))}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(90deg, rgba(0,0,0,.34), transparent 18%, transparent 82%, rgba(0,0,0,.34)), linear-gradient(0deg, rgba(0,0,0,.4), transparent 24%, transparent 80%, rgba(0,0,0,.35))',
        }}
      />
    </AbsoluteFill>
  );
};

const HeaderChrome: React.FC<{chapter: string; progress: number}> = ({chapter, progress}) => (
  <>
    <div
      style={{
        position: 'absolute',
        left: 72,
        top: 54,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        fontFamily: FONT,
        color: WHITE,
        letterSpacing: 2,
      }}
    >
      <div
        style={{
          width: 12,
          height: 12,
          transform: 'rotate(45deg)',
          background: BLUE,
          boxShadow: `0 0 20px ${BLUE}`,
        }}
      />
      <div style={{fontSize: 21, fontWeight: 700}}>星研链</div>
      <div style={{width: 1, height: 22, background: '#ffffff35'}} />
      <div style={{fontSize: 14, color: MUTED, fontWeight: 500}}>{chapter}</div>
    </div>
    <div
      style={{
        position: 'absolute',
        left: 72,
        right: 72,
        bottom: 48,
        height: 2,
        background: '#ffffff18',
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${Math.max(0, Math.min(1, progress)) * 100}%`,
          background: `linear-gradient(90deg, ${BLUE}, ${CYAN})`,
          boxShadow: `0 0 14px ${BLUE}`,
        }}
      />
    </div>
  </>
);

const BigCaption: React.FC<{
  eyebrow?: string;
  line1: string;
  line2?: string;
  opacity?: number;
  align?: 'left' | 'center';
  accent?: string;
}> = ({eyebrow, line1, line2, opacity = 1, align = 'center', accent = BLUE}) => (
  <div
    style={{
      position: 'absolute',
      left: align === 'center' ? 200 : 110,
      right: align === 'center' ? 200 : 840,
      bottom: 120,
      textAlign: align,
      opacity,
      fontFamily: FONT,
      color: WHITE,
      textShadow: '0 8px 32px rgba(0,0,0,.8)',
    }}
  >
    {eyebrow ? (
      <div style={{fontSize: 17, letterSpacing: 5, color: accent, marginBottom: 14, fontWeight: 700}}>
        {eyebrow}
      </div>
    ) : null}
    <div style={{fontSize: align === 'center' ? 64 : 58, fontWeight: 800, lineHeight: 1.14}}>{line1}</div>
    {line2 ? (
      <div style={{fontSize: align === 'center' ? 31 : 28, color: '#cceaff', marginTop: 14, fontWeight: 500}}>
        {line2}
      </div>
    ) : null}
  </div>
);

const GlassCard: React.FC<{
  x: number;
  y: number;
  rotation: number;
  scale: number;
  opacity: number;
  selected?: boolean;
  index: number;
}> = ({x, y, rotation, scale, opacity, selected, index}) => (
  <div
    style={{
      position: 'absolute',
      left: '50%',
      top: '44%',
      width: 360,
      height: 216,
      transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${rotation}deg) scale(${scale})`,
      opacity,
      borderRadius: 24,
      border: `1.5px solid ${selected ? BLUE : '#a7dfff55'}`,
      background: selected
        ? 'linear-gradient(145deg, rgba(21,95,145,.48), rgba(5,20,35,.86))'
        : 'linear-gradient(145deg, rgba(138,203,235,.12), rgba(5,18,32,.68))',
      backdropFilter: 'blur(16px)',
      boxShadow: selected
        ? `0 0 22px ${BLUE}, inset 0 0 42px #39c7ff25`
        : '0 24px 60px rgba(0,0,0,.52), inset 0 1px 0 rgba(255,255,255,.12)',
      overflow: 'hidden',
    }}
  >
    <div style={{position: 'absolute', left: 28, right: 28, top: 26, height: 6, borderRadius: 4, background: '#bfeaff25'}} />
    {[0, 1, 2].map((r) => (
      <div
        key={r}
        style={{
          position: 'absolute',
          left: 28,
          top: 65 + r * 34,
          width: 190 - r * 25 + (index % 3) * 20,
          height: 9,
          borderRadius: 8,
          background: selected ? '#79e7ff66' : '#b9e6ff25',
        }}
      />
    ))}
    <svg width="118" height="82" viewBox="0 0 118 82" style={{position: 'absolute', right: 24, bottom: 24}}>
      <polyline
        points={`0,${62 - (index % 3) * 7} 22,48 41,58 62,24 83,35 118,${10 + (index % 4) * 7}`}
        fill="none"
        stroke={selected ? CYAN : '#8eddf066'}
        strokeWidth="4"
      />
      <line x1="0" y1="76" x2="118" y2="76" stroke="#ffffff22" />
    </svg>
  </div>
);

const Core: React.FC<{scale?: number; opacity?: number; label?: string; compact?: boolean}> = ({
  scale = 1,
  opacity = 1,
  label,
  compact = false,
}) => {
  const frame = useCurrentFrame();
  const size = compact ? 230 : 330;
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '45%',
        width: size,
        height: size,
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
      }}
    >
      {[0, 1, 2].map((ring) => (
        <div
          key={ring}
          style={{
            position: 'absolute',
            inset: ring * 34,
            borderRadius: '50%',
            border: `${ring === 1 ? 2 : 1}px solid ${ring === 0 ? '#43dcff55' : '#8eeeff88'}`,
            transform: `rotate(${(ring % 2 ? -1 : 1) * (frame * (0.18 + ring * 0.06))}deg)`,
            boxShadow: ring === 2 ? `0 0 38px ${BLUE}55` : undefined,
          }}
        >
          {[0, 1, 2, 3].map((dot) => (
            <div
              key={dot}
              style={{
                position: 'absolute',
                width: 8 - ring,
                height: 8 - ring,
                borderRadius: '50%',
                background: CYAN,
                boxShadow: `0 0 13px ${CYAN}`,
                left: '50%',
                top: -4,
                transformOrigin: `${size / 2 - ring * 34}px ${size / 2 - ring * 34 + 4}px`,
                transform: `rotate(${dot * 90}deg)`,
              }}
            />
          ))}
        </div>
      ))}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: compact ? 94 : 124,
          height: compact ? 94 : 124,
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle at 40% 36%, #efffff, #63e6ff 13%, #168ecc 44%, #07385d 72%, #03111f 100%)',
          boxShadow: `0 0 28px #dfffff, 0 0 78px ${BLUE}, 0 0 160px #179eea88`,
        }}
      />
      {label ? (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#02101a',
            fontFamily: FONT,
            fontSize: compact ? 24 : 31,
            fontWeight: 900,
            letterSpacing: 2,
          }}
        >
          {label}
        </div>
      ) : null}
    </div>
  );
};

const OpeningScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const stack = spring({fps, frame, config: {damping: 17, stiffness: 86}, durationInFrames: 88});
  const select = interpolate(frame, [91, 124, 176], [0, 1, 1], clamp);
  const dissolve = interpolate(frame, [180, 232], [0, 1], clamp);
  const coreIn = spring({fps, frame: frame - 200, config: {damping: 18, stiffness: 82}, durationInFrames: 68});
  const glitchOpacity = frame >= 90 && frame <= 100 ? 0.85 * (1 - Math.abs(frame - 95) / 5) : 0;
  const cards = new Array(10).fill(true).map((_, i) => {
    const angle = (i / 10) * Math.PI * 2 + 0.35;
    const initialRadius = 850 + (i % 3) * 145;
    const initialX = Math.cos(angle) * initialRadius;
    const initialY = Math.sin(angle) * 460;
    const stackX = (i - 4.5) * 26;
    const stackY = (i % 3 - 1) * 19;
    const isSelected = i === 5;
    const dim = select > 0 && !isSelected ? 1 - select * 0.77 : 1;
    const zoom = isSelected ? 1 + select * 0.38 : 1;
    return {
      x: interpolate(stack, [0, 1], [initialX, stackX]),
      y: interpolate(stack, [0, 1], [initialY, stackY]),
      rotation: interpolate(stack, [0, 1], [(i - 5) * 18, (i - 5) * 2.2]),
      opacity: (1 - dissolve) * dim,
      scale: (0.72 + i * 0.018) * zoom,
      isSelected,
    };
  });
  const cameraScale = interpolate(frame, [0, 88, 105, 176], [1.18, 0.84, 0.84, 1.18], clamp);
  const particles = new Array(70).fill(true).map((_, i) => {
    const a = random(`open-pa-${i}`) * Math.PI * 2;
    const r = interpolate(dissolve, [0, 1], [180 + random(`open-pr-${i}`) * 450, 45 + random(`open-end-${i}`) * 145]);
    return {x: Math.cos(a) * r, y: Math.sin(a) * r * 0.55, size: 2 + random(`open-ps-${i}`) * 5};
  });
  return (
    <AbsoluteFill>
      <GridBackground />
      <HeaderChrome chapter="01  WHY THIS DIRECTION" progress={frame / 1200} />
      <div style={{position: 'absolute', inset: 0, transform: `scale(${cameraScale})`}}>
        {cards.map((card, i) => (
          <GlassCard key={i} {...card} selected={card.isSelected && select > 0.2} index={i} />
        ))}
      </div>
      {frame >= 176
        ? particles.map((p, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: '50%',
                top: '45%',
                width: p.size,
                height: p.size,
                borderRadius: '50%',
                transform: `translate(${p.x}px, ${p.y}px)`,
                background: i % 6 === 0 ? WHITE : BLUE,
                boxShadow: `0 0 ${6 + p.size * 2}px ${BLUE}`,
                opacity: interpolate(frame, [180, 207, 270, 299], [0, 1, 0.65, 0.25], clamp),
              }}
            />
          ))
        : null}
      {frame >= 194 ? <Core scale={coreIn} opacity={coreIn} /> : null}
      <BigCaption line1="AI 能一次给你十个选题" line2="真正困难的是：这个方向，凭什么比那个好？" opacity={fadeWindow(frame, 8, 93, 15)} />
      <BigCaption eyebrow="EVIDENCE FIRST" line1="星研链" line2="不急着给答案" opacity={fadeWindow(frame, 212, 298, 16)} />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: glitchOpacity,
          background:
            'repeating-linear-gradient(0deg, transparent 0px, transparent 15px, rgba(72,224,255,.28) 16px, transparent 19px)',
          mixBlendMode: 'screen',
          transform: `translateX(${frame % 2 ? 24 : -18}px)`,
        }}
      />
    </AbsoluteFill>
  );
};

const ConstraintChip: React.FC<{label: string; value: string; x: number; y: number; delay: number}> = ({label, value, x, y, delay}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const show = spring({fps, frame: frame - delay, config: {damping: 18, stiffness: 110}});
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '45%',
        width: 245,
        height: 92,
        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${0.75 + show * 0.25})`,
        opacity: show,
        border: '1px solid #74e5ff55',
        borderRadius: 18,
        background: 'linear-gradient(135deg, rgba(17,67,103,.72), rgba(4,18,32,.78))',
        boxShadow: `0 18px 48px rgba(0,0,0,.4), inset 0 0 28px ${BLUE}12`,
        padding: '18px 22px',
        boxSizing: 'border-box',
        fontFamily: FONT,
      }}
    >
      <div style={{fontSize: 14, color: MUTED, letterSpacing: 2}}>{label}</div>
      <div style={{fontSize: 22, color: WHITE, fontWeight: 750, marginTop: 8}}>{value}</div>
      <div style={{position: 'absolute', right: 16, top: 16, color: GREEN, fontSize: 18}}>●</div>
    </div>
  );
};

const EvidencePipeline: React.FC<{progress: number}> = ({progress}) => {
  const stages = ['检索', '去重', '核验', '编号'];
  return (
    <div style={{position: 'absolute', left: 180, right: 180, top: 425, height: 200}}>
      <svg width="100%" height="200" viewBox="0 0 1560 200" style={{position: 'absolute', inset: 0}}>
        <line x1="150" y1="100" x2="1410" y2="100" stroke="#2edcff28" strokeWidth="8" />
        <line x1="150" y1="100" x2={150 + 1260 * progress} y2="100" stroke={BLUE} strokeWidth="5" style={{filter: `drop-shadow(0 0 10px ${BLUE})`}} />
      </svg>
      {stages.map((stage, i) => {
        const x = 110 + i * 420;
        const active = interpolate(progress, [i / 4, Math.min(1, i / 4 + 0.2)], [0, 1], clamp);
        return (
          <div key={stage} style={{position: 'absolute', left: x, top: 42, width: 210, textAlign: 'center', fontFamily: FONT}}>
            <div
              style={{
                width: 76,
                height: 76,
                margin: '0 auto',
                borderRadius: 22,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 28,
                fontWeight: 900,
                color: active > 0.5 ? '#032035' : MUTED,
                background: active > 0.5 ? BLUE : '#0c2940',
                border: `1px solid ${active > 0.5 ? CYAN : '#4c839e55'}`,
                boxShadow: active > 0.5 ? `0 0 28px ${BLUE}` : undefined,
              }}
            >
              {i + 1}
            </div>
            <div style={{marginTop: 14, color: active > 0.5 ? WHITE : MUTED, fontSize: 25, fontWeight: 700}}>{stage}</div>
          </div>
        );
      })}
    </div>
  );
};

const EvidenceScene: React.FC = () => {
  const frame = useCurrentFrame();
  const coreScale = interpolate(frame, [0, 88, 115], [1, 0.68, 0.56], clamp);
  const fadeConstraints = interpolate(frame, [86, 116], [1, 0], clamp);
  const streamIn = interpolate(frame, [90, 150], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const pipeline = interpolate(frame, [156, 282], [0, 1], clamp);
  const constraints = [
    ['研究对象', '目标人群', -430, -205],
    ['研究目标', '可证伪问题', 0, -278],
    ['时间预算', '3 个月', 430, -205],
    ['算力条件', '1 张 GPU', -430, 165],
    ['数据约束', '公开数据', 0, 248],
    ['风险偏好', '稳妥 ↔ 大胆', 430, 165],
  ] as const;
  const sources = [
    {label: 'PAPER', x: 130, y: 250},
    {label: 'CODE', x: 1530, y: 260},
    {label: 'DATA', x: 170, y: 735},
    {label: 'WEB', x: 1480, y: 730},
  ];
  return (
    <AbsoluteFill>
      <GridBackground />
      <HeaderChrome chapter="02  BUILD THE EVIDENCE" progress={(300 + frame) / 1200} />
      {frame < 125 ? (
        <>
          <Core scale={coreScale} />
          <div style={{opacity: fadeConstraints}}>
            {constraints.map(([label, value, x, y], i) => (
              <ConstraintChip key={label} label={label} value={value} x={x} y={y} delay={i * 9 + 8} />
            ))}
          </div>
        </>
      ) : null}
      {frame >= 86 && frame < 186 ? (
        <>
          <Core scale={0.52} compact />
          <svg width="1920" height="1080" style={{position: 'absolute', inset: 0}}>
            {sources.map((s, i) => (
              <g key={s.label} opacity={streamIn}>
                <line x1={s.x} y1={s.y} x2="960" y2="485" stroke={i % 2 ? '#75efff' : BLUE} strokeWidth="3" strokeDasharray="10 14" />
                {new Array(5).fill(true).map((_, j) => {
                  const t = (streamIn + j * 0.17 + frame * 0.012) % 1;
                  return <circle key={j} cx={s.x + (960 - s.x) * t} cy={s.y + (485 - s.y) * t} r={5 - j * 0.4} fill={CYAN} />;
                })}
              </g>
            ))}
          </svg>
          {sources.map((s) => (
            <div
              key={s.label}
              style={{
                position: 'absolute',
                left: s.x - 62,
                top: s.y - 30,
                width: 124,
                height: 60,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                border: '1px solid #65ddff66',
                borderRadius: 14,
                background: '#071b2dcc',
                color: CYAN,
                font: `700 17px ${FONT}`,
                letterSpacing: 2,
                opacity: streamIn,
              }}
            >
              {s.label}
            </div>
          ))}
        </>
      ) : null}
      {frame >= 145 ? <EvidencePipeline progress={pipeline} /> : null}
      <BigCaption eyebrow="CONSTRAINTS BEFORE IDEAS" line1="先把条件问清楚" line2="研究目标 · 时间 · 算力 · 数据 · 风险偏好" opacity={fadeWindow(frame, 6, 110, 15)} />
      <BigCaption eyebrow="SEARCH · DEDUP · VERIFY" line1="让每条结论回到证据" line2="落不回证据编号的，不写" opacity={fadeWindow(frame, 172, 299, 16)} />
    </AbsoluteFill>
  );
};

const Radar: React.FC<{values: number[]; size?: number; color?: string}> = ({values, size = 180, color = BLUE}) => {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.39;
  const points = values
    .map((v, i) => {
      const angle = -Math.PI / 2 + (i / values.length) * Math.PI * 2;
      return `${cx + Math.cos(angle) * radius * v},${cy + Math.sin(angle) * radius * v}`;
    })
    .join(' ');
  const outer = new Array(5)
    .fill(true)
    .map((_, i) => {
      const a = -Math.PI / 2 + (i / 5) * Math.PI * 2;
      return `${cx + Math.cos(a) * radius},${cy + Math.sin(a) * radius}`;
    })
    .join(' ');
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {[0.33, 0.66, 1].map((s) => (
        <polygon key={s} points={outer} fill="none" stroke="#a4e8ff2d" strokeWidth="1.5" transform={`translate(${cx * (1 - s)} ${cy * (1 - s)}) scale(${s})`} />
      ))}
      {new Array(5).fill(true).map((_, i) => {
        const a = -Math.PI / 2 + (i / 5) * Math.PI * 2;
        return <line key={i} x1={cx} y1={cy} x2={cx + Math.cos(a) * radius} y2={cy + Math.sin(a) * radius} stroke="#a4e8ff22" />;
      })}
      <polygon points={points} fill={`${color}35`} stroke={color} strokeWidth="3" style={{filter: `drop-shadow(0 0 7px ${color})`}} />
    </svg>
  );
};

const CandidateCard: React.FC<{
  index: number;
  score: number;
  values: number[];
  x: number;
  y: number;
  scale: number;
  opacity: number;
  winner?: boolean;
}> = ({index, score, values, x, y, scale, opacity, winner}) => (
  <div
    style={{
      position: 'absolute',
      left: '50%',
      top: '45%',
      width: 292,
      height: 420,
      transform: `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${scale})`,
      opacity,
      borderRadius: 24,
      border: `1.5px solid ${winner ? '#7effd5' : '#74dcff55'}`,
      background: winner ? 'linear-gradient(150deg, rgba(24,111,103,.82), rgba(5,25,40,.92))' : 'linear-gradient(150deg, rgba(16,58,88,.78), rgba(4,16,29,.9))',
      boxShadow: winner ? '0 0 42px #52f2ad66, 0 30px 80px rgba(0,0,0,.5)' : '0 26px 70px rgba(0,0,0,.48)',
      fontFamily: FONT,
      color: WHITE,
      textAlign: 'center',
      padding: '22px 18px',
      boxSizing: 'border-box',
    }}
  >
    <div style={{fontSize: 14, color: winner ? GREEN : MUTED, letterSpacing: 3}}>DIRECTION {index}</div>
    <div style={{fontSize: 26, fontWeight: 800, marginTop: 12}}>候选方向 {index}</div>
    <div style={{marginTop: 4}}><Radar values={values} size={184} color={winner ? GREEN : BLUE} /></div>
    <div style={{fontSize: 14, color: MUTED, marginTop: -8}}>统一五维评分</div>
    <div style={{fontSize: 48, lineHeight: 1, fontWeight: 900, marginTop: 12, color: winner ? '#baffea' : WHITE}}>{score}</div>
    {winner ? <div style={{fontSize: 14, color: GREEN, marginTop: 12, letterSpacing: 4}}>RECOMMENDED</div> : null}
  </div>
);

const LockRule: React.FC<{title: string; detail: string; y: number; reveal: number}> = ({title, detail, y, reveal}) => (
  <div
    style={{
      position: 'absolute',
      right: 118,
      top: y,
      width: 600,
      height: 118,
      transform: `translateX(${(1 - reveal) * 160}px)`,
      opacity: reveal,
      display: 'flex',
      alignItems: 'center',
      gap: 22,
      borderRadius: 22,
      border: `1px solid ${RED}88`,
      background: 'linear-gradient(90deg, rgba(89,16,35,.92), rgba(25,7,18,.84))',
      boxShadow: `0 0 30px ${RED}33`,
      padding: '18px 24px',
      boxSizing: 'border-box',
      fontFamily: FONT,
    }}
  >
    <div style={{fontSize: 38, width: 56, textAlign: 'center'}}>🔒</div>
    <div>
      <div style={{fontSize: 23, color: WHITE, fontWeight: 800}}>{title}</div>
      <div style={{fontSize: 16, color: '#ffc5ce', marginTop: 6}}>{detail}</div>
    </div>
  </div>
);

const ScoringScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const appear = spring({fps, frame, config: {damping: 19, stiffness: 82}, durationInFrames: 84});
  const compare = interpolate(frame, [78, 145], [0, 1], clamp);
  const locks = [
    ['证据强度不得虚高', '没有同行评议支持，就不给高分'],
    ['资源匹配不得虚高', '没有确认数据或代码，就不给高分'],
    ['可行性不得虚高', '依赖未声明条件，就不给高分'],
  ];
  const cards = [
    {score: 74, values: [0.78, 0.7, 0.8, 0.62, 0.72]},
    {score: 82, values: [0.81, 0.84, 0.77, 0.78, 0.83]},
    {score: 88, values: [0.88, 0.89, 0.91, 0.84, 0.87]},
    {score: 79, values: [0.75, 0.8, 0.82, 0.74, 0.79]},
    {score: 71, values: [0.9, 0.55, 0.78, 0.61, 0.58]},
  ];
  const xPositions = [-650, -330, 0, 330, 650];
  const winnerFocus = interpolate(frame, [244, 292], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <GridBackground accent="#6de8ff" />
      <HeaderChrome chapter="03  SCORE WITH THE SAME RULER" progress={(600 + frame) / 1200} />
      <div style={{position: 'absolute', left: 98, top: 142, fontFamily: FONT, color: WHITE}}>
        <div style={{fontSize: 18, letterSpacing: 4, color: BLUE, fontWeight: 700}}>FIVE DIRECTIONS</div>
        <div style={{fontSize: 48, fontWeight: 900, marginTop: 12}}>同一把尺子，量五个方向</div>
        <div style={{display: 'flex', gap: 13, marginTop: 18, color: MUTED, fontSize: 16}}>
          {['新颖性', '可行性', '科学价值', '证据强度', '资源匹配'].map((x) => (
            <span key={x} style={{border: '1px solid #62dfff3d', borderRadius: 20, padding: '8px 14px', background: '#071d30aa'}}>{x}</span>
          ))}
        </div>
      </div>
      <div style={{opacity: interpolate(frame, [142, 164, 238, 258], [1, 0.42, 0.42, 1], clamp)}}>
        {cards.map((card, i) => {
          const moveToStack = interpolate(compare, [0, 1], [xPositions[i], -550 + i * 145]);
          const scale = (0.72 + (i === 2 ? 0.05 : 0)) * appear * (i === 2 ? 1 + winnerFocus * 0.32 : 1 - winnerFocus * 0.18);
          const x = i === 2 ? moveToStack + winnerFocus * 550 : moveToStack - winnerFocus * (i - 2) * 45;
          const y = interpolate(appear, [0, 1], [330, 84]) + (i === 2 ? -winnerFocus * 45 : winnerFocus * 90);
          return <CandidateCard key={i} index={i + 1} {...card} x={x} y={y} scale={scale} opacity={appear * (i === 2 ? 1 : 1 - winnerFocus * 0.55)} winner={i === 2 && winnerFocus > 0.35} />;
        })}
      </div>
      {frame >= 148 && frame < 257 ? (
        <div>
          {locks.map(([title, detail], i) => {
            const reveal = spring({fps, frame: frame - (154 + i * 31), config: {damping: 16, stiffness: 125}});
            return <LockRule key={title} title={title} detail={detail} y={230 + i * 145} reveal={reveal} />;
          })}
        </div>
      ) : null}
      <BigCaption eyebrow="HARD RULES, NOT REMINDERS" line1="三条硬规则，压住虚高" line2="评分可以复算，结论可以追问" opacity={fadeWindow(frame, 154, 246, 12)} align="left" accent={RED} />
    </AbsoluteFill>
  );
};

const ResourceChip: React.FC<{text: string; x: number; y: number; progress: number; icon: string}> = ({text, x, y, progress, icon}) => (
  <div
    style={{
      position: 'absolute',
      left: '50%',
      top: '45%',
      width: 230,
      height: 82,
      transform: `translate(calc(-50% + ${x * (1 - progress)}px), calc(-50% + ${y * (1 - progress)}px)) scale(${0.8 + 0.2 * progress})`,
      opacity: progress,
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      padding: '0 20px',
      boxSizing: 'border-box',
      borderRadius: 18,
      border: `1px solid ${GREEN}75`,
      background: 'linear-gradient(135deg, rgba(20,93,78,.88), rgba(4,26,34,.94))',
      boxShadow: `0 0 28px ${GREEN}30`,
      color: WHITE,
      fontFamily: FONT,
      fontSize: 20,
      fontWeight: 750,
    }}
  >
    <span style={{fontSize: 28}}>{icon}</span>{text}
  </div>
);

const ReportPage: React.FC<{index: number; x: number; y: number; rotate: number; opacity: number}> = ({index, x, y, rotate, opacity}) => (
  <div
    style={{
      position: 'absolute',
      left: '50%',
      top: '47%',
      width: 520,
      height: 640,
      transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${rotate}deg)`,
      opacity,
      borderRadius: 18,
      border: '1px solid #98e8ff55',
      background: 'linear-gradient(155deg, rgba(229,250,255,.96), rgba(157,218,235,.9))',
      boxShadow: '0 30px 90px rgba(0,0,0,.55)',
      padding: 42,
      boxSizing: 'border-box',
      fontFamily: FONT,
      color: '#08243a',
    }}
  >
    <div style={{fontSize: 13, fontWeight: 800, color: '#28779c', letterSpacing: 3}}>XINGYAN RESEARCH REPORT</div>
    <div style={{fontSize: 30, fontWeight: 900, marginTop: 16}}>{['候选方向对比', '优胜方案设计', '最小可行实验', '证据与边界'][index]}</div>
    <div style={{height: 2, background: '#2a82a955', margin: '22px 0'}} />
    {new Array(5).fill(true).map((_, i) => (
      <div key={i} style={{display: 'flex', gap: 14, marginBottom: 20, alignItems: 'center'}}>
        <div style={{width: 11, height: 11, borderRadius: '50%', background: i < 3 ? '#22a5cf' : '#86bdce'}} />
        <div style={{height: 10, width: 350 - i * 28, borderRadius: 6, background: '#39799533'}} />
      </div>
    ))}
    {index === 3 ? (
      <div style={{marginTop: 32, borderTop: '2px solid #2085ae', paddingTop: 28}}>
        <div style={{fontSize: 22, fontWeight: 900}}>本轮未发现 ≠ 不存在</div>
        <div style={{fontSize: 16, marginTop: 12, color: '#365e70'}}>主动交付证据不足、检索边界与待确认条件</div>
      </div>
    ) : (
      <Radar values={[0.82, 0.76, 0.9, 0.8, 0.86]} size={210} color="#168bb7" />
    )}
  </div>
);

const AuditScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const audit = interpolate(frame, [5, 82], [0, 1], clamp);
  const resourceIn = spring({fps, frame: frame - 78, config: {damping: 17, stiffness: 95}, durationInFrames: 60});
  const reportIn = interpolate(frame, [140, 190], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const brandIn = spring({fps, frame: frame - 238, config: {damping: 20, stiffness: 70}, durationInFrames: 54});
  return (
    <AbsoluteFill>
      <GridBackground />
      <HeaderChrome chapter="04  VERIFY, RESOURCE, DELIVER" progress={(900 + frame) / 1200} />
      {frame < 142 ? (
        <>
          <div style={{position: 'absolute', left: '50%', top: '45%', transform: 'translate(-50%, -50%)'}}>
            <div style={{width: 660, height: 450, borderRadius: 30, border: '1px solid #72e7ff55', background: '#071c2dcc', boxShadow: '0 34px 110px rgba(0,0,0,.5)'}} />
            <Core scale={0.78} label="✓" compact />
            <div
              style={{
                position: 'absolute',
                left: -30,
                top: -225 + audit * 450,
                width: 720,
                height: 5,
                background: `linear-gradient(90deg, transparent, ${WHITE}, ${BLUE}, transparent)`,
                boxShadow: `0 0 22px ${BLUE}, 0 0 80px ${BLUE}`,
              }}
            />
          </div>
          <ResourceChip text="数据集" icon="◫" x={-680} y={-180} progress={resourceIn} />
          <ResourceChip text="开源代码" icon="⌘" x={680} y={-180} progress={resourceIn} />
          <ResourceChip text="评测指标" icon="◇" x={0} y={420} progress={resourceIn} />
          <BigCaption eyebrow="DETERMINISTIC AUDIT" line1="非模型程序复核" line2="候选完整 · 证据充足 · 评分正常 · 优胜一致" opacity={fadeWindow(frame, 4, 138, 14)} />
        </>
      ) : null}
      {frame >= 132 && frame < 245 ? (
        <div style={{opacity: reportIn}}>
          {[0, 1, 2, 3].map((i) => (
            <ReportPage key={i} index={i} x={(i - 1.5) * 155 * reportIn} y={(i % 2) * 28} rotate={(i - 1.5) * 3.2 * reportIn} opacity={reportIn} />
          ))}
          <BigCaption eyebrow="REPORT WITH BOUNDARIES" line1="结论与边界，一起交付" line2="不仅告诉你怎么做，也告诉你哪里还不知道" opacity={fadeWindow(frame, 156, 240, 12)} />
        </div>
      ) : null}
      {frame >= 226 ? (
        <div style={{opacity: brandIn}}>
          <Core scale={0.9 + brandIn * 0.18} opacity={brandIn} compact />
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 610,
              textAlign: 'center',
              fontFamily: FONT,
              color: WHITE,
              transform: `translateY(${(1 - brandIn) * 36}px)`,
            }}
          >
            <div style={{fontSize: 74, fontWeight: 900, letterSpacing: 12}}>星研链</div>
            <div style={{fontSize: 30, color: '#bcefff', marginTop: 20, letterSpacing: 5}}>先摆证据，再给结论</div>
            <div style={{fontSize: 15, color: MUTED, marginTop: 24, letterSpacing: 4}}>EVIDENCE-FIRST RESEARCH AGENT</div>
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

export const XingYanChainVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: DEEP}}>
      <Audio src={staticFile('audio/xingyan-score.wav')} volume={0.72} />
      <Sequence from={0} durationInFrames={300} premountFor={30}>
        <OpeningScene />
      </Sequence>
      <Sequence from={300} durationInFrames={300} premountFor={30}>
        <EvidenceScene />
      </Sequence>
      <Sequence from={600} durationInFrames={300} premountFor={30}>
        <ScoringScene />
      </Sequence>
      <Sequence from={900} durationInFrames={300} premountFor={30}>
        <AuditScene />
      </Sequence>
    </AbsoluteFill>
  );
};
