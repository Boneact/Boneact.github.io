import { CELL, COLORS, TETROMINOS } from './constants.js';
import { loadScores, addScore, clearScores } from './storage.js';

export class UI {
  constructor(){
    this.canvas = document.querySelector('#playfield');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = 10*CELL;
    this.canvas.height = 20*CELL;

    this.nextCanvas = document.querySelector('#next');
    this.nextCtx = this.nextCanvas.getContext('2d');
    this.holdCanvas = document.querySelector('#hold');
    this.holdCtx = this.holdCanvas.getContext('2d');

    this.scoreEl = document.querySelector('#score');
    this.linesEl = document.querySelector('#lines');
    this.levelEl = document.querySelector('#level');
    this.pauseBtn = document.querySelector('#pauseBtn');

    this.historyBtn = document.querySelector('#historyBtn');
    this.historyWindow = document.querySelector('#scoreHistory');
    this.scoreList = document.querySelector('#scoreList');
    this.closeHistoryBtn = document.querySelector('#closeHistory');
    this.clearHistoryBtn = document.querySelector('#clearHistory');

    // loadHistory is async; call and ignore the returned promise here
    this.loadHistory().catch(()=>{});
    if(this.historyBtn) this.historyBtn.addEventListener('click',()=>this.toggleHistory());
    if(this.closeHistoryBtn) this.closeHistoryBtn.addEventListener('click',()=>this.hideHistory());
    if(this.clearHistoryBtn) this.clearHistoryBtn.addEventListener('click',()=>this.clearHistory().catch(()=>{}));
  }

  updateStat(score, lines, level){
    this.scoreEl.textContent = score;
    this.linesEl.textContent = lines;
    this.levelEl.textContent = level;
  }

  updatePause(isPaused){
    this.pauseBtn.textContent = isPaused?'Folytatás':'Szünet';
  }

  drawCell(ctx,x,y,color){
    const pad=1;
    ctx.fillStyle=color;
    ctx.fillRect(x*CELL+pad,y*CELL+pad,CELL-pad*2,CELL-pad*2);
    ctx.fillStyle='rgba(255,255,255,0.05)';
    ctx.fillRect(x*CELL+pad,y*CELL+pad,CELL-pad*2,4);
  }

  render(game){
    const ctx=this.ctx;
    ctx.clearRect(0,0,this.canvas.width,this.canvas.height);

    for(let r=0;r<20;r++){
      for(let c=0;c<10;c++){
        ctx.fillStyle='#071223';
        ctx.fillRect(c*CELL,r*CELL,CELL,CELL);
      }
    }

    for(let r=0;r<20;r++){
      for(let c=0;c<10;c++){
        const cell=game.grid[r][c];
        if(cell) this.drawCell(this.ctx, c,r,COLORS[cell]||COLORS.X);
      }
    }

    if(game.current){
      for(let r=0;r<4;r++){
        for(let c=0;c<4;c++){
          if(game.current.matrix[r*4+c]){
            const gx=game.current.x+c;
            const gy=game.current.y+r;
            if(gy>=0) this.drawCell(this.ctx, gx,gy,COLORS[game.current.type]);
          }
        }
      }
    }

    ctx.strokeStyle='rgba(255,255,255,0.02)';
    ctx.lineWidth=1;
    for(let i=1;i<10;i++){ctx.beginPath();ctx.moveTo(i*CELL,0);ctx.lineTo(i*CELL,this.canvas.height);ctx.stroke();}
    for(let i=1;i<20;i++){ctx.beginPath();ctx.moveTo(0,i*CELL);ctx.lineTo(this.canvas.width,i*CELL);ctx.stroke();}

    this.renderSmall(this.nextCtx, game.nextQueue[0]);
    this.renderSmall(this.holdCtx, game.holdPiece);
  }

  renderSmall(ctx,type){
    const W=ctx.canvas.width,H=ctx.canvas.height;
    ctx.clearRect(0,0,W,H);

    ctx.save();
    const size=20;
    const offsetX=(W-size*4)/2;
    const offsetY=(H-size*4)/2;

    if(type){
      const mat=TETROMINOS[type][0];
      for(let r=0;r<4;r++){
        for(let c=0;c<4;c++){
          if(mat[r*4+c]){
            ctx.fillStyle=COLORS[type]||'#999';
            ctx.fillRect(offsetX+c*size+2,offsetY+r*size+2,size-4,size-4);
          }
        }
      }
    } else {
      ctx.fillStyle='rgba(255,255,255,0.03)';
      ctx.fillRect(offsetX+size,offsetY+size,size*2,size*2);
    }
    ctx.restore();
  }

  async loadHistory(){
    try {
      this.history = await loadScores();
    } catch(e){
      this.history = [];
    }
    this.renderHistory();
    return Promise.resolve(this.history);
  }

  renderHistory(){
    if(!this.scoreList) return;
    this.scoreList.innerHTML = '';
    if(!this.history || this.history.length===0){
      const li = document.createElement('li');
      li.className = 'score-empty';
      li.textContent = 'Nincs korábbi eredmény';
      this.scoreList.appendChild(li);
      return;
    }

    for(const s of this.history){
      const li = document.createElement('li');
      const date = new Date(s.date);
      const left = document.createElement('span');
      left.textContent = date.toLocaleString();
      const right = document.createElement('strong');
      right.textContent = s.score;
      li.appendChild(left);
      li.appendChild(right);
      this.scoreList.appendChild(li);
    }
  }

  async addScoreToHistory(scoreObj){
    try{
      const arr = await addScore(scoreObj);
      this.history = Array.isArray(arr)? arr : [];
    }catch(e){
      return Promise.reject(e);
    }
    this.renderHistory();
    return Promise.resolve(scoreObj);
  }

  toggleHistory(){
    if(!this.historyWindow) return;
    const open = this.historyWindow.classList.toggle('open');
    this.historyWindow.setAttribute('aria-hidden', (!open).toString());
  }

  hideHistory(){
    if(!this.historyWindow) return;
    this.historyWindow.classList.remove('open');
    this.historyWindow.setAttribute('aria-hidden','true');
  }

  async clearHistory(){
    try{ await clearScores(); }catch(e){}
    this.history = [];
    this.renderHistory();
    return Promise.resolve();
  }
}
