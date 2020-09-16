// set score and game variables
const scoreUi = document.querySelector('.score');
const snakeSize = document.querySelector('.snake-size');

// declare canvas variables & initialize context
const snakeCanvas = document.querySelector('#snake-body');
const foodCanvas = document.querySelector('#food');

const snakeCtx = snakeCanvas.getContext('2d');
const foodCtx = foodCanvas.getContext('2d');

// variables for current positions & line size
const { width: foodX, height: foodY } = foodCanvas;
const { width: snakeX, height: snakeY } = snakeCanvas;
const SIZE = 15;

// score tracker and end game variables
let score = 0;
let gameEnd = false;
scoreUi.innerHTML = `Score: ${score}`;

// get a random width or height number
function getRandomNumber(num) {
  return Math.floor(Math.random() * num);
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
let snakeLength = 1;
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
  snakeCtx.strokeStyle = `#FFF`;
  snakeCtx.beginPath();
  snakeCtx.moveTo(headX - 4, headY - 4);
  snakeCtx.lineTo(headX + 6, headY + 6);
  snakeCtx.stroke();
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
  // depending on the received direction, adjust head and draw a line to there
  switch (key) {
    case 'ArrowUp':
      headY -= SIZE / 2;
      break;
    case 'ArrowDown':
      headY += SIZE / 2;
      break;
    case 'ArrowLeft':
      headX -= SIZE / 2;
      break;
    case 'ArrowRight':
      headX += SIZE / 2;
      break;
    default:
      break;
  }

  if (headX >= x && headX <= x + SIZE) {
    if (headY <= y && headY >= SIZE) {
      score++;
      snakeLength++;
      snakeCtx.strokeStyle = `hsl(${hue + 3}, 100%, 50%)`;
      getNewFoodPoint();
      scoreUi.innerHTML = `Score: ${score}`;
    }
  }

  // reset the stroke style from the clear, and move to our new position
  snakeCtx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
  snakeCtx.moveTo(headX, headY);
  snakeCtx.lineTo(headX + snakeLength, headY + snakeLength);
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

// listen for arrow key inputs
window.addEventListener('keydown', handleKey);