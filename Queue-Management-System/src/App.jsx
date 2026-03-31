import React from 'react'
import { Route, Routes} from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './context/useAuth'
import AdminNavbar from './components/AdminNavbar'

function App() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  return (
    <>
      {isAdmin ? (
        <AdminNavbar />
      ) : (
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