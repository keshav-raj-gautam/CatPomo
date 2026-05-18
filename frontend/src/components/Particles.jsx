import { memo, useMemo } from "react";

export const Particles = memo(function Particles() {
  const items = useMemo(() => Array.from({length:13},(_,i)=>({
    id:i, x:(i/13)*100+Math.sin(i*1.8)*5, delay:i*0.55, dur:9+(i%5)*2,
    sym:["🐾","✨","💗","🌸","⭐","💫","🎀"][i%7], sz:0.65+(i%4)*0.15,
  })),[]);
  return (
    <div style={{position:"fixed",inset:0,pointerEvents:"none",overflow:"hidden",zIndex:0}}>
      {items.map(p=>(
        <div key={p.id} style={{
          position:"absolute", left:`${p.x}%`, bottom:-40,
          fontSize:`${p.sz}rem`,
          animation:`floatup ${p.dur}s ${p.delay}s ease-in-out infinite`,
          willChange:"transform,opacity",
        }}>{p.sym}</div>
      ))}
    </div>
  );
});

export const Confetti = memo(function Confetti({ active }) {
  const pieces = useMemo(()=>Array.from({length:36},(_,i)=>({
    id:i, x:5+(i/36)*90,
    color:["#FF8FAB","#C9A0DC","#87CEEB","#FFD700","#98FB98","#FFB347"][i%6],
    delay:(i%12)*0.08, dur:1.6+(i%5)*0.18, sz:8+(i%4)*3, br:i%3===0?"50%":"3px",
  })),[]);
  if (!active) return null;
  return (
    <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:50,overflow:"hidden"}}>
      {pieces.map(p=>(
        <div key={p.id} style={{
          position:"absolute", left:`${p.x}%`, top:-20,
          width:p.sz, height:p.sz, background:p.color, borderRadius:p.br,
          animation:`confetti ${p.dur}s ${p.delay}s ease-in forwards`,
        }}/>
      ))}
    </div>
  );
});
