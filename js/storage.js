const KEY = 'tetris_scores';
const MAX_ENTRIES = 20;

function safeParse(raw){
  try{ return JSON.parse(raw||'[]'); }catch(e){ return []; }
}

export async function loadScores(){
  const raw = localStorage.getItem(KEY) || '[]';
  const arr = safeParse(raw);
  if(Array.isArray(arr)){
    arr.sort((a,b)=> (b.score||0)-(a.score||0));
    return arr.slice(0,MAX_ENTRIES);
  }
  return [];
}

export async function saveScores(arr){
  const copy = Array.isArray(arr)? arr.slice() : [];
  copy.sort((a,b)=> (b.score||0)-(a.score||0));
  const trimmed = copy.slice(0,MAX_ENTRIES);
  localStorage.setItem(KEY, JSON.stringify(trimmed));
  return trimmed;
}

export async function addScore(scoreObj){
  const arr = await loadScores();
  arr.push(scoreObj);
  return saveScores(arr);
}

export async function clearScores(){
  localStorage.removeItem(KEY);
  return [];
}

export default { loadScores, saveScores, addScore, clearScores };