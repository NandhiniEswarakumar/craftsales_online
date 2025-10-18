import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <p>&copy; {new Date().getFullYear()} CraftHub. All rights reserved.</p>
    <Link className="footer-link" to="/about">About Us</Link>
  </footer>
);

export default Footer;
