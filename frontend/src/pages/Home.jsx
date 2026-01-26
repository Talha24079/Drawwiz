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
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                {/* Header */}
                <div className="text-center mb-12 animate-fade-in">
                    <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-primary-400 to-purple-500 bg-clip-text text-transparent">
                        Drawwiz
                    </h1>
                    <p className="text-gray-600 text-xl">
                        Draw, Guess, and Have Fun!
                    </p>
                </div>

                {/* Main Card */}
                <div className="card p-8 animate-slide-up">
                    {/* Player Name Input */}
                    <div className="mb-6">
                        <label className="block text-gray-700 font-semibold mb-2">
                            Your Name
                        </label>
                        <input
                            type="text"
                            className="input-field"
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
                            className="btn-primary w-full text-lg"
                        >
                            🎨 Create New Room
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-600">OR</span>
                        </div>
                    </div>

                    {/* Join Room */}
                    <div className="mb-6">
                        <label className="block text-gray-700 font-semibold mb-2">
                            Room ID or URL
                        </label>
                        <input
                            type="text"
                            className="input-field mb-4"
                            placeholder="Enter room ID or paste URL..."
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                        />
                        <button
                            onClick={handleJoinRoom}
                            className="btn-secondary w-full text-lg"
                        >
                            🚪 Join Room
                        </button>
                    </div>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                    <div className="card p-4 text-center hover:scale-105 transition-transform">
                        <div className="text-3xl mb-2">🎨</div>
                        <h3 className="font-semibold text-gray-900">Draw & Create</h3>
                        <p className="text-sm text-gray-600">Express your creativity</p>
                    </div>
                    <div className="card p-4 text-center hover:scale-105 transition-transform">
                        <div className="text-3xl mb-2">💡</div>
                        <h3 className="font-semibold text-gray-900">Guess & Win</h3>
                        <p className="text-sm text-gray-600">Be quick to score points</p>
                    </div>
                    <div className="card p-4 text-center hover:scale-105 transition-transform">
                        <div className="text-3xl mb-2">🏆</div>
                        <h3 className="font-semibold text-gray-900">Compete & Fun</h3>
                        <p className="text-sm text-gray-600">Play with friends</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home
