# 🎨 DrawWiz - Multiplayer Drawing & Guessing Game

A complete real-time multiplayer drawing and guessing game inspired by Skribbl.io. Built with React, TypeScript, Node.js, Express, Socket.io, and Fabric.js for advanced canvas functionality.

## ✨ Features

- **Real-time Multiplayer**: Play with friends using WebSocket technology (Socket.io)
- **Room System**: 
  - Public rooms with auto-matchmaking
  - Private rooms with 6-character codes for sharing with friends
- **Customizable Game Settings**: Configure time per turn (60-120s), rounds (2-5), max players (4-10), word choices (2-4), hints, and penalties
- **Advanced Drawing Tools**:
  - 5 pen sizes (2px to 20px)
  - 16 preset colors + custom RGB color picker
  - Fill tool for quick coloring
  - Undo/Redo with 50-action history
  - Clear canvas button
- **Smart Scoring System**:
  - Points based on speed: 200 × (TimeRemaining / TotalTime)
  - Position bonuses: 1st (+40), 2nd (+20), 3rd (+10)
  - Drawer earns 25% of all guessers' points
  - Optional penalties: -5 per wrong guess, -10 for drawer if no one guesses
- **Word Dictionary**: 
  - Default categories: Animals, Objects, Famous Places, Movies, General Vocabulary
  - Support for custom word lists
  - Smart word hint formatting (single/multi-word, compound words)
- **Game Flow**:
  - Turn-based gameplay with sequential player rotation
  - One round = all players draw once
  - Word selection popup for drawer
  - Real-time chat with guess feedback
  - Automatic turn progression
- **Results Screen**:
  - Animated podium for top 3 players
  - Full leaderboard with rankings
  - Play again option for room creator
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop devices
- **Modern UI**: Built with Tailwind CSS for a clean, professional look

## 🚀 Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web server framework
- **Socket.io** - Real-time bidirectional communication
- **CORS** - Cross-origin resource sharing
- **In-memory storage** - Fast game state management (can be extended with MongoDB)

### Frontend
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Fabric.js** - Powerful canvas library for drawing
- **Socket.io Client** - WebSocket client

## 📋 Prerequisites

- **Node.js** v16 or higher
- **npm** or **yarn**

## 🛠️ Installation

### 1. Clone the repository
```bash
git clone https://github.com/Talha24079/Drawwiz.git
cd Drawwiz
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

### 4. Configure Environment Variables

**Backend** (`backend/.env`):
```bash
cp .env.example .env
# Edit .env:
# PORT=3001
# CLIENT_URL=http://localhost:5173
```

**Frontend** (`frontend/.env`):
```bash
cp .env.example .env
# Edit .env:
# VITE_SERVER_URL=http://localhost:3001
```

## 🎮 Running the Application

You need to run both the backend and frontend servers.

### Terminal 1: Start Backend Server
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:3001`

### Terminal 2: Start Frontend Dev Server
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:5173`

Open your browser at `http://localhost:5173` to start playing!

## 🎯 How to Play

1. **Enter Your Name**: Start by entering your player name (2-20 characters)
2. **Choose Game Mode**:
   - **Start Game**: Join public matchmaking (auto-creates or joins a public room)
   - **Create Private Room**: Create a private room and get a 6-character code to share
   - **Join Room**: Join a private room using a friend's room code

3. **Game Lobby**: 
   - Wait for at least 2 players to join
   - Room creator (host) can configure game settings:
     - Time per turn: 60-120 seconds
     - Rounds: 2-5
     - Max players: 4-10
     - Word choices: 2-4 options
     - Enable/disable hints and penalties
   - Host starts the game when ready

4. **Gameplay**:
   - **Drawing Turn**:
     - Select a word from 3 choices in the popup
     - Use drawing tools to illustrate the word
     - Canvas automatically syncs to all players
     - Earn 25% of all guessers' points
   - **Guessing Turn**:
     - See the word hint (e.g., `_ _ _ _ _ _ ⁶` for 6-letter word)
     - Type guesses in the chat
     - Faster guesses = more points
     - Position bonuses for 1st, 2nd, 3rd correct guesses

5. **Scoring**:
   - **Guessers**: Points = 200 × (TimeRemaining / TotalTime) + PositionBonus
     - 1st correct guess: +40 points
     - 2nd correct guess: +20 points
     - 3rd correct guess: +10 points
   - **Drawer**: Earns 25% of total points earned by all guessers
   - **Penalties** (if enabled):
     - -5 points per wrong guess
     - -10 points for drawer if no one guesses correctly

6. **Turn Progression**:
   - Each player gets one turn per round
   - After all players have drawn, the round ends
   - Game continues for the configured number of rounds

7. **Results**:
   - View final standings with podium for top 3
   - See complete leaderboard
   - Room creator can start a new game with "Play Again"

