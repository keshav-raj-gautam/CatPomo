const BASE = [
  [5,3,4,6,7,8,9,1,2],[6,7,2,1,9,5,3,4,8],[1,9,8,3,4,2,5,6,7],
  [8,5,9,7,6,1,4,2,3],[4,2,6,8,5,3,7,9,1],[7,1,3,9,2,4,8,5,6],
  [9,6,1,5,3,7,2,8,4],[2,8,7,4,1,9,6,3,5],[3,4,5,2,8,6,1,7,9],
];
const rnd = (a) => [...a].sort(() => Math.random() - 0.5);

export function genSudoku(diff = "easy") {
  const sol = BASE.map((r) => [...r]);
  for (let b = 0; b < 3; b++) {
    const ord = rnd([0,1,2]), band = [sol[b*3],sol[b*3+1],sol[b*3+2]];
    ord.forEach((r,i) => { sol[b*3+i] = [...band[r]]; });
  }
  for (let s = 0; s < 3; s++) {
    const ord = rnd([0,1,2]);
    sol.forEach(row => { const c=[row[s*3],row[s*3+1],row[s*3+2]]; ord.forEach((v,i)=>{ row[s*3+i]=c[v]; }); });
  }
  const dm = {};
  rnd([1,2,3,4,5,6,7,8,9]).forEach((d,i) => { dm[i+1]=d; });
  sol.forEach((row,r) => row.forEach((_,c) => { sol[r][c]=dm[sol[r][c]]; }));
  const rem = diff==="easy"?32:diff==="medium"?46:54;
  const puz = sol.map(r=>[...r]);
  rnd(Array.from({length:81},(_,i)=>[Math.floor(i/9),i%9])).slice(0,rem).forEach(([r,c])=>{ puz[r][c]=0; });
  return { puzzle:puz, solution:sol };
}
