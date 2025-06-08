import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Home from './pages/Home'
import Learn from './pages/Learn'
import Visualize from './pages/Visualize'
import Code from './pages/Code'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/visualize" element={<Visualize />} />
          <Route path="/code" element={<Code />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App