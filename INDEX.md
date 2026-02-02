# Ninja Run - Documentation Index

## 📚 Getting Started

Start here to understand the project:

1. **README.md** - Game overview and how to play
2. **QUICK_REFERENCE.md** - Quick config adjustments (START HERE for tweaks)
3. **CODE_ORGANIZATION.md** - Full project structure and file descriptions

## 🎮 Game Files

### Core Game
- **sketch.js** - Main game controller (well-organized with section headers)
- **config.js** - All configuration constants (edit this to adjust game)
- **utils.js** - Reusable utility functions
- **entities.js** - Game entity classes (Particle, HitEffect, Enemy)

### Assets
- **index.html** - Main HTML file (loads all scripts in correct order)
- **images/** - Game graphics
- **sounds/** - Audio files
- **p5.min.js** - p5.js library
- **p5.sound.min.js** - p5.sound library

## 📖 Documentation

### For Tweakers
- **QUICK_REFERENCE.md** ← Start here to adjust game parameters
- **CLEANUP_SUMMARY.md** - What changed in the cleanup

### For Developers
- **CODE_ORGANIZATION.md** - Full architecture and structure
- **sketch.js** - Comments and section headers throughout code
- **config.js** - Self-documenting configuration
- **utils.js** - Helper function documentation
- **entities.js** - Class documentation with JSDoc

### Project Docs
- **README.md** - Original game description
- **IMPROVEMENTS.md** - Feature additions log
- **This file** - Documentation index

## 🔧 Common Tasks

### Adjust Game Difficulty
→ See **QUICK_REFERENCE.md** "Easier/Harder" section

### Change Sound Volumes
→ Edit `config.js` → `SOUND_VOLUMES` section

### Modify Player Speed
→ Edit `config.js` → `PLAYER.MOVE_SPEED`

### Add New Feature
→ Read **CODE_ORGANIZATION.md** → "Future Improvements"

### Understand Game Flow
→ See **CODE_ORGANIZATION.md** → "Game Flow" diagram

## 📊 Project Stats

| Metric | Value |
|--------|-------|
| Files | 6 game files + 5 docs |
| Total Lines | ~1500 |
| Configuration | Fully centralized |
| Magic Numbers | 0 |
| Documentation | Complete |

## 🎯 Key Improvements Made

✅ Separated configuration into `config.js`  
✅ Extracted utilities to `utils.js`  
✅ Moved classes to `entities.js`  
✅ Added comprehensive documentation  
✅ Cleaned code with section headers  
✅ Replaced magic numbers with named constants  
✅ Improved code organization  

## 🚀 How to Use

1. **To Play:**
   - Open `index.html` in a web browser

2. **To Modify:**
   - Edit values in `config.js`
   - Refresh browser (Ctrl+F5)
   - Test changes

3. **To Extend:**
   - Add new classes to `entities.js`
   - Add new functions to `utils.js`
   - Add new config to `config.js`
   - Use in `sketch.js`

4. **To Debug:**
   - Check browser console (F12)
   - Add console.log() in relevant sections
   - Use breakpoints in DevTools

## 📝 File Descriptions (Quick)

| File | Lines | Purpose |
|------|-------|---------|
| sketch.js | 1178 | Main game logic & rendering |
| config.js | 88 | All configuration constants |
| utils.js | 68 | Helper functions |
| entities.js | 143 | Game entity classes |
| index.html | 25 | Entry point |

## 🎓 Learning Path

### Beginner (Just Want to Tweak)
1. Read QUICK_REFERENCE.md
2. Edit config.js values
3. Play and test

### Intermediate (Want to Understand)
1. Read CODE_ORGANIZATION.md
2. Review sketch.js sections
3. Check config.js constants

### Advanced (Want to Modify)
1. Study all documentation
2. Review code sections
3. Add features following patterns
4. Test thoroughly

## 🔍 Code Navigation

### By Task
- **Want to change player speed?** → config.js line 15
- **Want to adjust camera?** → config.js line 21
- **Want to change sounds?** → config.js line 37
- **Want to add particles?** → entities.js line 35
- **Want to add enemy logic?** → entities.js line 86
- **Want to change main loop?** → sketch.js line 79

### By Section (sketch.js)
- Lines 1-40: Game state variables
- Lines 43-64: Asset loading (preload)
- Lines 66-76: Setup & initialization
- Lines 79-89: Main game loop
- Lines 95-101: Utilities
- Lines 101-140: Menu UI
- Lines 141-578: Game rendering & logic
- Lines 584-669: Game initialization
- Lines 670-732: Input handling
- Lines 733+: World rendering & entities

## 💡 Tips

- Always reload (Ctrl+F5) after changing config.js
- Test one change at a time
- Keep backup of working config
- Use browser DevTools (F12) for debugging
- Check console for error messages

## ✨ What's Next?

Suggested improvements:
1. Add level progression system
2. Add power-up items
3. Add mobile touch controls
4. Add score multipliers
5. Add different enemy types
6. Add more visual effects
7. Add high score system
8. Add particle effects variations

See CODE_ORGANIZATION.md for implementation suggestions.

## 📞 Support

For questions about:
- **Game rules** → See README.md
- **Features added** → See IMPROVEMENTS.md
- **Code structure** → See CODE_ORGANIZATION.md
- **How to tweak** → See QUICK_REFERENCE.md
- **What changed** → See CLEANUP_SUMMARY.md

---

**Last Updated:** February 2, 2026  
**Status:** ✅ Clean, Organized, Well-Documented  
**Version:** 1.0 (Improved & Refactored)
