import { useState } from "react";
import { api } from "../utils/api.js";
import Cat from "../components/Cat.jsx";

export default function Onboarding({ onDone, dark }) {
  const [name,    setName]    = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const tp = dark ? "#F5C6D8" : "#5D3A6B";
  const ts = dark ? "#C9A0DC" : "#9B72B0";
  const bg = dark
    ? "linear-gradient(135deg,#1a0a2e 0%,#2d1040 45%,#0f1535 100%)"
    : "linear-gradient(135deg,#FFE0EC 0%,#EDD5F5 45%,#D5E8F5 100%)";

  async function submit(e) {
    e.preventDefault();
    if (!name.trim()) return setError("Please enter your name 🐾");
    setLoading(true);
    setError("");
    try {
      const user = await api.createUser(name.trim());
      // Persist user id so the app doesn't ask again on reload
      localStorage.setItem("cp_user", JSON.stringify(user));
      onDone(user);
    } catch (err) {
      setError(err.message || "Could not connect to server. Is the API running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight:"100vh", background:bg,
      display:"flex", alignItems:"center", justifyContent:"center",
      padding:20, animation:"fadein .5s ease",
    }}>
      <div style={{
        background: dark?"rgba(40,20,60,.75)":"rgba(255,255,255,.55)",
        backdropFilter:"blur(20px)",
        border:`1.5px solid ${dark?"rgba(201,160,220,.2)":"rgba(255,255,255,.7)"}`,
        borderRadius:32, padding:"40px 36px", maxWidth:380, width:"100%",
        boxShadow:"0 16px 48px rgba(255,143,171,.18)",
        textAlign:"center",
      }}>
        <div style={{ display:"flex", justifyContent:"center", marginBottom:16 }}>
          <Cat state="idle" size={130}/>
        </div>

        <h1 style={{
          fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:28, lineHeight:1.2,
          background:"linear-gradient(135deg,#FF8FAB,#C9A0DC)",
          WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
          marginBottom:8,
        }}>Welcome to CatPomo!</h1>

        <p style={{ color:ts, fontSize:14, marginBottom:28, lineHeight:1.6 }}>
          Your cozy study companion 🐾<br/>
          What should your kitty call you?
        </p>

        <form onSubmit={submit} style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <input
            value={name}
            onChange={e=>setName(e.target.value)}
            placeholder="Your name…"
            maxLength={40}
            autoFocus
            style={{
              padding:"13px 18px", borderRadius:18, fontSize:16, fontWeight:700,
              fontFamily:"'Nunito',sans-serif", outline:"none",
              background: dark?"rgba(40,20,60,.5)":"rgba(255,255,255,.6)",
              border:`2px solid ${error?"#FF5A5A":"rgba(201,160,220,.4)"}`,
              color:tp, textAlign:"center",
              transition:"border .2s",
            }}
          />
          {error && (
            <p style={{ color:"#FF5A5A", fontSize:12, fontWeight:700 }}>{error}</p>
          )}
          <button type="submit" disabled={loading} style={{
            padding:"13px", borderRadius:20, fontWeight:900, fontSize:16,
            fontFamily:"'Nunito',sans-serif", border:"none", cursor:loading?"not-allowed":"pointer",
            background: loading?"rgba(201,160,220,.5)":"linear-gradient(135deg,#FF8FAB,#C9A0DC)",
            color:"white", boxShadow:"0 4px 20px rgba(255,143,171,.4)",
            transition:"all .2s",
          }}>
            {loading ? "Connecting… 🐾" : "Start Studying! 🚀"}
          </button>
        </form>

        <p style={{ color:ts, fontSize:11, marginTop:16 }}>
          Your progress is saved to the database ✨
        </p>
      </div>
    </div>
  );
}
