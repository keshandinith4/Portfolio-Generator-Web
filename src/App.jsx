import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home_Page from './pages/Home_Page.jsx';
import './index.css';

function App() {
  return (
    <div>
      {/* Router setup */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home_Page />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;