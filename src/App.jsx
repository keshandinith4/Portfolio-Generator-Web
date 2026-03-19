import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home_Page from './pages/Home_Page.jsx';
import './index.css';
import Auth_System from './components/Auth_System.jsx';
import Create_Portfolio from './components/Create_Portfolio.jsx';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home_Page />} />
          <Route path="/login" element={<Auth_System />} />
          <Route path="/create" element={<Create_Portfolio />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;