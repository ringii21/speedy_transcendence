import React from 'react';
import { BrowserRouter, Routes, Route, Router } from "react-router-dom";
import { useEffect, useState } from 'react';

// import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/login";

function App() {
  //Constante
  const [loggedIn, setLoggedIn] = useState(false)
  const [email, setEmail] = useState("")

  return (
    <div className="container">
      <BrowserRouter basename='/'>
        <Routes>
          <Route path="/" element={<Home email={email} loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>} />
          <Route path="/login" element={<Login setLoggedIn={setLoggedIn} setEmail={setEmail}/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
