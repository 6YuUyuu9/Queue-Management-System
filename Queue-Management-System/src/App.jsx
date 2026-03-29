import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import AdminNavbar from './components/AdminNavbar'
import Home from './pages/Home'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './context/useAuth'

function App() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  return (
    <>
      {isAdmin ? (
        /* Admin layout — AdminNavbar จัดการ sidebar + routes /admin/* ทั้งหมดเอง */
        <AdminNavbar />
      ) : (
        /* User layout — Navbar ด้านบน + routes ของ user */
        <>
          <Navbar />
          <Routes>
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            {/* ถ้า user ทั่วไปพยายามเข้า /admin ให้กลับ home */}
            <Route path="/admin/*" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </>
      )}
    </>
  )
}

export default App
