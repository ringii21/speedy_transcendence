import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'

// import Navbar from "./components/Navbar";
import Home from './pages/Home'
import Login from './pages/Login'
import { ThemeSelector } from './components/ThemeSelector'
import { AuthProvider } from './providers/AuthProvider'

function App() {
  return (
    <div className="container mx-auto">
      <ThemeSelector />
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </AuthProvider>
    </div>
  )
}

export default App
