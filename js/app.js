//  MNMX MEMORY BATTLE — app.js
//  Entry point — boots on DOMContentLoaded

document.addEventListener('DOMContentLoaded', () => {

  // Populate difficulty selector
  const diffSel = UI.diffSelect();
  diffSel.innerHTML = '';
  Object.entries(DIFFICULTY).forEach(([key, cfg]) => {
    const opt = document.createElement('option');
    opt.value = key;
    opt.textContent = cfg.label;
    diffSel.appendChild(opt);
  });

  // Populate theme selector
  const themeSel = UI.themeSelect();
  themeSel.innerHTML = '';
  Object.entries(CARD_THEMES).forEach(([key, cfg]) => {
    const opt = document.createElement('option');
    opt.value = key;
    opt.textContent = cfg.label;
    themeSel.appendChild(opt);
  });

  // Changing difficulty or theme starts a new game
  diffSel.addEventListener('change',  () => Game.start());
  themeSel.addEventListener('change', () => Game.start());

  // Hint button
  const hintBtn = document.getElementById('btn-hint');
  if (hintBtn) hintBtn.addEventListener('click', () => Game.useHint());

  // Keyboard: space/enter on card flips it
  document.getElementById('board').addEventListener('keydown', e => {
    if ((e.key === ' ' || e.key === 'Enter') && e.target.classList.contains('card')) {
      e.preventDefault();
      e.target.click();
    }
  });

  // Start first game
  Game.start();
});
