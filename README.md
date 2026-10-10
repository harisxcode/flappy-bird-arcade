# Flappy Bird Arcade 🐦

A retro Flappy Bird arcade game built for the browser with TypeScript, React, HTML5 Canvas, and Web Audio API synthesis.

[![Deploy to GitHub Pages](https://github.com/harisxcode/flappy-bird-arcade/actions/workflows/deploy.yml/badge.svg)](https://github.com/harisxcode/flappy-bird-arcade/actions/workflows/deploy.yml)

## 🎮 Play Online
- **GitHub Pages**: [https://harisxcode.github.io/flappy-bird-arcade/](https://harisxcode.github.io/flappy-bird-arcade/)

## ✨ Features
- **Authentic Physics**: Calibrated jump impulse, gravity, terminal velocity, and dive rotation with delta-time clamping (consistent across 60Hz, 120Hz, and 240Hz monitors).
- **Web Audio API Sound Engine**: Synthesized retro sound effects for flap chirp, point double-bell, collision crunch, drop slide, and high-score fanfare (zero external audio file dependencies).
- **5 Unlockable Character Skins**:
  - 🟡 **Sunny**: Classic original golden bird
  - 🔴 **Ruby**: Fiery crimson speedster
  - 🔵 **Azure**: Smooth sky glider
  - 🟢 **Volt**: Cyber emerald speedster
  - 🟠 **Phoenix**: Legendary flame bird
- **3 Difficulty Modes**: Casual (wider gaps), Classic (authentic arcade challenge), and Storm (dynamic moving pipes & rain particles).
- **3 Dynamic Themes**: Day, Sunset, and Night with starry skies.
- **Persistent High Scores & Statistics**: Track total games, wing flaps, pipes cleared, and unlockable medals (Bronze, Silver, Gold, Platinum).
- **Responsive Controls**: Desktop keyboard (Space, Up Arrow, P, R, M) and mobile tap/touch support.

## 🕹️ Controls
| Action | Key / Input |
|---|---|
| **Flap Wings** | <kbd>Space</kbd> / <kbd>↑</kbd> / Tap screen |
| **Pause / Resume** | <kbd>P</kbd> |
| **Restart Game** | <kbd>R</kbd> |
| **Mute / Unmute** | <kbd>M</kbd> |

## 🚀 Local Development
```bash
# Clone the repository
git clone https://github.com/harisxcode/flappy-bird-arcade.git
cd flappy-bird-arcade

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📄 License
MIT License