## 🎨 Drawing Tools

- **Pen Tool**: Draw freehand with customizable size and color
- **Fill Tool**: Flood fill areas (basic implementation)
- **Pen Sizes**: 5 options - 2px, 5px, 10px, 15px, 20px
- **Colors**: 
  - 16 preset colors (black, white, primary colors, etc.)
  - Custom RGB color picker
- **Actions**:
  - **Undo**: Revert last 50 actions
  - **Redo**: Restore undone actions
  - **Clear**: Wipe the entire canvas

## 🎮 Game Settings

All settings can be configured by the room creator in the lobby:

- **Time per Turn**: 60, 80, 100, or 120 seconds
- **Rounds**: 2, 3, 4, or 5 rounds
- **Max Players**: 4, 6, 8, or 10 players
- **Word Choices**: 2, 3, or 4 words to choose from
- **Hints Enabled**: Show/hide word hints with letter count
- **Penalties Enabled**: Enable/disable scoring penalties for wrong guesses

## 📝 Word Format Examples

The game displays word hints in different formats:

- **Single word** (6 letters): `_ _ _ _ _ _ ⁶`
- **Multiple words** (3 + 3 letters): `--- ³ --- ³`
- **Compound word** (minar-e-pakistan): `_ _ _ _ _ ⁵ - _ ¹ - _ _ _ _ _ _ _ _ ⁸`

## 🗂️ Word Categories

Default word dictionary includes:
- **Animals**: dog, cat, elephant, lion, tiger, bear, etc.
- **Objects**: chair, table, lamp, book, phone, computer, etc.
- **Famous Places**: eiffel tower, taj mahal, pyramids, etc.
- **Movies**: titanic, avatar, inception, matrix, etc.
- **General Vocabulary**: happiness, freedom, mountain, rainbow, etc.

Custom words can be added through the game settings.

## 📁 Project Structure

```
Drawwiz/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   ├── Room.js              # Room data model
│   │   │   ├── Player.js            # Player data model
│   │   │   └── WordDictionary.js    # Word management
│   │   ├── services/
│   │   │   ├── RoomService.js       # Room CRUD operations
│   │   │   └── GameService.js       # Game logic and scoring
│   │   ├── socket/
│   │   │   └── handlers/
│   │   │       ├── roomHandlers.js      # Room socket events
│   │   │       ├── gameHandlers.js      # Game socket events
│   │   │       └── drawingHandlers.js   # Drawing socket events
│   │   ├── utils/
│   │   │   └── helpers.js           # Utility functions
│   │   └── index.js                 # Main server file
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Home/
│   │   │   │   ├── HomeScreen.tsx
│   │   │   │   └── NameInput.tsx
│   │   │   ├── Lobby/
│   │   │   │   ├── Lobby.tsx
│   │   │   │   ├── PlayerList.tsx
│   │   │   │   └── GameSettings.tsx
│   │   │   ├── Game/
│   │   │   │   ├── GameScreen.tsx
│   │   │   │   ├── Canvas.tsx           # Fabric.js canvas
│   │   │   │   ├── DrawingTools.tsx
│   │   │   │   ├── WordDisplay.tsx
│   │   │   │   ├── Timer.tsx
│   │   │   │   ├── Chat.tsx
│   │   │   │   └── WordSelection.tsx
│   │   │   ├── Results/
│   │   │   │   ├── ResultsScreen.tsx
│   │   │   │   └── Podium.tsx
│   │   │   └── Common/
│   │   │       ├── Button.tsx
│   │   │       └── Modal.tsx
│   │   ├── hooks/
│   │   │   └── useSocket.ts
│   │   ├── services/
│   │   │   └── socket.service.ts
│   │   ├── types/
│   │   │   └── game.types.ts
│   │   ├── utils/
│   │   │   ├── validation.ts
│   │   │   ├── scoring.ts
│   │   │   └── wordFormatter.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── .env.example
│   ├── tsconfig.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── .gitignore
└── README.md
```

## 🔌 Socket Events

### Client → Server Events
- `create-room`: Create a new room (public or private)
- `join-room`: Join a room by code
- `join-public`: Join public matchmaking queue
- `update-settings`: Update game settings (host only)
- `start-game`: Start the game (host only)
- `select-word`: Select word to draw (drawer only)
- `draw-stroke`: Send drawing stroke data
- `draw-fill`: Send fill tool data
- `draw-undo`: Undo last drawing action
- `draw-redo`: Redo undone action
- `draw-clear`: Clear entire canvas
- `send-guess`: Submit a guess
- `leave-room`: Leave the current room
- `play-again`: Reset game for new round (host only)

