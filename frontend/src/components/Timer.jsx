import { memo, useSyncExternalStore } from "react";

// ── Atom lives outside React — only subscribed components re-render ──────────
export const timerAtom = (() => {
  let s = { timeLeft: 25*60, total: 25*60 };
  const L = new Set();
  return {
    get: () => s,
    set: (p) => { s = { ...s, ...p }; L.forEach(f => f()); },
    sub: (f) => { L.add(f); return () => L.delete(f); },
  };
})();

export function useTimerAtom() {
  return useSyncExternalStore(timerAtom.sub, timerAtom.get);
}

export function fmtTime(s) {
  return `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
}

// TimerRing — subscribes to atom, re-renders each second (SVG math only)
export const TimerRing = memo(function TimerRing({ size=230, isBreak }) {
  const { timeLeft, total } = useTimerAtom();
  const r = (size-12)/2, cx=size/2, circ=2*Math.PI*r;
  const prog   = total > 0 ? 1-timeLeft/total : 0;
  const offset = circ*(1-Math.max(0,Math.min(1,prog)));
  const col    = isBreak ? "#C9A0DC" : "#FF8FAB";
  const glow   = isBreak ? "rgba(201,160,220,.5)" : "rgba(255,143,171,.5)";
  const angle  = 2*Math.PI*prog - Math.PI/2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
      style={{ filter:`drop-shadow(0 0 10px ${glow})` }}>
      <circle cx={cx} cy={cx} r={r} fill="none" stroke="rgba(255,255,255,.13)" strokeWidth={11}/>
      <circle cx={cx} cy={cx} r={r} fill="none" stroke={col} strokeWidth={11}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cx})`}
        style={{ transition:"stroke-dashoffset 0.65s cubic-bezier(.4,0,.2,1)" }}/>
      {prog>0.02&&prog<0.98&&(
        <circle cx={cx+r*Math.cos(angle)} cy={cx+r*Math.sin(angle)}
          r={6.5} fill={col} opacity={0.9} style={{ filter:`drop-shadow(0 0 4px ${col})` }}/>
      )}
    </svg>
  );
});

// TimerDigits — subscribes to atom
export const TimerDigits = memo(function TimerDigits({ isBreak, big=false }) {
  const { timeLeft } = useTimerAtom();
  return (
    <div style={{
      fontFamily:"'Nunito',sans-serif", fontWeight:900,
      fontSize: big?68:54, lineHeight:1, letterSpacing:-2,
      color: isBreak?"#C9A0DC":"#FF8FAB",
      textShadow: isBreak?"0 2px 18px rgba(201,160,220,.5)":"0 2px 18px rgba(255,143,171,.5)",
      userSelect:"none",
    }}>{fmtTime(timeLeft)}</div>
  );
});
