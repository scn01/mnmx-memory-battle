//  MNMX MEMORY BATTLE — ui.js
//  DOM helpers, rendering, visual state updates

const UI = {

  // Element references 
  board:         () => document.getElementById('board'),
  youScoreEl:    () => document.getElementById('you-score'),
  aiScoreEl:     () => document.getElementById('ai-score'),
  youPairsEl:    () => document.getElementById('you-pairs'),
  aiPairsEl:     () => document.getElementById('ai-pairs'),
  youCard:       () => document.getElementById('you-score-card'),
  aiCard:        () => document.getElementById('ai-score-card'),
  turnPill:      () => document.getElementById('turn-pill'),
  resultBanner:  () => document.getElementById('result-banner'),
  diffSelect:    () => document.getElementById('diff'),

  // Build a single card element 
  makeCard(emoji, index) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.emoji = emoji;
    card.dataset.idx   = index;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', 'Memory card, face down');
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-face card-back">
          <div class="card-back-inner">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
              <line x1="12" y1="17" x2="12.01" y2="17" stroke-width="2.5"/>
            </svg>
          </div>
        </div>
        <div class="card-face card-front" data-owner="">${emoji}</div>
      </div>`;
    return card;
  },

  // Render the board 
  renderBoard(deck, cols, onFlip) {
    const board = UI.board();
    board.innerHTML = '';
    board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    deck.forEach((emoji, i) => {
      const card = UI.makeCard(emoji, i);
      card.addEventListener('click', () => onFlip(card));
      board.appendChild(card);
    });
  },

  // Score display 
  updateScore(youScore, aiScore, total) {
    UI.youScoreEl().textContent = youScore;
    UI.aiScoreEl().textContent  = aiScore;
    UI.youPairsEl().textContent = `${youScore} pair${youScore !== 1 ? 's' : ''}`;
    UI.aiPairsEl().textContent  = `${aiScore} pair${aiScore !== 1 ? 's' : ''}`;
  },

  // Active player highlight 
  setActive(who) {
    UI.youCard().classList.remove('you-active', 'ai-active');
    UI.aiCard().classList.remove('you-active', 'ai-active');
    if (who === 'you') UI.youCard().classList.add('you-active');
    if (who === 'ai')  UI.aiCard().classList.add('ai-active');
  },

  // Turn pill 
  setTurnPill(who) {
    const pill = UI.turnPill();
    pill.className = `turn-pill ${who}`;
    const dot = '<span class="pulse-dot" aria-hidden="true"></span>';
    if (who === 'you')  pill.innerHTML = `${dot} Your turn`;
    if (who === 'ai')   pill.innerHTML = `${dot} MNMX is thinking…`;
    if (who === 'done') pill.innerHTML = `✓ &nbsp;Game over`;
  },

  // Card flip / hide 
  flipCard(card)  { card.classList.add('flipped'); },
  hideCard(card)  { card.classList.remove('flipped', 'ai-peek'); },
  peekCard(card)  { card.classList.add('flipped', 'ai-peek'); },
  unpeekCard(card){ card.classList.remove('ai-peek'); },

  // Mark matched 
  matchCards(a, b, who) {
    a.classList.remove('flipped'); b.classList.remove('flipped');
    a.classList.add(`matched-${who}`); b.classList.add(`matched-${who}`);
    const label = who === 'you' ? 'YOU' : 'AI';
    a.querySelector('.card-front').dataset.owner = label;
    b.querySelector('.card-front').dataset.owner = label;
    a.setAttribute('aria-label', `Matched card — ${a.dataset.emoji}`);
    b.setAttribute('aria-label', `Matched card — ${b.dataset.emoji}`);
  },

  // Result banner 
  showResult(youScore, aiScore) {
    const banner = UI.resultBanner();

    let cls, title, sub;
    if (youScore > aiScore) {
      cls = 'win';
      title = 'Victory!';
      sub = `You outplayed MNMX ${youScore} to ${aiScore}`;
    } else if (aiScore > youScore) {
      cls = 'lose';
      title = 'MNMX wins';
      sub = `MNMX dominated ${aiScore} to ${youScore}. Rematch?`;
    } else {
      cls = 'draw';
      title = 'Draw!';
      sub = `${youScore} pairs each — too close to call`;
    }

    const total = youScore + aiScore;
    banner.className = `result-banner ${cls}`;
    banner.innerHTML = `
      <div class="result-title">${title}</div>
      <div class="result-sub">${sub}</div>
      <div class="result-stats">
        <div class="result-stat">
          <span class="result-stat-val">${youScore}</span>
          <span class="result-stat-label">Your pairs</span>
        </div>
        <div class="result-stat">
          <span class="result-stat-val">${aiScore}</span>
          <span class="result-stat-label">MNMX pairs</span>
        </div>
        <div class="result-stat">
          <span class="result-stat-val">${total}</span>
          <span class="result-stat-label">Total</span>
        </div>
      </div>
      <button class="btn-play-again" id="btn-play-again">↺ &nbsp;Play again</button>
    `;
    document.getElementById('btn-play-again').addEventListener('click', () => Game.start());
    // Force reflow so the transition
    void banner.offsetWidth;
    banner.classList.add('visible');
  },

  hideResult() {
    const b = UI.resultBanner();
    b.classList.remove('visible');
    // Clear content after transition
    b.innerHTML = '';
    b.className = 'result-banner';
  },

  // Reset score cards to neutral 
  resetScoreCards() {
    UI.youCard().classList.remove('you-active','ai-active');
    UI.aiCard().classList.remove('you-active','ai-active');
  },
};