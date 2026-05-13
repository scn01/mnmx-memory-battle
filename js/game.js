//  MNMX MEMORY BATTLE — game.js
//  Core game loop, turn management, win check

const Game = (() => {

  // --- State ---
  let deck      = [];
  let flipped   = [];
  let matched   = 0;
  let total     = 8;
  let locked    = false;
  let yourTurn  = true;
  let youScore  = 0;
  let aiScore   = 0;
  let gameOver  = false;
  let diff      = DIFFICULTY.easy;
  let diffKey   = 'easy';

  const ai = new MnmxAI();

  const STORE_KEY = 'mnmx-scores-v1';

  // Log result to localStorage  
  function logResult(you, aiS, diffLabel) {
    try {
      const raw   = localStorage.getItem(STORE_KEY);
      const games = raw ? JSON.parse(raw) : [];
      games.push({ you, ai: aiS, diff: diffLabel, ts: Date.now() });
      localStorage.setItem(STORE_KEY, JSON.stringify(games));
      if (window.History) History.refresh();
    } catch (_) {}
  }


  // Shuffle 
  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Get unmatched cards 
  function getUnmatched() {
    return Array.from(UI.board().children).filter(c =>
      !c.classList.contains('matched-you') &&
      !c.classList.contains('matched-ai') &&
      !c.classList.contains('flipped')
    );
  }

  // Start / restart 
  function start() {
    diffKey    = UI.diffSelect().value;
    diff       = DIFFICULTY[diffKey] || DIFFICULTY.easy;
    total      = diff.pairs;
    matched    = 0; youScore = 0; aiScore = 0;
    flipped    = []; locked = false; yourTurn = true; gameOver = false;

    ai.reset(diff);

    UI.hideResult();
    UI.updateScore(0, 0, total);
    UI.setTurnPill('you');
    UI.setActive('you');

    const pool = EMOJIS.slice(0, total);
    deck = shuffle([...pool, ...pool]);
    UI.renderBoard(deck, diff.cols, playerFlip);
  }

  // Player flip 
  function playerFlip(card) {
    if (!yourTurn || locked || gameOver) return;
    if (card.classList.contains('flipped') ||
        card.classList.contains('matched-you') ||
        card.classList.contains('matched-ai')) return;

    UI.flipCard(card);
    ai.see(card.dataset.idx, card.dataset.emoji);
    flipped.push(card);

    if (flipped.length === 2) {
      locked = true;
      const [a, b] = flipped;
      if (a.dataset.emoji === b.dataset.emoji) {
        setTimeout(() => {
          UI.matchCards(a, b, 'you');
          youScore++;
          matched++;
          UI.updateScore(youScore, aiScore, total);
          flipped = []; locked = false;
          if (!checkEnd()) { /* player goes again */ }
        }, MATCH_PAUSE);
      } else {
        setTimeout(() => {
          UI.hideCard(a); UI.hideCard(b);
          flipped = []; locked = false;
          yourTurn = false;
          UI.setTurnPill('ai');
          UI.setActive('ai');
          setTimeout(aiTurn, diff.aiDelay);
        }, MISMATCH_HIDE_DELAY);
      }
    }
  }

  // --- AI turn ---
  function aiTurn() {
    if (gameOver) return;
    const unmatched = getUnmatched();
    if (unmatched.length < 2) return;

    const plan = ai.chooseTurn(unmatched);
    const firstCard = plan.first;

    // Peek first card
    UI.peekCard(firstCard);
    ai.see(firstCard.dataset.idx, firstCard.dataset.emoji);

    setTimeout(() => {
      // Choose second card now that we've "seen" the first
      const unmatched2 = getUnmatched().filter(c => c !== firstCard);
      const secondCard = ai.chooseSecond(firstCard, [firstCard, ...unmatched2]);

      UI.peekCard(secondCard);
      ai.see(secondCard.dataset.idx, secondCard.dataset.emoji);

      setTimeout(() => {
        UI.unpeekCard(firstCard);
        UI.unpeekCard(secondCard);

        if (firstCard.dataset.emoji === secondCard.dataset.emoji) {
          // Match!
          setTimeout(() => {
            UI.matchCards(firstCard, secondCard, 'ai');
            aiScore++;
            matched++;
            UI.updateScore(youScore, aiScore, total);
            if (!checkEnd()) {
              setTimeout(aiTurn, diff.aiDelay);
            }
          }, MATCH_PAUSE);
        } else {
          // No match — hand to player
          setTimeout(() => {
            UI.hideCard(firstCard);
            UI.hideCard(secondCard);
            yourTurn = true;
            UI.setTurnPill('you');
            UI.setActive('you');
          }, MISMATCH_HIDE_DELAY);
        }
      }, AI_PEEK_DURATION);
    }, AI_BETWEEN_CARDS);
  }

  // --- Check win condition ---
  function checkEnd() {
    if (matched === total) {
      gameOver = true;
      UI.setTurnPill('done');
      UI.resetScoreCards();
      logResult(youScore, aiScore, diff.label.split(' — ')[0]);
      setTimeout(() => UI.showResult(youScore, aiScore), 400);
      return true;
    }
    return false;
  }

  // Public API
  return { start };

})();