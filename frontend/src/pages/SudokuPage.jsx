import { useState, useCallback } from "react";
import Card from "../components/Card.jsx";
import SudokuBoard from "../components/SudokuBoard.jsx";
import { genSudoku } from "../utils/sudoku.js";
import { api } from "../utils/api.js";
import { Confetti } from "../components/Particles.jsx";

export default function SudokuPage({ user, setUser, dark }) {
  const tp = dark?"#F5C6D8":"#5D3A6B", ts = dark?"#C9A0DC":"#9B72B0";
  const [sudoku,   setSudoku]   = useState(null);
  const [selCell,  setSelCell]  = useState(null);
  const [confetti, setConfetti] = useState(false);

  const startGame = useCallback((diff)=>{
    const { puzzle, solution } = genSudoku(diff);
    setSudoku({ grid:puzzle.map(r=>[...r]), original:puzzle.map(r=>[...r]), solution, diff, errors:{}, solved:false, t0:Date.now() });
    setSelCell(null);
  },[]);

  const inputCell = useCallback((num)=>{
    if (!selCell || !sudoku) return;
    const [r,c] = selCell;
    if (sudoku.original[r][c] !== 0) return;
    setSudoku(s => {
      const grid = s.grid.map(row=>[...row]);
      grid[r][c] = num;
      const errs = { ...s.errors };
      const key  = `${r},${c}`;
      if (num!==0 && s.solution[r][c]!==num) errs[key]=true; else delete errs[key];
      const solved = grid.every((row,ri)=>row.every((v,ci)=>v===s.solution[ri][ci]));
      if (solved) {
        setConfetti(true);
        setTimeout(()=>setConfetti(false), 3000);
        // Persist to DB
        const newSolved = (user.sudoku_solved||0) + 1;
        api.patchStats(user.id, { sudoku_solved: newSolved }).then(updated => setUser(updated)).catch(()=>{});
      }
      return { ...s, grid, errors:errs, solved };
    });
  },[selCell, sudoku, user, setUser]);

  const diffColor = { easy:"#7BC67E", medium:"#FFD97D", hard:"#FF8FAB" };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      <Confetti active={confetti}/>
      <Card dark={dark}>
        <div style={{ color:tp, fontWeight:800, fontSize:16, marginBottom:4, fontFamily:"'Nunito',sans-serif" }}>🧩 Sudoku Break</div>
        <p style={{ color:ts, fontSize:12, marginBottom:14 }}>Recharge your brain during breaks</p>

        {/* Difficulty buttons */}
        <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
          {["easy","medium","hard"].map(d=>(
            <button key={d} onClick={()=>startGame(d)} style={{
              padding:"7px 18px", borderRadius:18, fontSize:13, fontWeight:800,
              fontFamily:"'Nunito',sans-serif", border:"none", cursor:"pointer", transition:"all .2s",
              background: sudoku?.diff===d ? diffColor[d] : "rgba(255,255,255,.22)",
              color: sudoku?.diff===d ? "white" : ts,
              boxShadow: sudoku?.diff===d ? `0 3px 12px ${diffColor[d]}55` : "none",
            }}>{d.charAt(0).toUpperCase()+d.slice(1)}</button>
          ))}
        </div>

        {!sudoku && (
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:12, padding:"24px 0" }}>
            <div style={{ fontSize:56, animation:"bob 2s ease-in-out infinite" }}>🧠</div>
            <p style={{ color:ts, fontSize:14 }}>Choose a difficulty to start!</p>
          </div>
        )}

        {sudoku?.solved && (
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:14, padding:"20px 0" }}>
            <div style={{ fontSize:56, animation:"bob .9s ease-in-out infinite" }}>🎉</div>
            <div style={{ color:tp, fontWeight:900, fontSize:22, fontFamily:"'Nunito',sans-serif" }}>Brain Recharge Complete!</div>
            <div style={{ color:ts, fontSize:13 }}>
              Solved in {Math.round((Date.now()-sudoku.t0)/60000)} min 🐱✨
            </div>
            <div style={{ color:ts, fontSize:12 }}>
              Total solved: {(user.sudoku_solved||0)} 🧩
            </div>
            <button onClick={()=>startGame(sudoku.diff)} style={{
              padding:"11px 28px", borderRadius:22, fontWeight:800, fontSize:14,
              fontFamily:"'Nunito',sans-serif", border:"none", cursor:"pointer",
              background:"linear-gradient(135deg,#FF8FAB,#C9A0DC)", color:"white",
              boxShadow:"0 4px 16px rgba(255,143,171,.4)",
            }}>Play Again 🧩</button>
          </div>
        )}

        {sudoku && !sudoku.solved && (
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:12 }}>
            <SudokuBoard
              grid={sudoku.grid} original={sudoku.original}
              errors={sudoku.errors} selected={selCell}
              onSelect={setSelCell} dark={dark}
            />
            {/* Number pad */}
            <div style={{ display:"flex", gap:6, flexWrap:"wrap", justifyContent:"center", marginTop:4 }}>
              {[1,2,3,4,5,6,7,8,9].map(n=>(
                <button key={n} onClick={()=>inputCell(n)} style={{
                  width:38, height:38, borderRadius:10, fontWeight:800, fontSize:17,
                  fontFamily:"'Nunito',sans-serif", cursor:"pointer",
                  background:dark?"rgba(201,160,220,.18)":"rgba(255,255,255,.55)",
                  color:tp, border:"1.5px solid rgba(201,160,220,.28)", transition:"all .15s",
                }}>{n}</button>
              ))}
              <button onClick={()=>inputCell(0)} style={{
                width:38, height:38, borderRadius:10, fontWeight:800, fontSize:14,
                background:"rgba(255,143,171,.15)", color:"#FF8FAB",
                border:"1.5px solid rgba(255,143,171,.3)", cursor:"pointer",
              }}>✕</button>
            </div>
            {Object.keys(sudoku.errors).length > 0 && (
              <p style={{ color:"#FF8FAB", fontSize:12, fontWeight:700 }}>
                {Object.keys(sudoku.errors).length} mistake{Object.keys(sudoku.errors).length!==1?"s":""} — keep going! 💪
              </p>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
