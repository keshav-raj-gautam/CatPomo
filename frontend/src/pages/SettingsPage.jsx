import { useState, useEffect, useCallback } from "react";
import Card from "../components/Card.jsx";
import { AMBIENT_LIST } from "../utils/constants.js";

// NumInput — stores string locally, never shows NaN, clamps on blur/save
function NumInput({ label, value, onChange, min=1, max=120, unit="min", dark }) {
  const tp = dark?"#F5C6D8":"#5D3A6B", ts = dark?"#C9A0DC":"#9B72B0";
  const numVal = parseInt(value) || 0;
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"8px 0" }}>
      <span style={{ color:tp, fontSize:14, fontFamily:"'Nunito',sans-serif" }}>{label}</span>
      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        <button onClick={()=>onChange(String(Math.max(min, numVal-1)))}
          style={{ width:30,height:30,borderRadius:10,fontWeight:900,fontSize:18,lineHeight:1,background:"rgba(255,255,255,.25)",color:tp,border:"none",cursor:"pointer" }}>−</button>
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={e => onChange(e.target.value.replace(/[^0-9]/g,""))}
          onBlur={e  => onChange(String(Math.max(min, Math.min(max, parseInt(e.target.value)||min))))}
          style={{
            width:44, textAlign:"center", fontFamily:"'Nunito',sans-serif", fontWeight:800, fontSize:18,
            background:dark?"rgba(40,20,60,.5)":"rgba(255,255,255,.5)",
            border:"1.5px solid rgba(201,160,220,.35)", borderRadius:12, padding:"4px 0",
            color:tp, outline:"none",
          }}
        />
        <button onClick={()=>onChange(String(Math.min(max, numVal+1)))}
          style={{ width:30,height:30,borderRadius:10,fontWeight:900,fontSize:18,lineHeight:1,background:"rgba(255,255,255,.25)",color:tp,border:"none",cursor:"pointer" }}>+</button>
        <span style={{ color:ts, fontSize:12, width:28 }}>{unit}</span>
      </div>
    </div>
  );
}

