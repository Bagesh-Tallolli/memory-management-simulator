import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Landing from './pages/Landing'
import Learn from './pages/Learn'
import Code from './pages/Code'
import Visualize from './pages/Visualize'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/code" element={<Code />} />
          <Route path="/visualize" element={<Visualize />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App