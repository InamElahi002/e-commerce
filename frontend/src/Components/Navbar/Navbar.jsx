import React, { useRef, useState, useEffect, useContext } from 'react';
import './Navbar.css';
import logo from '../Assets/logo.png';
import cart_icon from '../Assets/cart_icon.png';
import nav_dropdown from '../Assets/nav_dropdown.png';
import { Link, useNavigate } from 'react-router-dom';

import lightmodebutton from '../Assets/light-mode-button.png'
import darkmodebutton from '../Assets/dark-mode-button.png'

import { ShopContext } from '../../Context/ShopContext';

const Navbar = () => {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [menu, setMenu] = useState("shop");
  const { getTotalCartItems } = useContext(ShopContext);
  const menuRef = useRef();


  const { isDarkMode, setIsDarkMode } = useContext(ShopContext);



  const handleAuthClick = () => {
    if (isLoggedIn) {
      localStorage.removeItem("auth-token");
      setIsLoggedIn(false);
      navigate('/');
    } else {
      navigate('/login');
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const dropdown_toggle = (e) => {
    menuRef.current.classList.toggle('nav-menu-visible');
    e.target.classList.toggle('open');
  };

  return (
    <div className='navbar'>
      <div className="nav-logo">
        <img src={logo} alt="" />
        <p>SHOPPER</p>
      <img className='nav-dropdown' onClick={dropdown_toggle} src={nav_dropdown} alt="" />
      </div>


      <ul ref={menuRef} className="nav-menu">
        <li onClick={() => { setMenu("shop") }}><Link style={{ textDecoration: 'none' }} to='/'>Shop</Link>{menu === "shop" ? <hr /> : <></>}</li>
        <li onClick={() => { setMenu("mens") }}><Link style={{ textDecoration: 'none' }} to='/mens'>Mens</Link>{menu === "mens" ? <hr /> : <></>}</li>
        <li onClick={() => { setMenu("womens") }}><Link style={{ textDecoration: 'none' }} to='/womens'>Womens</Link>{menu === "womens" ? <hr /> : <></>}</li>
        <li onClick={() => { setMenu("kids") }}><Link style={{ textDecoration: 'none' }} to='/kids'>Kids</Link>{menu === "kids" ? <hr /> : <></>}</li>
      </ul>

      

      <div className="nav-login-cart">
        <button
          onClick={handleAuthClick}
          className={`auth-button ${isLoggedIn ? 'logged-in' : ''}`}
        >
          {isLoggedIn ? 'Logout' : 'Login'}
        </button>

        <button
          onClick={() => {
            setIsDarkMode(prev => {
              localStorage.setItem('darkMode', !prev);
              return !prev;
            });
          }}
          className="mode-toggle-btn"
        >
          <img src={lightmodebutton} alt="Light Mode" className="icon light-icon" />
          <img src={darkmodebutton} alt="Dark Mode" className="icon dark-icon" />
     
        </button>


        <Link to='/cart'>
          <img className="cart-icon" src={cart_icon} alt="Cart" />

        </Link>
        <div className="nav-cart-count">{getTotalCartItems()}</div>
      </div>
    </div>
  );
};

export default Navbar;
