import React, { useEffect, useState } from "react";
import { Container, Table, Spinner, Alert, Button } from "react-bootstrap";

const FALLBACK_IMG = "https://via.placeholder.com/50?text=No+Image";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      setError("Please login to view your orders.");
      setLoading(false);
      return;
    }

    // Load orders from user in localStorage
    const storedOrders = user.orders || [];
    setOrders(storedOrders);
    setLoading(false);
  }, []);

  const handleCancelOrder = (orderId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );
    if (!confirmCancel) return;

    // Update orders in state
    const updatedOrders = orders.map((order) => {
      if (order.id === orderId) {
        return { ...order, status: "Cancelled" };
      }
      return order;
    });
    setOrders(updatedOrders);

    // Persist the change in localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    user.orders = updatedOrders;
    localStorage.setItem("user", JSON.stringify(user));
  };

  if (loading)
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );

  if (error)
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );

  if (orders.length === 0)
    return (
      <Container className="mt-5 text-center">
        <h4>No Orders Found</h4>
        <p>You haven’t placed any orders yet.</p>
      </Container>
    );

  return (
    <Container className="mt-5 mb-5">
      <h2 className="mb-4 fw-bold">🛍️ My Orders</h2>

      {orders.map((order) => (
        <div
          key={order.id}
          className="mb-4 p-4 border rounded shadow-sm bg-white"
        >
          {/* Order Header */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h5 className="mb-1">Order #{order.id}</h5>
              <small className="text-muted">Placed on {order.date}</small>
            </div>

            <div>
              <span
                className={`badge me-2 ${
                  order.status === "Cancelled" ? "bg-danger" : "bg-success"
                }`}
              >
                {order.status}
              </span>
              <span className="badge bg-primary">
                {order.paymentMethod.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Order Items */}
          <Table responsive bordered hover size="sm">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Product</th>
                <th className="text-center">Qty</th>
                <th className="text-end">Price</th>
                <th className="text-end">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, idx) => (
                <tr key={item.id}>
                  <td>{idx + 1}</td>

                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <img
                        src={item.image}
                        alt={item.title}
                        width="45"
                        height="45"
                        style={{ objectFit: "cover", borderRadius: "6px" }}
                        onError={(e) => {
                          e.target.src = FALLBACK_IMG;
                        }}
                      />
                      <span>{item.title}</span>
                    </div>
                  </td>

                  <td className="text-center">{item.quantity}</td>
                  <td className="text-end">₹{item.price}</td>
                  <td className="text-end">₹{item.price * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Total & Cancel */}
          <div className="d-flex justify-content-between align-items-center mt-3">
            <h5 className="fw-bold">Total Amount: ₹{order.totalPrice}</h5>
            <Button
              variant="danger"
              disabled={order.status === "Cancelled"}
              onClick={() => handleCancelOrder(order.id)}
            >
              {order.status === "Cancelled" ? "Order Cancelled" : "Cancel Order"}
            </Button>
          </div>
        </div>
      ))}
    </Container>
  );
}
