//  MNMX MEMORY BATTLE — history.js
//  Past games panel, reads/writes localStorage

const History = (() => {

  const STORE_KEY = 'mnmx-scores-v1';

  function outcome(g) {
    return g.you > g.ai ? 'win' : g.ai > g.you ? 'loss' : 'draw';
  }

  function fmtDate(ts) {
    return new Date(ts).toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (_) { return []; }
  }

  function save(games) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(games)); } catch (_) {}
  }

  function refresh() {
    const games  = load();
    const list   = document.getElementById('history-list');
    const wins   = games.filter(g => outcome(g) === 'win').length;
    const losses = games.filter(g => outcome(g) === 'loss').length;
    const draws  = games.filter(g => outcome(g) === 'draw').length;
    const total  = games.length;

    document.getElementById('hs-wins').textContent   = wins   + 'W';
    document.getElementById('hs-losses').textContent = losses + 'L';
    document.getElementById('hs-draws').textContent  = draws  + 'D';
    document.getElementById('hs-rate').textContent   = total
      ? '· ' + Math.round(wins / total * 100) + '%'
      : '';

    if (!games.length) {
      list.innerHTML = '<div class="history-empty">No games yet — finish a game to see it here.</div>';
      return;
    }

    list.innerHTML = [...games].reverse().map(g => {
      const out   = outcome(g);
      const label = out === 'win' ? 'Victory' : out === 'loss' ? 'Defeat' : 'Draw';
      return `<div class="history-row ${out}">
        <div class="hr-meta">
          <div class="hr-date">${fmtDate(g.ts)}</div>
          <span class="hr-diff">${g.diff || 'Medium'}</span>
        </div>
        <div class="hr-score">
          <span class="sy">${g.you}</span>
          <span class="sv"> vs </span>
          <span class="sai">${g.ai}</span>
        </div>
        <span class="hr-pill ${out}">${label}</span>
      </div>`;
    }).join('');
  }

  function init() {
    refresh();
    document.getElementById('btn-clear-hist').addEventListener('click', () => {
      if (!load().length) return;
      save([]);
      refresh();
    });
  }

  return { init, refresh };

})();

document.addEventListener('DOMContentLoaded', () => History.init());