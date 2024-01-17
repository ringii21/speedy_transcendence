import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import React from 'react'
import { Route, Routes } from 'react-router-dom'

import { RequireAuth } from './components/RequireAuth'
import { NotFound } from './pages/404'
import { ChatWithNavbar } from './pages/Chat'
import { HomeWithNavbar } from './pages/Home'
import Login from './pages/Login'
import { ProfileWithNavbar } from './pages/Profile'
import { SettingsWithNavbar } from './pages/Settings'
import { TwoFactorSettingsWithNavbar } from './pages/TwoFactor/TwoFactorSettings'
import { TwoFactorSignin } from './pages/TwoFactor/TwoFactorSignin'
import { AuthProvider } from './providers/AuthProvider'
import { ChatProvider } from './providers/ChatProvider'
import { SocketProvider } from './providers/SocketProvider'

const App = () => {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SocketProvider>
          <ChatProvider>
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
                    <HomeWithNavbar />
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
                path='/chat/:channelId?'
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
          </ChatProvider>
        </SocketProvider>
        {/* <Footer /> */}
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
