import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import { useEffect, useState } from 'react';

// import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/login";

function App() {
  //Constante
  const [loggedIn, setLoggedIn] = useState(false)
  const [email, setEmail] = useState("")

  return (
    <div className="App">
      <BrowserRouter>
        <head>
          <title>Transcendence</title>
          <meta name="description" content="transcendence"/>
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
        </head>
        <Routes>
          <Route path="/" element={<Home email={email} loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>} />
          <Route path="/login" element={<Login setLoggedIn={setLoggedIn} setEmail={setEmail}/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
