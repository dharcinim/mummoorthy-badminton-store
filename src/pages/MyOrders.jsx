import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOrdersByCustomer } from "../services/orderService";
import { useAuth } from "../context/AuthContext";


// ── Status → color map ──────────────────────────────────────
const statusColors = {
  Pending: "#FF9800",
  Confirmed: "#2196F3",
  Shipped: "#9C27B0",
  Delivered: "#00C853",
  Cancelled: "#F44336",
};

function MyOrders({ isDark = true }) {

  const { user } = useAuth();

const customerId = user?.customerId;

  console.log("MyOrders Render");

  const navigate = useNavigate();

  const defaultImage = "/assets/Racket/default.webp";
 

  // ── order data ────────────────────────────────────────
const [orders, setOrders] = useState([]);

 useEffect(() => {
    if (customerId) {
        fetchOrders();
    }
}, [customerId]);

    const fetchOrders = async () => {
        try {
            // Backend API
            // const response = await orderService.getOrders(customerId);
            // setOrders(response.data);
            console.log("Customer ID:", customerId);

            

            const response = await getOrdersByCustomer(customerId);

            // Check the response in the console
            console.log("Full Response:", response);
        console.log("Response Data:", response.data);


            setOrders(response.data);
            console.log("Orders:", response.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

  const [hoveredId, setHoveredId] = useState(null);

  const colors = {
    pageBg: isDark ? "#0a0a0a" : "#f5f5f5",
    cardBg: isDark ? "#1a1a1a" : "#ffffff",
    cardBorder: isDark ? "#222" : "#eee",
    textPrimary: isDark ? "#ffffff" : "#111111",
    textSecondary: isDark ? "#888888" : "#6B7280",
    textMuted: isDark ? "#555555" : "#9ca3af",
    divider: isDark ? "#222" : "#E0E0E0",
    itemBg: isDark ? "#111111" : "#F5F7FA",
    accent: "#00FF9C",
  };

  return (
    <div
      style={{
        background: colors.pageBg,
        minHeight: "100vh",
        padding: "40px 40px 80px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* ── Header ── */}
      <div style={{ maxWidth: "1000px", margin: "0 auto 32px" }}>
        <h1
          style={{
            fontSize: "28px",
            fontWeight: "800",
            color: colors.textPrimary,
            margin: 0,
          }}
        >
          My Orders
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: colors.textSecondary,
            marginTop: "6px",
          }}
        >
          Track all your badminton equipment purchases.

       </p>

          <div
              style={{
                  marginTop: "18px",
                  color: colors.textSecondary,
                  fontSize: "14px",
                  fontWeight: "600",
              }}
          >
              Total Orders : {orders.length}
          </div>
        
      </div>

      {/* ── Empty state ── */}
      {orders.length === 0 ? (
        <div
          style={{
            maxWidth: "1000px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "100px 20px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "64px", marginBottom: "16px", opacity: 0.5 }}>
            📦
          </div>
          <h2
            style={{
              fontSize: "20px",
              fontWeight: "700",
              color: colors.textPrimary,
              marginBottom: "8px",
            }}
          >
            No Orders Yet
          </h2>
          <p style={{ fontSize: "14px", color: colors.textSecondary }}>
            Looks like you haven't placed any orders.
          </p>
        </div>
      ) : (
        <div
          style={{
            maxWidth: "1000px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {orders.map((order) => (
            <div
              key={order.id}
              onMouseEnter={() => setHoveredId(order.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                background: colors.cardBg,
                border: `1px solid ${colors.cardBorder}`,
                borderRadius: "20px",
                padding: "24px",
                transition: "all 0.3s ease",
                transform:
                  hoveredId === order.id ? "translateY(-4px)" : "translateY(0)",
                boxShadow:
                  hoveredId === order.id
                    ? "0 20px 40px rgba(0,255,156,0.08)"
                    : isDark
                    ? "0 4px 20px rgba(0,0,0,0.3)"
                    : "0 2px 12px rgba(0,0,0,0.06)",
                borderColor:
                  hoveredId === order.id ? colors.accent : colors.cardBorder,
              }}
              

            >
              {/* ── Top row: Order number + status ── */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: "700",
                    color: colors.textPrimary,
                    margin: 0,
                  }}
                >
                  Order #{order.orderNumber}
                </h3>

                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: "700",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                    color: statusColors[order.status] || colors.textSecondary,
                    background: `${statusColors[order.status] || "#888"}18`,
                    border: `1px solid ${statusColors[order.status] || "#888"}44`,
                    borderRadius: "999px",
                    padding: "6px 16px",
                  }}
                >
                  {order.status}
                </span>
              </div>

              {/* ── Second row: date + payment ── */}
              <div
                style={{
                  display: "flex",
                  gap: "20px",
                  flexWrap: "wrap",
                  marginTop: "8px",
                  marginBottom: "18px",
                }}
              >
                <span style={{ fontSize: "13px", color: colors.textSecondary }}>
                  📅 {order.orderDate}
                </span>
                <span style={{ fontSize: "13px", color: colors.textSecondary }}>
                  💳 {order.paymentMethod}
                </span>
              </div>

              <div
                style={{
                  height: "1px",
                  background: colors.divider,
                  marginBottom: "18px",
                }}
              />

              {/* ── Products section ── */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                  marginBottom: "18px",
                }}
              >
                  {order.orderItems.map((item, idx) => {

                    console.log(item);
                    console.log("Image URL:", item.productImageUrl);

                    return (
                      <div
                        key={idx}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "16px",
                          flexWrap: "wrap",
                          minHeight: "76px",
                        }}
                      >

                    {/* Image */}
                     {/* Image */}
                    <div
                      style={{
                        width: "76px",
                        height: "76px",
                        background: colors.itemBg,
                        borderRadius: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        overflow: "hidden",
                      }}
                    >
                      <img
                       src={
                              item.productVariant?.product?.productImages?.find(img => img.primaryImage)?.imageUrl ||
                              item.productVariant?.product?.productImages?.[0]?.imageUrl ||
                              defaultImage
                            }
                            alt={item.productVariant?.product?.name}
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "contain",
                          display: "block",
                        }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = defaultImage;
                        }}
                      />
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: "160px" }}>
                      <p
                        style={{
                          margin: "0 0 4px",
                          fontSize: "14px",
                          fontWeight: "700",
                          color: colors.textPrimary,
                        }}
                      >
                        {item.productVariant.product.name}
                      </p>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "12px",
                          color: colors.textSecondary,
                        }}
                      >
                        {`${item.productVariant.weight || ""} ${item.productVariant.gripSize || ""}`} &nbsp;·&nbsp; Qty: {item.quantity}
                      </p>
                    </div>

                    {/* Price */}
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: "700",
                        color: colors.textPrimary,
                      }}
                    >
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                    );
})}
              </div>

              <div
                style={{
                  height: "1px",
                  background: colors.divider,
                  marginBottom: "18px",
                }}
              />

              {/* ── Bottom row: total + view details ── */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: "12px",
                      color: colors.textSecondary,
                      marginRight: "8px",
                    }}
                  >
                    Total Amount
                  </span>
                  <span
                    style={{
                      fontSize: "18px",
                      fontWeight: "800",
                      color: colors.accent,
                    }}
                  >
                    ₹{order.totalAmount.toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={() => navigate(`/orders/${order.id}`)}
                  style={{
                    padding: "10px 24px",
                    borderRadius: "999px",
                    border: `1px solid ${isDark ? "#fff" : "#111"}`,
                    background: "transparent",
                    color: isDark ? "#fff" : "#111",
                    fontSize: "13px",
                    fontWeight: "700",
                    cursor: "pointer",
                    letterSpacing: "0.3px",
                    transition: "all 0.25s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = colors.accent;
                    e.target.style.color = "#000";
                    e.target.style.borderColor = colors.accent;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "transparent";
                    e.target.style.color = isDark ? "#fff" : "#111";
                    e.target.style.borderColor = isDark ? "#fff" : "#111";
                  }}
                >
                  View Order →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyOrders;
