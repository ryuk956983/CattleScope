import React from 'react'
import LandingPage from './LandingPage'
import { Route, Routes } from "react-router-dom";
import BreedDatabase from './Database';
import Navbar from './Components/Navbar';
import BreedRecognition from './BreedRecognition';


const App = () => {
  return (
    <div className='bg-gradient-to-br from-[#1e4620] via-[#3a6321] to-[#c27803] relative overflow-hidden font-sans text-white'>
      <Navbar/>
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/database" element={<BreedDatabase/>} />
          <Route path="/recognition" element={<BreedRecognition/>} />
      </Routes>
    </div>
  )
}

export default App