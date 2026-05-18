import Card from "../components/Card.jsx";
import Cat from "../components/Cat.jsx";
import { TimerRing, TimerDigits } from "../components/Timer.jsx";

export default function FocusPage({ user, dark, mode, running, setRunning, setMode, resetTimer, switchMode, sessCount, catState, isBreak, setPage, sudokuRef }) {
  const tp = dark?"#F5C6D8":"#5D3A6B", ts = dark?"#C9A0DC":"#9B72B0";
  const modeLabel = mode==="focus"?"🎯 Focus Time":mode==="shortBreak"?"☕ Short Break":"🌙 Long Break";

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      <Card dark={dark}>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:14 }}>
          <Cat state={catState} accessory={user.cat_accessory||"none"} size={110}/>

          <div style={{ position:"relative", width:270, height:270, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <TimerRing size={270} isBreak={isBreak}/>
            </div>
            <div style={{ position:"absolute" }}>
              <TimerDigits isBreak={isBreak} big/>
            </div>
          </div>

          <div style={{ color:ts, fontSize:13, fontWeight:700, letterSpacing:2, textTransform:"uppercase" }}>{modeLabel}</div>

          <div style={{ display:"flex", gap:8 }}>
            {[["focus","🎯 Focus"],["shortBreak","☕ Short"],["longBreak","🌙 Long"]].map(([m,l])=>(
              <button key={m} onClick={()=>switchMode(m)} style={{
                padding:"6px 13px", borderRadius:20, fontSize:12, fontWeight:700,
                fontFamily:"'Nunito',sans-serif", border:"none", cursor:"pointer", transition:"all .2s",
                background:mode===m?(m==="focus"?"#FF8FAB":"#C9A0DC"):"rgba(255,255,255,.22)",
                color:mode===m?"white":ts,
              }}>{l}</button>
            ))}
          </div>

          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
            <button onClick={resetTimer} style={{ padding:"10px 18px", borderRadius:16, fontWeight:700, fontSize:13, background:"rgba(255,255,255,.25)", color:ts, border:"none", cursor:"pointer" }}>
              ↺ Reset
            </button>
            <button onClick={()=>setRunning(r=>!r)} style={{
              padding:"13px 40px", borderRadius:30, fontWeight:900, fontSize:18,
              fontFamily:"'Nunito',sans-serif", border:"none", cursor:"pointer",
              background:running?"#C9A0DC":"linear-gradient(135deg,#FF8FAB,#FF6B9D)", color:"white",
              animation:running?"glow-p 2s infinite":"glow 2s infinite",
            }}>{running?"⏸ Pause":"▶ Start"}</button>
          </div>
          <div style={{ color:ts, fontSize:13 }}>
            Session #{sessCount+1} · 🔥 {user.streak||0}-day streak
          </div>
        </div>
      </Card>

      {isBreak && (
        <Card dark={dark} style={{ textAlign:"center" }}>
          <p style={{ color:tp, fontWeight:700, fontFamily:"'Nunito',sans-serif", marginBottom:12 }}>
            🧩 Play Sudoku during your break?
          </p>
          <button onClick={()=>setPage("sudoku")} style={{
            padding:"10px 28px", borderRadius:22, fontWeight:800, fontSize:14,
            fontFamily:"'Nunito',sans-serif", border:"none", cursor:"pointer",
            background:"#C9A0DC", color:"white", boxShadow:"0 4px 16px rgba(201,160,220,.4)",
          }}>Play Sudoku 🧩</button>
        </Card>
      )}
    </div>
  );
}
