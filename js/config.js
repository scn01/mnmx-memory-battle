//  MNMX MEMORY BATTLE — config.js
//  Game constants, card themes, difficulty defs

const CARD_THEMES = {
  emoji: {
    label: 'Emoji',
    pool: ['🐶','🐱','🦊','🐻','🐼','🦁','🐯','🐨',
           '🦄','🐸','🦋','🌸','⭐','🍕','🎸','🎯',
           '🚀','🌈','🎲','🧩','🔮','🦀','🌵','🏆',
           '🦉','🐙','🍄','🌙','🔥','💎','🎪','🐬']
  },
  numbers: {
    label: '123',
    pool: ['1','2','3','4','5','6','7','8',
           '9','10','11','12','13','14','15','16',
           '17','18','19','20','21','22','23','24',
           '25','26','27','28','29','30','31','32']
  },
  letters: {
    label: 'ABC',
    pool: ['A','B','C','D','E','F','G','H',
           'I','J','K','L','M','N','O','P',
           'Q','R','S','T','U','V','W','X',
           'Y','Z','Æ','Ø','Å','Ñ','Ü','Ö']
  },
  symbols: {
    label: '!@#',
    pool: ['★','♦','♣','♠','♥','☀','☁','☂',
           '⚡','❄','♪','✿','◆','▲','●','■',
           '✦','⬟','⬡','⬢','⊕','⊗','⊙','⊛',
           '∞','Ω','Δ','Σ','π','λ','μ','β']
  }
};

// aiAccuracy  — chance of using a known pair / match (0–1)
// aiRetention — chance of actually storing a seen card in memory (0–1)
// aiStrategy  — 'dumb' | 'normal' | 'smart'
// aiDelay     — ms before AI starts its turn
// hints       — number of hints the player gets per game

const DIFFICULTY = {
  easy: {
    pairs:       8,
    cols:        4,
    label:       'Easy — 4×4',
    aiDelay:     900,
    aiAccuracy:  0.35,
    aiRetention: 0.40,
    aiStrategy:  'dumb',
    hints:       2
  },
  medium: {
    pairs:       10,
    cols:        4,
    label:       'Medium — 4×5',
    aiDelay:     600,
    aiAccuracy:  0.60,
    aiRetention: 0.70,
    aiStrategy:  'normal',
    hints:       1
  },
  hard: {
    pairs:       18,
    cols:        6,
    label:       'Hard — 6×6',
    aiDelay:     400,
    aiAccuracy:  0.88,
    aiRetention: 0.92,
    aiStrategy:  'smart',
    hints:       0
  },
  impossible: {
    pairs:       32,
    cols:        8,
    label:       'Impossible — 8×8',
    aiDelay:     280,
    aiAccuracy:  1.00,
    aiRetention: 1.00,
    aiStrategy:  'smart',
    hints:       0
  },
};

const AI_PEEK_DURATION    = 520;
const AI_BETWEEN_CARDS    = 480;
const MISMATCH_HIDE_DELAY = 950;
const MATCH_PAUSE         = 420;
const HINT_FLASH_DURATION = 900;
