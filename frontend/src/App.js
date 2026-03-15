import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login2     from './Login2';
import Home1      from './Home1';
import Dashboard2 from './Dashboard2';
import Charts     from './Charts';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"          element={<Home1 />}      />
        <Route path="/login"     element={<Login2 />}     />
        <Route path="/dashboard" element={<Dashboard2 />} />
        <Route path="/chart"     element={<Charts />}     />
      </Routes>
    </BrowserRouter>
  );
}

export default App; 
