import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Admin from './pages/Admin'
import Home from './pages/Home'
import Signin from './pages/Signin'
import Signup from './pages/Signup'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </>
  )
}

export default App
