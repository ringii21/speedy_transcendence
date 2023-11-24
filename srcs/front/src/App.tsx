import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState } from 'react';

// import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/login";

function useQuery() {
	const { search } = 	useLocation()
	return React.useMemo(() => new URLSearchParams(search), [search]);
}


function App() {
  //Constante
	var query = useQuery()
  const [loggedIn, setLoggedIn] = useState(false)
  const [email, setEmail] = useState("")

  return (
    <div className="container">
      <BrowserRouter basename='/'>
        <Routes>
          <Route path="/" element={<Home email={email} loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback?code=" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
