// 초기 설정
const START_CREDITS = 10;
const PAYOUTS = {
  twoOfKind: 5,
  triple: 20,
  jackpot: 50,
};

let credits = START_CREDITS;
let spinning = false;

// DOM 요소 연결
const messageEl = document.getElementById("message");
const creditsEl = document.getElementById("credits");
const reelsEl = document.querySelectorAll(".reel");

const spinBtn = document.getElementById("spinBtn");
const autoBtn = document.getElementById("autoBtn");
const resetBtn = document.getElementById("resetBtn");

// UI 업데이트 함수
function updateUI() {
  creditsEl.textContent = credits;
}


const SYMBOLS = ['🍒', '🔔', '🍋', '⭐', '💎', '7️⃣'];


function randomSymbol() {
return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
}


async function spin() {
if (spinning) return;
if (credits <= 0) {
messageEl.textContent = '크레딧이 없습니다. 리셋하세요.';
return;
}


spinning = true;
messageEl.textContent = '돌리는 중...';
credits--;
updateUI();


let finalSymbols = [];
for (let i = 0; i < reelsEl.length; i++) {
let symbol = '';
for (let j = 0; j < 15 + i * 5; j++) {
symbol = randomSymbol();
reelsEl[i].textContent = symbol;
await new Promise(res => setTimeout(res, 50));
}
finalSymbols.push(symbol);
}


evaluate(finalSymbols);
spinning = false;
}


function evaluate(symbols) {
const counts = {};
symbols.forEach(s => counts[s] = (counts[s] || 0) + 1);
const occurrences = Object.values(counts).sort((a,b) => b-a);


if (occurrences[0] === 3) {
const isSeven = symbols.every(s => s === '7️⃣');
const reward = isSeven ? PAYOUTS.jackpot : PAYOUTS.triple;
credits += reward;
messageEl.textContent = isSeven ? `잭팟! ${reward} 크레딧 획득!` : `트리플! ${reward} 크레딧 획득!`;
} else if (occurrences[0] === 2) {
credits += PAYOUTS.twoOfKind;
messageEl.textContent = `같은 기호 2개! ${PAYOUTS.twoOfKind} 크레딧 획득!`;
} else {
messageEl.textContent = '꽝! 다음 기회를 노려요.';
}
updateUI();
}


function resetGame() {
credits = START_CREDITS;
for (let i = 0; i < reelsEl.length; i++) {
reelsEl[i].textContent = '🍒';
}
messageEl.textContent = '다시 시작합니다!';
updateUI();
}


async function autoSpin(times = 5) {
for (let i = 0; i < times; i++) {
if (credits <= 0) break;
await spin();
await new Promise(res => setTimeout(res, 300));
}
}


spinBtn.addEventListener('click', spin);
autoBtn.addEventListener('click', () => autoSpin(5));
resetBtn.addEventListener('click', resetGame);


updateUI();

