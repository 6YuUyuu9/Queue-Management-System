import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import AdminNavbar from './components/AdminNavbar'
import Home from './pages/Home'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './context/useAuth'
import Example2 from './pages/admin/Example2'
import Example1 from './pages/admin/Example1'
import ManageQueue from './pages/admin/ManageQueue'
import ManageTable from './pages/admin/ManageTable';

function App() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/test-queue" element={<ManageQueue />} />
        <Route path="/test-table" element={<ManageTable />} />

        <Route path="/admin" element={<ProtectedRoute><Example1 /></ProtectedRoute>}>
          <Route path="Example2" element={<Example2 />} />
          <Route path="manage-queue" element={<ManageQueue />} />
        </Route>
      </Routes>
    </>
  )
}

export default App