# 🎨 Drawwiz - Drawing & Guessing Game

A modern, real-time multiplayer drawing and guessing game inspired by Skribbl.io. Built with Node.js, Socket.io, React, and Tailwind CSS.

## ✨ Features

- **Real-time Multiplayer**: Play with friends using WebSocket technology
- **Room System**: Create or join rooms with unique 4-word-slug IDs
- **Shareable URLs**: Easy room sharing with `domain.com/room/[ROOM_ID]`
- **Drawing Engine**: Smooth HTML5 Canvas with color palette, adjustable brush thickness, and undo
- **Game Mechanics**:
  - Round-based gameplay with player rotation
  - AI/Tech-themed word bank (100+ terms)
  - Speed-based scoring system
  - Server-side timer to prevent cheating
  - Automatic correct answer detection
- **Modern UI**: Dark-themed, responsive design for mobile and desktop
- **Live Chat**: Real-time chat with game events

## 🚀 Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web server
- **Socket.io** - Real-time bidirectional communication
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Socket.io Client** - WebSocket client

## 📋 Prerequisites

- **Node.js** v16 or higher
- **npm** or **yarn**

## 🛠️ Installation

### 1. Clone the repository (if applicable)
```bash
cd d:/Drawwiz
```

### 2. Install Backend Dependencies
```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

## 🎮 Running the Application

You need to run both the backend and frontend servers.

### Terminal 1: Start Backend Server
```bash
cd backend
npm start
```
Backend will run on `http://localhost:3001`

### Terminal 2: Start Frontend Dev Server
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:5173`

## 🎯 How to Play

1. **Open the app** in your browser at `http://localhost:5173`
2. **Enter your name** on the home page
3. **Create a new room** or **join an existing one** using a room ID
4. **Share the room URL** with friends
5. **Wait for at least 2 players**, then the host can start the game
6. **Take turns drawing**:
   - Drawer selects a word from 3 options
   - Drawer uses the canvas tools to illustrate the word
   - Other players type guesses in the chat
7. **Earn points** by guessing correctly (faster = more points!)
8. **Winner** is the player with the highest score after all rounds

## 🎨 Game Rules

- **Minimum Players**: 2
- **Rounds**: 3 (configurable in `backend/gameManager.js`)
- **Time per Round**: 80 seconds
- **Scoring**:
  - First correct guess: Up to 100 points
  - Subsequent guesses: Decreasing points
  - Time bonus: More time remaining = more points
  - Minimum: 50 points per correct guess

## 📁 Project Structure

```
d:/Drawwiz/
├── backend/
│   ├── server.js           # Main Express + Socket.io server
│   ├── roomManager.js      # Room CRUD operations
│   ├── gameManager.js      # Game logic and scoring
│   ├── wordList.js         # AI/Tech word bank
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx    # Landing page
│   │   │   └── Room.jsx    # Game room
│   │   ├── components/
│   │   │   ├── Canvas.jsx
│   │   │   ├── Chat.jsx
│   │   │   ├── PlayerList.jsx
│   │   │   ├── Timer.jsx
│   │   │   └── WordSelector.jsx
│   │   ├── hooks/
│   │   │   └── useSocket.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```

## 🔧 Configuration

### Backend Port
Edit `backend/server.js`:
```javascript
const PORT = process.env.PORT || 3001
```

### Frontend Proxy
Edit `frontend/vite.config.js`:
```javascript
proxy: {
  '/socket.io': {
    target: 'http://localhost:3001',
  },
}
```

### Game Settings
Edit `backend/gameManager.js`:
- `maxRounds`: Number of rounds (default: 3)
- `timer`: Seconds per round (default: 80)

### Word Bank
Add/edit words in `backend/wordList.js`

## 🌐 Deployment

### Backend (Node.js Server)
Deploy to platforms like:
- Heroku
- Railway
- Render
- DigitalOcean

**Environment Variables**:
- `PORT`: Server port
- `FRONTEND_URL`: Frontend URL for CORS

### Frontend (Static Site)
Deploy to platforms like:
- Vercel
- Netlify
- GitHub Pages

**Build Command**:
```bash
cd frontend
npm run build
```

**Update Socket.io URL** in `frontend/src/hooks/useSocket.js` to your production backend URL.

## 🐛 Troubleshooting

### Socket.io Connection Issues
- Make sure backend is running on port 3001
- Check CORS settings in `backend/server.js`
- Verify proxy configuration in `frontend/vite.config.js`

### Canvas Not Drawing
- Ensure you're the current drawer
- Check browser console for errors
- Try refreshing the page

### Missing Dependencies
```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install
```

## 🎨 Customization

### Colors
Edit `frontend/tailwind.config.js` for theme colors

### Animations
Edit `frontend/src/index.css` for custom animations

### Game Flow
Edit `backend/gameManager.js` for custom game logic

## 📝 License

MIT License - feel free to use for personal and commercial projects!

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Add new features
- Fix bugs
- Improve documentation
- Enhance UI/UX

## 🙏 Acknowledgments

- Inspired by Skribbl.io
- Built with modern web technologies
- Dark theme design for comfortable gameplay

---

**Enjoy playing Drawwiz! 🎨🎮**
