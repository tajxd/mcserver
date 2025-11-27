import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import { API_URL } from './config';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Rules from './pages/Rules';
import Admin from './pages/Admin';
import Footer from './components/Footer';

// Komponent pre scroll na vrch pri zmene stránky
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, [pathname]);

  return null;
}

function App() {
  const [whitelist, setWhitelist] = useState([]);
  

  const fetchWhitelist = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/whitelist`);
      setWhitelist(response.data);
    } catch (error) {
      console.error('Chyba pri načítaní whiteliste:', error);
    }
  };

  useEffect(() => {
    fetchWhitelist();
  }, []);

  return (
    <Router>
      <div className="app-wrapper">
        <ScrollToTop />
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home whitelist={whitelist} onWhitelistUpdate={fetchWhitelist} />} />
            <Route path="/rules" element={<Rules />} />
            <Route path="/admin" element={<Admin whitelist={whitelist} onWhitelistUpdate={fetchWhitelist} />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
