import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import React from 'react'
import { Route, Routes } from 'react-router-dom'

import { ContactOverlay } from './components/ContactOverlay'
import { RequireAuth } from './components/RequireAuth'
import { NotFound } from './pages/404'
import { ChatWithNavbar } from './pages/Chat'
import { Footer } from './pages/Footer'
// import Navbar from "./components/Navbar";
import { HomeWithNavbar } from './pages/Home'
import Login from './pages/Login'
import { PongWithNavbar } from './pages/Pong'
import { ProfileWithNavbar } from './pages/Profile'
import { SettingsWithNavbar } from './pages/Settings'
import { TwoFactorSettingsWithNavbar } from './pages/TwoFactor/TwoFactorSettings'
import { TwoFactorSignin } from './pages/TwoFactor/TwoFactorSignin'
import { AuthProvider } from './providers/AuthProvider'
import { ChatProvider } from './providers/ChatProvider'
import { GameSocketProvider } from './providers/GameSocketProvider'
import { SocketProvider } from './providers/SocketProvider'
//import Pong from './components/Pong'

const App = () => {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ChatProvider>
          <SocketProvider>
            <GameSocketProvider>
              <Routes>
                {/* authenticated */}
                <Route
                  path='/'
                  element={
                    <RequireAuth>
                      <HomeWithNavbar />
                    </RequireAuth>
                  }
                />
                <Route
                  path='/game'
                  element={
                    <RequireAuth>
                      <PongWithNavbar />
                    </RequireAuth>
                  }
                />
                <Route
                  path='/settings'
                  element={
                    <RequireAuth>
                      <SettingsWithNavbar />
                    </RequireAuth>
                  }
                />
                <Route
                  path='/settings/2fa'
                  element={
                    <RequireAuth>
                      <TwoFactorSettingsWithNavbar />
                    </RequireAuth>
                  }
                />
                <Route
                  path='/chat'
                  element={
                    <RequireAuth>
                      <ChatWithNavbar />
                    </RequireAuth>
                  }
                />
                <Route
                  path='/profile/me'
                  element={
                    <RequireAuth>
                      <ProfileWithNavbar />
                    </RequireAuth>
                  }
                />
                <Route
                  path='/profile/:id'
                  element={
                    <RequireAuth>
                      <ProfileWithNavbar />
                    </RequireAuth>
                  }
                />
                {/* non authenticated */}
                <Route path='/login' element={<Login />} />
                <Route path='/login/2fa' element={<TwoFactorSignin />} />
                <Route path='*' element={<NotFound />} />
              </Routes>
            </GameSocketProvider>
          </SocketProvider>
        </ChatProvider>
        <ContactOverlay />
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
