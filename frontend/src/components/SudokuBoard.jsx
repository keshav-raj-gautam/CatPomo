import { memo } from "react";

const SudokuBoard = memo(function SudokuBoard({ grid, original, errors, selected, onSelect, dark }) {
  const tp = dark?"#F5C6D8":"#5D3A6B", gp = dark?"#E8B4D0":"#3D1A5B";
  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(9,1fr)", gap:2, width:"100%", maxWidth:360, margin:"0 auto" }}>
      {grid.map((row,r)=>row.map((cell,c)=>{
        const isSel   = selected?.[0]===r && selected?.[1]===c;
        const isGiv   = original[r][c]!==0;
        const hasErr  = !!errors[`${r},${c}`];
        const sameBox = selected ? Math.floor(selected[0]/3)===Math.floor(r/3)&&Math.floor(selected[1]/3)===Math.floor(c/3) : false;
        const sameLn  = selected ? selected[0]===r||selected[1]===c : false;
        let bg = "transparent";
        if (isSel)        bg="rgba(255,143,171,.33)";
        else if (hasErr)  bg="rgba(255,90,90,.18)";
        else if (sameBox) bg="rgba(201,160,220,.13)";
        else if (sameLn)  bg="rgba(255,255,255,.1)";
        return (
          <div key={`${r}-${c}`} onClick={()=>!isGiv&&onSelect([r,c])} style={{
            aspectRatio:"1", display:"flex", alignItems:"center", justifyContent:"center",
            borderRight:  c===2||c===5?"2.5px solid rgba(201,160,220,.5)":"1px solid rgba(201,160,220,.22)",
            borderBottom: r===2||r===5?"2.5px solid rgba(201,160,220,.5)":"1px solid rgba(201,160,220,.22)",
            background:bg, cursor:isGiv?"default":"pointer", borderRadius:4,
            fontSize:"clamp(13px,3.5vw,19px)", fontWeight:isGiv?800:600,
            fontFamily:"'Nunito',sans-serif", color:hasErr?"#FF5A5A":isGiv?gp:tp,
            transition:"background .12s", userSelect:"none",
          }}>{cell!==0?cell:""}</div>
        );
      }))}
    </div>
  );
});

export default SudokuBoard;
