import { Game } from './game.js';
import { UI } from './ui.js';

const savedSize = localStorage.getItem('gridSize');
let DEFAULT_COLS = 10;
let DEFAULT_ROWS = 20;
if(savedSize){
  const parts = savedSize.split('x').map(n=>parseInt(n,10));
  if(parts.length===2 && !isNaN(parts[0]) && !isNaN(parts[1])){
    DEFAULT_COLS = parts[0];
    DEFAULT_ROWS = parts[1];
  }
}

const ui = new UI(DEFAULT_COLS, DEFAULT_ROWS);
let game = new Game(ui, DEFAULT_COLS, DEFAULT_ROWS);

const newgameBtn = document.querySelector('#newgameBtn');

newgameBtn.addEventListener('click',()=>{
  game.reset();
  game.lastTime = performance.now();
  requestAnimationFrame(game.update.bind(game));
});

document.addEventListener('keydown',(e)=>{
  if(game.isGameOver) return;
  switch(e.key){
    case 'ArrowLeft': e.preventDefault(); game.move(-1,0); break;
    case 'ArrowRight': e.preventDefault(); game.move(1,0); break;
    case 'ArrowDown': e.preventDefault(); game.move(0,1); break;
    case 'ArrowUp': e.preventDefault(); game.rotate(); break;
    case 'c': case 'C': e.preventDefault(); game.doHold(); break;
    case 'p': case 'P': e.preventDefault(); game.togglePause(); break;
    case ' ': e.preventDefault(); game.hardDrop(); break;
  }
});

const pauseBtn = document.querySelector('#pauseBtn');
pauseBtn.addEventListener('click',()=>game.togglePause());

game.reset();
ui.render(game);
requestAnimationFrame(game.update.bind(game));