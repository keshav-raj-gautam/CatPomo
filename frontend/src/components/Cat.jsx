import { memo } from "react";
import { ACCESSORIES } from "../utils/constants.js";

const Cat = memo(function Cat({ state = "idle", accessory = "none", size = 120 }) {
  const acc = ACCESSORIES.find(a => a.id === accessory) || ACCESSORIES[0];
  const Acc = acc.id !== "none"
    ? <div style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)", fontSize: Math.max(18,size*.17), zIndex:10 }}>{acc.icon}</div>
    : null;

  if (state === "break") return (
    <div style={{ position:"relative", width:size, height:size, display:"flex", alignItems:"center", justifyContent:"center" }}>
      {Acc}
      <svg viewBox="0 0 120 105" width={size} height={size} style={{ animation:"bob-sm 3s ease-in-out infinite", overflow:"visible" }}>
        <ellipse cx="60" cy="76" rx="38" ry="24" fill="#FFB7C5"/>
        <ellipse cx="60" cy="48" rx="27" ry="25" fill="#FFB7C5"/>
        <polygon points="38,27 30,10 50,23" fill="#FFB7C5"/><polygon points="40,26 34,14 49,23" fill="#FF8FAB" opacity=".7"/>
        <polygon points="82,27 90,10 70,23" fill="#FFB7C5"/><polygon points="80,26 86,14 71,23" fill="#FF8FAB" opacity=".7"/>
        <path d="M46 48 Q50 53 54 48" stroke="#7B4F6B" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        <path d="M66 48 Q70 53 74 48" stroke="#7B4F6B" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        <ellipse cx="60" cy="55" rx="3" ry="2" fill="#FF8FAB"/>
        <ellipse cx="47" cy="58" rx="5" ry="3" fill="#FF8FAB" opacity=".3"/>
        <ellipse cx="73" cy="58" rx="5" ry="3" fill="#FF8FAB" opacity=".3"/>
        <path d="M98 82 Q118 62 105 46" stroke="#FFB7C5" strokeWidth="10" fill="none" strokeLinecap="round" style={{ transformOrigin:"98px 82px", animation:"wag 3s ease-in-out infinite" }}/>
        <ellipse cx="42" cy="94" rx="10" ry="6" fill="#FFB7C5"/>
        <ellipse cx="78" cy="94" rx="10" ry="6" fill="#FFB7C5"/>
        <text x="88" y="28" fontSize="11" fill="#C9A0DC" fontWeight="bold" style={{ animation:"zzz 2.5s ease-in-out infinite" }}>z</text>
        <text x="98" y="18" fontSize="9"  fill="#C9A0DC" fontWeight="bold" style={{ animation:"zzz 2.5s ease-in-out infinite .4s" }}>z</text>
        <text x="106" y="10" fontSize="7" fill="#C9A0DC" fontWeight="bold" style={{ animation:"zzz 2.5s ease-in-out infinite .8s" }}>z</text>
      </svg>
    </div>
  );

  if (state === "happy") return (
    <div style={{ position:"relative", width:size, height:size, display:"flex", alignItems:"center", justifyContent:"center" }}>
      {Acc}
      <svg viewBox="0 0 120 110" width={size} height={size} style={{ animation:"bob .9s ease-in-out infinite", overflow:"visible" }}>
        <ellipse cx="60" cy="82" rx="36" ry="24" fill="#FFB7C5"/>
        <ellipse cx="60" cy="50" rx="28" ry="26" fill="#FFB7C5"/>
        <polygon points="37,28 28,7 51,23" fill="#FFB7C5" style={{ animation:"ear 1.5s ease-in-out infinite" }}/>
        <polygon points="39,27 32,11 49,23" fill="#FF8FAB" opacity=".7"/>
        <polygon points="83,28 92,7 69,23" fill="#FFB7C5" style={{ animation:"ear 1.5s ease-in-out infinite .1s" }}/>
        <polygon points="81,27 88,11 71,23" fill="#FF8FAB" opacity=".7"/>
        <path d="M44 48 Q50 42 56 48" stroke="#4A2040" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M64 48 Q70 42 76 48" stroke="#4A2040" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <ellipse cx="60" cy="57" rx="3.5" ry="2.5" fill="#FF8FAB"/>
        <path d="M54 61 Q60 67 66 61" stroke="#7B4F6B" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <ellipse cx="46" cy="60" rx="6" ry="4" fill="#FF8FAB" opacity=".4"/>
        <ellipse cx="74" cy="60" rx="6" ry="4" fill="#FF8FAB" opacity=".4"/>
        <path d="M96 86 Q118 64 105 46" stroke="#FFB7C5" strokeWidth="10" fill="none" strokeLinecap="round" style={{ transformOrigin:"96px 86px", animation:"wag-f .6s ease-in-out infinite" }}/>
        <ellipse cx="42" cy="99" rx="10" ry="6" fill="#FFB7C5"/><ellipse cx="78" cy="99" rx="10" ry="6" fill="#FFB7C5"/>
        <text x="92" y="30" fontSize="14">✨</text><text x="8" y="30" fontSize="12">💖</text>
      </svg>
    </div>
  );

  if (state === "studying") return (
    <div style={{ position:"relative", width:size, height:size, display:"flex", alignItems:"center", justifyContent:"center" }}>
      {Acc}
      <svg viewBox="0 0 120 110" width={size} height={size} style={{ animation:"bob-sm 2s ease-in-out infinite", overflow:"visible" }}>
        <ellipse cx="60" cy="82" rx="36" ry="22" fill="#FFB7C5"/>
        <ellipse cx="60" cy="50" rx="28" ry="26" fill="#FFB7C5"/>
        <polygon points="37,28 26,5 51,22" fill="#FFB7C5" style={{ animation:"ear 3s ease-in-out infinite" }}/>
        <polygon points="39,27 30,10 49,22" fill="#FF8FAB" opacity=".7"/>
        <polygon points="83,28 94,5 69,22" fill="#FFB7C5" style={{ animation:"ear 3s ease-in-out infinite .15s" }}/>
        <polygon points="81,27 90,10 71,22" fill="#FF8FAB" opacity=".7"/>
        <circle cx="50" cy="49" r="7" fill="#2D1040"/><circle cx="70" cy="49" r="7" fill="#2D1040"/>
        <circle cx="52" cy="47" r="2.5" fill="white"/><circle cx="72" cy="47" r="2.5" fill="white"/>
        <circle cx="53.5" cy="46" r="1" fill="white"/><circle cx="73.5" cy="46" r="1" fill="white"/>
        <ellipse cx="60" cy="57" rx="3" ry="2" fill="#FF8FAB"/>
        <line x1="46" y1="56" x2="26" y2="50" stroke="#FF8FAB" strokeWidth="1.5" strokeLinecap="round" opacity=".6"/>
        <line x1="46" y1="59" x2="25" y2="59" stroke="#FF8FAB" strokeWidth="1.5" strokeLinecap="round" opacity=".6"/>
        <line x1="74" y1="56" x2="94" y2="50" stroke="#FF8FAB" strokeWidth="1.5" strokeLinecap="round" opacity=".6"/>
        <line x1="74" y1="59" x2="95" y2="59" stroke="#FF8FAB" strokeWidth="1.5" strokeLinecap="round" opacity=".6"/>
        <rect x="28" y="90" width="64" height="9" rx="4.5" fill="#E8C5B0"/>
        <ellipse cx="42" cy="90" rx="10" ry="6" fill="#FFB7C5"/><ellipse cx="78" cy="90" rx="10" ry="6" fill="#FFB7C5"/>
        <path d="M96 85 Q118 63 105 46" stroke="#FFB7C5" strokeWidth="9" fill="none" strokeLinecap="round" style={{ transformOrigin:"96px 85px", animation:"wag-f 1.2s ease-in-out infinite" }}/>
      </svg>
    </div>
  );

  return (
    <div style={{ position:"relative", width:size, height:size, display:"flex", alignItems:"center", justifyContent:"center" }}>
      {Acc}
      <svg viewBox="0 0 120 110" width={size} height={size} style={{ animation:"bob 3s ease-in-out infinite", overflow:"visible" }}>
        <ellipse cx="60" cy="82" rx="36" ry="24" fill="#FFB7C5"/>
        <ellipse cx="60" cy="50" rx="28" ry="26" fill="#FFB7C5"/>
        <polygon points="38,28 30,10 51,23" fill="#FFB7C5"/><polygon points="40,27 34,13 49,23" fill="#FF8FAB" opacity=".7"/>
        <polygon points="82,28 90,10 69,23" fill="#FFB7C5"/><polygon points="80,27 86,13 71,23" fill="#FF8FAB" opacity=".7"/>
        <circle cx="50" cy="49" r="6.5" fill="#4A2040"/><circle cx="70" cy="49" r="6.5" fill="#4A2040"/>
        <circle cx="51.5" cy="47.5" r="2" fill="white"/><circle cx="71.5" cy="47.5" r="2" fill="white"/>
        <ellipse cx="60" cy="57" rx="3" ry="2" fill="#FF8FAB"/>
        <path d="M56 61 Q60 64 64 61" stroke="#7B4F6B" strokeWidth="1.5" fill="none"/>
        <line x1="46" y1="56" x2="28" y2="51" stroke="#FF8FAB" strokeWidth="1.5" strokeLinecap="round" opacity=".6"/>
        <line x1="46" y1="59" x2="27" y2="59" stroke="#FF8FAB" strokeWidth="1.5" strokeLinecap="round" opacity=".6"/>
        <line x1="74" y1="56" x2="92" y2="51" stroke="#FF8FAB" strokeWidth="1.5" strokeLinecap="round" opacity=".6"/>
        <line x1="74" y1="59" x2="93" y2="59" stroke="#FF8FAB" strokeWidth="1.5" strokeLinecap="round" opacity=".6"/>
        <path d="M96 85 Q118 63 104 47" stroke="#FFB7C5" strokeWidth="10" fill="none" strokeLinecap="round" style={{ transformOrigin:"96px 85px", animation:"wag 2.5s ease-in-out infinite" }}/>
        <ellipse cx="42" cy="99" rx="10" ry="6" fill="#FFB7C5"/><ellipse cx="78" cy="99" rx="10" ry="6" fill="#FFB7C5"/>
      </svg>
    </div>
  );
});

export default Cat;
