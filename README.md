# MNMX Memory Battle

A stylish browser-based memory battle game where you compete against an adaptive AI opponent.

Flip cards, memorize positions, build streaks, and outplay MNMX across multiple difficulty levels ranging from casual to impossible.

---

## Features

### Adaptive AI Opponent
MNMX uses a simulated memory system with:
- Memory retention
- Accuracy scaling
- Strategy profiles
- Exploration logic
- Difficulty-based behavior

The AI becomes noticeably smarter and faster at higher difficulties.

---

## Gameplay Features

- Multiple AI difficulty levels
- Hint system
- Combo streak tracking
- Animated scoreboards
- Match history + statistics
- Multiple card themes
- Smooth card flip animations
- Responsive layout
- Keyboard accessibility
- Dynamic turn indicators

---

## Audio System

The game includes procedural sound effects built entirely with the Web Audio API:
- Card flips
- Matches
- Mismatches
- Streak fanfares
- Victory / defeat sounds
- Hint chimes

No external audio assets required.

---

## Card Themes

Switch between multiple card styles:
- Emoji
- Numbers
- Letters
- Symbols

---

## Difficulty Modes

| Difficulty | Board Size | AI Accuracy | Hints |
|---|---|---|---|
| Easy | 4×4 | Low | 2 |
| Medium | 4×5 | Moderate | 1 |
| Hard | 6×6 | High | 0 |
| Impossible | 8×8 | Perfect Memory | 0 |

---

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Web Audio API
- LocalStorage

No frameworks or dependencies.

---

## Project Structure

```txt
mnmx-memory-battle/
│
├── index.html
│
├── css/
│   ├── main.css
│   ├── header.css
│   ├── board.css
│   ├── result.css
│   └── history.css
│
├── js/
│   ├── config.js
│   ├── sound.js
│   ├── ai.js
│   ├── ui.js
│   ├── game.js
│   ├── app.js
│   └── history.js
│
└── assets/
    └── favicon.svg
```

---

## AI System Overview

The AI opponent dynamically changes behavior depending on the selected difficulty.

### AI Behaviors
- Random exploration
- Memory retention probabilities
- Known pair recognition
- Strategic unseen-card targeting
- Accuracy simulation

### AI Profiles

| Strategy | Behavior |
|---|---|
| Dumb | Mostly random |
| Normal | Balanced memory and exploration |
| Smart | Prioritizes information gain and known matches |

---

## Match History & Stats

The game stores completed matches locally using `localStorage`.

Tracked stats include:
- Wins / losses / draws
- Win rate
- Best streak
- Best scores by difficulty
- Match history timeline

---

## Accessibility

- Keyboard playable
- Screen reader labels
- Focusable cards
- ARIA live regions
- Responsive mobile layout

---

## Running Locally

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/mnmx-memory-battle.git
```

Open `index.html` in your browser.

No installation or build process required.

---

## Future Ideas

- Online multiplayer
- Ranked mode
- AI personalities
- Touch gesture support
- Particle effects
- More card themes
- Theme editor
- Statistics dashboard
- PWA support
- Mobile haptics

---

## License

MIT License

Feel free to fork, modify, and improve the project.

---

## Screenshots

Add screenshots or GIFs here after publishing.

Example:

```md
![Gameplay Screenshot](assets/preview.png)
```

---

## Deploying with GitHub Pages

1. Push the repo to GitHub
2. Open repository settings
3. Go to **Pages**
4. Set source to:
   - Deploy from branch
   - `main`
   - `/root`
5. Save

Your game will be live at:

```txt
https://YOUR_USERNAME.github.io/mnmx-memory-battle/
```

---

## Credits

Designed and built with Vanilla JavaScript.

Inspired by classic concentration and memory games with competitive AI mechanics.
