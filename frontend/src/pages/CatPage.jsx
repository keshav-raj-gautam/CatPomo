import { useState, useCallback } from "react";
import Card from "../components/Card.jsx";
import Cat from "../components/Cat.jsx";
import { ACCESSORIES, ACHIEVEMENTS } from "../utils/constants.js";
import { api } from "../utils/api.js";

export default function CatPage({ user, setUser, dark, catHappy, setCatHappy }) {
  const tp = dark?"#F5C6D8":"#5D3A6B", ts = dark?"#C9A0DC":"#9B72B0";

  const interact = useCallback(async (boost) => {
    setCatHappy(true);
    setTimeout(()=>setCatHappy(false), 2000);
    const newHappiness = Math.min(100, (user.cat_happiness||60) + boost);
    try {
      const updated = await api.patchStats(user.id, { cat_happiness: newHappiness });
      setUser(updated);
    } catch {}
  }, [user, setUser, setCatHappy]);

  const equip = useCallback(async (accId) => {
    try {
      const updated = await api.patchStats(user.id, { cat_accessory: accId });
      setUser(updated);
    } catch {}
  }, [user, setUser]);

  const happiness    = user.cat_happiness   || 60;
  const accessory    = user.cat_accessory   || "none";
  const unlocked     = user.unlocked_accessories || ["none"];
  const achievements = user.achievements    || [];

  const hapLabel = happiness>=80?"😻 Ecstatic!":happiness>=50?"😸 Happy":happiness>=30?"🙂 Content":"😿 Needs love";

  const nextUnlock = ACCESSORIES.find(a => !unlocked.includes(a.id) && (user.total_sessions||0) < a.unlockAt);

  // Auto-unlock accessories based on session count
  const shouldUnlock = ACCESSORIES.filter(a => !unlocked.includes(a.id) && (user.total_sessions||0) >= a.unlockAt);
  if (shouldUnlock.length > 0) {
    const newUnlocked = [...unlocked, ...shouldUnlock.map(a=>a.id)];
    api.patchStats(user.id, { unlocked_accessories: newUnlocked }).then(setUser).catch(()=>{});
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      {/* Cat card */}
      <Card dark={dark}>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:14 }}>
          <div style={{ color:tp, fontWeight:800, fontSize:16, fontFamily:"'Nunito',sans-serif" }}>🐱 Your Study Companion</div>
          <div style={{ transform:catHappy?"scale(1.12)":"scale(1)", transition:"transform .3s cubic-bezier(.34,1.56,.64,1)" }}>
            <Cat state={catHappy?"happy":"idle"} accessory={accessory} size={150}/>
          </div>
          <div style={{ color:tp, fontWeight:700, fontSize:14, fontFamily:"'Nunito',sans-serif" }}>{hapLabel}</div>

          {/* Happiness bar */}
          <div style={{ width:"100%" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
              <span style={{ color:ts, fontSize:12 }}>Happiness</span>
              <span style={{ color:"#FF8FAB", fontWeight:800, fontSize:12 }}>{happiness}%</span>
            </div>
            <div style={{ height:12, borderRadius:8, background:"rgba(255,255,255,.2)" }}>
              <div style={{
                height:"100%", borderRadius:8, width:`${happiness}%`,
                background:"linear-gradient(90deg,#FF8FAB,#C9A0DC)",
                transition:"width .6s cubic-bezier(.34,1.56,.64,1)",
              }}/>
            </div>
            <p style={{ color:ts, fontSize:11, marginTop:4 }}>Complete sessions to boost happiness 🐾</p>
          </div>

          {/* Interact */}
          <div style={{ display:"flex", gap:10, flexWrap:"wrap", justifyContent:"center" }}>
            {[["🐟 Feed",6],["💖 Pet",4],["🎮 Play",3]].map(([l,b])=>(
              <button key={l} onClick={()=>interact(b)} style={{
                padding:"10px 16px", borderRadius:18, fontWeight:800, fontSize:13,
                fontFamily:"'Nunito',sans-serif", border:"1.5px solid rgba(255,143,171,.35)",
                cursor:"pointer", background:"rgba(255,143,171,.18)", color:tp, transition:"all .2s",
              }}>{l}</button>
            ))}
          </div>
        </div>
      </Card>

      {/* Accessories */}
      <Card dark={dark}>
        <div style={{ color:tp, fontWeight:800, fontSize:15, marginBottom:14, fontFamily:"'Nunito',sans-serif" }}>🎀 Accessories</div>
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {ACCESSORIES.map(acc=>{
            const isUnlocked = unlocked.includes(acc.id) || (user.total_sessions||0) >= acc.unlockAt;
            const equipped   = accessory === acc.id;
            return (
              <div key={acc.id} style={{ display:"flex", alignItems:"center", gap:12, opacity:isUnlocked?1:.42, transition:"opacity .3s" }}>
                <div style={{
                  width:44, height:44, borderRadius:14, fontSize:24,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  background:equipped?"linear-gradient(135deg,rgba(255,143,171,.3),rgba(201,160,220,.3))":"rgba(255,255,255,.12)",
                  border:equipped?"2px solid rgba(255,143,171,.5)":"2px solid transparent",
                }}>{acc.icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ color:tp, fontWeight:700, fontSize:13, fontFamily:"'Nunito',sans-serif" }}>{acc.name}</div>
                  <div style={{ color:ts, fontSize:11 }}>
                    {isUnlocked ? "🔓 Unlocked" : `🔒 Unlock at ${acc.unlockAt} sessions (${acc.unlockAt-(user.total_sessions||0)} to go)`}
                  </div>
                </div>
                {isUnlocked && (
                  <button onClick={()=>equip(acc.id)} style={{
                    padding:"6px 14px", borderRadius:16, fontSize:12, fontWeight:800,
                    fontFamily:"'Nunito',sans-serif", border:"none", cursor:"pointer",
                    background:equipped?"#FF8FAB":"rgba(255,255,255,.22)",
                    color:equipped?"white":ts, transition:"all .2s",
                  }}>{equipped?"✓ On":"Equip"}</button>
                )}
              </div>
            );
          })}
        </div>
        {nextUnlock && (
          <div style={{ marginTop:12, padding:"10px 14px", borderRadius:14, background:"rgba(255,143,171,.1)", border:"1px solid rgba(255,143,171,.2)" }}>
            <p style={{ color:tp, fontSize:12, fontWeight:700, fontFamily:"'Nunito',sans-serif" }}>
              🌟 Next: {nextUnlock.name} {nextUnlock.icon}
            </p>
            <p style={{ color:ts, fontSize:11 }}>
              {nextUnlock.unlockAt-(user.total_sessions||0)} more sessions to go!
            </p>
          </div>
        )}
      </Card>

      {/* Earned achievements */}
      {achievements.length > 0 && (
        <Card dark={dark}>
          <div style={{ color:tp, fontWeight:800, fontSize:15, marginBottom:10, fontFamily:"'Nunito',sans-serif" }}>
            🏆 Earned Badges
          </div>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {ACHIEVEMENTS.filter(a=>achievements.includes(a.id)).map(a=>(
              <div key={a.id} title={a.name} style={{
                width:44, height:44, borderRadius:12, fontSize:22,
                display:"flex", alignItems:"center", justifyContent:"center",
                background:"linear-gradient(135deg,rgba(255,143,171,.25),rgba(201,160,220,.25))",
                border:"1.5px solid rgba(255,143,171,.35)",
              }}>{a.icon}</div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
