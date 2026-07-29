import api from "./api";

// Get all orders
export const getAllOrders = () => {
  return api.get("/orders");
};

// Get orders by customer
export const getOrdersByCustomer = (customerId) => {
  return api.get(`/orders/customer/${customerId}`);
};

// Get orders by status
export const getOrdersByStatus = (status) => {
  return api.get(`/orders/status/${status}`);
};

// Get single order by ID
export const getOrder = (orderId) => {
  return api.get(`/orders/${orderId}`).then((response) => response.data);
};

// Update order status
export const updateOrderStatus = (id, status) => {
  return api.put(`/orders/${id}/status`, {
    status,
  });
};

// Cancel Order
export const cancelOrder = (orderId) => {
  return api
    .put(`/orders/${orderId}/status`, {
      status: "CANCELLED",
    })
    .then((response) => response.data);
};