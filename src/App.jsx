// App.jsx
import { Routes, Route } from "react-router-dom";
import { createContext, useState, useEffect } from "react";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Footer from "./components/Footer";
import Venues from "./pages/Venues";
import VenueDetails from "./pages/Details";
import Profile from "./pages/Profile";
import Create from "./pages/Create";
import Edit from "./pages/Edit";

// auth context
export const AuthContext = createContext();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("accessToken"));

  // oppdaterer auth state når local endres
  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("accessToken"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/venues" element={<Venues />} />
        <Route path="/venues/:id" element={<VenueDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/create" element={<Create />} />
        <Route path="/venues/:id/edit" element={<Edit />} />
      </Routes>
      <Footer />
    </AuthContext.Provider>
  );
}

export default App;
