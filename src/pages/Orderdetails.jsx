import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Truck,
  MapPin,
  PackageCheck,
  Package,
  Phone,
  Mail,
  User,
  CreditCard,
  ShieldCheck,
  HelpCircle,
  RotateCcw,
  FileQuestion,
  ChevronRight,
  ImageOff,
} from "lucide-react";
import { getOrder , cancelOrder} from "../services/orderService"; // adjust import path to match project structure
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-toastify";


// ---------------------------------------------------------------------------
// Design tokens (shared visual language with MyOrders.jsx / Cart.jsx / Wishlist.jsx)
// ---------------------------------------------------------------------------
const COLORS = {
  pageBg: "#F5F7FA",
  cardBg: "#FFFFFF",
  textPrimary: "#1F2937",
  textSecondary: "#6B7280",
  border: "#E5E7EB",
  divider: "#ECECEC",
  accentGreen: "#00C853",
  hoverGreen: "#00B248",
  buttonText: "#FFFFFF",
};

const BADGE_STYLES = {
  PENDING: { bg: "#FFF3E0", text: "#E65100", border: "#FFE0B2" },
  CONFIRMED: { bg: "#E3F2FD", text: "#1565C0", border: "#BBDEFB" },
  PACKED: { bg: "#F3E8FD", text: "#7B1FA2", border: "#E1BEE7" },
  SHIPPED: { bg: "#E8EAF6", text: "#3949AB", border: "#C5CAE9" },
  OUT_FOR_DELIVERY: { bg: "#FFF3E0", text: "#EF6C00", border: "#FFCC80" },
  DELIVERED: { bg: "#E8F9EE", text: "#00873E", border: "#B7EACB" },
  CANCELLED: { bg: "#FDECEC", text: "#C62828", border: "#F5C6C6" },
};

// ---------------------------------------------------------------------------
// Config: status -> timeline step index, badge color, label
// ---------------------------------------------------------------------------
const STATUS_STEPS = [
  { key: "CONFIRMED", label: "Order Placed", icon: CheckCircle2 },
  { key: "PACKED", label: "Packed", icon: PackageCheck },
  { key: "SHIPPED", label: "Shipped", icon: Truck },
  { key: "OUT_FOR_DELIVERY", label: "Out for Delivery", icon: MapPin },
  { key: "DELIVERED", label: "Delivered", icon: Package },
];

const STATUS_ORDER = [
  "PENDING",
  "CONFIRMED",
  "PACKED",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

const STATUS_LABELS = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PACKED: "Packed",
  SHIPPED: "Shipped",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

function formatCurrency(value) {
  const n = Number(value ?? 0);
  return n.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  });
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ---------------------------------------------------------------------------
// Local styles for things inline style objects can't express
// (hover states, keyframe animations) — scoped to this page only.
// ---------------------------------------------------------------------------
function PageStyles() {
  return (
    <style>{`
      @keyframes odp-spin {
        to { transform: rotate(360deg); }
      }
      @keyframes odp-pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.55; }
      }
      .odp-back-btn:hover { color: ${COLORS.hoverGreen} !important; }
      .odp-help-btn:hover {
        border-color: ${COLORS.accentGreen} !important;
        color: ${COLORS.hoverGreen} !important;
      }
      .odp-outline-btn:hover {
        border-color: ${COLORS.accentGreen} !important;
        color: ${COLORS.hoverGreen} !important;
      }
      .odp-primary-btn:hover { background-color: ${COLORS.hoverGreen} !important; }
      .odp-cancel-btn:hover {
        background-color: #DC2626 !important;
        color: #FFFFFF !important;
      }
      .odp-product-card:hover {
        box-shadow: 0 8px 20px rgba(0,0,0,0.08) !important;
        border-color: #CFF3DC !important;
      }
      .odp-product-card:hover .odp-product-img {
        transform: scale(1.05);
      }
    
      .odp-section-card:hover{
            transform: translateY(-6px);
            box-shadow: 0 15px 35px rgba(0,0,0,0.12) !important;
            border-color: #00C853 !important;
        }

      .odp-current-step { animation: odp-pulse 1.8s ease-in-out infinite; }
    `}</style>
  );
}

