//  MNMX MEMORY BATTLE — config.js
//  Game constants, emoji pool, difficulty defs

const EMOJIS = [
  '🐶','🐱','🦊','🐻','🐼','🦁','🐯','🐨',
  '🦄','🐸','🦋','🌸','⭐','🍕','🎸','🎯',
  '🚀','🌈','🎲','🧩','🔮','🦀','🌵','🏆'
];

// aiAccuracy  - chance of using a known pair / match (0–1)
// aiRetention - chance of actually storing a seen card in memory (0–1)
// aiStrategy  - 'dumb' | 'normal' | 'smart' (controls exploration logic)
// aiDelay     - ms before AI starts its turn

const DIFFICULTY = {
  easy: {
    pairs:       8,
    cols:        4,
    label:       'Easy — 4×4',
    aiDelay:     900,
    aiAccuracy:  0.35,  // frequently ignores known pairs
    aiRetention: 0.40,  // forgets most of what it sees
    aiStrategy:  'dumb' // fully random, no information strategy
  },
  medium: {
    pairs:       10,
    cols:        4,
    label:       'Medium — 4×5',
    aiDelay:     600,
    aiAccuracy:  0.60,  // uses known pairs about half the time
    aiRetention: 0.70,  // forgets roughly a third of cards
    aiStrategy:  'normal' // mild bias toward unseen cards
  },
  hard: {
    pairs:       18,
    cols:        6,
    label:       'Hard — 6×6',
    aiDelay:     400,
    aiAccuracy:  0.88,  // sharp but occasionally slips
    aiRetention: 0.92,  // strong memory with rare lapses
    aiStrategy:  'smart' // prioritises unseen cards, picks best known pair
  },
  impossible: {
    pairs:       18,
    cols:        6,
    label:       'Impossible — 6×6',
    aiDelay:     280,
    aiAccuracy:  1.00,  // never wastes a known pair
    aiRetention: 1.00,  // perfect memory, forgets nothing
    aiStrategy:  'smart' // optimal exploration and exploitation
  },
};

// How long the AI "peeks" at the first card before flipping second
const AI_PEEK_DURATION    = 520;  // ms
const AI_BETWEEN_CARDS    = 480;  // ms pause between 1st and 2nd flip
const MISMATCH_HIDE_DELAY = 950;  // ms before hiding mismatched cards
const MATCH_PAUSE         = 420;  // ms before continuing after a match