import { COLS, ROWS, TETROMINOS, rotateMatrix, generateBag } from './constants.js';

export class Game {
  constructor(ui) {
    this.ui = ui;

    this.grid = [];
    this.bag = [];
    this.nextQueue = [];
    this.current = null;
    this.holdPiece = null;
    this.canHold = true;

    this.score = 0;
    this.level = 1;
    this.totalLines = 0;

    this.dropInterval = 1000;
    this.lastDrop = 0;
    this.lastTime = 0;
    this.isPaused = false;
    this.isGameOver = false;
    this._savedScore = false;
  }

  reset() {
    this.grid = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    this.bag = generateBag(TETROMINOS);
    this.nextQueue = [];
    for(let i=0;i<5;i++) this.refillQueue();
    this.spawnPiece();
    this.holdPiece = null;
    this.canHold = true;
    this.score = 0;
    this.level = 1;
    this.totalLines = 0;
    this.dropInterval = 1000;
    this.isPaused = false;
    this.isGameOver = false;
    this._savedScore = false;
    this.ui.updateStat(this.score, this.totalLines, this.level);
  }

  refillQueue() {
    if(this.bag.length===0) this.bag = generateBag(TETROMINOS);
    this.nextQueue.push(this.bag.pop());
  }

  spawnPiece() {
    while(this.nextQueue.length<5) this.refillQueue();
    const type = this.nextQueue.shift();
    this.refillQueue();
    const mat = TETROMINOS[type][0];
    this.current = { type, matrix: mat.slice(), x: 3, y: -1 };
    this.canHold = true;
    if(this.collides(this.current.matrix,this.current.x,this.current.y)) this.isGameOver=true;
  }

  collides(mat, offsetX, offsetY){
    for(let r=0;r<4;r++){
      for(let c=0;c<4;c++){
        const val=mat[r*4+c];
        if(!val) continue;
        const gx = offsetX + c;
        const gy = offsetY + r;
        if(gx<0||gx>=COLS||gy>=ROWS) return true;
        if(gy>=0 && this.grid[gy][gx]) return true;
      }
    }
    return false;
  }

  move(dx,dy){
    if(!this.current) return false;
    if(!this.collides(this.current.matrix,this.current.x+dx,this.current.y+dy)){
      this.current.x += dx;
      this.current.y += dy;
      return true;
    }
    return false;
  }

  hardDrop(){
    while(this.move(0,1)){}
    this.lockPiece();
  }

  rotate(){
    if(!this.current) return;
    let rotated = rotateMatrix(this.current.matrix)
    const kicks=[[0,0],[-1,0],[1,0],[-2,0],[2,0],[0,-1]];
    for(let [ox,oy] of kicks){
      if(!this.collides(rotated,this.current.x+ox,this.current.y+oy)){
        this.current.matrix = rotated;
        this.current.x += ox;
        this.current.y += oy;
        return;
      }
    }
  }

  doHold(){
    if(!this.canHold || !this.current) return;
    if(!this.holdPiece){
      this.holdPiece = this.current.type;
      this.spawnPiece();
    } else {
      const temp = this.holdPiece;
      this.holdPiece = this.current.type;
      this.current = { type: temp, matrix: TETROMINOS[temp][0].slice(), x:3, y:-1 };
      if(this.collides(this.current.matrix,this.current.x,this.current.y)) this.isGameOver=true;
    }
    this.canHold=false;
  }

  lockPiece(){
    const m = this.current.matrix;
    for(let r=0;r<4;r++){
      for(let c=0;c<4;c++){
        if(m[r*4+c] && this.current.y+r>=0) this.grid[this.current.y+r][this.current.x+c]=this.current.type;
      }
    }
    this.clearLines();
    this.spawnPiece();
  }

  clearLines(){
    let cleared=0;
    for(let r=ROWS-1;r>=0;r--){
      if(this.grid[r].every(cell=>cell!==0)){
        this.grid.splice(r,1);
        this.grid.unshift(Array(COLS).fill(0));
        cleared++;
        r++;
      }
    }
    if(cleared>0){
      this.totalLines+=cleared;
      const pointsBy=[0,40,100,300,1200];
      this.score += pointsBy[cleared]*this.level;
      this.level = Math.floor(this.totalLines/10)+1;
      this.dropInterval = Math.max(100,1000-(this.level-1)*100);
      this.ui.updateStat(this.score,this.totalLines,this.level);
    }
  }

  togglePause(){
    if(this.isGameOver) return;
    this.isPaused = !this.isPaused;
    this.ui.updatePause(this.isPaused);
  }

  update(time=0){
    if(this.isGameOver && !this._savedScore){
      this._savedScore = true;
      this.saveScore();
    }

    if(this.isPaused||this.isGameOver){
      this.ui.render(this);
      requestAnimationFrame(this.update.bind(this));
      return;
    }

    const delta = time - this.lastTime;
    this.lastTime = time;
    this.lastDrop += delta;

    if(this.lastDrop > this.dropInterval){
      if(!this.move(0,1)) this.lockPiece();
      this.lastDrop=0;
    }

    this.ui.render(this);
    requestAnimationFrame(this.update.bind(this));
  }

  saveScore(){
    try{
      const obj = { score: this.score, lines: this.totalLines, level: this.level, date: new Date().toISOString() };
      // Delegate persistence to UI helper to avoid duplication and ensure sorting
      if(this.ui && typeof this.ui.addScoreToHistory === 'function') {
        this.ui.addScoreToHistory(obj);
      } else {
        // fallback: persist directly if UI helper missing
        const raw = localStorage.getItem('tetris_scores') || '[]';
        const arr = JSON.parse(raw);
        arr.push(obj);
        localStorage.setItem('tetris_scores', JSON.stringify(arr));
      }
    }catch(e){
      console.error('Could not save score', e);
    }
  }
}