# 🍉 Fruit Ninja — Slice & Score

A neon-themed **Fruit Ninja** browser game built with **Next.js 16**, **TypeScript** (strict), **Tailwind CSS**, and **HTML5 Canvas**.

![Fruit Ninja Game](public/favicon.svg)

---

## Features

- **Canvas-rendered gameplay** — smooth 60 fps physics with gravity, rotation, and slice detection
- **3 difficulty levels** — Easy / Medium / Hard with different spawn rates, speeds, and bomb frequencies
- **Slice mechanics** — drag (mouse) or swipe (touch) to slice fruits; line-segment × circle intersection detection
- **Bombs** — slicing a bomb costs a life + triggers a neon explosion ring
- **Missed fruits** — each fruit that falls off the bottom costs a life
- **Combo system** — slice multiple fruits in quick succession for bonus points and a visual multiplier
- **Score popups** — animated +N labels that float up from each sliced fruit
- **Particle effects** — coloured neon particles burst from every slice
- **Sliced halves** — fruits split into two physics-driven halves that fly apart
- **Procedural audio** — Web Audio API sound effects (slice whoosh, bomb boom, miss thud, combo chime) + ambient drone; no external files
- **Audio toggle** — mute / unmute with one click
- **Pause / resume** — pause mid-game and come back anytime
- **High score** — persisted in `localStorage` across sessions
- **New-high-score badge** — animated trophy banner on the game-over screen
- **Neon dark theme** — deep-space background, glowing fruits, radial gradients, neon grid lines
- **Fully responsive** — works on any screen size; touch + mouse input both supported
- **Vercel-ready** — static export, zero configuration needed

---

## Tech Stack

| Layer | Library |
|-------|---------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| Rendering | HTML5 Canvas API |
| Audio | Web Audio API (procedural, no files) |
| Storage | `localStorage` (high score) |
| Deploy | Vercel |

---

## Project Structure

```
fruit_ninja/
├── app/
│   ├── layout.tsx          # Root layout + metadata + viewport
│   ├── page.tsx            # Game orchestrator (phase state machine)
│   └── globals.css         # Tailwind import + global resets
├── components/
│   ├── GameCanvas.tsx      # Canvas game loop, physics, input, rendering
│   ├── HUD.tsx             # Score, lives, combo, pause & audio buttons
│   ├── StartScreen.tsx     # Animated start/difficulty screen
│   ├── GameOverScreen.tsx  # End screen with score & new-high badge
│   └── PauseModal.tsx      # Pause overlay
├── hooks/
│   ├── useAudio.ts         # Procedural Web Audio API sounds
│   └── useHighScore.ts     # localStorage high-score persistence
├── lib/
│   ├── types.ts            # All TypeScript interfaces and union types
│   ├── constants.ts        # Physics, difficulty, fruit catalogue
│   ├── draw.ts             # Pure canvas drawing functions
│   └── slice.ts            # Geometric slice-detection helpers
└── public/
    └── favicon.svg         # Watermelon-slice themed SVG favicon
```

---

## Controls

### Desktop (mouse)
| Action | Control |
|--------|---------|
| Slice fruits | Click and drag |
| Pause | Click ⏸ button |
| Toggle sound | Click 🔊/🔇 button |

### Mobile (touch)
| Action | Control |
|--------|---------|
| Slice fruits | Swipe across the screen |
| Pause | Tap ⏸ button |
| Toggle sound | Tap 🔊/🔇 button |

### Tips
- Slice multiple fruits with a single swipe for a **COMBO** bonus
- Avoid the 💣 bomb — slicing it costs a life
- Each fruit that falls off the bottom also costs a life (3 lives total)
- Choose **Hard** mode for a real challenge — faster fruits and more bombs

---

## Running Locally

**Requirements:** Node.js 18+

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd fruit_ninja

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev

# 4. Open http://localhost:3000 in your browser
```

### Build for production

```bash
npm run build
npm start
```

---

## Deploy to Vercel

The project requires **zero additional configuration** to deploy on Vercel.

### Option A — Vercel CLI

```bash
npm i -g vercel
vercel
```

### Option B — GitHub integration

1. Push your code to a GitHub repository
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Click **Deploy** — done!

No environment variables or special settings needed.

---

## Gameplay Rules

| Event | Effect |
|-------|--------|
| Slice a fruit | +Points (10–30 depending on fruit) |
| Combo (slice ≥2 quickly) | Bonus × combo count |
| Slice a bomb 💣 | −1 life + explosion |
| Miss a fruit (falls off) | −1 life |
| Reach 0 lives | Game over |

### Difficulty comparison

| | Easy | Medium | Hard |
|--|--|--|--|
| Spawn interval | 1.9 s | 1.3 s | 0.85 s |
| Fruit speed | Slow | Medium | Fast |
| Bomb chance | 6 % | 14 % | 22 % |
| Max on screen | 5 | 7 | 10 |

---

## License

MIT
