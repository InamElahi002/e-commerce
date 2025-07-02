// import React from 'react'
import './Admin.css'
import { Route, Routes } from 'react-router-dom'
import React, { useEffect } from 'react';

import Sidebar from '../../Components/Sidebar/Sidebar'
import AddProduct from '../../Components/AddProduct/AddProduct'
import ListProduct from '../../Components/ListProduct/ListProduct'
import OrderProduct from '../../Components/OrderProduct/OrderProduct'

const Admin = () => {

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    if (isDark) {
      document.body.classList.add('dark-mode');
    }
  }, []);

  return (
    <div className='admin'>

      <Sidebar />
      <Routes>
        <Route path='/addproduct' element={<AddProduct />} />
        <Route path='/listproduct' element={<ListProduct />} />
        <Route path='/OrderProduct' element={<OrderProduct />} />


      </Routes>
    </div>
  )
}

export default Admin
