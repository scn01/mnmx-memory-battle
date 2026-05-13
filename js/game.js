//  MNMX MEMORY BATTLE — game.js
//  Core game loop, turn management, win check

const Game = (() => {

  // --- State ---
  let deck        = [];
  let flipped     = [];
  let matched     = 0;
  let total       = 8;
  let locked      = false;
  let yourTurn    = true;
  let youScore    = 0;
  let aiScore     = 0;
  let gameOver    = false;
  let diff        = DIFFICULTY.easy;
  let diffKey     = 'easy';
  let youStreak   = 0;   // consecutive player matches
  let aiStreak    = 0;   // consecutive AI matches
  let hintsLeft   = 0;
  let hintActive  = false;

  const ai = new MnmxAI();

  const STORE_KEY = 'mnmx-scores-v2';

  // Log result
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

  // Animate score count-up 
  function animateScore(el, from, to, duration = 300) {
    const start = performance.now();
    function step(now) {
      const t = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(from + (to - from) * t);
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // Update scores with animation
  function updateScoreAnimated(newYou, newAi) {
    const youEl = document.getElementById('you-score');
    const aiEl  = document.getElementById('ai-score');
    const fromYou = parseInt(youEl.textContent) || 0;
    const fromAi  = parseInt(aiEl.textContent)  || 0;
    animateScore(youEl, fromYou, newYou);
    animateScore(aiEl,  fromAi,  newAi);
    document.getElementById('you-pairs').textContent = `${newYou} pair${newYou !== 1 ? 's' : ''}`;
    document.getElementById('ai-pairs').textContent  = `${newAi} pair${newAi !== 1 ? 's' : ''}`;
  }

  // Start / restart
  function start() {
    diffKey    = UI.diffSelect().value;
    diff       = DIFFICULTY[diffKey] || DIFFICULTY.easy;
    total      = diff.pairs;
    matched    = 0; youScore = 0; aiScore = 0;
    flipped    = []; locked = false; yourTurn = true; gameOver = false;
    youStreak  = 0; aiStreak = 0;
    hintsLeft  = diff.hints;
    hintActive = false;

    ai.reset(diff);

    UI.updateScore(0, 0, total);
    UI.setTurnPill('you');
    UI.setActive('you');
    UI.hideResult();
    UI.hideStreak();
    UI.updateHints(hintsLeft);

    const themeKey = UI.themeSelect().value;
    const theme    = CARD_THEMES[themeKey] || CARD_THEMES.emoji;
    const pool     = theme.pool.slice(0, total);
    deck = shuffle([...pool, ...pool]);
    UI.renderBoard(deck, diff.cols, playerFlip);
  }

  // Use hint
  function useHint() {
    if (!yourTurn || locked || gameOver || hintsLeft <= 0 || hintActive) return;

    // Find a pair among unmatched cards — prefer cards the AI has seen
    const unmatched = getUnmatched();
    const pairs = findAnyPair(unmatched);
    if (!pairs) return;

    hintActive = true;
    hintsLeft--;
    UI.updateHints(hintsLeft);
    Sound.hint();

    const [a, b] = pairs;
    a.classList.add('hint-flash');
    b.classList.add('hint-flash');

    setTimeout(() => {
      a.classList.remove('hint-flash');
      b.classList.remove('hint-flash');
      hintActive = false;
    }, HINT_FLASH_DURATION);
  }

  // Find any matching pair among unmatched cards
  function findAnyPair(cards) {
    const seen = {};
    for (const card of cards) {
      const e = card.dataset.emoji;
      if (seen[e]) return [seen[e], card];
      seen[e] = card;
    }
    return null;
  }

  // Player flip 
  function playerFlip(card) {
    if (!yourTurn || locked || gameOver) return;
    if (card.classList.contains('flipped') ||
        card.classList.contains('matched-you') ||
        card.classList.contains('matched-ai')) return;

    Sound.flip();
    UI.flipCard(card);
    ai.see(card.dataset.idx, card.dataset.emoji);
    flipped.push(card);

    if (flipped.length === 2) {
      locked = true;
      const [a, b] = flipped;
      if (a.dataset.emoji === b.dataset.emoji) {
        setTimeout(() => {
          UI.matchCards(a, b, 'you');
          Sound.match();
          youScore++;
          matched++;
          youStreak++;
          aiStreak = 0;
          updateScoreAnimated(youScore, aiScore);
          if (youStreak >= 3) {
            UI.showStreak('you', youStreak);
            Sound.streak(youStreak);
          }
          flipped = []; locked = false;
          checkEnd();
        }, MATCH_PAUSE);
      } else {
        Sound.mismatch();
        setTimeout(() => {
          UI.hideCard(a); UI.hideCard(b);
          flipped = []; locked = false;
          youStreak = 0;
          UI.hideStreak();
          yourTurn = false;
          UI.setTurnPill('ai');
          UI.setActive('ai');
          setTimeout(aiTurn, diff.aiDelay);
        }, MISMATCH_HIDE_DELAY);
      }
    }
  }

  // AI turn
  function aiTurn() {
    if (gameOver) return;
    const unmatched = getUnmatched();
    if (unmatched.length < 2) return;

    const plan = ai.chooseTurn(unmatched);
    const firstCard = plan.first;

    UI.peekCard(firstCard);
    ai.see(firstCard.dataset.idx, firstCard.dataset.emoji);

    setTimeout(() => {
      const unmatched2 = getUnmatched().filter(c => c !== firstCard);
      const secondCard = ai.chooseSecond(firstCard, [firstCard, ...unmatched2]);

      UI.peekCard(secondCard);
      ai.see(secondCard.dataset.idx, secondCard.dataset.emoji);

      setTimeout(() => {
        UI.unpeekCard(firstCard);
        UI.unpeekCard(secondCard);

        if (firstCard.dataset.emoji === secondCard.dataset.emoji) {
          setTimeout(() => {
            UI.matchCards(firstCard, secondCard, 'ai');
            Sound.match();
            aiScore++;
            matched++;
            aiStreak++;
            youStreak = 0;
            updateScoreAnimated(youScore, aiScore);
            if (aiStreak >= 3) {
              UI.showStreak('ai', aiStreak);
              Sound.streak(aiStreak);
            }
            if (!checkEnd()) setTimeout(aiTurn, diff.aiDelay);
          }, MATCH_PAUSE);
        } else {
          Sound.mismatch();
          setTimeout(() => {
            UI.hideCard(firstCard);
            UI.hideCard(secondCard);
            aiStreak = 0;
            UI.hideStreak();
            yourTurn = true;
            UI.setTurnPill('you');
            UI.setActive('you');
          }, MISMATCH_HIDE_DELAY);
        }
      }, AI_PEEK_DURATION);
    }, AI_BETWEEN_CARDS);
  }

  // Check win condition
  function checkEnd() {
    if (matched === total) {
      gameOver = true;
      UI.setTurnPill('done');
      UI.resetScoreCards();
      UI.hideStreak();
      logResult(youScore, aiScore, diff.label.split(' — ')[0]);
      if (youScore > aiScore)      Sound.win();
      else if (aiScore > youScore) Sound.lose();
      else                         Sound.draw();
      setTimeout(() => UI.showResult(youScore, aiScore), 400);
      return true;
    }
    return false;
  }

  // Public API
  return { start, useHint };

})();
