import React from 'react';
import { BrowserRouter, Routes, Route, Router } from "react-router-dom";
import './App.css';
import { useEffect, useState } from 'react';

// import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/login";
import Auth from "./pages/Auth";

function App() {
  //Constante
  const [loggedIn, setLoggedIn] = useState(false)
  const [email, setEmail] = useState("")

  return (
    <div className="App">
        <head>
          <title>Transcendence</title>
          <meta name="description" content="transcendence"/>
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
        </head>
      <BrowserRouter basename='/'>
        <Routes>
          <Route path="/" element={<Home email={email} loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>} />
          <Route path="/login" element={<Login setLoggedIn={setLoggedIn} setEmail={setEmail}/>} />
          <Route path="/auth" element={<Auth/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
