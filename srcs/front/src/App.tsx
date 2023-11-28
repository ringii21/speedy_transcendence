import React from 'react'
import { Routes, Route } from 'react-router-dom'

// import Navbar from "./components/Navbar";
import { HomeWithNavbar } from './pages/Home'
import Login from './pages/Login'
import Profil from './pages/Profil'
import { Chat } from './components/Chat'

import { ThemeSelector } from './components/ThemeSelector'
import { AuthProvider } from './providers/AuthProvider'
import { TwoFactorSignin } from './pages/TwoFactor/TwoFactorSignin'
import { SettingsWithNavbar } from './pages/Settings'
import { TwoFactorSettingsWithNavbar } from './pages/TwoFactor/TwoFactorSettings'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const App = () => {
  const queryClient = new QueryClient()
  return (
    <div className="container mx-auto">
      <ThemeSelector />
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
            <Route path="/profil" element={<Profil />} />
            <Route path="/login/2fa" element={<TwoFactorSignin />} />
          </Routes>
          <Chat />
        </AuthProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </div>
  )
}

export default App
