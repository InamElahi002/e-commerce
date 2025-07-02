import React, { useContext } from 'react';
import './CartItems.css';
import { ShopContext } from '../../Context/ShopContext';

import Cart from '../../Pages/Cart'


import remove_icon from '../Assets/cart_cross_icon.png';
import { useNavigate } from 'react-router-dom';

const CardItems = () => {
  const { getTotalCartAmount, all_product, cartItems, removeFromCart } = useContext(ShopContext);

  const navigate = useNavigate();
 
  return (
    <div className='cartitems'>
      <div className="cartitems-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />

      {all_product.map((e) => {
        const quantity = cartItems[e.id] || 0;  // Default to 0 if undefined
        if (quantity > 0) {
          return (
            <div key={e.id}>  {/* Unique key for each item */}
              <div className="cartitems-format cartitems-format-main">
                <img src={e.image} alt={e.name} className='cartitems-product-icon' />
                <p>{e.name}</p>
                <p>${e.new_price}</p>
                <button className='cartitems-quantity'>{quantity}</button>
                <p>${e.new_price * quantity}</p>
                <img
                  className="cartitems-remove-icon"
                  src={remove_icon}
                  onClick={() => removeFromCart(e.id)}
                  alt="remove"
                />
              </div>
              <hr />
            </div>
          );
        } else {
          return null;
        }
      })}
      <div className="cartitems-down">
        <div className="cartitems-total">
          <h1>Cart Totals</h1>
          <div>
            <div className="cartitems-total-items">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cartitems-total-items">
              <p>Shpping Fee</p>
              <p>${getTotalCartAmount()===0?0:2}</p>
            </div>
            <hr />
          </div>
          <div className="cartitems-total-items">
            <h3>Total</h3>
            <h3>${getTotalCartAmount()===0?0:getTotalCartAmount()+2}</h3>
          </div>
          <div className="box1">

          <button onClick={()=>navigate('./order')}>PROCEED TO CHECKOUT</button>
          </div>
        </div>
        <div className="cartitems-promocode">
          <p>If you have a promo code, Enter it here</p>
          <div className="cartitems-promobox">
            <input type="text" placeholder='promocode' />
            <button>Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardItems;
