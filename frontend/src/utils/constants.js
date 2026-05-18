export const ACHIEVEMENTS = [
  { id:"first",   icon:"🐾", name:"First Paw",        desc:"Complete your first session",   req:(s)=>s.total_sessions>=1    },
  { id:"scholar", icon:"📚", name:"Cat Scholar",      desc:"Complete 10 sessions",           req:(s)=>s.total_sessions>=10   },
  { id:"queen",   icon:"👑", name:"Focus Queen",      desc:"Complete 25 sessions",           req:(s)=>s.total_sessions>=25   },
  { id:"beast",   icon:"🔥", name:"Study Beast",      desc:"Complete 50 sessions",           req:(s)=>s.total_sessions>=50   },
  { id:"century", icon:"💯", name:"Centurion",        desc:"Complete 100 sessions",          req:(s)=>s.total_sessions>=100  },
  { id:"streak3", icon:"⚡", name:"3-Day Streak",     desc:"Study 3 days in a row",          req:(s)=>s.streak>=3            },
  { id:"streak7", icon:"💎", name:"Consistency Cat",  desc:"Maintain a 7-day streak",        req:(s)=>s.streak>=7            },
  { id:"night",   icon:"🦉", name:"Night Owl",        desc:"Study after 10 PM",              req:(s)=>s.night_study          },
  { id:"morning", icon:"☀️", name:"Early Bird",       desc:"Study before 8 AM",              req:(s)=>s.morning_study        },
  { id:"sudoku",  icon:"🧩", name:"Puzzle Lover",     desc:"Solve 5 Sudoku puzzles",         req:(s)=>s.sudoku_solved>=5     },
  { id:"hours10", icon:"⏰", name:"Dedicated Cat",    desc:"10 total study hours",           req:(s)=>s.total_minutes>=600   },
  { id:"marathon",icon:"🏃", name:"Study Marathon",   desc:"5 sessions in a single day",     req:(s)=>s.today_sessions>=5    },
];

export const ACCESSORIES = [
  { id:"none",    name:"No Accessory",  icon:"🐱", unlockAt:0  },
  { id:"bow",     name:"Pink Bow",      icon:"🎀", unlockAt:3  },
  { id:"glasses", name:"Study Glasses", icon:"🤓", unlockAt:8  },
  { id:"hat",     name:"Party Hat",     icon:"🎉", unlockAt:15 },
  { id:"crown",   name:"Royal Crown",   icon:"👑", unlockAt:25 },
  { id:"wizard",  name:"Wizard Hat",    icon:"🧙", unlockAt:50 },
];

export const AMBIENT_LIST = [
  {id:"none", icon:"🔇",name:"None"},
  {id:"rain", icon:"🌧️",name:"Rain"},
  {id:"cafe", icon:"☕",name:"Café"},
  {id:"lofi", icon:"🎵",name:"Lo-fi"},
  {id:"fire", icon:"🔥",name:"Fireplace"},
  {id:"white",icon:"🌊",name:"White Noise"},
];

export const INIT_SETTINGS = { focus:25, shortBreak:5, longBreak:15, interval:4, autoStart:false };

export const NAV_ITEMS = [
  {id:"home",       icon:"🏠", label:"Home"},
  {id:"focus",      icon:"⏱️", label:"Focus"},
  {id:"analytics",  icon:"📊", label:"Stats"},
  {id:"leaderboard",icon:"🏆", label:"Ranks"},
  {id:"sudoku",     icon:"🧩", label:"Sudoku"},
  {id:"cat",        icon:"🐱", label:"My Cat"},
  {id:"settings",   icon:"⚙️", label:"Settings"},
];
