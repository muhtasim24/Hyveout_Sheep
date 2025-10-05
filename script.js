// 1. Get elements
const startPage = document.getElementById('startPage');
const startButton = document.getElementById('startButton');
const gameContainer = document.getElementById('gameContainer');
const sheepElements = [
  document.getElementById('sheep1'),
  document.getElementById('sheep2'),
  document.getElementById('sheep3')
];
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const SHEEP_SIZE = 80;

const sheepData = [
  { x: 100, y: 100, dx: 2, dy: 1.5 },
  { x: 300, y: 400, dx: 1.5, dy: 2 },
  { x: 500, y: 600, dx: 2, dy: 1.2 }
];

// 2. Sheep movement
function updateSheep() {
  sheepData.forEach((sheep, index) => {
    sheep.x += sheep.dx;
    sheep.y += sheep.dy;

    // bounce edges
    if (sheep.x < 0) { sheep.x = 0; sheep.dx *= -1; }
    if (sheep.x > window.innerWidth - SHEEP_SIZE) { sheep.x = window.innerWidth - SHEEP_SIZE; sheep.dx *= -1; }
    if (sheep.y < 0) { sheep.y = 0; sheep.dy *= -1; }
    if (sheep.y > window.innerHeight - SHEEP_SIZE) { sheep.y = window.innerHeight - SHEEP_SIZE; sheep.dy *= -1; }

    sheepElements[index].style.transform = `translate(${sheep.x}px, ${sheep.y}px)`;
  });
}

// 3. Animation loop
function animate() {
  updateSheep();
  requestAnimationFrame(animate);
}

// 4. Start game when button pressed
startButton.addEventListener('click', () => {
  startPage.style.display = 'none';
  gameContainer.style.display = 'block';
  animate(); // start moving sheep
});
