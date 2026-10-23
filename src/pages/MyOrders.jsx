import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getOrdersByCustomer } from "../services/orderService";
import { useAuth } from "../context/AuthContext";
import {
  Package,
  PackageCheck,
  Truck,
  Clock3,
  XCircle,
  CreditCard,
  CalendarDays,
  ShoppingBag,
  Eye,
  ChevronRight,
  Search,
  Filter,
  BadgeCheck,
  ArrowUpDown,
} from "lucide-react";

// ── Status → visual config (icon, color, soft background) ──────────────
const statusColors = {
  Pending: "#F59E0B",
  Confirmed: "#2563EB",
  Shipped: "#6366F1",
  Delivered: "#16A34A",
  Cancelled: "#EF4444",
};

const statusMeta = {
  Pending: { icon: Clock3, color: "#F59E0B", bg: "#FEF3C7" },
  Confirmed: { icon: BadgeCheck, color: "#2563EB", bg: "#DBEAFE" },
  Shipped: { icon: Truck, color: "#6366F1", bg: "#E0E7FF" },
  Delivered: { icon: PackageCheck, color: "#16A34A", bg: "#DCFCE7" },
  Cancelled: { icon: XCircle, color: "#EF4444", bg: "#FEE2E2" },
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

  // ── Presentation-only UI state (search / filter / sort) ──────────────
  // These do not touch fetchOrders, orders, or any data binding — they
  // only control how the already-fetched `orders` array is displayed.
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [viewBtnHoverId, setViewBtnHoverId] = useState(null);

  const displayedOrders = useMemo(() => {
    let result = [...orders];

    if (statusFilter !== "All") {
      result = result.filter((o) => o.status === statusFilter);
    }

    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      result = result.filter((o) => {
        const orderNumberMatch = String(o.orderNumber || "")
          .toLowerCase()
          .includes(q);
        const productMatch = (o.orderItems || []).some((item) =>
          (item.productName || "")
            .toLowerCase()
            .includes(q)
        );
        return orderNumberMatch || productMatch;
      });
    }

    if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
    } else if (sortBy === "oldest") {
      result.sort((a, b) => new Date(a.orderDate) - new Date(b.orderDate));
    } else if (sortBy === "amount_high") {
      result.sort((a, b) => (b.totalAmount || 0) - (a.totalAmount || 0));
    } else if (sortBy === "amount_low") {
      result.sort((a, b) => (a.totalAmount || 0) - (b.totalAmount || 0));
    }

    return result;
  }, [orders, searchTerm, statusFilter, sortBy]);

  // ── Design tokens (premium light e-commerce palette) ─────────────────
  const colors = {
    pageBg: "#F8FAFC",
    cardBg: "#FFFFFF",
    border: "#E5E7EB",
    textPrimary: "#111827",
    textSecondary: "#6B7280",
    textMuted: "#9CA3AF",
    divider: "#E5E7EB",
    itemBg: "#F8FAFC",
    primary: "#2563EB",
    primaryDark: "#1D4ED8",
    success: "#16A34A",
    warning: "#F59E0B",
    danger: "#EF4444",
  };

  const statusOptions = ["All", "Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];

  return (
    <div
      style={{
        background: colors.pageBg,
        minHeight: "100vh",
        padding: "40px 40px 80px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <style>{`
        @keyframes mmbFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .mmb-order-card {
          animation: mmbFadeIn 0.4s ease both;
        }
        .mmb-search-input::placeholder {
          color: #9CA3AF;
        }
        .mmb-select {
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
        }
      `}</style>

      {/* ── Header ── */}
      <div style={{ maxWidth: "1100px", margin: "0 auto 28px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: "20px",
            marginBottom: "24px",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "30px",
                fontWeight: "800",
                color: colors.textPrimary,
                margin: 0,
                letterSpacing: "-0.02em",
              }}
            >
              My Orders
            </h1>
            <p
              style={{
                fontSize: "14.5px",
                color: colors.textSecondary,
                marginTop: "6px",
              }}
            >
              Track and manage all your badminton purchases.
            </p>
          </div>

          {/* Total Orders Card */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              background: colors.cardBg,
              border: `1px solid ${colors.border}`,
              borderRadius: "16px",
              padding: "14px 22px",
              boxShadow: "0 1px 3px rgba(17,24,39,0.04)",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "12px",
                background: "#DBEAFE",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <ShoppingBag size={20} color={colors.primary} strokeWidth={2} />
            </div>
            <div>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "800",
                  color: colors.textPrimary,
                  lineHeight: 1.1,
                }}
              >
                {orders.length}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: colors.textSecondary,
                  fontWeight: "600",
                }}
              >
                Total Orders
              </div>
            </div>
          </div>
        </div>

        {/* Search / Filter / Sort toolbar */}
        {orders.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            {/* Search */}
            <div
              style={{
                position: "relative",
                flex: "1 1 260px",
                minWidth: "220px",
              }}
            >
              <Search
                size={17}
                color={colors.textMuted}
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                }}
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by order number or product"
                className="mmb-search-input"
                style={{
                  width: "100%",
                  padding: "11px 14px 11px 40px",
                  borderRadius: "12px",
                  border: `1px solid ${colors.border}`,
                  background: colors.cardBg,
                  color: colors.textPrimary,
                  fontSize: "13.5px",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = colors.primary;
                  e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.12)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = colors.border;
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Status Filter */}
            <div style={{ position: "relative" }}>
              <Filter
                size={15}
                color={colors.textMuted}
                style={{
                  position: "absolute",
                  left: "13px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                }}
              />
              <select
                className="mmb-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  padding: "11px 34px 11px 36px",
                  borderRadius: "12px",
                  border: `1px solid ${colors.border}`,
                  background: colors.cardBg,
                  color: colors.textPrimary,
                  fontSize: "13.5px",
                  fontWeight: "600",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>
                    {s === "All" ? "All Statuses" : s}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div style={{ position: "relative" }}>
              <ArrowUpDown
                size={15}
                color={colors.textMuted}
                style={{
                  position: "absolute",
                  left: "13px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                }}
              />
              <select
                className="mmb-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: "11px 34px 11px 36px",
                  borderRadius: "12px",
                  border: `1px solid ${colors.border}`,
                  background: colors.cardBg,
                  color: colors.textPrimary,
                  fontSize: "13.5px",
                  fontWeight: "600",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="amount_high">Amount: High to Low</option>
                <option value="amount_low">Amount: Low to High</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* ── Empty state ── */}
      {orders.length === 0 ? (
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "110px 20px",
            textAlign: "center",
            background: colors.cardBg,
            borderRadius: "20px",
            border: `1px solid ${colors.border}`,
          }}
        >
          <div
            style={{
              width: "84px",
              height: "84px",
              borderRadius: "20px",
              background: "#F1F5F9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "22px",
            }}
          >
            <Package size={38} color={colors.textMuted} strokeWidth={1.5} />
          </div>
          <h2
            style={{
              fontSize: "20px",
              fontWeight: "800",
              color: colors.textPrimary,
              marginBottom: "8px",
            }}
          >
            No Orders Yet
          </h2>
          <p style={{ fontSize: "14px", color: colors.textSecondary, marginBottom: "24px" }}>
            You haven't placed any orders yet.
          </p>
          <button
            onClick={() => navigate("/products")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 26px",
              borderRadius: "999px",
              border: "none",
              background: colors.primary,
              color: "#FFFFFF",
              fontSize: "13.5px",
              fontWeight: "700",
              cursor: "pointer",
              transition: "background 0.2s ease, transform 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = colors.primaryDark;
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = colors.primary;
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <ShoppingBag size={16} />
            Browse Products
          </button>
        </div>
      ) : displayedOrders.length === 0 ? (
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            textAlign: "center",
            padding: "80px 20px",
            color: colors.textSecondary,
            background: colors.cardBg,
            borderRadius: "20px",
            border: `1px solid ${colors.border}`,
          }}
        >
          <Search size={30} color={colors.textMuted} style={{ marginBottom: "14px" }} />
          <p style={{ fontSize: "14.5px", fontWeight: "600", margin: 0 }}>
            No orders match your search or filter.
          </p>
        </div>
      ) : (
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: "18px",
          }}
        >
          {displayedOrders.map((order, orderIdx) => {
            const meta = statusMeta[order.status] || {
              icon: Clock3,
              color: colors.textSecondary,
              bg: "#F3F4F6",
            };
            const StatusIcon = meta.icon;
            const isHovered = hoveredId === order.id;
            const isBtnHovered = viewBtnHoverId === order.orderId;

            return (
              <div
                key={order.id}
                className="mmb-order-card"
                onMouseEnter={() => setHoveredId(order.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  background: colors.cardBg,
                  border: `1px solid ${isHovered ? colors.primary : colors.border}`,
                  borderRadius: "16px",
                  padding: "24px",
                  transition: "all 0.3s ease",
                  transform: isHovered ? "translateY(-4px)" : "translateY(0)",
                  boxShadow: isHovered
                    ? "0 20px 40px rgba(37,99,235,0.10)"
                    : "0 1px 3px rgba(17,24,39,0.05)",
                  animationDelay: `${Math.min(orderIdx, 8) * 0.04}s`,
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
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "12px",
                      fontWeight: "700",
                      letterSpacing: "0.3px",
                      textTransform: "uppercase",
                      color: meta.color,
                      background: meta.bg,
                      border: `1px solid ${meta.color}33`,
                      borderRadius: "999px",
                      padding: "6px 14px",
                    }}
                  >
                    <StatusIcon size={13} strokeWidth={2.5} />
                    {order.status}
                  </span>
                </div>

                {/* ── Second row: date + payment ── */}
                <div
                  style={{
                    display: "flex",
                    gap: "20px",
                    flexWrap: "wrap",
                    marginTop: "10px",
                    marginBottom: "18px",
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "13px",
                      color: colors.textSecondary,
                    }}
                  >
                    <CalendarDays size={14} color={colors.textMuted} />
                    {order.orderDate}
                  </span>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "13px",
                      color: colors.textSecondary,
                    }}
                  >
                    <CreditCard size={14} color={colors.textMuted} />
                    {order.paymentMethod}
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
                    {(order.orderItems || []).map((item, idx) => {

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
                            padding: "8px",
                            borderRadius: "12px",
                            transition: "background 0.2s ease",
                          }}
                        >

                      {/* Image */}
                      <div
                        style={{
                          width: "68px",
                          height: "68px",
                          background: colors.itemBg,
                          borderRadius: "12px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          overflow: "hidden",
                          border: `1px solid ${colors.border}`,
                        }}
                      >
                        <img
                         src={
                                item.productImageUrl || defaultImage
                              }
                              alt={item.productName}
                          style={{
                            width: "52px",
                            height: "52px",
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
                          {item.productName || "Unknown Product"}
                        </p>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "12px",
                            color: colors.textSecondary,
                          }}
                        >
                           {`${item.weight || ""} ${item.gripSize || ""}`}&nbsp;·&nbsp; Qty: {item.quantity}
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
                        ₹{((item.price || 0) * (item.quantity || 0)).toLocaleString()}
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
                        display: "block",
                        fontSize: "11.5px",
                        color: colors.textSecondary,
                        fontWeight: "600",
                        textTransform: "uppercase",
                        letterSpacing: "0.3px",
                        marginBottom: "2px",
                      }}
                    >
                      Total Amount
                    </span>
                    <span
                      style={{
                        fontSize: "22px",
                        fontWeight: "800",
                        color: colors.primary,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      ₹{order.totalAmount.toLocaleString()}
                    </span>
                  </div>

                  <button
                    onClick={() => navigate(`/orders/${order.orderId}`)}
                    onMouseEnter={() => setViewBtnHoverId(order.orderId)}
                    onMouseLeave={() => setViewBtnHoverId(null)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "11px 22px",
                      borderRadius: "999px",
                      border: "none",
                      background: isBtnHovered ? colors.primaryDark : colors.primary,
                      color: "#FFFFFF",
                      fontSize: "13px",
                      fontWeight: "700",
                      cursor: "pointer",
                      letterSpacing: "0.2px",
                      transition: "all 0.25s ease",
                      transform: isBtnHovered ? "translateY(-1px)" : "translateY(0)",
                      boxShadow: isBtnHovered
                        ? "0 8px 20px rgba(37,99,235,0.28)"
                        : "0 2px 6px rgba(37,99,235,0.15)",
                    }}
                  >
                    <Eye size={15} />
                    View Details
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyOrders;
