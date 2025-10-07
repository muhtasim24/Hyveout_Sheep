// ========================
// 1. Get elements
// ========================
const startPage = document.getElementById('startPage');
const startButton = document.getElementById('startButton');
const gameContainer = document.getElementById('gameContainer');
const cloudOverlay = document.getElementById('cloud-overlay');
const music = document.getElementById('background-music');


const sheepElements = [
  document.getElementById('sheep1'),
  document.getElementById('sheep2'),
  document.getElementById('sheep3'),
  document.getElementById('sheep4'),
  document.getElementById('sheep5'),
  document.getElementById('sheep6'),
  document.getElementById('sheep7'),
  document.getElementById('sheep8')
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
// scoreDiv.style.position = 'absolute';
// scoreDiv.style.top = '20px';
// scoreDiv.style.left = '20px';
// scoreDiv.style.fontSize = '24px';
// scoreDiv.style.color = 'white';
// scoreDiv.style.zIndex = 20;
// scoreDiv.textContent = `Score: ${score}`;
document.body.appendChild(scoreDiv);

// ========================
// 3. Sheep data
// ========================
const screenW = window.innerWidth;
const screenH = window.innerHeight;

const sheepData = [
  { x: screenW * 0.15, y: screenH * 0.2, dx: 1.8, dy: 2.2, captured: false },
  { x: screenW * 0.35, y: screenH * 0.4, dx: 2.5, dy: 1.6, captured: false },
  { x: screenW * 0.55, y: screenH * 0.15, dx: -2.2, dy: 2.1, captured: false },
  { x: screenW * 0.75, y: screenH * 0.5, dx: 1.7, dy: -1.9, captured: false },
  { x: screenW * 0.25, y: screenH * 0.7, dx: -1.5, dy: 2.3, captured: false },
  { x: screenW * 0.65, y: screenH * 0.75, dx: 2.3, dy: 1.4, captured: false },
  { x: screenW * 0.85, y: screenH * 0.35, dx: -2.0, dy: 1.8, captured: false },
  { x: screenW * 0.45, y: screenH * 0.6, dx: 1.6, dy: -2.2, captured: false }
];

// 👇 Add this
sheepData.forEach((sheep, index) => {
  sheepElements[index].style.transform = `translate(${sheep.x}px, ${sheep.y}px)`;
});

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
// 5. Freehand drawing detection
// ========================
let drawing = false;
let path = []; // store all points

function startDraw(x, y) {
  drawing = true;
  path = [{ x, y }];
}

function moveDraw(x, y) {
  if (!drawing) return;
  path.push({ x, y });
}

function endDraw() {
  if (!drawing) return;
  drawing = false;

  // Check if path forms a loop (start & end close)
  const start = path[0];
  const end = path[path.length - 1];
  const dist = Math.hypot(end.x - start.x, end.y - start.y);

  if (dist < 150 && path.length > 10) {
    // Approximate circle center & radius
    let sumX = 0, sumY = 0;
    path.forEach(p => { sumX += p.x; sumY += p.y; });
    const centerX = sumX / path.length;
    const centerY = sumY / path.length;

    // average radius
    const avgRadius = path.reduce((acc, p) => acc + Math.hypot(p.x - centerX, p.y - centerY), 0) / path.length;

    // Check if any sheep are inside that circle
    sheepData.forEach((sheep, index) => {
      if (sheep.captured) return;
      const sheepCenterX = sheep.x + SHEEP_SIZE / 2;
      const sheepCenterY = sheep.y + SHEEP_SIZE / 2;
      const d = Math.hypot(sheepCenterX - centerX, sheepCenterY - centerY);
      if (d < avgRadius) {
        sheep.captured = true;
        sheepElements[index].style.display = 'none';
        score += 1;
        scoreDiv.textContent = `Score: ${score}`;
      }
    });
  }

  // Clear drawing
  path = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawPath() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (drawing && path.length > 1) {
    ctx.beginPath();
    ctx.moveTo(path[0].x, path[0].y);
    for (let i = 1; i < path.length; i++) {
      ctx.lineTo(path[i].x, path[i].y);
    }
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
  drawPath();
  requestAnimationFrame(animate);
}

// ========================
// 8. Start game
// ========================
startButton.addEventListener('click', () => {
  startPage.style.display = 'none';
  gameContainer.style.display = 'block';
  // show all clouds inside overlay

  animate();
  music.play();
  
  cloudOverlay.style.display = "block";
  // show all clouds inside overlay
  const clouds = cloudOverlay.querySelectorAll('.cloud');
  clouds.forEach(cloud => {
      cloud.style.display = "block";
  });
});

// ========================
// Optional: resize canvas
// ========================
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
