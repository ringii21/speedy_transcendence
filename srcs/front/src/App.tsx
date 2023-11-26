import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'

// import Navbar from "./components/Navbar";
import Home from './pages/Home'
import Login from './pages/Login'
import { AuthProvider } from './providers/AuthProvider'
import { useTheme } from './providers/ThemeProvider'

function App() {
  const { theme, changeTheme } = useTheme()

  useEffect(() => {
    document.querySelector('html')?.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <div className="container mx-auto">
      <select
        className="select select-bordered select-xs w-full max-w-xs"
        value={theme}
        onChange={(e) => changeTheme(e.target.value)}
      >
        <option disabled selected>
          Choose a theme
        </option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="cupcake">Cupcake</option>
        <option value="bumblebee">Bumblebee</option>
        <option value="emerald">Emerald</option>
        <option value="corporate">Corporate</option>
        <option value="synthwave">Synthwave</option>
        <option value="retro">Retro</option>
        <option value="cyberpunk">Cyberpunk</option>
        <option value="valentine">Valentine</option>
        <option value="halloween">Halloween</option>
        <option value="garden">Garden</option>
        <option value="forest">Forest</option>
        <option value="aqua">Aqua</option>
        <option value="lofi">Lofi</option>
        <option value="pastel">Pastel</option>
        <option value="fantasy">Fantasy</option>
        <option value="wireframe">Wireframe</option>
        <option value="black">Black</option>
        <option value="luxury">Luxury</option>
        <option value="dracula">Dracula</option>
        <option value="cmyk">CMYK</option>
        <option value="autumn">Autumn</option>
        <option value="business">Business</option>
        <option value="acid">Acid</option>
        <option value="lemonade">Lemonade</option>
        <option value="night">Night</option>
        <option value="coffee">Coffee</option>
        <option value="winter">Winter</option>
        <option value="dim">Dim</option>
        <option value="nord">Nord</option>
        <option value="sunset">Sunset</option>
      </select>
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
