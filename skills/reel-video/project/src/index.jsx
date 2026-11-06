import { Story } from './Story.jsx';
import { registerRoot, Composition, AbsoluteFill, Sequence, OffthreadVideo, Img, staticFile,
  useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';

// Marca: o render.mjs passa `b` (cores e site) e `mascot` (arquivo em public/).

// Cartão de texto (≤ 6 palavras), dentro da área segura: y entre 230 e 1440, direita livre.
const TextCard = ({ text, big }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const s = spring({ frame: f, fps, config: { damping: 14, mass: 0.6 } });
  return (
    <div style={{ position: 'absolute', top: 250, left: 70, right: 230, transform: `scale(${0.85 + 0.15 * s})`,
      transformOrigin: 'left top', opacity: s }}>
      <span style={{ display: 'inline', background: '#fff', color: '#1e1b2e', fontFamily: 'Inter, Arial, sans-serif',
        fontWeight: 900, fontSize: big ? 96 : 78, lineHeight: 1.25, padding: '6px 18px', borderRadius: 18,
        boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone', boxShadow: '0 10px 30px rgba(0,0,0,.18)' }}>
        {text}
      </span>
    </div>
  );
};

const Mascot = ({ x = 640, y = 1180, w = 360, src }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const s = spring({ frame: f, fps, config: { damping: 10 } });
  const bob = Math.sin(f / 8) * 12;
  if (!src) return null;
  return <Img src={staticFile(src)} style={{ position: 'absolute', left: x, top: y + bob + (1 - s) * 300,
    width: w, opacity: s, filter: 'drop-shadow(0 18px 30px rgba(0,0,0,.25))' }} />;
};

export const Reel = ({ b = { color: '#f0426e', background: '#fffafb' }, mascot = '', video, beats = [], mascotAt = [], videoFrom = 0 }) => {
  const { fps, durationInFrames } = useVideoConfig(); const f = useCurrentFrame();
  const phoneIn = spring({ frame: f - 6, fps, config: { damping: 16 } });
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${b.background || '#fffafb'} 0%, ${b.color} 100%)` }}>
      {/* Celular com a gravação do produto */}
      <div style={{ position: 'absolute', left: 150, top: 560, width: 780, height: 1386, borderRadius: 70,
        background: '#0f0f14', padding: 18, boxShadow: '0 40px 80px rgba(0,0,0,.35)',
        transform: `translateY(${(1 - phoneIn) * 500}px)` }}>
        <div style={{ width: '100%', height: '100%', borderRadius: 54, overflow: 'hidden', background: '#000' }}>
          {video && <OffthreadVideo src={staticFile(video)} startFrom={videoFrom} muted
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />}
        </div>
      </div>
      {beats.map((bt, i) => (
        <Sequence key={i} from={Math.round(bt.t * fps)} durationInFrames={Math.round(bt.dur * fps)}>
          <TextCard text={bt.text} big={i === 0 || bt.big} />
        </Sequence>
      ))}
      {mascotAt.map((c, i) => (
        <Sequence key={'c' + i} from={Math.round(c.t * fps)} durationInFrames={Math.round(c.dur * fps)}>
          <Mascot x={c.x} y={c.y} w={c.w} src={mascot} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

const Root = () => (<>
  <Composition id="Story" component={Story} fps={30} width={1080} height={1920} durationInFrames={720}
    defaultProps={{ msgs: [], taps: [] }}
    calculateMetadata={({ props }) => ({ durationInFrames: Math.round((props.duration || 24) * 30) })} />
  <Composition id="Reel" component={Reel} fps={30} width={1080} height={1920} durationInFrames={600}
    defaultProps={{ beats: [], mascotAt: [] }}
    calculateMetadata={({ props }) => ({ durationInFrames: Math.round((props.duration || 20) * 30) })} />
</>);
registerRoot(Root);
