import { useState, useEffect, useMemo } from "react";
import Card from "../components/Card.jsx";
import { BarChart, Heatmap, DonutChart } from "../components/Charts.jsx";
import { ACHIEVEMENTS } from "../utils/constants.js";
import { api } from "../utils/api.js";

export default function AnalyticsPage({ user, dark }) {
  const tp = dark?"#F5C6D8":"#5D3A6B", ts = dark?"#C9A0DC":"#9B72B0";
  const [dbStats, setDbStats] = useState({ daily90:[], week:[] });

  useEffect(()=>{
    api.getUserStats(user.id).then(setDbStats).catch(()=>{});
  },[user.id]);

  // Build heatmap dict from DB rows
  const dailyMap = useMemo(()=>{
    const m={};
    dbStats.daily90.forEach(r=>{ m[new Date(r.day).toDateString()]=Number(r.sessions); });
    return m;
  },[dbStats.daily90]);

  // Week bar data (last 7 days)
  const weekData = useMemo(()=>{
    const days=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    return Array.from({length:7},(_,i)=>{
      const d=new Date(); d.setDate(d.getDate()-(6-i));
      const row=dbStats.week.find(r=>new Date(r.day).toDateString()===d.toDateString());
      return { l:days[d.getDay()], v:row?Number(row.sessions):0 };
    });
  },[dbStats.week]);

  const focusScore = user.focus_score || 0;
  const achievements = user.achievements || [];

  const insights = useMemo(()=>{
    const ins=[];
    if (user.night_study)  ins.push("🦉 You focus well in the evenings — keep it up!");
    if (user.morning_study)ins.push("☀️ Morning sessions detected — early scholar!");
    if ((user.streak||0)>=3) ins.push(`🔥 ${user.streak}-day streak! Consistency is your superpower.`);
    if ((user.total_sessions||0)>=10) ins.push(`📚 ${user.total_sessions} sessions completed!`);
    if ((user.total_minutes||0)>0){
      const avg=Math.round(user.total_minutes/Math.max(user.total_sessions,1));
      ins.push(`⏱️ Average session: ${avg} min — ${avg>=25?"great focus!":"try longer sessions!"}`);
    }
    if (focusScore>=70) ins.push("💯 Excellent focus score! Keep the momentum.");
    if (ins.length===0) ins.push("🐾 Start your first session to unlock personalised insights!");
    return ins;
  },[user,focusScore]);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      {/* Score banner */}
      <Card dark={dark} style={{ background:dark?"linear-gradient(135deg,rgba(255,143,171,.2),rgba(201,160,220,.2))":"linear-gradient(135deg,rgba(255,224,236,.8),rgba(237,213,245,.8))" }}>
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:42, fontWeight:900, fontFamily:"'Nunito',sans-serif",
              background:"linear-gradient(135deg,#FF8FAB,#C9A0DC)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
              {focusScore}
            </div>
            <div style={{ color:ts, fontSize:11 }}>Focus Score</div>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ height:8, borderRadius:6, background:"rgba(255,255,255,.25)", marginBottom:6 }}>
              <div style={{ height:"100%", borderRadius:6, width:`${focusScore}%`, background:"linear-gradient(90deg,#FF8FAB,#C9A0DC)", transition:"width .8s" }}/>
            </div>
            <div style={{ color:tp, fontSize:12, fontWeight:700 }}>
              {focusScore>=80?"🌟 Excellent!":focusScore>=50?"📈 Good progress!":"🌱 Keep building!"}
            </div>
          </div>
        </div>
      </Card>

      {/* Stats grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
        {[
          ["🎯","Sessions",user.total_sessions||0],
          ["⏱️","Hours",`${Math.round((user.total_minutes||0)/60*10)/10}h`],
          ["🔥","Streak",`${user.streak||0}d`],
          ["⭐","Today",user.today_sessions||0],
          ["🏆","Best",`${user.best_streak||0}d`],
          ["🧩","Sudoku",user.sudoku_solved||0],
        ].map(([icon,label,val])=>(
          <Card key={label} dark={dark} style={{ padding:"13px 10px", textAlign:"center" }}>
            <div style={{ fontSize:20, marginBottom:3 }}>{icon}</div>
            <div style={{ color:tp, fontWeight:900, fontSize:22, fontFamily:"'Nunito',sans-serif", lineHeight:1 }}>{val}</div>
            <div style={{ color:ts, fontSize:10, marginTop:2 }}>{label}</div>
          </Card>
        ))}
      </div>

      {/* Week chart */}
      <Card dark={dark}>
        <div style={{ color:tp, fontWeight:800, fontSize:15, marginBottom:14, fontFamily:"'Nunito',sans-serif" }}>📅 This Week</div>
        <BarChart data={weekData} dark={dark} height={100}/>
      </Card>

      {/* Heatmap */}
      <Card dark={dark}>
        <div style={{ color:tp, fontWeight:800, fontSize:15, marginBottom:12, fontFamily:"'Nunito',sans-serif" }}>🗓️ 90-Day Activity</div>
        <Heatmap daily={dailyMap} dark={dark}/>
        <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:8 }}>
          <span style={{ color:ts, fontSize:10 }}>Less</span>
          {[0.1,0.3,0.5,0.7,1].map(o=>(
            <div key={o} style={{ width:10, height:10, borderRadius:2, background:`rgba(255,143,171,${o})` }}/>
          ))}
          <span style={{ color:ts, fontSize:10 }}>More</span>
        </div>
      </Card>

      {/* Donut */}
      <Card dark={dark}>
        <div style={{ color:tp, fontWeight:800, fontSize:15, marginBottom:14, fontFamily:"'Nunito',sans-serif" }}>⏰ Time Breakdown</div>
        <div style={{ display:"flex", alignItems:"center", gap:20 }}>
          <DonutChart size={110} segments={[
            { v:user.total_sessions||0, color:"#FF8FAB" },
            { v:Math.max(1,Math.round((user.total_sessions||0)*0.3)), color:"#C9A0DC" },
            { v:Math.max(1,user.sudoku_solved||0), color:"#87CEEB" },
          ]}/>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {[["#FF8FAB","Focus sessions",user.total_sessions||0],
              ["#C9A0DC","Break sessions",Math.round((user.total_sessions||0)*0.3)],
              ["#87CEEB","Sudoku games",user.sudoku_solved||0]].map(([col,lbl,val])=>(
              <div key={lbl} style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ width:10, height:10, borderRadius:"50%", background:col, flexShrink:0 }}/>
                <span style={{ color:ts, fontSize:12 }}>{lbl}</span>
                <span style={{ color:tp, fontWeight:800, fontSize:12, marginLeft:"auto" }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Insights */}
      <Card dark={dark}>
        <div style={{ color:tp, fontWeight:800, fontSize:15, marginBottom:12, fontFamily:"'Nunito',sans-serif" }}>💡 Your Insights</div>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {insights.map((ins,i)=>(
            <div key={i} style={{
              padding:"10px 14px", borderRadius:14,
              background:dark?"rgba(255,143,171,.12)":"rgba(255,224,236,.6)",
              border:"1px solid rgba(255,143,171,.25)",
              color:tp, fontSize:13, fontFamily:"'Nunito',sans-serif", fontWeight:600,
              animation:`slideup .3s ${i*0.08}s ease both`,
            }}>{ins}</div>
          ))}
        </div>
      </Card>

      {/* Achievements */}
      <Card dark={dark}>
        <div style={{ color:tp, fontWeight:800, fontSize:15, marginBottom:14, fontFamily:"'Nunito',sans-serif" }}>
          🏆 Achievements ({achievements.length}/{ACHIEVEMENTS.length})
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:10 }}>
          {ACHIEVEMENTS.map(a=>{
            const earned = achievements.includes(a.id);
            return (
              <div key={a.id} style={{
                display:"flex", flexDirection:"column", alignItems:"center", gap:6,
                padding:"12px 8px", borderRadius:16, textAlign:"center",
                opacity:earned?1:.38,
                background:earned?"linear-gradient(135deg,rgba(255,143,171,.2),rgba(201,160,220,.2))":"rgba(255,255,255,.06)",
                border:`1.5px solid ${earned?"rgba(255,143,171,.4)":"transparent"}`,
              }}>
                <div style={{ fontSize:26 }}>{a.icon}</div>
                <div style={{ color:tp, fontWeight:700, fontSize:12, fontFamily:"'Nunito',sans-serif" }}>{a.name}</div>
                <div style={{ color:ts, fontSize:10 }}>{a.desc}</div>
                {earned&&<div style={{ fontSize:10, color:"#FF8FAB", fontWeight:700 }}>✓ Earned</div>}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
