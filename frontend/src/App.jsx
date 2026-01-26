import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Room from './pages/Room'

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-dark-50">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/room/:roomId" element={<Room />} />
                </Routes>
            </div>
        </Router>
    )
}

export default App
