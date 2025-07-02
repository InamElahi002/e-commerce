import React, { useContext, useState } from 'react';
import './ProductDisplay.css';
import { ShopContext } from '../../Context/ShopContext';


import start_icon from '../Assets/star_icon.png';
import start_dull_icon from '../Assets/star_dull_icon.png';

// import p2_product from '../Assets/p2_product.png'

const ProductDisplay = (props) => {
  const { product } = props;
  
  // Access the addtoCart function and cartItems from the ShopContext
  const { addtoCart, cartItems } = useContext(ShopContext);
  
  // Get the current quantity for this product from the cart (defaults to 0)
  const currentQuantity = cartItems[product.id] || 0;

  // State for selected size (optional)
  const [selectedSize, setSelectedSize] = useState(null);

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  return (
    <div className='productdisplay'>
      <div className="productdisplay-left">
        <div className="productdisplay-img-list">
          <img src={product.image} alt="" />
          <img src={product.image} alt="" />
          <img src={product.image} alt="" />
          <img src={product.image} alt="" />
        </div>

        <div className="productdisplay-img">
          <img className='productdisplay-main-img' src={product.image} alt="" />
        </div>
      </div>

      <div className="productdisplay-right">
        <h1>{product.name}</h1>
        <div className="productdisplay-right-stars">
          <img src={start_icon} alt="" />
          <img src={start_icon} alt="" />
          <img src={start_icon} alt="" />
          <img src={start_icon} alt="" />
          <img src={start_dull_icon} alt="" />
          <p>(122)</p>
        </div>

        <div className="productdisplay-right-prices">
          <div className="productdisplay-right-prices-old">${product.old_price}</div>
          <div className="productdisplay-right-prices-new">${product.new_price}</div>
        </div>

        <div className="productdisplay-right-description">
          {product.description || 'A lightweight, usually knitted pullover shirt with a round neckline and short sleeves, worn as an undershirt or outer garment.'}
        </div>

        <div className="productdisplay-right-size">
          <h1>Select Size</h1>
          <div className="productdisplay-right-sizes ">
            {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
              <div 
                key={size} 
                onClick={() => handleSizeSelect(size)}
                className={selectedSize === size ? 'selected' : ''}
              >
                {size}
              </div>
            ))}
          </div>
        </div>

        {/* Add to Cart button */}
       <button onClick={() => addtoCart(product.id)}>
  ADD TO CART
</button>

        {/* Display current quantity in the cart */}
        {currentQuantity > 0 && (
          <p className='productdisplay-right-quantity'>
            Quantity in cart: {currentQuantity}
          </p>
        )}

        <p className='productdisplay-right-category'>
          <span>Category:</span> Women, T-shirt, Crop Top
        </p>
        <p className='productdisplay-right-category'>
          <span>Tags:</span> Modern, Latest
        </p>
      </div>
    </div>
  );
};

export default ProductDisplay;
