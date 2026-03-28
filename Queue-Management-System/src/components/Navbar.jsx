import React from 'react'
import { NavLink } from 'react-router-dom'
import { Colors } from '../constant/colors'

const Navbar = () => {
  return (
    <div>
      <nav style={{ backgroundColor: Colors.blue , height: '60px' }} className="navbar navbar-expand-lg" data-bs-theme="dark">
        <div className="container-fluid px-4">
          <span
            style={{ color: Colors.yellow }}
            className="navbar-brand fs-2 fw-bold">
              QQ
          </span>
          <span className="fw-bold text-white">
            ลงทะเบียนจองคิว
          </span >
          <div className="navbar-nav ms-auto">
            <NavLink className="nav-link fw-bold" to="/signin">Sign In</NavLink>
            <span className="nav-link text-white">|</span>
            <NavLink className="nav-link fw-bold" to="/signup">Sign Up</NavLink>
          </div>
        </div>

      </nav>
      <div style={{ backgroundColor: Colors.yellow }} className="navbar navbar-expand-lg">
      </div>
    </div>
  )
}

export default Navbar
