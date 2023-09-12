import React, { useState, useEffect } from 'react';
import './NavBar.css';

const NavBar = () => {
  const [lastScrollPos, setLastScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  const handleScroll = () => {
    const currentScrollPos = window.pageYOffset;

    setVisible(lastScrollPos > currentScrollPos || currentScrollPos < 10);
    setLastScrollPos(currentScrollPos);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollPos]);

  return (
    <nav className={`navbar ${visible ? 'active' : 'hidden'}`}>
      <div className="nav-logo">Your Logo</div>
      <ul className="nav-links">
        <li>Home</li>
        <li>About</li>
        <li>Contact</li>
      </ul>
    </nav>
  );
};

export default NavBar;
