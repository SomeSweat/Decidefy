// simple wheel logic without external libs
const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const spinButton = document.getElementById('spinBtn');
const choiceEl = document.getElementById('choice');
const proList = document.getElementById('proList');
const contraList = document.getElementById('contraList');
let decisions = [];
let angle = 0;
let spinInterval;

function fetchDecisions() {
  return fetch('/api/decisions').then(r => r.json());
}

function fetchArguments(key) {
  return fetch(`/api/arguments/${key}`).then(r => r.json());
}

function drawWheel() {
  const size = canvas.width;
  const seg = decisions.length;
  const arc = (2 * Math.PI) / seg;

  decisions.forEach((d, i) => {
    const start = angle + i * arc;
    ctx.beginPath();
    ctx.moveTo(size / 2, size / 2);
    ctx.arc(size / 2, size / 2, size / 2, start, start + arc);
    ctx.fillStyle = i % 2 === 0 ? '#f2a' : '#a2f';
    ctx.fill();

    ctx.save();
    ctx.translate(size / 2, size / 2);
    ctx.rotate(start + arc / 2);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#000';
    ctx.font = '16px sans-serif';
    ctx.fillText(d.label, size / 2 - 10, 0);
    ctx.restore();
  });
}

function spin() {
  let velocity = Math.random() * 0.3 + 0.3;
  clearInterval(spinInterval);
  spinInterval = setInterval(() => {
    angle += velocity;
    velocity *= 0.97; // friction
    drawWheel();
    if (velocity < 0.001) {
      clearInterval(spinInterval);
      showResult();
    }
  }, 16);
}

function showResult() {
  const seg = decisions.length;
  const arc = (2 * Math.PI) / seg;
  const normalized = (angle % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
  const index = Math.floor((2 * Math.PI - normalized + arc / 2) / arc) % seg;
  const chosen = decisions[index];
  choiceEl.textContent = chosen.label;
  fetchArguments(chosen.key).then(data => {
    proList.innerHTML = '';
    contraList.innerHTML = '';
    data.pro.forEach(p => {
      const li = document.createElement('li');
      li.textContent = p;
      proList.appendChild(li);
    });
    data.contra.forEach(c => {
      const li = document.createElement('li');
      li.textContent = c;
      contraList.appendChild(li);
    });
  });
}

fetchDecisions().then(list => {
  decisions = list;
  drawWheel();
});

spinButton.addEventListener('click', spin);