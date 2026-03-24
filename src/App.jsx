import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home_Page from './pages/Home_Page.jsx';
import Auth_System from './components/Auth_System.jsx';
import Create_Portfolio from './components/Create_Portfolio.jsx';
import Portfolio from './components/Portfolio.jsx'; 
import About_Us from './components/About_Us.jsx';

function App() {
  const [portfolioData, setPortfolioData] = useState(null);

  return (
    <div className="antialiased">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home_Page />} />
          <Route path="/login" element={<Auth_System />} />
          <Route path="/create" element={<Create_Portfolio setPortfolioData={setPortfolioData} />} />
          <Route path="/edit/:username" element={<Create_Portfolio isEditing={true} />} />
          <Route path="/portfolio/:username" element={<Portfolio />} />
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/about" element={<About_Us />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;