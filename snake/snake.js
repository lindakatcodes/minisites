// set score and game variables
const scoreUi = document.querySelector('.score');
const snakeSize = document.querySelector('.snake-size');
const currFoodSpot = document.querySelector('.current-food-spot');

// declare canvas variables & initialize context
const snakeCanvas = document.querySelector('#snake-body');
const foodCanvas = document.querySelector('#food');

const snakeCtx = snakeCanvas.getContext('2d');
const foodCtx = foodCanvas.getContext('2d');

// variables for current positions & line size
const { width: foodX, height: foodY } = foodCanvas;
const { width: snakeX, height: snakeY } = snakeCanvas;
let snakeLength = 1;
const SIZE = 15;
const MOVE_SIZE = 5;

// score tracker and end game variables
let score = 0;
let gameEnd = false;
scoreUi.innerHTML = `Score: ${score}`;

// get a random width or height number
function getRandomNumber(num) {
  return Math.floor(Math.random() * (num - 5));
}

// variables for random positioning
let x = getRandomNumber(foodX);
let y = getRandomNumber(foodY);

// set up food style
foodCtx.lineWidth = SIZE;
foodCtx.fillStyle = '#27ae60';
// have to have lineCap set to something other than butt for a small square - otherwise it doesn't show on screen
foodCtx.lineCap = 'square';

// determine the spot for the food square
function setFood(x, y) {
  foodCtx.fillRect(x, y, SIZE, SIZE);
}

// variables for snake tracking
let headX = getRandomNumber(snakeX);
let headY = getRandomNumber(snakeY);

// set up snake styles
snakeCtx.lineWidth = SIZE;
snakeCtx.lineCap = 'round';

let hue = 0;
snakeCtx.strokeStyle = `hsl(${hue}, 100%, 50%)`;

snakeCtx.beginPath();
snakeCtx.moveTo(headX, headY);
snakeCtx.lineTo(headX, headY);
snakeCtx.stroke();

// clear the previous move, so we don't grow when we don't want to 
function clearPrevious() {
  // set stroke to white (same color as background)
  snakeCtx.strokeStyle = '#FFF';
  // grab length of snake, and go back that many moves from the moves array

  // draw a line over those in white

  // remove those moves from the moves array
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
  // start a new path and go to where our head currently is
  snakeCtx.beginPath();
  snakeCtx.moveTo(headX, headY);
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

  // if we hit a food, increase our score and snake length, then get a new food point
  if (headX >= x && headX <= x + SIZE) {
    if (headY >= y && headY <= y + SIZE) {
      score++;
      snakeLength += 3;
      snakeCtx.strokeStyle = `hsl(${hue + 3}, 100%, 50%)`;
      getNewFoodPoint();
      scoreUi.innerHTML = `Score: ${score}`;
    }
  }

  // reset the stroke style from the clear, and move to our new position
  snakeCtx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
  snakeCtx.lineTo(headX, headY);
  snakeCtx.stroke();
}

// watch for arrow key presses, and send those to the move function
function handleKey(e) {
  if (e.key.includes('Arrow')) {
    // prevent the default, which is moving the screen
    e.preventDefault();
    move({ key: e.key });
  }
}

// show initial food spot
setFood(x, y);

// create game function, will start game and track moves array and current snake line. will need to check each new point to make sure we haven't hit ourself, if so game is over

// also need to make sure to check for edges of grid, don't want to allow edge hits

// listen for arrow key inputs
window.addEventListener('keydown', handleKey);