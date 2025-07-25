import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<div>Página não encontrada</div>} />
      </Routes>
    </div>
  )
}

export default App