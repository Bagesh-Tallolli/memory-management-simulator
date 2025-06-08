import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Landing from './pages/Landing'
import Learn from './pages/Learn'
import Visualize from './pages/Visualize'
import System from './pages/System'

function App() {
  return (
    <Router basename="/memory-management-simulator">
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/visualize" element={<Visualize />} />
          <Route path="/system" element={<System />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App