// store location of score and game over status on screen
const scoreUi = document.querySelector('.score');
const gameStatusUi = document.querySelector('.gameOver');
const startButton = document.querySelector('.start');

// declare canvas variables & initialize context
const snakeCanvas = document.querySelector('#snake-body');
const foodCanvas = document.querySelector('#food');
const canvasDiv = document.querySelector('.canvasWrap');


const snakeCtx = snakeCanvas.getContext('2d');
const foodCtx = foodCanvas.getContext('2d');

// store width and height of canvases
const { width: foodX, height: foodY } = foodCanvas;
const { width: snakeX, height: snakeY } = snakeCanvas;

// variables for sizes, score, and game active status
let snakeLength = 5;
const MOVE_SIZE = 5;
const SIZE = 15;
const RM_SIZE = 20;
let score = 0;
let gameActive = false;

// initialize variables for food and snake tracking
let x = 0;
let y = 0;
let headX = 0;
let headY = 0;
let body = [];

// set up food style
foodCtx.lineWidth = SIZE;
foodCtx.fillStyle = '#27ae60';
// have to have lineCap set to something other than butt for a small square - otherwise it doesn't show on screen
foodCtx.lineCap = 'square';

// set up snake styles
snakeCtx.lineWidth = SIZE;
snakeCtx.lineCap = 'round';
snakeCtx.lineJoin = 'round';
let hue = Math.floor(Math.random() * 360);;
snakeCtx.strokeStyle = `hsl(${hue}, 100%, 50%)`;

// initialize board
function getBoardReady() {
  // variables for random positioning of food
  x = getRandomNumber(foodX);
  y = getRandomNumber(foodY);

  // variables for snake tracking
  headX = getRandomNumber(snakeX);
  headY = getRandomNumber(snakeY);
  body = [{x: headX, y: headY}];
}

// get a random width or height number - subtracing 10 from the number to help ensure it doesn't give us a point off the edge of the map
function getRandomNumber(num) {
  return Math.floor(Math.random() * (num - 10));
}

// determine the spot for the food square
function setFood(x, y) {
  foodCtx.fillRect(x, y, SIZE, SIZE);
}

// clear the tail of our snake, so it doesn't keep going forever
function clearPrevious() {
  // console.log('cleaning up end of body')
  // if our body is smaller than the new length, return - there's nothing to clear yet
  if (body.length <= snakeLength) return;

  // set removal styles
  snakeCtx.strokeStyle = '#FFF';
  snakeCtx.lineWidth = RM_SIZE;
  snakeCtx.lineCap = 'square';

  // array to store the moves we need to clear out
  let deletedMoves = [];
  const numMovesToClear = body.length - snakeLength;

  for (let i = 0; i < numMovesToClear; i++) {
    let moveToRemove = body.shift();
    deletedMoves.push(moveToRemove);
  }

  // console.table(deletedMoves);

  snakeCtx.beginPath();
  snakeCtx.moveTo(deletedMoves[0][x], deletedMoves[0][y]);
  deletedMoves.forEach(point => {
    snakeCtx.lineTo(point.x, point.y);
    snakeCtx.stroke();
  })
}

// we got a food! get a new one
function getNewFoodPoint() {
  // clear the old food point
  foodCtx.clearRect(x, y, SIZE, SIZE);
  // get new coordinates and set the new food point
  x = getRandomNumber(foodX);
  y = getRandomNumber(foodY);
  setFood(x, y);
}

// move the snake
function move({ key }) {
  // clear previous path
  clearPrevious();
  // depending on the received direction, adjust head and draw a line to there
  switch (key) {
    case 'ArrowUp':
      headY -= MOVE_SIZE;
      break;
    case 'ArrowDown':
      headY += MOVE_SIZE;
      break;
    case 'ArrowLeft':
      headX -= MOVE_SIZE;
      break;
    case 'ArrowRight':
      headX += MOVE_SIZE;
      break;
    default:
      break;
  }

  // is this move already in our current snake, or the edge of the screen? then game over
  if (headX <= 0 || headX >= snakeX || headY <= 0 || headY >= snakeY) {
    gameStatusUi.innerHTML = `
    Game over! <br>
    Out of bounds.
    `;
    endGame();
    return;
  }

  if (body.find(point => point.x === headX && point.y === headY)) {
    gameStatusUi.innerHTML = `
    Game over! <br>
    Hit your body.
    `;
    endGame();
    return;
  }

  // if we hit a food, increase our score and snake length, then get a new food point
  if (headX >= x && headX <= x + SIZE) {
    if (headY >= y && headY <= y + SIZE) {
      score++;
      snakeLength += MOVE_SIZE;
      hue += RM_SIZE;
      snakeCtx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
      getNewFoodPoint();
      scoreUi.innerHTML = `
      Score:<br>
      <span class="num">${score}</span>
       `;
    }
  }

  body.push({x: headX, y: headY});
  
  // draw the new move
  drawMoves(body);
}

// actually draw our moves array on the canvas
function drawMoves(body) {
  // reset stroke styles from the clear
  snakeCtx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
  snakeCtx.lineWidth = SIZE;
  snakeCtx.lineCap = 'round';

  snakeCtx.beginPath();
  snakeCtx.moveTo(body[0][x], body[0][y]);
  body.forEach(point => {
    snakeCtx.lineTo(point.x, point.y);
    snakeCtx.stroke();
  })
}

// watch for arrow key presses, and send those to the move function if game is active
function handleKey(e) {
  if (e.key.includes('Arrow')) {
    // prevent the default, which is moving the screen
    e.preventDefault();
    if (gameActive) {
      move({ key: e.key });
    }
  }
}

// ensure starting values are all reset, set gameActive to true, and allow gameplay
function startGame() {
  console.log('here we go!');
  // clear the screen from the previous game
   snakeCtx.clearRect(0, 0, snakeX, snakeY);
  foodCtx.clearRect(0, 0, foodX, foodY);
  
  // reset needed values for ui
  gameActive = true;
  score = 0;
  scoreUi.innerHTML = `
  Score:<br>
  <span class="num">${score}</span>
  `;
  gameStatusUi.innerHTML = '';
  startButton.setAttribute('disabled', true);
  startButton.innerText = 'Game in Progress';
  startButton.classList.add('disabled');

  // get new values for food and snake variables
  getBoardReady();

  // show initial food spot
  setFood(x, y);

  // show starting point for snake
  drawMoves(body);

  // set the focus on the snake canvas, so it'll move
  canvasDiv.focus();
}

// game over, set gameActive to false and enable the start button for a new round
function endGame() {
  gameActive = false;
  startButton.removeAttribute('disabled');
  startButton.innerText = 'Start New Game';
  startButton.classList.remove('disabled');
  body = [];
  snakeLength = 5;
}

// set listener for start button, should trigger the game to start
startButton.addEventListener('click', () => startGame());

// listen for arrow key inputs
window.addEventListener('keydown', handleKey);

// start game on load
startGame();