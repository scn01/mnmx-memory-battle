//  MNMX MEMORY BATTLE — history.js
//  Past games panel, streak + best-score stats

const History = (() => {

  const STORE_KEY = 'mnmx-scores-v2';

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

  // Compute longest win streak in the games array
  function longestWinStreak(games) {
    let best = 0, cur = 0;
    for (const g of games) {
      if (outcome(g) === 'win') { cur++; best = Math.max(best, cur); }
      else cur = 0;
    }
    return best;
  }

  // Best (player) score per difficulty label
  function bestScores(games) {
    const bests = {};
    for (const g of games) {
      const d = g.diff || 'Medium';
      if (!bests[d] || g.you > bests[d]) bests[d] = g.you;
    }
    return bests;
  }

  function refresh() {
    const games  = load();
    const list   = document.getElementById('history-list');
    const wins   = games.filter(g => outcome(g) === 'win').length;
    const losses = games.filter(g => outcome(g) === 'loss').length;
    const draws  = games.filter(g => outcome(g) === 'draw').length;
    const total  = games.length;
    const streak = longestWinStreak(games);
    const bests  = bestScores(games);

    document.getElementById('hs-wins').textContent   = wins   + 'W';
    document.getElementById('hs-losses').textContent = losses + 'L';
    document.getElementById('hs-draws').textContent  = draws  + 'D';
    document.getElementById('hs-rate').textContent   = total
      ? '· ' + Math.round(wins / total * 100) + '%'
      : '';

    // Streak + best score meta row
    const metaEl = document.getElementById('hs-meta');
    if (metaEl) {
      const streakStr = streak > 0 ? `🔥 Best streak: ${streak}` : '';
      const bestArr   = Object.entries(bests).map(([d, s]) => `${d}: ${s}`);
      const bestStr   = bestArr.length ? `⭐ Best: ${bestArr.join(' · ')}` : '';
      metaEl.textContent = [streakStr, bestStr].filter(Boolean).join('  ·  ');
      metaEl.style.display = (streakStr || bestStr) ? '' : 'none';
    }

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
