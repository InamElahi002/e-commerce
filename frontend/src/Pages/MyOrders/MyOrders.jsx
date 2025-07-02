import React, { useEffect, useState } from 'react';
import './MyOrders.css'
import parcelicon from '../../Components/Assets/parcel_icon.png'




const token = localStorage.getItem('token');
console.log("Token used for fetching orders:", token);


const MyOrders = () => {
    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem("auth-token");

            if (!token) {
                console.warn("No token found! User may not be logged in.");
                return;
            }

            const res = await fetch('http://localhost:4000/api/order/myorders', {
                headers: {
                    'auth-token': token
                }
            });

            const data = await res.json();
            console.log("Orders response:", data);

            if (data.success) {
                setOrders(data.orders);
            } else {
                console.error('Failed to fetch orders:', data.message || data.errors);
            }
        } catch (err) {
            console.error('Error fetching orders:', err);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);


    document.querySelectorAll('.order-content p strong').forEach(el => {
        if (el.textContent.trim() === 'Pending') {
            el.classList.add('status-pending');
        }
    });

setTimeout(() => {
  document.querySelectorAll('.order-content p').forEach(p => {
    if (p.textContent.includes('Status:')) {
      if (p.textContent.includes('Pending')) {
        p.setAttribute('data-status', 'Pending');
      } else if (p.textContent.includes('Processing')) {
        p.setAttribute('data-status', 'Processing');
      } else if (p.textContent.includes('Out for Delivery')) {
        p.setAttribute('data-status', 'Out for Delivery');
      } else if (p.textContent.includes('Delivered')) {
        p.setAttribute('data-status', 'Delivered');
      }
    }
  });
}, 100);




    return (
        <div className="my-orders-container">
            <h2 className='my-orders-1'>My Orders</h2>

            {orders.length === 0 ? (
                <p className='no-order'>No orders found.</p>
            ) : (
                orders.map((order, idx) => (
                    <div className="order" key={idx}>
                        <img src={parcelicon} alt="order_box" />
                        <div className="order-content">
                            <ul>
                                {order.cartItems.map((item, i) => (
                                    <li key={i}>{item.name} x {item.quantity}</li>
                                ))}
                            </ul>
                            <p><strong>Date:</strong> {new Date(order.orderDate).toLocaleString()}</p>
                            <p><strong>Total:</strong> ${order.totalAmount}</p>
                            <p><strong>Status:</strong> {order.status}</p>
                        </div>
                        <button type="submit" onClick={fetchOrders}>Track Order</button>
                    </div>


                ))
            )}
        </div>

    );
};

export default MyOrders;
