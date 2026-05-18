import { useState, useEffect, useCallback } from "react";
import Card from "../components/Card.jsx";
import { api } from "../utils/api.js";

const CATEGORIES = [
  { id:"sessions", label:"Sessions" },
  { id:"hours",    label:"Hours"    },
  { id:"streak",   label:"Streak"   },
  { id:"score",    label:"Score"    },
];

const MEDALS = ["🥇","🥈","🥉"];
const BADGE  = (rank) => rank<=3 ? MEDALS[rank-1] : "🏅";

function ValueLabel({ cat, row }) {
  if (cat==="sessions") return <>{row.total_sessions} sess</>;
  if (cat==="hours")    return <>{row.total_hours}h</>;
  if (cat==="streak")   return <>{row.streak}d</>;
  return <>{row.focus_score}pts</>;
}

export default function LeaderboardPage({ user, dark }) {
  const tp = dark?"#F5C6D8":"#5D3A6B", ts = dark?"#C9A0DC":"#9B72B0";
  const [cat,      setCat]      = useState("sessions");
  const [rows,     setRows]     = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [err,      setErr]      = useState("");

  const load = useCallback(async (c)=>{
    setLoading(true); setErr("");
    try {
      const data = await api.getLeaderboard(c);
      setRows(data);
    } catch(e) {
      setErr("Could not load leaderboard — is the API running?");
    } finally { setLoading(false); }
  },[]);

  useEffect(()=>{ load(cat); },[cat]);

  const myRow = rows.find(r=>r.id===user.id);
  const myRank = myRow ? Number(myRow.rank) : "—";

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      {/* My rank */}
      <Card dark={dark} style={{ background:dark?"linear-gradient(135deg,rgba(255,143,171,.18),rgba(201,160,220,.18))":"linear-gradient(135deg,rgba(255,224,236,.9),rgba(237,213,245,.9))" }}>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <div style={{ width:52, height:52, borderRadius:"50%", background:"linear-gradient(135deg,#FF8FAB,#C9A0DC)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0 }}>😺</div>
          <div style={{ flex:1 }}>
            <div style={{ color:tp, fontWeight:900, fontSize:16, fontFamily:"'Nunito',sans-serif" }}>{user.name}</div>
            <div style={{ color:ts, fontSize:12 }}>{user.total_sessions||0} sessions · {Math.round((user.total_minutes||0)/60*10)/10}h · {user.streak||0}d streak</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ color:"#FF8FAB", fontWeight:900, fontSize:24, fontFamily:"'Nunito',sans-serif" }}>#{myRank}</div>
            <div style={{ color:ts, fontSize:10 }}>your rank</div>
          </div>
        </div>
      </Card>

      {/* Category tabs */}
      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        {CATEGORIES.map(c=>(
          <button key={c.id} onClick={()=>setCat(c.id)} style={{
            padding:"6px 14px", borderRadius:20, fontSize:12, fontWeight:700,
            fontFamily:"'Nunito',sans-serif", border:"none", cursor:"pointer", transition:"all .2s",
            background:cat===c.id?"#FF8FAB":"rgba(255,255,255,.2)",
            color:cat===c.id?"white":ts,
          }}>{c.label}</button>
        ))}
      </div>

      {/* List */}
      <Card dark={dark}>
        <div style={{ color:tp, fontWeight:800, fontSize:15, marginBottom:14, fontFamily:"'Nunito',sans-serif" }}>
          🏆 Global Rankings — {CATEGORIES.find(c=>c.id===cat)?.label}
        </div>

        {loading && (
          <div style={{ textAlign:"center", padding:"32px 0" }}>
            <div style={{ fontSize:36, animation:"spin 1s linear infinite", display:"inline-block" }}>🐾</div>
            <p style={{ color:ts, marginTop:8, fontSize:13 }}>Loading…</p>
          </div>
        )}

        {err && <p style={{ color:"#FF5A5A", fontSize:13, textAlign:"center", padding:"16px 0" }}>{err}</p>}

        {!loading && !err && rows.length === 0 && (
          <div style={{ textAlign:"center", padding:"32px 0" }}>
            <div style={{ fontSize:40 }}>🐾</div>
            <p style={{ color:ts, fontSize:13, marginTop:8 }}>No entries yet — complete a session to appear here!</p>
          </div>
        )}

        {!loading && !err && rows.length > 0 && (
          <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
            {rows.map((row,i)=>{
              const isTop3  = Number(row.rank)<=3;
              const isMe    = row.id===user.id;
              return (
                <div key={row.id} style={{
                  display:"flex", alignItems:"center", gap:12,
                  padding:"10px 12px", borderRadius:16,
                  background: isMe
                    ? "linear-gradient(135deg,rgba(255,143,171,.2),rgba(201,160,220,.2))"
                    : isTop3?"rgba(255,143,171,.1)":"rgba(255,255,255,.05)",
                  border: isMe
                    ? "1.5px solid rgba(255,143,171,.5)"
                    : isTop3?"1px solid rgba(255,143,171,.2)":"1px solid transparent",
                  animation:`rankslide .25s ${i*0.05}s ease both`,
                }}>
                  <div style={{ width:28, textAlign:"center", fontWeight:900, fontSize:isTop3?20:14 }}>
                    {BADGE(Number(row.rank))}
                  </div>
                  <div style={{
                    width:40, height:40, borderRadius:"50%", flexShrink:0,
                    background:isTop3?"linear-gradient(135deg,#FF8FAB,#C9A0DC)":"rgba(255,255,255,.15)",
                    display:"flex", alignItems:"center", justifyContent:"center", fontSize:20,
                  }}>🐱</div>
                  <div style={{ flex:1 }}>
                    <div style={{ color:isMe?"#FF8FAB":tp, fontWeight:800, fontSize:13, fontFamily:"'Nunito',sans-serif" }}>
                      {row.name}{isMe?" (you)":""}
                    </div>
                    <div style={{ color:ts, fontSize:11 }}>
                      {row.total_sessions} sess · {row.total_hours}h · {row.streak}d streak
                    </div>
                  </div>
                  <div style={{ color:isTop3?"#FF8FAB":tp, fontWeight:900, fontSize:14, fontFamily:"'Nunito',sans-serif" }}>
                    <ValueLabel cat={cat} row={row}/>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
