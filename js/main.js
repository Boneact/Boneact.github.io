import { Game } from './game.js';
import { UI } from './ui.js';

const ui = new UI();
const game = new Game(ui);

const startBtn = document.querySelector('#startBtn');

startBtn.addEventListener('click',()=>{
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