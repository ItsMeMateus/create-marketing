import { AbsoluteFill, Sequence, OffthreadVideo, Img, Audio, staticFile, useCurrentFrame,
  useVideoConfig, interpolate, spring, Easing } from 'remotion';

// Reel "história": conversa no celular → QR Code → zoom → o card de verdade
// sendo tocado → final com a marca. Inspirado no formato de gravação de tela
// que mais performa no nicho (ver .claude/instagram/swipe.md).

const FONT = '-apple-system, "SF Pro Text", Inter, "Liberation Sans", Arial, sans-serif';
// A marca vem do .agents/brand.json do projeto: o render.mjs passa em `b`
// (site, cta, sub, color, lang) e copia o mascote e o avatar para public/.
let MASCOT = '', AVATAR = '';

const StatusBar = ({ time = '14:35', dark = false }) => (
  <div style={{ height: 120, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
    padding: '0 70px 18px', fontFamily: FONT, fontWeight: 600, fontSize: 40, color: dark ? '#fff' : '#111' }}>
    <span>{time}</span>
    <svg width="190" height="40" viewBox="0 0 190 40" fill={dark ? '#fff' : '#111'}>
      {/* sinal */}
      {[0, 1, 2, 3].map(i => <rect key={i} x={i * 13} y={28 - i * 8} width="9" height={10 + i * 8} rx="2" />)}
      {/* wi-fi */}
      <path d="M86 32 l7-8 a10 10 0 0 0-14 0z" />
      <path d="M71 17 a22 22 0 0 1 30 0 l-4 4 a16 16 0 0 0-22 0z" />
      <path d="M64 10 a32 32 0 0 1 44 0 l-4 4 a26 26 0 0 0-36 0z" />
      {/* bateria */}
      <rect x="122" y="8" width="56" height="26" rx="7" fill="none" stroke={dark ? '#fff' : '#111'} strokeWidth="3" opacity=".55" />
      <rect x="127" y="13" width="42" height="16" rx="4" />
      <rect x="181" y="16" width="5" height="10" rx="2" opacity=".55" />
    </svg>
  </div>
);

const Typing = () => {
  const f = useCurrentFrame();
  return (
    <div style={{ display: 'inline-flex', gap: 12, background: '#fff', borderRadius: 34, padding: '26px 30px',
      boxShadow: '0 2px 2px rgba(0,0,0,.08)' }}>
      {[0, 1, 2].map(i => <span key={i} style={{ width: 16, height: 16, borderRadius: 8, background: '#9aa0a6',
        opacity: 0.35 + 0.65 * Math.abs(Math.sin((f + i * 5) / 6)) }} />)}
    </div>
  );
};

const Bubble = ({ children, time, appearAt, me }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const s = spring({ frame: f - appearAt, fps, config: { damping: 15, mass: 0.5 } });
  if (f < appearAt) return null;
  return (
    <div style={{ alignSelf: me ? 'flex-end' : 'flex-start', maxWidth: 760, transform: `scale(${0.6 + 0.4 * s})`,
      opacity: s, transformOrigin: me ? 'right bottom' : 'left bottom', marginBottom: 18 }}>
      <div style={{ background: me ? '#d9fdd3' : '#fff', borderRadius: me ? '34px 8px 34px 34px' : '8px 34px 34px 34px',
        padding: '22px 30px 16px', fontFamily: FONT, fontSize: 46, color: '#111', boxShadow: '0 2px 2px rgba(0,0,0,.08)' }}>
        {children}
        <div style={{ fontSize: 26, color: '#8a8f94', textAlign: 'right', marginTop: 4 }}>{time}{me ? '  ✓✓' : ''}</div>
      </div>
    </div>
  );
};