export default function SettingsPage({ settings, setSettings, dark, setDark, ambient, setAmbient, user, setUser }) {
  const tp = dark?"#F5C6D8":"#5D3A6B", ts = dark?"#C9A0DC":"#9B72B0";

  // Local string state — no NaN ever shown to user
  const [loc, setLoc] = useState({
    focus:       String(settings.focus),
    shortBreak:  String(settings.shortBreak),
    longBreak:   String(settings.longBreak),
    interval:    String(settings.interval),
    autoStart:   settings.autoStart,
  });
  const [saved, setSaved] = useState(false);

  useEffect(()=>{
    setLoc({
      focus:      String(settings.focus),
      shortBreak: String(settings.shortBreak),
      longBreak:  String(settings.longBreak),
      interval:   String(settings.interval),
      autoStart:  settings.autoStart,
    });
  },[settings]);

  const save = useCallback(()=>{
    const parsed = {
      focus:       Math.max(1,  Math.min(120, parseInt(loc.focus)      || 25)),
      shortBreak:  Math.max(1,  Math.min(60,  parseInt(loc.shortBreak) || 5)),
      longBreak:   Math.max(1,  Math.min(120, parseInt(loc.longBreak)  || 15)),
      interval:    Math.max(2,  Math.min(8,   parseInt(loc.interval)   || 4)),
      autoStart:   loc.autoStart,
    };
    setSettings(parsed);
    setSaved(true);
    setTimeout(()=>setSaved(false), 2000);
  },[loc, setSettings]);

  const field = (key) => ({
    value: loc[key],
    onChange: (v) => setLoc(s=>({...s,[key]:v})),
  });

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      {/* Timer settings */}
      <Card dark={dark}>
        <div style={{ color:tp, fontWeight:800, fontSize:15, marginBottom:4, fontFamily:"'Nunito',sans-serif" }}>⏱️ Timer Durations</div>
        <p style={{ color:ts, fontSize:11, marginBottom:14 }}>Click +/− or type directly — changes apply on Save</p>
        <NumInput label="🎯 Focus"            dark={dark} min={1} max={120} unit="min" {...field("focus")}/>
        <NumInput label="☕ Short Break"      dark={dark} min={1} max={60}  unit="min" {...field("shortBreak")}/>
        <NumInput label="🌙 Long Break"       dark={dark} min={1} max={120} unit="min" {...field("longBreak")}/>
        <NumInput label="🔂 Long break every" dark={dark} min={2} max={8}   unit="sess" {...field("interval")}/>

        {/* Auto-start toggle */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"8px 0" }}>
          <span style={{ color:tp, fontSize:14, fontFamily:"'Nunito',sans-serif" }}>🔁 Auto-start next</span>
          <button onClick={()=>setLoc(s=>({...s,autoStart:!s.autoStart}))} style={{
            width:50, height:28, borderRadius:14, border:"none", cursor:"pointer", position:"relative",
            background:loc.autoStart?"#FF8FAB":"rgba(255,255,255,.22)", transition:"background .25s",
          }}>
            <div style={{
              width:22, height:22, borderRadius:"50%", background:"white",
              position:"absolute", top:3,
              left:loc.autoStart?25:3,
              transition:"left .25s cubic-bezier(.34,1.56,.64,1)",
              boxShadow:"0 1px 4px rgba(0,0,0,.2)",
            }}/>
          </button>
        </div>

        <button onClick={save} style={{
          width:"100%", marginTop:16, padding:"12px", borderRadius:20, fontWeight:900, fontSize:15,
          fontFamily:"'Nunito',sans-serif", border:"none", cursor:"pointer", transition:"all .3s",
          background:saved?"#7BC67E":"linear-gradient(135deg,#FF8FAB,#C9A0DC)",
          color:"white", boxShadow:"0 4px 18px rgba(255,143,171,.35)",
        }}>{saved?"✓ Saved! 🐾":"Save Settings"}</button>
      </Card>

      {/* Appearance */}
      <Card dark={dark}>
        <div style={{ color:tp, fontWeight:800, fontSize:15, marginBottom:14, fontFamily:"'Nunito',sans-serif" }}>🎨 Appearance</div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span style={{ color:tp, fontSize:14, fontFamily:"'Nunito',sans-serif" }}>{dark?"🌙 Dark Mode":"☀️ Light Mode"}</span>
          <button onClick={()=>setDark(d=>!d)} style={{
            padding:"8px 20px", borderRadius:18, fontWeight:800, fontSize:13,
            fontFamily:"'Nunito',sans-serif", border:"none", cursor:"pointer",
            background:dark?"#C9A0DC":"#FFD97D", color:dark?"white":"#5D3A6B",
          }}>Switch to {dark?"☀️ Light":"🌙 Dark"}</button>
        </div>
      </Card>

      {/* Ambient sounds */}
      <Card dark={dark}>
        <div style={{ color:tp, fontWeight:800, fontSize:15, marginBottom:14, fontFamily:"'Nunito',sans-serif" }}>🎵 Ambient Sounds</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
          {AMBIENT_LIST.map(s=>(
            <button key={s.id} onClick={()=>setAmbient(s.id)} style={{
              padding:"10px 6px", borderRadius:16, fontSize:12, fontWeight:700,
              fontFamily:"'Nunito',sans-serif", cursor:"pointer", transition:"all .2s",
              background:ambient===s.id?"linear-gradient(135deg,rgba(255,143,171,.3),rgba(201,160,220,.3))":"rgba(255,255,255,.18)",
              border:`1.5px solid ${ambient===s.id?"rgba(255,143,171,.5)":"transparent"}`,
              color:tp,
            }}>
              <div style={{ fontSize:20, marginBottom:3 }}>{s.icon}</div>{s.name}
            </button>
          ))}
        </div>
      </Card>

      {/* Shortcuts */}
      <Card dark={dark}>
        <div style={{ color:tp, fontWeight:800, fontSize:15, marginBottom:12, fontFamily:"'Nunito',sans-serif" }}>⌨️ Keyboard Shortcuts</div>
        {[["Space","Start / Pause"],["R","Reset timer"]].map(([k,d])=>(
          <div key={k} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"6px 0" }}>
            <span style={{ color:ts, fontSize:13 }}>{d}</span>
            <kbd style={{ padding:"3px 10px", borderRadius:8, fontWeight:700, fontSize:12, background:"rgba(255,255,255,.3)", color:tp, border:"1px solid rgba(201,160,220,.35)" }}>{k}</kbd>
          </div>
        ))}
      </Card>

      {/* Account */}
      <Card dark={dark}>
        <div style={{ color:tp, fontWeight:800, fontSize:15, marginBottom:10, fontFamily:"'Nunito',sans-serif" }}>👤 Account</div>
        <div style={{ color:ts, fontSize:13, marginBottom:12 }}>
          Logged in as <strong style={{ color:tp }}>{user.name}</strong>
        </div>
        <button onClick={()=>{
          if (confirm("Switch user? Your data stays in the database.")) {
            localStorage.removeItem("cp_user");
            window.location.reload();
          }
        }} style={{
          padding:"9px 18px", borderRadius:16, fontWeight:700, fontSize:13,
          fontFamily:"'Nunito',sans-serif", border:"1.5px solid rgba(201,160,220,.35)",
          background:"rgba(255,255,255,.15)", color:ts, cursor:"pointer",
        }}>Switch User</button>
      </Card>
    </div>
  );
}
