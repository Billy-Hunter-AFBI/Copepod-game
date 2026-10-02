# Copepod Game

A browser-based educational game inspired by marine food webs, plankton ecology, and ocean processes.

In **Copepod Game**, players control a copepod navigating a dynamic marine environment. Feed on sinking diatoms and nutrient-rich faecal pellets to maintain energy reserves while avoiding predatory fish and filter-feeding basking sharks.

The game incorporates ecological concepts including metabolic energy budgets, predator-prey interactions, ocean currents, marine heatwaves, diel vertical migration, and the biological carbon pump.

---

## 🌊 About

Copepods are tiny crustaceans that form a critical link between microscopic phytoplankton and larger marine animals. Despite their small size, they are among the most abundant animals on Earth and play a major role in the transfer of energy and carbon through marine ecosystems.

This game represents a simplified marine food web:

```text
Diatom
   ↓
Copepod
   ↓
Fish
   ↓
Faecal Pellets

Faecal Pellets
   ↓
Copepod

Basking Shark
     ↓
  Copepod
```

Players experience the ecological challenge of balancing food acquisition, energy conservation, and predator avoidance within a changing marine environment.

---

# 🎮 Gameplay

## Objective

- Collect diatoms to gain energy.
- Collect faecal pellets for higher-energy food rewards.
- Avoid predatory fish.
- Avoid basking sharks.
- Manage your energy reserves.
- Survive for as long as possible.

The longer you survive, the higher your survival score.

---

# ⚡ Energy and Metabolism

Unlike many arcade-style collection games, food acts as an **energy reserve**.

The copepod continuously loses energy due to:

- Basic metabolic maintenance.
- The energetic cost of swimming.
- Exposure to marine heatwaves near the ocean surface.

Energy must be replenished through feeding.

### Energy Sources

| Food Item | Energy Gain |
|------------|------------|
| Diatom | +1 |
| Faecal Pellet | +3 |

---

# 🌡 Marine Heatwaves

Marine heatwaves occur periodically throughout the game.

During a heatwave:

- The upper 35% of the water column becomes warmer.
- A visible heatwave layer appears near the surface.
- Remaining within the warm surface water greatly increases metabolic costs.
- Players must balance feeding opportunities against increased energy expenditure.

This reflects the increased energetic stress experienced by marine organisms during unusually warm conditions.

---

# 🌊 Ocean Currents

Episodic currents occur throughout the game.

Current events:

- Appear at random depths.
- Move either left-to-right or right-to-left.
- Transport copepods, diatoms, and faecal pellets.
- Can be used strategically for rapid movement across the water column.

Because copepods are relatively weak horizontal swimmers, currents provide an important mechanism for transport.

---

# 🦈 Basking Shark Events

Large filter-feeding basking sharks occasionally enter the game area.

Features include:

- A warning message before arrival.
- Random timing between appearances.
- Large sweeping movement across the screen.
- Instant death on collision.

Although basking sharks primarily feed on plankton, an encounter in this simplified game represents being captured during filter feeding.

---

# 🐟 Fish Predators

Fish predators are continuously introduced throughout the game.

Fish:

- Spawn at regular intervals.
- Swim from right to left.
- Have variable swimming speeds.
- Produce faecal pellets while moving.
- Cause immediate game over upon collision.

Avoiding predators while maintaining food intake forms the core challenge of the game.

---

# 💩 Faecal Pellets

Faecal pellets are produced by fish as they swim.

Pellets:

- Sink rapidly through the water column.
- Drift with ocean currents.
- Provide a higher-energy food source.
- Yield three times more energy than a diatom.

These pellets represent an important pathway within the marine biological carbon pump, transferring organic matter from surface waters towards the seabed.

---

# 🦠 Diatoms

Diatoms are microscopic phytoplankton that form the primary food source for the copepod.

Features:

- Spawn near the ocean surface.
- Sink slowly through the water column.
- Drift horizontally with surrounding water movement.
- Continuously replenish after consumption.

Diatoms represent primary producers that convert sunlight into biological energy through photosynthesis.

---

# 🦐 Copepod Movement

Movement has been designed to reflect real copepod behaviour.

### Vertical Movement

- Relatively fast.
- Mimics diel vertical migration.
- Allows rapid movement between feeding and safer depths.

### Horizontal Movement

- Relatively slow.
- Reflects the weak horizontal swimming ability of copepods.
- Makes effective use of currents important.

---

# 🕹 Controls

## Desktop

| Key | Action |
|------|---------|
| ↑ | Swim Up |
| ↓ | Swim Down |
| ← | Swim Left |
| → | Swim Right |

## Mobile and Tablet

Touch anywhere on the screen.

The copepod will swim toward your finger position.

Supported gestures:

- Touch Start
- Touch Move
- Touch Release

---

# ⏱ Survival Tracking

The game continuously records:

- Current survival time.
- Session best survival time.
- Current energy reserve.

Displayed during gameplay:

```text
ENERGY
TIME
BEST
```

The objective is to maximise survival duration while maintaining positive energy reserves.

---

# 💀 Game Over

The game ends if:

- A fish collides with the copepod.
- A basking shark collides with the copepod.
- Energy reserves reach zero (starvation).

The game-over screen displays:

- Remaining energy.
- Survival time.
- Best survival time.

Players can immediately restart using the restart button.

---

# 🐠 Ecological Concepts Demonstrated

The game introduces several real marine ecological processes:

- Marine food webs.
- Predator-prey interactions.
- Plankton ecology.
- Diel vertical migration.
- Metabolic energy budgets.
- Ocean circulation and transport.
- Marine heatwaves.
- Carbon transfer through faecal pellets.
- The biological carbon pump.

---

# 🛠 Technologies

Built using:

- HTML5
- CSS3
- Vanilla JavaScript
- HTML5 Canvas

No external frameworks or libraries are required.

---

# 🚀 Running the Game

## Clone the Repository

```bash
git clone https://github.com/Billy-Hunter-AFBI/Copepod-game.git
```

## Open the Game

Open:

```text
index.html
```

in any modern web browser.

Alternatively, host the files using:

- GitHub Pages
- Any static web server

---

# 📂 Project Structure

```text
Copepod-game/
│
├── index.html
├── style.css
├── game.js
└── README.md
```

---

# 🎓 Educational Purpose

This game was developed as a lightweight educational resource for outreach, teaching, and science communication.

It is designed to illustrate how environmental conditions and ecological interactions influence the survival of planktonic organisms, while demonstrating several key principles of marine ecology in an interactive format.

Potential audiences include:

- Schools
- Universities
- Science festivals
- Public engagement activities
- Marine science outreach events

---

# 🔮 Future Development Ideas

Potential future additions include:

- Marine snow formation and aggregation
- Seasonal plankton blooms
- Additional zooplankton species
- Visual predator avoidance behaviours
- Animated sprites
- Sound effects and ambient ocean audio
- High-score persistence
- Difficulty levels
- Ecosystem information panels
- Carbon export tracking
- Dynamic weather and ocean conditions

---

# Author

**Billy Hunter**  
Senior Scientific Officer  
Agri-Food and Biosciences Institute (AFBI)  
Belfast, Northern Ireland

GitHub: https://github.com/Billy-Hunter-AFBI

---

# License

This project is released under the MIT License.

You are free to use, modify, and distribute the code for educational
