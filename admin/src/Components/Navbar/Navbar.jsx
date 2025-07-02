import React, { useState, useEffect } from 'react';
import './Navbar.css';

import navlogo from '../../assets/nav-logo.svg';
import navProfile from '../../assets/nav-profile.svg';

import lightmodebutton from "../../assets/light-mode-button.png";
import darkmodebutton from "../../assets/dark-mode-button.png";


const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedMode);
    if (savedMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('darkMode', false);
      setIsDarkMode(false);
    } else {
      document.body.classList.add('dark-mode');
      localStorage.setItem('darkMode', true);
      setIsDarkMode(true);
    }
  };

  return (
    <div className='navbar'>


      <img src={navlogo} className='nav-logo' alt="Website Logo" />

      <button onClick={toggleDarkMode} className="mode-toggle-btn">
        <img
          src={isDarkMode ? darkmodebutton : lightmodebutton}
          alt={isDarkMode ? 'Dark Mode Active' : 'Light Mode Active'}
          className="icon"
        />


      </button>

      <img src={navProfile} className='nav-profile' alt="User Profile" />
    </div>
  );
};

export default Navbar;