const QR = ({ matrix, size = 560, pink }) => {
  const n = matrix.length, cell = size / n;
  const finder = (r, c) => (r < 7 && c < 7) || (r < 7 && c >= n - 7) || (r >= n - 7 && c < 7);
  const center = (r, c) => Math.abs(r - n / 2 + 0.5) < 5 && Math.abs(c - n / 2 + 0.5) < 5;
  return (
    <div style={{ position: 'relative', width: size, height: size, background: '#fff', borderRadius: 24 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {matrix.flatMap((row, r) => row.map((v, c) => v && !finder(r, c) && !center(r, c) ?
          <rect key={r + '-' + c} x={c * cell + cell * 0.08} y={r * cell + cell * 0.08} width={cell * 0.84}
            height={cell * 0.84} rx={cell * 0.3} fill={pink} /> : null))}
        {[[0, 0], [0, n - 7], [n - 7, 0]].map(([r, c], i) => (
          <g key={i}>
            <rect x={c * cell + cell * 0.5} y={r * cell + cell * 0.5} width={cell * 6} height={cell * 6}
              rx={cell * 1.6} fill="none" stroke={pink} strokeWidth={cell} />
            <rect x={(c + 2) * cell} y={(r + 2) * cell} width={cell * 3} height={cell * 3} rx={cell * 0.9} fill={pink} />
          </g>
        ))}
      </svg>
      {MASCOT && <Img src={staticFile(MASCOT)} style={{ position: 'absolute', left: size / 2 - size * 0.12,
        top: size / 2 - size * 0.13, width: size * 0.24, background: '#fff', borderRadius: 999, padding: 6 }} />}
    </div>
  );
};

const Chat = ({ msgs, qr, qrAt, zoomAt, contact, pink, placeholder = 'Mensagem', statusTime, qrMe, anchorBottom, topPad = 0 }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const z = interpolate(f, [zoomAt, zoomAt + 0.9 * fps], [1, 3.4], { extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp', easing: Easing.in(Easing.cubic) });
  const typing = msgs.find(m => m.from !== 'me' && f >= m.at - 0.7 * fps && f < m.at);
  const qrIn = spring({ frame: f - qrAt, fps, config: { damping: 14 } });
  return (
    <AbsoluteFill style={{ background: '#efe7dd', transform: `scale(${z})`, transformOrigin: '50% 62%' }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.18,
        backgroundImage: 'radial-gradient(#b9a98f 2px, transparent 2px)', backgroundSize: '46px 46px' }} />
      <div style={{ background: '#f6f6f6', borderBottom: '1px solid #ddd' }}>
        <StatusBar time={statusTime} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 22, padding: '6px 40px 26px', fontFamily: FONT }}>
          <span style={{ fontSize: 60, color: '#0a84ff' }}>‹</span>
          {AVATAR ? <Img src={staticFile(AVATAR)} style={{ width: 92, height: 92, borderRadius: 46, objectFit: 'cover' }} />
            : <div style={{ width: 92, height: 92, borderRadius: 46, background: pink, color: '#fff', fontSize: 40, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{(contact || '?').trim()[0]}</div>}
          <span style={{ fontSize: 46, fontWeight: 600, color: '#111' }}>{contact}</span>
        </div>
      </div>
      <div style={{ position: 'absolute', top: 300 + topPad, bottom: 190, left: 40, right: 40, display: 'flex', flexDirection: 'column',
        justifyContent: anchorBottom ? 'flex-end' : 'flex-start', overflow: 'hidden' }}>
        {msgs.filter(m => !m.afterQr).map((m, i) => <Bubble key={i} appearAt={m.at} time={m.time} me={m.from === 'me'}>{m.text}</Bubble>)}
        {f >= qrAt && (
          <div style={{ alignSelf: qrMe ? 'flex-end' : 'flex-start', background: qrMe ? '#d9fdd3' : '#fff',
            borderRadius: qrMe ? '34px 8px 34px 34px' : '8px 34px 34px 34px', padding: 18, marginBottom: 18,
            transform: `scale(${0.6 + 0.4 * qrIn})`, opacity: qrIn, transformOrigin: qrMe ? 'right top' : 'left top',
            boxShadow: '0 2px 2px rgba(0,0,0,.08)' }}>
            <QR matrix={qr} pink={pink} />
          </div>
        )}
        {msgs.filter(m => m.afterQr).map((m, i) => <Bubble key={'a' + i} appearAt={m.at} time={m.time} me={m.from === 'me'}>{m.text}</Bubble>)}
        {typing && <div style={{ marginTop: 6 }}><Typing /></div>}
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 170, background: '#f6f6f6',
        borderTop: '1px solid #ddd', display: 'flex', alignItems: 'center', padding: '0 40px', gap: 24 }}>
        <span style={{ fontSize: 60, color: '#0a84ff' }}>+</span>
        <div style={{ flex: 1, height: 84, borderRadius: 42, background: '#fff', border: '1px solid #ddd',
          fontFamily: FONT, fontSize: 38, color: '#aaa', display: 'flex', alignItems: 'center', padding: '0 30px' }}>
          {placeholder}</div>
      </div>
    </AbsoluteFill>
  );
};


// Tela de bloqueio: relógio vira meia-noite e chega a notificação (trend
// "Imagine him getting this at 12AM").
const LockScreen = ({ lock, zoomAt, topPad = 0 }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const ticked = f >= lock.tickAt * fps;
  const n = spring({ frame: f - lock.notifAt * fps, fps, config: { damping: 13 } });
  const z = interpolate(f, [zoomAt, zoomAt + 0.8 * fps], [1, 2.6], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.cubic) });
  const pulse = ticked ? spring({ frame: f - lock.tickAt * fps, fps, config: { damping: 8 } }) : 0;
  return (
    <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: '50% 34%' }}>
      {(lock.bg || AVATAR) ? <Img src={staticFile(lock.bg || AVATAR)} style={{ position: 'absolute', inset: -40, width: 1160, height: 2000,
        objectFit: 'cover', filter: 'blur(26px) brightness(.62)' }} />
        : <AbsoluteFill style={{ background: 'linear-gradient(160deg,#2b2440,#5b3a5e 60%,#1d1a2b)' }} />}
      <StatusBar time="" dark />
      <div style={{ position: 'absolute', top: 250 + topPad, width: '100%', textAlign: 'center', color: '#fff', fontFamily: FONT }}>
        <div style={{ fontSize: 48, fontWeight: 600, opacity: .9 }}>{lock.date}</div>
        <div style={{ fontSize: 250, fontWeight: 700, lineHeight: 1.05, transform: `scale(${1 + 0.06 * Math.sin(pulse * Math.PI)})` }}>
          {ticked ? lock.to : lock.from}</div>
      </div>
      {f >= lock.notifAt * fps && (
        <div style={{ position: 'absolute', top: 690 + topPad, left: 50, right: 50, background: 'rgba(245,245,245,.88)',
          borderRadius: 46, padding: '30px 34px', display: 'flex', gap: 26, alignItems: 'center', fontFamily: FONT,
          transform: `translateY(${(1 - n) * -160}px)`, opacity: n, boxShadow: '0 20px 50px rgba(0,0,0,.3)' }}>
          <div style={{ width: 96, height: 96, borderRadius: 24, background: '#25d366', display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontSize: 58 }}>💬</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 38 }}>
              <b style={{ color: '#111' }}>{lock.title}</b><span style={{ color: '#777', fontSize: 32 }}>{lock.now || 'now'}</span></div>
            <div style={{ fontSize: 40, color: '#222', marginTop: 6 }}>{lock.body}</div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