// ---------------------------------------------------------------------------
// Small presentational pieces
// ---------------------------------------------------------------------------

function StatusBadge({ status }) {
  const style = BADGE_STYLES[status] || BADGE_STYLES.PENDING;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        borderRadius: 999,
        padding: "6px 14px",
        fontSize: 14,
        fontWeight: 600,
        backgroundColor: style.bg,
        color: style.text,
        border: `1px solid ${style.border}`,
        whiteSpace: "nowrap",
      }}
    >
      <Circle size={8} fill="currentColor" stroke="none" />
      {STATUS_LABELS[status] || status}
    </span>
  );
}

function TrackingTimeline({ status }) {
  if (status === "CANCELLED") {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          borderRadius: 12,
          border: "1px solid #F5C6C6",
          backgroundColor: "#FDECEC",
          padding: "16px",
        }}
      >
        <ShieldCheck size={20} color="#C62828" style={{ flexShrink: 0 }} />
        <p style={{ fontSize: 14, fontWeight: 500, color: "#C62828", margin: 0 }}>
          This order was cancelled. If you were charged, a refund will be
          processed automatically.
        </p>
      </div>
    );
  }

  const currentIndex = Math.max(STATUS_ORDER.indexOf(status), 0);
  // STATUS_STEPS starts at CONFIRMED (index 1 in STATUS_ORDER)
  const stepOffset = 1;

  
  return (
    <ol style={{ position: "relative", marginLeft: 12, listStyle: "none", padding: 0, margin: "0 0 0 12px" }}>
      {STATUS_STEPS.map((step, i) => {
        const stepStatusIndex = i + stepOffset;
        const isComplete = currentIndex > stepStatusIndex;
        const isCurrent = currentIndex === stepStatusIndex;
        const isUpcoming = currentIndex < stepStatusIndex;
        const Icon = step.icon;
        const isLast = i === STATUS_STEPS.length - 1;

        return (
          <li
            key={step.key}
            style={{
              position: "relative",
              paddingLeft: 40,
              paddingBottom: isLast ? 0 : 32,
            }}
          >
            {!isLast && (
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: 15,
                  top: 32,
                  height: "100%",
                  width: 2,
                  backgroundColor: isComplete ? COLORS.accentGreen : COLORS.border,
                }}
              />
            )}
            <span
              className={isCurrent ? "odp-current-step" : ""}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                display: "flex",
                height: 32,
                width: 32,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                boxShadow: "0 0 0 4px #FFFFFF",
                backgroundColor: isComplete || isCurrent ? COLORS.accentGreen : "#F3F4F6",
                color: isComplete || isCurrent ? "#FFFFFF" : "#9CA3AF",
              }}
            >
              <Icon size={16} />
            </span>
            <div style={{ paddingTop: 4 }}>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  margin: 0,
                  color: isUpcoming ? "#9CA3AF" : COLORS.textPrimary,
                }}
              >
                {step.label}
              </p>
              {isCurrent && (
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: COLORS.hoverGreen,
                    margin: "2px 0 0 0",
                  }}
                >
                  Current status
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function ProductCard({ item, navigate , addToCart }) {
 
  const primaryImage = item.productImageUrl;

  const lineTotal = (item?.price ?? 0) * (item?.quantity ?? 0);

  return (
    <div
      className="odp-product-card"
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 16,
        borderRadius: 14,
        border: `1px solid ${COLORS.divider}`,
        backgroundColor: COLORS.cardBg,
        padding: 16,
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        transition: "box-shadow 0.3s ease, border-color 0.3s ease",
      }}
    >
      <div
        style={{
          height: 140,
          width: 140,
          flexShrink: 0,
          overflow: "hidden",
          borderRadius: 10,
          backgroundColor: "#F9FAFB",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 8,
        }}
      >
        {primaryImage ? (
          <img
            className="odp-product-img"
            src={primaryImage}
            alt={item.productName  || "Product"}
            style={{
              height: "100%",
              width: "100%",
              objectFit: "contain",
              transition: "transform 0.3s ease",
            }}
          />
        ) : (
          <ImageOff size={32} color="#D1D5DB" />
        )}
      </div>

      <div style={{ display: "flex", flex: 1, minWidth: 200, flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <p
            style={{
              fontSize: 12,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.03em",
              color: COLORS.hoverGreen,
              margin: 0,
            }}
          >
            {item.brandName}
          </p>
          <h3
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: COLORS.textPrimary,
              margin: "2px 0 0 0",
            }}
          >
            {item.productName}
          </h3>
          <div
            style={{
              marginTop: 6,
              display: "flex",
              flexWrap: "wrap",
              columnGap: 16,
              rowGap: 4,
              fontSize: 13,
              color: COLORS.textSecondary,
            }}
          >
            {item.weight && <span>Weight: {item.weight}</span>}
            {item.gripSize && <span>Grip: {item.gripSize}</span>}
            <span>Qty: {item.quantity}</span>
          </div>
        </div>

        <div
          style={{
            marginTop: 12,
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div>
            <p style={{ fontSize: 12, color: "#9CA3AF", margin: 0 }}>
              {formatCurrency(item?.price)} × {item?.quantity}
            </p>
            <p style={{ fontSize: 18, fontWeight: 700, color: COLORS.textPrimary, margin: "2px 0 0 0" }}>
              {formatCurrency(lineTotal)}
            </p>
          </div>
          <div className="button-group" style={{ display: "flex", gap: 8 }}>
            <button
              className="odp-outline-btn"
              onClick={() => navigate(`/products/${item.productId}`)}
              style={{
                height: 38,
                minWidth: 128,
                borderRadius: 10,
                border: `1px solid ${COLORS.border}`,
                backgroundColor: "transparent",
                padding: "0 14px",
                fontSize: 13,
                fontWeight: 600,
                color: COLORS.textPrimary,
                cursor: "pointer",
                transition: "border-color 0.2s ease, color 0.2s ease",
              }}
            >
              View Product
            </button>
            <button
              className="odp-primary-btn"
              style={{
                height: 38,
                minWidth: 128,
                borderRadius: 10,
                border: "none",
                backgroundColor: COLORS.accentGreen,
                padding: "0 14px",
                fontSize: 13,
                fontWeight: 600,
                color: COLORS.buttonText,
                cursor: "pointer",
                transition: "background-color 0.2s ease",
              }}
              onClick={async () => {

                await addToCart({
                    productVariantId: item.productVariantId,
                    quantity: 1
                });

                const cartIcon = document.getElementById("cart-icon");

                if (cartIcon) {
                    cartIcon.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                    inline: "center",
                    });
                }
            cartIcon.classList.add("cart-bounce");

                setTimeout(() => {
                    cartIcon.classList.remove("cart-bounce");
                }, 600);


              toast.success("Added to cart 🛒");

            }}
            >
              Buy Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shared section card wrapper
