import { useEffect, useState } from 'react'

function Timer({ socket, initialTime = 80 }) {
    const [timeLeft, setTimeLeft] = useState(initialTime)

    useEffect(() => {
        if (!socket) return

        socket.on('timerUpdate', ({ timeLeft: newTime }) => {
            setTimeLeft(newTime)
        })

        socket.on('newRound', () => {
            setTimeLeft(initialTime)
        })

        socket.on('wordSelected', () => {
            setTimeLeft(initialTime)
        })

        return () => {
            socket.off('timerUpdate')
            socket.off('newRound')
            socket.off('wordSelected')
        }
    }, [socket, initialTime])

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const getProgressColor = () => {
        if (timeLeft > 40) return 'bg-green-500'
        if (timeLeft > 20) return 'bg-yellow-500'
        return 'bg-red-500'
    }

    const progressPercentage = (timeLeft / initialTime) * 100

    return (
        <div className="card p-4">
            <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700 font-semibold">Time Left</span>
                <span
                    className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-gray-900'
                        }`}
                >
                    {formatTime(timeLeft)}
                </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-dark-200 rounded-full h-3 overflow-hidden">
                <div
                    className={`h-full transition-all duration-1000 ${getProgressColor()}`}
                    style={{ width: `${progressPercentage}%` }}
                />
            </div>
        </div>
    )
}

export default Timer
