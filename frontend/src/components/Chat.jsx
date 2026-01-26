import { useState, useEffect, useRef } from 'react'

function Chat({ socket, roomId, playerId, isDrawer }) {
    const [messages, setMessages] = useState([])
    const [inputMessage, setInputMessage] = useState('')
    const messagesEndRef = useRef(null)

    useEffect(() => {
        if (!socket) return

        // Listen for chat messages
        socket.on('message', ({ playerId: senderId, playerName, message, timestamp }) => {
            setMessages(prev => [
                ...prev,
                {
                    id: timestamp,
                    playerId: senderId,
                    playerName,
                    message,
                    type: 'chat',
                },
            ])
        })

        // Listen for correct guesses
        socket.on('correctGuess', ({ playerId: guesserId, playerName, points }) => {
            setMessages(prev => [
                ...prev,
                {
                    id: Date.now(),
                    type: 'system',
                    message: `${playerName} guessed correctly! +${points} points 🎉`,
                },
            ])
        })

        // Listen for game events
        socket.on('gameStarted', () => {
            setMessages(prev => [
                ...prev,
                {
                    id: Date.now(),
                    type: 'system',
                    message: 'Game started! 🎮',
                },
            ])
        })

        socket.on('newRound', ({ roundNumber, drawer }) => {
            setMessages(prev => [
                ...prev,
                {
                    id: Date.now(),
                    type: 'system',
                    message: `Round ${roundNumber} started!`,
                },
            ])
        })

        socket.on('roundEnd', ({ word }) => {
            setMessages(prev => [
                ...prev,
                {
                    id: Date.now(),
                    type: 'system',
                    message: `Round ended! The word was: "${word}"`,
                },
            ])
        })

        socket.on('gameEnd', ({ winnerName }) => {
            setMessages(prev => [
                ...prev,
                {
                    id: Date.now(),
                    type: 'system',
                    message: `🏆 ${winnerName} won the game!`,
                },
            ])
        })

        return () => {
            socket.off('message')
            socket.off('correctGuess')
            socket.off('gameStarted')
            socket.off('newRound')
            socket.off('roundEnd')
            socket.off('gameEnd')
        }
    }, [socket])

    useEffect(() => {
        // Auto-scroll to bottom when new messages arrive
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleSendMessage = (e) => {
        e.preventDefault()

        if (!inputMessage.trim() || !socket) return

        socket.emit('sendMessage', {
            roomId,
            message: inputMessage.trim(),
        })

        setInputMessage('')
    }

    return (
        <div className="card p-4 flex flex-col h-full">
            <h3 className="font-bold text-gray-900 mb-3 text-lg">Chat</h3>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-1 min-h-0 font-mono text-sm">
                {messages.map((msg) => (
                    <div key={msg.id}>
                        {msg.type === 'system' ? (
                            <div className="text-center text-primary-500 text-sm font-semibold py-1 px-2 bg-primary-500/10 rounded">
                                {msg.message}
                            </div>
                        ) : (
                            <div className="text-gray-900 py-1">
                                <span className="font-bold text-primary-600">{msg.playerName}:</span>{' '}
                                <span className="text-gray-800">{msg.message}</span>
                            </div>
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={isDrawer ? "You're drawing..." : 'Type your guess...'}
                    disabled={isDrawer}
                    className="input-field text-sm py-2"
                    maxLength={100}
                />
                <button
                    type="submit"
                    disabled={isDrawer || !inputMessage.trim()}
                    className="btn-primary px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Send
                </button>
            </form>
        </div>
    )
}

export default Chat
