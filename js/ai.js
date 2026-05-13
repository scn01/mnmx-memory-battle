//  MNMX MEMORY BATTLE — ai.js
//  AI opponent: memory, strategy, turn logic

class MnmxAI {
  constructor() {
    this.memory     = {};       // idx -> emoji for seen cards
    this.accuracy   = 0.75;    // chance of using a known pair
    this.retention  = 1.0;     // chance of actually retaining a seen card
    this.strategy   = 'normal'; // 'dumb' | 'normal' | 'smart'
  }

  reset(cfg) {
    this.memory    = {};
    this.accuracy  = cfg.aiAccuracy;
    this.retention = cfg.aiRetention;
    this.strategy  = cfg.aiStrategy;
  }

  // Record a card the AI has seen, may forget it based on retention
  see(idx, emoji) {
    if (Math.random() < this.retention) {
      this.memory[idx] = emoji;
    }
  }

  // Find ALL known matching pairs among unmatched cards
  findKnownPairs(unmatchedCards) {
    const seen  = {};
    const pairs = [];
    for (const card of unmatchedCards) {
      const idx   = card.dataset.idx;
      const emoji = this.memory[idx];
      if (!emoji) continue;
      if (seen[emoji]) {
        pairs.push([seen[emoji], card]);
        delete seen[emoji];
      } else {
        seen[emoji] = card;
      }
    }
    return pairs;
  }

  // Find the single best known pair
  findKnownPair(unmatchedCards) {
    const pairs = this.findKnownPairs(unmatchedCards);
    if (!pairs.length) return null;
    if (this.strategy === 'smart') {
      // Pick the pair seen earliest (lowest index = most confident memory)
      return pairs.reduce((best, p) =>
        parseInt(p[0].dataset.idx) < parseInt(best[0].dataset.idx) ? p : best
      );
    }
    return pairs[0];
  }

  // Find a match for a specific card among candidates
  findMatchFor(card, candidates) {
    return candidates.find(c =>
      c !== card && this.memory[c.dataset.idx] === card.dataset.emoji
    ) || null;
  }

  // Pick a card to explore, behaviour varies by strategy
  pickExplore(pool) {
    if (this.strategy === 'dumb') {
      // Easy: fully random, no memory bias
      return pool[Math.floor(Math.random() * pool.length)];
    }
    if (this.strategy === 'smart') {
      // Hard: always prefer unseen cards to maximise information gain
      const unknown = pool.filter(c => !this.memory[c.dataset.idx]);
      return unknown.length > 0
        ? unknown[Math.floor(Math.random() * unknown.length)]
        : pool[Math.floor(Math.random() * pool.length)];
    }
    // Normal: mild bias toward unseen
    const unknown = pool.filter(c => !this.memory[c.dataset.idx]);
    const target  = unknown.length > 0 ? unknown : pool;
    return target[Math.floor(Math.random() * target.length)];
  }

  // Main AI turn strategy 
  chooseTurn(unmatchedCards) {
    const known = this.findKnownPair(unmatchedCards);

    if (known && Math.random() < this.accuracy) {
      return { type: 'match', first: known[0], second: known[1] };
    }

    const first = this.pickExplore(unmatchedCards);
    return { type: 'explore', first, second: null };
  }

  // After first card revealed, decide second card
  chooseSecond(firstCard, unmatchedCards) {
    const rest  = unmatchedCards.filter(c => c !== firstCard);
    const match = this.findMatchFor(firstCard, rest);

    if (match && Math.random() < this.accuracy) {
      return match;
    }
    return this.pickExplore(rest) || rest[0];
  }
}
