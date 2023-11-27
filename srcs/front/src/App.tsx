import React from 'react'
import { Routes, Route } from 'react-router-dom'

// import Navbar from "./components/Navbar";
import Home from './pages/Home'
import Login from './pages/Login'
import Profil from './pages/Profil'
import { Chat } from './components/Chat'

import { ThemeSelector } from './components/ThemeSelector'
import { AuthProvider } from './providers/AuthProvider'
import { TwoFa } from './pages/TwoFa'
import { Settings } from './pages/Settings'
import { TwoFactor } from './pages/TwoFactor/TwoFactor'

function App() {
  return (
    <div className="container mx-auto">
      <ThemeSelector />
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings/2fa" element={<TwoFactor />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/2fa" element={<TwoFa />} />
          <Route path="/login/2fa" element={<TwoFa />} />
        </Routes>
        <Chat />
      </AuthProvider>
    </div>
  )
}

export default App
