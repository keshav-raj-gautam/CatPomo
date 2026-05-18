import { memo } from "react";

export const BarChart = memo(function BarChart({ data, color="#FF8FAB", height=90, dark }) {
  const max = Math.max(...data.map(d=>d.v), 1);
  return (
    <div style={{ display:"flex", alignItems:"flex-end", gap:4, height }}>
      {data.map((d,i)=>(
        <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
          {d.v>0&&<span style={{ color:dark?"#C9A0DC":"#9B72B0", fontSize:9, fontWeight:700 }}>{d.v}</span>}
          <div style={{
            width:"100%",
            height:`${Math.max((d.v/max)*(height-18), d.v>0?6:2)}px`,
            background: d.v>0?`linear-gradient(180deg,${color},${color}88)`:"rgba(255,255,255,.15)",
            borderRadius:"5px 5px 2px 2px",
            transition:"height .6s cubic-bezier(.34,1.56,.64,1)",
            boxShadow: d.v>0?`0 2px 8px ${color}44`:"none",
          }}/>
          <span style={{ color:dark?"#9B72B0":"#C9A0DC", fontSize:9 }}>{d.l}</span>
        </div>
      ))}
    </div>
  );
});

export const Heatmap = memo(function Heatmap({ daily, dark }) {
  const today = new Date();
  const cells = Array.from({length:91},(_,i)=>{
    const d=new Date(today); d.setDate(d.getDate()-(90-i));
    const key=d.toDateString(); return { key, v:daily?.[key]||0 };
  });
  const max = Math.max(...cells.map(c=>c.v),1);
  const cols = [];
  for (let i=0;i<cells.length;i+=7) cols.push(cells.slice(i,i+7));
  return (
    <div style={{ display:"flex", gap:3, overflowX:"auto" }}>
      {cols.map((col,ci)=>(
        <div key={ci} style={{ display:"flex", flexDirection:"column", gap:3 }}>
          {col.map((cell,ri)=>(
            <div key={ri} title={`${cell.key}: ${cell.v} sessions`} style={{
              width:11, height:11, borderRadius:2,
              background: cell.v===0
                ? (dark?"rgba(255,255,255,.07)":"rgba(201,160,220,.15)")
                : `rgba(255,143,171,${0.2+cell.v/max*0.8})`,
            }}/>
          ))}
        </div>
      ))}
    </div>
  );
});

export const DonutChart = memo(function DonutChart({ segments, size=100 }) {
  const total = segments.reduce((a,s)=>a+s.v,0)||1;
  const r=35, cx=50, cy=50, stroke=14, circ=2*Math.PI*r;
  let cum=0;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,.1)" strokeWidth={stroke}/>
      {segments.map((seg,i)=>{
        const pct=seg.v/total, dash=circ*pct, gap=circ*(1-pct), offset=circ*(1-cum);
        cum+=pct;
        return (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={seg.color} strokeWidth={stroke}
            strokeDasharray={`${dash} ${gap}`} strokeDashoffset={offset}
            strokeLinecap="round" transform={`rotate(-90 ${cx} ${cy})`}
            style={{ transition:"stroke-dasharray .6s ease" }}/>
        );
      })}
    </svg>
  );
});
