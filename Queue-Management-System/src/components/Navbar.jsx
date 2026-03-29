import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Colors } from '../constant/colors'
import { useAuth } from '../context/useAuth'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/signin')
  }

  return (
    <div>
      <nav style={{ backgroundColor: Colors.blue, height: '60px' }} className="navbar navbar-expand-lg" data-bs-theme="dark">
        <div className="container-fluid px-4">
          <span style={{ color: Colors.yellow }} className="navbar-brand fs-2 fw-bold">QQ</span>
          <span className="fw-bold text-white">ลงทะเบียนจองคิว</span>
          <div className="navbar-nav ms-auto">
            {user ? (
              <>
                <span className="nav-link text-white">สวัสดี {user.username}</span>
                <span className="nav-link text-white">|</span>
                <button
                  onClick={handleLogout}
                  style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
                  className="nav-link fw-bold text-white">
                  ออกจากระบบ
                </button>
              </>
            ) : (
              <>
                <NavLink className="nav-link fw-bold" to="/signin">Sign In</NavLink>
                <span className="nav-link text-white">|</span>
                <NavLink className="nav-link fw-bold" to="/signup">Sign Up</NavLink>
              </>
            )}
          </div>
        </div>
      </nav>
      <div style={{ backgroundColor: Colors.yellow }} className="navbar navbar-expand-lg"></div>
    </div>
  )
}

export default Navbar