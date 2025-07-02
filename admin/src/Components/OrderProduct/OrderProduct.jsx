import React, { useEffect, useState } from 'react';
import './OrderProduct.css';
import parecel_icon from '../../assets/parcel_icon.png';

const OrderProduct = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/admin/allorders');
        const data = await res.json();

        if (data.success) {
          setOrders(data.orders);
        } else {
          console.error('Failed to fetch orders:', data.message);
        }
      } catch (err) {
        console.error('Error fetching admin orders:', err);
      }
    };

    fetchOrders();
  }, []);


  // Handler for changing order status
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch('http://localhost:4000/api/admin/order/status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      const data = await res.json();

      if (data.success) {
        // Update order status locally in state
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else {
        alert('Failed to update status: ' + data.message);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status');
    }
  };



  const handleDeleteOrder = async (orderId) => {
  if (!window.confirm("Are you sure you want to delete this order?")) return;

  try {
    const res = await fetch(`http://localhost:4000/api/admin/order/${orderId}`, {
      method: 'DELETE',
    });
    const data = await res.json();

    if (data.success) {
      alert("Order deleted successfully");
      // Update the order list by removing deleted order
      setOrders(prevOrders => prevOrders.filter(order => order._id !== orderId));
    } else {
      alert("Failed to delete order: " + data.message);
    }
  } catch (error) {
    alert("Error deleting order");
    console.error(error);
  }
};

  return (
    <div className="admin-orders-container">
      <h2 className='admin-orders-heading'>Admin Order Management</h2>
      {orders.length === 0 ? (
        <p className="no-order">No orders available</p>
      ) : (
        orders.map((order, index) => (
          <div className="admin-order" key={index}>
            <img src={parecel_icon} alt="" />

            <div className="admin-order-items">
              <ul>
                {order.cartItems.map((item, idx) => (
                  <li key={idx}>{item.name} x {item.quantity}</li>
                ))}
              </ul>
            </div>

            <div className="admin-order-details">
              <p><strong>Name:</strong> {order.deliveryInfo.firstName} {order.deliveryInfo.lastName}</p>
              <p><strong>Address:</strong> {order.deliveryInfo.city}, {order.deliveryInfo.state}, {order.deliveryInfo.country} - {order.deliveryInfo.zipCode}</p>
              <p><strong>Phone:</strong> {order.deliveryInfo.phone}</p>
              <p><strong>Total Quantity:</strong> {order.cartItems.reduce((acc, item) => acc + item.quantity, 0)}</p>
              <p><strong>Order Amount:</strong> ${order.totalAmount}</p>
            </div>

            <div className="admin-order-status">
              <label>Status:</label>
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(order._id, e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
              <button onClick={() => handleDeleteOrder(order._id)}>Delete Order</button>

            </div>
          </div>

        ))
      )}
    </div>
  );
};

export default OrderProduct;