### Server → Client Events
- `room-created`: Room successfully created
- `room-joined`: Successfully joined a room
- `room-updated`: Room settings changed
- `player-joined`: New player joined the room
- `player-left`: Player left the room
- `creator-changed`: New host assigned
- `game-started`: Game has begun
- `turn-started`: New turn started
- `word-selection`: Show word choices (to drawer)
- `word-selected`: Word chosen, start drawing
- `drawing-update`: Sync drawing action
- `guess-result`: Feedback on guess (correct/incorrect)
- `chat-message`: Chat message broadcast
- `player-guessed`: Player guessed correctly
- `turn-ended`: Turn completed with results
- `round-ended`: Round completed
- `game-ended`: Game finished with final leaderboard
- `game-reset`: Game restarted
- `error`: Error message

## 🔧 Configuration

### Backend Environment Variables
Edit `backend/.env`:
```env
PORT=3001
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend Environment Variables
Edit `frontend/.env`:
```env
VITE_SERVER_URL=http://localhost:3001
```

### Game Settings (Defaults)
In `backend/src/models/Room.js`:
- `timePerTurn`: 80 seconds
- `rounds`: 3
- `maxPlayers`: 8
- `wordCount`: 3
- `hintsEnabled`: true
- `penaltiesEnabled`: false

## 🌐 Deployment

### Backend Deployment
Deploy to platforms like Heroku, Railway, Render, or DigitalOcean.

**Environment Variables**:
```env
PORT=3001
CLIENT_URL=https://your-frontend-url.com
NODE_ENV=production
```

**Deploy Steps**:
1. Push code to Git repository
2. Connect repository to hosting platform
3. Set environment variables
4. Deploy!

### Frontend Deployment
Deploy to Vercel, Netlify, or GitHub Pages.

**Build Command**:
```bash
cd frontend
npm run build
```

**Environment Variables**:
```env
VITE_SERVER_URL=https://your-backend-url.com
```

**Deploy Steps**:
1. Build the project: `npm run build`
2. Deploy the `dist` folder to hosting platform
3. Set environment variables
4. Configure custom domain (optional)

## 🐛 Troubleshooting

### Socket.io Connection Issues
- Ensure backend is running on the correct port (default: 3001)
- Check CORS configuration in `backend/src/index.js`
- Verify `VITE_SERVER_URL` in frontend `.env` matches backend URL
- Check browser console for WebSocket errors

### Canvas Not Drawing
- Ensure you're the current drawer (check for pencil emoji next to name)
- Verify Fabric.js loaded correctly (check browser console)
- Try refreshing the page
- Check network tab for socket connection

### Players Not Syncing
- Verify Socket.io connection is established
- Check backend logs for errors
- Ensure all players are in the same room code
- Try leaving and rejoining the room

### Missing Dependencies
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors
```bash
cd frontend
npm run build
# Check output for specific type errors
```

## 🎨 Customization

### Adding Custom Words
Edit `backend/src/models/WordDictionary.js` to add new categories or words:
```javascript
export const defaultWordDictionary = {
  'Your Category': [
    'word1', 'word2', 'word3'
  ],
  // ... other categories
};
```

### Changing Colors/Theme
Edit `frontend/tailwind.config.js`:
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#your-color',
      }
    }
  }
}
```

### Modifying Game Logic
- **Scoring**: Edit `backend/src/utils/helpers.js` → `calculateScore()`
- **Turn Duration**: Modify in game settings or `backend/src/models/Room.js`
- **Word Selection**: Edit `backend/src/services/GameService.js` → `startTurn()`

### UI Customization
- **Components**: All UI components in `frontend/src/components/`
- **Styling**: Uses Tailwind CSS utility classes
- **Animations**: Add custom animations in `frontend/src/index.css`

## 🚀 Future Enhancements

Potential features to add:
- [ ] MongoDB integration for persistent storage
- [ ] User authentication and profiles
- [ ] Private messaging between players
- [ ] Power-ups and special abilities
- [ ] Custom drawing templates
- [ ] Multiple language support
- [ ] Mobile app versions (React Native)
- [ ] Spectator mode
- [ ] Replay saved games
- [ ] Achievement system
- [ ] Leaderboards across all games
- [ ] Custom avatars
- [ ] Voice chat integration

## 📝 License

MIT License - feel free to use this project for learning, personal use, or commercial projects!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- Inspired by [Skribbl.io](https://skribbl.io)
- Built with modern web technologies
- Canvas drawing powered by [Fabric.js](http://fabricjs.com)
- Real-time communication via [Socket.io](https://socket.io)
- UI styled with [Tailwind CSS](https://tailwindcss.com)

## 📧 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing issues for solutions
- Read the troubleshooting section

## 👨‍💻 Authors

- **DrawWiz Team** - Initial work

---

**Made with ❤️ and TypeScript. Enjoy playing DrawWiz! 🎨🎮**
