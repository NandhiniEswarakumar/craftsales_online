import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ user }) => {
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar__brand">
        <NavLink to="/" end onClick={closeMenu}>CraftHub</NavLink>
      </div>

      <button
        className="navbar__toggle"
        aria-label="Toggle navigation"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <span />
        <span />
        <span />
      </button>

      <ul className={`navbar__links ${open ? 'is-open' : ''}`}>
        <li>
          <NavLink to="/" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={closeMenu}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/about" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={closeMenu}>
            About
          </NavLink>
        </li>
        <li>
          <NavLink to="/products" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={closeMenu}>
            Products
          </NavLink>
        </li>
        <li>
          <NavLink to="/cart" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={closeMenu}>
            Cart
          </NavLink>
        </li>
        <li>
          <NavLink to="/signup" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={closeMenu}>
            Login
          </NavLink>
        </li>
        <li>
          <NavLink to="/login" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={closeMenu}>
            Signup
          </NavLink>
        </li>
        <li>
          <NavLink to="/contact" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={closeMenu}>
            Contact
          </NavLink>
        </li>
        {user?.isAdmin && (
          <li>
            <NavLink to="/admin" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={closeMenu}>
              Admin Panel
            </NavLink>
          </li>
        )}
        {user?.isSeller && (
          <li>
            <Link className="nav-link" to="/seller" onClick={closeMenu}>
              Seller Dashboard
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;