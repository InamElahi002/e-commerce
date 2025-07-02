import './App.css';

import Navbar from './Components/Navbar/Navbar';

import { BrowserRouter as Router, Routes, Route, Form } from 'react-router-dom';

import Shop from './Pages/Shop';
// import ShopCategory from './Pages/ShopCategory';

import ShopCategory from './Pages/ShopCategory';

import Product from './Pages/Product';
import LoginSigup from './Pages/LoginSigup';
import Card from './Pages/Cart';

import Footer from './Components/Footer/Footer';

import men_banner from './Components/Assets/banner_mens.png'
import women_banner from './Components/Assets/banner_women.png'
import kids_banner from './Components/Assets/banner_kids.png'

import PlaceOrder from './Pages/PlaceOrder/PlaceOrder';


import OrderSuccess from "./Pages/OrderSuccess/OrderSuccess";
import MyOrders from "./Pages/MyOrders/MyOrders";


  import { useEffect } from "react";



  

function App() {
  useEffect(() => {
    const isDark = localStorage.getItem('dark-mode') === 'true';
    document.body.classList.toggle('dark-mode', isDark);
  }, []);

  

  
  return (
    <div>
          

          

      <Router>
        <Navbar />
        <Routes>
          
          <Route path='/' element={<Shop />} />
          <Route path='mens' element={<ShopCategory banner={men_banner} category="men" />} />
          <Route path='womens' element={<ShopCategory banner={women_banner} category="women" />} />
          <Route path='kids' element={<ShopCategory banner={kids_banner} category="kid" />} />

          <Route path='/product/:productId' element={<Product />} />

          <Route path='/cart' element={<Card />} />
          <Route path="/cart/order" element={<PlaceOrder />} />

          



          <Route path="/order/success" element={<OrderSuccess />} />
          <Route path="/myorders" element={<MyOrders />} />


          <Route path='/login' element={<LoginSigup />} />

          


        </Routes>
      </Router>
      <Footer />
    </div>
  );
}

export default App;
