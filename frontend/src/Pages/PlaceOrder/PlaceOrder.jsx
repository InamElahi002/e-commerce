import React, { useContext, useState } from "react";
import { ShopContext } from "../../Context/ShopContext";
import "./PlaceOrder.css";

import { useNavigate } from "react-router-dom"; // ✅ Import here

import { loadStripe } from "@stripe/stripe-js";


// ... your existing code


const PlaceOrder = () => {
  
  const navigate = useNavigate(); // ✅ Correct usage

  const {
    all_product,
    cartItems,
    getTotalCartAmount,
  } = useContext(ShopContext);

  const [deliveryInfo, setDeliveryInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    phone: "",
  });




  const handleInputChange = (e) => {

    const { name, value } = e.target;
    setDeliveryInfo((prev) => ({ ...prev, [name]: value }));
  };

  const cartProductList = Object.entries(cartItems)
    .filter(([id, qty]) => qty > 0)
    .map(([id, qty]) => {
      const product = all_product.find((p) => p.id === Number(id));
      return { ...product, quantity: qty };
    });

  const handlePlaceOrder = async () => {
    if (Object.values(deliveryInfo).some((v) => v.trim() === "")) {
      alert("Please fill in all delivery fields.");
      return;
    }

    const orderData = {
      deliveryInfo,
      cartItems: cartProductList,
      totalAmount: getTotalCartAmount() + 2,
    };

    try {
      // ✅ Save order temporarily before payment
      localStorage.setItem("latestOrder", JSON.stringify(orderData));


      // ✅ Create checkout session on backend
      const res = await fetch("http://localhost:4000/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),  // 🔥 Fixed: moved here correctly
      });

      const data = await res.json();

      // ✅ Load Stripe and redirect
      const stripe = await loadStripe("pk_test_51RSxs4I5c2bVmMJGjn4ZnhoOUbX4SdqzrZTALDQhcAnVgUhrnd3XBRabxDh7PHzTQMpouzrzoynco235Q97p5r6M009iYnFEC3"); // Replace with real key from Stripe dashboard
      // stripe.redirectToCheckout({ url: data.url });
      stripe.redirectToCheckout({ sessionId: data.id });
      console.log("Session data received:", data);


    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment initiation failed.");
    }
  };




  return (
    <div className="place-order">
      {/* LEFT FORM */}
      <div className="place-order-left">
        <div className="title">Delivery Information</div>
        <input required
          type="text"
          name="firstName"
          placeholder="First name"
          value={deliveryInfo.firstName}
          onChange={handleInputChange}
        />
        <input required
          type="text"
          name="lastName"
          placeholder="Last name"
          value={deliveryInfo.lastName}
          onChange={handleInputChange}
        />
        <input required
          type="email"
          name="email"
          placeholder="Email address"
          value={deliveryInfo.email}
          onChange={handleInputChange}
        />
        <input required
          type="text"
          name="street"
          placeholder="Street"
          value={deliveryInfo.street}
          onChange={handleInputChange}
        />
        <div className="multi-feilds">
          <input required
            type="text"
            name="city"
            placeholder="City"
            value={deliveryInfo.city}
            onChange={handleInputChange}
          />
          <input required
            type="text"
            name="state"
            placeholder="State"
            value={deliveryInfo.state}
            onChange={handleInputChange}
          />
        </div>
        <div className="multi-feilds">
          <input required
            type="text"
            name="zipCode"
            placeholder="Zip code"
            value={deliveryInfo.zipCode}
            onChange={handleInputChange}
          />
          <input required
            type="text"
            name="country"
            placeholder="Country"
            value={deliveryInfo.country}
            onChange={handleInputChange}
          />
        </div>
        <input required
          type="tel"
          name="phone"
          placeholder="Phone"
          value={deliveryInfo.phone}
          onChange={handleInputChange}
        />
      </div>

      {/* RIGHT CART TOTALS */}
      <div className="place-order-right">
        <h2>Cart Totals</h2>
        <div className="cart-total-details">
          <p>
            <strong>Subtotal:</strong> ${getTotalCartAmount()}
          </p>
          <hr />

          <p>
            <strong>Delivery Fee:</strong> $2
          </p>

          <hr />
          <p>
            <strong>Total:</strong> ${getTotalCartAmount() + 2}
          </p>

          <hr />
        </div>

        <button
          className="cart-total"
          onClick={handlePlaceOrder}
          disabled={cartProductList.length === 0}

        >
          PROCEED TO PAYMENT
        </button>
      </div>
    </div>
  );
};

export default PlaceOrder;
