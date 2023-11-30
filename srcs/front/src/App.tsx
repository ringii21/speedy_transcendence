import React from 'react'
import { Routes, Route } from 'react-router-dom'

// import Navbar from "./components/Navbar";
import { HomeWithNavbar } from './pages/Home'
import Login from './pages/Login'
import { ProfilWithNavbar } from './pages/Profil'

import { Chat } from './components/Chat'
import { AuthProvider } from './providers/AuthProvider'
import { TwoFactorSignin } from './pages/TwoFactor/TwoFactorSignin'
import { SettingsWithNavbar } from './pages/Settings'
import { TwoFactorSettingsWithNavbar } from './pages/TwoFactor/TwoFactorSettings'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ChatWithNavbar } from './pages/ChatConv'
import { RequireAuth } from './components/RequireAuth'

const App = () => {
  const queryClient = new QueryClient()
  return (
    <div className="h-screen">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Routes>
            {/* authenticated */}
            <Route
              path="/"
              element={
                <RequireAuth>
                  <HomeWithNavbar />
                </RequireAuth>
              }
            />
            <Route
              path="/settings"
              element={
                <RequireAuth>
                  <SettingsWithNavbar />
                </RequireAuth>
              }
            />
            <Route
              path="/settings/2fa"
              element={
                <RequireAuth>
                  <TwoFactorSettingsWithNavbar />
                </RequireAuth>
              }
            />
            <Route
              path="/profil"
              element={
                <RequireAuth>
                  <ProfilWithNavbar />
                </RequireAuth>
              }
            />
            <Route
              path="/chat"
              element={
                <RequireAuth>
                  <ChatWithNavbar />
                </RequireAuth>
              }
            />
            <Route
              path="/profil/:id"
              element={
                <RequireAuth>
                  <ProfilWithNavbar />
                </RequireAuth>
              }
            />
            {/* non authenticated */}
            <Route path="/login" element={<Login />} />
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
