# Copepod Game

A simple browser-based educational game inspired by marine food webs.

In this game, you control a copepod, collect drifting diatoms to increase your food score, and avoid predatory fish. The objective is to survive for as long as possible while gathering food from the surrounding plankton-rich environment.

---

## 🌊 About

Copepods are tiny crustaceans that play a vital role in marine ecosystems. They transfer energy from microscopic phytoplankton to larger animals including fish, seabirds and marine mammals.

This game represents a simplified marine food chain:

```text
Diatom → Copepod → Fish
```

Players experience the ecological challenge of finding food while avoiding predators.

---

## 🎮 Gameplay

### Objective

- Collect diatoms to increase your food score.
- Avoid predatory fish.
- Survive as long as possible.

### Scoring

Each diatom collected increases your score by one point.

```text
Food Score +1
```

### Game Over

The game ends when a fish collides with the copepod.

A game-over screen displays:

- "YOU WERE EATEN"
- Total food collected

Players can immediately restart using the restart button.

---

## 🕹 Controls

### Desktop

| Key | Action |
|------|---------|
| ↑ | Move up |
| ↓ | Move down |
| ← | Move left |
| → | Move right |

### Mobile and Tablet

Touch anywhere on the screen and the copepod will swim towards your finger.

Touch controls support:

- Touch start
- Touch move
- Touch release

---

## 🐟 Game Features

### Copepod

- Player-controlled organism
- Keyboard and touch support
- Restricted to the game area

### Diatoms

- Continuously drift across the screen
- Random vertical positions
- Respawn after collection or leaving the screen

### Fish Predators

- Spawn at fixed intervals
- Random swimming speeds
- Random vertical positions
- Move from right to left across the screen
- Cause game over upon collision

### Scoring System

- Real-time food counter
- Displayed during play
- Final score shown on game-over screen

---

## 🛠 Technologies

Built using:

- HTML5
- CSS3
- Vanilla JavaScript
- HTML5 Canvas

No external frameworks or libraries are required.

---

## 🚀 Running the Game

### Clone the repository

```bash
git clone https://github.com/Billy-Hunter-AFBI/Copepod-game.git
```

### Open the game

Open:

```text
index.html
```

in any modern web browser.

Alternatively, host the files using GitHub Pages or another static web server.

---

## 📂 Project Structure

```text
Copepod-game/
│
├── index.html
├── style.css
├── game.js
└── README.md
```

---

## 🌍 Educational Purpose

This game was created as a lightweight educational resource to demonstrate:

- Marine food webs
- Predator-prey interactions
- The role of plankton in ocean ecosystems
- Basic game development using JavaScript and HTML5 Canvas

It is intended for outreach, education and science communication activities.

---

## Future Development Ideas

Potential future additions include:

- Multiple predator species
- Increasing difficulty levels
- Animated sprites
- Sound effects
- High-score tracking
- Power-ups
- Additional zooplankton species
- Energy and survival mechanics
- Marine ecosystem information panels

---

## Author

**Billy Hunter**  
Senior Scientific Officer  
Agri-Food and Biosciences Institute (AFBI), Belfast, Northern Ireland

GitHub: https://github.com/Billy-Hunter-AFBI

---

## License

This project is released under the MIT License.

You are free to use, modify and distribute the code for educational and non-commercial purposes.
