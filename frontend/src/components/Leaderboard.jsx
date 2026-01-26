import { useState, useEffect } from 'react'

function Leaderboard({ players, scores }) {
    const [rankedPlayers, setRankedPlayers] = useState([])

    useEffect(() => {
        // Sort players by score (highest first) and add ranking
        const sorted = [...players]
            .map(player => ({
                ...player,
                score: scores?.[player.id] || 0,
            }))
            .sort((a, b) => b.score - a.score)
            .map((player, index) => ({
                ...player,
                rank: index + 1,
            }))

        setRankedPlayers(sorted)
    }, [players, scores])

    const getRankBadge = (rank) => {
        if (rank === 1) return '🥇'
        if (rank === 2) return '🥈'
        if (rank === 3) return '🥉'
        return `#${rank}`
    }

    const getRankColor = (rank) => {
        if (rank === 1) return 'bg-yellow-100 border-yellow-400 text-yellow-800'
        if (rank === 2) return 'bg-gray-100 border-gray-400 text-gray-800'
        if (rank === 3) return 'bg-orange-100 border-orange-400 text-orange-800'
        return 'bg-white border-gray-300 text-gray-800'
    }

    return (
        <div className="card p-6">
            <h3 className="font-bold text-gray-900 mb-4 text-xl flex items-center gap-2">
                🏆 Leaderboard
            </h3>

            {rankedPlayers.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                    No players yet
                </div>
            ) : (
                <div className="space-y-3">
                    {rankedPlayers.map((player) => (
                        <div
                            key={player.id}
                            className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${getRankColor(
                                player.rank
                            )}`}
                        >
                            {/* Rank Badge */}
                            <div className="flex-shrink-0 w-12 text-center">
                                <div className="text-2xl font-bold">
                                    {getRankBadge(player.rank)}
                                </div>
                            </div>

                            {/* Player Info */}
                            <div className="flex-1 min-w-0">
                                <div className="font-bold text-lg truncate">
                                    {player.name}
                                    {player.isHost && (
                                        <span className="ml-2 text-xs bg-primary-500 text-white px-2 py-0.5 rounded">
                                            HOST
                                        </span>
                                    )}
                                </div>
                                {player.rank === 1 && player.score > 0 && (
                                    <div className="text-sm text-yellow-700 font-semibold">
                                        👑 Leading!
                                    </div>
                                )}
                            </div>

                            {/* Score */}
                            <div className="flex-shrink-0 text-right">
                                <div className="text-2xl font-bold text-primary-600">
                                    {player.score}
                                </div>
                                <div className="text-xs text-gray-600">points</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Total Players Count */}
            <div className="mt-4 pt-4 border-t border-gray-200 text-center text-sm text-gray-600">
                Total Players: {players.length}
            </div>
        </div>
    )
}

export default Leaderboard
