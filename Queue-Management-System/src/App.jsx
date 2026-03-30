import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom' 
import Navbar from './components/Navbar'
import Admin from './pages/Admin'
import Home from './pages/Home'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import ProtectedRoute from './components/ProtectedRoute'
import Example2 from './pages/admin/Example2'
import Example1 from './pages/admin/Example1'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <Example1 />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="example2" replace />} />
          <Route path="example2" element={<Example2 />} />
        </Route>

      </Routes>
    </>
  )
}

export default App
