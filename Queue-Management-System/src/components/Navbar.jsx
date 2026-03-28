import React from 'react'
import { NavLink } from 'react-router-dom'

const Navbar = () => {
  return (
     <nav>
      <NavLink to="/">Home</NavLink>
      <NavLink to="/signin">Sign In</NavLink>
      <NavLink to="/signup">Sign Up</NavLink>
      <NavLink to="/admin">Admin</NavLink>
    </nav>
  )
}

export default Navbar
