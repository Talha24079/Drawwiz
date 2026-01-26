import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSocket } from '../hooks/useSocket'
import Canvas from '../components/Canvas'
import Chat from '../components/Chat'
import Leaderboard from '../components/Leaderboard'
import Timer from '../components/Timer'
import WordSelector from '../components/WordSelector'

function Room() {
    const { roomId } = useParams()
    const navigate = useNavigate()
    const socket = useSocket()

    const [room, setRoom] = useState(null)
    const [players, setPlayers] = useState([])
    const [scores, setScores] = useState({})
    const [gameStatus, setGameStatus] = useState('lobby')
    const [currentDrawer, setCurrentDrawer] = useState(null)
    const [currentRound, setCurrentRound] = useState(0)
    const [wordHint, setWordHint] = useState('')
    const [playerName, setPlayerName] = useState('')
    const [isHost, setIsHost] = useState(false)
    const [showCopyMessage, setShowCopyMessage] = useState(false)

    useEffect(() => {
        const name = localStorage.getItem('playerName')
        if (!name) {
            navigate('/')
            return
        }
        setPlayerName(name)
    }, [navigate])

    useEffect(() => {
        if (!socket || !playerName) return

        // Try to create room first (if we're the creator)
        socket.emit('createRoom', {
            roomId,
            playerName,
            isPrivate: false,
        })

        // Listen for room created
        socket.on('roomCreated', ({ room: createdRoom }) => {
            setRoom(createdRoom)
            setPlayers(createdRoom.players)
            setScores(createdRoom.gameState.scores)
            setIsHost(true)
        })

        // If room already exists, join it
        socket.on('error', ({ message }) => {
            if (message === 'Room already exists') {
                socket.emit('joinRoom', {
                    roomId,
                    playerName,
                })
            } else {
                alert(message)
            }
        })

        // Listen for room joined
        socket.on('roomJoined', ({ room: joinedRoom }) => {
            setRoom(joinedRoom)
            setPlayers(joinedRoom.players)
            setScores(joinedRoom.gameState.scores)
            setGameStatus(joinedRoom.gameState.status)
            setCurrentDrawer(joinedRoom.gameState.currentDrawer)
            setCurrentRound(joinedRoom.gameState.currentRound)
        })

        // Listen for player updates
        socket.on('playerJoined', ({ players: updatedPlayers }) => {
            setPlayers(updatedPlayers)
        })

        socket.on('playerLeft', ({ players: updatedPlayers }) => {
            setPlayers(updatedPlayers)
        })

        // Listen for game events
        socket.on('gameStarted', ({ scores: initialScores }) => {
            setGameStatus('playing')
            setScores(initialScores)
        })

        socket.on('newRound', ({ roundNumber, drawer }) => {
            setCurrentRound(roundNumber)
            setCurrentDrawer(drawer)
            setWordHint('')
        })

        socket.on('wordSelected', ({ wordHint: hint }) => {
            setWordHint(hint)
        })

        socket.on('roundEnd', ({ scores: updatedScores }) => {
            setScores(updatedScores)
            setWordHint('')
        })

        socket.on('gameEnd', ({ finalScores }) => {
            setGameStatus('gameEnd')
            setScores(finalScores)
        })

        socket.on('correctGuess', ({ playerId, points }) => {
            setScores(prev => ({
                ...prev,
                [playerId]: (prev[playerId] || 0) + points,
            }))
        })

        return () => {
            socket.off('roomCreated')
            socket.off('error')
            socket.off('roomJoined')
            socket.off('playerJoined')
            socket.off('playerLeft')
            socket.off('gameStarted')
            socket.off('newRound')
            socket.off('wordSelected')
            socket.off('roundEnd')
            socket.off('gameEnd')
            socket.off('correctGuess')
        }
    }, [socket, roomId, playerName])

    const handleStartGame = () => {
        if (!socket) return
        socket.emit('startGame', { roomId })
    }

    const handleCopyRoomLink = () => {
        const url = window.location.href
        navigator.clipboard.writeText(url).then(() => {
            setShowCopyMessage(true)
            setTimeout(() => setShowCopyMessage(false), 2000)
        })
    }

    const handleLeaveRoom = () => {
        if (socket) {
            socket.emit('leaveRoom', { roomId })
        }
        navigate('/')
    }

    const isDrawer = socket?.id === currentDrawer

    return (
        <div className="min-h-screen p-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-purple-500 bg-clip-text text-transparent">
                            Drawwiz
                        </h1>
                        <div className="flex items-center gap-2 mt-1">
                            <p className="text-gray-600">Room: {roomId}</p>
                            <button
                                onClick={handleCopyRoomLink}
                                className="text-primary-500 hover:text-primary-600 text-sm font-semibold"
                            >
                                📋 {showCopyMessage ? 'Copied!' : 'Copy Link'}
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        {isHost && gameStatus === 'lobby' && players.length >= 2 && (
                            <button onClick={handleStartGame} className="btn-primary">
                                🎮 Start Game
                            </button>
                        )}
                        <button onClick={handleLeaveRoom} className="btn-secondary">
                            ← Leave Room
                        </button>
                    </div>
                </div>

                {/* Game Status Header */}
                {gameStatus === 'playing' && (
                    <div className="mb-4">
                        <div className="card p-4">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                    <div className="text-sm text-gray-600 mb-1">
                                        Round {currentRound}
                                    </div>
                                    {isDrawer ? (
                                        <div className="text-xl font-bold text-primary-600">
                                            🎨 You are drawing!
                                        </div>
                                    ) : (
                                        <div className="text-xl font-bold text-gray-900">
                                            {wordHint ? (
                                                <span className="tracking-widest">{wordHint}</span>
                                            ) : (
                                                <span className="text-gray-500">Waiting for word...</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <Timer socket={socket} initialTime={80} />
                            </div>
                        </div>
                    </div>
                )}

                {/* Lobby Screen */}
                {gameStatus === 'lobby' && (
                    <div className="card p-8 text-center mb-4">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Waiting in Lobby...
                        </h2>
                        <p className="text-gray-700 mb-4">
                            Share the room link with your friends to join!
                        </p>
                        <p className="text-sm text-gray-600">
                            {players.length < 2
                                ? 'Need at least 2 players to start'
                                : isHost
                                    ? 'Click "Start Game" when ready'
                                    : 'Waiting for host to start the game...'}
                        </p>
                    </div>
                )}

                {/* Main Game Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Canvas - Takes 2 columns on large screens */}
                    <div className="lg:col-span-2">
                        {gameStatus === 'playing' ? (
                            <>
                                <Canvas
                                    socket={socket}
                                    roomId={roomId}
                                    isDrawer={isDrawer}
                                />
                                <WordSelector socket={socket} roomId={roomId} />
                            </>
                        ) : (
                            <div className="card p-12 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                                <div className="text-center">
                                    <div className="text-6xl mb-4">🎨</div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                        Canvas Ready
                                    </h3>
                                    <p className="text-gray-600">
                                        Start the game to begin drawing and guessing!
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar - Players and Chat */}
                    <div className="lg:col-span-1 flex flex-col gap-4">
                        <Leaderboard
                            players={players}
                            scores={scores}
                        />

                        <div className="flex-1 min-h-[400px]">
                            <Chat
                                socket={socket}
                                roomId={roomId}
                                playerId={socket?.id}
                                isDrawer={isDrawer}
                            />
                        </div>
                    </div>
                </div>

                {/* Game End Screen */}
                {gameStatus === 'gameEnd' && (
                    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                        <div className="card p-8 max-w-lg w-full text-center animate-slide-up">
                            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                                🏆 Game Over!
                            </h2>

                            <div className="mb-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                    Final Scores
                                </h3>
                                <div className="space-y-2">
                                    {players
                                        .sort((a, b) => (scores[b.id] || 0) - (scores[a.id] || 0))
                                        .map((player, index) => (
                                            <div
                                                key={player.id}
                                                className={`flex items-center justify-between p-3 rounded-lg ${index === 0
                                                    ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-2 border-yellow-500'
                                                    : 'bg-gray-100'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    {index === 0 && <span className="text-2xl">👑</span>}
                                                    <span className="font-semibold text-gray-900">
                                                        {player.name}
                                                    </span>
                                                </div>
                                                <span className="text-lg font-bold text-primary-600">
                                                    {scores[player.id] || 0}
                                                </span>
                                            </div>
                                        ))}
                                </div>
                            </div>

                            <button onClick={() => navigate('/')} className="btn-primary w-full">
                                Return to Home
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Room
