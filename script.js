// ========================
// 1. Get elements
// ========================
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

// ========================
// 2. Score
// ========================
let score = 0;
const scoreDiv = document.createElement('div');
scoreDiv.id = 'score';
scoreDiv.style.position = 'absolute';
scoreDiv.style.top = '20px';
scoreDiv.style.left = '20px';
scoreDiv.style.fontSize = '24px';
scoreDiv.style.color = 'white';
scoreDiv.style.zIndex = 20;
scoreDiv.textContent = `Score: ${score}`;
document.body.appendChild(scoreDiv);

// ========================
// 3. Sheep data
// ========================
const sheepData = [
  { x: 100, y: 100, dx: 2, dy: 1.5, captured: false },
  { x: 300, y: 400, dx: 1.5, dy: 2, captured: false },
  { x: 500, y: 600, dx: 2, dy: 1.2, captured: false }
];

// ========================
// 4. Sheep movement
// ========================
function updateSheep() {
  sheepData.forEach((sheep, index) => {
    if (sheep.captured) return;

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

// ========================
// 5. Circle drawing & capture
// ========================
let drawing = false;
let startX = 0, startY = 0;
let currentX = 0, currentY = 0;

function startDraw(x, y) {
  drawing = true;
  startX = x;
  startY = y;
  currentX = x;
  currentY = y;
}

function moveDraw(x, y) {
  if (!drawing) return;
  currentX = x;
  currentY = y;
}

function endDraw() {
  if (!drawing) return;
  drawing = false;

  const radius = Math.hypot(currentX - startX, currentY - startY);

  // Check which sheep are inside the circle
  sheepData.forEach((sheep, index) => {
    if (sheep.captured) return;
    const centerX = sheep.x + SHEEP_SIZE / 2;
    const centerY = sheep.y + SHEEP_SIZE / 2;
    const distance = Math.hypot(centerX - startX, centerY - startY);
    if (distance <= radius) {
      sheep.captured = true;
      sheepElements[index].style.display = 'none';
      score += 1;
      scoreDiv.textContent = `Score: ${score}`;
    }
  });

  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawCircle() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (drawing) {
    const radius = Math.hypot(currentX - startX, currentY - startY);
    ctx.beginPath();
    ctx.arc(startX, startY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.8)';
    ctx.lineWidth = 4;
    ctx.stroke();
  }
}

// ========================
// 6. Mouse & touch events
// ========================
canvas.addEventListener('mousedown', e => startDraw(e.clientX, e.clientY));
canvas.addEventListener('mousemove', e => moveDraw(e.clientX, e.clientY));
canvas.addEventListener('mouseup', endDraw);

canvas.addEventListener('touchstart', e => {
  const t = e.touches[0];
  startDraw(t.clientX, t.clientY);
});
canvas.addEventListener('touchmove', e => {
  const t = e.touches[0];
  moveDraw(t.clientX, t.clientY);
});
canvas.addEventListener('touchend', endDraw);

// ========================
// 7. Animation loop
// ========================
function animate() {
  updateSheep();
  drawCircle();
  requestAnimationFrame(animate);
}

// ========================
// 8. Start game
// ========================
startButton.addEventListener('click', () => {
  startPage.style.display = 'none';
  gameContainer.style.display = 'block';
  animate();
});

// ========================
// Optional: resize canvas
// ========================
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
