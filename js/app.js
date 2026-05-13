//  MNMX MEMORY BATTLE — app.js
//  Entry point — boots on DOMContentLoaded

document.addEventListener('DOMContentLoaded', () => {
  // Populate difficulty selector from config
  const sel = UI.diffSelect();
  sel.innerHTML = '';
  Object.entries(DIFFICULTY).forEach(([key, cfg]) => {
    const opt = document.createElement('option');
    opt.value = key;
    opt.textContent = cfg.label;
    sel.appendChild(opt);
  });

  // Changing difficulty immediately starts a new game
  sel.addEventListener('change', () => Game.start());

  // Keyboard: space or enter on a focused card flips it
  document.getElementById('board').addEventListener('keydown', e => {
    if ((e.key === ' ' || e.key === 'Enter') && e.target.classList.contains('card')) {
      e.preventDefault();
      e.target.click();
    }
  });

  // Start first game
  Game.start();
});