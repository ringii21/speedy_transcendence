import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import { useEffect, useState } from 'react';

import Navbar from "./components/Navbar";
import Home from "./pages/Home";

function App() {
  //Constante
  const [loggedIn, setLoggedIn] = useState(false)
  const [email, setEmail] = useState("")

  return (
    <BrowserRouter>
      <head>
        <title>Transcendence</title>
        <meta name="description" content="transcendence"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/> 
      </head>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home email={email} loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
