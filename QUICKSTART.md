# DrawWiz - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### Step 1: Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 2: Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
✅ Backend server running on http://localhost:3001

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
✅ Frontend running on http://localhost:5173

### Step 3: Play!

1. Open http://localhost:5173 in your browser
2. Enter your name
3. Click "Start Game" to join public matchmaking
4. Or create a private room and share the code with friends

## 🎮 How to Play

### For Drawer:
1. Select a word from 3 choices
2. Use drawing tools to illustrate
3. Earn 25% of all guessers' points

### For Guessers:
1. Watch the drawing
2. Type guesses in chat
3. Faster = more points!

### Scoring:
- **Base**: 200 × (TimeRemaining / TotalTime)
- **Bonuses**: 1st (+40), 2nd (+20), 3rd (+10)
- **Drawer**: 25% of all guessers' points

## 🔧 Configuration (Optional)

### Backend `.env`:
```bash
PORT=3001
CLIENT_URL=http://localhost:5173
```

### Frontend `.env`:
```bash
VITE_SERVER_URL=http://localhost:3001
```

## 🎨 Features

✅ Real-time multiplayer
✅ Public & private rooms
✅ 5 pen sizes
✅ 16 colors + RGB picker
✅ Undo/Redo (50 actions)
✅ Smart scoring system
✅ Responsive design

## 📝 Game Settings

- Time per turn: 60-120 seconds
- Rounds: 2-5
- Max players: 4-10
- Word choices: 2-4
- Hints: On/Off
- Penalties: On/Off

## 🐛 Troubleshooting

**Can't connect?**
- Check both servers are running
- Verify ports 3001 and 5173 are free
- Check browser console for errors

**Drawing not working?**
- Make sure you're the drawer (pencil emoji)
- Try refreshing the page

**Need help?**
- Check the main README.md
- Open an issue on GitHub

---

**Have fun playing DrawWiz! 🎨**
