import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home_Page from './pages/Home_Page.jsx';
import Auth_System from './components/Auth_System.jsx';
import Create_Portfolio from './components/Create_Portfolio.jsx';
import Portfolio from './components/Portfolio.jsx';
import './index.css';

function App() {
  const [portfolioData, setPortfolioData] = useState(null);

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home_Page />} />
          <Route path="/login" element={<Auth_System />} />
          <Route path="/create" element={<Create_Portfolio setPortfolioData={setPortfolioData} />} />
          <Route path="/view" element={<Portfolio data={portfolioData} />} />
          <Route path="/:username" element={<Portfolio />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;