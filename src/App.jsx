import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home_Page from './pages/Home_Page.jsx';
import './index.css';
import Create_Portfolio from './components/Create_Portfolio.jsx';

function App() {
  return (
    <div>
      {/* Router setup */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home_Page />} />
          <Route path="/create" element={<Create_Portfolio />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;