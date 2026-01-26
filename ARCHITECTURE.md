# Drawwiz - Clean File Structure

## 📂 Simplified Project Organization

```
Drawwiz/
│
├── 📱 backend/              # Server (Node.js + Socket.io)
│   ├── server.js           # ⚙️ Main server + WebSocket handler
│   ├── roomManager.js      # 🏠 Room creation, players, state
│   ├── gameManager.js      # 🎮 Game rules, rounds, scoring
│   ├── wordList.js         # 📝 100+ AI/Tech words for drawing
│   └── package.json
│
├── 🎨 frontend/             # Client (React + Vite)
│   ├── src/
│   │   ├── 📄 pages/           # Full page views
│   │   │   ├── Home.jsx       # Landing page (create/join room)
│   │   │   └── Room.jsx       # Game room (main gameplay)
│   │   │
│   │   ├── 🧩 components/      # Reusable UI pieces
│   │   │   ├── Canvas.jsx     # Drawing board
│   │   │   ├── Leaderboard.jsx # Score rankings
│   │   │   ├── Chat.jsx       # Messages
│   │   │   ├── Timer.jsx      # Countdown
│   │   │   └── WordSelector.jsx # Word choice modal
│   │   │
│   │   ├── 🪝 hooks/           # Custom React hooks (logic)
│   │   │   ├── useSocket.js   # Socket.io connection
│   │   │   └── useDrawing.js  # Drawing logic
│   │   │
│   │   ├── 🛠️ utils/           # Helper functions
│   │   │   └── canvasRenderer.js # Canvas drawing functions
│   │   │
│   │   ├── App.jsx         # Router setup
│   │   ├── main.jsx        # React entry point
│   │   └── index.css       # Global styles
│   │
│   ├── index.html
│   ├── vite.config.js      # Build config
│   ├── tailwind.config.js  # Styling config
│   └── package.json
│
└── 📚 docs/
    ├── README.md           # Main documentation
    ├── QUICKSTART.md       # Quick setup guide
    └── ARCHITECTURE.md     # Detailed structure (this file)
```

---

## 🎯 What Each File Does (Simple)

### Backend (4 files only!)

| File | What It Does |
|------|-------------|
| `server.js` | Starts server, handles all WebSocket connections |
| `roomManager.js` | Creates rooms, adds/removes players |
| `gameManager.js` | Controls game: rounds, timer, scoring |
| `wordList.js` | Stores words like "Neural Network", "API Gateway" |

### Frontend Pages (2 files)

| File | What It Does |
|------|-------------|
| `Home.jsx` | First page you see - enter name, create/join room |
| `Room.jsx` | The actual game - combines all components |

### Frontend Components (5 files)

| File | What It Does |
|------|-------------|
| `Canvas.jsx` | The drawing board (colors, brush, undo) |
| `Leaderboard.jsx` | Shows rankings (#1, #2, #3...) with medals |
| `Chat.jsx` | Shows messages in "Name: message" format |
| `Timer.jsx` | Shows countdown (MM:SS) with color bar |
| `WordSelector.jsx` | Popup asking drawer to pick 1 of 3 words |

### Frontend Hooks (2 files)

| File | What It Does |
|------|-------------|
| `useSocket.js` | Connects to server via Socket.io |
| `useDrawing.js` | Handles mouse clicks → drawing strokes |

### Frontend Utils (1 file)

| File | What It Does |
|------|-------------|
| `canvasRenderer.js` | Functions to draw lines on canvas |

---

## 🔍 Quick Find Guide

**I want to change...**

✏️ **How drawing works** → `hooks/useDrawing.js`  
🎨 **Canvas appearance** → `components/Canvas.jsx`  
🏆 **Leaderboard design** → `components/Leaderboard.jsx`  
💬 **Chat format** → `components/Chat.jsx`  
⏱️ **Timer look** → `components/Timer.jsx`  
🎯 **Words used** → `backend/wordList.js`  
🎮 **Game rules** → `backend/gameManager.js`  
🏠 **Room creation** → `backend/roomManager.js`  
🎨 **Colors/theme** → `frontend/src/index.css`  
🏠 **Landing page** → `pages/Home.jsx`  
🎮 **Main game screen** → `pages/Room.jsx`  

---

## 📊 File Count Summary

- **Backend**: 4 code files
- **Frontend Pages**: 2 files  
- **Frontend Components**: 5 files
- **Frontend Hooks**: 2 files
- **Frontend Utils**: 1 file
- **Config files**: 6 files (package.json, vite.config.js, etc.)

**Total: ~20 source files** - Clean and organized!

---

## ✅ Clean Organization Principles

1. **Pages** = Complete views users see
2. **Components** = UI building blocks
3. **Hooks** = Logic (no UI)
4. **Utils** = Pure helper functions
5. **Backend** = All server code in one folder

Everything has a clear place and purpose!
