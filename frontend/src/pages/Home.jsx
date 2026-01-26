import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Home() {
    const [roomId, setRoomId] = useState('')
    const [playerName, setPlayerName] = useState('')
    const navigate = useNavigate()

    const generateRoomId = () => {
        const words = [
            'happy', 'sunny', 'bright', 'clever', 'swift', 'brave', 'calm', 'wise',
            'coding', 'drawing', 'gaming', 'ninja', 'wizard', 'dragon', 'phoenix', 'tiger',
            'blue', 'red', 'green', 'purple', 'golden', 'silver', 'cosmic', 'neon',
            'alpha', 'beta', 'gamma', 'delta', 'omega', 'prime', 'ultra', 'mega'
        ]

        const randomWords = []
        for (let i = 0; i < 4; i++) {
            const randomIndex = Math.floor(Math.random() * words.length)
            randomWords.push(words[randomIndex])
        }

        return randomWords.join('-')
    }

    const handleCreateRoom = () => {
        if (!playerName.trim()) {
            alert('Please enter your name!')
            return
        }
        const newRoomId = generateRoomId()
        localStorage.setItem('playerName', playerName)
        navigate(`/room/${newRoomId}`)
    }

    const handleJoinRoom = () => {
        if (!playerName.trim()) {
            alert('Please enter your name!')
            return
        }
        if (!roomId.trim()) {
            alert('Please enter a room ID!')
            return
        }
        localStorage.setItem('playerName', playerName)

        // Extract room ID from full URL if pasted
        const urlMatch = roomId.match(/room\/([^\/]+)/)
        const finalRoomId = urlMatch ? urlMatch[1] : roomId.trim()

        navigate(`/room/${finalRoomId}`)
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-30" style={{
                backgroundImage: 'url(/images/background-pattern.svg)',
                backgroundRepeat: 'repeat',
                backgroundSize: '100px 100px'
            }}></div>
            
            <div className="max-w-2xl w-full relative z-10">
                {/* Header with Logo */}
                <div className="text-center mb-12 animate-fade-in">
                    <div className="flex justify-center mb-6">
                        <img 
                            src="/images/logo.svg" 
                            alt="Drawwiz Logo" 
                            className="w-32 h-32 animate-bounce-slow hover:scale-110 transition-transform duration-300"
                        />
                    </div>
                    <h1 className="text-7xl font-bold mb-4 bg-gradient-to-r from-primary-400 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
                        Drawwiz
                    </h1>
                    <p className="text-gray-700 text-2xl font-medium">
                        🎨 Draw, Guess, and Have Fun! 🎮
                    </p>
                </div>

                {/* Main Card */}
                <div className="card p-8 animate-slide-up backdrop-blur-sm bg-white/95 shadow-2xl border-2 border-gray-200">
                    {/* Player Name Input */}
                    <div className="mb-6">
                        <label className="block text-gray-800 font-semibold mb-2 text-lg">
                            👤 Your Name
                        </label>
                        <input
                            type="text"
                            className="input-field text-lg"
                            placeholder="Enter your name..."
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                            maxLength={20}
                        />
                    </div>

                    {/* Create Room */}
                    <div className="mb-6">
                        <button
                            onClick={handleCreateRoom}
                            className="btn-primary w-full text-lg py-4 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all"
                        >
                            🎨 Create New Room
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t-2 border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-700 font-semibold">OR</span>
                        </div>
                    </div>

                    {/* Join Room */}
                    <div className="mb-6">
                        <label className="block text-gray-800 font-semibold mb-2 text-lg">
                            🔑 Room ID or URL
                        </label>
                        <input
                            type="text"
                            className="input-field mb-4 text-lg"
                            placeholder="Enter room ID or paste URL..."
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                        />
                        <button
                            onClick={handleJoinRoom}
                            className="btn-secondary w-full text-lg py-4 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all"
                        >
                            🚪 Join Room
                        </button>
                    </div>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className="card p-6 text-center hover:scale-105 transition-transform duration-300 hover:shadow-2xl bg-gradient-to-br from-white to-blue-50 border-2 border-blue-100">
                        <div className="flex justify-center mb-3">
                            <img src="/images/drawing-illustration.svg" alt="Draw" className="w-24 h-24" />
                        </div>
                        <h3 className="font-bold text-gray-900 text-lg mb-2">Draw & Create</h3>
                        <p className="text-sm text-gray-600">Express your creativity with colors</p>
                    </div>
                    <div className="card p-6 text-center hover:scale-105 transition-transform duration-300 hover:shadow-2xl bg-gradient-to-br from-white to-purple-50 border-2 border-purple-100">
                        <div className="flex justify-center mb-3">
                            <img src="/images/guess-illustration.svg" alt="Guess" className="w-24 h-24" />
                        </div>
                        <h3 className="font-bold text-gray-900 text-lg mb-2">Guess & Win</h3>
                        <p className="text-sm text-gray-600">Be quick to score more points</p>
                    </div>
                    <div className="card p-6 text-center hover:scale-105 transition-transform duration-300 hover:shadow-2xl bg-gradient-to-br from-white to-yellow-50 border-2 border-yellow-100">
                        <div className="flex justify-center mb-3">
                            <img src="/images/trophy-illustration.svg" alt="Trophy" className="w-24 h-24" />
                        </div>
                        <h3 className="font-bold text-gray-900 text-lg mb-2">Compete & Fun</h3>
                        <p className="text-sm text-gray-600">Play with friends online</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home
