import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Event from "./components/Event";
import CanvasEditor from "./components/CanvasEditor";
import Allevents from "./components/Allevents";
import backgroundImg from './assets/Background.png';
import "./App.css";

const pageStyle = {
  backgroundImage: `url(${backgroundImg})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  minHeight: '100vh'
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/poster" element={
          <div style={pageStyle}>
            <h1 className="poster-title">Poster Maker App</h1>
            <CanvasEditor />
          </div>
        } />
        <Route path="/event" element={
          <div style={pageStyle}>
            <Event />
          </div>
        } />
        <Route path="/Allevents" element={<Allevents />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
