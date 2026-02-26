import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Test from './pages/Test';
import Admin from './pages/Admin';

function App() {
  return (
    <Router>
      <div>
        {/* El Navbar queda fuera de las Routes para que se vea en TODAS las páginas */}
        <Navbar />
        
        {/* Aquí es donde React inyectará la página correspondiente */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/test" element={<Test />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;