// ---------------------------------------------------------------------------
function SectionCard({ title, extra, children }) {
  return (
    <section
       className="odp-section-card"
      style={{
        borderRadius: 16,
        backgroundColor: COLORS.cardBg,
        padding: 24,
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        border: `1px solid ${COLORS.divider}`,
        transition: "all 0.3s ease",
        cursor: "pointer",
      }}
    >
      <h2
        style={{
          marginTop: 0,
          marginBottom: 20,
          fontSize: 16,
          fontWeight: 600,
          color: COLORS.textPrimary,
        }}
      >
        {title}
        {extra && (
          <span style={{ color: "#9CA3AF", fontWeight: 400 }}> {extra}</span>
        )}
      </h2>
      {children}
    </section>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchOrder() {
      setLoading(true);
      setError(null);
      try {
        const data = await getOrder(orderId);
        console.log("Fetched Order:", data);
        setOrder(data);

        if (isMounted) setOrder(data);
      } catch (err) {
        if (isMounted) {
          setError(
            err?.message || "We couldn't load this order. Please try again."
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (orderId) fetchOrder();

    return () => {
      isMounted = false;
    };
  }, [orderId]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: COLORS.pageBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <PageStyles />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <div
            style={{
              height: 40,
              width: 40,
              borderRadius: "50%",
              border: "4px solid #E8F9EE",
              borderTopColor: COLORS.accentGreen,
              animation: "odp-spin 0.8s linear infinite",
            }}
          />
          <p style={{ fontSize: 14, fontWeight: 500, color: COLORS.textSecondary, margin: 0 }}>
            Loading your order…
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: COLORS.pageBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 16px",
        }}
      >
        <PageStyles />
        <div
          style={{
            maxWidth: 420,
            width: "100%",
            borderRadius: 16,
            border: "1px solid #F5C6C6",
            backgroundColor: COLORS.cardBg,
            padding: 32,
            textAlign: "center",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <ShieldCheck size={40} color="#EF9A9A" style={{ margin: "0 auto 12px" }} />
          <h2 style={{ fontSize: 18, fontWeight: 600, color: COLORS.textPrimary, margin: 0 }}>
            Something went wrong
          </h2>
          <p style={{ marginTop: 6, fontSize: 14, color: COLORS.textSecondary }}>{error}</p>
          <button
            className="odp-primary-btn"
            onClick={() => navigate(-1)}
            style={{
              marginTop: 20,
              borderRadius: 10,
              border: "none",
              backgroundColor: COLORS.accentGreen,
              padding: "10px 18px",
              fontSize: 14,
              fontWeight: 600,
              color: COLORS.buttonText,
              cursor: "pointer",
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: COLORS.pageBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 16px",
        }}
      >
        <PageStyles />
        <div
          style={{
            maxWidth: 420,
            width: "100%",
            borderRadius: 16,
            border: `1px solid ${COLORS.divider}`,
            backgroundColor: COLORS.cardBg,
            padding: 32,
            textAlign: "center",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <Package size={40} color="#D1D5DB" style={{ margin: "0 auto 12px" }} />
          <h2 style={{ fontSize: 18, fontWeight: 600, color: COLORS.textPrimary, margin: 0 }}>
            Order not found
          </h2>
          <p style={{ marginTop: 6, fontSize: 14, color: COLORS.textSecondary }}>
            We couldn't find an order with this ID.
          </p>
        </div>
      </div>
    );
  }

  const items = order?.orderItems || [];

 const downloadInvoice = () => {
  try {
    const doc = new jsPDF();

    // ---------- Header ----------
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(0, 140, 70);
    doc.text("Mummoorthy Badminton Store", 14, 18);

    doc.setDrawColor(0, 140, 70);
    doc.line(14, 22, 196, 22);

    doc.setFontSize(10);
    doc.setTextColor(80);

    doc.text(`Invoice No : INV-${order.orderId}`, 14, 30);
    doc.text(`Order No : ${order.orderNumber}`, 14, 36);
    doc.text(`Date : ${formatDate(order.orderDate)}`, 14, 42);

    // ---------- Customer ----------
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Customer Details", 14, 55);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    doc.text(`Name : ${order.shippingAddress?.fullName || "-"}`, 14, 63);
    doc.text(`Email : ${order.customer?.email || "-"}`, 14, 70);
    doc.text(`Phone : ${order.shippingAddress?.phoneNumber || "-"}`, 14, 77);

    // ---------- Product Table ----------
    autoTable(doc, {
      startY: 88,
      head: [["Product", "Variant", "Qty", "Price", "Total"]],
      body: items.map((item) => [
        item.productName || "-",
         `${item.weight || ""} ${item.gripSize || ""}`,
        item.quantity,
        formatCurrency(item.price),
        formatCurrency(item.price * item.quantity),
      ]),
      headStyles: {
        fillColor: [0, 140, 70],
      },
      styles: {
        fontSize: 10,
      },
    });

    const finalY = doc.lastAutoTable.finalY + 10;

    // ---------- Summary ----------
    doc.setFontSize(11);

    doc.text("Subtotal", 135, finalY);
    doc.text(formatCurrency(order.totalAmount), 175, finalY);

    doc.text("Shipping", 135, finalY + 8);
    doc.text("FREE", 175, finalY + 8);

    doc.text("GST", 135, finalY + 16);
    doc.text("Included", 175, finalY + 16);

    doc.setDrawColor(180);
    doc.line(130, finalY + 20, 196, finalY + 20);

    doc.setFont("helvetica", "bold");

    doc.text("Grand Total", 135, finalY + 30);
    doc.text(formatCurrency(order.totalAmount), 175, finalY + 30);

    // ---------- Payment ----------
    doc.setFont("helvetica", "normal");

    doc.text(
      `Payment Method : Cash on Delivery`,
      14,
      finalY + 45
    );

    doc.text(
      `Order Status : ${order.status}`,
      14,
      finalY + 53
    );

    // ---------- Footer ----------
    doc.setDrawColor(0, 140, 70);
    doc.line(14, finalY + 62, 196, finalY + 62);

    doc.setFontSize(12);
    doc.setTextColor(0, 140, 70);
    doc.text(
      "Thank you for shopping with Mummoorthy Badminton Store!",
      14,
      finalY + 72
    );

    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text(
      "This is a computer-generated invoice and does not require a signature.",
      14,
      finalY + 80
    );

    doc.save(`Invoice-${order.orderNumber}.pdf`);
    toast.success("Invoice downloaded");
  } catch (err) {
    console.error(err);
    toast.error(err.message);
  }
};

const handleCancelOrder = async () => {

    const confirmCancel = window.confirm(
        "Are you sure you want to cancel this order?"
    );

    if (!confirmCancel) return;

    try {

        const updatedOrder = await cancelOrder(order.orderId);

        setOrder(updatedOrder);

        toast.success("Order cancelled successfully!");

    } catch (error) {

        console.error(error);

        toast.error("Failed to cancel order.");

    }
};

    return (
    <div style={{ minHeight: "100vh", backgroundColor: COLORS.pageBg }}>
      <PageStyles />
      <div
        style={{
          maxWidth: 1152,
          margin: "0 auto",
          padding: "32px 16px",
        }}
      >
        {/* Header */}
        <button
          className="odp-back-btn"
          onClick={() => navigate(-1)}
          style={{
            marginBottom: 20,
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontSize: 14,
            fontWeight: 500,
            color: COLORS.textSecondary,
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            transition: "color 0.2s ease",
          }}
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div
          style={{
            marginBottom: 24,
            display: "flex",
            flexWrap: "wrap",
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: COLORS.textPrimary,
                margin: 0,
              }}
            >
              Order Details
            </h1>
            <div
              style={{
                marginTop: 8,
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                columnGap: 24,
                rowGap: 4,
                fontSize: 14,
                color: COLORS.textSecondary,
              }}
            >
              <span>
                Order Number{" "}
                <span style={{ fontWeight: 600, color: COLORS.textPrimary }}>
                  {order?.orderNumber}
                </span>
              </span>
              <span>
                Placed On{" "}
                <span style={{ fontWeight: 600, color: COLORS.textPrimary }}>
                  {formatDate(order?.orderDate)}
                </span>
              </span>
            </div>
          </div>
          <StatusBadge status={order?.status} />
        </div>

        <div
          className="odp-two-col"
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: 24,
          }}
        >
          {/* Left column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24, minWidth: 0 }}>
            {/* Tracking timeline */}
            <SectionCard title="Order Tracking">
              <TrackingTimeline status={order?.status} />
            </SectionCard>

            {/* Products */}
            <SectionCard title="Ordered Products" extra={`(${items.length})`}>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {items.length > 0 ? (
                  items.map((item) => <ProductCard key={item?.id} item={item} navigate={navigate}   addToCart={addToCart}/>)
                ) : (
                  <p style={{ fontSize: 14, color: "#9CA3AF", margin: 0 }}>
                    No products found for this order.
                  </p>
                )}
              </div>
            </SectionCard>

            {/* Need help */}
            <SectionCard title="Need Help?">
              <div
                className="odp-help-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 12,
                }}
              >
                <button
                  className="odp-help-btn"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderRadius: 10,
                    border: `1px solid ${COLORS.border}`,
                    backgroundColor: "transparent",
                    padding: "12px 16px",
                    fontSize: 14,
                    fontWeight: 500,
                    color: COLORS.textPrimary,
                    cursor: "pointer",
                    transition: "border-color 0.2s ease, color 0.2s ease",
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <HelpCircle size={16} />
                    Contact Support
                  </span>
                  <ChevronRight size={16} color="#D1D5DB" />
                </button>
                <button
                  className="odp-help-btn"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderRadius: 10,
                    border: `1px solid ${COLORS.border}`,
                    backgroundColor: "transparent",
                    padding: "12px 16px",
                    fontSize: 14,
                    fontWeight: 500,
                    color: COLORS.textPrimary,
                    cursor: "pointer",
                    transition: "border-color 0.2s ease, color 0.2s ease",
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <RotateCcw size={16} />
                    Return Policy
                  </span>
                  <ChevronRight size={16} color="#D1D5DB" />
                </button>
                <button
                  className="odp-help-btn"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderRadius: 10,
                    border: `1px solid ${COLORS.border}`,
                    backgroundColor: "transparent",
                    padding: "12px 16px",
                    fontSize: 14,
                    fontWeight: 500,
                    color: COLORS.textPrimary,
                    cursor: "pointer",
                    transition: "border-color 0.2s ease, color 0.2s ease",
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <FileQuestion size={16} />
                    FAQs
                  </span>
                  <ChevronRight size={16} color="#D1D5DB" />
                </button>
              </div>
            </SectionCard>
          </div>

          {/* Right column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24, minWidth: 0 }}>
            {/* Customer info */}
            <SectionCard title="Customer Information">
              <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span
                    style={{
                      display: "flex",
                      height: 36,
                      width: 36,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "50%",
                      backgroundColor: "#E8F9EE",
                      color: COLORS.hoverGreen,
                      flexShrink: 0,
                    }}
                  >
                    <User size={16} />
                  </span>
                  <span style={{ fontWeight: 500, color: COLORS.textPrimary }}>
                    {order?.shippingAddress?.fullName || "N/A"}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span
                    style={{
                      display: "flex",
                      height: 36,
                      width: 36,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "50%",
                      backgroundColor: "#E8F9EE",
                      color: COLORS.hoverGreen,
                      flexShrink: 0,
                    }}
                  >
                    <Phone size={16} />
                  </span>
                  <span style={{ color: COLORS.textSecondary }}>
                    {order?.shippingAddress?.phoneNumber || "N/A"}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span
                    style={{
                      display: "flex",
                      height: 36,
                      width: 36,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "50%",
                      backgroundColor: "#E8F9EE",
                      color: COLORS.hoverGreen,
                      flexShrink: 0,
                    }}
                  >
                    <Mail size={16} />
                  </span>
                  <span style={{ color: COLORS.textSecondary, wordBreak: "break-all" }}>
                    {order?.customer?.email}
                  </span>
                </div>
              </div>
            </SectionCard>

          
          <SectionCard title="Shipping Address">
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

              <div style={{ display: "flex", gap: 12 }}>
                <MapPin size={18} color={COLORS.hoverGreen} />
                <div>

                  <div style={{ fontWeight: "600" }}>
                    {order?.shippingAddress?.fullName}
                  </div>

                  <div style={{ color: COLORS.textSecondary }}>
                    {order?.shippingAddress?.phoneNumber}
                  </div>

                  <div style={{ marginTop: 8 }}>
                    {order?.shippingAddress?.addressLine1}
                  </div>

                  {order?.shippingAddress?.addressLine2 && (
                    <div>
                      {order.shippingAddress.addressLine2}
                    </div>
                  )}

                  <div>
                    {order?.shippingAddress?.city},{" "}
                    {order?.shippingAddress?.state}
                  </div>

                  <div>
                    {order?.shippingAddress?.country} -{" "}
                    {order?.shippingAddress?.postalCode}
                  </div>

                </div>
              </div>

            </div>
          </SectionCard>



            {/* Order summary */}
            <SectionCard title="Order Summary">
              <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", color: COLORS.textSecondary }}>
                  <span>Subtotal</span>
                  <span>{formatCurrency(order?.totalAmount)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", color: COLORS.textSecondary }}>
                  <span>Delivery Charge</span>
                  <span style={{ fontWeight: 600, color: COLORS.hoverGreen }}>Free</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", color: COLORS.textSecondary }}>
                  <span>GST</span>
                  <span>Included</span>
                </div>
                <div
                  style={{
                    borderTop: `1px dashed ${COLORS.border}`,
                    paddingTop: 12,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: 15, fontWeight: 600, color: COLORS.textPrimary }}>
                    Total Amount
                  </span>
                  <span style={{ fontSize: 20, fontWeight: 700, color: COLORS.hoverGreen }}>
                    {formatCurrency(order?.totalAmount)}
                  </span>
                </div>
              </div>
            </SectionCard>

            <button
            onClick={downloadInvoice}
            style={{
                width: "100%",
                marginTop: "15px",
                padding: "12px",
                background: "#00C853",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "15px",
                transition: "0.3s"
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.background = "#00B248";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.background = "#00C853";
            }}
            >
            Download Invoice
            </button>


                {["PENDING", "CONFIRMED", "PLACED"].includes(order.status) && (

<button
    className="odp-cancel-btn"
    onClick={handleCancelOrder}
    style={{
        width: "100%",
        marginTop: "12px",
        padding: "12px",
        background: "transparent",
        color: "#DC2626",
        border: "1px solid #DC2626",
        borderRadius: "10px",
        cursor: "pointer",
        fontWeight: "600",
        fontSize: "15px",
        transition: "background-color 0.2s ease, color 0.2s ease",
    }}
>
    Cancel Order
</button>

)}


            {/* Payment info */}
            <SectionCard title="Payment Information">
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    borderRadius: 12,
                    backgroundColor: "#E8F9EE",
                    padding: "14px 16px",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      height: 36,
                      width: 36,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "50%",
                      backgroundColor: COLORS.cardBg,
                      color: COLORS.hoverGreen,
                      boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
                      flexShrink: 0,
                    }}
                  >
                    <CreditCard size={16} />
                  </span>
                  <div>
                    <p style={{ fontSize: 12, color: COLORS.textSecondary, margin: 0 }}>
                      Payment Method
                    </p>
                    <p style={{ fontSize: 14, fontWeight: 600, color: COLORS.textPrimary, margin: "2px 0 0 0" }}>
                      Cash on Delivery
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 4px", fontSize: 14 }}>
                  <span style={{ color: COLORS.textSecondary }}>Payment Status</span>
                  <span
                    style={{
                      fontWeight: 600,
                      color: order?.status === "CANCELLED" ? "#DC2626" : "#16A34A",
                    }}
                  >
                    {order?.status === "CANCELLED" ? "Refunded" : "Pending (COD)"}
                  </span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 4px", fontSize: 14 }}>
                  <span style={{ color: COLORS.textSecondary }}>Order Status</span>
                  <span style={{ fontWeight: 600, color: COLORS.textPrimary }}>
                    {STATUS_LABELS[order?.status] || order?.status}
                  </span>
                </div>
              </div>
            </SectionCard>
          </div>
        </div>
      </div>

      {/* Responsive: stack columns on smaller screens */}
      <style>{`
        @media (max-width: 900px) {
          .odp-two-col { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {

                .odp-help-grid{
                    grid-template-columns:1fr !important;
                }

                .odp-product-card{
                    flex-direction:column !important;
                    align-items:center;
                    text-align:center;
                }

                .odp-product-card > div:first-child{
                    margin:0 auto;
                }

                .odp-product-card button{
                    width:100%;
                }

                .odp-product-card .button-group{
                    width:100%;
                    display:flex;
                    flex-direction:column;
                    gap:10px;
                }
            }

      `}</style>
    </div>
  );
}
