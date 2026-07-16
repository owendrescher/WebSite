const symbols = ['🍊', '7', '★', '⚡', '🍒', '◆'];
const reels = [...document.querySelectorAll('.reel')];
const spinButton = document.querySelector('#spin');
const lever = document.querySelector('#lever');
const message = document.querySelector('#message');
const creditsDisplay = document.querySelector('#credits');
const betDisplay = document.querySelector('#bet');
const winDisplay = document.querySelector('#win');
let credits = 100;
let bet = 5;
let spinning = false;
let soundOn = true;

function update() {
  creditsDisplay.textContent = credits;
  betDisplay.textContent = bet;
}

function resultPayout(result) {
  if (result.every(symbol => symbol === '7')) return bet * 20;
  if (new Set(result).size === 1) return bet * 8;
  if (new Set(result).size === 2) return bet * 2;
  return 0;
}

function chirp(frequency, duration = .08) {
  if (!soundOn) return;
  const context = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(.045, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(.001, context.currentTime + duration);
  oscillator.connect(gain).connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + duration);
}

function spin() {
  if (spinning) return;
  if (credits < bet) {
    message.textContent = 'Not enough credits — lower your bet.';
    return;
  }
  spinning = true;
  credits -= bet;
  winDisplay.textContent = '0';
  update();
  spinButton.disabled = true;
  lever.disabled = true;
  lever.setAttribute('aria-busy', 'true');
  lever.classList.remove('pulled');
  void lever.offsetWidth;
  lever.classList.add('pulled');
  message.textContent = 'Round and round…';
  chirp(160, .18);

  const result = reels.map(() => symbols[Math.floor(Math.random() * symbols.length)]);
  setTimeout(() => {
  reels.forEach(reel => reel.classList.add('rolling'));
  reels.forEach((reel, index) => {
    const ticker = setInterval(() => {
      reel.firstElementChild.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    }, 85);
    setTimeout(() => {
      clearInterval(ticker);
      reel.classList.remove('rolling');
      reel.firstElementChild.textContent = result[index];
      chirp(270 + index * 90);
      if (index === reels.length - 1) finish(result);
    }, 650 + index * 330);
  });
  }, 280);
}

function finish(result) {
  const payout = resultPayout(result);
  credits += payout;
  winDisplay.textContent = payout;
  message.textContent = payout ? `Winner! ${payout} credits added.` : 'No match. The machine remains smug.';
  if (payout) chirp(720, .35);
  spinning = false;
  spinButton.disabled = false;
  lever.disabled = false;
  lever.removeAttribute('aria-busy');
  lever.classList.remove('pulled');
  update();
}

spinButton.addEventListener('click', spin);
lever.addEventListener('click', spin);
document.addEventListener('keydown', event => {
  if (event.code === 'Space' && !['INPUT', 'BUTTON'].includes(document.activeElement.tagName)) {
    event.preventDefault();
    spin();
  }
});
document.querySelector('#bet-down').addEventListener('click', () => { if (!spinning) bet = Math.max(1, bet - 1); update(); });
document.querySelector('#bet-up').addEventListener('click', () => { if (!spinning) bet = Math.min(20, bet + 1, credits || 1); update(); });
document.querySelector('#sound').addEventListener('click', event => {
  soundOn = !soundOn;
  event.currentTarget.textContent = soundOn ? 'Sound on' : 'Sound off';
  event.currentTarget.setAttribute('aria-pressed', String(soundOn));
});
