import { useState, useCallback } from "react";
import Card from "../components/Card.jsx";
import Cat from "../components/Cat.jsx";
import { TimerRing, TimerDigits, timerAtom } from "../components/Timer.jsx";
import { api } from "../utils/api.js";

export default function HomePage({ user, setUser, dark, mode, running, setRunning, setMode, resetTimer, switchMode, sessCount, catState, isBreak, setPage }) {
  const tp = dark?"#F5C6D8":"#5D3A6B", ts = dark?"#C9A0DC":"#9B72B0";
  const modeLabel = mode==="focus"?"🎯 Focus Time":mode==="shortBreak"?"☕ Short Break":"🌙 Long Break";
  const hour = new Date().getHours();
  const greet = hour<12?"Good morning":"hour<18"?"Good afternoon":"Good evening";
  const timeGreet = hour<12?"Good morning! ☀️":hour<18?"Good afternoon! ✨":"Good evening! 🌙";

  // ── Todos local state (synced with DB) ────────────────────────────────────
  const [todos,    setTodos]    = useState(user._todos || []);
  const [todoInput,setTodoInput]= useState("");
  const [todosInit,setTodosInit]= useState(false);

  // Load todos from DB once
  if (!todosInit) {
    setTodosInit(true);
    api.getTodos(user.id).then(rows => setTodos(rows)).catch(()=>{});
  }

  const addTodo = useCallback(async () => {
    if (!todoInput.trim()) return;
    try {
      const t = await api.addTodo({ user_id:user.id, text:todoInput.trim() });
      setTodos(prev => [...prev, t]);
      setTodoInput("");
    } catch {}
  }, [todoInput, user.id]);

  const toggleTodo = useCallback(async (todo) => {
    try {
      const updated = await api.patchTodo(todo.id, { done: !todo.done });
      setTodos(prev => prev.map(t => t.id===todo.id ? updated : t));
    } catch {}
  }, []);

  const deleteTodo = useCallback(async (id) => {
    try {
      await api.deleteTodo(id);
      setTodos(prev => prev.filter(t => t.id!==id));
    } catch {}
  }, []);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      {/* Welcome */}
      <Card dark={dark} style={{ padding:"14px 20px" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <div style={{ color:tp, fontWeight:800, fontSize:17, fontFamily:"'Nunito',sans-serif" }}>
              {timeGreet} {user.name}!
            </div>
            <div style={{ color:ts, fontSize:12 }}>
              {user.today_sessions||0} sessions today · {Math.round((user.total_minutes||0)/60*10)/10}h total
            </div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ color:"#FF8FAB", fontWeight:900, fontSize:22 }}>🔥{user.streak||0}</div>
            <div style={{ color:ts, fontSize:10 }}>day streak</div>
          </div>
        </div>
      </Card>

      {/* Timer */}
      <Card dark={dark}>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:14 }}>
          <div style={{ position:"relative", width:240, height:240, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <TimerRing size={240} isBreak={isBreak}/>
            </div>
            <div style={{ position:"absolute", bottom:18, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Cat state={catState} accessory={user.cat_accessory||"none"} size={100}/>
            </div>
            <div style={{ position:"absolute", top:14, width:"100%", display:"flex", justifyContent:"center" }}>
              <TimerDigits isBreak={isBreak}/>
            </div>
          </div>

          <div style={{ color:ts, fontSize:12, fontWeight:700, letterSpacing:2, textTransform:"uppercase" }}>{modeLabel}</div>

          <div style={{ display:"flex", gap:8 }}>
            {[["focus","Focus"],["shortBreak","Short"],["longBreak","Long"]].map(([m,l])=>(
              <button key={m} onClick={()=>switchMode(m)} style={{
                padding:"5px 13px", borderRadius:20, fontSize:12, fontWeight:700,
                fontFamily:"'Nunito',sans-serif", border:"none", cursor:"pointer", transition:"all .2s",
                background:mode===m?(m==="focus"?"#FF8FAB":"#C9A0DC"):"rgba(255,255,255,.22)",
                color:mode===m?"white":ts,
              }}>{l}</button>
            ))}
          </div>

          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
            <button onClick={resetTimer} style={{ padding:"9px 16px", borderRadius:16, fontWeight:700, fontSize:15, background:"rgba(255,255,255,.25)", color:ts, border:"none", cursor:"pointer" }}>↺</button>
            <button onClick={()=>setRunning(r=>!r)} style={{
              padding:"12px 36px", borderRadius:28, fontWeight:900, fontSize:17,
              fontFamily:"'Nunito',sans-serif", border:"none", cursor:"pointer",
              background:running?"#C9A0DC":"linear-gradient(135deg,#FF8FAB,#FF6B9D)", color:"white",
              animation:running?"glow-p 2s ease-in-out infinite":"glow 2s ease-in-out infinite",
            }}>{running?"⏸ Pause":"▶ Start"}</button>
          </div>
          <div style={{ color:ts, fontSize:12 }}>Session #{sessCount+1} · 🔥 {user.streak||0}-day streak</div>
        </div>
      </Card>

      {/* Todos */}
      <Card dark={dark}>
        <div style={{ color:tp, fontWeight:800, fontSize:15, marginBottom:12, fontFamily:"'Nunito',sans-serif" }}>📝 Today's Goals</div>
        <div style={{ display:"flex", gap:8, marginBottom:12 }}>
          <input value={todoInput} onChange={e=>setTodoInput(e.target.value)}
            onKeyDown={e=>{if(e.key==="Enter")addTodo();}}
            placeholder="Add a goal…"
            style={{
              flex:1, padding:"8px 14px", borderRadius:14, outline:"none",
              border:"1.5px solid rgba(201,160,220,.35)", fontFamily:"'Nunito',sans-serif", fontSize:13,
              background:dark?"rgba(40,20,60,.5)":"rgba(255,255,255,.4)", color:tp,
            }}/>
          <button onClick={addTodo} style={{ padding:"8px 14px", borderRadius:14, background:"#FF8FAB", color:"white", border:"none", cursor:"pointer", fontWeight:800, fontSize:18 }}>+</button>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {todos.map(t=>(
            <div key={t.id} style={{ display:"flex", alignItems:"center", gap:10, opacity:t.done?.5:1, transition:"opacity .2s" }}>
              <button onClick={()=>toggleTodo(t)} style={{
                width:22, height:22, borderRadius:7, flexShrink:0, cursor:"pointer", fontSize:11, color:"white",
                border:`2px solid ${t.done?"#FF8FAB":"#C9A0DC"}`, background:t.done?"#FF8FAB":"transparent",
                display:"flex", alignItems:"center", justifyContent:"center",
              }}>{t.done?"✓":""}</button>
              <span style={{ flex:1, fontSize:13, color:tp, fontFamily:"'Nunito',sans-serif", textDecoration:t.done?"line-through":"none" }}>{t.text}</span>
              <button onClick={()=>deleteTodo(t.id)} style={{ color:ts, background:"none", border:"none", cursor:"pointer", fontSize:16 }}>×</button>
            </div>
          ))}
          {todos.length===0&&<p style={{ color:ts, fontSize:12, textAlign:"center" }}>No goals yet 🌸</p>}
        </div>
      </Card>

      {/* Quick nav */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
        {[["📊","Analytics","analytics"],["🏆","Ranks","leaderboard"],["🐱","My Cat","cat"]].map(([icon,label,pid])=>(
          <Card key={pid} dark={dark} style={{ padding:"12px 8px", textAlign:"center" }} onClick={()=>setPage(pid)}>
            <div style={{ fontSize:22 }}>{icon}</div>
            <div style={{ color:tp, fontWeight:700, fontSize:12, fontFamily:"'Nunito',sans-serif", marginTop:4 }}>{label}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
