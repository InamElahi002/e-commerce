// import React, { createContext, useState } from 'react';
import React, { createContext, useState, useEffect } from 'react';
// import all_product from "../Components/Assets/all_product";

export const ShopContext = createContext(null);

const getDefaultCart = () => {

  let cart = {};
  // all_product.forEach(product => {
  // cart[product.id] = 0; // Ensure cartItems object is initialized for each product
  for (let index = 0; index < 300; index++) {
    cart[index] = 0


  };
  return cart;
};

const ShopContextProvider = (props) => {

  const [isDarkMode, setIsDarkMode] = useState(() => {


    const savedMode = localStorage.getItem('darkMode');
    return savedMode === 'true'; // string "true" means dark mode on

  });
  useEffect(() => {
    
    document.body.classList.toggle("dark-mode", isDarkMode);

  }, [isDarkMode]);





  const [all_product, setAll_Product] = useState([]);

  const [cartItems, setCartItems] = useState(getDefaultCart());
  // const contextValue = {all_product}
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:4000/allproducts');
        const data = await response.json();
        setAll_Product(data);

        // Now check for user auth and fetch cart
        if (localStorage.getItem('auth-token')) {
          fetch('http://localhost:4000/getcart', {
            method: 'POST',
            headers: {
              Accept: 'application/form-data',
              'auth-token': localStorage.getItem('auth-token'),
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({})
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.cartData) {
                setCartItems(data.cartData);
              } else {
                console.warn("No cart data found in response:", data);
              }
            })
            .catch((error) => console.error("Error fetching cart:", error));
        }

      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);



  const addtoCart = (itemid) => {
    setCartItems((prev) => {
      const updatedCart = {
        ...prev,
        [itemid]: (prev[itemid] || 0) + 1
      };
      console.log(`Item with id ${itemid} added to cart. Updated cart:`, updatedCart);
      return updatedCart;
    });

    if (localStorage.getItem('auth-token')) {
      fetch('http://localhost:4000/addtocart', {
        method: 'POST',
        headers: {
          Accept: 'application/formdata',
          'auth-token': `${localStorage.getItem('auth-token')}`,
          "Content-type": "application/json"
        },
        body: JSON.stringify({ itemid: itemid })
      })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error('Error adding to cart on server:', error));
    }
  };


  const removeFromCart = (itemid) => {
    setCartItems((prev) => {
      const updatedCart = {
        ...prev,
        [itemid]: prev[itemid] > 0 ? prev[itemid] - 1 : 0
      };
      console.log(`Item with id ${itemid} removed from cart. Updated cart:`, updatedCart);
      return updatedCart;
    });
    if (localStorage.getItem('auth-token')) {
      fetch('http://localhost:4000/removefromcart', {
        method: 'POST',
        headers: {
          Accept: 'application/formdata',
          'auth-token': `${localStorage.getItem('auth-token')}`,
          "Content-type": "application/json"
        },
        body: JSON.stringify({ itemid: itemid })
      })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error('Error adding to cart on server:', error));
    }

  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const itemInfo = all_product.find((product) => product.id === Number(item));
        if (itemInfo) {
          totalAmount += itemInfo.new_price * cartItems[item];
        }
      }
    }
    return totalAmount;
  };

  const getTotalCartItems = () => {
    let totalItem = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        totalItem += cartItems[item];
      }
    }
    return totalItem; // ← This was missing
  };



  const contextValue = {
    getTotalCartItems, getTotalCartAmount, all_product, cartItems, addtoCart, removeFromCart, isDarkMode,
    setIsDarkMode,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