const Tap = () => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, 12], [0.4, 1.4], { extrapolateRight: 'clamp' });
  const o = interpolate(f, [0, 4, 14], [0, 0.85, 0], { extrapolateRight: 'clamp' });
  return <div style={{ width: 120, height: 120, borderRadius: 60, background: 'rgba(255,255,255,.55)',
    border: '6px solid rgba(255,255,255,.9)', transform: `translate(-50%,-50%) scale(${s})`, opacity: o }} />;
};

const EndCard = ({ b }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const s = spring({ frame: f, fps, config: { damping: 14 } });
  const dim = interpolate(f, [0, 10], [0, 0.45], { extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', background: `rgba(0,0,0,${dim})` }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,.97)',
        borderRadius: 56, padding: '40px 70px 46px', transform: `translateY(${(1 - s) * 320}px) scale(${0.85 + 0.15 * s})`,
        boxShadow: '0 30px 80px rgba(0,0,0,.45)', fontFamily: FONT, marginTop: -120 }}>
        {MASCOT && <Img src={staticFile(MASCOT)} style={{ width: 260 }} />}
        {/* Montar e ver a prévia é grátis; enviar o link é pago. Não prometer "grátis" sozinho. */}
        <div style={{ fontSize: 70, fontWeight: 900, color: '#1e1b2e' }}>{b.cta}</div>
        <div style={{ fontSize: 44, fontWeight: 600, color: '#4a4458', marginTop: -4 }}>{b.sub}</div>
        <div style={{ fontSize: 48, fontWeight: 700, color: b.color }}>{b.site}</div>
      </div>
    </AbsoluteFill>
  );
};

