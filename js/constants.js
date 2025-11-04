export const CELL = 28;

export const COLORS = {
  I: '#00f0f0',
  J: '#0000f0',
  L: '#f0a000',
  O: '#f0f000',
  S: '#00f000',
  T: '#a000f0',
  Z: '#f00000',
  X: '#394a59'
};

export const TETROMINOS = {
  I: [[0,0,0,0,
       1,1,1,1,
       0,0,0,0,
       0,0,0,0]],

  J: [[1,0,0,0,
       1,1,1,0,
       0,0,0,0,
       0,0,0,0]],

  L: [[0,0,1,0,
       1,1,1,0,
       0,0,0,0,
       0,0,0,0]],

  O: [[0,1,1,0,
       0,1,1,0,
       0,0,0,0,
       0,0,0,0]],

  S: [[0,1,1,0,
       1,1,0,0,
       0,0,0,0,
       0,0,0,0]],

  T: [[0,1,0,0,
       1,1,1,0,
       0,0,0,0,
       0,0,0,0]],

  Z: [[1,1,0,0,
       0,1,1,0,
       0,0,0,0,
       0,0,0,0]]
};

export function rotateMatrix(mat) {
  const N = 4;
  let out = new Array(16).fill(0);
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      out[c*4 + (N-1-r)] = mat[r*4 + c];
    }
  }
  return out;
}

export function generateBag(TETROMINOS) {
  const keys = Object.keys(TETROMINOS);
  let bag = [...keys];
  for (let i = bag.length-1; i>0; i--) {
    const j = Math.floor(Math.random() * (i+1));
    [bag[i], bag[j]] = [bag[j], bag[i]];
  }
  return bag;
}
