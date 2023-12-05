import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'

// import Navbar from "./components/Navbar";
import { HomeWithNavbar } from './pages/Home'
import Login from './pages/Login'
import { ProfilWithNavbar } from './pages/Profil'
import { ProfilUserWithNavbar } from './pages/ProfilUsers'

import { Chat } from './components/Chat'
import { AuthProvider } from './providers/AuthProvider'
import { TwoFactorSignin } from './pages/TwoFactor/TwoFactorSignin'
import { SettingsWithNavbar } from './pages/Settings'
import { TwoFactorSettingsWithNavbar } from './pages/TwoFactor/TwoFactorSettings'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ChatWithNavbar } from './pages/ChatConv'
import { FakeUsers } from './types/FakeUser'

const App = () => {
  const queryClient = new QueryClient()
  return (
    <div className="h-screen">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<HomeWithNavbar />} />
            <Route path="/settings" element={<SettingsWithNavbar />} />
            <Route
              path="/settings/2fa"
              element={<TwoFactorSettingsWithNavbar />}
            />
            <Route path="/login" element={<Login />} />
            <Route path="/login/2fa" element={<TwoFactorSignin />} />
            <Route path="/profil/" element={<ProfilWithNavbar />} />
            <Route
              path="/profil/:id/:username"
              element={<ProfilUserWithNavbar FakeUsers={FakeUsers} />}
            />
            <Route path="/chat" element={<ChatWithNavbar />} />
          </Routes>
          <Chat />
        </AuthProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </div>
  )
}

export default App
