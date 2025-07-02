import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./OrderSuccess.css";

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const navigate = useNavigate();

  const [status, setStatus] = useState("Verifying payment...");

  useEffect(() => {
    const verifyAndPlaceOrder = async () => {
      if (!sessionId) {
        setStatus("Invalid session. Redirecting...");
        setTimeout(() => navigate("/"), 3000);
        return;
      }

      try {
        setStatus("Verifying payment...");
        const verifyRes = await fetch(`http://localhost:4000/api/verify-session?session_id=${sessionId}`);
        const verifyData = await verifyRes.json();

        if (!verifyData.success) {
          setStatus("Payment verification failed.");
          return;
        }

        setStatus("Payment successful!");

        const orderData = JSON.parse(localStorage.getItem("latestOrder"));
        if (!orderData) {
          setStatus("No order data found.");
          return;
        }

        setTimeout(async () => {
          setStatus("Placing your order...");
          const token = localStorage.getItem("auth-token");

          const res = await fetch("http://localhost:4000/api/order/place", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "auth-token": token,
            },
            body: JSON.stringify(orderData),
          });

          if (res.ok) {
            localStorage.removeItem("latestOrder");
            setStatus("Order placed successfully! Redirecting...");
            setTimeout(() => navigate("/myorders"), 2000);
          } else {
            setStatus("Failed to place the order.");
          }
        }, 1500); // Delay before placing the order

      } catch (error) {
        console.error("Error:", error);
        setStatus("Something went wrong. Please try again.");
      }
    };

    verifyAndPlaceOrder();
  }, [sessionId, navigate]);

  return (
    <div className="order-success-container">
      <div className="circle-loader"></div>
      <p className="status-text">{status}</p>
    </div>
  );
};

export default OrderSuccess;
