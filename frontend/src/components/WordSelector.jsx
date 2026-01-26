import { useState, useEffect } from 'react'

function WordSelector({ socket, roomId }) {
    const [words, setWords] = useState([])
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        if (!socket) return

        socket.on('wordOptions', ({ words: wordChoices }) => {
            setWords(wordChoices)
            setVisible(true)
        })

        return () => {
            socket.off('wordOptions')
        }
    }, [socket])

    const handleSelectWord = (word) => {
        if (!socket) return

        socket.emit('selectWord', {
            roomId,
            word,
        })

        setVisible(false)
        setWords([])
    }

    if (!visible || words.length === 0) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="card p-6 max-w-2xl w-full animate-slide-up">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                    Choose a word to draw
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {words.map((word, index) => (
                        <button
                            key={index}
                            onClick={() => handleSelectWord(word)}
                            className="bg-gray-100 hover:bg-primary-500 hover:text-white text-gray-900 font-bold py-6 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 text-lg border-2 border-gray-300 hover:border-primary-600"
                        >
                            {word}
                        </button>
                    ))}
                </div>

                <p className="text-center text-gray-600 text-sm mt-4">
                    Click on a word to start drawing
                </p>
            </div>
        </div>
    )
}

export default WordSelector
