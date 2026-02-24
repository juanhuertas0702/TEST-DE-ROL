import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Test from './pages/Test';

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
          <Route path="/registro" element={<Registro />} />
          <Route path="/test" element={<Test />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;