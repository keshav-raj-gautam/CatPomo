import { useState, useEffect, useRef, useCallback } from "react";
import "./index.css";

import { timerAtom } from "./components/Timer.jsx";
import { Particles, Confetti } from "./components/Particles.jsx";
import Onboarding    from "./pages/Onboarding.jsx";
import HomePage      from "./pages/HomePage.jsx";
import FocusPage     from "./pages/FocusPage.jsx";
import AnalyticsPage from "./pages/AnalyticsPage.jsx";
import LeaderboardPage from "./pages/LeaderboardPage.jsx";
import SudokuPage    from "./pages/SudokuPage.jsx";
import CatPage       from "./pages/CatPage.jsx";
import SettingsPage  from "./pages/SettingsPage.jsx";

import { api } from "./utils/api.js";
import { ACHIEVEMENTS, INIT_SETTINGS, NAV_ITEMS } from "./utils/constants.js";

// ── localStorage helpers ─────────────────────────────────────────────────────
const ld = (k,d)=>{ try{ const v=localStorage.getItem(k); return v?JSON.parse(v):d; } catch{ return d; } };
const sv = (k,v)=>{ try{ localStorage.setItem(k,JSON.stringify(v)); } catch{} };

export default function App() {
  // ── User (from DB) ────────────────────────────────────────────────────────
  const [user,     setUser]     = useState(()=>ld("cp_user", null));
  const [dark,     setDark]     = useState(()=>ld("cp_dark", false));
  const [settings, setSettings] = useState(()=>ld("cp_settings", INIT_SETTINGS));
  const [ambient,  setAmbient]  = useState("none");
  const [page,     setPage]     = useState("home");

  // ── Timer control (NOT timeLeft — that's in timerAtom) ────────────────────
  const [mode,      setModeState] = useState("focus");
  const [running,   setRunning]   = useState(false);
  const [sessCount, setSessCount] = useState(0);

  // ── UI ─────────────────────────────────────────────────────────────────────
  const [confetti, setConfetti] = useState(false);
  const [catHappy, setCatHappy] = useState(false);

  // ── Persist settings + dark ────────────────────────────────────────────────
  useEffect(()=>sv("cp_dark",     dark),     [dark]);
  useEffect(()=>sv("cp_settings", settings), [settings]);
  useEffect(()=>sv("cp_user",     user),     [user]);

  // ── Timer helpers ──────────────────────────────────────────────────────────
  const totalFor = useCallback((m, s=settings) =>
    m==="focus" ? s.focus*60 : m==="shortBreak" ? s.shortBreak*60 : s.longBreak*60
  ,[settings]);

  const switchMode = useCallback((m)=>{
    setRunning(false); setModeState(m);
    const t=totalFor(m); timerAtom.set({timeLeft:t, total:t});
  },[totalFor]);

  const resetTimer = useCallback(()=>{
    setRunning(false);
    const t=totalFor(mode); timerAtom.set({timeLeft:t, total:t});
  },[mode,totalFor]);

  // When settings change (focus duration etc.) while paused, reset atom
  useEffect(()=>{
    if (!running) {
      const t=totalFor(mode,settings);
      timerAtom.set({timeLeft:t, total:t});
    }
  },[settings]); // eslint-disable-line

  // ── Refs for stable closure in interval ───────────────────────────────────
  const modeRef     = useRef(mode);
  const sessRef     = useRef(sessCount);
  const settingsRef = useRef(settings);
  const userRef     = useRef(user);
  useEffect(()=>{ modeRef.current=mode; },         [mode]);
  useEffect(()=>{ sessRef.current=sessCount; },    [sessCount]);
  useEffect(()=>{ settingsRef.current=settings; }, [settings]);
  useEffect(()=>{ userRef.current=user; },         [user]);

  // ── Session complete handler ───────────────────────────────────────────────
  const onComplete = useCallback(()=>{
    setRunning(false);
    const now=new Date(), hr=now.getHours();
    const m=modeRef.current, s=settingsRef.current, u=userRef.current;

    if (m==="focus") {
      setSessCount(n=>n+1);
      setConfetti(true); setTimeout(()=>setConfetti(false),3200);
      setCatHappy(true);  setTimeout(()=>setCatHappy(false), 3200);

      if ("Notification"in window && Notification.permission==="granted")
        new Notification("🐱 Session Complete!",{body:"Time for a break, meow~ ✨"});

      // Persist session + update user aggregates via API
      if (u) {
        api.addSession({ user_id:u.id, mode:"focus", duration:s.focus, completed:true })
          .then(()=> {
            // Patch extra fields DB trigger doesn't cover
            const patches = {};
            if (hr>=22) patches.night_study  = true;
            if (hr<8)   patches.morning_study = true;

            // Check for new achievements
            const prospective = {
              ...u,
              total_sessions: (u.total_sessions||0)+1,
              total_minutes:  (u.total_minutes||0)+s.focus,
              today_sessions: (u.today_sessions||0)+1,
              night_study:    u.night_study  || hr>=22,
              morning_study:  u.morning_study || hr<8,
            };
            const newAchievements = ACHIEVEMENTS.filter(a=>a.req(prospective)).map(a=>a.id);
            if (newAchievements.length > (u.achievements||[]).length)
              patches.achievements = newAchievements;

            if (Object.keys(patches).length)
              return api.patchStats(u.id, patches);
          })
          .then(updated => { if (updated) setUser(updated); })
          // Re-fetch full user to get updated totals from DB triggers
          .then(()=> api.getUser(u.id))
          .then(fresh=> setUser(fresh))
          .catch(console.error);
      }

      // Switch to break
      const isLong = (sessRef.current+1) % s.interval === 0;
      const next   = isLong ? "longBreak" : "shortBreak";
      setModeState(next);
      const t = next==="shortBreak" ? s.shortBreak*60 : s.longBreak*60;
      timerAtom.set({timeLeft:t, total:t});
      if (s.autoStart) setTimeout(()=>setRunning(true), 600);
    } else {
      setModeState("focus");
      timerAtom.set({timeLeft:s.focus*60, total:s.focus*60});
      if (s.autoStart) setTimeout(()=>setRunning(true), 600);
    }
  },[]);

  const onCompleteRef = useRef(onComplete);
  useEffect(()=>{ onCompleteRef.current=onComplete; },[onComplete]);

  // ── Tick engine ────────────────────────────────────────────────────────────
  useEffect(()=>{
    if (!running) return;
    const id = setInterval(()=>{
      const cur = timerAtom.get();
      if (cur.timeLeft<=1) {
        clearInterval(id); timerAtom.set({timeLeft:0});
        setTimeout(()=>onCompleteRef.current(), 0);
      } else {
        timerAtom.set({timeLeft:cur.timeLeft-1});
      }
    },1000);
    return ()=>clearInterval(id);
  },[running]);

  // ── Keyboard ───────────────────────────────────────────────────────────────
  useEffect(()=>{
    const h=e=>{
      if(["INPUT","TEXTAREA"].includes(e.target.tagName)) return;
      if(e.code==="Space"){ e.preventDefault(); setRunning(r=>!r); }
      if(e.key==="r"||e.key==="R") resetTimer();
    };
    window.addEventListener("keydown",h);
    return ()=>window.removeEventListener("keydown",h);
  },[resetTimer]);

  useEffect(()=>{
    if("Notification"in window&&Notification.permission==="default")
      Notification.requestPermission();
  },[]);

  // ── Derived ────────────────────────────────────────────────────────────────
  const isBreak  = mode!=="focus";
  const catState = catHappy?"happy": running&&!isBreak?"studying": isBreak?"break":"idle";
  const tp = dark?"#F5C6D8":"#5D3A6B", ts = dark?"#C9A0DC":"#9B72B0";

  const bg = dark
    ? "linear-gradient(135deg,#1a0a2e 0%,#2d1040 45%,#0f1535 100%)"
    : "linear-gradient(135deg,#FFE0EC 0%,#EDD5F5 45%,#D5E8F5 100%)";

  // ── Onboarding gate ────────────────────────────────────────────────────────
  if (!user) {
    return <Onboarding onDone={setUser} dark={dark}/>;
  }

  // ── Shared props ───────────────────────────────────────────────────────────
  const timerProps = { user, dark, mode, running, setRunning, setMode:setModeState, resetTimer, switchMode, sessCount, catState, isBreak, setPage };

  const PAGES = {
    home:        <HomePage      {...timerProps} setUser={setUser}/>,
    focus:       <FocusPage     {...timerProps}/>,
    analytics:   <AnalyticsPage user={user} dark={dark}/>,
    leaderboard: <LeaderboardPage user={user} dark={dark}/>,
    sudoku:      <SudokuPage    user={user} setUser={setUser} dark={dark}/>,
    cat:         <CatPage       user={user} setUser={setUser} dark={dark} catHappy={catHappy} setCatHappy={setCatHappy}/>,
    settings:    <SettingsPage  settings={settings} setSettings={setSettings} dark={dark} setDark={setDark} ambient={ambient} setAmbient={setAmbient} user={user} setUser={setUser}/>,
  };

  return (
    <div style={{ minHeight:"100vh", background:bg, paddingBottom:88, transition:"background .4s" }}>
      <Particles/>
      <Confetti active={confetti}/>

      {/* Header */}
      <div style={{
        padding:"14px 18px 0", position:"relative", zIndex:10,
        display:"flex", alignItems:"center", justifyContent:"space-between",
      }}>
        <div>
          <h1 style={{
            fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:22, lineHeight:1,
            background:"linear-gradient(135deg,#FF8FAB,#C9A0DC)",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
          }}>🐱 CatPomo</h1>
          <p style={{ color:ts, fontSize:11 }}>Hey {user.name}~ study with your kitty!</p>
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          {running && (
            <div style={{
              padding:"3px 10px", borderRadius:20,
              background:"rgba(255,143,171,.25)", color:"#FF8FAB",
              fontSize:11, fontWeight:700, animation:"pulse 1.5s ease-in-out infinite",
            }}>● LIVE</div>
          )}
          <button onClick={()=>setDark(d=>!d)} style={{ background:"none", border:"none", fontSize:20, cursor:"pointer" }}>
            {dark?"☀️":"🌙"}
          </button>
        </div>
      </div>

      {/* Page content */}
      <div style={{ maxWidth:520, margin:"0 auto", padding:"14px 14px 0", position:"relative", zIndex:10 }}>
        <div key={page} style={{ animation:"fadein .3s ease" }}>
          {PAGES[page] || PAGES.home}
        </div>
      </div>

      {/* Bottom Nav */}
      <nav style={{
        position:"fixed", bottom:0, left:0, right:0, zIndex:40,
        display:"flex", justifyContent:"space-around",
        background:dark?"rgba(20,8,40,.92)":"rgba(255,255,255,.82)",
        backdropFilter:"blur(20px)",
        borderTop:`1px solid ${dark?"rgba(201,160,220,.14)":"rgba(255,143,171,.18)"}`,
        paddingTop:6, paddingBottom:10,
      }}>
        {NAV_ITEMS.map(({id,icon,label})=>(
          <button key={id} onClick={()=>setPage(id)} style={{
            display:"flex", flexDirection:"column", alignItems:"center", gap:1,
            background:"none", border:"none", cursor:"pointer",
            fontFamily:"'Nunito',sans-serif",
            color:page===id?"#FF8FAB":dark?"#9B72B0":"#C9A0DC",
            transform:page===id?"scale(1.1)":"scale(1)",
            fontWeight:page===id?800:600, transition:"all .2s", minWidth:42,
          }}>
            <span style={{ fontSize:20 }}>{icon}</span>
            <span style={{ fontSize:9 }}>{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
