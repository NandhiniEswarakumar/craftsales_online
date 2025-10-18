import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ user }) => (
  <nav className="navbar">
    <div className="navbar__brand">
      <NavLink to="/" end>CraftHub</NavLink>
    </div>
    <ul className="navbar__links">
      <li>
        <NavLink to="/" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          Home
        </NavLink>
      </li>
      <li>
        <NavLink to="/about" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          About
        </NavLink>
      </li>
      <li>
        <NavLink to="/products" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          Products
        </NavLink>
      </li>
      <li>
        <NavLink to="/cart" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          Cart
        </NavLink>
      </li>
      <li>
        <NavLink to="/signup" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          Login
        </NavLink>
      </li>
      <li>
        <NavLink to="/login" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          Signup
        </NavLink>
      </li>
      <li>
        <NavLink to="/contact" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          Contact
        </NavLink>
      </li>
      {user?.isAdmin && (
        <li>
          <NavLink to="/admin" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Admin Panel
          </NavLink>
        </li>
      )}
      {user?.isSeller && (
        <li>
          <Link className="nav-link" to="/seller">
            Seller Dashboard
          </Link>
        </li>
      )}
    </ul>
  </nav>
);

export default Navbar;