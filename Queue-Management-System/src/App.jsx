import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import ProtectedRoute from './components/ProtectedRoute'
import ManageQueue from './pages/admin/ManageQueue'
import ManageTable from './pages/admin/ManageTable';
import { useAuth } from './context/useAuth'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminHome from './pages/admin/AdminHome'
import AdminNavbar from './components/AdminNavbar'

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
          </Routes>
        </>
      )}
    </>
  )
}

export default App