export const Story = ({ b = { site: '', cta: '', sub: '', color: '#f0426e', lang: 'pt' }, qr = [[1]], mascot = '', avatar = '', contact = 'Amor ❤️', msgs = [], qrAt = 4.6, zoomAt = 6.2,
  cardAt = 7.1, cardVideo, taps = [], hook, duration = 24, statusTime = '23:57', qrFrom, reply, lock }) => {
  const { fps } = useVideoConfig(); const F = s => Math.round(s * fps);
  MASCOT = mascot; AVATAR = avatar;
  const pink = b.color;
  const msgsF = msgs.map(m => ({ ...m, at: F(m.at) }));
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <Sequence durationInFrames={F(cardAt) + 4}>
        {lock ? <LockScreen lock={lock} zoomAt={F(zoomAt)} topPad={hook ? 290 : 0} /> :
          <Chat msgs={msgsF} qr={qr} qrAt={F(qrAt)} zoomAt={F(zoomAt)} contact={contact} pink={pink}
            placeholder={b.lang === 'en' ? 'Message' : 'Mensagem'} statusTime={statusTime} qrMe={qrFrom === 'me'} topPad={hook ? 200 : 0} />}
      </Sequence>
      {reply && reply.msgs.map((m, i) => <Sequence key={'r' + i} from={F(reply.at + m.at)} durationInFrames={10}><Audio src={staticFile('pop.wav')} /></Sequence>)}
      {lock && <Sequence from={F(lock.notifAt)} durationInFrames={10}><Audio src={staticFile('pop.wav')} /></Sequence>}
      {lock && lock.tapAt && (
        <Sequence from={F(lock.tapAt)} durationInFrames={16}>
          <div style={{ position: 'absolute', left: 540, top: 790 + (hook ? 290 : 0) }}><Tap /></div>
          <Audio src={staticFile('tap.wav')} />
        </Sequence>
      )}
      <Sequence from={F(cardAt)}>
        <AbsoluteFill>
          <OffthreadVideo src={staticFile(cardVideo)} muted style={{ width: '100%', height: '100%' }} />
        </AbsoluteFill>
      </Sequence>
      {/* flash branco da transição QR → card */}
      <Sequence from={F(cardAt) - 4} durationInFrames={14}>
        <FlashWhite />
      </Sequence>
      {taps.map((t, i) => (
        <Sequence key={i} from={F(cardAt + t.t)} durationInFrames={16}>
          {/* dentro do card, só o círculo do toque (sem som) */}
          <div style={{ position: 'absolute', left: t.x, top: t.y }}><Tap /></div>
        </Sequence>
      ))}
      {reply && (
        // Volta pra conversa com a reação de quem recebeu (trend "Reação à Surpresa").
        <Sequence from={F(reply.at)} durationInFrames={F(duration - 3.2 - reply.at) + 6}>
          <SlideIn>
            <Chat msgs={[...msgs.map(m => ({ ...m, at: -1 })), ...reply.msgs.map(m => ({ ...m, at: F(m.at), afterQr: true }))]} anchorBottom
              qr={qr} qrAt={lock ? 1e9 : -1} zoomAt={1e9} contact={contact} pink={pink}
              placeholder={b.lang === 'en' ? 'Message' : 'Mensagem'} statusTime={reply.statusTime || statusTime} qrMe={qrFrom === 'me'} />
          </SlideIn>
        </Sequence>
      )}
      {msgs.map((m, i) => <Sequence key={'p' + i} from={F(m.at)} durationInFrames={10}><Audio src={staticFile('pop.wav')} /></Sequence>)}
      {!lock && <Sequence from={F(qrAt)} durationInFrames={10}><Audio src={staticFile('pop.wav')} /></Sequence>}
      <Sequence from={F(zoomAt)} durationInFrames={20}><Audio src={staticFile('whoosh.wav')} /></Sequence>
      {hook && (
        <Sequence durationInFrames={F(zoomAt)}>
          <HookText text={hook} len={F(zoomAt)} />
        </Sequence>
      )}
      <Sequence from={F(duration - 3.2)}>
        <EndCard b={b} />
      </Sequence>
    </AbsoluteFill>
  );
};

const SlideIn = ({ children }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const s = spring({ frame: f, fps, config: { damping: 18 } });
  return <AbsoluteFill style={{ transform: `translateX(${(1 - s) * 1080}px)` }}>{children}</AbsoluteFill>;
};

const FlashWhite = () => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: '#fff', opacity: interpolate(f, [0, 4, 14], [0, 1, 0], { extrapolateRight: 'clamp' }) }} />;
};

// Gancho "pov:" no topo, no estilo do texto do TikTok/Reels: branco com
// contorno preto, centralizado, sem caixa. Fica na tela durante a conversa.
const HookText = ({ text, len }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 5, len - 8, len], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div style={{ position: 'absolute', top: 270, left: 60, right: 60, textAlign: 'center', opacity: o,
      fontFamily: FONT, fontWeight: 700, fontSize: 64, lineHeight: 1.2, color: '#fff',
      WebkitTextStroke: '7px #000', paintOrder: 'stroke fill',
      textShadow: '0 4px 10px rgba(0,0,0,.35)' }}>
      {text}
    </div>
  );
};
